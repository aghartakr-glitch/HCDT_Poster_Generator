/* 사진 효과: 흑백화 -> 듀오톤 / 하프톤(점) / 픽셀(네모) / 원본. 결과는 data URL로 캐시한다 */
(function () {
  'use strict';
  var HP = window.HP, cache = {}, order = [];

  function remember(key, url) {
    cache[key] = url; order.push(key);
    if (order.length > 80) delete cache[order.shift()];   // 메모리 보호
  }

  // 사진 한 장을 w x h 픽셀로 잘라(zoom/px/py) 효과를 입힌 data URL을 돌려준다
  HP.renderPhoto = function (sp, i, w, h, st, th, ppu) {
    var p = st.photo, mode = p.mode;
    var key = [sp.photo ? sp.photo.length + sp.photo.slice(-24) : 'a' + (i % 15), w, h, sp.zoom, sp.px.toFixed(3), sp.py.toFixed(3),
      mode, p.contrast, p.dot, th.dark, th.light, th.dot, th.dotInv ? 1 : 0].join('|');
    if (cache[key]) return Promise.resolve(cache[key]);
    return HP.photoSource(sp, i).then(function (src) {
      var cv = document.createElement('canvas'), g = cv.getContext('2d', { willReadFrequently: true });
      cv.width = w; cv.height = h;
      var iw = src.width || src.naturalWidth, ih = src.height || src.naturalHeight, ar = w / h;
      var cw = iw, ch = iw / ar;
      if (ch > ih) { ch = ih; cw = ih * ar; }
      cw /= sp.zoom; ch /= sp.zoom;
      g.drawImage(src, (iw - cw) * sp.px, (ih - ch) * sp.py, cw, ch, 0, 0, w, h);
      if (mode !== 'original') toneMap(g, cv, w, h, p, th, ppu);
      var url = cv.toDataURL(mode === 'duotone' || mode === 'original' || mode === 'mono' ? 'image/jpeg' : 'image/png', 0.92);
      remember(key, url);
      return url;
    });
  };

  // 밝기(0~1) 배열: 2%~98% 구간을 펴고 대비를 적용한다
  function lumaMap(data, n, contrast) {
    var y = new Float32Array(n), hist = new Uint32Array(256), k, acc, lo = 0, hi = 255;
    for (k = 0; k < n; k++) {
      y[k] = 0.299 * data[k * 4] + 0.587 * data[k * 4 + 1] + 0.114 * data[k * 4 + 2];
      hist[y[k] | 0]++;
    }
    for (acc = 0; lo < 255 && acc + hist[lo] < n * 0.02; lo++) acc += hist[lo];
    for (acc = 0; hi > 0 && acc + hist[hi] < n * 0.02; hi--) acc += hist[hi];
    if (hi - lo < 20) { lo = 0; hi = 255; }
    for (k = 0; k < n; k++) {
      var v = (y[k] - lo) / (hi - lo);
      y[k] = HP.clamp((v - 0.5) * contrast + 0.5, 0, 1);
    }
    return y;
  }

  function toneMap(g, cv, w, h, p, th, ppu) {
    var img = g.getImageData(0, 0, w, h), L = lumaMap(img.data, w * h, p.contrast), k, mode = p.mode;
    if (mode === 'halftone' || mode === 'pixel') {
      g.clearRect(0, 0, w, h);
      dots(g, L, w, h, Math.max(3, p.dot * ppu), mode === 'pixel', th);
      return;
    }
    var a = HP.rgb(th.dark), b = HP.rgb(th.light);
    for (k = 0; k < w * h; k++) {
      var t = L[k], o = k * 4;
      if (mode === 'mono') { img.data[o] = img.data[o + 1] = img.data[o + 2] = t * 255; continue; }
      img.data[o] = a[0] + (b[0] - a[0]) * t; img.data[o + 1] = a[1] + (b[1] - a[1]) * t; img.data[o + 2] = a[2] + (b[2] - a[2]) * t;
    }
    g.putImageData(img, 0, 0);
  }

  // 점/네모 격자. 점 크기는 어두울수록 커진다(보라 배경 테마에서는 밝을수록 커진다)
  function dots(g, L, w, h, cell, square, th) {
    var ang = square ? 0 : Math.PI / 4, ca = Math.cos(ang), sa = Math.sin(ang), span = Math.ceil(Math.hypot(w, h) / cell) + 2, u, v;
    g.fillStyle = th.dot;
    for (u = -span; u <= span; u++) {
      for (v = -span; v <= span; v++) {
        var x = w / 2 + (u * ca - v * sa) * cell, y = h / 2 + (u * sa + v * ca) * cell;
        if (x < 0 || y < 0 || x >= w || y >= h) continue;
        var s = L[(y | 0) * w + (x | 0)], d = Math.sqrt(th.dotInv ? s : 1 - s);
        if (d < 0.08) continue;
        if (square) { var q = cell * d * 0.98; g.fillRect(x - q / 2, y - q / 2, q, q); }
        else { g.beginPath(); g.arc(x, y, cell * 0.74 * d, 0, 6.2832); g.fill(); }
      }
    }
  }
})();
