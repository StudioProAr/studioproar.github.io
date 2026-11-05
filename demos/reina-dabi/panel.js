/* Panel único de Reina Dabi (demo): Pedidos, Estadísticas y Editar web */
(function () {
  var $ = function (id) { return document.getElementById(id); };
  var esc = RD.esc, plata = RD.plata, DB = RD.cargar();
  var DIAS = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'], MESES = ['ene', 'feb', 'mar', 'abr', 'may', 'jun', 'jul', 'ago', 'sep', 'oct', 'nov', 'dic'];
  function parse(s) { var p = s.split('-'); return new Date(+p[0], +p[1] - 1, +p[2]); }
  function fmt(s) { if (!s) return 'Sin fecha'; var d = parse(s); return DIAS[d.getDay()] + ' ' + String(d.getDate()).padStart(2, '0') + '/' + String(d.getMonth() + 1).padStart(2, '0'); }
  function guardar() { RD.guardar(DB); }
  function confirmar(txt, cb) { $('mTxt').textContent = txt; $('modal').hidden = false; $('mSi').onclick = function () { $('modal').hidden = true; cb(); }; $('mNo').onclick = function () { $('modal').hidden = true; }; }
  function kpi(l, v, n) { return '<div class="kpi"><div class="l">' + l + '</div><div class="v">' + v + '</div><div class="n">' + n + '</div></div>'; }
  function fuenteTxt(o) { return o.origen === 'web' ? 'web' + (o.fuente ? ' · ' + (RD.ORIGENES[o.fuente] || o.fuente) : '') : ''; }

  // ---------- pestañas ----------
  var tab = 'pedidos';
  document.querySelector('.tabs').onclick = function (e) {
    var b = e.target.closest('[data-t]'); if (!b) return; tab = b.dataset.t;
    document.querySelectorAll('.tab').forEach(function (x) { x.setAttribute('aria-selected', String(x === b)); });
    ['pedidos', 'stats', 'editar'].forEach(function (t) { $('v-' + t).hidden = t !== tab; }); render();
  };
  $('reset').onclick = function () { confirmar('¿Volver la demo a los datos de ejemplo? Se borra lo que cargaste.', function () { DB = RD.reiniciar(); salir(); render(); }); };

  // ---------- selector de color (con combinado de hasta 3) ----------
  var C = { color: 'rojo', mezcla: {} };
  var LISTA = Object.keys(RD.COLORES).concat(['combinado', 'eleccion']);
  LISTA.forEach(function (k) {
    var b = document.createElement('button'); b.type = 'button'; b.className = 'sw'; b.dataset.c = k;
    b.style.background = RD.color(k)[1]; b.title = RD.color(k)[0]; b.setAttribute('aria-label', RD.color(k)[0]);
    b.onclick = function () { C.color = k; pintarColor(); }; $('fSw').appendChild(b);
  });
  function qty() { return Math.max(1, parseInt($('fQty').value, 10) || 1); }
  function suma() { var t = 0; for (var k in C.mezcla) t += C.mezcla[k]; return t; }
  $('fMz').onclick = function (e) {
    var b = e.target.closest('button'); if (!b) return; var k;
    if ((k = b.dataset.add)) { if (C.mezcla[k] > 0) delete C.mezcla[k]; else if (Object.keys(C.mezcla).length < RD.MAX_MIX) C.mezcla[k] = 1; }
    else if ((k = b.dataset.mas)) C.mezcla[k]++;
    else if ((k = b.dataset.menos)) { C.mezcla[k]--; if (C.mezcla[k] <= 0) delete C.mezcla[k]; }
    pintarColor();
  };
  function pintarColor() {
    $('fColNom').textContent = RD.color(C.color)[0];
    [].forEach.call($('fSw').children, function (b) { b.setAttribute('aria-pressed', String(b.dataset.c === C.color)); });
    var box = $('fMz'); if (C.color !== 'combinado') { box.hidden = true; return; }
    var q = qty(), t = suma(), lleno = Object.keys(C.mezcla).length >= RD.MAX_MIX, cls = t === q ? 'ok' : (t > q ? 'mal' : '');
    var h = '<div class="mz-t ' + cls + '">Combinación (hasta ' + RD.MAX_MIX + ' colores): ' + t + ' de ' + q + ' rosas' + (t === q ? ' ✓' : t < q ? ' · faltan ' + (q - t) : ' · sobran ' + (t - q)) + '</div><div class="sws">';
    Object.keys(RD.COLORES).forEach(function (k) { var on = C.mezcla[k] > 0; h += '<button type="button" class="sw" data-add="' + k + '" style="background:' + RD.COLORES[k][1] + '" title="' + RD.COLORES[k][0] + '" aria-label="' + RD.COLORES[k][0] + '" aria-pressed="' + on + '"' + (lleno && !on ? ' disabled' : '') + '></button>'; });
    h += '</div>';
    Object.keys(C.mezcla).forEach(function (k) { h += '<div class="mz-f"><span class="dot" style="background:' + RD.COLORES[k][1] + '"></span><span>' + RD.COLORES[k][0] + '</span><button type="button" data-menos="' + k + '" aria-label="Una menos">−</button><b>' + C.mezcla[k] + '</b><button type="button" data-mas="' + k + '" aria-label="Una más">+</button></div>'; });
    box.innerHTML = h; box.hidden = false;
  }

  // ---------- formulario ----------
  var F = { tipo: 'Punto de encuentro', preM: false, senM: false, editId: null, sol: null };
  RD.ENTREGAS.forEach(function (t) { var b = document.createElement('button'); b.type = 'button'; b.textContent = t; b.dataset.v = t; b.onclick = function () { F.tipo = t; pintarTipo(); }; $('fEntTipo').appendChild(b); });
  function pintarTipo() { [].forEach.call($('fEntTipo').children, function (b) { b.setAttribute('aria-pressed', String(b.dataset.v === F.tipo)); }); }
  function calc() {
    if (!F.preM) $('fPre').value = RD.precio(qty());
    if (!F.senM) $('fSen').value = RD.sena(+$('fPre').value || 0);
    $('fDebe').textContent = plata(Math.max(0, (+$('fPre').value || 0) - (+$('fSen').value || 0)));
  }
  $('fQty').oninput = function () { F.preM = false; F.senM = false; calc(); pintarColor(); };
  $('fPre').oninput = function () { F.preM = true; calc(); };
  $('fSen').oninput = function () { F.senM = true; calc(); };
  function llenar(o) {
    $('fEnt').value = o.entrega || ''; $('fQty').value = o.qty || 12; $('fOca').value = o.ocasion || 'Cumpleaños';
    C.color = o.color || 'rojo'; C.mezcla = o.mezcla ? JSON.parse(JSON.stringify(o.mezcla)) : {};
    $('fNom').value = o.nombre || ''; $('fTel').value = o.tel || ''; $('fLug').value = o.lugar || ''; $('fObs').value = o.observaciones || '';
    F.tipo = o.entregaTipo || 'Punto de encuentro'; pintarTipo();
    if (o.precio != null) { $('fPre').value = o.precio; $('fSen').value = o.pagado; F.preM = true; F.senM = true; } else { F.preM = false; F.senM = false; }
    calc(); pintarColor();
  }
  function salir() {
    F.editId = null; F.sol = null; llenar({});
    $('fEnt').min = RD.dias(0);
    $('pfTit').textContent = 'Nuevo pedido'; $('pfSub').textContent = 'Carga manual (pedidos que llegan por WhatsApp o en persona)';
    $('fSave').textContent = 'Guardar pedido'; $('fCancel').hidden = true; $('fErr').textContent = '';
  }
  $('fCancel').onclick = salir;
  $('pf').onsubmit = function (ev) {
    ev.preventDefault(); var q = qty(), e = '';
    if (!$('fEnt').value) e = 'Falta la fecha de entrega.';
    else if (!$('fNom').value.trim()) e = 'Falta el nombre.';
    else if (C.color === 'combinado' && suma() !== q) e = 'La combinación tiene ' + suma() + ' rosas y el pedido ' + q + '. Tienen que coincidir.';
    $('fErr').textContent = e; if (e) return;
    var d = { entrega: $('fEnt').value, nombre: $('fNom').value.trim(), tel: $('fTel').value.trim(), lugar: $('fLug').value.trim(), entregaTipo: F.tipo, qty: q,
      ocasion: $('fOca').value, color: C.color, mezcla: C.color === 'combinado' ? JSON.parse(JSON.stringify(C.mezcla)) : null,
      precio: +$('fPre').value || 0, pagado: +$('fSen').value || 0, observaciones: $('fObs').value.trim() };
    if (F.editId) { var o = DB.orders.filter(function (x) { return x.id === F.editId; })[0]; if (o) Object.assign(o, d); }
    else {
      d.id = RD.uid(); d.creado = RD.dias(0); d.estado = 'Reservado'; d.origen = F.sol ? 'web' : 'manual';
      if (F.sol) { var sid = F.sol.id; d.fuente = F.sol.fuente; DB.solicitudes = DB.solicitudes.filter(function (s) { return s.id !== sid; }); }
      DB.orders.push(d);
    }
    guardar(); salir(); render();
  };

  // ---------- bandeja de la web ----------
  function pintarSol() {
    var s = DB.solicitudes.slice().sort(function (a, b) { return a.recibido < b.recibido ? 1 : -1; });
    $('bandeja').hidden = !s.length;
    $('solList').innerHTML = s.map(function (x) {
      var r = new Date(x.recibido), cuando = String(r.getDate()).padStart(2, '0') + '/' + String(r.getMonth() + 1).padStart(2, '0') + ' ' + String(r.getHours()).padStart(2, '0') + ':' + String(r.getMinutes()).padStart(2, '0');
      return '<div class="sol" data-sid="' + x.id + '"><div class="t"><span>' + esc(x.nombre || 'Sin nombre') + ' · ' + x.qty + ' rosas</span><span class="tag t-web">' + esc(RD.ORIGENES[x.fuente] || 'Web') + ' · ' + cuando + '</span></div>' +
        '<div class="d">' + RD.puntos(x) + esc(RD.colorTxt(x)) + ' · ' + esc(x.ocasion) + ' · envoltorio ' + esc(x.envoltorio) + '</div>' +
        '<div class="d">' + (x.cinta ? '🎀 Cinta: "' + esc(x.cinta) + '"' : 'Sin cinta') + (x.extras && x.extras.length ? ' · Extras: ' + esc(x.extras.join(', ')) : '') + '</div>' +
        '<div class="d">Para ' + (x.entrega ? fmt(x.entrega) : 'fecha a coordinar') + ' · ' + esc(x.entregaTipo) + '</div>' +
        (x.comentarios ? '<div class="d"><i>📝 ' + esc(x.comentarios) + '</i></div>' : '') +
        '<div class="acc"><button type="button" class="btn sm" data-sa="ok">Aceptar</button><button type="button" class="btn ghost sm" data-sa="no">Descartar</button></div></div>';
    }).join('');
  }
  $('solList').onclick = function (e) {
    var b = e.target.closest('[data-sa]'); if (!b) return;
    var id = b.closest('[data-sid]').dataset.sid, s = DB.solicitudes.filter(function (x) { return x.id === id; })[0]; if (!s) return;
    if (b.dataset.sa === 'no') { confirmar('¿Descartar el pedido de ' + (s.nombre || 'sin nombre') + '?', function () { DB.solicitudes = DB.solicitudes.filter(function (x) { return x.id !== id; }); guardar(); render(); }); return; }
    F.editId = null; F.sol = s;
    var obs = ['Envoltorio ' + s.envoltorio, s.cinta ? 'Cinta: "' + s.cinta + '"' : '', s.extras && s.extras.length ? 'Extras: ' + s.extras.join(', ') : '', s.comentarios].filter(Boolean).join(' · ');
    llenar({ entrega: s.entrega, qty: s.qty, ocasion: s.ocasion, color: s.color, mezcla: s.mezcla, nombre: s.nombre, entregaTipo: s.entregaTipo, observaciones: obs });
    $('pfTit').textContent = 'Aceptar pedido de la web'; $('pfSub').textContent = 'Revisá el precio y la seña' + (s.entrega ? '' : ', poné la fecha') + ' y confirmalo.';
    $('fSave').textContent = 'Confirmar pedido'; $('fCancel').hidden = false; $('fErr').textContent = '';
    $('pf').scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  // ---------- lista de pedidos ----------
  var lTab = 'activos';
  function debe(o) { return Math.max(0, (o.precio || 0) - (o.pagado || 0)); }
  function pintarLista() {
    var t = RD.hoy(), L = DB.orders.filter(function (o) { return lTab === 'todos' ? true : lTab === 'entregados' ? o.estado === 'Entregado' : o.estado !== 'Entregado'; })
      .sort(function (a, b) { return a.entrega < b.entrega ? -1 : 1; });
    if (lTab === 'entregados') L.reverse();
    $('lista').innerHTML = L.length ? L.map(function (o) {
      var diff = Math.round((parse(o.entrega) - t) / 864e5), cls = 't-ok', txt = 'en ' + diff + ' días';
      if (o.estado === 'Entregado') { cls = 't-done'; txt = 'entregado'; } else if (diff < 0) { cls = 't-bad'; txt = 'atrasado'; } else if (diff === 0) { cls = 't-bad'; txt = 'hoy'; } else if (diff === 1) { cls = 't-bad'; txt = 'mañana'; } else if (diff <= 2) cls = 't-bad'; else if (diff <= 7) cls = 't-warn';
      var d = debe(o), ft = fuenteTxt(o);
      return '<div class="ped" data-id="' + o.id + '"><div><div class="f">' + fmt(o.entrega) + '</div><span class="tag ' + cls + '">' + txt + '</span></div>' +
        '<div><div class="who">' + esc(o.nombre) + (ft ? ' <span class="tag t-web">' + esc(ft) + '</span>' : '') + '</div><div class="w">' + esc([o.lugar, o.entregaTipo, o.tel].filter(Boolean).join(' · ')) + '</div>' +
        '<div style="margin-top:4px">' + RD.puntos(o) + '<b>' + o.qty + '</b> · ' + esc(RD.colorTxt(o)) + ' · <span class="w">' + esc(o.ocasion || '') + '</span></div>' + (o.observaciones ? '<div class="obs">📝 ' + esc(o.observaciones) + '</div>' : '') + '</div>' +
        '<div class="der"><div>' + plata(o.precio) + '</div><div class="w">seña ' + plata(o.pagado) + '</div>' + (d > 0 ? '<div style="color:var(--bad);font-weight:800">debe ' + plata(d) + '</div>' : '<div class="w">pagado</div>') +
        '<div class="acc"><button type="button" class="btn ghost sm" data-a="estado" title="Pasar al siguiente estado">' + o.estado + ' ›</button>' + (d > 0 ? '<button type="button" class="lk" data-a="pay">Cobrar</button>' : '') + '<button type="button" class="lk" data-a="edit">Editar</button><button type="button" class="lk" data-a="del">Borrar</button></div></div></div>';
    }).join('') : '<div class="empty">No hay pedidos acá.</div>';
  }
  $('lTabs').onclick = function (e) { var b = e.target.closest('[data-l]'); if (!b) return; lTab = b.dataset.l; [].forEach.call(this.children, function (x) { x.setAttribute('aria-pressed', String(x === b)); }); pintarLista(); };
  $('lista').onclick = function (e) {
    var b = e.target.closest('[data-a]'); if (!b) return; var id = b.closest('[data-id]').dataset.id, o = DB.orders.filter(function (x) { return x.id === id; })[0]; if (!o) return; var a = b.dataset.a;
    if (a === 'estado') { o.estado = RD.ESTADOS[(RD.ESTADOS.indexOf(o.estado) + 1) % RD.ESTADOS.length]; guardar(); render(); }
    else if (a === 'pay') { o.pagado = o.precio; guardar(); render(); }
    else if (a === 'del') confirmar('¿Borrar el pedido de ' + o.nombre + '? No se puede deshacer.', function () { DB.orders = DB.orders.filter(function (x) { return x.id !== id; }); guardar(); render(); });
    else if (a === 'edit') { F.editId = id; F.sol = null; llenar(o); $('pfTit').textContent = 'Editar pedido'; $('pfSub').textContent = o.origen === 'web' ? 'Llegó desde la web' : 'Carga manual'; $('fSave').textContent = 'Guardar cambios'; $('fCancel').hidden = false; $('pf').scrollIntoView({ behavior: 'smooth', block: 'start' }); }
  };

  // ---------- barras ----------
  function barras(m, nombre, opt) {
    opt = opt || {}; var ks = Object.keys(m).filter(function (k) { return m[k] > 0; });
    if (!opt.orden) ks.sort(function (a, b) { return m[b] - m[a]; }); else ks = opt.orden.filter(function (k) { return m[k] > 0; });
    if (!ks.length) return '<div class="empty">Todavía no hay datos.</div>';
    var mx = Math.max.apply(null, ks.map(function (k) { return m[k]; })), tot = ks.reduce(function (s, k) { return s + m[k]; }, 0);
    return ks.map(function (k) {
      var n = nombre ? nombre(k) : esc(k);
      return '<div class="bar"><div>' + n + '</div><div class="t"><div style="width:' + Math.max(3, Math.round(m[k] / mx * 100)) + '%"></div></div><b>' + m[k] + (opt.pct ? ' <small>' + Math.round(m[k] / tot * 100) + '%</small>' : '') + '</b></div>';
    }).join('') + (opt.total ? '<div class="line"><span>' + opt.total + '</span><b>' + tot + '</b></div>' : '');
  }
  function nomColor(k) { var c = RD.color(k); return '<span class="dot" style="background:' + c[1] + '"></span>' + c[0]; }

  function pintarPedidos() {
    pintarSol(); pintarLista();
    var act = DB.orders.filter(function (o) { return o.estado !== 'Entregado'; }), mes = RD.dias(0).slice(0, 7);
    var rm = DB.orders.filter(function (o) { return o.entrega.slice(0, 7) === mes; }).reduce(function (s, o) { return s + o.qty; }, 0);
    var prox = act.slice().sort(function (a, b) { return a.entrega < b.entrega ? -1 : 1; })[0];
    $('kpis').innerHTML = kpi('Pedidos activos', act.length, prox ? 'próxima: ' + fmt(prox.entrega) : 'sin entregas') + kpi('Rosas del mes', rm, 'entregas de ' + MESES[+mes.slice(5) - 1]) +
      kpi('Falta cobrar', plata(DB.orders.reduce(function (s, o) { return s + debe(o); }, 0)), 'en todos los pedidos') + kpi('Pedidos de la web', DB.solicitudes.length, 'esperando respuesta');
    var ct = {}; act.forEach(function (o) { if (o.estado === 'Listo') return; var r = RD.reparto(o); for (var k in r) ct[k] = (ct[k] || 0) + r[k]; });
    $('colores').innerHTML = barras(ct, nomColor, { total: 'Total a armar (rosas)' });
  }

  // ---------- estadísticas ----------
  var rango = 14;
  $('rango').onclick = function (e) { var b = e.target.closest('[data-r]'); if (!b) return; rango = +b.dataset.r; [].forEach.call(this.children, function (x) { x.setAttribute('aria-pressed', String(x === b)); }); pintarStats(); };
  function pintarStats() {
    var desde = rango ? parse(RD.dias(1 - rango)).getTime() : 0, E = DB.eventos.filter(function (e) { return e.t >= desde; });
    function de(tipo) { return E.filter(function (e) { return e.tipo === tipo; }); }
    var V = de('visita'), A = de('armador'), P = de('pedido'), W = de('wa');
    var conv = V.length ? (P.length / V.length * 100) : 0;
    $('sKpis').innerHTML = kpi('Visitas', V.length, rango ? 'últimos ' + rango + ' días' : 'desde el inicio') + kpi('Armaron un ramo', A.length, V.length ? Math.round(A.length / V.length * 100) + '% de las visitas' : '—') +
      kpi('Pedidos enviados', P.length, 'desde el armador') + kpi('Conversión', conv.toFixed(1).replace('.', ',') + '%', 'visitas que terminan en pedido') + kpi('Clics a WhatsApp', W.length, 'sin contar el armador');
    function contar(arr, f) { var m = {}; arr.forEach(function (e) { var k = f(e); if (k != null) m[k] = (m[k] || 0) + 1; }); return m; }
    var porO = contar(V, function (e) { return e.origen; });
    $('sOrigen').innerHTML = barras(porO, function (k) { return RD.ORIGENES[k] || k; }, { pct: true });
    var oA = contar(A, function (e) { return e.origen; }), oP = contar(P, function (e) { return e.origen; });
    var ks = Object.keys(porO).sort(function (a, b) { return porO[b] - porO[a]; });
    $('sEmbudo').innerHTML = ks.length ? '<div style="overflow-x:auto"><table class="emb"><thead><tr><th>Origen</th><th>Visitas</th><th>Armaron</th><th>Pedidos</th><th>Conversión</th></tr></thead><tbody>' +
      ks.map(function (k) { var v = porO[k], p = oP[k] || 0; return '<tr><td>' + (RD.ORIGENES[k] || k) + '</td><td>' + v + '</td><td>' + (oA[k] || 0) + '</td><td>' + p + '</td><td><b>' + (v ? (p / v * 100).toFixed(1).replace('.', ',') : '0') + '%</b></td></tr>'; }).join('') +
      '</tbody></table></div>' : '<div class="empty">Todavía no hay visitas.</div>';
    // visitas por día
    var n = rango || 14, dd = [];
    for (var i = n - 1; i >= 0; i--) { var k = RD.dias(-i); dd.push([k, V.filter(function (e) { return RD.iso(new Date(e.t)) === k; }).length]); }
    var Wd = 640, H = 190, pb = 24, pt = 12, pl = 28, pr = 6, mx = Math.max(4, Math.max.apply(null, dd.map(function (x) { return x[1]; }))), alto = H - pb - pt, an = (Wd - pl - pr) / dd.length, s = '';
    [0, Math.round(mx / 2), mx].forEach(function (v) { var y = pt + alto - (v / mx) * alto; s += '<line x1="' + pl + '" x2="' + (Wd - pr) + '" y1="' + y + '" y2="' + y + '" stroke="#9e2f5f" stroke-opacity=".12"/><text x="' + (pl - 6) + '" y="' + (y + 4) + '" text-anchor="end" font-size="10" fill="#7a6670">' + v + '</text>'; });
    dd.forEach(function (x, i) { var h = (x[1] / mx) * alto, X = pl + i * an + an * 0.18, w = an * 0.64, ult = i === dd.length - 1; s += '<rect x="' + X + '" y="' + (pt + alto - h) + '" width="' + w + '" height="' + h + '" rx="3" fill="' + (ult ? '#9e2f5f' : '#e2708c') + '"><title>' + fmt(x[0]) + ': ' + x[1] + ' visitas</title></rect>'; if (dd.length <= 14 ? (i % 2 === 1 || ult) : ult) s += '<text x="' + (X + w / 2) + '" y="' + (H - 8) + '" text-anchor="middle" font-size="10" fill="#7a6670">' + x[0].slice(8) + '/' + x[0].slice(5, 7) + '</text>'; });
    $('sChart').innerHTML = s;
    // días y horarios
    var porDia = contar(V, function (e) { return DIAS[new Date(e.t).getDay()]; });
    $('sDias').innerHTML = barras(porDia, null, { orden: ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'] });
    var FR = ['Mañana (8 a 12)', 'Mediodía (12 a 15)', 'Tarde (15 a 19)', 'Noche (19 a 24)', 'Madrugada (0 a 8)'];
    var porH = contar(V, function (e) { var h = new Date(e.t).getHours(); return h < 8 ? FR[4] : h < 12 ? FR[0] : h < 15 ? FR[1] : h < 19 ? FR[2] : FR[3]; });
    $('sHoras').innerHTML = barras(porH, null, { orden: FR, pct: true });
    $('sDisp').innerHTML = barras(contar(V, function (e) { return e.disp === 'compu' ? 'Compu' : 'Celular'; }), null, { pct: true });
    // lo más pedido (pedidos aceptados + pedidos de la web)
    var todos = DB.orders.concat(DB.solicitudes), cc = {}, cq = {}, co = {};
    todos.forEach(function (o) {
      var r = RD.reparto(o); for (var k in r) if (k !== 'eleccion' && k !== 'combinado') cc[k] = (cc[k] || 0) + r[k];
      var b = o.qty <= 7 ? 'Chico (hasta 7)' : o.qty <= 14 ? 'Mediano (8 a 14)' : 'Grande (15 o más)'; cq[b] = (cq[b] || 0) + 1;
      if (o.ocasion) co[o.ocasion] = (co[o.ocasion] || 0) + 1;
    });
    $('sColores').innerHTML = barras(cc, nomColor);
    $('sCant').innerHTML = barras(cq, null, { orden: ['Chico (hasta 7)', 'Mediano (8 a 14)', 'Grande (15 o más)'], pct: true });
    $('sOca').innerHTML = barras(co);
    $('sWa').innerHTML = barras(contar(W, function (e) { return e.dato; }), function (k) { return RD.BOTONES[k] || k; });
    $('sFotos').innerHTML = barras(contar(de('foto'), function (e) { return e.dato; }), function (k) { return RD.FOTOS[k] || k; });
  }

  // ---------- editar web ----------
  var BASE = location.href.replace(/[?#].*$/, '').replace(/panel\.html$/, '');
  function pintarEditar() {
    $('eBan').value = DB.config.banner || ''; $('eAb').checked = DB.config.abierto !== false;
    $('eLinks').innerHTML = ['instagram', 'whatsapp', 'facebook'].map(function (k) {
      var u = BASE + '?origen=' + k; return '<div class="lnk"><b>' + RD.ORIGENES[k] + '</b><code>' + esc(u) + '</code><button type="button" class="btn ghost sm" data-copy="' + esc(u) + '">Copiar</button></div>';
    }).join('');
  }
  $('eLinks').onclick = function (e) {
    var b = e.target.closest('[data-copy]'); if (!b) return;
    var u = b.dataset.copy, ok = function () { $('eLinkMsg').textContent = 'Link copiado.'; }, mal = function () { $('eLinkMsg').textContent = 'No se pudo copiar: mantené apretado el link y copialo a mano.'; };
    try { navigator.clipboard.writeText(u).then(ok, mal); } catch (x) { mal(); }
  };
  $('eBanOk').onclick = function () { DB.config.banner = $('eBan').value.trim(); guardar(); $('eBanMsg').textContent = DB.config.banner ? 'Banner publicado. Ya se ve en la web.' : 'Banner sacado: queda solo "Pedí tu ramo".'; };
  $('eAb').onchange = function () { DB.config.abierto = this.checked; guardar(); $('eAbMsg').textContent = this.checked ? 'La web vuelve a tomar pedidos.' : 'Pedidos web pausados: la web avisa que escriban por WhatsApp.'; };

  function badge() { var n = DB.solicitudes.length; $('nSol').hidden = !n; $('nSol').textContent = n; }
  function render() { DB = RD.cargar(); badge(); if (tab === 'pedidos') pintarPedidos(); else if (tab === 'stats') pintarStats(); else pintarEditar(); }
  // si se carga un pedido desde la web en otra pestaña, el panel se actualiza solo
  addEventListener('storage', function (e) { if (e.key === 'rd-demo-v2') render(); });

  salir(); render();
})();
