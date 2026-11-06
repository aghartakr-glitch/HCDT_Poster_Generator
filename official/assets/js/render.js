/* 포스터 그리기: 상태 -> 레이아웃 -> DOM. 사진은 비동기로 채운다 */
(function () {
  'use strict';
  var HP = window.HP, token = 0;

  function box(c, x, y, w, h) { return 'left:' + x + 'px;top:' + y + 'px;width:' + w + 'px;height:' + h + 'px;' + (c || ''); }

  function lineHTML(l, mark) {
    var w = l.w ? ' style="font-weight:' + l.w + '"' : '';
    return '<div class="ln t-' + (l.s || 'body') + ' c-' + (l.c || 'ac') + '"' + w + '>' + HP.esc(l.t || '') + (mark || '') + '</div>';
  }

  function clip(shape, w, h) {
    var s = (w * 0.13).toFixed(1);
    if (shape === 'slantL') return 'clip-path:polygon(0 ' + s + 'px,' + w + 'px 0,' + w + 'px ' + h + 'px,0 ' + h + 'px);';
    if (shape === 'slantR') return 'clip-path:polygon(0 0,' + w + 'px ' + s + 'px,' + w + 'px ' + h + 'px,0 ' + h + 'px);';
    if (shape === 'circle') return 'clip-path:circle(50% at 50% 50%);';
    return '';
  }

  function speakerHTML(sp, th, st) {
    var star = ['h3', 'h4', 'h2', 'h1'], at = -1;
    star.some(function (s) { return sp.lines.some(function (l, k) { if (l.s === s) { at = k; return true; } return false; }); });
    var html = sp.lines.map(function (l, k) { return lineHTML(l, sp.korean && k === at ? '<i class="kdot"></i>' : ''); }).join('');
    if (sp.online) html += '<div class="tags"><span class="pill">Online · Zoom</span></div>';
    if (sp.link) { var q = HP.qrSvg(sp.link, th.qr); if (q) html += '<div class="lqr">' + q + '</div>'; }
    return html;
  }

  HP.pickLayout = function (st, n) {
    var ids = HP.layoutsFor(n, st.format === 'landscape');
    if (!ids.length) ids = HP.order.slice();
    if (st.layout !== 'auto' && ids.indexOf(st.layout) >= 0) return st.layout;
    return ids[HP.hash(String(st.seed) + ':' + n) % ids.length];
  };

  HP.render = function () {
    var st = HP.state, n = st.speakers.length, f = HP.formats[st.format], th = HP.theme(st), my = ++token;
    var id = HP.pickLayout(st, n), v = HP.variant(HP.rng(HP.hash(id) ^ st.seed), st), P = HP.q('#hp-poster'), idx = [], k;
    for (k = 0; k < n; k++) idx.push(k);
    var ctx = { W: f.w, H: f.h, n: n, state: st, theme: th, v: v, logo: HP.logoSpec(st, th), qrs: HP.qrList(st, th), idx: idx };
    var spec = n ? HP.layouts[id].build(ctx) : { frame: HP.frame(ctx), items: [] };
    HP.last = { id: id, v: v, spec: spec };
    var F = spec.frame, h = [];
    P.style.cssText = 'width:' + f.w + 'px;height:' + f.h + 'px;--bg:' + th.bg + ';--fg:' + th.fg + ';--ac:' + th.ac +
      ';--purple:' + th.purple + ';--aux:' + th.aux + ';transform:scale(' + (HP.scale || 0.5) + ')';
    if (F.deco.length) {
      h.push('<svg class="p-deco" width="' + f.w + '" height="' + f.h + '">' + F.deco.map(function (d) {
        return '<polygon points="' + d.pts.map(function (p) { return p.join(','); }).join(' ') + '" fill="var(--' + d.fill + ')"/>';
      }).join('') + '</svg>');
    }
    var lg = v.frame === 'wedge' ? HP.logoSpec(Object.assign({}, st, { logoMap: '2' }), Object.assign({}, th, { scheme: 'purple' })) : ctx.logo;
    h.push('<div class="p-logo" style="' + box('', F.logo.x, F.logo.y, F.logo.w, F.logo.h) + '">' + lg.html + '</div>');
    h.push('<div class="p-head" style="' + box('', F.head.x, F.head.y, F.head.w, F.head.h) + '"><div class="in">' +
      st.head.map(function (l) { return lineHTML(l); }).join('') + '</div></div>');
    spec.items.forEach(function (it) {
      var sp = st.speakers[it.i], p = it.photo, t = it.text, al = 'text-align:' + (t.align || 'left') + ';';
      h.push('<div class="p-photo" data-si="' + it.i + '" style="' + box(clip(p.shape, p.w, p.h), p.x, p.y, p.w, p.h) + '"><img alt=""></div>');
      h.push('<div class="p-text a-' + (t.anchor || 'top') + '" data-g="' + it.group + '" style="' + box(al, t.x, t.y, t.w, t.h) +
        '"><div class="in">' + speakerHTML(sp, th, st) + '</div></div>');
    });
    (spec.heads || []).forEach(function (g) {
      h.push('<div class="p-gh" style="' + box('', g.x, g.y, g.w, g.h) + '"><span>' + HP.esc(g.label) + '</span></div>');
    });
    F.qrs.forEach(function (q) {
      var it = ctx.qrs[q.i];
      h.push('<div class="p-qr" style="left:' + q.x + 'px;top:' + q.y + 'px;width:' + q.s + 'px"><div class="qb" style="height:' + q.s + 'px">' +
        it.html + '</div><div class="cap">' + HP.esc(it.label) + '</div></div>');
    });
    if (st.notes) h.push('<div class="p-note" style="' + box('', F.note.x, F.note.y, F.note.w, F.note.h) + '">' + HP.esc(st.notes) + '</div>');
    P.className = 'poster fmt-' + st.format + ' scheme-' + st.scheme;
    P.innerHTML = h.join('');
    HP.fitStage();
    P.style.transform = 'scale(' + HP.scale + ')';
    HP.fitAll(P, spec, ctx);
    spec.items.forEach(function (it) { fillPhoto(it, my, st, th); });
    HP.warn();
    HP.emitRendered();
  };

  function fillPhoto(it, my, st, th) {
    var p = it.photo, ppu = Math.min(2, 1100 / Math.max(p.w, p.h)), sp = st.speakers[it.i];
    var img = HP.q('.p-photo[data-si="' + it.i + '"] img', HP.q('#hp-poster'));
    HP.renderPhoto(sp, it.i, Math.round(p.w * ppu), Math.round(p.h * ppu), st, th, ppu).then(function (url) {
      if (my === token && img) img.src = url;
    });
  }

  HP.emitRendered = function () { document.dispatchEvent(new CustomEvent('hp-rendered')); };
  HP.warn = function () {
    var w = HP.q('#hp-warn'), i = HP.fitInfo || {}, msg = '';
    if (i.tooSmall) msg = 'Text is getting small (' + i.card.toFixed(1) + 'px). Shorten long titles or choose another layout.';
    w.textContent = msg;
    w.className = msg ? 'on' : '';
  };
})();
