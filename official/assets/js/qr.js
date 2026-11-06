/* QR 코드: 주소를 넣으면 SVG(벡터)로 만든다. 흰 바탕 + 여백 포함이라 어떤 배경 위에서도 읽힌다 */
(function () {
  'use strict';
  var HP = window.HP;

  // 반환: '<svg ...>' 문자열 (실패하면 '')
  HP.qrSvg = function (text, color) {
    if (!text || typeof window.qrcode !== 'function') return '';
    var q, n, r, c, d = '', run, quiet = 2;
    try {
      q = window.qrcode(0, 'M');
      q.addData(String(text));
      q.make();
    } catch (e) { return ''; }
    n = q.getModuleCount();
    for (r = 0; r < n; r++) {
      run = 0;
      for (c = 0; c <= n; c++) {
        if (c < n && q.isDark(r, c)) { run++; continue; }
        if (run) { d += 'M' + (c - run + quiet) + ' ' + (r + quiet) + 'h' + run + 'v1h-' + run + 'z'; run = 0; }
      }
    }
    var s = n + quiet * 2;
    return '<svg viewBox="0 0 ' + s + ' ' + s + '" shape-rendering="crispEdges" role="img" aria-label="QR code">' +
      '<rect width="' + s + '" height="' + s + '" fill="#fff"/><path d="' + d + '" fill="' + color + '"/></svg>';
  };

  // 포스터에 넣을 QR 목록 [{label, html}]. 직접 올린 이미지(img)가 있으면 그것을 우선한다.
  HP.qrList = function (st, th) {
    return st.qr.filter(function (q) { return q.on && (q.img || q.url); }).map(function (q) {
      var html = q.img ? '<img src="' + HP.esc(q.img) + '" alt="QR code">' : HP.qrSvg(q.url, th.qr);
      return { label: q.label, url: q.url, html: html };
    }).filter(function (q) { return q.html; });
  };
})();
