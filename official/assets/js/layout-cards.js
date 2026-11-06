/* 레이아웃 계열 A '카드': 사진이 위, 글이 아래. 격자 칸 수는 인원에 맞춰 자동으로 고른다 */
(function () {
  'use strict';
  var HP = window.HP;

  // 사용자가 사진 모양을 고정했으면 그것을, 아니면 레이아웃 기본값을 쓴다
  HP.shapeOf = function (ctx, dflt) {
    var s = ctx.state.photo.shape;
    return s === 'auto' ? dflt : s;
  };
  HP.slantOf = function (ctx, k) {
    var d = ctx.v.slant === 'alt' ? (k % 2 ? 'down' : 'up') : ctx.v.slant;
    return d === 'up' ? 'slantL' : 'slantR';
  };

  // 칸 수(열 x 행) 후보 중 사진이 가장 크게 나오는 것을 고른다 (글 자리는 최소한 남기고, 빈칸은 감점)
  function pickGrid(n, R, o, asp) {
    var best = null, c, r, gap = o.gap;
    for (c = 1; c <= n; c++) {
      r = Math.ceil(n / c);
      var cw = (R.w - gap * (c - 1)) / c, avail = (R.h - gap * (r - 1)) / r, tmin = 100 + 9000 / cw, drop = asp === 1 ? 1 + o.amp : 1;
      if (cw < 100 && c > 1) continue;
      var ph = Math.min(cw * asp, (avail - tmin - 10) / drop), pw = Math.min(cw, ph / asp);
      if (ph < 60) continue;
      var score = pw * ph * (1 - 0.35 * (r * c - n) / n);
      if (!best || score > best.score) {
        best = { c: c, r: r, cw: cw, ph: ph, pw: pw, score: score, ch: Math.min(avail, ph * drop + 10 + Math.max(tmin, cw * 0.75)) };
      }
    }
    return best || { c: n, r: 1, cw: R.w / n, ph: 100, pw: R.w / n, ch: R.h, score: 0 };
  }

  HP.cardsIn = function (ctx, R, idx, o) {
    var n = idx.length, gap = o.gap = o.gap || 22, items = [], k;
    var shape0 = HP.shapeOf(ctx, o.shape), round = shape0 === 'circle', asp = round || shape0 === 'square' ? 1 : 1.12;
    var g = pickGrid(n, R, o, asp);
    var used = g.r * g.ch + gap * (g.r - 1), y0 = R.y + (ctx.v.vplace === 'mid' ? Math.max(0, (R.h - used) / 2) : 0);
    for (k = 0; k < n; k++) {
      var row = Math.floor(k / g.c), col = k % g.c, cnt = row === g.r - 1 ? n - g.c * (g.r - 1) : g.c;
      var x = R.x + (g.c - cnt) * (g.cw + gap) / 2 + col * (g.cw + gap), cy = y0 + row * (g.ch + gap), shape = shape0;
      var sv = { alt: k % 2, wave: (Math.sin(k * 1.3 + ctx.v.amp * 9) + 1) / 2, rise: col / Math.max(1, g.c - 1), none: 0 }[o.stagger];
      var py = cy, hh = g.ph;
      if (round || shape === 'square') py = cy + g.ph * o.amp * sv;
      else { hh = g.ph * (1 - o.amp * 1.3 * sv); py = cy + g.ph - hh; }
      var ty = py + hh + 10, bottom = cy + g.ch;
      if (shape === 'slant') shape = HP.slantOf(ctx, k);
      items.push({ i: idx[k], group: 'main', photo: { x: x, y: py, w: g.pw, h: hh, shape: shape },
        text: { x: x, y: ty, w: g.cw, h: Math.max(40, bottom - ty), anchor: 'top' } });
    }
    return items;
  };

  function cards(id, label, shape, stagger, ideal) {
    HP.defineLayout(id, label, function (ctx) {
      var F = HP.frame(ctx), o = { shape: shape, stagger: stagger === 'var' ? ctx.v.stagger : stagger, amp: ctx.v.amp,
        ideal: ideal, capAsp: 2.1, gap: 22 };
      if (stagger === 'none') o.amp = 0;
      return { frame: F, items: HP.cardsIn(ctx, F.content, ctx.idx, o), bmax: 18 };
    });
  }
  cards('cards-slant', 'Cards · slanted photos', 'slant', 'var', 1.75);
  cards('cards-round', 'Cards · round photos', 'circle', 'wave', 1.55);
  cards('cards-grid', 'Cards · square grid', 'square', 'none', 1.5);
})();
