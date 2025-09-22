// taskbar.js
// Adds: mobile toggle + active link highlighting (IntersectionObserver)
// Degrades to scroll-based detection if IntersectionObserver is not available.

document.addEventListener('DOMContentLoaded', function () {
  const nav = document.querySelector('.taskbar');
  if (!nav) return;

  const links = Array.from(nav.querySelectorAll('a[href^="#"]'));
  const sections = Array.from(document.querySelectorAll('section[id]'));
  const toggle = nav.querySelector('.taskbar-toggle');

  // Mobile toggle
  if (toggle) {
    toggle.addEventListener('click', () => {
      const isOpen = nav.classList.toggle('open');
      toggle.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
    });
  }

  // Close mobile nav when a link is clicked
  links.forEach(l => l.addEventListener('click', () => {
    nav.classList.remove('open');
    if (toggle) toggle.setAttribute('aria-expanded', 'false');
  }));

  // Helper to clear active classes
  function clearActive() {
    links.forEach(l => l.classList.remove('active'));
  }

  // IntersectionObserver approach (preferred)
  if ('IntersectionObserver' in window) {
    const obsOptions = {
      root: null,
      rootMargin: '-35% 0px -45% 0px', // detect when a section is roughly central
      threshold: 0
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const id = entry.target.id;
          const match = nav.querySelector(`a[href="#${id}"]`);
          if (match) {
            clearActive();
            match.classList.add('active');
          }
        }
      });
    }, obsOptions);

    sections.forEach(s => observer.observe(s));
  } else {
    // Fallback: compute nearest section on scroll
    let lastActive = null;
    function onScroll() {
      const viewportMiddle = window.innerHeight * 0.4;
      let best = sections[0];
      for (const sec of sections) {
        const rect = sec.getBoundingClientRect();
        if (Math.abs(rect.top - viewportMiddle) < Math.abs(best.getBoundingClientRect().top - viewportMiddle)) {
          best = sec;
        }
      }
      const id = best.id;
      if (lastActive !== id) {
        lastActive = id;
        clearActive();
        const match = nav.querySelector(`a[href="#${id}"]`);
        if (match) match.classList.add('active');
      }
    }
    window.addEventListener('scroll', throttle(onScroll, 120));
    onScroll();
  }

  // tiny throttle & debounce helpers
  function throttle(func, wait) {
    let last = 0;
    return function(...args) {
      const now = Date.now();
      if (now - last >= wait) {
        last = now;
        func.apply(this, args);
      }
    };
  }
});
