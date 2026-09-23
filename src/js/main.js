// Main Application Bootstrap

import { initTheme } from './theme.js';
import { initNavbar } from './navbar.js';
import { initMenu } from './menu.js';
import { initGallery } from './gallery.js';
import { initReservation } from './reservation.js';
import { initAmbiance } from './ambiance.js';
import { initScrollAnimations } from './scroll-animations.js';

document.addEventListener('DOMContentLoaded', () => {
  // Initialize Core Systems
  initTheme();
  initNavbar();
  initMenu();
  initGallery();
  initReservation();
  initAmbiance();
  initScrollAnimations();

  // Newsletter Form handler
  const newsletterForm = document.getElementById('newsletter-form');
  const newsletterMsg = document.getElementById('newsletter-note');
  if (newsletterForm) {
    newsletterForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const email = newsletterForm.querySelector('input[type="email"]')?.value;
      if (email && newsletterMsg) {
        newsletterMsg.innerHTML = `<span style="color: var(--brand-blue); font-weight: 500;">✓ Thank you. You are subscribed to The KOI Dispatch.</span>`;
        newsletterForm.reset();
      }
    });
  }

  // Back to top button
  const backToTopBtn = document.getElementById('back-to-top-btn');
  if (backToTopBtn) {
    backToTopBtn.addEventListener('click', (e) => {
      e.preventDefault();
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }
});
