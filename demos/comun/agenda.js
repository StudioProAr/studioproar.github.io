/* Agenda de turnos reutilizable (usa reservas.js y, si está, correo.js).
   Agenda.montar(el, {
     sitio, negocio, lugar, num (WhatsApp), paso (min), dias (cuántos días mostrar),
     horario: {2:[9,19], ...}  (día de semana → [abre, cierra] en horas),
     servicios: [{cat, nombre, dur:'45 min', precio:'12000'}],
     panelReal, panelDemo   (links de "ver cómo le llega al negocio")
   })
   Los colores salen de variables CSS: --ag-fondo, --ag-tinta, --ag-acento, --ag-suave, --ag-borde. */
(function () {
  var css = '.ag{color:var(--ag-tinta,inherit)}.ag label,.ag .ag-et{display:block;font-weight:700;margin:14px 0 6px;font-size:.95em}.ag select,.ag input{width:100%;padding:12px;border-radius:10px;border:1px solid var(--ag-borde,#ccc);background:var(--ag-fondo,#fff);color:inherit;font:inherit;box-sizing:border-box}' +
    '.ag{min-width:0}.ag-dias,.ag-horas{display:flex;gap:8px;flex-wrap:wrap}.ag-dias{flex-wrap:nowrap;overflow-x:auto;padding-bottom:4px}.ag-b{border:1px solid var(--ag-borde,#ccc);background:var(--ag-fondo,#fff);color:inherit;border-radius:10px;padding:9px 12px;font:inherit;cursor:pointer;min-width:62px;text-align:center}.ag-b small{display:block;opacity:.7;font-size:.8em}' +
    '.ag-b[aria-pressed=true]{background:var(--ag-acento,#111);border-color:var(--ag-acento,#111);color:var(--ag-sobre-acento,#fff)}.ag-b:disabled{opacity:.3;text-decoration:line-through;cursor:not-allowed}.ag-res{margin:14px 0;min-height:1.4em}' +
    '.ag-form{display:grid;grid-template-columns:1fr 1fr;gap:10px}.ag-form .ag-ok{grid-column:1/-1}.ag-ok{width:100%;padding:14px;border:0;border-radius:12px;background:var(--ag-acento,#111);color:var(--ag-sobre-acento,#fff);font:inherit;font-weight:700;cursor:pointer}.ag-ok:disabled{opacity:.4;cursor:not-allowed}' +
    '.ag-msg{margin-top:10px}@media(max-width:560px){.ag-form{grid-template-columns:1fr}}';
  var st = document.createElement('style'); st.textContent = css; document.head.appendChild(st);
  var D = ['dom', 'lun', 'mar', 'mié', 'jue', 'vie', 'sáb'];
  var hhmm = function (n) { return String(Math.floor(n / 60)).padStart(2, '0') + ':' + String(n % 60).padStart(2, '0'); };
  var iso = function (d) { return d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0') + '-' + String(d.getDate()).padStart(2, '0'); };
  var minutos = function (t) { var h = /(\d+)\s*h/.exec(t), m = /(\d+)\s*min/.exec(t) || /h\s*(\d+)/.exec(t); return (h ? +h[1] * 60 : 0) + (m ? +m[1] : 0); };
  var esc = function (x) { return String(x == null ? '' : x).replace(/[<>&"]/g, ''); };

  window.Agenda = { montar: function (el, c) {
    var P = c.paso || 30, H = c.horario, sv = c.servicios.map(function (x) { return { cat: x.cat || '', nombre: x.nombre, dur: x.dur, min: x.min || minutos(x.dur), precio: x.precio }; });
    var dias = []; for (var i = 0; i < 28 && dias.length < (c.dias || 12); i++) { var d = new Date(); d.setHours(0, 0, 0, 0); d.setDate(d.getDate() + i); if (H[d.getDay()]) dias.push(d); }
    var sel = { s: 0, d: dias[0], h: null };
    var cats = []; sv.forEach(function (x) { if (cats.indexOf(x.cat) < 0) cats.push(x.cat); });
    el.classList.add('ag');
    el.innerHTML = '<div class="ag-mios"></div>' +
      '<label for="ag-serv-' + c.sitio + '">1. Servicio</label><select id="ag-serv-' + c.sitio + '" class="ag-serv">' + cats.map(function (k) { var o = sv.map(function (x, i) { return x.cat === k ? '<option value="' + i + '">' + esc(x.nombre) + ' · ' + esc(x.dur) + (x.precio ? ' · $' + Number(x.precio).toLocaleString('es-AR') : '') + '</option>' : ''; }).join(''); return k ? '<optgroup label="' + esc(k) + '">' + o + '</optgroup>' : o; }).join('') + '</select>' +
      '<span class="ag-et">2. Día</span><div class="ag-dias" role="group" aria-label="Día"></div>' +
      '<span class="ag-et">3. Horario</span><div class="ag-horas" role="group" aria-label="Horario"></div>' +
      '<p class="ag-res" role="status"></p>' +
      '<div class="ag-form"><input class="ag-nom" maxlength="40" placeholder="Tu nombre" autocomplete="given-name" aria-label="Tu nombre"><input class="ag-cel" type="tel" inputmode="tel" maxlength="20" placeholder="Celular (ej. 1155554444)" autocomplete="tel-national" aria-label="Tu celular"><input class="ag-mail" type="email" maxlength="80" placeholder="Mail (opcional)" autocomplete="email" aria-label="Tu mail (opcional)" style="grid-column:1/-1"><button class="ag-ok" type="button" disabled>Confirmar turno</button></div>' +
      '<div class="ag-msg" role="status"></div>';
    var q = function (s) { return el.querySelector(s); };
    Reservas.iniciar({ sitio: c.sitio, col: 'turnos', clave: 'spa_t_' + c.sitio, paso: P });
    var ocupado = function (d, m) { return Reservas.lista().some(function (t) { return t.fecha === iso(d) && m >= t.ini && m < t.ini + t.min; }); };
    var ahora = function () { var n = new Date(); return n.getHours() * 60 + n.getMinutes(); };
    function libres() {
      var d = sel.d, ab = H[d.getDay()][0], ce = H[d.getDay()][1], need = Math.ceil(sv[sel.s].min / P), r = [], hoy = iso(d) === iso(new Date());
      for (var m = ab * 60; m + need * P <= ce * 60; m += P) { var ok = !(hoy && m <= ahora() + 60); for (var j = 0; ok && j < need; j++) if (ocupado(d, m + j * P)) ok = false; r.push([m, ok]); }
      return r;
    }
    function pintar() {
      q('.ag-dias').innerHTML = dias.map(function (d) { return '<button type="button" class="ag-b" data-d="' + iso(d) + '" aria-pressed="' + (iso(d) === iso(sel.d)) + '">' + D[d.getDay()] + '<small>' + d.getDate() + '/' + (d.getMonth() + 1) + '</small></button>'; }).join('');
      var l = libres(); if (sel.h !== null && !l.some(function (x) { return x[0] === sel.h && x[1]; })) sel.h = null;
      q('.ag-horas').innerHTML = l.length ? l.map(function (x) { return '<button type="button" class="ag-b" data-h="' + x[0] + '"' + (x[1] ? '' : ' disabled') + ' aria-pressed="' + (x[0] === sel.h) + '">' + hhmm(x[0]) + '</button>'; }).join('') : '<p>No quedan horarios este día.</p>';
      var s = sv[sel.s];
      q('.ag-res').innerHTML = sel.h === null ? 'Elegí un horario libre para <b>' + esc(s.nombre) + '</b> (' + esc(s.dur) + ').' : '<b>' + esc(s.nombre) + '</b> · ' + D[sel.d.getDay()] + ' ' + sel.d.getDate() + '/' + (sel.d.getMonth() + 1) + ' · ' + hhmm(sel.h) + ' a ' + hhmm(sel.h + s.min) + (s.precio ? ' · $' + Number(s.precio).toLocaleString('es-AR') : '');
      q('.ag-ok').disabled = sel.h === null;
    }
    q('.ag-serv').onchange = function (e) { sel.s = +e.target.value; pintar(); };
    q('.ag-dias').onclick = function (e) { var b = e.target.closest('[data-d]'); if (!b) return; sel.d = dias.filter(function (d) { return iso(d) === b.dataset.d; })[0]; sel.h = null; pintar(); };
    q('.ag-horas').onclick = function (e) { var b = e.target.closest('[data-h]'); if (!b || b.disabled) return; sel.h = +b.dataset.h; pintar(); };
    q('.ag-ok').onclick = function () {
      if (sel.h === null) return;
      var s = sv[sel.s], nom = q('.ag-nom').value.trim().slice(0, 40), cel = Reservas.normCel(q('.ag-cel').value), mail = q('.ag-mail').value.trim(), msg = q('.ag-msg');
      if (nom.length < 2) { msg.textContent = 'Escribí tu nombre.'; q('.ag-nom').focus(); return; }
      if (!Reservas.celOk(cel)) { msg.textContent = 'Escribí tu celular con código de área, sin 0 ni 15 (ej. 1155554444).'; q('.ag-cel').focus(); return; }
      if (!Reservas.mailOk(mail)) { msg.textContent = 'Revisá el mail (o dejalo vacío).'; q('.ag-mail').focus(); return; }
      var t = { id: Date.now(), fecha: iso(sel.d), ini: sel.h, min: s.min, servicio: s.nombre, dur: s.dur, precio: String(s.precio || ''), nombre: nom, cel: cel, email: mail || undefined, estado: 'confirmado' }, h0 = sel.h, bt = q('.ag-ok');
      bt.disabled = true; msg.textContent = 'Guardando…';
      Reservas.guardar(t).then(function (id) {
        var baja = Reservas.linkBaja(id, { fecha: t.fecha, ini: h0, negocio: c.negocio, servicio: s.nombre });
        if (mail && window.Correo) Correo.confirmacion({ email: mail, nombre: nom, negocio: c.negocio, servicio: s.nombre, fecha: t.fecha, ini: h0, linkBaja: baja, web: location.href.split('#')[0] });
        msg.innerHTML = Reservas.tarjeta({ id: id, negocio: c.negocio, servicio: s.nombre, fecha: t.fecha, ini: h0, min: s.min, nombre: nom, lugar: c.lugar || c.negocio, waNum: c.num, baja: baja, mail: window.Correo && Correo.activo() ? mail : '' }) +
          (c.panelReal || c.panelDemo ? '<p style="margin-top:10px"><a href="' + (Reservas.modo === 'real' ? c.panelReal : c.panelDemo) + '">Ver cómo le llega al negocio →</a></p>' : '');
        Reservas.pintarMios(q('.ag-mios')); sel.h = null; pintar();
      }).catch(function (e) { msg.textContent = e.message; bt.disabled = false; pintar(); });
    };
    Reservas.alCambiar(pintar); Reservas.pintarMios(q('.ag-mios')); pintar();
  } };
})();
