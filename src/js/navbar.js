// Floating Capsule Pill Navbar with Elastic Fluid Blob Indicator & ScrollSpy

export function initNavbar() {
  const track = document.getElementById('nav-links-track');
  const blob = document.getElementById('nav-active-blob');
  const links = Array.from(document.querySelectorAll('.nav-link'));
  const sections = Array.from(document.querySelectorAll('section[id]'));
  
  if (!track || !blob || links.length === 0) return;

  let activeLink = links[0];
  let isHovering = false;
  let isManualScroll = false;
  let manualScrollTimeout = null;

  // Move blob to target element and ensure text color sync
  function setBlobTarget(targetElement) {
    if (!targetElement) {
      blob.style.opacity = '0';
      return;
    }

    // Keep text colors strictly in sync with where the blob is
    links.forEach(l => {
      l.classList.remove('has-blob');
    });
    targetElement.classList.add('has-blob');

    const trackRect = track.getBoundingClientRect();
    const linkRect = targetElement.getBoundingClientRect();

    const leftOffset = linkRect.left - trackRect.left;
    const width = linkRect.width;

    blob.style.opacity = '1';
    blob.style.transform = `translate3d(${leftOffset}px, 0, 0)`;
    blob.style.width = `${width}px`;
  }

  function setActiveLink(newActiveLink, updateBlob = true) {
    if (!newActiveLink) return;
    
    links.forEach(l => l.classList.remove('is-active'));
    newActiveLink.classList.add('is-active');
    activeLink = newActiveLink;

    if (updateBlob && !isHovering) {
      setBlobTarget(activeLink);
    }
  }

  // Hover transitions
  links.forEach(link => {
    link.addEventListener('mouseenter', () => {
      isHovering = true;
      setBlobTarget(link);
    });

    link.addEventListener('click', (e) => {
      const targetId = link.getAttribute('href');
      if (targetId && targetId.startsWith('#')) {
        const targetSection = document.querySelector(targetId);
        if (targetSection) {
          e.preventDefault();

          // Lock scrollspy during smooth scroll animation
          isManualScroll = true;
          if (manualScrollTimeout) clearTimeout(manualScrollTimeout);
          manualScrollTimeout = setTimeout(() => {
            isManualScroll = false;
          }, 850);

          setActiveLink(link, true);
          setBlobTarget(link);

          targetSection.scrollIntoView({ behavior: 'smooth' });
        }
      }
    });
  });

  track.addEventListener('mouseleave', () => {
    isHovering = false;
    setBlobTarget(activeLink);
  });

  // Initial placement after layout is stable
  setTimeout(() => {
    setActiveLink(activeLink, true);
    setBlobTarget(activeLink);
  }, 100);

  window.addEventListener('resize', () => {
    if (!isHovering && activeLink) {
      setBlobTarget(activeLink);
    }
  });

  // Real-time ScrollSpy
  let scrollTimeout;
  window.addEventListener('scroll', () => {
    if (scrollTimeout) return;
    scrollTimeout = setTimeout(() => {
      scrollTimeout = null;
      if (isHovering || isManualScroll) return;

      // Check if user is at the bottom of the page
      const isAtBottom = (window.innerHeight + window.scrollY) >= (document.documentElement.scrollHeight - 70);
      if (isAtBottom && links.length > 0) {
        const lastLink = links[links.length - 1];
        if (lastLink && lastLink !== activeLink) {
          setActiveLink(lastLink, true);
        }
        return;
      }

      const scrollPosition = window.scrollY + 200;

      let currentSectionId = '';
      for (const section of sections) {
        const top = section.offsetTop;
        const height = section.offsetHeight;
        if (scrollPosition >= top && scrollPosition < top + height) {
          currentSectionId = section.getAttribute('id');
          break;
        }
      }

      if (currentSectionId) {
        const matchingLink = links.find(l => l.getAttribute('href') === `#${currentSectionId}`);
        if (matchingLink && matchingLink !== activeLink) {
          setActiveLink(matchingLink, true);
        }
      }
    }, 40);
  }, { passive: true });

  // Mobile Drawer Toggle
  initMobileNav();
}

function initMobileNav() {
  const toggleBtn = document.getElementById('mobile-toggle-btn');
  const drawer = document.getElementById('mobile-menu-drawer');
  const mobileLinks = document.querySelectorAll('.mobile-nav-link, .mobile-nav-cta');

  if (!toggleBtn || !drawer) return;

  function toggleDrawer(open) {
    const isOpen = open !== undefined ? open : !drawer.classList.contains('is-open');
    drawer.classList.toggle('is-open', isOpen);
    toggleBtn.setAttribute('aria-expanded', String(isOpen));
  }

  toggleBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    toggleDrawer();
  });

  mobileLinks.forEach(link => {
    link.addEventListener('click', () => {
      toggleDrawer(false);
    });
  });

  document.addEventListener('click', (e) => {
    if (drawer.classList.contains('is-open') && !drawer.contains(e.target) && e.target !== toggleBtn) {
      toggleDrawer(false);
    }
  });
}
