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
    rootMargin: '0px 0px 150px 0px',
    threshold: 0.02
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

  // If user navigates via anchor hash (e.g. #reservations), reveal immediately
  function checkHashReveal() {
    if (window.location.hash) {
      try {
        const target = document.querySelector(window.location.hash);
        if (target) {
          target.querySelectorAll('.reveal-on-scroll').forEach(el => el.classList.add('is-visible'));
        }
      } catch (e) {}
    }
  }

  checkHashReveal();
  window.addEventListener('hashchange', checkHashReveal);

  // Safety fallback for headless capture or fast jumps
  setTimeout(() => {
    revealElements.forEach(el => {
      const rect = el.getBoundingClientRect();
      if (rect.top < window.innerHeight + 300) {
        el.classList.add('is-visible');
      }
    });
  }, 400);
}
