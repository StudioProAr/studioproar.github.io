// Service worker de la web del estudio: solo la portada y sus íconos.
// Las muestras (/demos/) tienen sus propios service workers y no se tocan.
var CACHE = 'spa-web-v1';
var BASE = ['./', 'index.html', 'img/icono.svg', 'img/icono-192.png', 'img/icono-512.png'];
self.addEventListener('install', function (e) { self.skipWaiting(); e.waitUntil(caches.open(CACHE).then(function (c) { return c.addAll(BASE); }).catch(function () {})); });
self.addEventListener('activate', function (e) { e.waitUntil(caches.keys().then(function (k) { return Promise.all(k.filter(function (n) { return n.indexOf('spa-web-') === 0 && n !== CACHE; }).map(function (n) { return caches.delete(n); })); }).then(function () { return self.clients.claim(); })); });
self.addEventListener('fetch', function (e) {
  var u = new URL(e.request.url);
  if (e.request.method !== 'GET' || u.origin !== location.origin || u.pathname.indexOf('/demos/') !== -1) return;
  if (e.request.mode === 'navigate') {
    // Siempre la versión nueva; si no hay internet, la última guardada.
    e.respondWith(fetch(e.request).then(function (r) { var c = r.clone(); caches.open(CACHE).then(function (ca) { ca.put('index.html', c); }); return r; }).catch(function () { return caches.match('index.html'); }));
  }
});
