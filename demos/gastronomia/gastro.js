/* Muestra gastronómica: 3 estilos × 5 planes. Usa datos.js (window.GASTRO) y ../comun/reservas.js */
(function () {
  var NUM = '5491126339350', U = 'https://images.unsplash.com/photo-';
  var q = new URLSearchParams(location.search), est = GASTRO[q.get('estilo')] ? q.get('estilo') : 'parrilla', plan = Math.min(5, Math.max(1, +q.get('plan') || 3)), e = GASTRO[est];
  var mesa = plan === 5 && /^\d{1,3}$/.test(q.get('mesa') || '') ? +q.get('mesa') : 0;
  var $ = function (i) { return document.getElementById(i); }, esc = function (x) { return String(x == null ? '' : x).replace(/[<>&"]/g, ''); };
  var pesos = function (n) { return '$' + Math.round(n).toLocaleString('es-AR'); }, hh = function (m) { return String(Math.floor(m / 60) % 24).padStart(2, '0') + ':' + String(m % 60).padStart(2, '0'); };
  var iso = function (d) { return d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0') + '-' + String(d.getDate()).padStart(2, '0'); };
  var DN = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'], D3 = ['dom', 'lun', 'mar', 'mié', 'jue', 'vie', 'sáb'];
  var link = function (k, v) { var p = new URLSearchParams(location.search); p.set(k, v); if (k !== 'mesa') p.delete('mesa'); return '?' + p.toString(); };
  var real = !!(window.FIREBASE_CONFIG && window.FIREBASE_CONFIG.apiKey);
  document.body.className = est; document.title = e.titulo + ' · Muestra StudioProAr';
  var PLANES = [['1', 'Esencial'], ['2', 'Completa'], ['3', 'Pedidos'], ['4', 'Reservas'], ['5', 'Salón Pro']];
  var TXT = { 1: 'Plan Esencial: carta simple, horarios, ubicación, WhatsApp y links a las apps de delivery.', 2: 'Plan Completa: carta con fotos y categorías, galería, eventos y preguntas frecuentes.', 3: 'Plan Pedidos: el cliente arma el pedido en la web y llega armado al WhatsApp del local. Retiro o envío por zona.', 4: 'Plan Reservas: reserva de mesa con cupo por horario, confirmación, recordatorio y cancelación.', 5: 'Plan Salón Pro: todo lo anterior + pedido desde la mesa con QR directo a la cocina, carta editable y resumen del mes.' };
  $('selector').innerHTML = '<span>Estilo:</span>' + [['parrilla', 'Parrilla y bodegón'], ['cafe', 'Café y brunch'], ['urbano', 'Cervecería y burgers']].map(function (x) { return '<a href="' + link('estilo', x[0]) + '"' + (x[0] === est ? ' aria-current="true"' : '') + '>' + x[1] + '</a>'; }).join('') +
    '<span>Plan:</span>' + PLANES.map(function (x) { return '<a href="' + link('plan', x[0]) + '"' + (+x[0] === plan ? ' aria-current="true"' : '') + '>' + x[0] + ' · ' + x[1] + '</a>'; }).join('');
  $('plan-txt').textContent = TXT[plan];
  var waBase = 'https://wa.me/' + NUM + '?text=', waTxt = 'Hola ' + e.nombre + '! Vi su web y quiero ';
  $('wa').href = waBase + encodeURIComponent(waTxt + 'consultar: ');

  /* Plan 5: el dueño edita precios, "agotado", plato del día y promo desde su panel */
  var ED = {}; try { ED = plan === 5 ? JSON.parse(localStorage.getItem('spa_carta_' + e.sitio)) || {} : {}; } catch (er) {}
  var carta = e.carta.map(function (c) { return { cat: c.cat, items: c.items.map(function (x) { var y = Object.assign({}, x); if (ED.precios && ED.precios[x.n]) y.p = ED.precios[x.n]; y.agot = !!(ED.agot && ED.agot[x.n]); y.dia = ED.dia === x.n; return y; }) }; });
  var promo = plan >= 2 ? (ED.promo != null ? ED.promo : e.promo) : ''; if (promo) { $('promo').hidden = false; $('promo').textContent = promo; }

  $('marca').textContent = e.titulo; $('h-zona').textContent = e.zona; $('h-tit').textContent = e.tit; $('h-sub').textContent = e.sub; $('d-dir').textContent = e.dir; $('pie').textContent = e.titulo + ' · ' + e.dir;
  $('hero').style.backgroundImage = 'url(' + U + e.hero + '?w=1600&q=70&auto=format&fit=crop)';
  var nav = [['#carta', 'Carta']]; if (plan >= 4) nav.push(['#reservas', 'Reservas']); if (plan >= 2) nav.push(['#galeria', 'El lugar'], ['#eventos', 'Eventos']); nav.push(['#donde', 'Dónde']);
  $('nav').innerHTML = nav.map(function (n) { return '<a href="' + n[0] + '">' + n[1] + '</a>'; }).join('');
  var hb = [];
  if (plan === 3 || plan === 5) hb.push('<a class="btn" href="#carta">Hacé tu pedido</a>'); else hb.push('<a class="btn" href="#carta">Ver la carta</a>');
  if (plan >= 4) hb.push('<a class="btn sec" href="#reservas">Reservá tu mesa</a>'); else hb.push('<a class="btn sec" target="_blank" rel="noopener" href="' + waBase + encodeURIComponent(waTxt + 'hacer una consulta: ') + '">Escribinos por WhatsApp</a>');
  $('h-btns').innerHTML = hb.join('');
  if (plan <= 2) $('apps').innerHTML = '<a href="#" onclick="return false" title="En la web real va el link a su local en PedidosYa">Pedí por PedidosYa</a><a href="#" onclick="return false" title="En la web real va el link a su local en Rappi">Pedí por Rappi</a>';
  var hf = function (h) { return h % 24 + ' h'; };
  $('hor').innerHTML = [1, 2, 3, 4, 5, 6, 0].map(function (d) { var h = e.hor[d]; return '<tr><td>' + DN[d] + '</td><td>' + (h ? h.map(function (x) { return hf(x[0]) + ' a ' + hf(x[1]); }).join(' y ') : 'Cerrado') + '</td></tr>'; }).join('');
  if (plan >= 2) {
    $('galeria').hidden = false; $('gal').innerHTML = e.gal.map(function (g) { return '<div role="img" aria-label="Foto del lugar" style="background-image:url(' + U + g + '?w=700&q=70&auto=format&fit=crop)"></div>'; }).join('');
    $('eventos').hidden = false; $('ev-tit').textContent = e.eventos.tit; $('ev-txt').textContent = e.eventos.txt; $('ev-btn').href = waBase + encodeURIComponent(waTxt + 'consultar por un evento para el día: ');
    $('ev-gal').innerHTML = e.eventos.fotos.map(function (g) { return '<div style="background-image:url(' + U + g + '?w=600&q=70&auto=format&fit=crop)"></div>'; }).join('');
    $('faq-c').hidden = false; $('faq').innerHTML = e.faq.map(function (f) { return '<details><summary>' + f[0] + '</summary><p>' + f[1] + '</p></details>'; }).join('');
  }

  /* ---------- Carta ---------- */
  var pide = plan === 3 || plan === 5, catSel = 0, todos = [];
  carta.forEach(function (c) { c.items.forEach(function (x) { x.cat = c.cat; todos.push(x); }); });
  function platoH(x) {
    var i = todos.indexOf(x);
    return '<div class="plato' + (x.f ? ' f' : '') + (x.agot ? ' agot' : '') + '">' + (x.f ? '<div class="ft" style="background-image:url(' + U + x.f + '?w=300&q=70&auto=format&fit=crop)"></div>' : '') +
      '<div><b>' + esc(x.n) + (x.dia ? '<span class="tag">Plato del día</span>' : '') + (x.agot ? '<span class="tag">Agotado</span>' : '') + '</b><small>' + esc(x.d) + '</small></div><span class="p">' + pesos(x.p) + '</span>' +
      (pide && !x.agot ? '<button class="add" data-add="' + i + '">Agregar</button>' : '') + '</div>';
  }
  function pintarCarta() {
    if (plan === 1) {
      $('c-sub').textContent = 'Precios actualizados. Para pedir, escribinos por WhatsApp o usá las apps de delivery.';
      $('platos').innerHTML = '<div class="simple">' + carta.map(function (c) { return '<h3 style="margin-top:22px">' + esc(c.cat) + '</h3>' + c.items.map(function (x) { return '<div class="fila"><span>' + esc(x.n) + '</span><b>' + pesos(x.p) + '</b></div>'; }).join(''); }).join('') + '</div>';
      return;
    }
    $('c-sub').textContent = pide ? (mesa ? 'Elegí lo que quieras y mandalo directo a la cocina.' : 'Armá tu pedido y te llega armado por WhatsApp para coordinar la entrega.') : '';
    $('cats').innerHTML = carta.map(function (c, i) { return '<button data-cat="' + i + '" aria-pressed="' + (i === catSel) + '">' + esc(c.cat) + '</button>'; }).join('');
    var dia = todos.filter(function (x) { return x.dia && !x.agot; })[0];
    $('platos').innerHTML = (dia && catSel === 0 ? '<p class="eyebrow" style="margin-top:6px">Hoy recomendamos</p><div class="carta" style="margin-bottom:18px">' + platoH(dia) + '</div>' : '') + '<div class="carta">' + carta[catSel].items.map(platoH).join('') + '</div>';
  }
  $('cats').onclick = function (ev) { var b = ev.target.closest('[data-cat]'); if (!b) return; catSel = +b.dataset.cat; pintarCarta(); };
  pintarCarta();

  /* ---------- Carrito (plan 3 y 5) ---------- */
  var CK = 'gas_car_' + e.sitio + (mesa ? '_m' + mesa : ''), car = [];
  try { car = JSON.parse(sessionStorage.getItem(CK)) || []; } catch (er) {}
  var guardarCar = function () { try { sessionStorage.setItem(CK, JSON.stringify(car)); } catch (er) {} pintarBoton(); };
  var subtotal = function () { return car.reduce(function (a, x) { return a + x.p * x.c; }, 0); };
  function pintarBoton() { var n = car.reduce(function (a, x) { return a + x.c; }, 0); $('carrito-b').hidden = !n; $('carrito-b').textContent = (mesa ? 'Ver pedido de la mesa' : 'Ver mi pedido') + ' · ' + n + ' · ' + pesos(subtotal()); $('wa').style.display = n ? 'none' : ''; }
  if (pide) {
    $('platos').addEventListener('click', function (ev) { var b = ev.target.closest('[data-add]'); if (b) abrirOpciones(todos[+b.dataset.add]); });
    pintarBoton();
  }
  function abrirOpciones(x) {
    if (!x.op && !x.ext) { agregar(x.n, x.p, '', 1); return; }
    var h = '<button class="x" data-cerrar aria-label="Cerrar">×</button><h3>' + esc(x.n) + '</h3><small style="color:var(--su)">' + esc(x.d) + '</small>';
    (x.op || []).forEach(function (o, i) { h += '<fieldset class="op"><legend>' + esc(o.t) + '</legend>' + o.o.map(function (v, j) { return '<label><span><input type="radio" name="o' + i + '" value="' + j + '"' + (j ? '' : ' checked') + '> ' + esc(v[0]) + '</span><span>' + (v[1] ? '+ ' + pesos(v[1]) : '') + '</span></label>'; }).join('') + '</fieldset>'; });
    if (x.ext) h += '<fieldset class="op"><legend>Extras</legend>' + x.ext.map(function (v, j) { return '<label><span><input type="checkbox" name="ext" value="' + j + '"> ' + esc(v[0]) + '</span><span>+ ' + pesos(v[1]) + '</span></label>'; }).join('') + '</fieldset>';
    h += '<div class="f"><input id="op-nota" maxlength="60" placeholder="Aclaración (opcional): sin sal, sin cebolla…"></div><div class="tot"><span>Cantidad</span><span class="cant"><button type="button" data-oc="-1">−</button><b id="op-c">1</b><button type="button" data-oc="1">+</button></span></div><button class="btn" style="width:100%" id="op-ok"></button>';
    $('op').innerHTML = h; var c = 1, d = $('dlg-op');
    var calc = function () { var p = x.p, det = []; (x.op || []).forEach(function (o, i) { var v = o.o[+(d.querySelector('[name=o' + i + ']:checked') || {}).value || 0]; p += v[1]; det.push(v[0]); }); [].forEach.call(d.querySelectorAll('[name=ext]:checked'), function (k) { var v = x.ext[+k.value]; p += v[1]; det.push('+' + v[0]); }); var n = $('op-nota').value.trim(); if (n) det.push(n); return { p: p, det: det.join(', ') }; };
    var pint = function () { $('op-c').textContent = c; $('op-ok').textContent = 'Agregar ' + c + ' · ' + pesos(calc().p * c); };
    d.onchange = pint; d.oninput = pint;
    d.onclick = function (ev) { if (ev.target === d || ev.target.closest('[data-cerrar]')) return d.close(); var b = ev.target.closest('[data-oc]'); if (b) { c = Math.max(1, Math.min(20, c + +b.dataset.oc)); pint(); } if (ev.target.id === 'op-ok') { var r = calc(); agregar(x.n, r.p, r.det, c); d.close(); } };
    pint(); d.showModal();
  }
  function agregar(n, p, det, c) {
    var k = n + '|' + det, it = car.filter(function (y) { return y.k === k; })[0];
    if (it) it.c += c; else car.push({ k: k, n: n, det: det, p: p, c: c });
    guardarCar(); var b = $('carrito-b'); b.animate && b.animate([{ transform: 'translateX(-50%) scale(1.12)' }, { transform: 'translateX(-50%) scale(1)' }], 250);
  }
  var ent = { modo: 'retiro', zona: 0, pago: 'Efectivo' };
  function pintarCarrito(msg) {
    var st = subtotal(), z = e.zonas[ent.zona], env = ent.modo === 'envio' ? (z[1] == null ? null : st >= e.gratis ? 0 : z[1]) : 0, tot = st + (env || 0);
    var h = '<button class="x" data-cerrar aria-label="Cerrar">×</button><h3>' + (mesa ? 'Pedido de la mesa ' + mesa : 'Tu pedido') + '</h3>';
    h += car.length ? car.map(function (x, i) { return '<div class="lin"><span><b>' + esc(x.n) + '</b><small>' + esc(x.det) + '</small><small>' + pesos(x.p) + ' c/u</small></span><span class="cant"><button type="button" data-c="' + i + '" data-d="-1" aria-label="Uno menos">−</button><b>' + x.c + '</b><button type="button" data-c="' + i + '" data-d="1" aria-label="Uno más">+</button></span></div>'; }).join('') : '<p>Todavía no agregaste nada.</p>';
    if (car.length && mesa) {
      h += '<div class="tot"><span>Total</span><span>' + pesos(st) + '</span></div><div class="f"><input id="c-nom" maxlength="30" placeholder="Tu nombre (opcional)"></div><button class="btn" style="width:100%" data-enviar="mesa">Enviar a la cocina</button><p style="color:var(--su);font-size:14px">El pedido llega a la pantalla de la cocina. La cuenta se paga al final, en la mesa.</p>';
    } else if (car.length) {
      h += '<div class="seg"><button type="button" data-modo="retiro" aria-pressed="' + (ent.modo === 'retiro') + '">Retiro en el local</button><button type="button" data-modo="envio" aria-pressed="' + (ent.modo === 'envio') + '">Envío a domicilio</button></div>';
      h += '<div class="f">';
      if (ent.modo === 'envio') h += '<label>Zona<select id="c-zona">' + e.zonas.map(function (z, i) { return '<option value="' + i + '"' + (i === ent.zona ? ' selected' : '') + '>' + z[0] + (z[1] == null ? ' (a coordinar)' : ' · ' + pesos(z[1])) + '</option>'; }).join('') + '</select></label><input id="c-dir" maxlength="80" placeholder="Dirección y entre calles" value="' + esc(ent.dir || '') + '">';
      h += '<input id="c-nom" maxlength="40" placeholder="Tu nombre" autocomplete="given-name" value="' + esc(ent.nom || '') + '"><input id="c-cel" type="tel" inputmode="tel" maxlength="20" placeholder="Celular (ej. 1155554444)" value="' + esc(ent.cel || '') + '"><label>¿Cómo pagás?<select id="c-pago">' + ['Efectivo', 'Transferencia'].map(function (p) { return '<option' + (p === ent.pago ? ' selected' : '') + '>' + p + '</option>'; }).join('') + '</select></label><textarea id="c-nota" rows="2" maxlength="120" placeholder="Nota (opcional)">' + esc(ent.nota || '') + '</textarea></div>';
      h += '<div class="lin"><span>Subtotal</span><span>' + pesos(st) + '</span></div>' + (ent.modo === 'envio' ? '<div class="lin"><span>Envío</span><span>' + (env == null ? 'a coordinar' : env === 0 ? 'gratis' : pesos(env)) + '</span></div>' : '');
      h += '<div class="tot"><span>Total</span><span>' + pesos(tot) + (env == null ? ' + envío' : '') + '</span></div>';
      if (ent.modo === 'envio') h += '<p style="color:var(--su);font-size:14px">Envío gratis desde ' + pesos(e.gratis) + '. Pedido mínimo para envío ' + pesos(e.minimo) + '.</p>';
      h += '<button class="btn" style="width:100%" data-enviar="wa">Enviar pedido por WhatsApp</button><p style="color:var(--su);font-size:14px">Se abre WhatsApp con el pedido armado. Ahí el local te confirma la demora y coordinan el pago.</p>';
    }
    h += '<p id="c-msg" class="err" role="status">' + (msg || '') + '</p>';
    $('car').innerHTML = h;
  }
  function leerForm() { ['dir', 'nom', 'cel', 'nota'].forEach(function (k) { var i = $('c-' + k); if (i) ent[k] = i.value; }); var p = $('c-pago'); if (p) ent.pago = p.value; }
  $('carrito-b').onclick = function () { pintarCarrito(); $('dlg-car').showModal(); };
  $('dlg-car').onchange = function (ev) { if (ev.target.id === 'c-zona') { leerForm(); ent.zona = +ev.target.value; pintarCarrito(); } };
  $('dlg-car').onclick = function (ev) {
    var d = $('dlg-car'), b = ev.target.closest('button');
    if (ev.target === d || (b && b.hasAttribute('data-cerrar'))) return d.close();
    if (!b) return;
    if (b.dataset.c) { leerForm(); var x = car[+b.dataset.c]; x.c += +b.dataset.d; if (x.c < 1) car.splice(+b.dataset.c, 1); guardarCar(); if (!car.length) d.close(); else pintarCarrito(); return; }
    if (b.dataset.modo) { leerForm(); ent.modo = b.dataset.modo; pintarCarrito(); return; }
    if (b.dataset.enviar === 'mesa') return enviarMesa(b);
    if (b.dataset.enviar === 'wa') return enviarWA(b);
  };
  function itemsCorto() { return car.slice(0, 99).map(function (x) { return { n: (x.n + (x.det ? ' (' + x.det + ')' : '')).slice(0, 80), c: x.c, p: x.p }; }); }
  function enviarWA(b) {
    leerForm(); var st = subtotal(), z = e.zonas[ent.zona], envio = ent.modo === 'envio', env = envio ? (z[1] == null ? null : st >= e.gratis ? 0 : z[1]) : 0, tot = st + (env || 0);
    var nom = (ent.nom || '').trim().slice(0, 40), cel = Reservas.normCel(ent.cel);
    if (nom.length < 2) return pintarCarrito('Escribí tu nombre.');
    if (!Reservas.celOk(cel)) return pintarCarrito('Escribí tu celular con código de área, sin 0 ni 15 (ej. 1155554444).');
    if (envio && (ent.dir || '').trim().length < 5) return pintarCarrito('Escribí la dirección de entrega.');
    if (envio && st < e.minimo) return pintarCarrito('El pedido mínimo para envío es ' + pesos(e.minimo) + '.');
    var ret = envio ? 'Envío · ' + z[0] : 'Retiro en el local';
    var t = '*Pedido desde la web* 🛒\n' + car.map(function (x) { return '• ' + x.c + ' × ' + x.n + (x.det ? ' (' + x.det + ')' : '') + ' — ' + pesos(x.p * x.c); }).join('\n') +
      '\n\nSubtotal: ' + pesos(st) + (envio ? '\nEnvío (' + z[0] + '): ' + (env == null ? 'a coordinar' : env === 0 ? 'gratis' : pesos(env)) : '') + '\n*Total: ' + pesos(tot) + (env == null ? ' + envío' : '') + '*' +
      '\n\n' + (envio ? '🛵 Envío a: ' + ent.dir.trim() : '🏠 Retiro en el local') + '\n💵 Pago: ' + ent.pago + '\n👤 ' + nom + ' · ' + cel + (ent.nota && ent.nota.trim() ? '\n📝 ' + ent.nota.trim() : '');
    /* Se abre WhatsApp al toque (si no, el navegador lo bloquea) y en paralelo queda la copia en el panel del dueño */
    var url = waBase.replace(NUM, NUM) + encodeURIComponent(t);
    window.open(url, '_blank');
    Reservas.iniciar({ sitio: e.sitio, col: 'encargos', clave: 'spa_p_' + e.sitio });
    Reservas.guardar({ id: Date.now(), nombre: nom, cel: cel, ret: ret.slice(0, 60), total: tot, items: itemsCorto(), estado: 'nuevo', creado: Date.now() }).catch(function () {});
    car = []; guardarCar();
    $('car').innerHTML = '<button class="x" data-cerrar aria-label="Cerrar">×</button><h3>¡Listo, ' + esc(nom) + '!</h3><p>Se abrió WhatsApp con tu pedido. <b>Tocá enviar</b> para que le llegue al local. Ahí te confirman la demora.</p><p><a class="btn" href="' + url + '" target="_blank" rel="noopener">Abrir WhatsApp de nuevo</a></p>';
  }

  /* ---------- Pedido desde la mesa (plan 5, ?mesa=N). En la muestra va al panel de cocina de este navegador ---------- */
  var MK = 'gas_mesa_' + e.sitio;
  var mesaLista = function () { try { return JSON.parse(localStorage.getItem(MK)) || []; } catch (er) { return []; } };
  var mesaGuardar = function (l) { try { localStorage.setItem(MK, JSON.stringify(l.slice(-80))); } catch (er) {} };
  function enviarMesa() {
    leerForm(); var l = mesaLista(), id = 'w' + Date.now();
    l.push({ id: id, tipo: 'pedido', mesa: mesa, nombre: (ent.nom || '').trim().slice(0, 30), items: itemsCorto(), total: subtotal(), estado: 'nuevo', t: Date.now() }); mesaGuardar(l);
    try { var mis = JSON.parse(sessionStorage.getItem('gas_mios')) || []; mis.push(id); sessionStorage.setItem('gas_mios', JSON.stringify(mis)); } catch (er) {}
    car = []; guardarCar(); $('dlg-car').close(); pintarMesa('✓ Pedido enviado a la cocina');
  }
  function evento(tipo) { var l = mesaLista(); l.push({ id: 'w' + Date.now(), tipo: tipo, mesa: mesa, estado: 'nuevo', t: Date.now() }); mesaGuardar(l); pintarMesa(tipo === 'mozo' ? '🙋 Ya le avisamos al mozo' : '🧾 Pedimos la cuenta: en un momento te la traen'); }
  var EST = { nuevo: 'Recibido en la cocina', prep: 'En preparación 👨‍🍳', listo: '¡Listo! Ya te lo llevan', entregado: 'Entregado' };
  function pintarMesa(aviso) {
    var mis = []; try { mis = JSON.parse(sessionStorage.getItem('gas_mios')) || []; } catch (er) {}
    var l = mesaLista().filter(function (x) { return x.tipo === 'pedido' && mis.indexOf(x.id) >= 0; });
    $('mesa-bar').innerHTML = '<div class="mesa-bar"><b>Mesa ' + mesa + ' · Pedí desde acá</b><span><button data-ev="mozo">Llamar al mozo</button> <button data-ev="cuenta">Pedir la cuenta</button></span></div>' +
      (aviso || l.length ? '<div class="in"><div class="estado" role="status">' + (aviso ? '<b>' + aviso + '</b>' : '') + l.map(function (x) { return '<div>Pedido de las ' + hh(new Date(x.t).getHours() * 60 + new Date(x.t).getMinutes()) + ': <b>' + EST[x.estado] + '</b> <small>(' + x.items.map(function (i) { return i.c + ' × ' + esc(i.n); }).join(', ') + ')</small></div>'; }).join('') + '</div></div>' : '');
  }
  if (mesa) {
    $('mesa-bar').onclick = function (ev) { var b = ev.target.closest('[data-ev]'); if (b) evento(b.dataset.ev); };
    pintarMesa(); setInterval(function () { pintarMesa(); }, 3000);
    $('hero').style.display = 'none';
    ['reservas', 'galeria', 'eventos'].forEach(function (k) { $(k).style.display = 'none'; });
  } else if (plan === 5) {
    $('c-sub').insertAdjacentHTML('afterend', '<p class="caja" style="margin:10px 0">📱 <b>En el local, cada mesa tiene su QR.</b> El cliente lo escanea, pide y el pedido aparece en la pantalla de la cocina (sin WhatsApp). <a href="' + link('mesa', '4') + '">Probá cómo pide la mesa 4 →</a></p>');
  }

  /* ---------- Reservas de mesa (plan 4 y 5): cupo de reservas por horario ---------- */
  if (plan >= 4 && !mesa) {
    $('reservas').hidden = false; $('rs-reglas').textContent = e.reglas;
    var RK = 'spa_r_' + e.sitio, dias = [];
    for (var i = 0; i < 30 && dias.length < 14; i++) { var d0 = new Date(); d0.setHours(0, 0, 0, 0); d0.setDate(d0.getDate() + i); if (e.hor[d0.getDay()]) dias.push(d0); }
    var sel = { d: dias[0], h: null, p: 2 };
    var slots = function (d) { var r = []; e.hor[d.getDay()].forEach(function (x) { for (var m = x[0] * 60; m <= Math.min(x[1] * 60 - 90, 23 * 60 + 30); m += 30) r.push(m); }); return r; };
    var usados = function (d, m) { return Reservas.listaDe(e.sitio, RK).filter(function (t) { return t.fecha === iso(d) && t.ini >= m && t.ini < m + 30; }); };
    var libre = function (d, m) { var hoy = iso(d) === iso(new Date()), ah = new Date().getHours() * 60 + new Date().getMinutes(); return !(hoy && m <= ah + 30) && usados(d, m).length < e.cupo; };
    Reservas.iniciar({ sitio: e.sitio, col: 'turnos', clave: RK, paso: 1, mios: e.sitio });
    $('rs').innerHTML = '<div class="ag-mios"></div><span class="et">1. ¿Cuántos son?</span><select id="rs-p" style="width:100%;padding:11px;border-radius:10px;border:1px solid var(--bo);background:var(--bg)">' + Array.apply(null, Array(e.grupoMax + 4)).map(function (_, i) { var n = i + 1; return '<option value="' + n + '"' + (n === 2 ? ' selected' : '') + '>' + n + (n === 1 ? ' persona' : ' personas') + (n > e.grupoMax ? ' (a confirmar)' : '') + '</option>'; }).join('') + '</select>' +
      '<span class="et">2. Día</span><div class="fila dias" id="rs-d"></div><span class="et">3. Horario</span><div class="fila" id="rs-h"></div><p id="rs-res" role="status"></p>' +
      '<div class="f"><input id="rs-nom" maxlength="40" placeholder="Nombre" autocomplete="given-name"><input id="rs-cel" type="tel" inputmode="tel" maxlength="20" placeholder="Celular (ej. 1155554444)"><input id="rs-mail" type="email" maxlength="80" placeholder="Mail (opcional)"></div><button class="btn" style="width:100%" id="rs-ok" disabled>Confirmar reserva</button><div id="rs-msg" role="status" style="margin-top:10px"></div>';
    var pintarR = function () {
      $('rs-d').innerHTML = dias.map(function (d) { return '<button type="button" class="ag-b" data-d="' + iso(d) + '" aria-pressed="' + (iso(d) === iso(sel.d)) + '">' + D3[d.getDay()] + '<small>' + d.getDate() + '/' + (d.getMonth() + 1) + '</small></button>'; }).join('');
      var ss = slots(sel.d); if (sel.h != null && !libre(sel.d, sel.h)) sel.h = null;
      $('rs-h').innerHTML = ss.map(function (m) { var ok = libre(sel.d, m); return '<button type="button" class="ag-b" data-h="' + m + '"' + (ok ? '' : ' disabled') + ' aria-pressed="' + (m === sel.h) + '">' + hh(m) + '</button>'; }).join('');
      var big = sel.p > e.grupoMax;
      $('rs-res').innerHTML = sel.h == null ? 'Elegí un horario libre.' : '<b>Mesa para ' + sel.p + '</b> · ' + D3[sel.d.getDay()] + ' ' + sel.d.getDate() + '/' + (sel.d.getMonth() + 1) + ' · ' + hh(sel.h) + ' h' + (big ? '<br><small>Por ser un grupo grande, la reserva queda <b>a confirmar</b>: te escribimos por WhatsApp.</small>' : '');
      $('rs-ok').disabled = sel.h == null; $('rs-ok').textContent = big ? 'Pedir reserva' : 'Confirmar reserva';
    };
    $('rs-p').onchange = function () { sel.p = +this.value; pintarR(); };
    $('rs-d').onclick = function (ev) { var b = ev.target.closest('[data-d]'); if (!b) return; sel.d = dias.filter(function (d) { return iso(d) === b.dataset.d; })[0]; sel.h = null; pintarR(); };
    $('rs-h').onclick = function (ev) { var b = ev.target.closest('[data-h]'); if (!b || b.disabled) return; sel.h = +b.dataset.h; pintarR(); };
    $('rs-ok').onclick = function () {
      var nom = $('rs-nom').value.trim().slice(0, 40), cel = Reservas.normCel($('rs-cel').value), mail = $('rs-mail').value.trim(), msg = $('rs-msg');
      if (nom.length < 2) { msg.textContent = 'Escribí tu nombre.'; return; }
      if (!Reservas.celOk(cel)) { msg.textContent = 'Escribí tu celular con código de área, sin 0 ni 15 (ej. 1155554444).'; return; }
      if (!Reservas.mailOk(mail)) { msg.textContent = 'Revisá el mail (o dejalo vacío).'; return; }
      var u = usados(sel.d, sel.h).map(function (t) { return t.ini; }), k = 0; while (u.indexOf(sel.h + k) >= 0 && k < e.cupo) k++;
      if (k >= e.cupo) { msg.textContent = 'Ese horario se acaba de llenar. Elegí otro.'; pintarR(); return; }
      var big = sel.p > e.grupoMax, h0 = sel.h, f = iso(sel.d), sv = 'Mesa para ' + sel.p, bt = $('rs-ok');
      var t = { id: Date.now(), fecha: f, ini: real ? h0 : h0 + k, min: 1, servicio: sv, dur: big ? 'a confirmar' : '', nombre: nom, cel: cel, email: mail || undefined, estado: big ? 'nuevo' : 'confirmado' };
      bt.disabled = true; msg.textContent = 'Guardando…';
      Reservas.guardar(t, { llave: h0 + k }).then(function (id) {
        var baja = Reservas.linkBaja(id, { fecha: f, ini: h0, negocio: e.nombre, servicio: sv });
        if (mail && window.Correo && !big) Correo.confirmacion({ email: mail, nombre: nom, negocio: e.nombre, servicio: sv, fecha: f, ini: h0, linkBaja: baja, web: location.href.split('#')[0] });
        msg.innerHTML = Reservas.tarjeta({ id: id, titulo: big ? '⏳ Reserva pedida: queda a confirmar' : '✓ Reserva confirmada', negocio: e.nombre, servicio: sv, fecha: f, ini: h0, min: 90, nombre: nom, lugar: e.dir, waNum: NUM, baja: baja, mail: window.Correo && Correo.activo() && !big ? mail : '' });
        Reservas.pintarMios(document.querySelector('#rs .ag-mios')); sel.h = null; pintarR();
      }).catch(function (er) { msg.textContent = er.message; bt.disabled = false; pintarR(); });
    };
    Reservas.alCambiar(pintarR); Reservas.pintarMios(document.querySelector('#rs .ag-mios')); pintarR();
  }
})();
