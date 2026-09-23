// Scroll-Driven Reveal Animations Engine for Café KOI

export function initScrollAnimations() {
  const revealElements = document.querySelectorAll(
    '.editorial-row, .packaging-card, .specialty-badge-card, .cobalt-banner-grid, .community-grid, .reservation-card, .visit-info-column, .footer-top-row'
  );

  revealElements.forEach((el, index) => {
    el.classList.add('reveal-on-scroll');
    el.style.transitionDelay = `${(index % 3) * 0.08}s`;
  });

  const observerOptions = {
    root: null,
    rootMargin: '0px 0px -40px 0px',
    threshold: 0.08
  };

  const observer = new IntersectionObserver((entries, obs) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        obs.unobserve(entry.target);
      }
    });
  }, observerOptions);

  revealElements.forEach(el => observer.observe(el));
}
