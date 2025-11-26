document.addEventListener('DOMContentLoaded', function(){
  const form = document.getElementById('contactForm');
  if (!form) return;
  const emailAnchor = document.getElementById('contactEmail');
  const to = form.getAttribute('data-to') || (emailAnchor ? (new URL(emailAnchor.href)).pathname.replace(/^\//,'') : '');

  form.addEventListener('submit', function(e){
    e.preventDefault();
    const textarea = form.querySelector('#message');
    const msg = (textarea && textarea.value ? textarea.value.trim() : '');
    const subject = 'Mensaje desde la web';
    const body = encodeURIComponent(msg);
    const recipient = to || 'tuemail@ejemplo.com';
    const mailto = `mailto:${recipient}?subject=${encodeURIComponent(subject)}&body=${body}`;

    // fallback si el mensaje está vacío
    if (!msg) {
      // Abrir igualmente el cliente de correo con asunto por defecto
      window.location.href = `mailto:${recipient}?subject=${encodeURIComponent(subject)}`;
      return;
    }

    window.location.href = mailto;
  });
});