// Menu Highlights and Tasting Notes Modal with Staggered Animations

import { MENU_ITEMS } from '../data/menu-data.js';

export function initMenu() {
  const gridContainer = document.getElementById('menu-grid');
  const filterBtns = document.querySelectorAll('.filter-btn');
  const modalOverlay = document.getElementById('dish-modal-overlay');
  const modalContainer = document.getElementById('dish-modal-container');

  if (!gridContainer) return;

  let currentCategory = 'all';
  let isTransitioning = false;

  function renderCards(category = 'all', animateTransition = false) {
    const filtered = category === 'all' 
      ? MENU_ITEMS 
      : MENU_ITEMS.filter(item => item.category === category);

    function populateHTML() {
      gridContainer.innerHTML = filtered.map((item, idx) => `
        <article class="menu-card is-animating-in" data-dish-id="${item.id}" style="animation-delay: ${idx * 0.06}s;" tabindex="0" role="button" aria-label="View details for ${item.name}">
          <div class="menu-card-thumb-wrap">
            <img src="${item.image}" alt="${item.name}" class="menu-card-thumb" loading="lazy" />
          </div>
          <div class="menu-card-body">
            <div>
              <div class="menu-card-top">
                <h3 class="menu-card-title">${item.name}</h3>
                <span class="menu-card-price">${item.price}</span>
              </div>
              <p class="menu-card-desc">${item.description}</p>
            </div>
            <div class="menu-card-footer">
              <div class="dietary-tags">
                ${item.dietary.map(d => `<span class="dietary-badge">${d}</span>`).join('')}
              </div>
              <span class="view-notes-link">
                Tasting notes
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M5 12h14"></path>
                  <path d="m12 5 7 7-7 7"></path>
                </svg>
              </span>
            </div>
          </div>
        </article>
      `).join('');

      // Re-attach card click handlers
      gridContainer.querySelectorAll('.menu-card').forEach(card => {
        card.addEventListener('click', () => {
          const dishId = card.getAttribute('data-dish-id');
          openDishModal(dishId);
        });
        card.addEventListener('keydown', (e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            const dishId = card.getAttribute('data-dish-id');
            openDishModal(dishId);
          }
        });
      });

      isTransitioning = false;
    }

    if (animateTransition && gridContainer.children.length > 0) {
      isTransitioning = true;
      const existingCards = gridContainer.querySelectorAll('.menu-card');
      existingCards.forEach(card => card.classList.add('is-animating-out'));
      setTimeout(populateHTML, 150);
    } else {
      populateHTML();
    }
  }

  // Filter Buttons with spring click animation
  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      if (isTransitioning) return;
      const targetCategory = btn.getAttribute('data-filter') || 'all';
      if (targetCategory === currentCategory) return;

      // Spring click feedback on the button
      btn.style.transform = 'scale(0.92)';
      setTimeout(() => { btn.style.transform = ''; }, 180);

      filterBtns.forEach(b => b.classList.remove('is-active'));
      btn.classList.add('is-active');
      currentCategory = targetCategory;

      renderCards(currentCategory, true);
    });
  });

  // Modal open function
  function openDishModal(dishId) {
    const item = MENU_ITEMS.find(i => i.id === dishId);
    if (!item || !modalOverlay || !modalContainer) return;

    modalContainer.innerHTML = `
      <button class="modal-close-btn" id="modal-close-btn" aria-label="Close modal">
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <path d="M18 6 6 18"></path>
          <path d="m6 6 12 12"></path>
        </svg>
      </button>
      <img src="${item.image}" alt="${item.name}" class="modal-hero-img" />
      <div class="modal-body">
        <div class="modal-category-row">
          <span class="badge-pill">${item.categoryLabel}</span>
          <span class="modal-price">${item.price}</span>
        </div>
        <h2 class="modal-title">${item.name}</h2>
        <p class="modal-desc">${item.description}</p>

        <div class="modal-detail-box">
          <div class="detail-line">
            <span class="detail-line-title">Flavor Notes</span>
            <span class="detail-line-val">${item.notes}</span>
          </div>
          <div class="detail-line">
            <span class="detail-line-title">Crafting</span>
            <span class="detail-line-val">${item.prepTime}</span>
          </div>
          <div class="detail-line">
            <span class="detail-line-title">Suggested Pairing</span>
            <span class="detail-line-val">${item.pairing}</span>
          </div>
        </div>

        <div style="display: flex; gap: 12px; align-items: center; justify-content: flex-end;">
          <button class="btn-hero-secondary" id="modal-add-res-btn" style="padding: 10px 20px; font-size: 13.5px;">
            Reserve with this dish
          </button>
        </div>
      </div>
    `;

    modalOverlay.classList.add('is-open');
    document.body.style.overflow = 'hidden';

    // Hook up close button
    const closeBtn = modalContainer.querySelector('#modal-close-btn');
    if (closeBtn) {
      closeBtn.addEventListener('click', closeModal);
    }

    const addResBtn = modalContainer.querySelector('#modal-add-res-btn');
    if (addResBtn) {
      addResBtn.addEventListener('click', () => {
        closeModal();
        const resSection = document.getElementById('reservations');
        const notesField = document.getElementById('res-notes');
        if (notesField) {
          notesField.value = `Special request / Looking forward to tasting: ${item.name}`;
        }
        if (resSection) {
          resSection.scrollIntoView({ behavior: 'smooth' });
        }
      });
    }
  }

  function closeModal() {
    if (!modalOverlay) return;
    modalOverlay.classList.remove('is-open');
    document.body.style.overflow = '';
  }

  if (modalOverlay) {
    modalOverlay.addEventListener('click', (e) => {
      if (e.target === modalOverlay) {
        closeModal();
      }
    });
  }

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modalOverlay && modalOverlay.classList.contains('is-open')) {
      closeModal();
    }
  });

  // Initial render
  renderCards('all', false);
}
