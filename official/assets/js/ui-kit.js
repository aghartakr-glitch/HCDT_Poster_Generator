/* 편집기 부품: 입력칸, 선택칸, 슬라이더, 스위치 등 작은 도구 모음 */
(function () {
  'use strict';
  var HP = window.HP, el = HP.el, K = HP.ui;

  // 값이 바뀌면 fn(값)을 부른다. 입력 중에는 포커스를 잃지 않도록 편집기를 다시 만들지 않는다.
  K.field = function (label, ctrl, hint) {
    return el('div', { class: 'f' }, [el('label', { text: label }), ctrl, hint ? el('div', { class: 'hint', text: hint }) : null]);
  };
  K.text = function (val, fn, ph) {
    return el('input', { type: 'text', value: val || '', placeholder: ph || '', oninput: function (e) { fn(e.target.value); } });
  };
  K.area = function (val, fn, ph) {
    var t = el('textarea', { placeholder: ph || '', oninput: function (e) { fn(e.target.value); } });
    t.value = val || '';
    return t;
  };
  K.select = function (opts, val, fn) {
    var s = el('select', { onchange: function (e) { fn(e.target.value); } }, opts.map(function (o) {
      return el('option', { value: o[0], text: o[1], selected: String(o[0]) === String(val) });
    }));
    return s;
  };
  K.range = function (min, max, step, val, fn) {
    return el('input', { type: 'range', min: min, max: max, step: step, value: val, oninput: function (e) { fn(parseFloat(e.target.value)); } });
  };
  K.check = function (label, val, fn) {
    return el('label', { class: 'chk' }, [el('input', { type: 'checkbox', checked: !!val, onchange: function (e) { fn(e.target.checked); } }), label]);
  };
  K.btn = function (label, fn, cls, title) {
    return el('button', { type: 'button', class: cls || '', title: title || '', onclick: fn, text: label });
  };
  // 버튼 묶음(하나만 선택)
  K.seg = function (opts, val, fn) {
    var wrap = el('div', { class: 'seg' });
    opts.forEach(function (o) {
      var b = el('button', { type: 'button', class: String(o[0]) === String(val) ? 'on' : '', text: o[1], onclick: function () {
        HP.qa('button', wrap).forEach(function (x) { x.className = ''; });
        b.className = 'on';
        fn(o[0]);
      } });
      wrap.appendChild(b);
    });
    return wrap;
  };
  K.section = function (title, kids, open) {
    return el('details', { class: 'sec', open: open !== false }, [el('summary', { text: title }), el('div', { class: 'body' }, kids)]);
  };
  K.file = function (label, accept, fn) {
    var inp = el('input', { type: 'file', accept: accept, style: 'display:none', onchange: function (e) {
      if (e.target.files[0]) fn(e.target.files[0]);
      e.target.value = '';
    } });
    return el('span', null, [K.btn(label, function () { inp.click(); }, 'mini'), inp]);
  };
  K.download = function (name, blob) {
    var a = el('a', { href: URL.createObjectURL(blob), download: name });
    document.body.appendChild(a); a.click();
    setTimeout(function () { URL.revokeObjectURL(a.href); a.remove(); }, 500);
  };
})();
