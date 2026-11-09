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
  var lastAux = '';
  function selectedAux() {
    var p = HP.palette(HP.state);
    return String((HP.state && HP.state.aux) || (p && p.aux) || '').toUpperCase();
  }
  function broadcastAux() {
    var hex = selectedAux();
    if (!/^#[0-9A-F]{6}$/.test(hex) || hex === lastAux) return;
    lastAux = hex;
    try { parent.postMessage({ hcdtAuxChange: hex }, '*'); } catch (_) {}
  }
  function applyParentAux(hex) {
    hex = String(hex || '').toUpperCase();
    var p = (HP.brand.palettes || []).filter(function (x) { return String(x.aux).toUpperCase() === hex; })[0];
    if (!p || !HP.state) return false;
    document.documentElement.style.setProperty('--ui-sub', p.aux);
    document.documentElement.style.setProperty('--hx-ui', p.aux);
    lastAux = String(p.aux).toUpperCase();
    if (HP.state.palette === p.id && !HP.state.aux) return false;
    HP.state.palette = p.id;
    HP.state.aux = '';
    return true;
  }
  function schedule() {
    if (queued) return;
    queued = true;
    requestAnimationFrame(function () { queued = false; HP.render(); broadcastAux(); });
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
      var d = e.data || {}, next = d.hcdtPosterType, changed = false;
      if (next === 'defense' || next === 'seminar' || next === 'custom') {
        if (next !== HP.state.type) {
          HP.state = HP.initialState(next, next === 'custom' ? 3 : Math.max(3, HP.state.speakers.length));
          changed = true;
        }
      }
      if (d.hcdtAux) changed = applyParentAux(d.hcdtAux) || changed;
      if (!changed) return;
      HP.ui.rebuild(); HP.render(); HP.resetHistory(); HP.setGrid(false); broadcastAux();
    });
    // 글꼴이 다 불러와지면 글자 맞춤을 한 번 더 한다
    lastAux = selectedAux();
    if (document.fonts && document.fonts.ready) document.fonts.ready.then(schedule);
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot); else boot();
})();
