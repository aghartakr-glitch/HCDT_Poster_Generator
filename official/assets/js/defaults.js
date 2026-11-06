/* 기본값: 포스터 종류별 글줄 틀, 예시 문구, 최초 상태 */
(function () {
  'use strict';
  var HP = window.HP;

  HP.formats = { portrait: { w: 1000, h: 1414 }, landscape: { w: 1414, h: 1000 } };
  HP.papers = { A4: [210, 297], A3: [297, 420], A2: [420, 594], A1: [594, 841] };
  HP.MAXN = 15;

  // 글줄: t=내용, s=글자 스타일(h1..small), c=색(ac 강조색/fg 본문색), w=굵기(없으면 스타일 기본값)
  HP.types = {
    defense: {
      label: 'Public Defense',
      head: [{ t: 'Public Defense', s: 'h1' }, { t: 'Design Department 2026 Fall', s: 'h2' }],
      lines: [{ t: "Master's thesis defense", s: 'small' }, { t: 'Name', s: 'h3' }, { t: 'Thesis title', s: 'body', w: 500 },
        { t: '18 June (WED) 17:00', s: 'small' }, { t: 'E104 1005 (TD Room)', s: 'small' }]
    },
    seminar: {
      label: 'Seminar series',
      head: [{ t: '2026 Fall', s: 'h3' }, { t: 'Design Seminars', s: 'h1' }],
      lines: [{ t: 'Talk title', s: 'h4', w: 400 }, { t: 'Speaker name', s: 'h3' }, { t: 'Role, Affiliation', s: 'small' },
        { t: 'SEP 9 (TUE) 13:00', s: 'small', w: 700 }, { t: 'E104 1005 (TD Room)', s: 'small', w: 700 }]
    },
    custom: {
      label: 'Custom',
      head: [{ t: 'Title', s: 'h1' }, { t: 'Subtitle', s: 'h2' }],
      lines: [{ t: 'Name', s: 'h3' }, { t: 'Details', s: 'body' }]
    }
  };

  var NAMES = ['Alex Kim', 'Mina Park', 'Daniel Lee', 'Sora Choi', 'Jonas Weber', 'Aiko Tanaka', 'Priya Nair', 'Lucas Moreau',
    'Hana Jung', 'Omar Haddad', 'Elena Rossi', 'Minjun Seo', 'Chloe Martin', 'Tariq Aziz', 'Yuna Han'];
  var TITLES = ['Designing Calm Technology for Shared Homes', 'Emotion-Aware Interfaces for Autonomous Vehicles',
    'Participatory Futures in Public Services', 'How Robots Earn Trust in Small Daily Moments',
    'Data Physicalization for Climate Awareness', 'A Pattern Language for Slow Mobility',
    'Wearables that Respect Attention', 'Voice, Touch and Memory in Elder Care', 'Speculative Craft for Ageing Societies',
    'Material Exploration of Biodegradable Interfaces', 'Gestures at Home: Shaping Smart Speakers', 'Design Research with Teenagers',
    'Inclusive Navigation for Low Vision', 'Learning to Prototype with Generative AI', 'Playful Rehearsal of Hard Conversations'];
  var AFFIL = ['Professor, KAIST, KR', 'Founder, Studio North, DE', 'Researcher, Aalto University, FI', 'Designer, Samsung Electronics, KR',
    'Lecturer, University of Exeter, UK', 'Head of Design, OP Financial, FI', 'Assistant Professor, Hongik University, KR'];
  var DAYS = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'], MON = ['SEP', 'OCT', 'NOV', 'DEC'];

  // 예시 문구를 글줄 틀에 맞춰 채운다 (type별 칸 순서가 다르다)
  HP.sampleLines = function (type, i) {
    var d = new Date(2026, 8, 8 + 7 * i), tm = ['13:00', '15:00', '17:15'][i % 3];
    var date = MON[d.getMonth() - 8 < 0 ? 0 : Math.min(3, d.getMonth() - 8)] + ' ' + d.getDate() + ' (' + DAYS[d.getDay()] + ') ' + tm;
    var tpl = HP.types[type].lines.map(function (l) { return Object.assign({ c: 'ac' }, l); });
    var vals = {
      defense: [i % 3 === 2 ? 'Doctoral thesis defense' : "Master's thesis defense", NAMES[i % 15], TITLES[i % 15], date, 'E104 1005 (TD Room)'],
      seminar: [TITLES[(i + 3) % 15], NAMES[i % 15], AFFIL[i % 7], date, i % 4 === 3 ? 'Online (Zoom)' : 'E104 1005 (TD Room)'],
      custom: [NAMES[i % 15], TITLES[i % 15]]
    }[type];
    tpl.forEach(function (l, k) { if (vals[k] !== undefined) l.t = vals[k]; });
    return tpl;
  };

  HP.newSpeaker = function (type, i) {
    return { id: HP.uid(), photo: null, zoom: 1, px: 0.5, py: 0.3, online: false, korean: false, group: '', link: '',
      lines: HP.sampleLines(type, i) };
  };

  HP.initialState = function (type, n) {
    var t = HP.types[type || 'defense'], b = HP.brand, sp = [], i;
    for (i = 0; i < (n || 5); i++) sp.push(HP.newSpeaker(type || 'defense', i));
    return {
      v: 1, type: type || 'defense', format: 'portrait', paper: 'A3', scheme: 'light',
      palette: b.defaultPalette || '001', aux: '', layout: 'auto', seed: 2026, logo: b.defaultLogo || 'long', logoMap: 'auto',
      logoCustom: null, photo: { mode: 'halftone', contrast: 1.15, dot: 7, shape: 'auto', tone: 'white' },
      head: t.head.map(function (h) { return Object.assign({ c: 'ac' }, h); }), notes: '', groups: false,
      qr: [{ id: 'zoom', label: 'Join online (Zoom)', url: '', on: false, img: null },
        { id: 'info', label: b.footerLabel || 'More information', url: b.infoUrl || '', on: true, img: null }],
      qrColor: 'ink', speakers: sp
    };
  };
})();
