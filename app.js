/**
 * PORTAL DE ROBÓTICA CBA - SCRIPT DE INTERACCIÓN
 * Team Bellas Artes Bots | Colegio Bellas Artes
 */

document.addEventListener('DOMContentLoaded', () => {
  // 1. Configurar año actual en el footer
  const currentYearSpan = document.getElementById('currentYear');
  if (currentYearSpan) {
    currentYearSpan.textContent = new Date().getFullYear();
  }

  // 2. Funcionalidad Copiar Enlace
  const copyButtons = document.querySelectorAll('.btn-copy-url');
  const toast = document.getElementById('toastNotification');
  const toastMessage = document.getElementById('toastMessage');

  copyButtons.forEach(btn => {
    btn.addEventListener('click', async () => {
      const url = btn.getAttribute('data-url');
      if (!url) return;

      try {
        await navigator.clipboard.writeText(url);
        showToast('¡Enlace copiado al portapapeles!');
      } catch (err) {
        // Fallback clásico
        const tempInput = document.createElement('input');
        tempInput.value = url;
        document.body.appendChild(tempInput);
        tempInput.select();
        document.execCommand('copy');
        document.body.removeChild(tempInput);
        showToast('¡Enlace copiado al portapapeles!');
      }
    });
  });

  // 3. Toast flotante
  let toastTimeout;
  function showToast(message) {
    if (!toast) return;
    toastMessage.textContent = message;
    toast.classList.add('show');

    clearTimeout(toastTimeout);
    toastTimeout = setTimeout(() => {
      toast.classList.remove('show');
    }, 2800);
  }

  // 4. Verificación sutil de estado (Online Ping)
  const platforms = [
    { selector: '.badge-academia', url: 'https://themiguedev.github.io/academia-robotica/' },
    { selector: '.badge-wro', url: 'https://themiguedev.github.io/PLAN-WRO/' },
    { selector: '.badge-cba', url: 'https://themiguedev.github.io/CBA-WRO/' }
  ];

  platforms.forEach(p => {
    fetch(p.url, { method: 'HEAD', mode: 'no-cors' })
      .then(() => {
        // Marcado como activo
      })
      .catch(() => {
        // Modo offline
      });
  });
});
