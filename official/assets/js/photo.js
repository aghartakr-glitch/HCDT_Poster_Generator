/* 사진 원본: 올린 사진 읽기/줄이기, 사진이 없을 때 쓰는 가짜 인물(회색 실루엣) 그리기 */
(function () {
  'use strict';
  var HP = window.HP, avatars = {}, imgs = {};

  function gray(v) { v = Math.round(v); return 'rgb(' + v + ',' + v + ',' + v + ')'; }

  // 사진이 없을 때 보여 줄 실루엣. 얼굴 사진이 아니라 도형이므로 저작권/초상권 걱정이 없다.
  HP.avatar = function (i) {
    var k = i % 15;
    if (avatars[k]) return avatars[k];
    var r = HP.rng(k * 977 + 13), cv = document.createElement('canvas'), g = cv.getContext('2d');
    cv.width = 600; cv.height = 720;
    var bg = g.createLinearGradient(0, 0, 0, 720);
    bg.addColorStop(0, '#ececec'); bg.addColorStop(1, '#b4b4b4');
    g.fillStyle = bg; g.fillRect(0, 0, 600, 720);
    var skin = 150 + r() * 70, hair = 20 + r() * 80, cloth = 40 + r() * 130, style = Math.floor(r() * 4);
    var hw = 100 + r() * 20, hh = 130 + r() * 20, cx = 285 + r() * 30;
    g.fillStyle = gray(cloth); g.beginPath(); g.moveTo(30, 720); g.quadraticCurveTo(50, 490, 220, 465);
    g.lineTo(380, 465); g.quadraticCurveTo(550, 490, 570, 720); g.closePath(); g.fill();
    g.fillStyle = gray(skin - 28); g.fillRect(cx - 42, 400, 84, 110);
    g.fillStyle = gray(hair);
    if (style === 1) { g.beginPath(); g.ellipse(cx, 330, hw + 38, hh + 60, 0, 0, 7); g.fill(); }
    if (style === 2) { g.beginPath(); g.arc(cx, 150, 46, 0, 7); g.fill(); }
    g.fillStyle = gray(skin); g.beginPath(); g.ellipse(cx, 320, hw, hh, 0, 0, 7); g.fill();
    if (style !== 3) { g.fillStyle = gray(hair); g.beginPath(); g.ellipse(cx, 300, hw + 6, hh - 10, 0, Math.PI, 0); g.fill(); }
    g.fillStyle = gray(skin - 40);
    g.beginPath(); g.arc(cx - 40, 330, 8, 0, 7); g.arc(cx + 40, 330, 8, 0, 7); g.fill();
    if (r() < 0.5) {
      g.strokeStyle = gray(30); g.lineWidth = 7;
      g.beginPath(); g.arc(cx - 42, 330, 28, 0, 7); g.moveTo(cx + 70, 330); g.arc(cx + 42, 330, 28, 0, 7); g.stroke();
    }
    avatars[k] = cv;
    return cv;
  };

  // 사진 원본을 그릴 수 있는 형태(Image 또는 canvas)로 돌려준다
  HP.photoSource = function (sp, i) {
    if (!sp.photo) return Promise.resolve(HP.avatar(i));
    if (imgs[sp.photo]) return Promise.resolve(imgs[sp.photo]);
    return new Promise(function (ok) {
      var im = new Image();
      im.onload = function () { imgs[sp.photo] = im; ok(im); };
      im.onerror = function () { ok(HP.avatar(i)); };
      im.src = sp.photo;
    });
  };

  // 올린 파일을 긴 변 1400px 이하 JPEG로 줄여 data URL로 만든다 (저장/내보내기 용량 절약)
  HP.readPhotoFile = function (file) {
    return new Promise(function (ok, fail) {
      var fr = new FileReader();
      fr.onload = function () {
        var im = new Image();
        im.onload = function () {
          var s = Math.min(1, 1400 / Math.max(im.naturalWidth, im.naturalHeight)), cv = document.createElement('canvas');
          cv.width = Math.round(im.naturalWidth * s); cv.height = Math.round(im.naturalHeight * s);
          cv.getContext('2d').drawImage(im, 0, 0, cv.width, cv.height);
          ok(cv.toDataURL('image/jpeg', 0.9));
        };
        im.onerror = function () { fail(new Error('Cannot read this image')); };
        im.src = fr.result;
      };
      fr.onerror = fail;
      fr.readAsDataURL(file);
    });
  };
})();
