/* Ribera Training Club · datos de la muestra (se guardan solo en este navegador) */
var GYM = (function () {
  var K = 'gym_demo_v1';
  var PLANES = {
    libre: { nom: 'Pase libre', precio: 38000 },
    tres: { nom: '3 veces por semana', precio: 31000 },
    clases: { nom: 'Solo clases', precio: 27000 }
  };
  var NOMBRES = ['Lucía Gómez', 'Martín Ríos', 'Sofía Pereyra', 'Joaquín Díaz', 'Valentina Sosa', 'Tomás Acosta', 'Camila Benítez', 'Mateo Romero', 'Julieta Medina', 'Agustín Herrera', 'Mora Castro', 'Franco Suárez', 'Paula Molina', 'Bruno Ortiz', 'Abril Silva', 'Lautaro Núñez', 'Delfina Rojas', 'Ignacio Luna'];
  function hoy0() { var d = new Date(); d.setHours(0, 0, 0, 0); return d; }
  function masDias(n) { var d = hoy0(); d.setDate(d.getDate() + n); return d.getTime(); }
  function semilla() {
    var socios = NOMBRES.map(function (n, i) {
      var planes = ['libre', 'libre', 'tres', 'clases'];
      return {
        dni: String(30120000 + i * 731157 % 9000000 + i * 1111),
        nom: n,
        plan: planes[i % 4],
        vence: masDias([18, 3, 25, -2, 9, 1, 14, -6, 27, 5, 11, 2, 20, -1, 7, 16, 4, 22][i]),
        tel: '11' + (55000000 + i * 123457) % 100000000
      };
    });
    socios[0].dni = '12345678'; /* para probar el fichaje */
    var asis = [];
    for (var d = 13; d >= 0; d--) {
      var n = d === 0 ? 9 : 22 + Math.round(Math.sin(d) * 6) + (d % 7 === 6 ? -10 : 0);
      for (var j = 0; j < n; j++) {
        var s = socios[(j * 7 + d) % socios.length], t = new Date(masDias(-d));
        var h = [7, 8, 8, 9, 12, 13, 18, 18, 19, 19, 20, 21][(j * 5 + d) % 12];
        t.setHours(h, (j * 13) % 60);
        if (d === 0 && t > new Date()) continue;
        asis.push({ dni: s.dni, t: t.getTime(), ok: s.vence >= masDias(-d) });
      }
    }
    var pagos = socios.filter(function (s) { return s.vence > masDias(0); }).map(function (s, i) {
      return { dni: s.dni, monto: PLANES[s.plan].precio, t: masDias(-((i * 3) % 25)), medio: i % 3 ? 'Transferencia' : 'Efectivo' };
    });
    return { socios: socios, asis: asis, pagos: pagos };
  }
  var db;
  try { db = JSON.parse(localStorage.getItem(K)); } catch (e) { db = null; }
  if (!db || !db.socios) { db = semilla(); guardar(); }
  function guardar() { try { localStorage.setItem(K, JSON.stringify(db)); } catch (e) { /* sin almacenamiento */ } }
  function socio(dni) { return db.socios.filter(function (s) { return s.dni === String(dni); })[0] || null; }
  function dias(s) { return Math.round((s.vence - hoy0().getTime()) / 864e5); }
  return {
    PLANES: PLANES, db: function () { return db; }, guardar: guardar, socio: socio, dias: dias, hoy0: hoy0,
    pesos: function (n) { return '$' + Math.round(n).toLocaleString('es-AR'); },
    fecha: function (t) { var d = new Date(t); return d.getDate() + '/' + (d.getMonth() + 1); },
    fichar: function (dni) {
      var s = socio(dni); if (!s) return { estado: 'nadie' };
      var ok = dias(s) >= 0;
      db.asis.push({ dni: s.dni, t: Date.now(), ok: ok }); guardar();
      return { estado: ok ? 'ok' : 'vencido', socio: s, dias: dias(s) };
    },
    pagar: function (dni, medio) {
      var s = socio(dni); if (!s) return;
      var base = Math.max(s.vence, hoy0().getTime()), d = new Date(base); d.setMonth(d.getMonth() + 1);
      s.vence = d.getTime();
      db.pagos.push({ dni: s.dni, monto: PLANES[s.plan].precio, t: Date.now(), medio: medio || 'Efectivo' }); guardar();
    },
    alta: function (o) { db.socios.unshift({ dni: o.dni, nom: o.nom, plan: o.plan, tel: o.tel, vence: hoy0().getTime() - 864e5 }); guardar(); },
    reset: function () { db = semilla(); guardar(); }
  };
})();
