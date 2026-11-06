/* 로고: 브랜드 목록(brand.json)의 SVG 조각/이미지 또는 직접 올린 파일을 그린다 */
(function () {
  'use strict';
  var HP = window.HP;

  HP.logoById = function (id) {
    var list = HP.brand.logos || [];
    return list.filter(function (l) { return l.id === id; })[0] || list[0];
  };

  // {ratio: 가로/세로, html: 마크업}
  HP.logoSpec = function (st, th) {
    var custom = st.logo === 'custom' && st.logoCustom;
    var white = th.scheme === 'purple' ? 'filter:brightness(0) invert(1);' : '';
    if (custom) {
      return { ratio: custom.ratio || 3, html: '<img src="' + HP.esc(custom.src) + '" alt="Logo" style="' + white + '">' };
    }
    var L = HP.logoById(st.logo);
    if (!L) return { ratio: 4, html: '' };
    if (L.kind === 'img') {
      return { ratio: L.ratio || 3, html: '<img src="' + HP.esc(L.src) + '" alt="Logo" style="' + white + '">' };
    }
    var vb = L.viewBox.split(/\s+/).map(Number), id = 'hcdt-' + L.form + '-';
    return {
      ratio: vb[2] / vb[3],
      html: '<svg viewBox="' + L.viewBox + '" style="' + HP.logoVars(st, th) + '" role="img" aria-label="HCDT logo">' +
        ['base', 'hi', 'wordmark', 'accent'].map(function (k) { return '<use href="#' + id + k + '"/>'; }).join('') + '</svg>'
    };
  };

  // 직접 올린 로고(SVG/PNG)를 읽어 비율과 함께 저장한다
  HP.readLogoFile = function (file) {
    return new Promise(function (ok, fail) {
      var fr = new FileReader();
      fr.onload = function () {
        var im = new Image();
        im.onload = function () { ok({ src: fr.result, ratio: (im.naturalWidth || 3) / (im.naturalHeight || 1) }); };
        im.onerror = function () { fail(new Error('Cannot read this logo file')); };
        im.src = fr.result;
      };
      fr.onerror = fail;
      fr.readAsDataURL(file);
    });
  };
})();
