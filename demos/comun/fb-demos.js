/* Base de datos de las muestras (proyecto studioproar-demos).
   En las webs públicas se usa solo con ?real=1 (queda activado en la pestaña). Sin eso, la muestra guarda en el navegador. */
(function () {
  /* Mails de turnos (EmailJS, cuenta studioproar@gmail.com). Vacío = no manda mails. */
  window.CORREO = window.CORREO || { servicio: 'service_ahwq7dl', plantilla: 'template_ox4jehp', clave: '6PwwiB64CiTwK3y7S', responder: 'studioproar@gmail.com' };
  /* Avisos push del día anterior (clave pública VAPID; la privada está solo en el Worker de Cloudflare) */
  window.AVISOS = window.AVISOS || { vapid: 'BI8xXpn6Mg5b9gZ8Te1C_ldsY6NhB8wMdktqvbaSrHbSD_Np7EMtpPFe_BU1GY3C-8x8VFAFqbzOt6BGaR4gCJI', icono: 'icono-192.png' };
  var q = /[?&]real=1\b/.test(location.search);
  try { if (q) sessionStorage.setItem('spa_real', '1'); } catch (e) {}
  var on = q || window.SPA_SIEMPRE_REAL; try { on = on || sessionStorage.getItem('spa_real') === '1'; } catch (e) {}
  if (!on) return;
  window.FIREBASE_CONFIG = {
    apiKey: "AIzaSyADvL1I9QLjjzOBxQzPdP8F6Y0dTLbiabo",
    authDomain: "studioproar-demos.firebaseapp.com",
    databaseURL: "https://studioproar-demos-default-rtdb.firebaseio.com",
    projectId: "studioproar-demos",
    appId: "1:319363609807:web:afa92e01a02159213333ba"
  };
})();
