/* 레이아웃 계열 C '히어로': 첫 번째 인물을 크게, 나머지는 카드로. (발표자 한 명이 주인공일 때) */
(function () {
  'use strict';
  var HP = window.HP;

  function hero(id, label, rest) {
    HP.defineLayout(id, label, function (ctx) {
      var F = HP.frame(ctx), C = F.content, land = ctx.W > ctx.H, gap = 28;
      var share = HP.clamp(0.52 - 0.028 * ctx.n, 0.26, 0.42), hh = Math.min(land ? C.h * (share + 0.08) : C.h * share, 460), pw = Math.min(C.w * (land ? 0.3 : 0.42), hh * 0.95);
      var right = ctx.v.flip, shape = HP.shapeOf(ctx, 'slant');
      var px = right ? C.x + C.w - pw : C.x, tx = right ? C.x : C.x + pw + 28, tw = C.w - pw - 28;
      var first = { i: ctx.idx[0], group: 'hero', photo: { x: px, y: C.y, w: pw, h: hh, shape: shape === 'slant' ? 'slantL' : shape },
        text: { x: tx, y: C.y, w: tw, h: hh, anchor: 'bottom', align: right ? 'right' : 'left' } };
      var R = { x: C.x, y: C.y + hh + gap, w: C.w, h: C.h - hh - gap };
      var items = [first].concat(rest(ctx, R, ctx.idx.slice(1)));
      return { frame: F, items: items, bmax: 17, heroScale: 1.55 };
    }, 4, 15);
  }

  hero('hero-cards', 'Feature + cards', function (ctx, R, idx) {
    return HP.cardsIn(ctx, R, idx, { shape: 'slant', stagger: ctx.v.stagger, amp: ctx.v.amp, ideal: 1.5, capAsp: 1.9, gap: 20 });
  });
  hero('hero-list', 'Feature + list', function (ctx, R, idx) {
    return HP.sideIn(ctx, R, idx, { cols: [2], shape: 'circle', groups: false }).items;
  });
  HP.layouts['hero-list'].max = 12;
  HP.layouts['hero-list'].maxLand = 7;
})();
