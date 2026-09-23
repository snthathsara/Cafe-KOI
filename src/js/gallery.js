// Compact Atmosphere & Visual Diary Lightbox

import { GALLERY_ITEMS } from '../data/menu-data.js';

export function initGallery() {
  const galleryGrid = document.getElementById('gallery-grid');
  const lightboxOverlay = document.getElementById('lightbox-overlay');
  const lightboxImg = document.getElementById('lightbox-img');
  const lightboxTitle = document.getElementById('lightbox-caption-title');
  const lightboxSub = document.getElementById('lightbox-caption-sub');
  const lightboxCloseBtn = document.getElementById('lightbox-close-btn');
  const lightboxPrevBtn = document.getElementById('lightbox-prev-btn');
  const lightboxNextBtn = document.getElementById('lightbox-next-btn');

  if (!galleryGrid) return;

  let currentIndex = 0;

  // Render compact 4-item gallery
  galleryGrid.innerHTML = GALLERY_ITEMS.map((item, idx) => `
    <div class="gallery-item" data-index="${idx}" tabindex="0" role="button" aria-label="View photo: ${item.title}">
      <div class="gallery-img-wrap">
        <img src="${item.image}" alt="${item.title}" class="gallery-img" loading="lazy" />
        <div class="gallery-hover-overlay">
          <div class="gallery-item-title">${item.title}</div>
          <div class="gallery-item-sub">${item.subtitle}</div>
        </div>
      </div>
    </div>
  `).join('');

  // Bind clicks
  galleryGrid.querySelectorAll('.gallery-item').forEach(el => {
    el.addEventListener('click', () => {
      const idx = parseInt(el.getAttribute('data-index') || '0', 10);
      openLightbox(idx);
    });
    el.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        const idx = parseInt(el.getAttribute('data-index') || '0', 10);
        openLightbox(idx);
      }
    });
  });

  function openLightbox(index) {
    if (!lightboxOverlay || !lightboxImg) return;
    currentIndex = (index + GALLERY_ITEMS.length) % GALLERY_ITEMS.length;
    const item = GALLERY_ITEMS[currentIndex];

    lightboxImg.src = item.image;
    lightboxImg.alt = item.title;
    if (lightboxTitle) lightboxTitle.textContent = item.title;
    if (lightboxSub) lightboxSub.textContent = `${item.category} · ${item.subtitle}`;

    lightboxOverlay.classList.add('is-open');
    document.body.style.overflow = 'hidden';
  }

  function closeLightbox() {
    if (!lightboxOverlay) return;
    lightboxOverlay.classList.remove('is-open');
    document.body.style.overflow = '';
  }

  function showNext() {
    openLightbox(currentIndex + 1);
  }

  function showPrev() {
    openLightbox(currentIndex - 1);
  }

  if (lightboxCloseBtn) lightboxCloseBtn.addEventListener('click', closeLightbox);
  if (lightboxNextBtn) lightboxNextBtn.addEventListener('click', (e) => { e.stopPropagation(); showNext(); });
  if (lightboxPrevBtn) lightboxPrevBtn.addEventListener('click', (e) => { e.stopPropagation(); showPrev(); });

  if (lightboxOverlay) {
    lightboxOverlay.addEventListener('click', (e) => {
      if (e.target === lightboxOverlay) {
        closeLightbox();
      }
    });
  }

  document.addEventListener('keydown', (e) => {
    if (!lightboxOverlay || !lightboxOverlay.classList.contains('is-open')) return;
    if (e.key === 'Escape') closeLightbox();
    if (e.key === 'ArrowRight') showNext();
    if (e.key === 'ArrowLeft') showPrev();
  });
}
