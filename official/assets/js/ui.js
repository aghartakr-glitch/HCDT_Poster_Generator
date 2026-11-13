/* 편집기 조립 + 포스터 위 사진 직접 조작(끌어서 위치, 휠로 확대) */
(function () {
  'use strict';
  var HP = window.HP, el = HP.el, K = HP.ui;

  K.exportSection = function () {
    return K.section('Export', [
      el('div', { class: 'row' }, [K.btn('Download PDF', function () { HP.exportPdf(); }, 'pri')]),
      el('div', { class: 'hint', text: 'PDF: choose "Save as PDF" in the print dialog, margins none, background graphics on.' }),
      el('div', { class: 'row' }, [K.btn('Save project', function () { HP.saveProject(); }),
        K.file('Open project', 'application/json,.json', function (f) { HP.openProject(f); })]),
      K.btn('Reset everything', function () {
        if (!confirm('Reset all settings and speakers?')) return;
        HP.forget(); HP.state = HP.initialState('defense', 5); K.rebuild(); HP.emit();
      }, 'mini')], false);
  };

  // 편집기를 다시 만든다. 열려 있던 구역/발표자는 그대로 열어 둔다.
  K.rebuild = function () {
    var ed = HP.q('#hp-editor'), open = {}, top = ed.scrollTop;
    HP.qa('details', ed).forEach(function (d) {
      var key = d.getAttribute('data-id') || d.firstElementChild.textContent.replace(/\(.*$/, '').trim();
      open[key] = d.open;
    });
    ed.innerHTML = '';
    [K.posterSection(), K.styleSection(), K.photoSection(), K.headSection(), K.speakerSection(), K.qrSection()]
      .forEach(function (s) { ed.appendChild(s); });
    HP.qa('details', ed).forEach(function (d) {
      var key = d.getAttribute('data-id') || d.firstElementChild.textContent.replace(/\(.*$/, '').trim();
      if (key in open) d.open = open[key];
    });
    ed.scrollTop = top;
  };
  K.refresh = K.rebuild;

  // 사진 직접 조작: 끌면 자르는 위치가 바뀌고, 휠을 굴리면 확대된다
  K.bindPhotoDrag = function () {
    var P = HP.q('#hp-poster'), drag = null;
    P.addEventListener('pointerdown', function (e) {
      var ph = e.target.closest('.p-photo');
      if (!ph) return;
      var i = +ph.getAttribute('data-si'), sp = HP.state.speakers[i];
      drag = { i: i, x: e.clientX, y: e.clientY, px: sp.px, py: sp.py, w: ph.offsetWidth, h: ph.offsetHeight };
      ph.style.cursor = 'grabbing';
      e.preventDefault();
    });
    window.addEventListener('pointermove', function (e) {
      if (!drag) return;
      var sp = HP.state.speakers[drag.i], k = HP.scale || 1, z = sp.zoom || 1;
      sp.px = HP.clamp(drag.px - (e.clientX - drag.x) / k / drag.w / Math.max(0.3, z - 0.4) * 0.8, 0, 1);
      sp.py = HP.clamp(drag.py - (e.clientY - drag.y) / k / drag.h / Math.max(0.3, z - 0.4) * 0.8, 0, 1);
      HP.emit();
    });
    window.addEventListener('pointerup', function () { drag = null; });
    P.addEventListener('wheel', function (e) {
      var ph = e.target.closest('.p-photo');
      if (!ph) return;
      e.preventDefault();
      var sp = HP.state.speakers[+ph.getAttribute('data-si')];
      sp.zoom = HP.clamp((sp.zoom || 1) * (e.deltaY < 0 ? 1.06 : 0.94), 1, 3);
      HP.emit();
    }, { passive: false });
  };
})();
