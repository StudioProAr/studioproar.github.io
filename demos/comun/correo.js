/* Mails al cliente final (confirmación y cancelación de turnos) con EmailJS, sin servidor.
   Config: window.CORREO = { servicio: 'service_xxx', plantilla: 'template_xxx', clave: 'clave pública' }
   Si falta la config, no manda nada (la reserva funciona igual).
   La plantilla de EmailJS usa: {{para}} {{nombre}} {{negocio}} {{asunto}} {{titulo}} {{mensaje}} {{link}} {{link_txt}} {{responder}} */
(function () {
  function hh(m) { return String(Math.floor(m / 60)).padStart(2, '0') + ':' + String(m % 60).padStart(2, '0'); }
  function dia(f) {
    var d = new Date(f + 'T12:00:00'), D = ['domingo', 'lunes', 'martes', 'miércoles', 'jueves', 'viernes', 'sábado'];
    return D[d.getDay()] + ' ' + d.getDate() + '/' + (d.getMonth() + 1);
  }
  function cupo() { /* máx. 5 mails por navegador por día, para que nadie gaste el cupo gratis */
    var k = 'spa_mails_' + new Date().toISOString().slice(0, 10), n = 0;
    try { n = +localStorage.getItem(k) || 0; if (n >= 5) return false; localStorage.setItem(k, n + 1); } catch (e) {}
    return true;
  }
  var C = window.Correo = {
    activo: function () { var c = window.CORREO; return !!(c && c.servicio && c.plantilla && c.clave); },
    /* t = { email, nombre, negocio, servicio, fecha 'AAAA-MM-DD', ini (min), lugar, linkBaja, responder } */
    confirmacion: function (t) {
      return C.enviar(t, 'Turno confirmado: ' + t.negocio + ', ' + dia(t.fecha) + ' ' + hh(t.ini),
        'Confirmaste tu turno',
        'Confirmaste tu turno en ' + t.negocio + ' para ' + (t.servicio ? t.servicio + ', ' : '') + 'el ' + dia(t.fecha) + ' a las ' + hh(t.ini) + ' h.' + (t.lugar ? ' Dirección: ' + t.lugar + '.' : '') + ' Si no podés venir, cancelalo desde este link así el horario queda libre para otra persona.',
        t.linkBaja, 'Cancelar mi turno');
    },
    cancelacion: function (t, porCliente) {
      return C.enviar(t, 'Turno cancelado: ' + t.negocio + ', ' + dia(t.fecha) + ' ' + hh(t.ini),
        'Tu turno fue cancelado',
        (porCliente ? 'Cancelaste tu turno' : t.negocio + ' canceló tu turno') + ' del ' + dia(t.fecha) + ' a las ' + hh(t.ini) + ' h' + (t.servicio ? ' (' + t.servicio + ')' : '') + '.' + (porCliente ? '' : ' Disculpá las molestias.') + ' Podés reservar otro horario en la web.',
        t.web || '', 'Reservar otro turno');
    },
    enviar: function (t, asunto, titulo, mensaje, link, linkTxt) {
      var c = window.CORREO;
      if (!C.activo() || !t || !t.email || !cupo()) return Promise.resolve(false);
      return fetch('https://api.emailjs.com/api/v1.0/email/send', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ service_id: c.servicio, template_id: c.plantilla, user_id: c.clave, template_params: {
          para: t.email, nombre: t.nombre || '', negocio: t.negocio || '', asunto: asunto, titulo: titulo, mensaje: mensaje,
          link: link || '', link_txt: link ? linkTxt : '', responder: t.responder || c.responder || '' } })
      }).then(function (r) { return r.ok; }, function () { return false; });
    }
  };
})();
