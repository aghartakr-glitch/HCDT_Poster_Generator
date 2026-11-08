/* 시작: 저장된 상태 불러오기 -> 글자 스타일 CSS 만들기 -> 편집기/포스터 그리기 */
(function () {
  'use strict';
  var HP = window.HP;

  // brand.json 의 글꼴/글자 스타일을 CSS로 만든다. 가이드라인이 바뀌면 json만 고치면 된다.
  function injectBrandCss() {
    var b = HP.brand, ts = b.textStyles || {}, rules = [], f = b.fonts || {};
    Object.keys(ts).forEach(function (k) {
      var s = ts[k];
      rules.push('.t-' + k + '{font-size:calc(var(--b)*' + s.size + ');font-weight:' + s.weight + ';line-height:' + s.lh +
        ';letter-spacing:' + s.track + 'em}');
    });
    var root = ':root{--font-latin:' + (f.latin || 'Helvetica,Arial,sans-serif') + ';--font-kr:' + (f.korean || 'sans-serif') + '}';
    document.head.appendChild(HP.el('style', { id: 'hp-root-vars', text: root }));
    document.head.appendChild(HP.el('style', { id: 'hp-text-styles', text: rules.join('') }));
  }

  var queued = false;
  function schedule() {
    if (queued) return;
    queued = true;
    requestAnimationFrame(function () { queued = false; HP.render(); });
  }

  function boot() {
    injectBrandCss();
    var saved = HP.restore();
    HP.state = saved && saved.speakers ? Object.assign(HP.initialState(saved.type || 'defense', 3), saved) : HP.initialState('defense', 5);
    HP.state.photo = Object.assign({ mode: 'halftone', contrast: 1.15, dot: 7, shape: 'auto', tone: 'white' }, HP.state.photo);
    HP.ui.rebuild();
    HP.ui.bindPhotoDrag();
    HP.on(schedule);
    window.addEventListener('resize', schedule);
    HP.render();
    HP.resetHistory();
    /* The construction grid belongs to the free-form Custom editor only.
       Defense and Seminar use approved structured layouts without an overlay. */
    HP.setGrid(false);
    window.addEventListener('message', function (e) {
      var d = e.data || {}, next = d.hcdtPosterType;
      if (d.hcdtAux) {
        document.documentElement.style.setProperty('--ui-sub', d.hcdtAux);
        document.documentElement.style.setProperty('--hx-ui', d.hcdtAux);
      }
      if (next !== 'defense' && next !== 'seminar' && next !== 'custom') return;
      if (next === HP.state.type) return;
      HP.state = HP.initialState(next, next === 'custom' ? 3 : Math.max(3, HP.state.speakers.length));
      HP.ui.rebuild();
      HP.render();
      HP.resetHistory();
      HP.setGrid(false);
    });
    // 글꼴이 다 불러와지면 글자 맞춤을 한 번 더 한다
    if (document.fonts && document.fonts.ready) document.fonts.ready.then(schedule);
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot); else boot();
})();
