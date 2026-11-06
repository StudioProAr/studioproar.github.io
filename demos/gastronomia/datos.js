/* Datos de ejemplo de la muestra gastronómica (negocios ficticios, precios de ejemplo).
   En un cliente real esto sale de su panel ("Editar carta") o de este archivo. */
window.GASTRO = {
  parrilla: {
    sitio: 'tranquera', nombre: 'La Tranquera', titulo: 'La Tranquera · Parrilla', zona: 'Parrilla y pastas · San Fernando',
    tit: 'Brasas, pastas caseras y sobremesa larga.', sub: 'Parrilla de barrio desde 1998. Achuras, cortes a la leña y ravioles hechos acá.',
    dir: 'Av. del Libertador 1800, San Fernando', hero: '1702677413541-ffc41d8c08b3',
    hor: { 2: [[12, 16], [20, 24]], 3: [[12, 16], [20, 24]], 4: [[12, 16], [20, 24]], 5: [[12, 16], [20, 25]], 6: [[12, 16], [20, 25]], 0: [[12, 17]] },
    gal: ['1744776411221-702f2848b0b2', '1778855400007-37cbd89592ef', '1784923000569-d258530c4f9b', '1748797295296-4f52f39209fd', '1752245055475-8b7c3b4756ac', '1702677413541-ffc41d8c08b3'],
    eventos: { tit: 'Salón privado para 40 personas', txt: 'Cumpleaños, despedidas y almuerzos de empresa con menú cerrado de parrilla libre o de pasos. Consultanos fecha y armamos el presupuesto.', fotos: ['1744776411221-702f2848b0b2', '1784923000569-d258530c4f9b'] },
    cupo: 8, grupoMax: 8, reglas: 'Grupos de más de 8 personas quedan a confirmar: te escribimos por WhatsApp. Tolerancia de 15 minutos.',
    zonas: [['San Fernando', 1500], ['Victoria', 2000], ['Tigre centro', 2500], ['Otra zona', null]], minimo: 15000, gratis: 45000,
    promo: 'Martes y miércoles: parrillada para 2 con vino de la casa $38.000',
    faq: [['¿Hacen opciones sin TACC?', 'Sí: carnes, ensaladas y postres sin harina. Avisanos al pedir.'], ['¿Se puede ir con mascotas?', 'En la vereda sí.'], ['¿Tienen estacionamiento?', 'Hay lugar en la cuadra y un estacionamiento a 50 metros.']],
    carta: [
      { cat: 'Entradas', items: [
        { n: 'Provoleta a la parrilla', d: 'Con orégano y aceite de oliva', p: 9500 },
        { n: 'Empanada de carne cortada a cuchillo', d: 'Al horno de barro', p: 2200 },
        { n: 'Tabla de achuras para 2', d: 'Chorizo, morcilla, chinchulines y molleja', p: 19000, f: '1784923000569-d258530c4f9b' }] },
      { cat: 'Parrilla', items: [
        { n: 'Bife de chorizo', d: '400 g, con guarnición', p: 21000, f: '1778855400007-37cbd89592ef', op: [{ t: 'Punto', o: [['Jugoso', 0], ['A punto', 0], ['Cocido', 0]] }, { t: 'Guarnición', o: [['Papas fritas', 0], ['Puré', 0], ['Ensalada mixta', 0], ['Papas a la provenzal', 1500]] }] },
        { n: 'Vacío', d: '350 g, tierno y jugoso', p: 18500, op: [{ t: 'Punto', o: [['Jugoso', 0], ['A punto', 0], ['Cocido', 0]] }, { t: 'Guarnición', o: [['Papas fritas', 0], ['Puré', 0], ['Ensalada mixta', 0]] }] },
        { n: 'Entraña', d: '300 g', p: 20000, op: [{ t: 'Punto', o: [['Jugoso', 0], ['A punto', 0], ['Cocido', 0]] }, { t: 'Guarnición', o: [['Papas fritas', 0], ['Puré', 0], ['Ensalada mixta', 0]] }] },
        { n: 'Parrillada para 2', d: 'Asado, vacío, chorizo, morcilla y achuras', p: 42000, op: [{ t: 'Guarnición', o: [['Papas fritas grandes', 0], ['Ensalada mixta grande', 0]] }] },
        { n: 'Pollo deshuesado', d: 'Medio pollo a la parrilla', p: 14000 }] },
      { cat: 'Pastas caseras', items: [
        { n: 'Ravioles de verdura', d: 'Hechos acá todos los días', p: 13500, f: '1748797295296-4f52f39209fd', op: [{ t: 'Salsa', o: [['Fileto', 0], ['Crema', 0], ['Mixta', 0], ['Bolognesa', 2000]] }] },
        { n: 'Sorrentinos de jamón y queso', d: '', p: 14500, op: [{ t: 'Salsa', o: [['Fileto', 0], ['Crema', 0], ['Mixta', 0], ['Bolognesa', 2000]] }] },
        { n: 'Ñoquis de papa', d: 'Los del 29 y todos los días', p: 12000, op: [{ t: 'Salsa', o: [['Fileto', 0], ['Crema', 0], ['Mixta', 0], ['Bolognesa', 2000]] }] }] },
      { cat: 'Postres', items: [
        { n: 'Flan casero', d: 'Con dulce de leche y crema', p: 6000, f: '1752245055475-8b7c3b4756ac' },
        { n: 'Panqueque con dulce de leche', d: '', p: 6500 },
        { n: 'Queso y dulce', d: 'Membrillo o batata', p: 5500 }] },
      { cat: 'Bebidas', items: [
        { n: 'Vino de la casa (botella)', d: 'Malbec', p: 12000 },
        { n: 'Agua o gaseosa', d: '500 ml', p: 3000 },
        { n: 'Sifón de soda', d: '', p: 2000 }] }
    ]
  },
  cafe: {
    sitio: 'ribera', nombre: 'Café Ribera', titulo: 'Café Ribera', zona: 'Café de especialidad · Victoria',
    tit: 'Café de especialidad y pastelería del día.', sub: 'Desayunos, brunch hasta las 15 y una mesa al sol frente al río.',
    dir: 'Av. Pres. Perón 2200, Victoria', hero: '1495474472287-4d71bcdd2085',
    hor: { 1: [[8, 20]], 2: [[8, 20]], 3: [[8, 20]], 4: [[8, 20]], 5: [[8, 21]], 6: [[9, 21]], 0: [[9, 19]] },
    gal: ['1509042239860-f550ce710b93', '1442512595331-e89e73853f31', '1555507036-ab1f4038808a', '1509440159596-0249088772ff', '1495474472287-4d71bcdd2085', '1486427944299-d1955d23e34d'],
    eventos: { tit: 'Tu desayuno o merienda especial', txt: 'Baby showers, cumpleaños y reuniones de trabajo con mesa larga, tortas por encargo y café para todos.', fotos: ['1555507036-ab1f4038808a', '1509042239860-f550ce710b93'] },
    cupo: 5, grupoMax: 8, reglas: 'Reservamos para brunch y meriendas. Grupos de más de 8 quedan a confirmar. Tolerancia de 15 minutos.',
    zonas: [['Victoria', 1200], ['San Fernando', 1800], ['San Isidro', 2500], ['Otra zona', null]], minimo: 8000, gratis: 25000,
    promo: 'De lunes a viernes de 8 a 11: café + 2 medialunas $4.500',
    faq: [['¿Tienen leches vegetales?', 'Sí: almendras y avena, con un pequeño adicional.'], ['¿Hay opciones sin TACC?', 'Budines y alfajores sin TACC, envasados.'], ['¿Se puede trabajar con la compu?', 'Sí, hay wifi y enchufes en la barra.']],
    carta: [
      { cat: 'Cafés', items: [
        { n: 'Espresso', d: 'Blend de la casa', p: 2500, op: [{ t: 'Tamaño', o: [['Simple', 0], ['Doble', 900]] }] },
        { n: 'Flat white', d: 'Doble espresso con leche texturizada', p: 3800, f: '1509042239860-f550ce710b93', op: [{ t: 'Leche', o: [['Entera', 0], ['Descremada', 0], ['Almendras', 700], ['Avena', 700]] }] },
        { n: 'Café con leche', d: 'En taza grande', p: 3500, f: '1495474472287-4d71bcdd2085', op: [{ t: 'Leche', o: [['Entera', 0], ['Descremada', 0], ['Almendras', 700], ['Avena', 700]] }] },
        { n: 'Filtrado del día', d: 'Origen único, preguntá cuál', p: 3600, f: '1442512595331-e89e73853f31' }] },
      { cat: 'Pastelería', items: [
        { n: 'Medialunas', d: 'De manteca, del día', p: 1100, f: '1555507036-ab1f4038808a' },
        { n: 'Budín de limón', d: 'Porción', p: 2800 },
        { n: 'Cheesecake de frutos rojos', d: 'Porción', p: 5200, f: '1486427944299-d1955d23e34d' },
        { n: 'Alfajor de maicena', d: 'Grande', p: 2200 }] },
      { cat: 'Brunch', items: [
        { n: 'Tostón de palta', d: 'Pan de masa madre, palta, huevo poché', p: 8500, f: '1509440159596-0249088772ff', op: [{ t: 'Pan', o: [['Masa madre', 0], ['Sin TACC', 1500]] }] },
        { n: 'Brunch completo', d: 'Bebida caliente, jugo, tostadas, huevos revueltos, yogur con granola', p: 14500 },
        { n: 'Tostado de jamón y queso', d: 'En pan de miga o árabe', p: 6500, op: [{ t: 'Pan', o: [['Miga', 0], ['Árabe', 0]] }] }] },
      { cat: 'Fríos', items: [
        { n: 'Limonada con menta y jengibre', d: '500 ml', p: 4000 },
        { n: 'Cold brew', d: 'Con hielo', p: 4200 },
        { n: 'Licuado de frutas', d: 'Con agua o con leche', p: 4500 }] }
    ]
  },
  urbano: {
    sitio: 'lupulo', nombre: 'Lúpulo Norte', titulo: 'Lúpulo Norte', zona: 'Burgers & birra · Tigre',
    tit: 'Burgers smash, birra tirada y buena música.', sub: '12 canillas de cerveza artesanal, burgers a la plancha y happy hour todos los días.',
    dir: 'Av. Cazón 900, Tigre', hero: '1436076863939-06870fe779c2',
    hor: { 2: [[18, 25]], 3: [[18, 25]], 4: [[18, 26]], 5: [[18, 27]], 6: [[12, 27]], 0: [[12, 24]] },
    gal: ['1436076863939-06870fe779c2', '1608270586620-248524c67de9', '1568901346375-23c9450c58cd', '1513104890138-7c749659a591'],
    eventos: { tit: 'After office y cumpleaños', txt: 'Reservá el deck para tu grupo: barril de 20 litros, tablas para compartir y la música que elijan.', fotos: ['1608270586620-248524c67de9', '1436076863939-06870fe779c2'] },
    cupo: 6, grupoMax: 10, reglas: 'Grupos de más de 10 quedan a confirmar. Las reservas se mantienen 20 minutos.',
    zonas: [['Tigre centro', 1500], ['Rincón de Milberg', 2000], ['San Fernando', 2500], ['Otra zona', null]], minimo: 12000, gratis: 40000,
    promo: 'Happy hour de 18 a 21: pinta $3.500',
    faq: [['¿Hay opción veggie?', 'Sí: burger de lentejas y garbanzos, y papas sin carne.'], ['¿Se puede ir con chicos?', 'Hasta las 22, con mesa reservada.'], ['¿Pasan partidos?', 'Sí, en la pantalla grande del deck.']],
    carta: [
      { cat: 'Burgers', items: [
        { n: 'Smash clásica', d: 'Doble carne, cheddar, pepinos y salsa de la casa', p: 11500, f: '1568901346375-23c9450c58cd', op: [{ t: 'Medallones', o: [['Doble', 0], ['Triple', 2500]] }, { t: 'Acompañamiento', o: [['Papas', 0], ['Papas con cheddar y verdeo', 2200], ['Aros de cebolla', 1800]] }], ext: [['Panceta', 1500], ['Huevo', 900], ['Cheddar extra', 1000]] },
        { n: 'Bacon BBQ', d: 'Panceta crocante, barbacoa y cebolla caramelizada', p: 13000, op: [{ t: 'Medallones', o: [['Doble', 0], ['Triple', 2500]] }, { t: 'Acompañamiento', o: [['Papas', 0], ['Papas con cheddar y verdeo', 2200], ['Aros de cebolla', 1800]] }], ext: [['Huevo', 900], ['Cheddar extra', 1000]] },
        { n: 'Veggie', d: 'Medallón de lentejas, palta y tomate', p: 11000, op: [{ t: 'Acompañamiento', o: [['Papas', 0], ['Ensalada', 0]] }] }] },
      { cat: 'Pizzas', items: [
        { n: 'Muzzarella', d: 'A la piedra, 8 porciones', p: 12000, f: '1513104890138-7c749659a591' },
        { n: 'Napolitana', d: 'Tomate, ajo y albahaca', p: 13500 },
        { n: 'Pepperoni', d: 'Con miel picante', p: 15000 }] },
      { cat: 'Para compartir', items: [
        { n: 'Papas Lúpulo', d: 'Con cheddar, panceta y verdeo', p: 9500 },
        { n: 'Nachos', d: 'Con guacamole y pico de gallo', p: 9000 },
        { n: 'Tabla de picada', d: 'Fiambres, quesos y aceitunas', p: 16000 }] },
      { cat: 'Cervezas', items: [
        { n: 'Pinta IPA', d: '500 ml · 6,5%', p: 5000, f: '1608270586620-248524c67de9' },
        { n: 'Pinta Golden', d: '500 ml · 4,8%', p: 4500 },
        { n: 'Pinta Stout', d: '500 ml · 5,5%', p: 5000 },
        { n: 'Growler para llevar', d: '1 litro, la que elijas', p: 8000, op: [{ t: 'Estilo', o: [['IPA', 0], ['Golden', 0], ['Stout', 0], ['Honey', 0]] }] }] },
      { cat: 'Sin alcohol', items: [
        { n: 'Gaseosa', d: '500 ml', p: 3000 },
        { n: 'Limonada', d: 'Jarra de 1 litro', p: 6000 }] }
    ]
  }
};
