/* =========================================================================
   sakura-lite —— 唯一的脚本文件
   原主题栈是 709 行的 extend_footer.html：6 个功能块各自绑 DOMContentLoaded，初始化
   时机互相咬合，改一处崩一片。现在只有一个入口、一段初始化，每个模块 try 包住。
   模块：1 主题切换 / 2 导航 / 3 樱花 / 4 看板娘 / 5 回顶 / 6 本地搜索
   ========================================================================= */
(function () {
  'use strict';

  var doc = document;
  var root = doc.documentElement;
  var mq = window.matchMedia ? window.matchMedia('(prefers-color-scheme: dark)') : null;
  var reduce = window.matchMedia
    ? window.matchMedia('(prefers-reduced-motion: reduce)').matches : false;
  var $ = function (id) { return doc.getElementById(id); };

  /* ---------- 1. 主题切换（默认跟随系统，手动切过才持久化） ---------- */
  function currentTheme() {
    var saved = null;
    try { saved = localStorage.getItem('theme'); } catch (e) {}
    if (saved === 'dark' || saved === 'light') return saved;
    return mq && mq.matches ? 'dark' : 'light';
  }
  /* iframe 里的 giscus 不读本页 CSS，只能 postMessage 让它换配色。只发一次不够：
     giscus 是 async 加载的，刚打开页面时 iframe 还不存在，那时发消息等于石沉大海。
     所以切换时发 + 出现后补发，并按「最后一次想要的配色」去重，避免重复刷。 */
  var giscusTheme = null;
  function syncGiscus(t, force) {
    if (!force && t === giscusTheme) return;
    giscusTheme = t;
    var f = doc.querySelector('iframe.giscus-frame');
    if (!f || !f.contentWindow) return;
    f.contentWindow.postMessage(
      { giscus: { setConfig: { theme: t === 'dark' ? 'dark_dimmed' : 'light' } } },
      'https://giscus.app'
    );
  }
  function applyTheme(t) {
    root.setAttribute('data-theme', t);
    syncGiscus(t);
  }
  try {
    var btn = $('theme-toggle');
    if (btn) btn.addEventListener('click', function () {
      var next = currentTheme() === 'dark' ? 'light' : 'dark';
      try { localStorage.setItem('theme', next); } catch (e) {}
      applyTheme(next);
    });
    /* iframe 由 giscus 的 async 脚本后插入，出现时机不确定，直接轮询等它（比监听
       load 稳）。没等到也无所谓，用户切主题时那次照样会发。上限 20×250ms。 */
    var tries = 0, wait = window.setInterval(function () {
      if (doc.querySelector('iframe.giscus-frame')) {
        window.clearInterval(wait);
        syncGiscus(currentTheme(), true);
      } else if (++tries > 20) {
        window.clearInterval(wait);
      }
    }, 250);
    if (mq && mq.addEventListener) {
      /* 没手动设过偏好时，系统切深浅色要实时跟上 */
      mq.addEventListener('change', function (e) {
        var saved = null;
        try { saved = localStorage.getItem('theme'); } catch (er) {}
        if (!saved) applyTheme(e.matches ? 'dark' : 'light');
      });
    }
  } catch (e) {}

  /* ---------- 2. 导航：滚过 hero 变实底 + 窄屏汉堡面板 ---------- */
  try {
    var nav = $('nav');
    if (nav) {
      var solid = false;
      var onScroll = function () {
        /* 阈值 = 一个屏高的 70%：hero 快退出视野时切换，和视觉节奏对得上 */
        var want = window.scrollY > window.innerHeight * 0.7;
        if (want !== solid) { solid = want; nav.classList.toggle('is-solid', want); }
      };
      /* passive: 这个监听器只读不写滚动位置，不该阻塞合成线程 */
      window.addEventListener('scroll', onScroll, { passive: true });
      onScroll();
    }
    var burger = $('nav-burger'), links = $('nav-links');
    if (burger && nav && links) {
      var setOpen = function (open) {
        doc.body.classList.toggle('nav-open', open);
        burger.setAttribute('aria-expanded', open ? 'true' : 'false');
      };
      burger.addEventListener('click', function () {
        setOpen(!doc.body.classList.contains('nav-open'));
      });
      /* 点了菜单项、或点了面板外，就收起，别让面板挂在那儿挡内容 */
      links.addEventListener('click', function () { setOpen(false); });
      doc.addEventListener('click', function (e) {
        if (doc.body.classList.contains('nav-open') && !nav.contains(e.target)) setOpen(false);
      });
    }
  } catch (e) {}

  /* ---------- 3. 樱花飘落（canvas，reduced-motion 时不启动） ---------- */
  try {
    var cv = $('sakura');
    if (cv && cv.getContext && !reduce) {
      var ctx = cv.getContext('2d'), petals = [], W = 0, H = 0, dpr = 1, raf = 0;

      var make = function (y) {
        var s = 0.5 + Math.random() * 0.9;   /* 大小即「远近」，同时决定下落速度 */
        return { x: Math.random() * W, y: y, s: s,
          vy: (0.22 + s * 0.5) * dpr, vx: (Math.random() - 0.5) * 0.35 * dpr,
          rot: Math.random() * 6.283, vr: (Math.random() - 0.5) * 0.02,
          ph: Math.random() * 6.283, a: 0.28 + s * 0.34 };
      };
      var resize = function () {
        dpr = Math.min(2, window.devicePixelRatio || 1);
        W = cv.width = Math.floor(window.innerWidth * dpr);
        H = cv.height = Math.floor(window.innerHeight * dpr);
        cv.style.width = window.innerWidth + 'px'; cv.style.height = window.innerHeight + 'px';
        /* 数量按宽度算但封顶 34：再多就从「细雪」变成噪点 */
        var n = Math.min(34, Math.round(window.innerWidth / 46));
        petals = [];
        for (var i = 0; i < n; i++) petals.push(make(Math.random() * H));
      };
      var frame = function () {
        ctx.clearRect(0, 0, W, H);
        for (var i = 0; i < petals.length; i++) {
          var p = petals[i];
          p.ph += 0.012;
          /* 正弦横摆 = 风场，这是「飘」和「掉」的区别 */
          p.x += p.vx * dpr + Math.sin(p.ph) * 0.5 * dpr;
          p.y += p.vy;
          p.rot += p.vr;
          if (p.y - 20 > H) { petals[i] = make(-20 * dpr); continue; }
          if (p.x < -30 * dpr) p.x = W + 20 * dpr; else if (p.x > W + 30 * dpr) p.x = -20 * dpr;

          ctx.save();
          ctx.translate(p.x, p.y); ctx.rotate(p.rot); ctx.globalAlpha = p.a;
          /* 花瓣就是一个椭圆：比画 5 瓣樱花便宜 5 倍，缩到这个尺寸看不出差别 */
          ctx.beginPath();
          ctx.ellipse(0, 0, 5.4 * p.s * dpr, 3.1 * p.s * dpr, 0, 0, 6.283);
          ctx.fillStyle = '#f9b8ce'; ctx.fill(); ctx.restore();
        }
        raf = window.requestAnimationFrame(frame);
      };

      resize();
      window.addEventListener('resize', resize, { passive: true });
      /* 切到后台就停：省电，回来接着跑 */
      doc.addEventListener('visibilitychange', function () {
        if (doc.hidden) { window.cancelAnimationFrame(raf); raf = 0; } else if (!raf) frame();
      });
      frame();
    }
  } catch (e) {}

  /* ---------- 4. 看板娘：点一下冒句台词 ---------- */
  try {
    var girl = $('girl') || $('girl-wrap'), bubble = $('girl-bubble');
    if (girl && bubble) {
      var talks = ['今天也要写代码呀～', 'C 语言作业交了没？', '记得 git push！',
        '有问题就在文章下面留言～', '摸鱼一时爽，一直摸鱼一直爽'], ti = 0, bt = null;
      girl.style.cursor = 'pointer';
      girl.addEventListener('click', function () {
        bubble.textContent = talks[ti % talks.length];
        ti++; bubble.classList.add('show');
        window.clearTimeout(bt);
        bt = window.setTimeout(function () { bubble.classList.remove('show'); }, 3200);
      });
    }
  } catch (e) {}

  /* ---------- 5. 回顶 ---------- */
  try {
    var top = $('to-top');
    if (top) {
      top.addEventListener('click', function () {
        window.scrollTo({ top: 0, behavior: reduce ? 'auto' : 'smooth' });
      });
      var shown = false;
      window.addEventListener('scroll', function () {
        var want = window.scrollY > 400;
        if (want !== shown) { shown = want; top.hidden = !want; }
      }, { passive: true });
    }
  } catch (e) {}

  /* ---------- 6. 本地搜索 ---------- */
  try {
    var input = $('search-input'), results = $('search-results'), status = $('search-status'),
        fallback = $('search-fallback');
    if (input && results && status) {
      /* 索引走 /index.json（主题的 home.json.json 生成），不内联：内联得把 jsonify
         写在 define "main" 之前，而 Hugo 0.166 的 block 模板只要 define 之前有任何
         内容就静默失效。取不到索引就露出 fallback。 */
      var idxURL = (window.__SAKURA && window.__SAKURA.searchIndex) || '/index.json';
      var ESC = { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' };
      var esc = function (s) { return String(s).replace(/[&<>"]/g, function (c) { return ESC[c]; }); };
      /* 先转义再插 <mark>，否则摘要里的 <> 会破坏结构（也是 XSS 面） */
      var mark = function (text, q) {
        var i = (text || '').toLowerCase().indexOf(q);
        if (i < 0) return esc(text || '');
        return esc(text.slice(0, i)) + '<mark>' + esc(text.slice(i, i + q.length)) +
          '</mark>' + esc(text.slice(i + q.length));
      };
      var card = function (d, q) {
        return '<article class="card"><div class="card-text">' +
          '<p class="card-meta"><time>' + esc(d.date) + '</time></p>' +
          '<h2 class="card-title"><a href="' + esc(d.url) + '">' + mark(d.title, q) + '</a></h2>' +
          (d.tags ? '<p class="card-tags">' + d.tags.split(' ').filter(Boolean).map(function (t) {
            return '<span class="tag-chip">' + esc(t) + '</span>';
          }).join('') + '</p>' : '') +
          '<p class="card-excerpt">' + mark(d.summary, q) + '</p></div></article>';
      };

      var index = [], timer = null, render = function (q) {
        q = (q || '').trim().toLowerCase();
        if (!q) { results.innerHTML = ''; status.textContent = ''; return; }
        var hits = index.filter(function (r) { return r.hay.indexOf(q) >= 0; }).slice(0, 20);
        status.textContent = hits.length
          ? '找到 ' + hits.length + ' 篇' : '没有匹配的文章，换个词试试？';
        results.innerHTML = hits.map(function (h) { return card(h.d, q); }).join('');
      };
      input.addEventListener('input', function () {
        /* 去抖 120ms：中文输入法每敲一个候选字都触发 input，不防抖会闪 */
        window.clearTimeout(timer);
        var v = input.value;
        timer = window.setTimeout(function () { render(v); }, 120);
      });

      fetch(idxURL).then(function (r) {
        if (!r.ok) throw new Error('http ' + r.status); return r.json();
      }).then(function (data) {
        if (!data || !data.length) throw new Error('empty');
        /* 每条预先拼一个小写长串做检索：中文没有词边界，substring 匹配最省事，
           不需要分词器（几十条记录，单次过滤 < 1ms）。 */
        index = data.map(function (d) {
          return {
            d: d,
            hay: (d.title + ' ' + d.tags + ' ' + d.cats + ' ' + d.summary + ' ' + d.content).toLowerCase()
          };
        });
        /* 支持 /search/?q=关键词 直接出结果（列表页顶上的表单就是这么跳的） */
        var q0 = new URLSearchParams(window.location.search).get('q');
        if (q0) { input.value = q0; render(q0); } else { input.focus(); }
      }).catch(function () { if (fallback) fallback.hidden = false; });
    }
  } catch (e) {
    var fb = $('search-fallback');
    if (fb) fb.hidden = false;
  }
})();
