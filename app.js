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

  // 2. Elementos del DOM
  const searchInput = document.getElementById('platformSearch');
  const clearSearchBtn = document.getElementById('clearSearch');
  const filterBtns = document.querySelectorAll('.filter-btn');
  const cards = document.querySelectorAll('.platform-card');
  const noResultsBox = document.getElementById('noResults');
  const copyButtons = document.querySelectorAll('.btn-copy-url');
  const toast = document.getElementById('toastNotification');
  const toastMessage = document.getElementById('toastMessage');

  let activeFilter = 'all';
  let searchTerm = '';

  // 3. Función de filtrado unificada
  function filterCards() {
    let visibleCount = 0;
    const term = searchTerm.toLowerCase().trim();

    cards.forEach(card => {
      const category = card.getAttribute('data-category');
      const keywords = card.getAttribute('data-keywords') || '';
      const textContent = card.innerText.toLowerCase();

      // Condición de categoría
      const matchesCategory = (activeFilter === 'all') || (category === activeFilter);

      // Condición de búsqueda
      const matchesSearch = !term || keywords.toLowerCase().includes(term) || textContent.includes(term);

      if (matchesCategory && matchesSearch) {
        card.style.display = 'flex';
        visibleCount++;
      } else {
        card.style.display = 'none';
      }
    });

    // Mostrar mensaje si no hay resultados
    if (noResultsBox) {
      noResultsBox.style.display = (visibleCount === 0) ? 'block' : 'none';
    }
  }

  // 4. Escuchadores para el buscador
  if (searchInput) {
    searchInput.addEventListener('input', (e) => {
      searchTerm = e.target.value;
      if (clearSearchBtn) {
        clearSearchBtn.style.display = searchTerm.length > 0 ? 'block' : 'none';
      }
      filterCards();
    });
  }

  if (clearSearchBtn) {
    clearSearchBtn.addEventListener('click', () => {
      searchInput.value = '';
      searchTerm = '';
      clearSearchBtn.style.display = 'none';
      searchInput.focus();
      filterCards();
    });
  }

  // 5. Escuchadores para botones de categoría
  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      activeFilter = btn.getAttribute('data-filter') || 'all';
      filterCards();
    });
  });

  // 6. Funcionalidad Copiar Enlace
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

  // 7. Toast flotante
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

  // 8. Verificación sutil de estado (Online Ping)
  const platforms = [
    { selector: '.badge-academia', url: 'https://themiguedev.github.io/academia-robotica/' },
    { selector: '.badge-wro', url: 'https://themiguedev.github.io/PLAN-WRO/' },
    { selector: '.badge-cba', url: 'https://themiguedev.github.io/CBA-WRO/' }
  ];

  platforms.forEach(p => {
    fetch(p.url, { method: 'HEAD', mode: 'no-cors' })
      .then(() => {
        // Marcado como activo (comprobado)
      })
      .catch(() => {
        // Manejo silencioso en caso de bloqueo CORS o modo offline
      });
  });
});
