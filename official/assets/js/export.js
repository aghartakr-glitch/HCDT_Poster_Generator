/* 내보내기: PDF(인쇄 대화상자), PNG(SVG foreignObject), 프로젝트 파일(JSON) */
(function () {
  'use strict';
  var HP = window.HP, K = HP.ui;

  // 인쇄할 때만 적용되는 용지 크기/배율을 넣는다 (벡터 PDF가 되고 글자는 그대로 글자로 남는다)
  HP.exportPdf = function () {
    var st = HP.state, f = HP.formats[st.format], pp = HP.papers[st.paper], land = st.format === 'landscape';
    var wmm = land ? pp[1] : pp[0], hmm = land ? pp[0] : pp[1], k = (wmm * 96 / 25.4) / f.w;
    HP.q('#hp-page-size').textContent = '@page{size:' + wmm + 'mm ' + hmm + 'mm;margin:0}@media print{#hp-sheet{width:' + wmm + 'mm!important;height:' + hmm +
      'mm!important}#hp-poster{transform:scale(' + k + ')!important}}';
    window.print();
  };

  function css(url) { return fetch(url).then(function (r) { return r.text(); }).catch(function () { return ''; }); }

  // 포스터를 그림으로 만든다. 글꼴은 이 컴퓨터에 설치된 것이 쓰인다.
  HP.exportPng = function () {
    var st = HP.state, f = HP.formats[st.format], P = HP.q('#hp-poster'), url = HP.assets + 'css/poster.css';
    var defs = HP.q('body > svg[aria-hidden]'), tsx = HP.q('#hp-text-styles').textContent, root = HP.q('#hp-root-vars').textContent;
    var ser = new XMLSerializer();
    css(url).then(function (poster) {
      var clone = P.cloneNode(true);
      clone.style.transform = 'none';
      var xml = '<svg xmlns="http://www.w3.org/2000/svg" width="' + f.w + '" height="' + f.h + '"><foreignObject width="100%" height="100%">' +
        '<div xmlns="http://www.w3.org/1999/xhtml"><style>' + root + tsx + poster.replace(/@media print[\s\S]*$/, '') + '</style>' +
        ser.serializeToString(defs) + ser.serializeToString(clone) + '</div></foreignObject></svg>';
      var img = new Image(), scale = 2;
      img.onload = function () {
        var cv = document.createElement('canvas');
        cv.width = f.w * scale; cv.height = f.h * scale;
        cv.getContext('2d').drawImage(img, 0, 0, cv.width, cv.height);
        cv.toBlob(function (b) { K.download('poster-' + st.type + '.png', b); }, 'image/png');
      };
      img.onerror = function () { alert('PNG export failed in this browser. Please use Download PDF instead.'); };
      img.src = 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(xml);
    });
  };

  HP.saveProject = function () {
    var blob = new Blob([JSON.stringify(HP.state)], { type: 'application/json' });
    K.download('poster-' + HP.state.type + '-' + HP.state.seed + '.json', blob);
  };
  HP.openProject = function (file) {
    var fr = new FileReader();
    fr.onload = function () {
      try {
        var s = JSON.parse(fr.result);
        if (!s || !s.speakers) throw new Error('bad');
        HP.state = Object.assign(HP.initialState(s.type || 'defense', 3), s);
        K.rebuild(); HP.resetHistory(); HP.emit();
      } catch (e) { alert('This file is not a poster project.'); }
    };
    fr.readAsText(file);
  };
})();
