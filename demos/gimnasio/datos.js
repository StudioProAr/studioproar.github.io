/* Ribera Training Club · datos de la muestra (se guardan solo en este navegador) */
var GYM = (function () {
  var K = 'gym_demo_v1';
  var PLANES = {
    libre: { nom: 'Pase libre', precio: 38000 },
    tres: { nom: '3 veces por semana', precio: 31000 },
    clases: { nom: 'Solo clases', precio: 27000 }
  };
  var NOMBRES = ['Lucía Gómez', 'Martín Ríos', 'Sofía Pereyra', 'Joaquín Díaz', 'Valentina Sosa', 'Tomás Acosta', 'Camila Benítez', 'Mateo Romero', 'Julieta Medina', 'Agustín Herrera', 'Mora Castro', 'Franco Suárez', 'Paula Molina', 'Bruno Ortiz', 'Abril Silva', 'Lautaro Núñez', 'Delfina Rojas', 'Ignacio Luna'];
  function hoy0() { var d = new Date(); d.setHours(0, 0, 0, 0); return d; }
  function masDias(n) { var d = hoy0(); d.setDate(d.getDate() + n); return d.getTime(); }
  function semilla() {
    var socios = NOMBRES.map(function (n, i) {
      var planes = ['libre', 'libre', 'tres', 'clases'];
      return {
        dni: String(30120000 + i * 731157 % 9000000 + i * 1111),
        nom: n,
        plan: planes[i % 4],
        vence: masDias([18, 3, 25, -2, 9, 1, 14, -6, 27, 5, 11, 2, 20, -1, 7, 16, 4, 22][i]),
        tel: '11' + (55000000 + i * 123457) % 100000000
      };
    });
    socios[0].dni = '12345678'; /* para probar el fichaje */
    var asis = [];
    for (var d = 13; d >= 0; d--) {
      var n = d === 0 ? 9 : 22 + Math.round(Math.sin(d) * 6) + (d % 7 === 6 ? -10 : 0);
      for (var j = 0; j < n; j++) {
        var s = socios[(j * 7 + d) % socios.length], t = new Date(masDias(-d));
        var h = [7, 8, 8, 9, 12, 13, 18, 18, 19, 19, 20, 21][(j * 5 + d) % 12];
        t.setHours(h, (j * 13) % 60);
        if (d === 0 && t > new Date()) continue;
        asis.push({ dni: s.dni, t: t.getTime(), ok: s.vence >= masDias(-d) });
      }
    }
    var pagos = socios.filter(function (s) { return s.vence > masDias(0); }).map(function (s, i) {
      return { dni: s.dni, monto: PLANES[s.plan].precio, t: masDias(-((i * 3) % 25)), medio: i % 3 ? 'Transferencia' : 'Efectivo' };
    });
    return { socios: socios, asis: asis, pagos: pagos };
  }
  /* Modo real: si hay FIREBASE_CONFIG (con ?real=1 en la muestra), los datos viven en Firebase g/<sitio>/ y hace falta entrar con el usuario del gimnasio */
  var C = window.FIREBASE_CONFIG, REAL = !!(C && C.apiKey && window.firebase && firebase.database), SITIO = window.GYM_SITIO || 'gimnasio', fb = null, fns = [];
  var db;
  if (REAL) { db = { socios: [], asis: [], pagos: [] }; }
  else {
    try { db = JSON.parse(localStorage.getItem(K)); } catch (e) { db = null; }
    if (!db || !db.socios) { db = semilla(); guardar(); }
  }
  function guardar() { if (REAL) return; try { localStorage.setItem(K, JSON.stringify(db)); } catch (e) { /* sin almacenamiento */ } }
  function avisar() { fns.forEach(function (f) { try { f(); } catch (e) {} }); }
  function err() { alert('No se pudo guardar en la base. Revisá la conexión.'); }
  if (!db.solicitudes) db.solicitudes = [];
  if (REAL && !window.GYM_SIN_LOGIN && firebase.auth) {
    if (!firebase.apps.length) firebase.initializeApp(C);
    var au = firebase.auth(), base = function (x) { return firebase.database().ref('g/' + SITIO + (x ? '/' + x : '')); }, ref = null;
    var caja = document.createElement('div');
    caja.style.cssText = 'position:fixed;inset:0;z-index:9999;background:rgba(0,0,0,.85);display:none;align-items:center;justify-content:center;font:16px system-ui,sans-serif';
    caja.innerHTML = '<form style="background:#15181d;color:#f3f5f7;padding:24px;border-radius:14px;width:min(360px,92vw)"><h2 style="margin:0 0 6px">Entrar</h2><p style="color:#a3abb6;margin:0 0 14px">Usuario del gimnasio</p><input name="e" type="email" placeholder="Mail" autocomplete="username" required style="width:100%;padding:10px;margin-bottom:8px;box-sizing:border-box"><input name="p" type="password" placeholder="Clave" autocomplete="current-password" required style="width:100%;padding:10px;margin-bottom:12px;box-sizing:border-box"><button style="width:100%;padding:11px;background:#c6ff3d;border:0;font-weight:700;cursor:pointer">Entrar</button><p class="m" style="color:#ef6b6b;min-height:1em"></p></form>';
    var arma = function () { document.body.appendChild(caja); };
    if (document.body) arma(); else document.addEventListener('DOMContentLoaded', arma);
    caja.querySelector('form').onsubmit = function (e) { e.preventDefault(); var f = e.target; au.signInWithEmailAndPassword(f.e.value.trim(), f.p.value).catch(function () { f.querySelector('.m').textContent = 'Mail o clave incorrectos.'; }); };
    au.onAuthStateChanged(function (u) {
      if (ref) { ref.off(); ref = null; }
      if (!u) { caja.style.display = 'flex'; return; }
      firebase.database().ref('web/roles/' + u.uid).once('value').then(function (r) {
        if (r.val() !== 'admin') { au.signOut(); caja.querySelector('.m').textContent = 'Este usuario no tiene permiso.'; return; }
        caja.style.display = 'none'; ref = base();
        ref.on('value', function (sn) {
          var v = sn.val() || {}, o = function (x) { return Object.keys(x || {}).map(function (k) { return x[k]; }); };
          var sol = Object.keys(v.solicitudes || {}).map(function (k) { var x = v.solicitudes[k]; x._id = k; return x; }).sort(function (a, b) { return b.t - a.t; });
          db = { solicitudes: sol, socios: o(v.socios).sort(function (a, b) { return a.nom < b.nom ? -1 : 1; }), asis: o(v.asis).sort(function (a, b) { return a.t - b.t; }), pagos: o(v.pagos).sort(function (a, b) { return a.t - b.t; }) };
          avisar();
        });
      });
    });
    fb = { socio: function (s) { base('socios/' + s.dni).set(s).catch(err); }, push: function (k, x) { base(k).push(x).catch(err); }, quitarSol: function (id) { base('solicitudes/' + id).remove().catch(err); } };
  }
  function socio(dni) { return db.socios.filter(function (s) { return s.dni === String(dni); })[0] || null; }
  function dias(s) { return Math.round((s.vence - hoy0().getTime()) / 864e5); }
  return {
    PLANES: PLANES, db: function () { return db; }, guardar: guardar, socio: socio, dias: dias, hoy0: hoy0,
    pesos: function (n) { return '$' + Math.round(n).toLocaleString('es-AR'); },
    fecha: function (t) { var d = new Date(t); return d.getDate() + '/' + (d.getMonth() + 1); },
    fichar: function (dni) {
      var s = socio(dni); if (!s) return { estado: 'nadie' };
      var ok = dias(s) >= 0;
      var a = { dni: s.dni, t: Date.now(), ok: ok }; db.asis.push(a); guardar(); if (fb) fb.push('asis', a);
      return { estado: ok ? 'ok' : 'vencido', socio: s, dias: dias(s) };
    },
    pagar: function (dni, medio) {
      var s = socio(dni); if (!s) return;
      var base = Math.max(s.vence, hoy0().getTime()), d = new Date(base); d.setMonth(d.getMonth() + 1);
      s.vence = d.getTime();
      var pg = { dni: s.dni, monto: PLANES[s.plan].precio, t: Date.now(), medio: medio || 'Efectivo' }; db.pagos.push(pg); guardar(); if (fb) { fb.socio(s); fb.push('pagos', pg); }
    },
    alta: function (o) { var n = { dni: String(o.dni), nom: o.nom, plan: o.plan, tel: o.tel || '', vence: hoy0().getTime() - 864e5 }; db.socios.unshift(n); guardar(); if (fb) fb.socio(n); },
    reset: function () { if (REAL) { alert('En la versión real no se reinician los datos.'); return; } db = semilla(); guardar(); },
    real: REAL, alCambiar: function (f) { fns.push(f); },
    /* Solicitud de alta desde la web pública (no necesita usuario) */
    solicitar: function (o) {
      var x = { nom: String(o.nom).slice(0, 60), dni: String(o.dni), tel: String(o.tel), mail: String(o.mail || '').slice(0, 80), plan: o.plan, t: Date.now() };
      if (REAL) {
        if (!firebase.apps.length) firebase.initializeApp(C);
        x.t = firebase.database.ServerValue.TIMESTAMP;
        var to = new Promise(function (_, no) { setTimeout(function () { no(new Error('t')); }, 10000); });
        return Promise.race([firebase.database().ref('g/' + SITIO + '/solicitudes').push(x), to]);
      }
      x._id = 's' + Date.now(); db.solicitudes.unshift(x); guardar(); return Promise.resolve();
    },
    aprobar: function (id) {
      var x = db.solicitudes.filter(function (y) { return y._id === id; })[0]; if (!x) return;
      if (!socio(x.dni)) GYM.alta({ dni: x.dni, nom: x.nom, plan: x.plan, tel: x.tel });
      GYM.descartar(id);
    },
    descartar: function (id) { db.solicitudes = db.solicitudes.filter(function (y) { return y._id !== id; }); guardar(); if (fb) fb.quitarSol(id); avisar(); }
  };
})();
