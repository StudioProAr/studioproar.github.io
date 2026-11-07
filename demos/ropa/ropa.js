/* Muestra de tienda de ropa: ?estilo=urbano|minimal|femenina&plan=1|2|3|5
   Plan 1: una sola página. Plan 2: tienda de varias páginas, consultas por WhatsApp.
   Plan 3: + carrito, envío por zona, pedido armado por WhatsApp y copia en el panel, botón de arrepentimiento.
   Plan 5: + favoritos, ofertas y "agotado" que el dueño edita desde su panel, seguimiento del pedido y cuotas. */
(function () {
  var D = window.ROPA, NUM = '5491126339350', U = 'https://images.unsplash.com/photo-';
  var q = new URLSearchParams(location.search);
  var EST = { urbano: { n: 'Calle Norte', s: 'callenorte', t: 'Urbana', lema: 'Ropa urbana para todos los días', h1: 'Ropa urbana <em>sin vueltas</em>.', zona: 'Zona norte · Envíos a todo el país' },
    minimal: { n: 'Básico Studio', s: 'basico', t: 'Minimal', lema: 'Básicos que combinan con todo', h1: 'Básicos que <em>duran</em>.', zona: 'Victoria · Envíos a todo el país' },
    femenina: { n: 'Isla Bonita', s: 'lasisleras', t: 'Femenina', lema: 'Ropa linda para todos los días', h1: 'Ropa linda, <em>todos los días</em>.', zona: 'Tigre · Envíos a todo el país' } };
  var est = EST[q.get('estilo')] ? q.get('estilo') : 'urbano', E = EST[est];
  var PL = [1, 2, 3, 5], plan = PL.indexOf(+q.get('plan')) >= 0 ? +q.get('plan') : 3;
  var PN = { 1: 'Esencial', 2: 'Completa', 3: 'Catálogo y pedidos', 5: 'Autogestionable' };
  var $ = function (i) { return document.getElementById(i); }, esc = function (x) { return String(x == null ? '' : x).replace(/[<>&"]/g, ''); };
  var pesos = function (n) { return '$' + Math.round(n).toLocaleString('es-AR'); };
  var foto = function (id, w) { return U + id + '?w=' + (w || 700) + '&q=72&auto=format&fit=crop'; };
  var wa = function (t) { return 'https://wa.me/' + NUM + '?text=' + encodeURIComponent(t); };
  var link = function (k, v) { var p = new URLSearchParams(location.search); p.set(k, v); return '?' + p.toString() + location.hash; };
  document.body.className = est; document.title = E.n + ' · Muestra StudioProAr';
  var CARRITO = plan >= 3, PAGINAS = plan >= 2, PRO = plan === 5;
  var ENVIOS = [['retiro', 'Retiro en el local', 0], ['norte', 'Moto en zona norte', 3500], ['caba', 'Moto a CABA', 4500], ['correo', 'Correo a todo el país', 7500]], GRATIS = 90000, TRANSF = 10;

  /* Plan 5: el dueño edita precios, "agotado" y la promo desde su panel (en la muestra, en este navegador) */
  var ED = {}; try { ED = PRO ? JSON.parse(localStorage.getItem('spa_carta_' + E.s)) || {} : {}; } catch (e) {}
  var OFERTA = PRO ? { 'remera-oversize': 29500, 'cargo': 62000, 'campera-nylon': 85000 } : {};
  var NUEVO = PRO ? ['blazer', 'tapado', 'top-corto'] : [];
  var POCAS = PRO ? ['sweater', 'jean-mom'] : [];
  D.productos.forEach(function (p) {
    p.ant = OFERTA[p.id] || 0;
    if (ED.precios && ED.precios[p.nombre]) p.precio = ED.precios[p.nombre];
    p.agot = !!(ED.agot && ED.agot[p.nombre]);
  });
  var prod = function (id) { return D.productos.filter(function (p) { return p.id === id; })[0]; };

  /* ---------- Estado guardado ---------- */
  var K = 'ropa_' + E.s, car = [], favs = [];
  try { car = JSON.parse(localStorage.getItem(K + '_car')) || []; favs = JSON.parse(localStorage.getItem(K + '_fav')) || []; } catch (e) {}
  var guardar = function () { try { localStorage.setItem(K + '_car', JSON.stringify(car)); localStorage.setItem(K + '_fav', JSON.stringify(favs)); } catch (e) {} pintarAcc(); };
  var nCar = function () { return car.reduce(function (a, x) { return a + x.c; }, 0); };
  var subtotal = function () { return car.reduce(function (a, x) { return a + x.p * x.c; }, 0); };
  function toast(t) { var el = $('toast'); el.textContent = t; el.classList.add('on'); clearTimeout(toast.t); toast.t = setTimeout(function () { el.classList.remove('on'); }, 2200); }

  /* ---------- Cabecera, selector y pie ---------- */
  $('selector').innerHTML = '<span>Estilo:</span>' + Object.keys(EST).map(function (k) { return '<a href="' + link('estilo', k) + '"' + (k === est ? ' aria-current="true"' : '') + '>' + EST[k].t + '</a>'; }).join('') +
    '<span>Plan:</span>' + PL.map(function (n) { return '<a href="' + link('plan', n) + '"' + (n === plan ? ' aria-current="true"' : '') + '>' + n + ' · ' + PN[n] + '</a>'; }).join('');
  var promo = PRO ? (ED.promo != null ? ED.promo : '3 cuotas sin interés · 10% off por transferencia · envío gratis desde ' + pesos(GRATIS)) : (plan >= 3 ? '10% off pagando por transferencia · Envío gratis desde ' + pesos(GRATIS) : '');
  if (promo) { $('promo').hidden = false; $('promo').textContent = promo; }
  $('marca').textContent = E.n; $('marca').href = PAGINAS ? '#/' : '#';
  var NAV = PAGINAS ? [['#/', 'Inicio'], ['#/catalogo', 'Catálogo'], ['#/catalogo?g=mujer', 'Mujer'], ['#/catalogo?g=hombre', 'Hombre'], ['#/como-comprar', 'Cómo comprar'], ['#/contacto', 'Contacto']] : [['#catalogo', 'Productos'], ['#como', 'Cómo comprar'], ['#contacto', 'Contacto']];
  if (PRO) NAV.splice(4, 0, ['#/catalogo?o=1', 'Ofertas']);
  $('menu').innerHTML = NAV.map(function (n) { return '<a href="' + n[0] + '">' + n[1] + '</a>'; }).join('');
  $('ham').hidden = false;
  function pintarAcc() {
    $('acc').innerHTML = (PAGINAS ? '<a class="icb" href="#/catalogo?buscar=1" aria-label="Buscar">⌕</a>' : '') +
      (PRO ? '<a class="icb" href="#/favoritos" aria-label="Favoritos">♡' + (favs.length ? '<span class="n">' + favs.length + '</span>' : '') + '</a>' : '') +
      (CARRITO ? '<button class="icb" type="button" id="b-car" aria-label="Carrito">🛍' + (nCar() ? '<span class="n">' + nCar() + '</span>' : '') + '</button>' : '');
    var b = $('b-car'); if (b) b.onclick = abrirCarrito;
  }
  pintarAcc();
  $('wa').href = wa('Hola ' + E.n + '! Vi su web y quiero consultar: ');
  var pie = '<div class="in"><div><a class="marca" href="' + (PAGINAS ? '#/' : '#') + '">' + E.n + '</a><p>' + E.lema + '.</p><p>' + E.zona + '</p></div>' +
    '<div><h4>Tienda</h4>' + (PAGINAS ? '<a href="#/catalogo">Catálogo</a><a href="#/catalogo?g=mujer">Mujer</a><a href="#/catalogo?g=hombre">Hombre</a>' : '<a href="#catalogo">Productos</a>') + (PRO ? '<a href="#/favoritos">Favoritos</a>' : '') + '</div>' +
    '<div><h4>Ayuda</h4>' + (PAGINAS ? '<a href="#/como-comprar">Cómo comprar</a><a href="#/como-comprar">Envíos y cambios</a><a href="#/talles">Guía de talles</a>' : '<a href="#como">Cómo comprar</a>') + (PRO ? '<a href="#/mi-pedido">Seguí tu pedido</a>' : '') + '</div>' +
    '<div><h4>Contacto</h4><a href="' + wa('Hola ' + E.n + '! ') + '" target="_blank" rel="noopener">WhatsApp</a><a href="#" onclick="return false">Instagram</a><p>Lun a sáb de 10 a 19 h</p>' + (CARRITO ? '<a class="arr" href="#/arrepentimiento">Botón de arrepentimiento</a>' : '') + '</div>' +
    '<div class="leg"><span>© ' + new Date().getFullYear() + ' ' + E.n + ' · Precios en pesos argentinos con IVA incluido</span><span>Web hecha por StudioProAr</span></div></div>';
  $('pie').innerHTML = pie;

  /* ---------- Piezas ---------- */
  var fotosDe = function (p, ci) { return p.colores[ci || 0].fotos; };
  function badges(p) {
    var b = [];
    if (p.agot) b.push('<span class="ag">Agotado</span>');
    else if (p.ant) b.push('<span class="of">−' + Math.round((1 - p.precio / p.ant) * 100) + '%</span>');
    if (NUEVO.indexOf(p.id) >= 0) b.push('<span>Nuevo</span>');
    if (POCAS.indexOf(p.id) >= 0 && !p.agot) b.push('<span>Últimas unidades</span>');
    if (PRO && p.destacado && b.length < 2) b.push('<span>Más vendido</span>');
    return b.length ? '<div class="bdg">' + b.join('') + '</div>' : '';
  }
  function card(p) {
    var f = fotosDe(p), href = PAGINAS ? '#/p/' + p.id : wa('Hola ' + E.n + '! Quiero consultar por: ' + p.nombre);
    var fav = PRO ? '<button class="fav" type="button" data-fav="' + p.id + '" aria-pressed="' + (favs.indexOf(p.id) >= 0) + '" aria-label="Guardar en favoritos">' + (favs.indexOf(p.id) >= 0 ? '♥' : '♡') + '</button>' : '';
    return '<div class="prod">' + fav + '<a href="' + href + '"' + (PAGINAS ? '' : ' target="_blank" rel="noopener"') + ' style="text-decoration:none"><div class="ft"><img src="' + foto(f[0], 600) + '" alt="' + esc(p.nombre) + '" loading="lazy">' + (f[1] && PAGINAS ? '<img class="b" src="' + foto(f[1], 600) + '" alt="" loading="lazy">' : '') + badges(p) + '</div>' +
      '<h3>' + esc(p.nombre) + '</h3><div class="pr">' + pesos(p.precio) + (p.ant ? '<s>' + pesos(p.ant) + '</s>' : '') + '</div>' +
      (PRO ? '<div class="cuo">3 cuotas sin interés de ' + pesos(p.precio / 3) + '</div>' : '') +
      (PAGINAS ? '<div class="sw">' + p.colores.map(function (c) { return '<i style="background:' + c.hex + '" title="' + esc(c.nombre) + '"></i>'; }).join('') + '</div>' : '<span class="btn sec consult">Consultar por WhatsApp</span>') + '</a></div>';
  }
  var benef = function () { return '<div class="benef in">' + [['🚚', 'Envíos a todo el país', 'Gratis desde ' + pesos(GRATIS)], ['↺', 'Cambios en 30 días', 'Con etiqueta y ticket'], ['💳', CARRITO ? TRANSF + '% off por transferencia' : 'Transferencia o efectivo', PRO ? 'o 3 cuotas sin interés' : 'Te pasamos los datos'], ['💬', 'Te asesoramos', 'Por WhatsApp, de lun a sáb']].map(function (b) { return '<div><i>' + b[0] + '</i><span><b>' + b[1] + '</b>' + b[2] + '</span></div>'; }).join('') + '</div>'; };
  var catImg = { Remeras: 'remera-oversize', Buzos: 'buzo-canguro', Camisas: 'camisa-vaquera', Pantalones: 'jean-mom', Abrigos: 'campera-jean' };

  /* ---------- Plan 1: una sola página ---------- */
  function vistaEsencial() {
    var dest = D.productos.filter(function (p) { return p.destacado; }).slice(0, 8);
    return '<section class="hero"><div class="in"><div><p class="eye">' + E.zona + '</p><h1>' + E.h1 + '</h1><p>' + E.lema + '. Mirá lo que tenemos y consultanos por WhatsApp: te respondemos con talles, colores y cómo pagar.</p><div class="btns"><a class="btn" href="#catalogo">Ver productos</a><a class="btn sec" href="' + wa('Hola ' + E.n + '! Quiero consultar: ') + '" target="_blank" rel="noopener">Escribinos</a></div></div><div class="fotos"><img src="' + foto(fotosDe(prod('buzo-canguro'))[0], 600) + '" alt=""><img src="' + foto(fotosDe(prod('jean-mom'))[0], 600) + '" alt=""></div></div></section>' +
      '<section class="s alt" id="catalogo"><div class="in"><div class="cab"><h2>Lo que más sale</h2></div><div class="grid">' + dest.map(card).join('') + '</div><p style="color:var(--su);margin-top:26px">¿Buscás otra prenda? Escribinos: tenemos remeras, buzos, camisas, pantalones y abrigos.</p></div></section>' +
      '<section class="s" id="como"><div class="in dos" style="padding:0"><div><h2>Cómo comprar</h2><p style="color:var(--su)">1. Elegí la prenda y escribinos por WhatsApp.<br>2. Te confirmamos talle y color disponibles.<br>3. Pagás por transferencia o en efectivo.<br>4. Retirás en el local o te lo enviamos.</p></div><div id="contacto"><h2>Dónde estamos</h2><p style="color:var(--su)">' + E.zona + '<br>Lunes a sábados de 10 a 19 h</p><iframe class="mapa" loading="lazy" title="Mapa" src="https://www.google.com/maps?q=Tigre,+Buenos+Aires&output=embed"></iframe></div></div></section>';
  }

  /* ---------- Plan 2+: páginas ---------- */
  function vistaInicio() {
    var dest = D.productos.filter(function (p) { return p.destacado; }), of = D.productos.filter(function (p) { return p.ant; });
    return '<section class="hero"><div class="in"><div><p class="eye">Nueva temporada</p><h1>' + E.h1 + '</h1><p>' + E.lema + '. ' + (CARRITO ? 'Elegí, armá tu pedido y te llega armado por WhatsApp.' : 'Elegí tu prenda y consultanos talle y color por WhatsApp.') + '</p><div class="btns"><a class="btn" href="#/catalogo">Ver catálogo</a><a class="btn sec" href="#/catalogo?g=mujer">Mujer</a><a class="btn sec" href="#/catalogo?g=hombre">Hombre</a></div></div><div class="fotos"><img src="' + foto(fotosDe(prod('remera-oversize'))[0], 700) + '" alt=""><img src="' + foto(fotosDe(prod('campera-jean'))[0], 700) + '" alt=""></div></div></section>' +
      benef() +
      '<section class="s"><div class="in"><div class="cab"><h2>Categorías</h2><a href="#/catalogo">Ver todo →</a></div><div class="cats">' + D.tipos.map(function (t) { var p = prod(catImg[t]); return '<a class="cat" href="#/catalogo?t=' + encodeURIComponent(t) + '"><img src="' + foto(fotosDe(p)[0], 500) + '" alt="" loading="lazy"><span>' + t + '</span></a>'; }).join('') + '</div></div></section>' +
      (of.length ? '<section class="s alt"><div class="in"><div class="cab"><h2>Ofertas</h2><a href="#/catalogo?o=1">Ver ofertas →</a></div><div class="grid">' + of.map(card).join('') + '</div></div></section>' : '') +
      '<section class="s' + (of.length ? '' : ' alt') + '"><div class="in"><div class="cab"><h2>Lo más vendido</h2><a href="#/catalogo">Ver catálogo →</a></div><div class="grid">' + dest.slice(0, 8).map(card).join('') + '</div></div></section>' +
      '<section class="s alt"><div class="in"><div class="cab"><h2>@' + E.s + '</h2><a href="#" onclick="return false">Seguinos en Instagram →</a></div><div class="ig">' + ['top-corto', 'sweater', 'cargo', 'blazer', 'musculosa', 'tapado'].map(function (id) { return '<img src="' + foto(fotosDe(prod(id))[0], 400) + '" alt="" loading="lazy">'; }).join('') + '</div></div></section>';
  }
  var F = { g: '', t: [], talle: '', max: 0, txt: '', orden: 'rel', o: false };
  function vistaCatalogo(qp) {
    F.g = qp.get('g') || ''; F.t = qp.get('t') ? [qp.get('t')] : F.t.filter(function () { return !qp.get('g') && !qp.get('o'); }); F.o = qp.get('o') === '1';
    if (!qp.get('t') && (qp.get('g') || qp.get('o'))) F.t = [];
    var talles = ['XS', 'S', 'M', 'L', 'XL', '36', '38', '40', '42', '44'];
    var tit = F.o ? 'Ofertas' : F.g ? (F.g === 'mujer' ? 'Mujer' : 'Hombre') : (F.t.length === 1 ? F.t[0] : 'Catálogo');
    return '<div class="in"><div class="migas"><a href="#/">Inicio</a> / ' + tit + '</div></div><div class="in cat-l"><aside class="filtros" id="filtros">' +
      '<input class="buscar" id="f-txt" placeholder="Buscar prenda…" value="' + esc(F.txt) + '"' + (qp.get('buscar') ? ' autofocus' : '') + '>' +
      '<h4>Para</h4>' + [['', 'Todos'], ['mujer', 'Mujer'], ['hombre', 'Hombre'], ['unisex', 'Unisex']].map(function (g) { return '<label><input type="radio" name="f-g" value="' + g[0] + '"' + (F.g === g[0] ? ' checked' : '') + '> ' + g[1] + '</label>'; }).join('') +
      '<h4>Prenda</h4>' + D.tipos.map(function (t) { return '<label><input type="checkbox" name="f-t" value="' + t + '"' + (F.t.indexOf(t) >= 0 ? ' checked' : '') + '> ' + t + '</label>'; }).join('') +
      '<h4>Talle</h4><div class="tl">' + talles.map(function (t) { return '<button type="button" class="chip" data-talle="' + t + '" aria-pressed="' + (F.talle === t) + '">' + t + '</button>'; }).join('') + '</div>' +
      '<h4>Precio máximo</h4><select id="f-max" class="buscar"><option value="0">Sin límite</option>' + [25000, 50000, 75000, 100000].map(function (m) { return '<option value="' + m + '"' + (F.max === m ? ' selected' : '') + '>Hasta ' + pesos(m) + '</option>'; }).join('') + '</select>' +
      (PRO ? '<h4>Ofertas</h4><label><input type="checkbox" id="f-o"' + (F.o ? ' checked' : '') + '> Solo en oferta</label>' : '') +
      '<p><button type="button" class="btn sec w" id="f-limpiar" style="margin-top:20px">Limpiar filtros</button></p></aside><div><div class="barra"><div><h1 style="font-size:clamp(30px,4vw,44px);margin:0">' + tit + '</h1><span id="f-n" style="color:var(--su)"></span></div><div style="display:flex;gap:8px"><button type="button" class="btn sec filtros-b" id="f-ver">Filtros</button><select id="f-orden" aria-label="Ordenar"><option value="rel">Destacados</option><option value="men"' + (F.orden === 'men' ? ' selected' : '') + '>Menor precio</option><option value="may"' + (F.orden === 'may' ? ' selected' : '') + '>Mayor precio</option><option value="nom"' + (F.orden === 'nom' ? ' selected' : '') + '>A–Z</option></select></div></div><div class="grid" id="f-grid"></div></div></div>';
  }
  function filtrar() {
    var l = D.productos.filter(function (p) {
      if (F.g && p.genero !== F.g && !(F.g !== 'unisex' && p.genero === 'unisex')) return false;
      if (F.t.length && F.t.indexOf(p.tipo) < 0) return false;
      if (F.talle && !p.colores.some(function (c) { return c.talles.indexOf(F.talle) >= 0; })) return false;
      if (F.max && p.precio > F.max) return false;
      if (F.o && !p.ant) return false;
      if (F.txt && (p.nombre + ' ' + p.tipo + ' ' + p.descripcion).toLowerCase().indexOf(F.txt.toLowerCase()) < 0) return false;
      return true;
    });
    if (F.orden === 'men') l.sort(function (a, b) { return a.precio - b.precio; }); else if (F.orden === 'may') l.sort(function (a, b) { return b.precio - a.precio; }); else if (F.orden === 'nom') l.sort(function (a, b) { return a.nombre.localeCompare(b.nombre); }); else l.sort(function (a, b) { return (b.destacado ? 1 : 0) - (a.destacado ? 1 : 0); });
    $('f-grid').innerHTML = l.length ? l.map(card).join('') : '<p class="vacio">No encontramos prendas con esos filtros.</p>';
    $('f-n').textContent = l.length + (l.length === 1 ? ' producto' : ' productos');
  }
  var P = { ci: 0, ti: '', fi: 0, c: 1 };
  function vistaProducto(id) {
    var p = prod(id); if (!p) return '<div class="in txt"><h1>No encontramos esa prenda</h1><a class="btn" href="#/catalogo">Ver catálogo</a></div>';
    if (P.id !== id) P = { id: id, ci: 0, ti: '', fi: 0, c: 1 };
    var c = p.colores[P.ci], rel = D.productos.filter(function (x) { return x.tipo === p.tipo && x.id !== p.id; }).concat(D.productos.filter(function (x) { return x.destacado && x.id !== p.id && x.tipo !== p.tipo; })).slice(0, 4);
    var envSel = '<div class="envio-calc"><select id="p-env">' + ENVIOS.map(function (e) { return '<option value="' + e[0] + '">' + e[1] + ' · ' + (e[2] ? pesos(e[2]) : 'gratis') + '</option>'; }).join('') + '</select></div><small style="color:var(--su)">Envío gratis desde ' + pesos(GRATIS) + '.</small>';
    return '<div class="in"><div class="migas"><a href="#/">Inicio</a> / <a href="#/catalogo?t=' + encodeURIComponent(p.tipo) + '">' + p.tipo + '</a> / ' + esc(p.nombre) + '</div></div>' +
      '<div class="in pdp"><div class="gal"><div class="th" id="p-th">' + c.fotos.map(function (f, i) { return '<button type="button" data-fi="' + i + '" aria-pressed="' + (i === P.fi) + '" aria-label="Foto ' + (i + 1) + '"><img src="' + foto(f, 160) + '" alt=""></button>'; }).join('') + '</div><div class="main" id="p-main"><img src="' + foto(c.fotos[P.fi] || c.fotos[0], 1000) + '" alt="' + esc(p.nombre + ' ' + c.nombre) + '"></div></div>' +
      '<div><p class="eye">' + p.tipo + ' · ' + (p.genero === 'unisex' ? 'Unisex' : p.genero === 'mujer' ? 'Mujer' : 'Hombre') + '</p><h1>' + esc(p.nombre) + '</h1><div class="pr">' + pesos(p.precio) + (p.ant ? '<s>' + pesos(p.ant) + '</s>' : '') + '</div>' +
      (CARRITO ? '<div class="tr">' + pesos(p.precio * (1 - TRANSF / 100)) + ' pagando por transferencia</div>' : '') + (PRO ? '<div style="color:var(--su);font-size:15px">o 3 cuotas sin interés de ' + pesos(p.precio / 3) + '</div>' : '') +
      '<div class="lbl"><span>Color: <b style="color:var(--tx)">' + esc(c.nombre) + '</b></span></div><div class="colores" id="p-col">' + p.colores.map(function (x, i) { return '<button type="button" data-ci="' + i + '" aria-pressed="' + (i === P.ci) + '" aria-label="' + esc(x.nombre) + '" title="' + esc(x.nombre) + '" style="background:' + x.hex + '"></button>'; }).join('') + '</div>' +
      '<div class="lbl"><span>Talle</span><button type="button" id="p-guia">Guía de talles</button></div><div class="talles" id="p-tal">' + ['XS', 'S', 'M', 'L', 'XL', '36', '38', '40', '42', '44'].filter(function (t) { return p.colores.some(function (x) { return x.talles.indexOf(t) >= 0; }); }).map(function (t) { var ok = c.talles.indexOf(t) >= 0 && !p.agot; return '<button type="button" data-ti="' + t + '"' + (ok ? '' : ' disabled') + ' aria-pressed="' + (P.ti === t) + '">' + t + '</button>'; }).join('') + '</div>' +
      (p.agot ? '<p class="msg">Esta prenda está agotada por ahora.</p><a class="btn sec w" style="margin-top:14px" target="_blank" rel="noopener" href="' + wa('Hola ' + E.n + '! Avisame cuando vuelva a entrar: ' + p.nombre) + '">Avisame cuando vuelva</a>' :
        CARRITO ? '<div class="comprar"><div class="cant"><button type="button" data-cc="-1" aria-label="Uno menos">−</button><b id="p-c">' + P.c + '</b><button type="button" data-cc="1" aria-label="Uno más">+</button></div><button type="button" class="btn" id="p-add">Agregar al carrito</button></div><p class="msg" id="p-msg"></p>' :
        '<a class="btn w" style="margin-top:22px" id="p-cons" target="_blank" rel="noopener" href="#">Consultar por WhatsApp</a><p class="msg" id="p-msg"></p>') +
      '<details open><summary>Descripción</summary><p style="color:var(--su)">' + esc(p.descripcion) + '</p></details>' +
      '<details><summary>Envíos</summary>' + (CARRITO ? envSel : '<p style="color:var(--su)">Retiro en el local o envío a todo el país. Te pasamos el costo por WhatsApp.</p>') + '</details>' +
      '<details><summary>Cambios y devoluciones</summary><p style="color:var(--su)">Tenés 30 días para cambiarla, con etiqueta y ticket.' + (CARRITO ? ' Si compraste online, podés arrepentirte dentro de los 10 días con el <a href="#/arrepentimiento">botón de arrepentimiento</a>.' : '') + '</p></details></div></div>' +
      '<section class="s alt"><div class="in"><div class="cab"><h2>También te puede gustar</h2></div><div class="grid">' + rel.map(card).join('') + '</div></div></section>';
  }
  function actualizarConsulta(p) { var a = $('p-cons'); if (!a) return; var c = p.colores[P.ci]; a.href = wa('Hola ' + E.n + '! Quiero consultar por: ' + p.nombre + ' · color ' + c.nombre + (P.ti ? ' · talle ' + P.ti : '') + '. ¿Hay disponible?'); }
  var TALLES = '<table class="tabla-t"><tr><th>Talle</th><th>Pecho (cm)</th><th>Cintura (cm)</th><th>Largo (cm)</th></tr><tr><td>XS</td><td>86–90</td><td>68–72</td><td>66</td></tr><tr><td>S</td><td>90–96</td><td>72–78</td><td>68</td></tr><tr><td>M</td><td>96–102</td><td>78–84</td><td>70</td></tr><tr><td>L</td><td>102–108</td><td>84–90</td><td>72</td></tr><tr><td>XL</td><td>108–116</td><td>90–98</td><td>74</td></tr></table><p style="color:var(--su);font-size:14px">Pantalones: talle 36 a 44 según cintura (36 = 70 cm, cada talle suma 4 cm). Medidas de ejemplo.</p>';
  function dialogo(html) { $('dlg-c').innerHTML = '<button class="x" type="button" aria-label="Cerrar">×</button>' + html; $('dlg').showModal(); }
  $('dlg').addEventListener('click', function (e) { if (e.target === this || e.target.closest('.x')) this.close(); });

  /* ---------- Carrito ---------- */
  var drawer = document.createElement('div'); drawer.className = 'drawer'; drawer.setAttribute('aria-label', 'Carrito'); var velo = document.createElement('div'); velo.className = 'velo';
  document.body.appendChild(velo); document.body.appendChild(drawer);
  function cerrarTodo() { drawer.classList.remove('on'); velo.classList.remove('on'); navm.classList.remove('on'); }
  velo.onclick = cerrarTodo;
  function lineas(editable) { return car.map(function (x, i) { var p = prod(x.id); return '<div class="ci"><img src="' + foto(x.f, 200) + '" alt=""><div><b>' + esc(p.nombre) + '</b><small>' + esc(x.color) + ' · talle ' + esc(x.talle) + '</small><small>' + pesos(x.p) + (editable ? '' : ' × ' + x.c) + '</small>' + (editable ? '<div class="cant" style="margin-top:6px"><button type="button" data-q="' + i + '" data-d="-1" aria-label="Uno menos">−</button><b>' + x.c + '</b><button type="button" data-q="' + i + '" data-d="1" aria-label="Uno más">+</button></div>' : '') + '</div><div style="text-align:right"><b>' + pesos(x.p * x.c) + '</b>' + (editable ? '<br><button type="button" class="x" data-del="' + i + '">Quitar</button>' : '') + '</div></div>'; }).join(''); }
  function faltaGratis() { var f = GRATIS - subtotal(); return f > 0 ? '<p style="font-size:14px;margin:12px 0 0">Te faltan <b>' + pesos(f) + '</b> para el envío gratis</p><div class="barra-envio"><i style="width:' + Math.min(100, subtotal() / GRATIS * 100) + '%"></i></div>' : '<p style="font-size:14px;margin:12px 0 0;color:#1e9a52"><b>✓ Tenés envío gratis</b></p>'; }
  function abrirCarrito() {
    drawer.innerHTML = '<div class="hd"><b>Tu carrito (' + nCar() + ')</b><button class="icb" type="button" data-cerrar aria-label="Cerrar">×</button></div><div class="bd">' + (car.length ? faltaGratis() + lineas(true) : '<p class="vacio">Tu carrito está vacío.</p>') + '</div>' +
      (car.length ? '<div class="ft"><div style="display:flex;justify-content:space-between;font-weight:700;font-size:18px;margin-bottom:12px"><span>Subtotal</span><span>' + pesos(subtotal()) + '</span></div><a class="btn w" href="#/carrito" data-cerrar>Finalizar compra</a><button class="btn sec w" type="button" data-cerrar style="margin-top:8px">Seguir comprando</button></div>' : '<div class="ft"><a class="btn w" href="#/catalogo" data-cerrar>Ver catálogo</a></div>');
    drawer.classList.add('on'); velo.classList.add('on');
  }
  drawer.addEventListener('click', function (e) {
    var b = e.target.closest('[data-q],[data-del],[data-cerrar]'); if (!b) return;
    if (b.dataset.cerrar !== undefined) { cerrarTodo(); return; }
    if (b.dataset.del) car.splice(+b.dataset.del, 1); else { var x = car[+b.dataset.q]; x.c = Math.max(1, Math.min(10, x.c + +b.dataset.d)); }
    guardar(); abrirCarrito();
  });
  var CK = { env: 'retiro', pago: 'transferencia', nom: '', cel: '', dir: '', loc: '', nota: '' };
  function vistaCarrito(msg) {
    if (!car.length) return '<div class="in txt"><h1>Tu carrito está vacío</h1><p>Agregá prendas desde el catálogo.</p><a class="btn" href="#/catalogo">Ver catálogo</a></div>';
    var st = subtotal(), env = ENVIOS.filter(function (e) { return e[0] === CK.env; })[0], ce = env[2] && st < GRATIS ? env[2] : 0, desc = CK.pago === 'transferencia' ? Math.round(st * TRANSF / 100) : 0, tot = st - desc + ce;
    return '<div class="in"><div class="migas"><a href="#/">Inicio</a> / Carrito</div></div><div class="in cart-l"><div><h1 style="font-size:clamp(30px,4vw,44px)">Finalizar compra</h1>' + lineas(true) +
      '<form class="form" id="ck" autocomplete="on"><h2 style="font-size:26px;margin-top:30px">1. Entrega</h2><div class="op">' + ENVIOS.map(function (e) { return '<label><span><input type="radio" name="env" value="' + e[0] + '"' + (CK.env === e[0] ? ' checked' : '') + '> ' + e[1] + '</span><b>' + (!e[2] ? 'Gratis' : st >= GRATIS ? '<s style="font-weight:400;color:var(--su)">' + pesos(e[2]) + '</s> Gratis' : pesos(e[2])) + '</b></label>'; }).join('') + '</div>' +
      (CK.env !== 'retiro' ? '<label for="ck-dir">Dirección</label><input id="ck-dir" name="dir" autocomplete="street-address" value="' + esc(CK.dir) + '" placeholder="Calle, número, piso"><label for="ck-loc">Localidad y código postal</label><input id="ck-loc" name="loc" value="' + esc(CK.loc) + '" placeholder="Ej.: Tigre, 1648">' : '') +
      '<h2 style="font-size:26px;margin-top:30px">2. Pago</h2><div class="op"><label><span><input type="radio" name="pago" value="transferencia"' + (CK.pago === 'transferencia' ? ' checked' : '') + '> Transferencia o alias</span><b>' + TRANSF + '% off</b></label><label><span><input type="radio" name="pago" value="efectivo"' + (CK.pago === 'efectivo' ? ' checked' : '') + '> Efectivo al retirar o recibir</span><b></b></label>' + (PRO ? '<label><span><input type="radio" name="pago" value="link"' + (CK.pago === 'link' ? ' checked' : '') + '> Tarjeta en 3 cuotas sin interés (te mandamos el link de pago)</span><b></b></label>' : '') + '</div>' +
      '<h2 style="font-size:26px;margin-top:30px">3. Tus datos</h2><label for="ck-nom">Nombre y apellido</label><input id="ck-nom" name="nom" autocomplete="name" value="' + esc(CK.nom) + '"><label for="ck-cel">Celular</label><input id="ck-cel" name="cel" type="tel" inputmode="tel" autocomplete="tel" value="' + esc(CK.cel) + '" placeholder="Ej.: 1155554444"><label for="ck-nota">Nota (opcional)</label><textarea id="ck-nota" name="nota" rows="2" maxlength="140">' + esc(CK.nota) + '</textarea></form></div>' +
      '<aside><div class="resumen"><h2 style="font-size:24px">Resumen</h2><div class="f"><span>Subtotal (' + nCar() + ')</span><span>' + pesos(st) + '</span></div>' + (desc ? '<div class="f" style="color:#1e9a52"><span>Descuento transferencia</span><span>−' + pesos(desc) + '</span></div>' : '') + '<div class="f"><span>Envío</span><span>' + (ce ? pesos(ce) : 'Gratis') + '</span></div><div class="f tot"><span>Total</span><span>' + pesos(tot) + '</span></div>' + (PRO && CK.pago === 'link' ? '<p style="font-size:14px;color:var(--su)">3 cuotas de ' + pesos(tot / 3) + '</p>' : '') + faltaGratis() +
      '<button type="button" class="btn w" id="ck-ok" style="margin-top:16px">Enviar pedido por WhatsApp</button><p class="err" id="ck-err" role="status">' + (msg || '') + '</p><p style="font-size:13px;color:var(--su)">Se abre WhatsApp con tu pedido armado. Ahí te confirmamos stock y te pasamos los datos para pagar.</p></div></aside></div>';
  }
  function leerCK() { var f = $('ck'); if (!f) return; ['nom', 'cel', 'dir', 'loc', 'nota'].forEach(function (k) { if (f[k]) CK[k] = f[k].value; }); var e = f.querySelector('[name=env]:checked'), p = f.querySelector('[name=pago]:checked'); if (e) CK.env = e.value; if (p) CK.pago = p.value; }
  function enviarPedido() {
    leerCK(); var cel = Reservas.normCel(CK.cel);
    if (CK.nom.trim().length < 3) return render(vistaCarrito('Escribí tu nombre y apellido.'));
    if (!Reservas.celOk(cel)) return render(vistaCarrito('Escribí tu celular con código de área, sin 0 ni 15.'));
    if (CK.env !== 'retiro' && CK.dir.trim().length < 5) return render(vistaCarrito('Escribí la dirección de entrega.'));
    var st = subtotal(), env = ENVIOS.filter(function (e) { return e[0] === CK.env; })[0], ce = env[2] && st < GRATIS ? env[2] : 0, desc = CK.pago === 'transferencia' ? Math.round(st * TRANSF / 100) : 0, tot = st - desc + ce;
    var cod = E.s.slice(0, 2).toUpperCase() + '-' + String(Date.now()).slice(-5);
    var t = '*Pedido ' + cod + '* · ' + E.n + '\n' + car.map(function (x) { return '• ' + x.c + ' × ' + prod(x.id).nombre + ' (' + x.color + ', talle ' + x.talle + ') — ' + pesos(x.p * x.c); }).join('\n') +
      '\n\nSubtotal: ' + pesos(st) + (desc ? '\nDescuento transferencia: −' + pesos(desc) : '') + '\nEnvío (' + env[1] + '): ' + (ce ? pesos(ce) : 'gratis') + '\n*Total: ' + pesos(tot) + '*' +
      '\n\n💳 Pago: ' + ({ transferencia: 'Transferencia', efectivo: 'Efectivo', link: 'Tarjeta en 3 cuotas (link de pago)' })[CK.pago] + '\n' + (CK.env === 'retiro' ? '🏠 Retiro en el local' : '📦 ' + env[1] + ': ' + CK.dir.trim() + (CK.loc ? ', ' + CK.loc.trim() : '')) + '\n👤 ' + CK.nom.trim() + ' · ' + cel + (CK.nota.trim() ? '\n📝 ' + CK.nota.trim() : '');
    window.open(wa(t), '_blank');
    Reservas.iniciar({ sitio: E.s, col: 'encargos', clave: 'spa_p_' + E.s });
    Reservas.guardar({ id: Date.now(), nombre: CK.nom.trim().slice(0, 60), cel: cel, ret: (CK.env === 'retiro' ? 'Retiro en el local' : 'Envío · ' + env[1]).slice(0, 60), total: tot, items: car.map(function (x) { return { n: (prod(x.id).nombre + ' (' + x.color + ', ' + x.talle + ')').slice(0, 80), c: x.c, p: x.p }; }), estado: 'nuevo', creado: Date.now() }).catch(function () {});
    try { var mp = JSON.parse(localStorage.getItem(K + '_pedidos')) || []; mp.unshift({ cod: cod, t: Date.now(), tot: tot, n: nCar(), env: env[1] }); localStorage.setItem(K + '_pedidos', JSON.stringify(mp.slice(0, 10))); } catch (e) {}
    car = []; guardar();
    render('<div class="in txt"><p class="eye">Pedido ' + cod + '</p><h1>¡Gracias, ' + esc(CK.nom.trim().split(' ')[0]) + '!</h1><p>Se abrió WhatsApp con tu pedido. <b>Tocá enviar</b> para que nos llegue y te confirmamos stock y forma de pago.</p>' + (PRO ? '<p>Podés seguir tu pedido en <a href="#/mi-pedido">Seguí tu pedido</a> con el código <b>' + cod + '</b>.</p>' : '') + '<p><a class="btn" href="' + wa(t) + '" target="_blank" rel="noopener">Abrir WhatsApp de nuevo</a> <a class="btn sec" href="#/catalogo">Seguir comprando</a></p></div>');
  }

  /* ---------- Páginas de texto ---------- */
  function vistaComo() {
    return '<div class="in txt"><div class="migas" style="padding-top:0"><a href="#/">Inicio</a> / Cómo comprar</div><h1 style="font-size:clamp(34px,5vw,54px)">Cómo comprar</h1>' +
      (CARRITO ? '<ol><li>Elegí tus prendas, color y talle, y agregalas al carrito.</li><li>Elegí cómo te llega y cómo pagás.</li><li>Se abre WhatsApp con el pedido armado: lo enviás y te confirmamos stock.</li><li>Pagás y te lo mandamos o lo retirás.</li></ol>' : '<ol><li>Elegí la prenda y tocá "Consultar por WhatsApp".</li><li>Te confirmamos talle, color y stock.</li><li>Pagás por transferencia o en efectivo.</li><li>Retirás en el local o te lo enviamos.</li></ol>') +
      '<h2>Envíos</h2><table class="tabla-t"><tr><th>Opción</th><th>Costo</th><th>Demora</th></tr>' + ENVIOS.map(function (e) { return '<tr><td>' + e[1] + '</td><td>' + (e[2] ? pesos(e[2]) : 'Gratis') + '</td><td>' + ({ retiro: 'En el día', norte: '24 a 48 h', caba: '24 a 48 h', correo: '3 a 7 días hábiles' })[e[0]] + '</td></tr>'; }).join('') + '</table><p>Envío gratis en compras desde ' + pesos(GRATIS) + '.</p>' +
      '<h2>Formas de pago</h2><p>Transferencia o alias' + (CARRITO ? ' (' + TRANSF + '% off)' : '') + ', efectivo' + (PRO ? ' y tarjeta en 3 cuotas sin interés con link de pago' : '') + '.</p>' +
      '<h2>Cambios</h2><p>Tenés 30 días para cambiar tu prenda, sin uso, con etiqueta y ticket.' + (CARRITO ? ' Si compraste online, podés arrepentirte dentro de los 10 días corridos desde que la recibiste, con el <a href="#/arrepentimiento">botón de arrepentimiento</a>.' : '') + '</p>' +
      '<h2>Preguntas frecuentes</h2><div class="faq"><details><summary>¿Cómo sé mi talle?</summary><p>Mirá la <a href="#/talles">guía de talles</a>. Si dudás entre dos, escribinos y te asesoramos.</p></details><details><summary>¿Tienen local?</summary><p>Sí, en ' + E.zona.split(' · ')[0] + '. Podés probarte las prendas antes de llevarlas.</p></details><details><summary>¿Hacen factura?</summary><p>Sí, A o B.</p></details></div></div>';
  }
  function vistaContacto() { return '<div class="in"><div class="migas"><a href="#/">Inicio</a> / Contacto</div></div><div class="in dos"><div><h1 style="font-size:clamp(34px,5vw,54px)">Contacto</h1><p style="color:var(--su)">' + E.zona + '<br>Lunes a sábados de 10 a 19 h</p><p><a class="btn" href="' + wa('Hola ' + E.n + '! ') + '" target="_blank" rel="noopener">Escribinos por WhatsApp</a></p><p style="color:var(--su)">Instagram: @' + E.s + '</p></div><iframe class="mapa" loading="lazy" title="Mapa" src="https://www.google.com/maps?q=Tigre,+Buenos+Aires&output=embed"></iframe></div>'; }
  function vistaFavs() { var l = D.productos.filter(function (p) { return favs.indexOf(p.id) >= 0; }); return '<div class="in"><div class="migas"><a href="#/">Inicio</a> / Favoritos</div></div><div class="in" style="padding-block:20px 64px"><h1 style="font-size:clamp(30px,4vw,44px)">Tus favoritos</h1>' + (l.length ? '<div class="grid">' + l.map(card).join('') + '</div>' : '<p class="vacio">Tocá el ♡ de una prenda para guardarla acá.</p><p style="text-align:center"><a class="btn" href="#/catalogo">Ver catálogo</a></p>') + '</div>'; }
  function vistaArrep(ok) {
    if (ok) return '<div class="in txt"><h1>Recibimos tu solicitud</h1><p>Tu código es <b>' + ok + '</b>. Te escribimos dentro de las 24 h hábiles para coordinar la devolución. Guardá este código.</p><a class="btn" href="#/">Volver al inicio</a></div>';
    return '<div class="in txt"><h1 style="font-size:clamp(32px,4.4vw,48px)">Botón de arrepentimiento</h1><p>Si compraste online, podés cancelar la compra dentro de los 10 días corridos desde que recibiste el producto, sin costo ni explicación (Resolución 424/2020).</p><form class="form" id="arr"><label for="a-nom">Nombre y apellido</label><input id="a-nom" required><label for="a-cel">Celular</label><input id="a-cel" type="tel" inputmode="tel" required><label for="a-ped">Número de pedido (si lo tenés)</label><input id="a-ped" placeholder="Ej.: CA-12345"><label for="a-mot">Comentario (opcional)</label><textarea id="a-mot" rows="3"></textarea><p class="err" id="a-err"></p><button class="btn" type="submit">Enviar solicitud</button></form></div>';
  }
  function vistaPedido() {
    var mp = []; try { mp = JSON.parse(localStorage.getItem(K + '_pedidos')) || []; } catch (e) {}
    var paso = function (t) { var h = (Date.now() - t) / 36e5; return h < .05 ? 0 : h < 2 ? 1 : 2; };
    return '<div class="in txt"><h1 style="font-size:clamp(32px,4.4vw,48px)">Seguí tu pedido</h1><p>Poné el código que te dimos al comprar.</p><form class="form" id="seg" style="display:flex;gap:8px;align-items:end"><input id="s-cod" placeholder="Ej.: CA-12345" style="flex:1"><button class="btn" type="submit">Buscar</button></form><div id="s-res" style="margin-top:20px"></div>' +
      (mp.length ? '<h2>Tus pedidos en este celular</h2>' + mp.map(function (x) { var st = paso(x.t); return '<div class="ci" style="grid-template-columns:1fr auto"><div><b>' + x.cod + '</b><small>' + new Date(x.t).toLocaleDateString('es-AR') + ' · ' + x.n + ' prendas · ' + x.env + '</small><small>' + ['📩 Recibido', '✅ Confirmado y pagado', '📦 En camino'][st] + '</small></div><b>' + pesos(x.tot) + '</b></div>'; }).join('') : '<p style="color:var(--su)">En esta muestra, el estado avanza solo con el tiempo. En la tienda real lo cambia el dueño desde su panel.</p>') + '</div>';
  }

  /* ---------- Router ---------- */
  var app = $('app'), navm = document.createElement('nav'); navm.className = 'nav-m'; document.body.appendChild(navm);
  navm.innerHTML = '<b style="font-family:var(--disp);font-size:24px">' + E.n + '</b>' + NAV.map(function (n) { return '<a href="' + n[0] + '">' + n[1] + '</a>'; }).join('') + (PRO ? '<a href="#/favoritos">Favoritos</a><a href="#/mi-pedido">Seguí tu pedido</a>' : '');
  navm.addEventListener('click', function (e) { if (e.target.closest('a')) cerrarTodo(); });
  $('ham').onclick = function () { navm.classList.add('on'); velo.classList.add('on'); };
  function render(h) { app.innerHTML = h; }
  function ruta() {
    cerrarTodo();
    if (!PAGINAS) { if (!app.dataset.ok) { render(vistaEsencial()); app.dataset.ok = 1; } return; }
    var h = location.hash.replace(/^#/, '') || '/', path = h.split('?')[0], qp = new URLSearchParams(h.split('?')[1] || '');
    var m;
    if (path === '/' || path === '') render(vistaInicio());
    else if (path === '/catalogo') { render(vistaCatalogo(qp)); filtrar(); }
    else if ((m = path.match(/^\/p\/(.+)$/))) { render(vistaProducto(m[1])); actualizarConsulta(prod(m[1]) || {}); }
    else if (path === '/carrito' && CARRITO) render(vistaCarrito());
    else if (path === '/como-comprar') render(vistaComo());
    else if (path === '/talles') render('<div class="in txt"><h1 style="font-size:clamp(32px,4.4vw,48px)">Guía de talles</h1>' + TALLES + '</div>');
    else if (path === '/contacto') render(vistaContacto());
    else if (path === '/favoritos' && PRO) render(vistaFavs());
    else if (path === '/arrepentimiento' && CARRITO) render(vistaArrep());
    else if (path === '/mi-pedido' && PRO) render(vistaPedido());
    else render(vistaInicio());
    [].forEach.call(document.querySelectorAll('.menu a'), function (a) { a.toggleAttribute('aria-current', a.getAttribute('href') === '#' + h); });
    if (!/^\/catalogo/.test(path) || !qp.get('buscar')) window.scrollTo(0, 0);
  }
  addEventListener('hashchange', ruta);

  /* ---------- Eventos ---------- */
  app.addEventListener('click', function (e) {
    var t = e.target, b;
    if ((b = t.closest('[data-fav]'))) { e.preventDefault(); var i = favs.indexOf(b.dataset.fav); if (i >= 0) favs.splice(i, 1); else { favs.push(b.dataset.fav); toast('Guardado en favoritos'); } guardar(); b.setAttribute('aria-pressed', i < 0); b.textContent = i < 0 ? '♥' : '♡'; return; }
    if ((b = t.closest('[data-talle]'))) { F.talle = F.talle === b.dataset.talle ? '' : b.dataset.talle; [].forEach.call(document.querySelectorAll('[data-talle]'), function (x) { x.setAttribute('aria-pressed', x.dataset.talle === F.talle); }); filtrar(); return; }
    if (t.id === 'f-limpiar') { F = { g: '', t: [], talle: '', max: 0, txt: '', orden: 'rel', o: false }; location.hash = '#/catalogo'; ruta(); return; }
    if (t.id === 'f-ver') { $('filtros').classList.toggle('on'); return; }
    var id = (location.hash.match(/#\/p\/([^?]+)/) || [])[1], p = id && prod(id);
    if (p) {
      if ((b = t.closest('[data-ci]'))) { P.ci = +b.dataset.ci; P.fi = 0; if (p.colores[P.ci].talles.indexOf(P.ti) < 0) P.ti = ''; var y = scrollY; render(vistaProducto(id)); actualizarConsulta(p); scrollTo(0, y); return; }
      if ((b = t.closest('[data-fi]'))) { P.fi = +b.dataset.fi; $('p-main').innerHTML = '<img src="' + foto(p.colores[P.ci].fotos[P.fi], 1000) + '" alt="">'; [].forEach.call(document.querySelectorAll('[data-fi]'), function (x) { x.setAttribute('aria-pressed', +x.dataset.fi === P.fi); }); return; }
      if ((b = t.closest('[data-ti]'))) { P.ti = b.dataset.ti; [].forEach.call(document.querySelectorAll('[data-ti]'), function (x) { x.setAttribute('aria-pressed', x.dataset.ti === P.ti); }); var m = $('p-msg'); if (m) m.textContent = ''; actualizarConsulta(p); return; }
      if ((b = t.closest('[data-cc]'))) { P.c = Math.max(1, Math.min(10, P.c + +b.dataset.cc)); $('p-c').textContent = P.c; return; }
      if (t.id === 'p-guia') { dialogo('<h2>Guía de talles</h2>' + TALLES); return; }
      if (t.closest('#p-main')) { dialogo('<img src="' + foto(p.colores[P.ci].fotos[P.fi], 1400) + '" alt="" style="width:100%;border-radius:var(--r)">'); return; }
      if (t.id === 'p-cons' && !P.ti) { e.preventDefault(); $('p-msg').textContent = 'Elegí un talle para consultar.'; return; }
      if (t.id === 'p-add') {
        if (!P.ti) { $('p-msg').textContent = 'Elegí un talle.'; return; }
        var c = p.colores[P.ci], k = p.id + '|' + c.nombre + '|' + P.ti, it = car.filter(function (x) { return x.k === k; })[0];
        if (it) it.c = Math.min(10, it.c + P.c); else car.push({ k: k, id: p.id, color: c.nombre, talle: P.ti, f: c.fotos[0], p: p.precio, c: P.c });
        guardar(); abrirCarrito(); return;
      }
    }
    if (t.id === 'ck-ok') { enviarPedido(); return; }
    if ((b = t.closest('.ci [data-q], .ci [data-del]')) && /carrito/.test(location.hash)) { leerCK(); if (b.dataset.del) car.splice(+b.dataset.del, 1); else { var x = car[+b.dataset.q]; x.c = Math.max(1, Math.min(10, x.c + +b.dataset.d)); } guardar(); render(vistaCarrito()); }
  });
  app.addEventListener('change', function (e) {
    var t = e.target;
    if (t.name === 'f-g') { F.g = t.value; filtrar(); }
    else if (t.name === 'f-t') { F.t = [].map.call(document.querySelectorAll('[name=f-t]:checked'), function (x) { return x.value; }); filtrar(); }
    else if (t.id === 'f-max') { F.max = +t.value; filtrar(); }
    else if (t.id === 'f-orden') { F.orden = t.value; filtrar(); }
    else if (t.id === 'f-o') { F.o = t.checked; filtrar(); }
    else if (t.name === 'env' || t.name === 'pago') { leerCK(); render(vistaCarrito()); }
  });
  app.addEventListener('input', function (e) { if (e.target.id === 'f-txt') { F.txt = e.target.value; filtrar(); } });
  app.addEventListener('submit', function (e) {
    e.preventDefault();
    if (e.target.id === 'arr') { var n = $('a-nom').value.trim(), c = Reservas.normCel($('a-cel').value); if (n.length < 3 || !Reservas.celOk(c)) { $('a-err').textContent = 'Completá nombre y celular.'; return; } render(vistaArrep('ARR-' + Math.random().toString(36).slice(2, 8).toUpperCase())); }
    if (e.target.id === 'seg') { var cod = $('s-cod').value.trim().toUpperCase(), mp = []; try { mp = JSON.parse(localStorage.getItem(K + '_pedidos')) || []; } catch (er) {} var x = mp.filter(function (y) { return y.cod === cod; })[0]; $('s-res').innerHTML = x ? '<div class="resumen" style="position:static"><b>' + x.cod + '</b> · ' + pesos(x.tot) + '<p>📩 Recibido → ✅ Confirmado → 📦 En camino → 🏠 Entregado</p></div>' : '<p class="err">No encontramos ese código. Revisalo o escribinos por WhatsApp.</p>'; }
  });

  /* ---------- Qué incluye cada plan ---------- */
  var FILAS = [['Página de inicio con tus productos', 1, 1, 1, 1], ['Botón de WhatsApp y ubicación', 1, 1, 1, 1], ['Tienda con varias páginas (catálogo, producto, cómo comprar, contacto)', 0, 1, 1, 1], ['Catálogo con filtros y buscador', 0, 1, 1, 1], ['Ficha de producto: la foto cambia con el color, talles disponibles, guía de talles', 0, 1, 1, 1], ['Carrito, envío por zona y pedido armado por WhatsApp', 0, 0, 1, 1], ['Descuento por transferencia y envío gratis desde un monto', 0, 0, 1, 1], ['Botón de arrepentimiento (obligatorio para vender online)', 0, 0, 1, 1], ['Panel con los pedidos y estadísticas', 0, 0, 1, 1], ['Cargás y editás productos, precios, fotos y "agotado" vos mismo', 0, 0, 0, 1], ['Ofertas, "nuevo" y "últimas unidades"', 0, 0, 0, 1], ['Favoritos, seguimiento del pedido y cuotas', 0, 0, 0, 1], ['Resumen del mes: lo más vendido y cuánto vendiste', 0, 0, 0, 1]];
  var col = { 1: 1, 2: 2, 3: 3, 5: 4 };
  $('plan-pill').innerHTML = 'Plan ' + plan + ' · <b>' + PN[plan] + '</b> · ver qué incluye';
  $('plan-pill').onclick = function () {
    dialogo('<h2>Qué incluye cada plan</h2><p style="color:var(--su);margin:0">Estás viendo el <b>Plan ' + plan + ' · ' + PN[plan] + '</b>. Tocá otro plan para ver cómo cambia la tienda.</p><table class="cmp"><tr><th></th>' + PL.map(function (n) { return '<th class="' + (n === plan ? 'on' : '') + '"><a href="' + link('plan', n) + '">' + n + '<br>' + PN[n] + '</a></th>'; }).join('') + '</tr>' + FILAS.map(function (f) { return '<tr><td>' + f[0] + '</td>' + PL.map(function (n) { var v = f[col[n]]; return '<td class="' + (n === plan ? 'on ' : '') + (v ? 'si' : 'no') + '">' + (v ? '✓' : '—') + '</td>'; }).join('') + '</tr>'; }).join('') + '</table>' +
      (plan >= 3 ? '<p style="margin-top:16px"><a class="btn" href="../mi-negocio/?s=' + E.s + '&muestra=1&plan=' + plan + '" target="_blank" rel="noopener">Ver el panel del dueño</a></p>' : ''));
  };
  ruta();
})();
