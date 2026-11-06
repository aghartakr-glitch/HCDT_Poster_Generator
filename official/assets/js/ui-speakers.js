/* 편집기 2/2: 발표자 목록(3~15명), QR/안내문 */
(function () {
  'use strict';
  var HP = window.HP, el = HP.el, K = HP.ui;

  function nameOf(sp) {
    var l = sp.lines.filter(function (x) { return x.s === 'h3'; })[0] || sp.lines[0];
    return (l && l.t) || 'Speaker';
  }

  function speakerCard(sp, i) {
    var st = HP.state, n = st.speakers.length, lines = el('div', { class: 'inner', style: 'padding:0' });
    function move(d) { var j = i + d, a = st.speakers; if (j < 0 || j >= n) return; a.splice(j, 0, a.splice(i, 1)[0]); K.rebuild(); HP.emit(); }
    function drawLines() {
      lines.innerHTML = '';
      sp.lines.forEach(function (ln, k) {
        lines.appendChild(K.lineRow(ln, function () { HP.emit(); }, function () { sp.lines.splice(k, 1); drawLines(); HP.emit(); }));
      });
      lines.appendChild(K.btn('+ Add line', function () { sp.lines.push({ t: 'New line', s: 'small', c: 'ac' }); drawLines(); HP.emit(); }, 'mini'));
    }
    drawLines();
    var photoRow = el('div', { class: 'row' }, [
      K.file(sp.photo ? 'Replace photo' : 'Upload photo', 'image/*', function (f) {
        HP.readPhotoFile(f).then(function (url) { sp.photo = url; sp.zoom = 1; sp.px = 0.5; sp.py = 0.3; K.rebuild(); HP.emit(); });
      }),
      sp.photo ? K.btn('Remove photo', function () { sp.photo = null; K.rebuild(); HP.emit(); }, 'mini') : el('span', { class: 'hint', text: 'Placeholder shown' })]);
    return el('details', { class: 'sp', 'data-id': sp.id }, [
      el('summary', null, [el('span', { class: 'no', text: i + 1 }), el('span', { class: 'nm', text: nameOf(sp) })]),
      el('div', { class: 'inner' }, [
        el('div', { class: 'row' }, [K.btn('↑', function () { move(-1); }, 'mini'), K.btn('↓', function () { move(1); }, 'mini'),
          K.btn('Duplicate', function () {
            if (n >= HP.MAXN) return;
            var c = JSON.parse(JSON.stringify(sp)); c.id = HP.uid(); st.speakers.splice(i + 1, 0, c); K.rebuild(); HP.emit();
          }, 'mini'),
          K.btn('Delete', function () { st.speakers.splice(i, 1); K.rebuild(); HP.emit(); }, 'mini')]),
        photoRow,
        sp.photo ? K.field('Zoom', K.range(1, 3, 0.05, sp.zoom, function (v) { sp.zoom = v; HP.emit(); })) : null,
        el('div', { class: 'row' }, [K.check('Online (Zoom tag)', sp.online, function (v) { sp.online = v; HP.emit(); }),
          K.check('In Korean (dot)', sp.korean, function (v) { sp.korean = v; HP.emit(); })]),
        st.groups ? K.field('Group heading (e.g. April)', K.text(sp.group, function (v) { sp.group = v; HP.emit(); })) : null,
        K.field('Own QR link (optional)', K.text(sp.link, function (v) { sp.link = v; HP.emit(); }, 'https://…')),
        lines])
    ]);
  }

  K.speakerSection = function () {
    var st = HP.state, n = st.speakers.length, list = el('div', { class: 'body', style: 'padding:0;display:grid;gap:8px' });
    st.speakers.forEach(function (sp, i) { list.appendChild(speakerCard(sp, i)); });
    var add = K.btn('+ Add speaker', function () {
      if (st.speakers.length >= HP.MAXN) return;
      st.speakers.push(HP.newSpeaker(st.type, st.speakers.length)); K.rebuild(); HP.emit();
    }, 'pri');
    if (n >= HP.MAXN) add.disabled = true;
    return K.section('Speakers (' + n + ' of ' + HP.MAXN + ')', [
      n < 3 ? el('div', { class: 'hint', text: 'Layouts are designed for 3–15 speakers.' }) : null,
      K.check('Use group headings (e.g. month names)', st.groups, function (v) { HP.set({ groups: v }); K.rebuild(); }),
      list, add]);
  };

  K.qrSection = function () {
    var st = HP.state, rows = st.qr.map(function (q) {
      return el('div', { class: 'f' }, [
        K.check(q.id === 'zoom' ? 'Zoom / join link' : 'More-information link', q.on, function (v) { q.on = v; HP.emit(); }),
        K.text(q.label, function (v) { q.label = v; HP.emit(); }, 'Caption under the code'),
        K.text(q.url, function (v) { q.url = v; HP.emit(); }, 'https://…  (the QR code is made automatically)'),
        el('div', { class: 'row' }, [K.file(q.img ? 'Replace QR image' : 'Or upload a QR image', 'image/*', function (f) {
          HP.readPhotoFile(f).then(function (u) { q.img = u; K.rebuild(); HP.emit(); });
        }), q.img ? K.btn('Use generated', function () { q.img = null; K.rebuild(); HP.emit(); }, 'mini') : null])]);
    });
    return K.section('QR codes & note', rows.concat([
      K.field('QR color', K.seg([['ink', 'Black'], ['accent', 'Purple']], st.qrColor, function (v) { HP.set({ qrColor: v }); })),
      K.field('Footnote', K.area(st.notes, function (v) { HP.set({ notes: v }); }, 'e.g. Talks marked with a dot are in Korean.'))]));
  };
})();
