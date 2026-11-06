/* 레이아웃 계열 B '옆으로': 사진 옆에 글. 월/그룹 제목 줄(예: April)과 지그재그, 열 엇갈림을 지원한다 */
(function () {
  'use strict';
  var HP = window.HP;

  // 인물을 행으로 나눈다. groups가 켜져 있으면 그룹이 바뀔 때마다 제목 행을 끼운다.
  function buildRows(ctx, idx, c, groups) {
    var rows = [], cur = null, last = null;
    idx.forEach(function (si) {
      var g = groups ? (ctx.state.speakers[si].group || '') : '';
      if (groups && g && g !== last) { rows.push({ head: g }); cur = null; last = g; }
      if (!cur || cur.ids.length >= c) { cur = { ids: [] }; rows.push(cur); }
      cur.ids.push(si);
    });
    return rows;
  }

  HP.sideIn = function (ctx, R, idx, o) {
    var gap = 22, hh = 38, best = null, items = [], heads = [];
    o.cols.forEach(function (c) {
      var rows = buildRows(ctx, idx, c, o.groups), nI = rows.filter(function (r) { return r.ids; }).length;
      var shift = o.stagger && c > 1 ? 0.3 : 0, nH = rows.length - nI;
      var rh = Math.min(240, (R.h - nH * hh - gap * (rows.length - 1)) / (nI + shift)), cw = (R.w - gap * (c - 1)) / c;
      var ps = Math.min(rh * 0.9, cw * 0.44), tw = cw - ps - 16;
      var score = ps - (tw < 150 ? 220 : 0) - (nI * c - idx.length) * 3;
      if (!best || score > best.score) best = { c: c, rows: rows, rh: rh, cw: cw, ps: ps, shift: shift, score: score, nI: nI, nH: nH };
    });
    var b = best, used = b.nI * b.rh + b.rh * b.shift + b.nH * hh + gap * (b.rows.length - 1);
    var y = R.y + (ctx.v.vplace === 'mid' ? Math.max(0, (R.h - used) / 2) : 0), k = 0;
    b.rows.forEach(function (row) {
      if (row.head) { heads.push({ x: R.x, y: y, w: R.w, h: hh, label: row.head }); y += hh + gap; return; }
      row.ids.forEach(function (si, j) {
        var x = R.x + j * (b.cw + gap), cy = y + (j % 2 ? b.rh * b.shift : 0), right = o.zigzag && k % 2 === 1;
        var shape = HP.shapeOf(ctx, o.shape), ph = shape === 'slant' ? b.ps * 1.1 : b.ps;
        if (shape === 'slant') shape = HP.slantOf(ctx, k);
        items.push({ i: si, group: 'main',
          photo: { x: right ? x + b.cw - b.ps : x, y: cy + (b.rh - ph) / 2, w: b.ps, h: ph, shape: shape },
          text: { x: right ? x : x + b.ps + 16, y: cy, w: b.cw - b.ps - 16, h: b.rh, anchor: 'mid', align: right ? 'right' : 'left' } });
        k++;
      });
      y += b.rh + gap;
    });
    return { items: items, heads: heads };
  };

  function side(id, label, o, min) {
    HP.defineLayout(id, label, function (ctx) {
      var F = HP.frame(ctx), r = HP.sideIn(ctx, F.content, ctx.idx, Object.assign({ groups: !!ctx.state.groups && o.groupable }, o));
      return { frame: F, items: r.items, heads: r.heads, bmax: 20 };
    }, min || 3, 15);
  }
  side('list-circles', 'List · round photos', { cols: [2], shape: 'circle', groupable: true });
  side('list-zigzag', 'List · zigzag', { cols: [1, 2], shape: 'slant', zigzag: true, groupable: true });
  HP.layouts['list-circles'].maxLand = 12;
  HP.layouts['list-zigzag'].maxLand = 12;
  side('list-columns', 'List · staggered columns', { cols: [2, 3], shape: 'slant', stagger: true, groupable: false });
})();
