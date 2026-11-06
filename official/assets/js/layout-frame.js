/* 레이아웃 공통 틀: 로고/제목/QR/안내문 자리, 본문 영역 계산, 레이아웃 등록과 선택 */
(function () {
  'use strict';
  var HP = window.HP;

  HP.defineLayout = function (id, label, build, min, max) {
    HP.layouts[id] = { id: id, label: label, build: build, min: min || 3, max: max || 15 };
    HP.order.push(id);
  };
  // 가로 포스터는 세로 공간이 좁아서, maxLand 가 있으면 그 인원까지만 쓴다
  HP.layoutsFor = function (n, land) {
    return HP.order.filter(function (id) {
      var L = HP.layouts[id];
      return n >= L.min && n <= (land && L.maxLand ? L.maxLand : L.max);
    });
  };

  // 시드에서 뽑는 '변주' 값. 같은 인원 수라도 학기마다 다르게 보이게 하는 장치.
  HP.variant = function (rng, st) {
    var pick = function (a) { return a[Math.floor(rng() * a.length)]; };
    return {
      frame: 'plain' /* guideline: the Full Version is shown as the approved lockup on white or navy; no purple wedge on the logo area */, qrPos: pick(['br', 'tr']),
      slant: pick(['up', 'down', 'alt']), stagger: pick(['alt', 'wave', 'rise', 'alt']), amp: 0.12 + rng() * 0.16,
      vplace: pick(['top', 'mid']), flip: rng() < 0.5
    };
  };

  // 제목/로고/QR 자리를 계산하고, 남은 본문 영역(content)을 돌려준다
  HP.frame = function (ctx) {
    var W = ctx.W, H = ctx.H, v = ctx.v, m = 56, land = W > H, F = { deco: [], qrs: [] };
    var lh = ctx.logo.ratio < 1.5 ? 112 : (ctx.logo.ratio < 3.8 ? 76 : 62), lw = Math.min(380, lh * ctx.logo.ratio);
    var qrS = land ? 84 : 96, nQ = ctx.qrs.length, qrW = nQ ? nQ * qrS + (nQ - 1) * 18 : 0, wedge = v.frame === 'wedge';
    var top = v.qrPos === 'tr' && nQ, headH = land ? 170 : 230;
    F.logo = { x: wedge ? W - m - lw : m, y: wedge ? 40 : m, w: lw, h: lh };
    if (wedge) F.deco.push({ pts: [[W * 0.46, 0], [W, 0], [W, lh + 96]], fill: 'ac' });
    var y = m + Math.max(lh, top ? qrS + 30 : 0) + (wedge ? 56 : 30);
    F.head = { x: m, y: y, w: W - 2 * m, h: headH };
    var bottom = H - m, noteH = ctx.state.notes ? 40 : 0;
    ctx.qrs.forEach(function (q, k) {
      var x = W - m - qrW + k * (qrS + 18), cap = 34;
      F.qrs.push({ x: x, y: top ? m : bottom - qrS - cap, s: qrS, cap: cap, i: k });
    });
    if (nQ && !top) {
      bottom -= qrS + 34 + 22;
      if (wedge) F.deco.push({ pts: [[W * 0.5, H], [W, H], [W, H - (qrS + 34 + m * 2)]], fill: 'ac' });
    }
    F.note = { x: m, y: H - m - noteH, w: nQ && !top ? W - 2 * m - qrW - 30 : W - 2 * m, h: noteH };
    if (noteH && !(nQ && !top)) bottom -= noteH + 10;
    var cy = F.head.y + headH + 26;
    F.content = { x: m, y: cy, w: W - 2 * m, h: Math.max(200, bottom - cy) };
    return F;
  };
})();
