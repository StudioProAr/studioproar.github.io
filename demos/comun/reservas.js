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
  function clave() { var a = new Uint8Array(12), c = 'abcdefghijkmnpqrstuvwxyz23456789', r = ''; (window.crypto || window.msCrypto).getRandomValues(a); for (var i = 0; i < a.length; i++) r += c[a[i] % c.length]; return r; }
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
    /* Link "Cancelar mi turno" que va en el mail de confirmación */
    linkBaja: function (id, o) {
      if (!R.ultimaClave) return '';
      var u = new URL('../comun/baja.html', location.href), q = { s: cfg.sitio, id: id, k: R.ultimaClave, f: o.fecha, i: o.ini, n: o.negocio || '', c: R.modo === 'demo' ? cfg.clave : '' };
      Object.keys(q).forEach(function (x) { if (q[x] !== '' && q[x] != null) u.searchParams.set(x, q[x]); });
      if (R.modo === 'real') u.searchParams.set('real', '1');
      return u.href;
    },
    /* Cancela un turno con su clave (la usa baja.html). Libera los horarios y marca el turno como cancelado. */
    cancelar: function (sitio, id, k, fecha) {
      var base = 'r/' + sitio + '/turnos';
      return db.ref(base + '/ocupado/' + fecha).once('value').then(function (s) {
        var up = {}; up[base + '/baja/' + id] = k; up[base + '/lista/' + id + '/estado'] = 'cancelado';
        s.forEach(function (m) { if (m.val() === id) up[base + '/ocupado/' + fecha + '/' + m.key] = null; });
        return db.ref().update(up);
      });
    },
    /* Archivo .ics para agendar el turno en el calendario del celular (con aviso 3 h antes) */
    ics: function (o) {
      var p = function (n) { return String(n).padStart(2, '0'); }, f = o.fecha.replace(/-/g, ''), t = function (m) { return f + 'T' + p(Math.floor(m / 60)) + p(m % 60) + '00'; }, e = function (x) { return String(x || '').replace(/([,;\\])/g, '\\$1').replace(/\n/g, '\\n'); };
      var s = ['BEGIN:VCALENDAR', 'VERSION:2.0', 'PRODID:-//StudioProAr//Turnos//ES', 'BEGIN:VEVENT', 'UID:' + Date.now() + '@studioproar.com.ar', 'DTSTAMP:' + new Date().toISOString().replace(/[-:]/g, '').slice(0, 15) + 'Z',
        'DTSTART:' + t(o.ini), 'DTEND:' + t(o.ini + o.min), 'SUMMARY:' + e(o.titulo), 'LOCATION:' + e(o.lugar), 'DESCRIPTION:' + e(o.detalle),
        'BEGIN:VALARM', 'TRIGGER:-PT3H', 'ACTION:DISPLAY', 'DESCRIPTION:' + e(o.titulo), 'END:VALARM', 'END:VEVENT', 'END:VCALENDAR'].join('\r\n');
      return URL.createObjectURL(new Blob([s], { type: 'text/calendar' }));
    },
    /* Imagen del turno (PNG) para guardar en la galería o mandar por WhatsApp. Incluye QR para cancelar si está qr.js */
    imagen: function (o) {
      var W = 1080, H = 1350, c = document.createElement('canvas'); c.width = W; c.height = H; var x = c.getContext('2d');
      var ac = o.color || '#16171b', F = 'system-ui,-apple-system,Segoe UI,Roboto,sans-serif';
      x.fillStyle = '#f6f3ee'; x.fillRect(0, 0, W, H);
      x.fillStyle = '#fff'; x.beginPath(); x.roundRect ? x.roundRect(60, 60, W - 120, H - 120, 40) : x.rect(60, 60, W - 120, H - 120); x.fill();
      x.fillStyle = ac; x.fillRect(60, 60, W - 120, 16);
      x.textAlign = 'left'; x.fillStyle = '#6b6b6b'; x.font = '600 38px ' + F; x.fillText(o.negocio.toUpperCase(), 120, 170);
      x.fillStyle = ac; x.font = '800 76px ' + F; x.fillText('Turno confirmado ✓', 120, 270);
      var y = 410, linea = function (t, f, col, max) { x.font = f; x.fillStyle = col; var ws = String(t).split(' '), l = ''; ws.forEach(function (w) { var p = l ? l + ' ' + w : w; if (x.measureText(p).width > (max || W - 240) && l) { x.fillText(l, 120, y); y += parseInt(f.match(/(\d+)px/)[1]) * 1.25; l = w; } else l = p; }); if (l) { x.fillText(l, 120, y); y += parseInt(f.match(/(\d+)px/)[1]) * 1.25; } };
      var d = new Date(o.fecha + 'T12:00:00'), D = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'], hh = String(Math.floor(o.ini / 60)).padStart(2, '0') + ':' + String(o.ini % 60).padStart(2, '0');
      linea(D[d.getDay()] + ' ' + d.getDate() + '/' + (d.getMonth() + 1), '800 96px ' + F, '#16171b');
      linea(hh + ' h', '800 96px ' + F, '#16171b'); y += 30;
      linea(o.servicio, '500 48px ' + F, '#333');
      linea('A nombre de ' + o.nombre, '400 40px ' + F, '#555');
      if (o.lugar) linea(o.lugar, '400 40px ' + F, '#555');
      if (o.baja && window.crearQR) {
        try { var q = crearQR(o.baja, 'L'), n = q.getModuleCount(), tam = 250, u = tam / n, qx = W - 120 - tam, qy = H - 120 - tam - 40;
          x.fillStyle = '#16171b'; for (var r = 0; r < n; r++) for (var k = 0; k < n; k++) if (q.isDark(r, k)) x.fillRect(qx + k * u, qy + r * u, u + .5, u + .5);
          x.fillStyle = '#6b6b6b'; x.font = '400 30px ' + F; x.fillText('¿No podés ir? Escaneá el QR', 120, H - 230); x.fillText('para cancelar el turno.', 120, H - 188);
        } catch (e) {}
      }
      x.fillStyle = '#9a9a9a'; x.font = '400 26px ' + F; x.fillText('Turnos online · StudioProAr', 120, H - 110);
      return new Promise(function (ok) { c.toBlob(ok, 'image/png'); });
    },
    guardarImagen: function (o) {
      return R.imagen(o).then(function (b) {
        var f = new File([b], 'turno-' + o.fecha + '.png', { type: 'image/png' });
        if (navigator.canShare && navigator.canShare({ files: [f] })) return navigator.share({ files: [f], title: 'Mi turno', text: o.servicio + ' · ' + R.fechaTxt(o.fecha, o.ini) }).catch(function () {});
        var u = URL.createObjectURL(b), v = document.createElement('div');
        v.style.cssText = 'position:fixed;inset:0;background:rgba(0,0,0,.85);z-index:9999;display:flex;flex-direction:column;align-items:center;justify-content:center;padding:20px;gap:12px;color:#fff;font:16px system-ui,sans-serif;text-align:center';
        v.innerHTML = '<img src="' + u + '" alt="Imagen del turno" style="max-width:100%;max-height:75vh;border-radius:12px"><div>Mantené apretada la imagen para guardarla, o <a href="' + u + '" download="turno-' + o.fecha + '.png" style="color:#fff">descargala acá</a>.</div><button type="button" style="padding:10px 18px;border-radius:10px;border:0;font:inherit">Cerrar</button>';
        v.querySelector('button').onclick = function () { v.remove(); }; document.body.appendChild(v);
      });
    },
    fechaTxt: function (f, ini) {
      var d = new Date(f + 'T12:00:00'), D = ['domingo', 'lunes', 'martes', 'miércoles', 'jueves', 'viernes', 'sábado'];
      return D[d.getDay()] + ' ' + d.getDate() + '/' + (d.getMonth() + 1) + (ini != null ? ' a las ' + String(Math.floor(ini / 60)).padStart(2, '0') + ':' + String(ini % 60).padStart(2, '0') + ' h' : '');
    },
    /* "Tus turnos": quedan guardados en el navegador del cliente */
    mios: function () {
      var hoy = new Date().toISOString().slice(0, 10), l = [];
      try { l = JSON.parse(localStorage.getItem('spa_mios_' + cfg.sitio)) || []; } catch (e) {}
      return l.filter(function (t) { return t.fecha >= hoy; });
    },
    guardarMio: function (t) {
      var l = R.mios().filter(function (x) { return String(x.id) !== String(t.id); }); l.push(t);
      l.sort(function (a, b) { return (a.fecha + a.ini) < (b.fecha + b.ini) ? -1 : 1; });
      try { localStorage.setItem('spa_mios_' + cfg.sitio, JSON.stringify(l)); } catch (e) {}
    },
    pintarMios: function (el) {
      if (!el) return; var l = R.mios(), esc = function (x) { return String(x || '').replace(/[<>&"]/g, ''); };
      el.innerHTML = l.length ? '<div class="mios"><b>Tus turnos</b>' + l.map(function (t) { return '<div>' + esc(t.servicio) + ' · ' + R.fechaTxt(t.fecha, t.ini) + (t.baja ? ' · <a href="' + esc(t.baja) + '">Cancelar</a>' : '') + '</div>'; }).join('') + '</div>' : '';
    },
    /* Tarjeta de confirmación: calendario, WhatsApp y "Tus turnos". o: {id,negocio,servicio,fecha,ini,min,nombre,lugar,waNum,baja,mail} */
    tarjeta: function (o) {
      if (!document.getElementById('spa-conf-css')) { var st = document.createElement('style'); st.id = 'spa-conf-css'; st.textContent = '.conf-t{border:1px solid currentColor;border-radius:14px;padding:14px 16px;margin-top:10px;text-align:left}.conf-t b{font-size:1.1em}.conf-t p{margin:6px 0 10px}.conf-a{display:flex;flex-wrap:wrap;gap:8px}.conf-a a{flex:1 1 150px;text-align:center;padding:10px 12px;border-radius:10px;border:1px solid currentColor;text-decoration:none;color:inherit;font-weight:600}.conf-a a.wa{background:#25d366;border-color:#25d366;color:#fff}.conf-t small{display:block;margin-top:10px;opacity:.8}.mios{border:1px dashed currentColor;border-radius:12px;padding:10px 14px;margin:0 0 14px}.mios div{margin-top:4px}'; document.head.appendChild(st); }
      var esc = function (x) { return String(x || '').replace(/[<>&"]/g, ''); }, cuando = R.fechaTxt(o.fecha, o.ini);
      var tit = o.servicio + ' · ' + o.negocio, det = 'Turno a nombre de ' + o.nombre + '.' + (o.baja ? ' Para cancelar: ' + o.baja : '');
      var g = R.calendario({ titulo: tit, fecha: o.fecha, ini: o.ini, min: o.min, lugar: o.lugar || o.negocio, detalle: det });
      var wa = 'https://wa.me/' + o.waNum + '?text=' + encodeURIComponent('Hola ' + o.negocio + '! Reservé *' + o.servicio + '* para el *' + cuando + '* a nombre de ' + o.nombre + '.' + (o.baja ? '\nSi no puedo ir, lo cancelo acá: ' + o.baja : ''));
      R._ult = o; if (!R._img) { R._img = 1; document.addEventListener('click', function (e) { if (e.target.closest && e.target.closest('.conf-img')) { e.preventDefault(); R.guardarImagen(R._ult); } }); }
      R.guardarMio({ id: o.id, fecha: o.fecha, ini: o.ini, servicio: o.servicio, baja: o.baja || '' });
      return '<div class="conf-t"><b>✓ Turno confirmado</b><p>' + esc(o.servicio) + ' · ' + cuando + ' · a nombre de ' + esc(o.nombre) + '</p><div class="conf-a">' +
        '<a class="wa" href="' + wa + '" target="_blank" rel="noopener">Guardar en WhatsApp</a>' +
        '<a href="#" class="conf-img">Guardar imagen del turno</a>' +
        '<a href="' + g + '" target="_blank" rel="noopener">Google Calendar</a></div>' +
        '<small>Te queda guardado en esta web, en "Tus turnos".' + (o.mail ? ' También te lo mandamos a ' + esc(o.mail) + ' (si no lo ves, revisá Spam).' : '') + (o.baja ? ' ¿No podés ir? <a href="' + esc(o.baja) + '">Cancelá el turno</a> así lo libera para otra persona.' : '') + '</small></div>';
    },
    lista: function () { return R.modo === 'real' ? cache : local(); },
    alCambiar: function (f) { fns.push(f); },
    guardar: function (o) {
      if (R.modo !== 'real') {
        R.ultimaClave = 'demo'; var l = local(); l.push(o);
        try { localStorage.setItem(cfg.clave, JSON.stringify(l)); } catch (e) {}
        return Promise.resolve(o.id);
      }
      var base = 'r/' + cfg.sitio + '/' + cfg.col, id = db.ref(base + '/lista').push().key, up = {}, x = {};
      Object.keys(o).forEach(function (k) { if (o[k] !== undefined && k !== 'id') x[k] = o[k]; });
      x.creado = firebase.database.ServerValue.TIMESTAMP; x.estado = x.estado || 'nuevo';
      up[base + '/lista/' + id] = x;
      var k = clave(); R.ultimaClave = k;
      if (cfg.col === 'turnos') { for (var m = o.ini; m < o.ini + o.min; m += cfg.paso) up[base + '/ocupado/' + o.fecha + '/' + m] = id; up[base + '/claves/' + id] = k; }
      var t = new Promise(function (_, no) { setTimeout(function () { no(new Error('sin conexión')); }, 10000); });
      var ir = function (u) { return Promise.race([db.ref().update(u), t]); };
      return ir(up).catch(function (e) { /* reglas viejas sin "claves": reintenta sin el link de baja */
        if (!/permission/i.test(e && e.message) || !up[base + '/claves/' + id]) throw e;
        delete up[base + '/claves/' + id]; R.ultimaClave = null; return ir(up);
      }).then(function () { return id; }, function (e) {
        throw new Error(/permission/i.test(e && e.message) ? 'Ese horario se acaba de ocupar. Elegí otro.' : 'No se pudo guardar. Revisá la conexión.');
      });
    }
  };
})();
