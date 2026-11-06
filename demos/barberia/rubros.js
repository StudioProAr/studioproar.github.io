/* Otros rubros con turnos sobre la misma muestra (?rubro=vet|estetica|salud|nautica).
   Cada rubro tiene 3 estilos (mismos temas visuales de la barbería: urbano = oscuro, clasico = cálido, mujer = claro)
   y cada estilo es un negocio ficticio distinto. Precios y textos de ejemplo. */
(function () {
  var U = function (id, t) { return [id, t]; };
  function mk(base, v) { var o = {}; Object.keys(base).forEach(function (k) { o[k] = base[k]; }); Object.keys(v).forEach(function (k) { o[k] = v[k]; }); return o; }
  var R = {};

  var vet = { hor: { 1: [9, 20], 2: [9, 20], 3: [9, 20], 4: [9, 20], 5: [9, 20], 6: [9, 14] },
    serv: [['Consulta clínica', '30 min', 18000], ['Vacunación', '20 min', 15000], ['Control de cachorro', '30 min', 16000], ['Baño y corte (perro chico)', '1 h', 22000], ['Desparasitación', '20 min', 9000], ['Ecografía', '40 min', 35000]],
    reglas: 'Traé la libreta sanitaria. Si es una urgencia, llamanos por WhatsApp antes de venir.',
    faq: [['¿Atienden urgencias?', 'Sí, en horario de atención. Avisanos por WhatsApp antes de salir.'], ['¿Hacen visitas a domicilio?', 'Sí, con turno y un adicional según la zona.'], ['¿Tienen pet shop?', 'Alimento balanceado y accesorios en el local.']] };
  R.vet = { ac: { urbano: '#3ec1a8', mujer: '#1f8a7f' }, nombre: 'Veterinarias', palabra: 'veterinario', est: [['urbano', 'Moderna'], ['clasico', 'De barrio'], ['mujer', 'Clínica']],
    txt: { eq: 'Quiénes atienden a tu mascota', gal: 'Nuestros pacientes', notas: 'Notas de la mascota (peso, vacunas, alergias, carácter…)' },
    GAL: [U('1583337130417-3346a1be7dee', 'Consulta'), U('1587300003388-59208cc962cb', 'Cachorro'), U('1514888286974-6c03e2ca1dba', 'Gato')],
    E: {
      urbano: mk(vet, { sitio: 'huella', nombre: 'Huella Vet', titulo: 'Huella Vet', zona: 'Veterinaria · Tigre', tit: 'Tu mascota, atendida sin esperas.', sub: 'Clínica, vacunas y peluquería canina con turno online.', dir: 'Av. Cazón 1500, Tigre', eq: [['A', 'Dra. Ana', 'Clínica general'], ['F', 'Dr. Fede', 'Cirugía'], ['M', 'Mica', 'Peluquería canina']] }),
      clasico: mk(vet, { sitio: 'patitas', nombre: 'Patitas del Delta', titulo: 'Veterinaria Patitas del Delta', zona: 'Veterinaria de barrio · San Fernando', tit: 'La veterinaria del barrio, con turno online.', sub: 'Más de 20 años cuidando a las mascotas de la zona.', dir: 'Sarmiento 900, San Fernando', eq: [['R', 'Dr. Raúl', 'Fundador'], ['L', 'Dra. Laura', 'Clínica y vacunas']] }),
      mujer: mk(vet, { sitio: 'vetnorte', nombre: 'Clínica Veterinaria Norte', titulo: 'Clínica Veterinaria Norte', zona: 'Clínica veterinaria · Victoria', tit: 'Medicina veterinaria con especialistas.', sub: 'Clínica, ecografías y cirugía. Reservá el turno con el profesional que quieras.', dir: 'Av. Pres. Perón 2600, Victoria', eq: [['S', 'Dra. Sol', 'Clínica'], ['P', 'Dr. Pablo', 'Ecografía'], ['C', 'Dra. Cami', 'Felinos']] })
    },
    PROS: { urbano: [['ana', 'Dra. Ana', 'Clínica general', [1, 2, 3, 4, 5]], ['fede', 'Dr. Fede', 'Cirugía', [1, 3, 5]], ['mica', 'Mica', 'Peluquería canina', [2, 4, 6]]], clasico: [['raul', 'Dr. Raúl', 'Clínica', [1, 2, 3, 4, 5, 6]], ['laura', 'Dra. Laura', 'Vacunas y cachorros', [1, 2, 3, 4, 5]]], mujer: [['sol', 'Dra. Sol', 'Clínica', [1, 2, 3, 4, 5]], ['pablo', 'Dr. Pablo', 'Ecografía', [2, 4]], ['cami', 'Dra. Cami', 'Felinos', [1, 3, 5, 6]]] } };

  var est = { hor: { 2: [10, 20], 3: [10, 20], 4: [10, 20], 5: [10, 20], 6: [10, 16] },
    serv: [['Limpieza facial profunda', '1 h', 28000], ['Manicura semipermanente', '50 min', 16000], ['Pedicura spa', '1 h', 20000], ['Depilación láser (zona chica)', '20 min', 18000], ['Masaje descontracturante', '50 min', 26000], ['Lifting de pestañas', '1 h', 24000]],
    reglas: 'Llegá 10 minutos antes. Si no podés venir, cancelá con 24 h desde el link.',
    faq: [['¿Venden gift cards?', 'Sí, de cualquier servicio. Pedila por WhatsApp.'], ['¿La depilación láser duele?', 'Se siente un calor leve. Hacemos una prueba antes.'], ['¿Cómo pago?', 'Efectivo, transferencia o QR.']] };
  R.estetica = { ac: { urbano: '#e86fb0' }, nombre: 'Estética y uñas', palabra: 'profesional', est: [['urbano', 'Nails bar'], ['clasico', 'Spa'], ['mujer', 'Centro de estética']],
    txt: { eq: 'Nuestro equipo', gal: 'Nuestro espacio', notas: 'Notas de la clienta (tipo de piel, alergias, tono de esmalte…)' },
    GAL: [U('1637777277337-f114350fb088', 'Ambiente'), U('1770925758916-44e22e159542', 'Línea de cuidado'), U('1776105609708-3d8908ab4dc2', 'Productos'), U('1786737554096-4b22c03ad991', 'Cosmética')],
    E: {
      urbano: mk(est, { sitio: 'glow', nombre: 'Glow Nails', titulo: 'Glow Nails · Nail bar', zona: 'Uñas y pestañas · Tigre', tit: 'Uñas y pestañas, con turno en 20 segundos.', sub: 'Semipermanente, esculpidas, nail art y lifting.', dir: 'Av. Liniers 500, Tigre', eq: [['J', 'Juli', 'Nail art'], ['B', 'Belu', 'Pestañas']] }),
      clasico: mk(est, { sitio: 'aura', nombre: 'Aura Spa', titulo: 'Aura Spa', zona: 'Spa urbano · San Fernando', tit: 'Una pausa para vos.', sub: 'Masajes, faciales y rituales de spa en el centro de San Fernando.', dir: 'Constitución 900, San Fernando', eq: [['N', 'Nati', 'Masajes'], ['G', 'Gabi', 'Faciales']] }),
      mujer: mk(est, { sitio: 'lumiere', nombre: 'Lumière Estética', titulo: 'Lumière · Centro de estética', zona: 'Estética · Victoria', tit: 'Tu piel, en buenas manos.', sub: 'Faciales, depilación láser y tratamientos corporales con profesionales matriculadas.', dir: 'Av. Pres. Perón 1800, Victoria', eq: [['L', 'Lic. Lara', 'Cosmiatra'], ['R', 'Ro', 'Depilación láser'], ['V', 'Vicky', 'Manos y pies']] })
    },
    PROS: { urbano: [['juli', 'Juli', 'Nail art', [2, 3, 4, 5, 6]], ['belu', 'Belu', 'Pestañas', [3, 4, 5, 6]]], clasico: [['nati', 'Nati', 'Masajes', [2, 3, 4, 5, 6]], ['gabi', 'Gabi', 'Faciales', [2, 4, 5, 6]]], mujer: [['lara', 'Lic. Lara', 'Cosmiatra', [2, 3, 4, 5]], ['ro', 'Ro', 'Depilación láser', [3, 5, 6]], ['vicky', 'Vicky', 'Manos y pies', [2, 3, 4, 5, 6]]] } };

  var sal = { hor: { 1: [8, 20], 2: [8, 20], 3: [8, 20], 4: [8, 20], 5: [8, 18] },
    serv: [['Primera consulta', '50 min', 30000], ['Sesión de seguimiento', '40 min', 25000], ['Sesión de kinesiología', '45 min', 20000], ['Plan nutricional', '1 h', 35000], ['Consulta online', '40 min', 22000]],
    reglas: 'Atendemos particulares y algunas obras sociales: consultá por WhatsApp. Cancelá con 24 h de anticipación.',
    faq: [['¿Atienden por obra social?', 'Algunas sí. Escribinos con tu credencial y te confirmamos.'], ['¿Hay consultas online?', 'Sí, por videollamada.'], ['¿Dan factura?', 'Sí, a nombre del paciente.']] };
  R.salud = { ac: { urbano: '#5aa9ff', clasico: '#6b8f4e', mujer: '#2b6cb0' }, nombre: 'Consultorios y salud', palabra: 'profesional', est: [['urbano', 'Moderno'], ['clasico', 'Cálido'], ['mujer', 'Clínico']],
    txt: { eq: 'Profesionales', gal: 'El consultorio', notas: 'Notas internas (motivo de consulta, próximos pasos)' },
    GAL: [],
    E: {
      urbano: mk(sal, { sitio: 'movete', nombre: 'Movete Kinesio', titulo: 'Movete · Kinesiología', zona: 'Kinesiología y deporte · Tigre', tit: 'Volvé a moverte sin dolor.', sub: 'Kinesiología, rehabilitación deportiva y RPG con turno online.', dir: 'Av. Santa María de las Conchas 4000, Tigre', eq: [['M', 'Lic. Martín', 'Deportiva'], ['C', 'Lic. Caro', 'RPG']] }),
      clasico: mk(sal, { sitio: 'raiz', nombre: 'Espacio Raíz', titulo: 'Espacio Raíz', zona: 'Psicología y nutrición · San Fernando', tit: 'Un espacio para cuidarte.', sub: 'Psicología y nutrición con turnos presenciales y online.', dir: 'Belgrano 1200, San Fernando', eq: [['P', 'Lic. Paula', 'Psicóloga'], ['D', 'Lic. Dani', 'Nutricionista']] }),
      mujer: mk(sal, { sitio: 'cmvictoria', nombre: 'Centro Médico Victoria', titulo: 'Centro Médico Victoria', zona: 'Consultorios · Victoria', tit: 'Turnos médicos sin llamar.', sub: 'Clínica médica, pediatría y nutrición. Elegí profesional y horario.', dir: 'Av. Pres. Perón 2100, Victoria', eq: [['G', 'Dra. Gómez', 'Clínica médica'], ['R', 'Dr. Ruiz', 'Pediatría'], ['L', 'Lic. López', 'Nutrición']] })
    },
    PROS: { urbano: [['martin', 'Lic. Martín', 'Deportiva', [1, 2, 3, 4, 5]], ['caro', 'Lic. Caro', 'RPG', [1, 3, 5]]], clasico: [['paula', 'Lic. Paula', 'Psicóloga', [1, 2, 3, 4]], ['dani', 'Lic. Dani', 'Nutricionista', [2, 4, 5]]], mujer: [['gomez', 'Dra. Gómez', 'Clínica médica', [1, 2, 3, 4, 5]], ['ruiz', 'Dr. Ruiz', 'Pediatría', [1, 3, 5]], ['lopez', 'Lic. López', 'Nutrición', [2, 4]]] } };

  var nau = { hor: { 1: [8, 17], 2: [8, 17], 3: [8, 17], 4: [8, 17], 5: [8, 17], 6: [9, 13] },
    serv: [['Service de motor fueraborda', '2 h', 85000], ['Bajada y subida de embarcación', '1 h', 30000], ['Diagnóstico', '1 h', 25000], ['Pintura de fondo (cotizar)', '1 h', 0], ['Revisión antes de temporada', '1 h 30', 55000]],
    reglas: 'Traé la matrícula y los papeles de la embarcación. Los trabajos grandes se cotizan después del diagnóstico.',
    faq: [['¿Hacen guardería?', 'Sí, náutica seca y cama náutica. Consultá disponibilidad.'], ['¿Trabajan con seguros?', 'Sí, armamos el presupuesto para tu aseguradora.'], ['¿Retiran la embarcación?', 'Con trailer propio en la zona, con costo según distancia.']] };
  R.nautica = { ac: { urbano: '#ff8a3d', clasico: '#1f3a5f', mujer: '#14507a' }, nombre: 'Náutica y talleres', palabra: 'técnico', est: [['urbano', 'Técnico'], ['clasico', 'Tradicional'], ['mujer', 'Premium']],
    txt: { eq: 'El equipo', gal: 'Trabajos y guardería', notas: 'Notas de la embarcación (motor, horas, último service…)' },
    GAL: [U('1634121419482-236ef8a935be', 'Lancha navegando'), U('1703728843356-515de7a3b134', 'Muelle'), U('1727703130993-8a3ec826659b', 'Movimiento de embarcaciones'), U('1761063091476-60a674e49329', 'Embarcación en tierra'), U('1761082514914-a4f46c69976a', 'Motor fueraborda'), U('1790909490945-2bf6e61c69a9', 'Casco en seco')],
    E: {
      urbano: mk(nau, { sitio: 'fuerab', nombre: 'Fueraborda Norte', titulo: 'Fueraborda Norte · Taller náutico', zona: 'Taller de motores · Tigre', tit: 'Tu motor a punto para la temporada.', sub: 'Service oficial de fueraborda, diagnóstico y repuestos. Sacá turno online.', dir: 'Lavalle 300, Tigre', eq: [['E', 'Ezequiel', 'Motores'], ['N', 'Nico', 'Electricidad']] }),
      clasico: mk(nau, { sitio: 'mareaalta', nombre: 'Astillero Marea Alta', titulo: 'Astillero Marea Alta', zona: 'Astillero · San Fernando', tit: 'Astillero y guardería desde 1975.', sub: 'Reparaciones, pintura, guardería y movimiento de embarcaciones.', dir: 'Pasaje Dorrego 100, San Fernando', eq: [['O', 'Osvaldo', 'Carpintería'], ['J', 'Jorge', 'Motores']] }),
      mujer: mk(nau, { sitio: 'deltaclub', nombre: 'Delta Marine Service', titulo: 'Delta Marine Service', zona: 'Servicio náutico premium · Nordelta', tit: 'Mantenimiento náutico sin vueltas.', sub: 'Service integral, detailing y guardería. Seguimiento de cada trabajo desde el celu.', dir: 'Av. de los Lagos 7000, Nordelta', eq: [['F', 'Fran', 'Jefe de taller'], ['S', 'Santi', 'Detailing'], ['T', 'Tincho', 'Motores']] })
    },
    PROS: { urbano: [['eze', 'Ezequiel', 'Motores', [1, 2, 3, 4, 5]], ['nico', 'Nico', 'Electricidad', [1, 2, 3, 4, 5, 6]]], clasico: [['osvaldo', 'Osvaldo', 'Carpintería', [1, 2, 3, 4, 5]], ['jorge', 'Jorge', 'Motores', [1, 2, 3, 4, 5, 6]]], mujer: [['fran', 'Fran', 'Jefe de taller', [1, 2, 3, 4, 5]], ['santi', 'Santi', 'Detailing', [2, 4, 6]], ['tincho', 'Tincho', 'Motores', [1, 3, 5]]] } };

  window.RUBROS_T = R;
})();
