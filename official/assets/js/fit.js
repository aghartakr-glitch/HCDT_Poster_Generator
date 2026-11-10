/* 글자 자동 맞춤: 상자 안에 글이 다 들어가는 가장 큰 기본 글자 크기(--b)를 찾는다 */
(function () {
  'use strict';
  var HP = window.HP;

  // 이진 탐색: --b 를 바꿔 가며 안쪽 내용(.in)이 상자를 넘지 않는 최대값을 찾는다
  function fitBox(el, lo, hi) {
    var inner = el.firstElementChild, k, mid, ok;
    function fits() { return inner.offsetHeight <= el.clientHeight + 0.5 && inner.scrollWidth <= el.clientWidth + 0.5; }
    el.style.setProperty('--b', hi + 'px');
    if (fits()) return hi;
    for (k = 0; k < 9; k++) {
      mid = (lo + hi) / 2;
      el.style.setProperty('--b', mid + 'px');
      ok = fits();
      if (ok) lo = mid; else hi = mid;
    }
    el.style.setProperty('--b', lo + 'px');
    return lo;
  }

  // 같은 그룹(main/hero)의 카드는 가장 작은 값에 맞춰 크기를 통일한다
  HP.fitAll = function (root, spec, ctx) {
    var sizes = {}, info = { card: null, head: null, tooSmall: false };
    var texts = HP.qa('.p-text', root);
    texts.forEach(function (t) {
      var g = t.getAttribute('data-g'), max = (spec.bmax || 18) * (g === 'hero' ? spec.heroScale || 1.5 : 1);
      var b = fitBox(t, 7, max);
      sizes[g] = Math.min(sizes[g] === undefined ? 99 : sizes[g], b);
    });
    texts.forEach(function (t) { t.style.setProperty('--b', sizes[t.getAttribute('data-g')] + 'px'); });
    var head = HP.q('.p-head', root);
    if (head) info.head = fitBox(head, 10, ctx.W > ctx.H ? 28 : 30);
    info.card = sizes.main === undefined ? null : sizes.main;
    info.tooSmall = info.card !== null && info.card < 9.5;
    HP.fitInfo = info;
    return info;
  };

  // 미리보기 크기: 화면 안에 포스터가 통째로 보이게 축소한다
  HP.fitStage = function () {
    var st = HP.state, f = HP.formats[st.format], stage = HP.q('#hp-stage'), sheet = HP.q('#hp-sheet'), P = HP.q('#hp-poster');
    var k = Math.min((stage.clientWidth - 48) / f.w, (stage.clientHeight - 70) / f.h);
    k = HP.clamp(k, 0.1, 1.5);
    var kFit = k;
    k = HP.clamp(k * (HP.zoomMul || 1), 0.05, 4);  /* zoom bar: Fit = 1, steps of 1.2 */
    sheet.style.width = f.w * k + 'px';
    sheet.style.height = f.h * k + 'px';
    P.style.transform = 'scale(' + k + ')';
    HP.scale = k;
    var zv = document.getElementById('zVal'); if (zv) zv.value = Math.round(k / kFit * 100) + '%';
  };
})();
