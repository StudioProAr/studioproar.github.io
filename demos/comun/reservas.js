/* Reservas: turnos y encargos de la web pública.
   Modo "demo": guarda en el navegador (localStorage), como las muestras.
   Modo "real": si hay window.FIREBASE_CONFIG, guarda en Firebase en r/<sitio>/<col>/.
     - lista/<id>: datos del cliente (solo los ve el dueño).
     - ocupado/<fecha>/<minuto>: horarios tomados, sin datos personales (lo lee cualquiera para no superponer turnos).
   Uso: Reservas.iniciar({sitio:'salon', col:'turnos', clave:'sq_turnos', paso:30})
        Reservas.lista() -> [{fecha, ini, min}, ...]  (turnos ocupados)
        Reservas.guardar(obj) -> Promise   (obj con fecha 'AAAA-MM-DD', ini y min en minutos si es turno)
        Reservas.alCambiar(fn) */
(function () {
  var cfg = {}, cache = [], fns = [], db = null;
  function local() { try { return JSON.parse(localStorage.getItem(cfg.clave)) || []; } catch (e) { return []; } }
  function avisar() { fns.forEach(function (f) { try { f(); } catch (e) {} }); }
  var R = window.Reservas = {
    modo: 'demo',
    iniciar: function (c) {
      cfg = c; cfg.paso = cfg.paso || 30;
      var C = window.FIREBASE_CONFIG;
      if (!C || !C.apiKey || !window.firebase) return R;
      if (!firebase.apps.length) firebase.initializeApp(C);
      db = firebase.database(); R.modo = 'real';
      if (cfg.col === 'turnos') db.ref('r/' + cfg.sitio + '/turnos/ocupado').on('value', function (s) {
        var a = [];
        s.forEach(function (d) { d.forEach(function (m) { a.push({ fecha: d.key, ini: +m.key, min: cfg.paso }); }); });
        cache = a; avisar();
      });
      return R;
    },
    /* Link para agregar el turno a Google Calendar (fecha 'AAAA-MM-DD', ini y min en minutos) */
    calendario: function (o) {
      var f = o.fecha.replace(/-/g, ''), t = function (m) { return f + 'T' + String(Math.floor(m / 60)).padStart(2, '0') + String(m % 60).padStart(2, '0') + '00'; };
      return 'https://calendar.google.com/calendar/render?action=TEMPLATE&text=' + encodeURIComponent(o.titulo) + '&dates=' + t(o.ini) + '/' + t(o.ini + o.min) + '&ctz=America/Argentina/Buenos_Aires&details=' + encodeURIComponent(o.detalle || '') + '&location=' + encodeURIComponent(o.lugar || '');
    },
    /* Celular argentino a 10 dígitos: saca +54, 9, 0 y el 15 (ej. "011 15 5555-4444" -> "1155554444") */
    normCel: function (x) {
      var d = String(x || '').replace(/\D/g, '');
      if (d.indexOf('54') === 0 && d.length > 11) d = d.slice(2);
      if (d.charAt(0) === '9' && d.length === 11) d = d.slice(1);
      if (d.charAt(0) === '0') d = d.slice(1);
      if (d.length === 12) for (var L = 2; L <= 4; L++) if (d.substr(L, 2) === '15') { d = d.slice(0, L) + d.slice(L + 2); break; }
      return d;
    },
    celOk: function (c) { return /^[1-9][0-9]{9}$/.test(c) && c.indexOf("15") !== 0; },
    mailOk: function (m) { return !m || /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(m); },
    lista: function () { return R.modo === 'real' ? cache : local(); },
    alCambiar: function (f) { fns.push(f); },
    guardar: function (o) {
      if (R.modo !== 'real') {
        var l = local(); l.push(o);
        try { localStorage.setItem(cfg.clave, JSON.stringify(l)); } catch (e) {}
        return Promise.resolve(o.id);
      }
      var base = 'r/' + cfg.sitio + '/' + cfg.col, id = db.ref(base + '/lista').push().key, up = {}, x = {};
      Object.keys(o).forEach(function (k) { if (o[k] !== undefined && k !== 'id') x[k] = o[k]; });
      x.creado = firebase.database.ServerValue.TIMESTAMP; x.estado = x.estado || 'nuevo';
      up[base + '/lista/' + id] = x;
      if (cfg.col === 'turnos') for (var m = o.ini; m < o.ini + o.min; m += cfg.paso) up[base + '/ocupado/' + o.fecha + '/' + m] = id;
      var t = new Promise(function (_, no) { setTimeout(function () { no(new Error('sin conexión')); }, 10000); });
      return Promise.race([db.ref().update(up), t]).then(function () { return id; }, function (e) {
        throw new Error(/permission/i.test(e && e.message) ? 'Ese horario se acaba de ocupar. Elegí otro.' : 'No se pudo guardar. Revisá la conexión.');
      });
    }
  };
})();
