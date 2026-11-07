/* Más rubros con carta o catálogo sobre la misma muestra (?rubro=panaderia|rotiseria|ferreteria|petshop|ropa|gimnasio).
   Los 3 estilos usan los temas de gastronomía (parrilla = cálido, cafe = claro, urbano = oscuro); cada estilo es un negocio ficticio.
   planes: qué planes tiene el rubro y cómo se llaman. p4: 'reservas' (mesa o clase) | 'programado' (encargo con día y hora). */
(function () {
  function mk(b, v) { var o = {}; Object.keys(b).forEach(function (k) { o[k] = b[k]; }); Object.keys(v).forEach(function (k) { o[k] = v[k]; }); return o; }
  var H6 = function (a, b) { var o = {}; [1, 2, 3, 4, 5, 6].forEach(function (d) { o[d] = [[a, b]]; }); return o; };
  var R = {};

  /* ---------- Panadería y pastelería ---------- */
  var pan = { hor: (function () { var o = H6(7, 20); o[0] = [[8, 13]]; return o; })(),
    gal: ['1509440159596-0249088772ff', '1555507036-ab1f4038808a', '1486427944299-d1955d23e34d', '1509042239860-f550ce710b93'],
    eventos: { tit: 'Tortas y mesas dulces', txt: 'Cumpleaños, bautismos y eventos: tortas a pedido, mesa dulce y catering de salados. Encargá con 72 h.', fotos: ['1486427944299-d1955d23e34d', '1555507036-ab1f4038808a'] },
    zonas: [['San Fernando', 1500], ['Victoria', 1800], ['Tigre', 2200], ['Otra zona', null]], minimo: 8000, gratis: 30000, promo: 'Martes: docena de facturas + 1/4 de pan $9.000',
    faq: [['¿Hacen tortas a pedido?', 'Sí, con 72 h de anticipación. Elegí sabor y tamaño en la web o por WhatsApp.'], ['¿Tienen productos sin TACC?', 'Budines y alfajores sin TACC envasados.'], ['¿A qué hora sale el pan?', 'A las 7 y a las 17, todos los días.']],
    carta: [
      { cat: 'Panadería', items: [{ n: 'Pan francés', d: 'Por kilo', p: 3800, f: '1509440159596-0249088772ff', op: [{ t: 'Cantidad', o: [['1/4 kg', 0], ['1/2 kg', 1900], ['1 kg', 5700]] }] }, { n: 'Pan de masa madre', d: 'Hogaza de 800 g', p: 6500 }, { n: 'Chipá', d: 'Por 1/4 kg', p: 4500 }] },
      { cat: 'Facturas', items: [{ n: 'Medialunas de manteca', d: 'Por docena', p: 9000, f: '1555507036-ab1f4038808a', op: [{ t: 'Cantidad', o: [['Media docena', 0], ['Docena', 4500]] }] }, { n: 'Facturas surtidas', d: 'Por docena', p: 9500 }, { n: 'Cañoncitos de dulce de leche', d: 'Por unidad', p: 1200 }] },
      { cat: 'Pastelería', items: [{ n: 'Torta selva negra', d: 'Para 12 porciones', p: 32000, f: '1486427944299-d1955d23e34d', op: [{ t: 'Tamaño', o: [['12 porciones', 0], ['20 porciones', 18000]] }] }, { n: 'Lemon pie', d: 'Para 8 porciones', p: 22000 }, { n: 'Pastafrola', d: 'De membrillo o batata', p: 12000, op: [{ t: 'Gusto', o: [['Membrillo', 0], ['Batata', 0]] }] }] },
      { cat: 'Salados', items: [{ n: 'Sándwiches de miga', d: 'Por docena, surtidos', p: 14000 }, { n: 'Empanadas', d: 'Por docena', p: 18000, op: [{ t: 'Gusto', o: [['Carne', 0], ['Jamón y queso', 0], ['Pollo', 0], ['Surtidas', 0]] }] }] }] };
  R.panaderia = { nombre: 'Panaderías y pastelerías', palabra: { carta: 'Productos', pedir: 'Hacé tu pedido', ver: 'Ver productos' }, apps: true, p4: 'programado',
    planes: { 3: 'Pedidos', 4: 'Encargos', 5: 'Autogestionable' }, est: [['parrilla', 'Artesanal'], ['cafe', 'Clásica'], ['urbano', 'Moderna']],
    E: { parrilla: mk(pan, { sitio: 'horno', nombre: 'El Horno de Victoria', titulo: 'El Horno de Victoria', zona: 'Panadería artesanal · Victoria', tit: 'Pan de verdad, todos los días.', sub: 'Masa madre, facturas de manteca y tortas a pedido.', dir: 'Av. Pres. Perón 2400, Victoria', hero: '1509440159596-0249088772ff' }),
      cafe: mk(pan, { sitio: 'lamodelo', nombre: 'Confitería La Modelo', titulo: 'Confitería La Modelo', zona: 'Panadería y confitería · San Fernando', tit: 'La confitería del barrio desde 1962.', sub: 'Facturas, tortas y sándwiches de miga para cada ocasión.', dir: 'Constitución 700, San Fernando', hero: '1555507036-ab1f4038808a' }),
      urbano: mk(pan, { sitio: 'migamiga', nombre: 'Miga Bakery', titulo: 'Miga · Bakery', zona: 'Bakery · Tigre', tit: 'Bakery de especialidad.', sub: 'Croissants, masa madre y café para llevar.', dir: 'Av. Cazón 1100, Tigre', hero: '1486427944299-d1955d23e34d' }) } };

  /* ---------- Rotisería y comidas para llevar ---------- */
  var rot = { hor: (function () { var o = H6(11, 23); o[0] = [[11, 15]]; return o; })(),
    gal: ['1778855400007-37cbd89592ef', '1748797295296-4f52f39209fd', '1784923000569-d258530c4f9b', '1752245055475-8b7c3b4756ac'],
    zonas: [['Hasta 10 cuadras', 1000], ['San Fernando', 1800], ['Victoria', 2200], ['Otra zona', null]], minimo: 10000, gratis: 35000, promo: 'Pollo entero + papas fritas grandes $19.000',
    faq: [['¿Hasta qué hora toman pedidos?', 'Hasta 30 minutos antes de cerrar.'], ['¿Tienen menú del día?', 'Sí, se publica todos los días a las 11.'], ['¿Cómo pago?', 'Efectivo o transferencia al retirar o al recibir.']],
    carta: [
      { cat: 'Pollos y carnes', items: [{ n: 'Pollo al spiedo', d: 'Entero', p: 15000, op: [{ t: 'Tamaño', o: [['Entero', 0], ['Medio', -6500]] }] }, { n: 'Matambre a la pizza', d: 'Porción', p: 9500, f: '1778855400007-37cbd89592ef' }, { n: 'Milanesa napolitana', d: 'Con guarnición', p: 11000, op: [{ t: 'Guarnición', o: [['Papas fritas', 0], ['Puré', 0], ['Ensalada', 0]] }] }] },
      { cat: 'Pastas', items: [{ n: 'Ravioles caseros', d: 'Por plancha (2 porciones)', p: 9000, f: '1748797295296-4f52f39209fd', op: [{ t: 'Salsa', o: [['Sin salsa', 0], ['Fileto', 1500], ['Bolognesa', 2500]] }] }, { n: 'Lasaña', d: 'Porción grande', p: 10500 }] },
      { cat: 'Guarniciones', items: [{ n: 'Papas fritas', d: 'Porción grande', p: 5500 }, { n: 'Ensalada rusa', d: '1/2 kg', p: 4500 }, { n: 'Tortilla de papas', d: 'Entera', p: 8000, op: [{ t: 'Estilo', o: [['Jugosa', 0], ['Cocida', 0]] }] }] },
      { cat: 'Postres', items: [{ n: 'Flan casero', d: 'Con dulce de leche', p: 4500, f: '1752245055475-8b7c3b4756ac' }, { n: 'Budín de pan', d: 'Porción', p: 4000 }] }] };
  R.rotiseria = { nombre: 'Rotiserías', palabra: { carta: 'Menú', pedir: 'Hacé tu pedido', ver: 'Ver el menú' }, apps: true, p4: 'programado',
    planes: { 3: 'Pedidos', 4: 'Pedidos programados', 5: 'Autogestionable' }, est: [['parrilla', 'Casera'], ['cafe', 'Gourmet'], ['urbano', 'Al paso']],
    E: { parrilla: mk(rot, { sitio: 'donaelsa', nombre: 'Rotisería Doña Elsa', titulo: 'Rotisería Doña Elsa', zona: 'Comida casera · San Fernando', tit: 'Comida casera, como en tu casa.', sub: 'Pollos, pastas y tartas para llevar o con envío.', dir: 'Madero 1100, San Fernando', hero: '1784923000569-d258530c4f9b' }),
      cafe: mk(rot, { sitio: 'vianda', nombre: 'La Vianda', titulo: 'La Vianda · Cocina para llevar', zona: 'Cocina gourmet · Victoria', tit: 'Cocina de autor para llevar.', sub: 'Menú semanal, viandas saludables y platos del día.', dir: 'Av. Pres. Perón 2300, Victoria', hero: '1748797295296-4f52f39209fd' }),
      urbano: mk(rot, { sitio: 'brasa', nombre: 'Brasa al Paso', titulo: 'Brasa al Paso', zona: 'Pollería y minutas · Tigre', tit: 'Pollo al spiedo y minutas al toque.', sub: 'Pedí por la web y retiralo sin esperar.', dir: 'Av. Liniers 900, Tigre', hero: '1778855400007-37cbd89592ef' }) } };

  /* ---------- Ferretería y corralón ---------- */
  var fer = { hor: (function () { var o = H6(8, 19); o[6] = [[8, 13]]; return o; })(),
    gal: ['1668874184010-87aa286683dd', '1613945831677-383c19ad7721', '1529255848089-c4e456d166e0', '1510016290251-68aaad49723e', '1525909002-1b05e0c869d8', '1621272156568-7306716648df'],
    eventos: { tit: 'Obras y profesionales', txt: '¿Sos constructor, plomero o electricista? Pedí tu cuenta profesional con precios por cantidad y envío a obra.', fotos: ['1613945831677-383c19ad7721', '1529255848089-c4e456d166e0'] },
    zonas: [['San Fernando', 3000], ['Victoria', 3500], ['Tigre', 4500], ['Otra zona', null]], minimo: 20000, gratis: 120000, promo: 'Pinturas: 15% off pagando por transferencia',
    faq: [['¿Hacen presupuestos para obra?', 'Sí: armá tu lista en la web y te la cotizamos por WhatsApp.'], ['¿Cortan caños y maderas?', 'Sí, cortes a medida en el momento.'], ['¿Hacen envíos?', 'Sí, con camioneta propia. Pedidos grandes, a coordinar.']],
    carta: [
      { cat: 'Herramientas', items: [{ n: 'Martillo carpintero', d: '27 mm, mango de fibra', p: 14500, f: '1668874184010-87aa286683dd' }, { n: 'Taladro percutor 13 mm', d: '750 W', p: 89000, f: '1529255848089-c4e456d166e0' }, { n: 'Juego de destornilladores', d: '6 piezas', p: 16000 }] },
      { cat: 'Tornillería', items: [{ n: 'Tornillos para madera', d: 'Caja x 100', p: 6500, f: '1613945831677-383c19ad7721', op: [{ t: 'Medida', o: [['3,5 x 30', 0], ['4 x 40', 800], ['5 x 50', 1600]] }] }, { n: 'Tarugos de nylon', d: 'Bolsa x 50', p: 3200, op: [{ t: 'Medida', o: [['6 mm', 0], ['8 mm', 500], ['10 mm', 1100]] }] }] },
      { cat: 'Pinturería', items: [{ n: 'Látex interior', d: 'Blanco mate', p: 38000, f: '1510016290251-68aaad49723e', op: [{ t: 'Envase', o: [['4 litros', 0], ['10 litros', 46000], ['20 litros', 92000]] }] }, { n: 'Rodillo antigota', d: '22 cm', p: 7500, f: '1525909002-1b05e0c869d8' }] },
      { cat: 'Jardín', items: [{ n: 'Carretilla reforzada', d: '90 litros', p: 75000, f: '1621272156568-7306716648df' }, { n: 'Manguera reforzada', d: '1/2"', p: 18000, op: [{ t: 'Largo', o: [['15 m', 0], ['25 m', 9000]] }] }] }] };
  R.ferreteria = { nombre: 'Ferreterías y corralones', palabra: { carta: 'Catálogo', pedir: 'Armá tu pedido', ver: 'Ver catálogo', boton: 'Pedir por WhatsApp' }, apps: false,
    planes: { 3: 'Catálogo y pedidos', 5: 'Autogestionable' }, est: [['parrilla', 'Clásica'], ['cafe', 'Moderna'], ['urbano', 'Industrial']],
    E: { parrilla: mk(fer, { sitio: 'lallave', nombre: 'Ferretería La Llave', titulo: 'Ferretería La Llave', zona: 'Ferretería · San Fernando', tit: 'Todo para tu casa, en el barrio.', sub: 'Herramientas, tornillería y pinturería con asesoramiento de siempre.', dir: '3 de Febrero 900, San Fernando', hero: '1668874184010-87aa286683dd' }),
      cafe: mk(fer, { sitio: 'colorhogar', nombre: 'Color Hogar', titulo: 'Color Hogar · Pinturería y ferretería', zona: 'Pinturería · Victoria', tit: 'Pintá tu casa sin vueltas.', sub: 'Pinturas, accesorios y ferretería con envío a domicilio.', dir: 'Av. Pres. Perón 1900, Victoria', hero: '1510016290251-68aaad49723e' }),
      urbano: mk(fer, { sitio: 'obranorte', nombre: 'Corralón Obra Norte', titulo: 'Corralón Obra Norte', zona: 'Corralón y ferretería industrial · Tigre', tit: 'Materiales para tu obra, a domicilio.', sub: 'Herramientas, tornillería y materiales con precios por cantidad.', dir: 'Ruta 27 1200, Tigre', hero: '1613945831677-383c19ad7721' }) } };

  /* ---------- Pet shop ---------- */
  var pet = { hor: H6(9, 20),
    gal: ['1587300003388-59208cc962cb', '1583337130417-3346a1be7dee', '1514888286974-6c03e2ca1dba'],
    zonas: [['San Fernando', 1500], ['Victoria', 2000], ['Tigre', 2500], ['Otra zona', null]], minimo: 15000, gratis: 50000, promo: 'Bolsa de 15 kg: envío gratis',
    faq: [['¿Llevan el alimento a domicilio?', 'Sí, en el día si pedís antes de las 15.'], ['¿Tienen peluquería canina?', 'Sí, con turno por WhatsApp.'], ['¿Hacen recordatorio de compra?', 'Si querés, te avisamos cuando se está por terminar la bolsa.']],
    carta: [
      { cat: 'Alimento perros', items: [{ n: 'Alimento adulto razas medianas', d: 'Premium', p: 52000, f: '1587300003388-59208cc962cb', op: [{ t: 'Bolsa', o: [['7,5 kg', 0], ['15 kg', 40000]] }] }, { n: 'Alimento cachorro', d: 'Premium', p: 34000, op: [{ t: 'Bolsa', o: [['3 kg', 0], ['7,5 kg', 38000]] }] }] },
      { cat: 'Alimento gatos', items: [{ n: 'Alimento gato adulto', d: 'Premium', p: 31000, f: '1514888286974-6c03e2ca1dba', op: [{ t: 'Bolsa', o: [['3 kg', 0], ['7,5 kg', 36000]] }] }, { n: 'Piedras sanitarias', d: 'Bolsa 4 kg', p: 6500 }] },
      { cat: 'Accesorios', items: [{ n: 'Collar regulable', d: 'Nylon', p: 7500, op: [{ t: 'Talle', o: [['S', 0], ['M', 800], ['L', 1500]] }, { t: 'Color', o: [['Negro', 0], ['Rojo', 0], ['Azul', 0]] }] }, { n: 'Cama acolchada', d: 'Lavable', p: 28000, op: [{ t: 'Tamaño', o: [['Chica', 0], ['Mediana', 8000], ['Grande', 16000]] }] }, { n: 'Pipeta antipulgas', d: 'Según peso', p: 9500, op: [{ t: 'Peso', o: [['Hasta 10 kg', 0], ['10 a 20 kg', 1500], ['Más de 20 kg', 3000]] }] }] }] };
  R.petshop = { nombre: 'Pet shops', palabra: { carta: 'Productos', pedir: 'Hacé tu pedido', ver: 'Ver productos' }, apps: false,
    planes: { 3: 'Catálogo y pedidos', 5: 'Autogestionable' }, est: [['parrilla', 'Cálida'], ['cafe', 'Natural'], ['urbano', 'Moderna']],
    E: { parrilla: mk(pet, { sitio: 'huellitas', nombre: 'Huellitas Pet Shop', titulo: 'Huellitas Pet Shop', zona: 'Pet shop · San Fernando', tit: 'Todo para tu mascota, con envío en el día.', sub: 'Alimentos, accesorios y peluquería canina.', dir: 'Sarmiento 1300, San Fernando', hero: '1587300003388-59208cc962cb' }),
      cafe: mk(pet, { sitio: 'naturpet', nombre: 'Natur Pet', titulo: 'Natur Pet', zona: 'Alimento natural · Victoria', tit: 'Alimentación natural para tu mascota.', sub: 'Alimentos premium y naturales, con asesoramiento.', dir: 'Av. Pres. Perón 2700, Victoria', hero: '1583337130417-3346a1be7dee' }),
      urbano: mk(pet, { sitio: 'dogbox', nombre: 'Dog Box', titulo: 'Dog Box · Pet store', zona: 'Pet store · Tigre', tit: 'Pet store con envío a domicilio.', sub: 'Las mejores marcas, accesorios y juguetes.', dir: 'Av. Cazón 1300, Tigre', hero: '1514888286974-6c03e2ca1dba' }) } };

  /* ---------- Ropa ---------- */
  var ropa = { hor: H6(10, 19),
    gal: ['1521572163474-6864f9cf17ab', '1556821840-3a63f95609a7', '1618453292459-53424b66bb6a', '1680292783974-a9a336c10366', '1592595293637-8557fa6d3c64', '1601063476271-a159c71ab0b3'],
    zonas: [['Zona norte', 3500], ['CABA', 4500], ['Resto del país (correo)', 7500], ['Otra zona', null]], minimo: 20000, gratis: 90000, promo: '10% off pagando por transferencia',
    faq: [['¿Cómo sé mi talle?', 'Cada prenda tiene su tabla de talles. Si dudás, escribinos.'], ['¿Puedo cambiar una prenda?', 'Sí, dentro de los 30 días con etiqueta.'], ['¿Hacen envíos al interior?', 'Sí, por correo a todo el país.']],
    carta: [
      { cat: 'Remeras', items: [{ n: 'Remera básica de algodón', d: '100% algodón peinado', p: 18000, f: '1521572163474-6864f9cf17ab', op: [{ t: 'Color', o: [['Blanco', 0], ['Negro', 0]] }, { t: 'Talle', o: [['S', 0], ['M', 0], ['L', 0], ['XL', 0]] }] }, { n: 'Remera oversize Street', d: 'Algodón pesado', p: 24000, f: '1618453292459-53424b66bb6a', op: [{ t: 'Color', o: [['Negro', 0], ['Blanco', 0]] }, { t: 'Talle', o: [['S', 0], ['M', 0], ['L', 0]] }] }, { n: 'Musculosa', d: 'Algodón', p: 14000, f: '1592595293637-8557fa6d3c64', op: [{ t: 'Talle', o: [['S', 0], ['M', 0], ['L', 0]] }] }] },
      { cat: 'Buzos', items: [{ n: 'Buzo canguro con capucha', d: 'Frisa', p: 42000, f: '1556821840-3a63f95609a7', op: [{ t: 'Color', o: [['Gris', 0], ['Negro', 0], ['Blanco', 0]] }, { t: 'Talle', o: [['S', 0], ['M', 0], ['L', 0], ['XL', 0]] }] }, { n: 'Buzo oversize', d: 'Frisa', p: 48500, f: '1680292783974-a9a336c10366', op: [{ t: 'Talle', o: [['M', 0], ['L', 0], ['XL', 0]] }] }] },
      { cat: 'Accesorios', items: [{ n: 'Gorra', d: 'Ajustable', p: 15000, op: [{ t: 'Color', o: [['Negro', 0], ['Beige', 0]] }] }, { n: 'Medias pack x3', d: 'Algodón', p: 8000 }] }] };
  R.ropa = { nombre: 'Tiendas de ropa', palabra: { carta: 'Catálogo', pedir: 'Comprá online', ver: 'Ver catálogo' }, apps: false,
    planes: { 3: 'Catálogo y pedidos', 5: 'Autogestionable' }, est: [['parrilla', 'Femenina'], ['cafe', 'Minimal'], ['urbano', 'Urbana']], completa: '../ropa/?estilo=urbano&plan=5',
    E: { parrilla: mk(ropa, { sitio: 'lasisleras', nombre: 'Isla Bonita', titulo: 'Isla Bonita · Indumentaria', zona: 'Ropa de mujer · Tigre', tit: 'Ropa linda para todos los días.', sub: 'Prendas de temporada con envío a todo el país.', dir: 'Av. Cazón 800, Tigre', hero: '1601063476271-a159c71ab0b3' }),
      cafe: mk(ropa, { sitio: 'basico', nombre: 'Básico Studio', titulo: 'Básico Studio', zona: 'Básicos · Victoria', tit: 'Básicos que combinan con todo.', sub: 'Remeras, buzos y accesorios de algodón.', dir: 'Av. Pres. Perón 1700, Victoria', hero: '1521572163474-6864f9cf17ab' }),
      urbano: mk(ropa, { sitio: 'callenorte', nombre: 'Calle Norte', titulo: 'Calle Norte', zona: 'Ropa urbana · Zona norte', tit: 'Ropa urbana para todos los días.', sub: 'Oversize, buzos y básicos. Envíos a todo el país.', dir: 'Av. Avellaneda 2500, Virreyes', hero: '1618453292459-53424b66bb6a' }) } };

  /* ---------- Gimnasio y estudios ---------- */
  var gym = { hor: (function () { var o = H6(7, 23); o[6] = [[9, 14]]; return o; })(),
    gal: ['1517836357463-d25dfeac3438', '1540497077202-7c8a3999166f', '1571019613454-1cb2f99b2d8b'],
    zonas: [['Retiro en el gimnasio', null]], minimo: 0, gratis: 1e9, promo: 'Inscripción gratis en noviembre', cupo: 15, grupoMax: 1, solo1: true, paso: 60,
    reglas: 'Reservá tu lugar hasta 1 hora antes. Si no podés venir, cancelá así lo usa otro socio.',
    faq: [['¿Puedo probar una clase?', 'Sí, la primera es gratis. Reservala en la web.'], ['¿Cómo pago la cuota?', 'Efectivo, transferencia o débito automático.'], ['¿Tienen vestuarios?', 'Sí, con duchas y lockers.']],
    carta: [
      { cat: 'Planes', items: [{ n: 'Pase libre mensual', d: 'Musculación y clases', p: 38000, f: '1517836357463-d25dfeac3438' }, { n: '2 veces por semana', d: 'Clases o musculación', p: 26000 }, { n: '3 veces por semana', d: 'Clases o musculación', p: 31000 }] },
      { cat: 'Clases', items: [{ n: 'Funcional', d: 'Lunes a viernes 8, 19 y 20 h', p: 0, f: '1540497077202-7c8a3999166f' }, { n: 'Spinning', d: 'Martes y jueves 19 h', p: 0 }, { n: 'Yoga', d: 'Lunes y miércoles 9 h', p: 0, f: '1571019613454-1cb2f99b2d8b' }] },
      { cat: 'Tienda', items: [{ n: 'Proteína whey 1 kg', d: 'Vainilla o chocolate', p: 45000, op: [{ t: 'Sabor', o: [['Vainilla', 0], ['Chocolate', 0]] }] }, { n: 'Botella del gimnasio', d: '750 ml', p: 9000 }] }] };
  R.gimnasio = { envio: false, nombre: 'Gimnasios y estudios', palabra: { carta: 'Planes y clases', pedir: 'Anotate', ver: 'Ver planes', boton: 'Mandar por WhatsApp', reservas: 'Reservá tu clase', resTxt: 'Elegí día y horario. Hay cupo limitado por clase.' }, apps: false, p4: 'reservas', app: '../gimnasio/app.html',
    planes: { 3: 'Inscripción online', 4: 'Clases con cupo', 5: 'Autogestionable' }, est: [['parrilla', 'Box'], ['cafe', 'Wellness'], ['urbano', 'Fuerza']],
    E: { parrilla: mk(gym, { sitio: 'boxnorte', nombre: 'Box Norte', titulo: 'Box Norte · Crossfit', zona: 'Box de entrenamiento · San Fernando', tit: 'Entrená en comunidad.', sub: 'Clases de funcional y crossfit con cupo reducido.', dir: 'Pringles 1000, San Fernando', hero: '1540497077202-7c8a3999166f' }),
      cafe: mk(gym, { sitio: 'prana', nombre: 'Prana Estudio', titulo: 'Prana · Yoga y pilates', zona: 'Estudio de yoga y pilates · Victoria', tit: 'Un espacio para moverte con calma.', sub: 'Yoga, pilates y meditación. Reservá tu lugar en cada clase.', dir: 'Av. Pres. Perón 2500, Victoria', hero: '1571019613454-1cb2f99b2d8b' }),
      urbano: mk(gym, { sitio: 'hierro', nombre: 'Hierro Gym', titulo: 'Hierro Gym', zona: 'Gimnasio · Tigre', tit: 'Fuerza, constancia y buena música.', sub: 'Musculación, funcional y spinning de 7 a 23 h.', dir: 'Av. Liniers 1200, Tigre', hero: '1517836357463-d25dfeac3438' }) } };

  window.CATALOGO_R = R;
})();
