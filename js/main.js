document.addEventListener('DOMContentLoaded', () => {
  const themeToggleBtn = document.getElementById('theme-toggle');
  const themeToggleIcon = document.getElementById('theme-toggle-icon');
  const backToTopBtn = document.getElementById('back-to-top');
  const navbar = document.querySelector('header nav');

  const savedTheme = localStorage.getItem('theme');
  const defaultTheme = savedTheme || (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');

  function updateTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);

    if (themeToggleIcon) {
      const tagName = themeToggleIcon.tagName.toLowerCase();
      if (tagName === 'i') {
        themeToggleIcon.classList.toggle('bi-moon-fill', theme === 'light');
        themeToggleIcon.classList.toggle('bi-sun-fill', theme === 'dark');
      } else {
        themeToggleIcon.textContent = theme === 'dark' ? '☀️ Mode Clair' : '🌙 Mode Sombre';
      }
    }

    if (themeToggleBtn) {
      themeToggleBtn.setAttribute('aria-label', theme === 'dark' ? 'Activer le mode clair' : 'Activer le mode sombre');
    }
  }

  function updateNavbarScroll() {
    if (!navbar) return;

    if (window.scrollY > 40) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  }

  updateTheme(defaultTheme);

  if (themeToggleBtn) {
    themeToggleBtn.addEventListener('click', () => {
      const currentTheme = document.documentElement.getAttribute('data-theme') === 'dark' ? 'dark' : 'light';
      updateTheme(currentTheme === 'dark' ? 'light' : 'dark');
    });
  }

  if (backToTopBtn) {
    const toggleBackToTop = () => {
      if (window.scrollY > 300) {
        backToTopBtn.classList.remove('d-none');
      } else {
        backToTopBtn.classList.add('d-none');
      }
    };

    window.addEventListener('scroll', toggleBackToTop);
    toggleBackToTop();

    backToTopBtn.addEventListener('click', (event) => {
      event.preventDefault();
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  window.addEventListener('scroll', updateNavbarScroll);
  updateNavbarScroll();

  // ==========================================
  // 1. ANIMATION DES COMPTEURS DE STATISTIQUES
  // ==========================================
  const counters = document.querySelectorAll('.stat-number');
  const counterSpeed = 200;

  const animateCounter = (counter) => {
    const target = +counter.getAttribute('data-target');
    const suffix = counter.getAttribute('data-suffix') || '';
    const current = +counter.dataset.current || 0;
    const increment = Math.max(1, Math.ceil(target / counterSpeed));
    const nextValue = current + increment;

    if (nextValue < target) {
      counter.dataset.current = nextValue;
      counter.innerText = `${nextValue}${suffix}`;
      setTimeout(() => animateCounter(counter), 20);
    } else {
      counter.dataset.current = target;
      counter.innerText = `${target}${suffix}`;
    }
  };

  const counterObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        animateCounter(entry.target);
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.5 });

  counters.forEach(counter => counterObserver.observe(counter));

  // ==========================================
  // 2. ANIMATIONS FADE-IN DES SECTIONS
  // ==========================================
  const fadeSections = document.querySelectorAll('.fade-in-section');

  const fadeObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15 });

  fadeSections.forEach(section => fadeObserver.observe(section));
});
