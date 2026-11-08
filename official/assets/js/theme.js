/* 색 테마: 포스터 배경(scheme) x 팔레트(보라 + 보조색)로 글자색/사진색/로고색을 정한다 */
(function () {
  'use strict';
  var HP = window.HP;

  HP.palette = function (st) {
    var list = HP.brand.palettes || [];
    return list.filter(function (p) { return p.id === st.palette; })[0] || list[0] ||
      { id: '000', name: 'Purple', purple: '#6B00FF', aux: '#DAF61F', auxDeep: '#CFE500' };
  };

  // Visual Identity Guideline v1.0: the right-facing plane and H, C, D, T are HCDT Purple;
  // the left-facing plane and the – and + use ONE auxiliary colour (P = purple, A = auxiliary).
  // The logo uses the same foreground / point pair as the approved theme swatches used by Slides and Custom posters.
  // 1 White: purple + selected auxiliary. 2 Purple: white + selected auxiliary.
  // 3 Auxiliary background: purple + the paired auxiliary from guideline combination C.
  HP.logoMaps = function (P, A, Q) {
    var one = { base: P, hi: A, wordmark: P, accent: A };
    return { 1: one, 2: { base: '#FFFFFF', hi: A, wordmark: '#FFFFFF', accent: A },
      3: { base: P, hi: Q, wordmark: P, accent: Q }, 4: one, 5: one, 6: one };
  };

  HP.theme = function (st) {
    var p = HP.palette(st), P = p.purple, A = st.aux || p.aux, D = st.aux ? HP.mix(A, '#000000', 0.07) : p.auxDeep;
    var pairs = { '#64D8D8': '#E8E041', '#E8B9AA': '#64D8D8', '#73D888': '#E8B9AA', '#E8E041': '#73D888' };
    var Q = pairs[String(A).toUpperCase()] || A;
    var th = { scheme: st.scheme, purple: P, aux: A, deep: D }, auxTone = st.photo.tone === 'aux';
    if (st.scheme === 'purple') {
      th.bg = P; th.fg = '#FFFFFF'; th.ac = A; th.dark = HP.mix(P, '#000000', 0.45); th.light = A;
      th.dot = A; th.dotInv = true; th.map = '2';
    } else if (st.scheme === 'aux') {
      th.bg = A; th.fg = '#000000'; th.ac = P; th.dark = P; th.light = HP.mix(A, '#FFFFFF', 0.55);
      th.dot = P; th.dotInv = false; th.map = '3';
    } else {
      th.bg = '#FFFFFF'; th.fg = '#000000'; th.ac = P; th.dark = P; th.light = auxTone ? HP.mix(A, '#FFFFFF', 0.4) : '#FFFFFF';
      th.dot = P; th.dotInv = false; th.map = '1';
    }
    th.maps = HP.logoMaps(P, A, Q);
    th.qr = st.qrColor === 'accent' ? P : '#000000';
    return th;
  };

  // 로고에 줄 색 변수 (--sm 메인 점, --ss 보조 점, --w 글자, --op 기호)
  HP.logoVars = function (st, th) {
    var key = st.logoMap && st.logoMap !== 'auto' ? st.logoMap : th.map, m = th.maps[key] || th.maps[1];
    function c(v) { return v || 'none'; }
    return '--sm:' + c(m.base) + ';--ss:' + c(m.hi) + ';--w:' + c(m.wordmark) + ';--op:' + c(m.accent);
  };
})();
