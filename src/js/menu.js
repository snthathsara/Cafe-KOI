// Editorial Menu Interactive Hover & Reactive Circular Vignettes

export function initMenu() {
  const editorialRows = document.querySelectorAll('.editorial-row');
  if (!editorialRows.length) return;

  editorialRows.forEach(row => {
    const vignetteImg = row.querySelector('.vignette-img');
    const vignetteCaption = row.querySelector('.vignette-caption');
    const priceRows = row.querySelectorAll('.price-item-row');

    if (!vignetteImg || !priceRows.length) return;

    // Preload images in this category so switching is instantaneous
    priceRows.forEach(item => {
      const src = item.getAttribute('data-img');
      if (src) {
        const preload = new Image();
        preload.src = src;
      }
    });

    let currentSrc = vignetteImg.getAttribute('src');

    function activateItem(item) {
      const newImg = item.getAttribute('data-img');
      const newName = item.getAttribute('data-name');
      if (!newImg || newImg === currentSrc) return;

      // Update active state across sibling price rows
      priceRows.forEach(r => r.classList.remove('is-active'));
      item.classList.add('is-active');

      // Trigger smooth visual transition on circular image
      vignetteImg.classList.add('is-switching');
      currentSrc = newImg;

      setTimeout(() => {
        vignetteImg.src = newImg;
        vignetteImg.alt = newName || 'Dish preview';
        if (vignetteCaption && newName) {
          vignetteCaption.textContent = newName;
        }
        vignetteImg.classList.remove('is-switching');
      }, 120);
    }

    // Bind interaction listeners to each price row
    priceRows.forEach(item => {
      item.addEventListener('mouseenter', () => activateItem(item));
      item.addEventListener('focus', () => activateItem(item));
      item.addEventListener('click', () => activateItem(item));
      item.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          activateItem(item);
        }
      });
      item.addEventListener('touchstart', () => activateItem(item), { passive: true });
    });
  });
}
