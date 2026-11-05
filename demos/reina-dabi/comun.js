/* Reina Dabi · demo StudioProAr
   Datos compartidos entre la web (index.html) y el panel (panel.html).
   En la demo todo se guarda en el navegador (localStorage). En la versión real va a Firebase. */
var RD = (function () {
  var COLORES = {
    rojo: ['Rojo', '#d32f2f'], bordo: ['Bordó', '#7b1f3a'], rosa: ['Rosa', '#f48fb1'], rosaViejo: ['Rosa viejo', '#c48793'],
    fucsia: ['Fucsia', '#d81b78'], blanco: ['Blanco', '#ffffff'], marfil: ['Marfil', '#f3ead2'], amarillo: ['Amarillo', '#fbc02d'],
    naranja: ['Naranja', '#fb8c00'], lila: ['Lila', '#b39ddb'], violeta: ['Violeta', '#7e57c2'], celeste: ['Celeste', '#81d4fa'],
    azul: ['Azul', '#1e4fb3'], verde: ['Verde', '#43a047'], verdeAgua: ['Verde agua', '#7fd6c2'], dorado: ['Dorado', '#c9a24a'],
    plateado: ['Plateado', '#c0c0c0'], negro: ['Negro', '#222222']
  };
  var ESPECIALES = { combinado: ['Combinado', 'conic-gradient(#9e2f5f,#c49a45,#e2708c,#9e2f5f)'], eleccion: ['A elección', '#fbe3ea'] };
  var MAX_MIX = 3;
  var ORIGENES = { instagram: 'Instagram', whatsapp: 'WhatsApp', facebook: 'Facebook', google: 'Google', directo: 'Directo', otro: 'Otro' };
  var BOTONES = { banner: 'Banner de arriba', flotante: 'Botón flotante', cierre: 'Llamado final', pie: 'Pie de página', armador: 'Armador (pedido)' };
  var FOTOS = {
    lila: 'Lila y dorado', rojas: 'Rojas con tallo', perfumadas: '21 perfumadas + corona', verde_blanco: 'Verde y blanco',
    azul: 'Azul con bombones', mariposa_rosa: 'Rosa con mariposa', amarillo: 'Cumpleaños con cinta', rosa: 'Rosa con mensaje'
  };
  var ESTADOS = ['Reservado', 'En preparación', 'Listo', 'Entregado'];
  var ENTREGAS = ['Punto de encuentro', 'Retiro', 'Envío'];
  // Precios de EJEMPLO (no son los reales de Reina Dabi)
  var PRECIOS = { 1: 4500, 2: 7500, 3: 9500, 4: 11500, 5: 13500, 6: 15000, 7: 17000 }, BANDAS = { p8: 2200, p15: 1950, p21: 1750 }, COSTO_ROSA = 750;

  function color(k) { return COLORES[k] || ESPECIALES[k] || [k, '#ccc']; }
  function iso(d) { return d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0') + '-' + String(d.getDate()).padStart(2, '0'); }
  function hoy() { var d = new Date(); return new Date(d.getFullYear(), d.getMonth(), d.getDate()); }
  function dias(n) { var d = hoy(); d.setDate(d.getDate() + n); return iso(d); }
  function uid() { return 'x' + Date.now().toString(36) + Math.random().toString(36).slice(2, 7); }
  function porRosa(q) { return q <= 14 ? BANDAS.p8 : q <= 20 ? BANDAS.p15 : BANDAS.p21; }
  function precio(q) { q = Math.max(1, Math.floor(+q || 1)); var p = 0; for (var i = 1; i <= q; i++) { var v = i <= 7 ? PRECIOS[i] : Math.round(i * porRosa(i) / 1000) * 1000; p = i <= 7 ? v : Math.max(v, Math.ceil((p + 1000) / 1000) * 1000); } return p; }
  function sena(p) { return Math.round(p * 0.5 / 500) * 500; }

  // ---- mezcla de colores ----
  function mixOk(o) { if (o.color !== 'combinado' || !o.mezcla) return false; var t = 0; for (var k in o.mezcla) t += +o.mezcla[k] || 0; return t === +o.qty; }
  function reparto(o) { if (mixOk(o)) { var r = {}; for (var k in o.mezcla) if (o.mezcla[k] > 0) r[k] = +o.mezcla[k]; return r; } var x = {}; x[o.color] = +o.qty; return x; }
  function colorTxt(o) {
    if (!mixOk(o)) return color(o.color)[0];
    return 'Combinado (' + Object.keys(o.mezcla).sort(function (a, b) { return o.mezcla[b] - o.mezcla[a]; }).map(function (k) { return o.mezcla[k] + ' ' + color(k)[0]; }).join(', ') + ')';
  }
  function puntos(o) { var r = reparto(o); return Object.keys(r).map(function (k) { return '<span class="dot" style="background:' + color(k)[1] + '"></span>'; }).join(''); }

  // ---- origen y dispositivo de la visita ----
  function origenActual() {
    var s = null; try { s = sessionStorage.getItem('rd_origen'); } catch (e) {}
    var p = (new URLSearchParams(location.search).get('origen') || '').toLowerCase();
    if (ORIGENES[p]) { s = p; }
    else if (!s) {
      var r = (document.referrer || '').toLowerCase();
      s = /instagram/.test(r) ? 'instagram' : /facebook|fb\./.test(r) ? 'facebook' : /google\./.test(r) ? 'google' : /whatsapp|wa\.me/.test(r) ? 'whatsapp' : (r && r.indexOf(location.host) < 0 ? 'otro' : 'directo');
    }
    try { sessionStorage.setItem('rd_origen', s); } catch (e) {}
    return s;
  }
  function dispositivo() { return (/Mobi|Android|iPhone|iPad/i.test(navigator.userAgent) || Math.min(screen.width, innerWidth) < 760) ? 'celular' : 'compu'; }

  // ---- base local ----
  var KEY = 'rd-demo-v2', mem = null;
  function seed() {
    // generador fijo para que los datos de ejemplo sean siempre los mismos
    var s = 7; function rnd() { s = (s * 16807) % 2147483647; return (s - 1) / 2147483646; }
    function elegir(pesos) { var t = 0, k; for (k in pesos) t += pesos[k]; var r = rnd() * t; for (k in pesos) { r -= pesos[k]; if (r <= 0) return k; } return k; }
    var ev = [], ahora = hoy();
    for (var d = 13; d >= 0; d--) {
      var base = new Date(ahora); base.setDate(base.getDate() - d);
      var n = 4 + Math.floor(rnd() * 9) + (base.getDay() === 0 || base.getDay() === 6 ? 3 : 0);
      for (var i = 0; i < n; i++) {
        var h = +elegir({ 9: 1, 11: 2, 13: 2, 15: 2, 18: 3, 20: 4, 22: 3, 23: 1 }), t = new Date(base); t.setHours(h, Math.floor(rnd() * 60));
        var o = elegir({ instagram: 55, whatsapp: 22, google: 9, directo: 10, facebook: 4 }), di = rnd() < 0.88 ? 'celular' : 'compu', ts = t.getTime();
        ev.push({ t: ts, tipo: 'visita', origen: o, disp: di });
        if (rnd() < 0.45) ev.push({ t: ts + 6e4, tipo: 'foto', origen: o, disp: di, dato: elegir({ perfumadas: 5, lila: 4, rosa: 3, azul: 3, amarillo: 2, mariposa_rosa: 2, verde_blanco: 2, rojas: 1 }) });
        var arma = rnd() < (o === 'instagram' ? 0.3 : o === 'whatsapp' ? 0.42 : 0.2);
        if (arma) { ev.push({ t: ts + 12e4, tipo: 'armador', origen: o, disp: di }); if (rnd() < (o === 'whatsapp' ? 0.3 : 0.18)) ev.push({ t: ts + 3e5, tipo: 'pedido', origen: o, disp: di }); }
        else if (rnd() < 0.18) ev.push({ t: ts + 9e4, tipo: 'wa', origen: o, disp: di, dato: elegir({ banner: 4, flotante: 5, cierre: 1, pie: 1 }) });
      }
    }
    return {
      orders: [
        { id: uid(), creado: dias(-6), entrega: dias(3), nombre: 'Lucía Fernández', tel: '11 5555 1234', lugar: 'Victoria', entregaTipo: 'Retiro', qty: 12, color: 'rojo', mezcla: null, precio: precio(12), pagado: sena(precio(12)), estado: 'Reservado', origen: 'manual', ocasion: 'Cumpleaños', observaciones: '' },
        { id: uid(), creado: dias(-4), entrega: dias(6), nombre: 'Martín Gómez', tel: '11 4444 9876', lugar: 'Tigre', entregaTipo: 'Envío', qty: 15, color: 'combinado', mezcla: { rosa: 8, blanco: 7 }, precio: precio(15), pagado: sena(precio(15)), estado: 'En preparación', origen: 'web', fuente: 'instagram', ocasion: 'Aniversario', observaciones: 'Cinta: "Feliz aniversario, amor"' },
        { id: uid(), creado: dias(-9), entrega: dias(-1), nombre: 'Sofía Ruiz', tel: '', lugar: 'San Fernando', entregaTipo: 'Punto de encuentro', qty: 21, color: 'combinado', mezcla: { lila: 11, dorado: 10 }, precio: precio(21), pagado: precio(21), estado: 'Entregado', origen: 'web', fuente: 'whatsapp', ocasion: 'Quinceañera', observaciones: 'Corona' }
      ],
      solicitudes: [
        { id: uid(), recibido: new Date(Date.now() - 3600e3).toISOString(), fuente: 'instagram', disp: 'celular', ocasion: 'Cumpleaños', qty: 9, color: 'combinado', mezcla: { rojo: 5, dorado: 4 }, envoltorio: 'Negro', cinta: 'Feliz cumple Ma', extras: ['Moño', 'Tarjeta'], entrega: dias(4), entregaTipo: 'Punto de encuentro', nombre: 'Carla Benítez', comentarios: 'Si puede ser con mariposa dorada' }
      ],
      config: { banner: 'Día de la Madre: reservá tu ramo con anticipación', abierto: true },
      eventos: ev
    };
  }
  function cargar() { try { var s = localStorage.getItem(KEY); if (s) return JSON.parse(s); } catch (e) {} if (!mem) mem = seed(); return mem; }
  function guardar(db) { mem = db; try { localStorage.setItem(KEY, JSON.stringify(db)); } catch (e) {} }
  function evento(tipo, dato) {
    var db = cargar(); db.eventos.push({ t: Date.now(), tipo: tipo, origen: origenActual(), disp: dispositivo(), dato: dato || null }); guardar(db);
  }
  function reiniciar() { mem = seed(); guardar(mem); return mem; }

  return {
    COLORES: COLORES, ESPECIALES: ESPECIALES, MAX_MIX: MAX_MIX, ORIGENES: ORIGENES, BOTONES: BOTONES, FOTOS: FOTOS, ESTADOS: ESTADOS, ENTREGAS: ENTREGAS, COSTO_ROSA: COSTO_ROSA,
    color: color, iso: iso, hoy: hoy, dias: dias, uid: uid, precio: precio, sena: sena,
    mixOk: mixOk, reparto: reparto, colorTxt: colorTxt, puntos: puntos,
    origenActual: origenActual, dispositivo: dispositivo, cargar: cargar, guardar: guardar, evento: evento, reiniciar: reiniciar,
    esc: function (s) { return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]; }); },
    plata: function (n) { return '$' + Math.round(n || 0).toLocaleString('es-AR'); }
  };
})();
