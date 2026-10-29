/* HCDT Toolkit — shared UI layer
   - one top bar on every tool (links between tools + EN/KO switch)
   - one set of colors, type and control styles
   - one language setting shared by all tools (English first)
   Usage: <script src="hcdt-ui.js" data-tool="logo|motion|card|poster|letter|home"></script>
   placed as the LAST script of the page. */
(function () {
  'use strict';
  var me = document.currentScript;
  var TOOL = (me && me.getAttribute('data-tool')) || 'home';
  /* auxiliary colour: random per load (same four as the guideline page); a framing page overrides it */
  try { var AUXC = ['#64D8D8', '#E8B9AA', '#73D888', '#E8E041']; document.documentElement.style.setProperty('--hx-ui', AUXC[Math.floor(Math.random() * 4)]); } catch (e) {}
  var BASE = (me && me.src) ? me.src.replace(/[^/]*$/, '') : '';
  var KEY = 'hcdt-lang';

  /* ---------- where each tool lives ---------- */
  var ON_PAGES = /\.github\.io$/.test(location.hostname);
  var PAGES = 'https://aghartakr-glitch.github.io/';
  var TOOLS = [
    { id: 'home',   file: 'index.html',  repo: 'HCDT_Toolkit/',         en: 'Overview',      ko: '전체' },
    { id: 'card',   file: 'card.html',   repo: 'HCDT_Namecard_Generator/', en: 'Name Card',   ko: '명함' },
    { id: 'letter', file: 'letter.html', repo: 'HCPD_Paper_Generator/',    en: 'Letter',      ko: '문서 서식' },
    { id: 'slides', file: 'slides.html', repo: 'HCDT_PPT_Generator/',      en: 'Slides',      ko: 'PPT' },
    { id: 'poster', file: 'poster.html', repo: 'HCDT_Poster_Generator/',   en: 'Poster',      ko: '포스터' },
    { id: 'motion', file: 'motion.html', repo: 'HCDT_Toolkit/motion.html', en: 'Logo Motion', ko: '로고 모션' }
  ];
  function href(t) { return ON_PAGES ? PAGES + t.repo : t.file; }

  /* ---------- language ---------- */
  function readLang() {
    var q = /[?&]lang=(en|ko)\b/.exec(location.search);
    if (q) return q[1];
    try { var v = localStorage.getItem(KEY); if (v === 'en' || v === 'ko') return v; } catch (e) {}
    return 'en';
  }
  var LANG = readLang();

  /* ---------- styles: hcdt-ui.css (linked in each page head; added here if a page forgot it) ---------- */
  if (!document.querySelector('link[href*="hcdt-ui.css"]')) {
    var lk = document.createElement('link'); lk.rel = 'stylesheet'; lk.href = BASE + 'hcdt-ui.css'; document.head.appendChild(lk);
  }

  /* ---------- top bar ---------- */
  var MARK = '<svg viewBox="0.00 0.00 132.73 132.73" aria-hidden="true"><path fill="#6B00FF" d="M9.29 69.41L0 71.46L0 61.24L9.29 63.28L9.29 69.41M18.87 59.24L10.69 61.28L10.69 51.06L18.87 53.1L18.87 59.24M28.91 69.41L20.73 71.46L20.73 61.24L28.91 63.28L28.91 69.41M37.16 59.38L30.62 61.42L30.62 51.21L37.16 53.25L37.16 59.38M46.45 69.41L39.91 71.46L39.91 61.24L46.45 63.28L46.45 69.41M54.3 60.05L49.07 62.09L49.07 51.88L54.3 53.92L54.3 60.05M63.52 69.41L58.29 71.46L58.29 61.24L63.52 63.28L63.52 69.41M72.1 59.6L67.91 61.64L67.91 51.42L72.1 53.47L72.1 59.6M80.45 69.41L76.26 71.46L76.26 61.24L80.45 63.28L80.45 69.41M89.35 59.15L86 61.2L86 50.98L89.35 53.02L89.35 59.15M97.5 69.41L94.15 71.46L94.15 61.24L97.5 63.28L97.5 69.41M106.54 59.24L103.86 61.28L103.86 51.06L106.54 53.11L106.54 59.24M114.93 69.41L112.25 71.46L112.25 61.24L114.93 63.28L114.93 69.41M122.6 61.01L120.45 63.05L120.45 52.83L122.6 54.88L122.6 61.01M132.73 69.41L131.02 71.46L131.02 61.24L132.73 63.28L132.73 69.41M8.46 48.98L0.28 51.02L0.28 40.81L8.46 42.85L8.46 48.98M17.63 38.78L11.09 40.82L11.09 30.6L17.63 32.65L17.63 38.78M27.48 49.02L20.94 51.06L20.94 40.84L27.48 42.89L27.48 49.02M36.27 38.79L31.03 40.84L31.03 30.62L36.27 32.66L36.27 38.79M45.6 49.32L40.36 51.36L40.36 41.14L45.6 43.18L45.6 49.32M54.13 39.27L49.94 41.31L49.94 31.09L54.13 33.13L54.13 39.27M62.27 50.69L58.09 52.74L58.09 42.52L62.27 44.56L62.27 50.69M70.34 41.33L66.99 43.38L66.99 33.16L70.34 35.2L70.34 41.33M80.78 49.77L77.43 51.81L77.43 41.59L80.78 43.64L80.78 49.77M89.56 39.92L86.88 41.97L86.88 31.75L89.56 33.79L89.56 39.92M98.34 48.89L95.66 50.93L95.66 40.72L98.34 42.76L98.34 48.89M107.39 38.63L105.24 40.67L105.24 30.46L107.39 32.5L107.39 38.63M115.65 49.04L113.51 51.08L113.51 40.86L115.65 42.91L115.65 49.04M124.8 38.84L123.08 40.88L123.08 30.66L124.8 32.71L124.8 38.84M130.31 52.6L128.6 54.65L128.6 44.43L130.31 46.47L130.31 52.6M6.82 28.62L0.28 30.66L0.28 20.44L6.82 22.49L6.82 28.62M17.08 18.4L11.85 20.44L11.85 10.23L17.08 12.27L17.08 18.4M26.97 28.58L21.74 30.62L21.74 20.4L26.97 22.45L26.97 28.58M36.44 18.38L32.25 20.42L32.25 10.2L36.44 12.24L36.44 18.38M45.16 28.59L40.97 30.63L40.97 20.41L45.16 22.46L45.16 28.59M54.16 18.37L50.81 20.42L50.81 10.2L54.16 12.24L54.16 18.37M62.78 29.22L59.43 31.26L59.43 21.04L62.78 23.09L62.78 29.22M71.52 19.17L68.84 21.21L68.84 10.99L71.52 13.03L71.52 19.17M78.5 31.98L75.82 34.02L75.82 23.8L78.5 25.85L78.5 31.98M86.73 22.62L84.59 24.67L84.59 14.45L86.73 16.49L86.73 22.62M95.01 13.29L93.3 15.34L93.3 5.12L95.01 7.16L95.01 13.29M98.39 30.09L96.24 32.14L96.24 21.92L98.39 23.96L98.39 30.09M107.27 20.24L105.55 22.29L105.55 12.07L107.27 14.11L107.27 20.24M5.52 8.17L0.28 10.22L0.28 0L5.52 2.04L5.52 8.17M27.46 8.17L23.27 10.22L23.27 0L27.46 2.04L27.46 8.17M46.01 8.17L42.66 10.22L42.66 0L46.01 2.04L46.01 8.17M63.24 8.17L60.56 10.22L60.56 0L63.24 2.04L63.24 8.17M80.32 9.12L78.18 11.16L78.18 0.94L80.32 2.99L80.32 9.12M116.5 28.37L114.78 30.41L114.78 20.19L116.5 22.24L116.5 28.37M18.87 73.5L10.69 71.45L10.69 81.67L18.87 79.63L18.87 73.5M37.16 73.35L30.62 71.31L30.62 81.53L37.16 79.48L37.16 73.35M54.3 72.68L49.07 70.64L49.07 80.86L54.3 78.82L54.3 72.68M72.1 73.14L67.91 71.09L67.91 81.31L72.1 79.27L72.1 73.14M89.35 73.58L86 71.54L86 81.76L89.35 79.71L89.35 73.58M106.54 73.5L103.86 71.45L103.86 81.67L106.54 79.63L106.54 73.5M122.6 71.73L120.45 69.68L120.45 79.9L122.6 77.86L122.6 71.73M8.46 83.75L0.28 81.71L0.28 91.93L8.46 89.89L8.46 83.75M17.63 93.96L11.09 91.91L11.09 102.13L17.63 100.09L17.63 93.96M27.48 83.72L20.94 81.67L20.94 91.89L27.48 89.85L27.48 83.72M36.27 93.94L31.03 91.9L31.03 102.11L36.27 100.07L36.27 93.94M45.6 83.42L40.36 81.38L40.36 91.59L45.6 89.55L45.6 83.42M54.13 93.47L49.94 91.43L49.94 101.64L54.13 99.6L54.13 93.47M62.27 82.04L58.09 80L58.09 90.21L62.27 88.17L62.27 82.04M70.34 91.4L66.99 89.36L66.99 99.58L70.34 97.53L70.34 91.4M80.78 82.97L77.43 80.92L77.43 91.14L80.78 89.1L80.78 82.97M89.56 92.81L86.88 90.77L86.88 100.99L89.56 98.94L89.56 92.81M98.34 83.84L95.66 81.8L95.66 92.02L98.34 89.97L98.34 83.84M107.39 94.11L105.24 92.06L105.24 102.28L107.39 100.24L107.39 94.11M115.65 83.7L113.51 81.65L113.51 91.87L115.65 89.83L115.65 83.7M124.8 93.9L123.08 91.85L123.08 102.07L124.8 100.03L124.8 93.9M130.31 80.13L128.6 78.09L128.6 88.31L130.31 86.26L130.31 80.13M6.82 104.12L0.28 102.07L0.28 112.29L6.82 110.25L6.82 104.12M17.08 114.33L11.85 112.29L11.85 122.51L17.08 120.46L17.08 114.33M26.97 104.16L21.74 102.11L21.74 112.33L26.97 110.29L26.97 104.16M36.44 114.36L32.25 112.31L32.25 122.53L36.44 120.49L36.44 114.36M45.16 104.15L40.97 102.1L40.97 112.32L45.16 110.28L45.16 104.15M54.16 114.36L50.81 112.32L50.81 122.53L54.16 120.49L54.16 114.36M62.78 103.52L59.43 101.47L59.43 111.69L62.78 109.65L62.78 103.52M71.52 113.57L68.84 111.53L68.84 121.74L71.52 119.7L71.52 113.57M78.5 100.76L75.82 98.71L75.82 108.93L78.5 106.89L78.5 100.76M86.73 110.11L84.59 108.07L84.59 118.29L86.73 116.24L86.73 110.11M95.01 119.44L93.3 117.4L93.3 127.62L95.01 125.57L95.01 119.44M98.39 102.64L96.24 100.6L96.24 110.82L98.39 108.77L98.39 102.64M107.27 112.49L105.55 110.45L105.55 120.66L107.27 118.62L107.27 112.49M5.52 124.56L0.28 122.52L0.28 132.73L5.52 130.69L5.52 124.56M27.46 124.56L23.27 122.52L23.27 132.73L27.46 130.69L27.46 124.56M46.01 124.56L42.66 122.52L42.66 132.73L46.01 130.69L46.01 124.56M63.24 124.56L60.56 122.52L60.56 132.73L63.24 130.69L63.24 124.56M80.32 123.62L78.18 121.57L78.18 131.79L80.32 129.75L80.32 123.62M116.5 104.37L114.78 102.32L114.78 112.54L116.5 110.5L116.5 104.37"/></svg>';
  function bar() {
    var b = document.createElement('div');
    b.className = 'hx-bar';
    b.setAttribute('data-hx', '');
    var h = '<nav class="hx-nav" aria-label="Tools">';
    TOOLS.forEach(function (t) {
      h += '<a class="hx-t" href="' + href(t) + '" data-en="' + t.en + '" data-ko="' + t.ko + '"' + (t.id === TOOL ? ' aria-current="page"' : '') + '></a>';
    });
    h += '</nav>';
    b.innerHTML = h;
    /* inside the Visual Guideline page (iframe) the guideline page has the tool tabs, so hide this bar */
    var framed = false; try { framed = window.self !== window.top; } catch (e) { framed = true; }
    if (framed || /[?&]embed=1\b/.test(location.search)) { b.style.display = 'none'; }
    if (framed) { frameLink(); }
    document.body.insertBefore(b, document.body.firstChild);
    return b;
  }


  /* ---------- inside the Visual Guideline iframe: report height, receive the page's auxiliary colour ---------- */
  function frameLink() {
    var app = (TOOL === 'poster' || TOOL === 'slides'), last = -1;
    function post() {
      var h = app ? 0 : Math.ceil(Math.max(document.body.scrollHeight, document.documentElement.getBoundingClientRect().height));
      if (h === last) return; last = h;
      try { parent.postMessage({ hcdtFrame: 1, tool: TOOL, app: app, h: h }, '*'); } catch (e) {}
    }
    window.addEventListener('message', function (e) {
      var d = e.data;
      if (d && d.hcdtAux && /^#[0-9a-f]{6}$/i.test(d.hcdtAux)) document.documentElement.style.setProperty('--hx-ui', d.hcdtAux);
      if (d && typeof d.hcdtWide === 'boolean') { document.documentElement.classList.toggle('hx-wide', d.hcdtWide); window.dispatchEvent(new Event('resize')); }
    });
    window.addEventListener('load', post); window.addEventListener('resize', post);
    if (window.ResizeObserver) new ResizeObserver(post).observe(document.body);
    setInterval(function () { last = -1; post(); }, 1500);
    post();
  }

  /* ---------- actions bar: export menu + grid toggle (shared by every tool) ---------- */
  function wireActions() {
    document.addEventListener('click', function (e) {
      var tr = e.target.closest && e.target.closest('[data-hx-menu]');
      [].slice.call(document.querySelectorAll('.hx-menu')).forEach(function (m) {
        var pop = m.querySelector('.hx-menu-pop'), btn = m.querySelector('[data-hx-menu]');
        if (!pop || !btn) return;
        if (tr === btn) { pop.hidden = !pop.hidden; btn.setAttribute('aria-expanded', String(!pop.hidden)); }
        else if (!pop.hidden && !(e.target.closest && e.target.closest('.chk'))) { pop.hidden = true; btn.setAttribute('aria-expanded', 'false'); }
      });
    });
    document.addEventListener('keydown', function (e) {
      if (e.key !== 'Escape') return;
      [].slice.call(document.querySelectorAll('.hx-menu-pop')).forEach(function (p) { p.hidden = true; var b = p.parentNode.querySelector('[data-hx-menu]'); if (b) b.setAttribute('aria-expanded', 'false'); });
    });
    [].slice.call(document.querySelectorAll('[data-hx-grid]')).forEach(function (b) {
      var cb = document.querySelector(b.getAttribute('data-hx-grid')); if (!cb) return;
      function sync() { b.setAttribute('aria-pressed', String(cb.checked)); }
      b.addEventListener('click', function () { cb.click(); });
      cb.addEventListener('change', sync); window.addEventListener('load', function () { setTimeout(sync, 0); }); sync();
    });
  }
  wireActions();

  /* ---------- text replacement for tools written in one language ---------- */
  function Translator(src, dict, rules, skip) {
    var orig = new WeakMap(), origAttr = new WeakMap(), writing = false, cur = src;
    var ATTRS = ['title', 'placeholder', 'aria-label'];
    function tr(s) {
      var m = /^(\s*)([\s\S]*?)(\s*)$/.exec(s), core = m[2];
      if (!core) return s;
      if (Object.prototype.hasOwnProperty.call(dict, core)) return m[1] + dict[core] + m[3];
      for (var i = 0; i < rules.length; i++) {
        var r = rules[i], mm = r[0].exec(core);
        if (mm) return m[1] + r[1].apply(null, mm.concat([tr])) + m[3];
      }
      return s;
    }
    function skipped(n) {
      var el = n.nodeType === 1 ? n : n.parentElement;
      return !el || !!el.closest('script,style,[data-hx],' + skip);
    }
    function doText(n) {
      if (skipped(n)) return;
      var o = orig.get(n);
      if (o === undefined || (n.nodeValue !== o.out)) { o = { src: n.nodeValue }; orig.set(n, o); }
      var want = cur === src ? o.src : tr(o.src);
      o.out = want;
      if (n.nodeValue !== want) n.nodeValue = want;
    }
    function doAttrs(el) {
      if (skipped(el)) return;
      var rec = origAttr.get(el) || {};
      ATTRS.forEach(function (a) {
        if (!el.hasAttribute(a)) return;
        var v = el.getAttribute(a), o = rec[a];
        if (!o || v !== o.out) { o = rec[a] = { src: v }; }
        var want = cur === src ? o.src : tr(o.src);
        o.out = want;
        if (v !== want) el.setAttribute(a, want);
      });
      origAttr.set(el, rec);
    }
    function walk(root) {
      if (root.nodeType === 3) { doText(root); return; }
      if (root.nodeType !== 1 && root.nodeType !== 11) return;
      if (root.nodeType === 1) { if (skipped(root)) return; doAttrs(root); }
      var w = document.createTreeWalker(root, NodeFilter.SHOW_TEXT | NodeFilter.SHOW_ELEMENT, {
        acceptNode: function (n) { return skipped(n) ? NodeFilter.FILTER_REJECT : NodeFilter.FILTER_ACCEPT; }
      });
      var n;
      while ((n = w.nextNode())) { if (n.nodeType === 3) doText(n); else doAttrs(n); }
    }
    function run(f) { writing = true; try { f(); } finally { mo.takeRecords(); writing = false; } }
    var mo = new MutationObserver(function (list) {
      if (writing) return;
      run(function () {
        list.forEach(function (m) {
          if (m.type === 'childList') m.addedNodes.forEach(walk);
          else if (m.type === 'characterData') doText(m.target);
          else if (m.type === 'attributes') doAttrs(m.target);
        });
      });
    });
    mo.observe(document.body, { subtree: true, childList: true, characterData: true, attributes: true, attributeFilter: ATTRS });
    return {
      apply: function (l) { cur = l; run(function () { walk(document.body); }); }
    };
  }

  /* ---------- per-tool adapters ---------- */
  function click(sel) { var e = document.querySelector(sel); if (e) e.click(); }
  var ADAPT = {
    logo: function (l) { click('#lang [data-l="' + l + '"]'); },
    card: function (l) { click(l === 'ko' ? '#lko' : '#len'); },
    letter: function (l) { click(l === 'ko' ? '#lko' : '#len'); }
  };
  var translator = null, TITLES = null;
  if (TOOL === 'poster' && window.HX_DICT_POSTER) {
    translator = Translator('en', window.HX_DICT_POSTER.dict, window.HX_DICT_POSTER.rules, '.poster,#stage,svg');
    TITLES = { en: 'HCDT Poster', ko: 'HCDT 포스터' };
  }


  /* ---------- how-to strip: the same three steps on every tool ---------- */
  var STEPS = {
    logo: [
      ['Choose logos', '로고 고르기', 'Filter by type and auxiliary color.', '종류와 보조색으로 목록을 좁힘.'],
      ['Set the file', '파일 설정', 'Format, PNG width, clear space, background.', '형식, PNG 너비, 보호 여백, 배경.'],
      ['Download', '다운로드', 'One logo from its card, or everything shown as a ZIP.', '카드에서 하나씩, 또는 보이는 전체를 ZIP으로.']],
    motion: [
      ['Pick the logo', '로고 고르기', 'Version and color, as approved in the guide.', '가이드에서 승인된 버전과 색.'],
      ['Set the motion', '움직임 설정', 'Entry order and playback speed.', '등장 순서와 재생 속도.'],
      ['Export', '내보내기', 'Export a WebM video, or PNG / SVG of the final frame.', 'WebM 영상, 또는 마지막 프레임을 PNG / SVG로 저장.']],
    card: [
      ['Front', '앞면', 'Accent color, version and design.', '포인트색, 버전, 디자인 선택.'],
      ['Back', '뒷면', 'Your name, title and contacts; then design and colors.', '이름, 직책, 연락처 입력 후 디자인과 색.'],
      ['Export', '내보내기', 'PDF with both sides, or each side as SVG.', '앞뒤 2쪽 PDF, 또는 면별 SVG.']],
    poster: [
      ['Start', '시작', 'Pick a template and a color combination on the left.', '왼쪽에서 템플릿과 배색 선택.'],
      ['Edit', '편집', 'Click a block to move or resize it; double-click text to type.', '블록을 눌러 옮기고 크기 조절, 글은 두 번 눌러 입력.'],
      ['Export', '내보내기', 'PDF or PNG at the top right.', '오른쪽 위에서 PDF 또는 PNG.']],
    letter: [
      ['Addresses', '주소', 'Fill in To and From. Empty contact rows are not printed.', '받는 사람, 보내는 사람 입력. 빈 연락처 줄은 인쇄 안 됨.'],
      ['Letter', '본문', 'Write the body and closing; add a signature image.', '본문과 맺음말 작성, 서명 이미지 추가.'],
      ['Save', '저장', 'Check the pages on the right, then save the PDF.', '오른쪽 미리보기 확인 후 PDF 저장.']],
    slides: [
      ['Layouts', '레이아웃', 'Add slides and choose a layout for each one.', '슬라이드를 추가하고 각각 레이아웃 선택.'],
      ['Edit', '편집', 'Click a block to move or resize it; double-click text to type.', '블록을 눌러 옮기고 크기 조절, 글은 두 번 눌러 입력.'],
      ['Export', '내보내기', 'PowerPoint, PDF or PNG from Export; Present to preview.', '내보내기에서 PowerPoint·PDF·PNG, 발표로 미리보기.']]
  };
  var stepsEl = null;
  function buildSteps() {
    var list = STEPS[TOOL];
    if (!list) return;
    var anchor = (TOOL === 'poster' || TOOL === 'slides') ? document.querySelector('header.top') : document.querySelector('.wrap > header');
    if (!anchor) return;
    stepsEl = document.createElement('ol');
    stepsEl.className = 'hx-steps';
    stepsEl.setAttribute('data-hx', '');
    list.forEach(function (st, i) {
      var li = document.createElement('li');
      li.innerHTML = '<span class="hx-n">' + (i + 1) + '</span><span class="hx-s"><b></b><span></span></span>';
      stepsEl.appendChild(li);
    });
    anchor.parentNode.insertBefore(stepsEl, anchor.nextSibling);
  }
  function langSteps(l) {
    if (!stepsEl) return;
    var k = l === 'ko' ? 1 : 0;
    STEPS[TOOL].forEach(function (st, i) {
      var li = stepsEl.children[i];
      li.querySelector('b').textContent = st[k];
      li.querySelector('.hx-s>span').textContent = st[2 + k];
    });
    stepsEl.setAttribute('aria-label', l === 'ko' ? '사용 순서' : 'How to use');
  }
  var barEl;
  function setLang(l, first) {
    LANG = l;
    try { localStorage.setItem(KEY, l); } catch (e) {}
    document.documentElement.lang = l;
    if (barEl) {
      barEl.querySelectorAll('.hx-t').forEach(function (a) { a.textContent = a.getAttribute('data-' + l); });
      barEl.querySelector('.hx-nav').setAttribute('aria-label', l === 'ko' ? '도구' : 'Tools');
    }
    langSteps(l);
    if (translator) translator.apply(l);
    if (TITLES) document.title = TITLES[l];
    if (window.HXApply) window.HXApply(l, first);
    else if (ADAPT[TOOL]) ADAPT[TOOL](l, first);
  }

  function start() {
    document.body.classList.add('hx-p-' + TOOL);
    if (TOOL !== 'home') document.body.classList.add('hx-tool');
    barEl = bar();
    if (TOOL === 'home') document.querySelectorAll('a[data-anim]').forEach(function (a) { var t = TOOLS.filter(function (x) { return x.id === a.getAttribute('data-anim'); })[0]; if (t) a.href = href(t); });
    buildSteps();
    setLang(LANG, true);
    /* keep tabs in sync when the language changes in another tool */
    window.addEventListener('storage', function (e) { if (e.key === KEY && (e.newValue === 'en' || e.newValue === 'ko') && e.newValue !== LANG) setLang(e.newValue); });
    window.addEventListener('pageshow', function (e) { if (e.persisted) { var l = readLang(); if (l !== LANG) setLang(l); } });
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', start); else start();
  window.HX = { setLang: setLang, get lang() { return LANG; } };
})();

/* instant tooltip: replaces the browser's delayed title popup, shown in the auxiliary colour */
(function () {
  var tip = null, cur = null;
  function el() { if (!tip) { tip = document.createElement('div'); tip.className = 'hx-tip'; document.body.appendChild(tip); } return tip; }
  function show(t, x, y) {
    var rr = t.getBoundingClientRect();
    if (window.parent !== window) { try { parent.postMessage({ hcdtTip: 1, t: t.getAttribute('data-hx-t'), r: { l: rr.left, t: rr.top, w: rr.width, h: rr.height } }, '*'); return; } catch (e) {} }
    var n = el(); n.textContent = t.getAttribute('data-hx-t'); n.classList.add('on');
    var r = t.getBoundingClientRect(), w = n.offsetWidth, h = n.offsetHeight;
    var left = Math.max(6, Math.min(r.left + r.width / 2 - w / 2, innerWidth - w - 6));
    var top = r.top - h - 8; if (top < 6) top = r.bottom + 8;
    n.style.left = left + 'px'; n.style.top = Math.max(6, top) + 'px';
  }
  function hide() {
    if (cur) { var t = cur; cur = null; if (t.hasAttribute('data-hx-t')) { t.setAttribute('title', t.getAttribute('data-hx-t')); t.removeAttribute('data-hx-t'); } }
    if (tip) tip.classList.remove('on');
    if (window.parent !== window) { try { parent.postMessage({ hcdtTip: 0 }, '*'); } catch (e) {} }
  }
  document.addEventListener('mouseover', function (e) {
    var t = e.target.closest && e.target.closest('[title],[data-hx-t]');
    if (!t || t === cur) return;
    hide();
    var txt = t.getAttribute('title'); if (!txt) return;
    t.setAttribute('data-hx-t', txt); t.removeAttribute('title'); cur = t; show(t);
  }, true);
  document.addEventListener('mouseout', function (e) { if (cur && !cur.contains(e.relatedTarget)) hide(); }, true);
  document.addEventListener('mousedown', hide, true);
  document.addEventListener('scroll', hide, true);
})();
