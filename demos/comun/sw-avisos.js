/* Avisos de turnos (notificaciones push). Va en la misma carpeta que la página de turnos.
   La página le pasa los turnos con postMessage; el push llega sin contenido y acá se arma el aviso. */
var CACHE = 'spa-avisos', URLD = './__avisos.json';
function leer() { return caches.open(CACHE).then(function (c) { return c.match(URLD); }).then(function (r) { return r ? r.json() : []; }).catch(function () { return []; }); }
function escribir(l) { return caches.open(CACHE).then(function (c) { return c.put(URLD, new Response(JSON.stringify(l), { headers: { 'Content-Type': 'application/json' } })); }); }
function iso(d) { return d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0') + '-' + String(d.getDate()).padStart(2, '0'); }
function hh(m) { return String(Math.floor(m / 60)).padStart(2, '0') + ':' + String(m % 60).padStart(2, '0'); }

self.addEventListener('install', function () { self.skipWaiting(); });
self.addEventListener('activate', function (e) { e.waitUntil(self.clients.claim()); });

self.addEventListener('message', function (e) {
  var t = e.data && e.data.turno; if (!t) return;
  e.waitUntil(leer().then(function (l) {
    var hoy = iso(new Date());
    l = l.filter(function (x) { return x.id !== t.id && x.fecha >= hoy; }); l.push(t);
    return escribir(l);
  }));
});

self.addEventListener('push', function (e) {
  var dato = null; try { dato = e.data ? e.data.json() : null; } catch (er) {}
  e.waitUntil(leer().then(function (l) {
    var m = new Date(); m.setDate(m.getDate() + 1); var man = iso(m), hoy = iso(new Date());
    var t = (dato && dato.id && l.filter(function (x) { return x.id === dato.id; })[0]) || l.filter(function (x) { return x.fecha === man; })[0] || l.filter(function (x) { return x.fecha === hoy; })[0];
    var titulo, cuerpo, url = './', tag = 'turno';
    if (dato && dato.titulo) { titulo = dato.titulo; cuerpo = dato.cuerpo; url = dato.url || url; tag = 'turno-' + (dato.id || ''); }
    else if (t) { titulo = (t.fecha === hoy ? 'Hoy' : 'Mañana') + ' ' + hh(t.ini) + ' h · ' + t.negocio; cuerpo = t.servicio + '. Te esperamos. Tocá para ver tu turno o cancelarlo.'; url = t.baja || t.url || url; tag = 'turno-' + t.id; }
    else { titulo = 'Recordatorio de tu turno'; cuerpo = 'Mañana tenés un turno reservado. Tocá para verlo.'; }
    return self.registration.showNotification(titulo, { body: cuerpo, tag: tag, data: { url: url }, icon: (t && t.icono) || undefined, badge: (t && t.icono) || undefined });
  }));
});

self.addEventListener('notificationclick', function (e) {
  e.notification.close();
  var u = (e.notification.data && e.notification.data.url) || './';
  e.waitUntil(self.clients.openWindow(u));
});
