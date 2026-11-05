/* Web pública de Reina Dabi (demo). Copia de la oficial con los cambios pedidos. */
(function () {
  var $ = function (id) { return document.getElementById(id); };
  var DB = RD.cargar();

  // ---------- Visita (una por sesión) ----------
  RD.origenActual();
  try { if (!sessionStorage.getItem('rd_vis')) { sessionStorage.setItem('rd_vis', '1'); RD.evento('visita'); } } catch (e) { RD.evento('visita'); }

  // ---------- Aviso de demo ----------
  var tAv = 0;
  function avisar(txt) {
    var a = document.querySelector('.aviso-demo'); if (!a) { a = document.createElement('div'); a.className = 'aviso-demo'; a.setAttribute('role', 'status'); document.body.append(a); }
    a.textContent = txt; a.hidden = false; clearTimeout(tAv); tAv = setTimeout(function () { a.hidden = true; }, 3500);
  }

  // ---------- Botones de WhatsApp (en la demo no abren el WhatsApp real) ----------
  document.addEventListener('click', function (ev) {
    var a = ev.target.closest('[data-wa]'); if (!a) return;
    ev.preventDefault(); RD.evento('wa', a.dataset.wa);
    avisar('En la web real esto abre el WhatsApp de Reina Dabi. El clic quedó contado en el panel.');
  });

  // ---------- Galería con detalles (lo que antes era "Hacelo tuyo") ----------
  var DET = {
    cinta: ['🎀', 'Cinta con mensaje', '"Feliz cumple", "Felices 15", un nombre o lo que quieras decir.'],
    mariposas: ['🦋', 'Mariposas', 'Doradas, plateadas o tornasoladas.'],
    corona: ['👑', 'Coronas y perlas', 'Para quinceañeras y reinas de la casa.'],
    perfumadas: ['🌹', 'Rosas perfumadas', 'Un aroma suave que acompaña al ramo.'],
    bombones: ['🍫', 'Con bombones', 'Ramos con chocolates en el centro.'],
    luces: ['💡', 'Con luces', 'Un detalle que brilla en la oscuridad.']
  };
  var FOTO_DET = {
    lila: ['mariposas'], rojas: [], perfumadas: ['perfumadas', 'corona'], verde_blanco: ['mariposas'],
    azul: ['bombones'], mariposa_rosa: ['mariposas'], amarillo: ['cinta'], rosa: ['cinta', 'mariposas']
  };
  document.querySelectorAll('#galeria figure').forEach(function (fig) {
    var img = fig.querySelector('img'), cap = fig.querySelector('figcaption'), id = (img.getAttribute('src').match(/([\w]+)\.jpg/) || [])[1];
    var ds = FOTO_DET[id] || [], titulo = cap.textContent.trim();
    cap.innerHTML = RD.esc(titulo) + (ds.length ? '<span class="ver">Tocá para ver detalles</span>' : '') +
      '<div class="mas"><div>' + ds.map(function (k) { var d = DET[k]; return '<div class="det"><span>' + d[0] + '</span><div><b>' + d[1] + '</b><span>' + d[2] + '</span></div></div>'; }).join('') + '</div></div>';
    fig.tabIndex = 0; fig.setAttribute('role', 'button'); fig.setAttribute('aria-expanded', 'false'); fig.setAttribute('aria-label', titulo + (ds.length ? ': ver detalles' : ''));
    function alternar() {
      var abrir = !fig.classList.contains('abierta');
      document.querySelectorAll('#galeria figure.abierta').forEach(function (f) { f.classList.remove('abierta'); f.setAttribute('aria-expanded', 'false'); });
      if (abrir && ds.length) { fig.classList.add('abierta'); fig.setAttribute('aria-expanded', 'true'); setTimeout(function () { fig.scrollIntoView({ behavior: 'smooth', block: 'nearest' }); }, 60); }
      if (abrir) RD.evento('foto', id);
    }
    fig.addEventListener('click', alternar);
    fig.addEventListener('keydown', function (e) { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); alternar(); } });
  });

  // ---------- Armador de ramo ----------
  var EXTRAS = ['🦋 Mariposas', '🎀 Moño', '🤍 Perlas', '👑 Corona', '🍫 Bombones', '💡 Luces', '🌸 Perfumadas', '💌 Tarjeta'];
  var elegidos = [], mezcla = {};
  var selCant = $('cantidad');
  for (var n = 3; n <= 25; n++) selCant.add(new Option(n + ' rosas', n, false, n === 12));
  var contColores = $('colores');
  Object.keys(RD.COLORES).forEach(function (k) {
    var b = document.createElement('button');
    b.type = 'button'; b.className = 'color'; b.setAttribute('aria-pressed', 'false'); b.dataset.color = k;
    b.innerHTML = '<i style="background:' + RD.COLORES[k][1] + '"></i>' + RD.COLORES[k][0];
    b.addEventListener('click', function () {
      var i = elegidos.indexOf(k);
      if (i >= 0) elegidos.splice(i, 1); else if (elegidos.length < RD.MAX_MIX) elegidos.push(k);
      repartirParejo(); actualizar();
    });
    contColores.append(b);
  });
  // Reparte las rosas en partes iguales entre los colores elegidos (después se ajusta con − / +)
  function repartirParejo() {
    mezcla = {}; if (elegidos.length < 2) return;
    var q = +selCant.value, base = Math.floor(q / elegidos.length), resto = q - base * elegidos.length;
    elegidos.forEach(function (k, i) { mezcla[k] = base + (i < resto ? 1 : 0); });
  }
  function sumaMezcla() { var t = 0; for (var k in mezcla) t += mezcla[k]; return t; }
  $('mezcla').addEventListener('click', function (e) {
    var b = e.target.closest('button'); if (!b) return; var k = b.dataset.k;
    if (b.dataset.op === '+') mezcla[k]++; else if (mezcla[k] > 1) mezcla[k]--;
    actualizar();
  });
  function pintarMezcla() {
    var box = $('mezcla');
    if (elegidos.length < 2) { box.hidden = true; box.innerHTML = ''; return; }
    var q = +selCant.value, t = sumaMezcla(), cls = t === q ? 'ok' : 'mal';
    box.hidden = false;
    box.innerHTML = '<div class="mz-t ' + cls + '">¿Cuántas de cada color? ' + t + ' de ' + q + ' rosas' + (t === q ? ' ✓' : t < q ? ' · faltan ' + (q - t) : ' · sobran ' + (t - q)) + '</div>' +
      elegidos.map(function (k) { return '<div class="mz-fila"><i style="background:' + RD.COLORES[k][1] + '"></i><span>' + RD.COLORES[k][0] + '</span><button type="button" data-k="' + k + '" data-op="-" aria-label="Una ' + RD.COLORES[k][0] + ' menos">−</button><b>' + mezcla[k] + '</b><button type="button" data-k="' + k + '" data-op="+" aria-label="Una ' + RD.COLORES[k][0] + ' más">+</button></div>'; }).join('');
  }
  var contExtras = $('extras');
  EXTRAS.forEach(function (e) {
    var l = document.createElement('label'); l.className = 'opcion';
    l.innerHTML = '<input type="checkbox" value="' + e.slice(e.indexOf(' ') + 1) + '"><span>' + e + '</span>';
    contExtras.append(l);
  });
  var fecha = $('fecha'), hoyStr = RD.dias(0), lim48Str = RD.dias(2);
  fecha.min = hoyStr;
  $('con-cinta').addEventListener('change', function (e) { $('cinta-box').hidden = !e.target.checked; actualizar(); });
  $('cinta').addEventListener('input', function (e) { $('cinta-n').textContent = e.target.value.length; });
  selCant.addEventListener('change', function () { repartirParejo(); });
  $('form-ramo').addEventListener('input', actualizar);
  $('form-ramo').addEventListener('change', actualizar);
  // Embudo: cuenta "empezó a armar" una vez por sesión
  function empezo() { try { if (sessionStorage.getItem('rd_arm')) return; sessionStorage.setItem('rd_arm', '1'); } catch (e) {} RD.evento('armador'); }
  ['input', 'change', 'click'].forEach(function (t) { $('form-ramo').addEventListener(t, empezo); });

  function pedido() {
    var extras = [].map.call(contExtras.querySelectorAll('input:checked'), function (i) { return i.value; });
    var q = +selCant.value, color = elegidos.length === 0 ? 'eleccion' : elegidos.length === 1 ? elegidos[0] : 'combinado';
    return {
      ocasion: $('ocasion').value, qty: q, color: color, mezcla: color === 'combinado' ? JSON.parse(JSON.stringify(mezcla)) : null,
      envoltorio: $('envoltorio').value, cinta: $('con-cinta').checked ? ($('cinta').value.trim() || '(a definir)') : '',
      extras: extras, entrega: fecha.value, entregaTipo: document.querySelector('input[name=entrega]:checked').value,
      nombre: $('nombre').value.trim(), comentarios: $('comentarios').value.trim()
    };
  }
  function fechaLarga(s) { return s ? new Date(s + 'T12:00').toLocaleDateString('es-AR', { weekday: 'long', day: 'numeric', month: 'long' }) : ''; }
  function coloresTxt(d) { return d.color === 'eleccion' ? 'A elección' : RD.mixOk(d) ? RD.colorTxt(d).replace(/^Combinado \((.*)\)$/, '$1') : d.color === 'combinado' ? elegidos.map(function (k) { return RD.COLORES[k][0]; }).join(', ') : RD.color(d.color)[0]; }
  function actualizar() {
    contColores.querySelectorAll('.color').forEach(function (b) {
      var on = elegidos.indexOf(b.dataset.color) >= 0;
      b.setAttribute('aria-pressed', on); b.disabled = !on && elegidos.length >= RD.MAX_MIX;
    });
    pintarMezcla();
    var d = pedido();
    var filas = [['Ocasión', d.ocasion], ['Rosas', d.qty], ['Colores', coloresTxt(d)], ['Envoltorio', d.envoltorio],
      ['Cinta', d.cinta ? '"' + d.cinta + '"' : 'Sin cinta'], ['Extras', d.extras.join(', ') || 'Ninguno'], ['Fecha', fechaLarga(d.entrega) || 'A definir'], ['Entrega', d.entregaTipo]];
    $('resumen').replaceChildren.apply($('resumen'), filas.map(function (f) {
      var li = document.createElement('li'), b = document.createElement('b'), s = document.createElement('span');
      b.textContent = f[0]; s.textContent = f[1]; li.append(b, s); return li;
    }));
    $('nota-fecha').hidden = !(fecha.value && fecha.value < lim48Str);
    $('error-ramo').textContent = '';
  }
  function mensaje(d) {
    var l = ['¡Hola Reina Dabi! 🌹 Quiero pedir un ramo' + (d.nombre ? ', soy ' + d.nombre : '') + ':', '',
      '• Ocasión: ' + d.ocasion, '• Cantidad: ' + d.qty + ' rosas', '• Colores: ' + coloresTxt(d), '• Envoltorio: ' + d.envoltorio];
    if (d.cinta) l.push('• Cinta con mensaje: "' + d.cinta + '"');
    if (d.extras.length) l.push('• Extras: ' + d.extras.join(', '));
    l.push('• Para: ' + (fechaLarga(d.entrega) || 'a coordinar'), '• Entrega: ' + d.entregaTipo);
    if (d.comentarios) l.push('• Comentarios: ' + d.comentarios);
    l.push('', '¿Me pasan el presupuesto? ¡Gracias!');
    return l.join('\n');
  }
  $('enviar-ramo').addEventListener('click', function (ev) {
    ev.preventDefault();
    var d = pedido(), err = '';
    if (fecha.value && fecha.value < hoyStr) err = 'Esa fecha ya pasó. Elegí otra.';
    else if (d.color === 'combinado' && sumaMezcla() !== d.qty) err = 'Revisá cuántas rosas de cada color: tienen que sumar ' + d.qty + '.';
    $('error-ramo').textContent = err; if (err) return;
    DB = RD.cargar();
    d.id = RD.uid(); d.recibido = new Date().toISOString(); d.fuente = RD.origenActual(); d.disp = RD.dispositivo();
    DB.solicitudes.push(d); RD.guardar(DB); RD.evento('pedido');
    $('ok-ramo').innerHTML = '<div class="ok-box"><b>¡Pedido enviado!</b> Ya llegó al panel de Reina Dabi. En la web real además se abre WhatsApp con este mensaje:<pre>' + RD.esc(mensaje(d)) + '</pre><a href="panel.html" style="font-weight:700;color:#2f7a63">Verlo en el panel →</a></div>';
    $('form-ramo').reset(); elegidos = []; mezcla = {}; selCant.value = 12; $('cinta-box').hidden = true; $('cinta-n').textContent = '0';
    actualizar();
  });

  // ---------- Tamaños sugeridos ----------
  document.querySelectorAll('.tamano').forEach(function (b) {
    b.addEventListener('click', function () { selCant.value = b.dataset.rosas; repartirParejo(); actualizar(); $('armador').scrollIntoView({ behavior: 'smooth' }); });
  });

  // ---------- Testimonios (simulación: solo con ?demo en la URL) ----------
  if (new URLSearchParams(location.search).has('demo')) $('testimonios').hidden = false;

  // ---------- Banner y pausa (se manejan desde el panel) ----------
  var WA_SVG = '<svg viewBox="0 0 32 32" fill="#25d366" aria-hidden="true"><path d="M16 3C9 3 3.3 8.6 3.3 15.6c0 2.3.6 4.5 1.8 6.4L3 29l7.2-1.9c1.8 1 3.8 1.5 5.9 1.5 7 0 12.7-5.6 12.7-12.6S23 3 16 3zm0 23.1c-1.9 0-3.8-.5-5.4-1.5l-.4-.2-4.3 1.1 1.1-4.2-.3-.4c-1.1-1.7-1.6-3.6-1.6-5.6C5.1 9.8 10 5 16 5s10.9 4.8 10.9 10.6S22 26.1 16 26.1z"/></svg>';
  function pintarBanner(texto) {
    var el = $('banner'), pista = document.createElement('div');
    pista.className = 'banner-pista';
    function item(oculto) {
      var s = document.createElement('span'); s.className = 'banner-item'; if (oculto) s.setAttribute('aria-hidden', 'true');
      s.append('✨ ' + texto + ' ');
      var a = document.createElement('a'); a.href = '#'; a.dataset.wa = 'banner'; a.innerHTML = WA_SVG + ' Pedí tu ramo'; if (oculto) a.tabIndex = -1;
      s.append(a); return s;
    }
    el.replaceChildren(pista); el.hidden = false;
    var primero = item(false); pista.append(primero);
    var w = primero.getBoundingClientRect().width || 320, porMitad = Math.max(1, Math.ceil(el.clientWidth / w));
    for (var i = 1; i < porMitad; i++) pista.append(item(true));
    for (i = 0; i < porMitad; i++) pista.append(item(true));
    el.style.setProperty('--dur', Math.max(10, Math.round((w * porMitad) / 60)) + 's');
  }
  var cfg = DB.config || {}, txtBanner = cfg.banner || 'Ramos de flores perfumadas, hechos a mano en San Fernando';
  pintarBanner(txtBanner);
  var tB = 0; addEventListener('resize', function () { clearTimeout(tB); tB = setTimeout(function () { pintarBanner(txtBanner); }, 250); });
  if (cfg.abierto === false) { $('arm-grid').hidden = true; $('pausa').hidden = false; }

  actualizar();
})();
