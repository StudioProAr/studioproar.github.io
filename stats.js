/* StudioProAr · stats.js — estadísticas livianas para las webs de clientes.
 *
 * Uso (al final del <body>, antes de este script):
 *   <script>window.SPA_STATS = { db: 'https://PROYECTO-default-rtdb.firebaseio.com', sitio: 'ferreteria-ale' };</script>
 *   <script src="stats.js" defer></script>
 *
 * Guarda en  /sitios/<sitio>/stats/...  (Realtime Database, API REST, sin SDK):
 *   visitas/<día>                  1 por persona por día (por pestaña/sesión)
 *   origen/<día>/<fuente>          instagram | facebook | google | whatsapp | directo | otro
 *   disp/<día>/<tipo>              movil | pc
 *   paginas/<día>/<página>         vistas por página (1 por página por sesión)
 *   clics/<día>/<botón>            whatsapp | instagram | maps | llamar
 * Cada valor solo puede subir de a 1 (lo controlan las reglas de la base).
 * No guarda datos personales ni cookies.
 */
(function () {
  'use strict';
  var C = window.SPA_STATS;
  if (!C || !C.db || !C.sitio) return;
  var ua = navigator.userAgent || '';
  if (navigator.webdriver || /bot|crawl|spider|slurp|lighthouse|headless|preview/i.test(ua)) return;
  if (/^(localhost|127\.|192\.168\.)/.test(location.hostname) && !C.local) return;

  var base = C.db.replace(/\/+$/, '') + '/sitios/' + encodeURIComponent(C.sitio) + '/stats';
  var ss = {
    get: function (k) { try { return sessionStorage.getItem('spa_' + k); } catch (e) { return null; } },
    set: function (k, v) { try { sessionStorage.setItem('spa_' + k, v); } catch (e) { /* sin almacenamiento */ } }
  };
  function dia() {
    var d = new Date();
    return d.getFullYear() + '-' + ('0' + (d.getMonth() + 1)).slice(-2) + '-' + ('0' + d.getDate()).slice(-2);
  }
  function clave(s) { return String(s).toLowerCase().replace(/[^a-z0-9-]+/g, '-').replace(/^-+|-+$/g, '').slice(0, 40) || 'inicio'; }
  function sumar(rutas) {
    var body = {};
    rutas.forEach(function (r) { body[r] = { '.sv': { increment: 1 } }; });
    try {
      fetch(base + '.json', { method: 'PATCH', body: JSON.stringify(body), keepalive: true, headers: { 'Content-Type': 'application/json' } })
        .catch(function () { /* sin conexión: no se cuenta */ });
    } catch (e) { /* navegador viejo */ }
  }

  function fuente() {
    var q = new URLSearchParams(location.search).get('origen');
    if (q && /^(instagram|facebook|google|whatsapp)$/.test(q)) return q;
    if (/Instagram/i.test(ua)) return 'instagram';
    if (/FBAN|FBAV|FB_IAB/i.test(ua)) return 'facebook';
    var r = '';
    try { r = document.referrer ? new URL(document.referrer).hostname : ''; } catch (e) { r = ''; }
    if (!r || r === location.hostname) return 'directo';
    if (/instagram\./.test(r)) return 'instagram';
    if (/facebook\.|fb\.|messenger\./.test(r)) return 'facebook';
    if (/google\./.test(r)) return 'google';
    if (/whatsapp\.|wa\.me|l\.wl\.co/.test(r)) return 'whatsapp';
    return 'otro';
  }

  var hoy = dia();
  var pag = clave(location.pathname.replace(/\/(index\.html?)?$/, '').split('/').pop().replace(/\.html?$/, ''));
  var rutas = [];
  if (ss.get('visita') !== hoy) {
    ss.set('visita', hoy);
    rutas.push('visitas/' + hoy, 'origen/' + hoy + '/' + fuente(), 'disp/' + hoy + '/' + (/Mobi|Android|iPhone|iPad/i.test(ua) ? 'movil' : 'pc'));
  }
  if (ss.get('pag_' + pag) !== hoy) { ss.set('pag_' + pag, hoy); rutas.push('paginas/' + hoy + '/' + pag); }
  if (rutas.length) sumar(rutas);

  /* clics en botones de contacto (máximo 10 por sesión, para que nadie infle los números) */
  document.addEventListener('click', function (e) {
    var a = e.target.closest && e.target.closest('a[href]');
    if (!a) return;
    var h = a.getAttribute('href') || '', tipo = null;
    if (/wa\.me|api\.whatsapp\.com|whatsapp:\/\//i.test(h)) tipo = 'whatsapp';
    else if (/instagram\.com/i.test(h)) tipo = 'instagram';
    else if (/google\.[^/]+\/maps|maps\.app\.goo\.gl|goo\.gl\/maps|maps\.google/i.test(h)) tipo = 'maps';
    else if (/^tel:/i.test(h)) tipo = 'llamar';
    if (!tipo) return;
    var n = +(ss.get('clics') || 0);
    if (n >= 10) return;
    ss.set('clics', n + 1);
    sumar(['clics/' + dia() + '/' + tipo]);
  }, true);
})();
