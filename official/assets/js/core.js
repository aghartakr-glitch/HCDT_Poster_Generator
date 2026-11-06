/* 공용 도구: 네임스페이스, DOM 도우미, 난수, 색 계산, 상태/이벤트/저장 */
(function () {
  'use strict';
  var boot = window.HCDT_POSTER;
  var HP = window.HP = { brand: boot.brand, assets: boot.assets, layouts: {}, order: [], fx: {}, ui: {} };

  HP.q = function (s, r) { return (r || document).querySelector(s); };
  HP.qa = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };

  // el('div', {class:'a', text:'..', onclick:fn}, [자식...])
  HP.el = function (tag, attrs, kids) {
    var e = document.createElement(tag), k, v;
    attrs = attrs || {};
    for (k in attrs) {
      v = attrs[k];
      if (v === null || v === undefined || v === false) continue;
      if (k === 'class') e.className = v;
      else if (k === 'text') e.textContent = v;
      else if (k === 'html') e.innerHTML = v;
      else if (k.slice(0, 2) === 'on') e.addEventListener(k.slice(2), v);
      else e.setAttribute(k, v === true ? '' : v);
    }
    (kids || []).forEach(function (c) {
      if (c === null || c === undefined) return;
      e.appendChild(typeof c === 'string' ? document.createTextNode(c) : c);
    });
    return e;
  };

  HP.clamp = function (v, a, b) { return Math.max(a, Math.min(b, v)); };
  HP.uid = function () { return 's' + Math.random().toString(36).slice(2, 9); };
  HP.esc = function (s) {
    return String(s).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; });
  };

  // 시드 난수 (같은 시드면 같은 배치가 나온다)
  HP.rng = function (seed) {
    var a = seed >>> 0;
    return function () {
      var t = (a = (a + 0x6D2B79F5) >>> 0);
      t = Math.imul(t ^ (t >>> 15), t | 1);
      t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
  };
  HP.hash = function (s) {
    var h = 2166136261, i;
    for (i = 0; i < s.length; i++) h = Math.imul(h ^ s.charCodeAt(i), 16777619);
    return h >>> 0;
  };

  // 색: '#RRGGBB' <-> [r,g,b]
  HP.rgb = function (hex) {
    var h = String(hex).replace('#', '');
    if (h.length === 3) h = h.replace(/./g, '$&$&');
    return [0, 2, 4].map(function (i) { return parseInt(h.substr(i, 2), 16) || 0; });
  };
  HP.hex = function (c) {
    return '#' + c.map(function (v) { return ('0' + Math.round(HP.clamp(v, 0, 255)).toString(16)).slice(-2); }).join('').toUpperCase();
  };
  HP.mix = function (a, b, t) {
    var x = HP.rgb(a), y = HP.rgb(b);
    return HP.hex(x.map(function (v, i) { return v + (y[i] - v) * t; }));
  };
  // 상대 휘도 (QR/글자 대비 확인용)
  HP.lum = function (hex) {
    var c = HP.rgb(hex).map(function (v) { v /= 255; return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4); });
    return 0.2126 * c[0] + 0.7152 * c[1] + 0.0722 * c[2];
  };

  // 상태 변경 알림
  var subs = [], saveTimer = null;
  HP.on = function (fn) { subs.push(fn); };
  HP.emit = function () {
    subs.forEach(function (f) { f(HP.state); });
    clearTimeout(saveTimer);
    saveTimer = setTimeout(HP.save, 500);
  };
  HP.set = function (patch, quiet) {
    Object.keys(patch).forEach(function (k) { HP.state[k] = patch[k]; });
    if (!quiet) HP.emit();
  };

  var KEY = 'hp-state-v1';
  HP.save = function () {
    try { localStorage.setItem(KEY, JSON.stringify(HP.state)); } catch (e) { /* 용량 초과 등은 무시 */ }
  };
  HP.restore = function () {
    try { return JSON.parse(localStorage.getItem(KEY) || 'null'); } catch (e) { return null; }
  };
  HP.forget = function () { try { localStorage.removeItem(KEY); } catch (e) { /* 무시 */ } };
})();
