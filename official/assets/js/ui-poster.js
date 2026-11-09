/* 편집기 1/2: 포스터 종류, 모양, 색, 레이아웃, 사진 효과, 로고, 제목 줄 */
(function () {
  'use strict';
  var HP = window.HP, el = HP.el, K = HP.ui;

  function S() { return HP.state; }
  function set(k, v) { var p = {}; p[k] = v; HP.set(p); }
  var STYLES = [['h1', 'H1'], ['h2', 'H2'], ['h3', 'H3'], ['h4', 'H4'], ['body', 'Body'], ['small', 'Small']];
  var WEIGHTS = [['', 'Weight: auto'], [300, 'Light'], [400, 'Regular'], [500, 'Medium'], [700, 'Bold']];

  // 글줄 한 개 편집 (제목 줄/발표자 줄 공용)
  K.lineRow = function (ln, onChange, onRemove) {
    var row = el('div', { class: 'ln-row' });
    row.appendChild(K.text(ln.t, function (v) { ln.t = v; onChange(); }));
    row.appendChild(K.select(STYLES, ln.s, function (v) { ln.s = v; onChange(); }));
    row.appendChild(K.btn('×', onRemove, 'mini', 'Remove line'));
    row.appendChild(el('div', { class: 'opts' }, [
      K.select(WEIGHTS, ln.w || '', function (v) { ln.w = v ? +v : undefined; onChange(); }),
      K.select([['ac', 'Accent color'], ['fg', 'Text color']], ln.c || 'ac', function (v) { ln.c = v; onChange(); })]));
    return row;
  };

  K.posterSection = function () {
    var st = S(), b = HP.brand;
    var types = Object.keys(HP.types).map(function (k) { return [k, { defense: 'Defense', seminar: 'Seminar', custom: 'Custom' }[k] || HP.types[k].label]; });
    var typeControl = K.seg(types, st.type, function (t) {
      if (!confirm('Switch to "' + HP.types[t].label + '"? Current speakers and headline will be replaced.')) { K.rebuild(); return; }
      HP.state = HP.initialState(t, t === 'custom' ? 3 : Math.max(3, st.speakers.length));
      K.rebuild(); HP.emit(); HP.setGrid(t === 'custom');
      window.parent.postMessage({ hcdtPosterType: t }, '*');
    });
    typeControl.classList.add('hx-poster-type');
    return K.section('Poster', [
      K.field('Type', typeControl),
      el('div', { class: 'row' }, [
        K.field('Orientation', K.seg([['portrait', 'Portrait'], ['landscape', 'Landscape']], st.format, function (v) { set('format', v); })),
        K.field('Paper', K.select(Object.keys(HP.papers).map(function (p) { return [p, p]; }), st.paper, function (v) { set('paper', v); }))])
    ]);
  };

  K.styleSection = function () {
    var st = S(), b = HP.brand, pal = HP.palette(st);
    var auxPairs = { '#64D8D8': '#E8E041', '#E8B9AA': '#64D8D8', '#73D888': '#E8B9AA', '#E8E041': '#73D888' };
    var sw = el('div', { class: 'hx-chips', role: 'group', 'aria-label': 'Auxiliary color' }, (b.palettes || []).map(function (p) {
      var selected = p.id === pal.id && !st.aux;
      var bg = '#FFFFFF', text = p.purple, point = p.aux;
      if (st.scheme === 'purple') { bg = p.purple; text = '#FFFFFF'; }
      if (st.scheme === 'aux') { bg = p.aux; text = p.purple; point = auxPairs[String(p.aux).toUpperCase()] || p.aux; }
      return el('button', {
        type: 'button',
        class: 'hx-chip',
        title: p.id + ' ' + p.name,
        'aria-label': p.name,
        'aria-pressed': String(selected),
        style: '--b:' + bg + ';--t:' + text + ';--p:' + point,
        onclick: function () { HP.set({ palette: p.id, aux: '' }); K.rebuild(); }
      }, ['Aa', el('i', { 'aria-hidden': 'true' })]);
    }));
    var layouts = [['auto', 'Auto (by seed)']].concat(HP.layoutsFor(st.speakers.length, st.format === 'landscape').map(function (id) { return [id, HP.layouts[id].label]; }));
    var logos = (b.logos || []).map(function (l) { return [l.id, l.label]; });
    return K.section('Look', [
      K.field('Background', K.seg([['light', 'White'], ['purple', 'Purple'], ['aux', 'Highlight']], st.scheme, function (v) { set('scheme', v); })),
      K.field('Auxiliary color (main purple stays)', sw),
      K.field('Layout', el('div', { class: 'row' }, [K.select(layouts, st.layout, function (v) { set('layout', v); }),
        K.btn('Shuffle', function () { set('seed', Math.floor(Math.random() * 99999)); K.refresh(); }, 'pri', 'New variation')]),
        'Seed ' + st.seed + ' · same seed gives the same poster'),
      K.field('Logo', K.select(logos, st.logo, function (v) { set('logo', v); K.rebuild(); })),
      st.logo === 'custom' ? K.file('Choose logo (SVG/PNG)', 'image/svg+xml,image/png', function (f) {
        HP.readLogoFile(f).then(function (r) { HP.set({ logoCustom: r }); });
      }) : null
    ]);
  };

  K.photoSection = function () {
    var p = S().photo;
    function up(k, v) { p[k] = v; HP.emit(); }
    return K.section('Photos', [
      K.field('Treatment', K.select([['halftone', 'Halftone dots'], ['pixel', 'Pixel squares'], ['duotone', 'Duotone'], ['mono', 'Black & white'],
        ['original', 'Original']], p.mode, function (v) { up('mode', v); })),
      K.field('Shape', K.select([['auto', 'Auto (layout decides)'], ['slant', 'Slanted'], ['circle', 'Round'], ['square', 'Square']], p.shape,
        function (v) { up('shape', v); })),
      K.field('Contrast', K.range(0.6, 2, 0.05, p.contrast, function (v) { up('contrast', v); })),
      K.field('Dot size', K.range(3, 14, 0.5, p.dot, function (v) { up('dot', v); })),
      K.field('Highlights (white background only)', K.seg([['white', 'White'], ['aux', 'Highlight tint']], p.tone, function (v) { up('tone', v); })),
      el('div', { class: 'hint', text: 'Tip: drag a photo on the poster to re-crop, scroll to zoom.' })
    ]);
  };

  K.headSection = function () {
    var st = S(), box = el('div', { class: 'body', style: 'padding:0;display:grid;gap:8px' });
    function draw() {
      box.innerHTML = '';
      st.head.forEach(function (ln, i) {
        box.appendChild(K.lineRow(ln, function () { HP.emit(); }, function () { st.head.splice(i, 1); draw(); HP.emit(); }));
      });
      box.appendChild(K.btn('+ Add line', function () { st.head.push({ t: 'New line', s: 'h3', c: 'ac' }); draw(); HP.emit(); }, 'mini'));
    }
    draw();
    return K.section('Headline', [box]);
  };
})();
