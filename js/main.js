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
  // 1. ANIMATION DES COMPTEURS DE STATISTIQUES (non intrusif)
  // ==========================================
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

  // gather explicit counters first
  const explicitCounters = Array.from(document.querySelectorAll('.stat-number, [data-target]'));

  // auto-detect numeric text nodes in likely stat containers (non-destructive)
  const autoDetected = [];
  const statContainers = Array.from(document.querySelectorAll('.stats, .hero-stats, .stats-grid, .counters, .counter, .stat, .stat-card'));

  const numberLike = (text) => {
    if (!text) return false;
    const t = text.trim();
    if (t.length > 12) return false;
    // allow formats like "123", "1 234", "12,345", "95%", "10+"
    return /^\+?\d[\d\s,.]*[%+]*$/.test(t);
  };

  const extractNumeric = (text) => {
    const suffixMatch = text.match(/[\+%]+$/);
    const suffix = suffixMatch ? suffixMatch[0] : '';
    const num = parseFloat(text.replace(/[^0-9.-]+/g, '')) || 0;
    return { num: Math.round(num), suffix };
  };

  // search inside known stat containers first
  statContainers.forEach(container => {
    const candidates = container.querySelectorAll('span, strong, b, p, h3, h4');
    candidates.forEach(el => {
      if (el.children.length) return;
      const txt = el.textContent || '';
      if (!numberLike(txt)) return;
      const { num, suffix } = extractNumeric(txt);
      if (num <= 0) return;
      if (!el.hasAttribute('data-target')) {
        el.setAttribute('data-target', num);
        if (suffix) el.setAttribute('data-suffix', suffix);
      }
      autoDetected.push(el);
    });
  });

  // fallback: scan main for isolated numeric nodes (conservative)
  if (explicitCounters.length === 0 && autoDetected.length === 0) {
    const fallbackCandidates = document.querySelectorAll('main span, main strong, main b, main p, main h3, main h4');
    fallbackCandidates.forEach(el => {
      if (el.children.length) return;
      const txt = el.textContent || '';
      if (!numberLike(txt)) return;
      const { num, suffix } = extractNumeric(txt);
      if (num <= 0) return;
      if (!el.hasAttribute('data-target')) {
        el.setAttribute('data-target', num);
        if (suffix) el.setAttribute('data-suffix', suffix);
      }
      autoDetected.push(el);
    });
  }

  const allCounters = Array.from(new Set([...explicitCounters, ...autoDetected]));
  allCounters.forEach(counter => counterObserver.observe(counter));

  // ==========================================
  // 2. ANIMATIONS FADE-IN DES SECTIONS
  // ==========================================
  let fadeSections = Array.from(document.querySelectorAll('.fade-in-section'));

  // If no explicit fade sections, apply to main's direct children conservatively
  if (fadeSections.length === 0) {
    const mainChildren = document.querySelectorAll('main > *');
    mainChildren.forEach(child => {
      if (!child.classList.contains('no-fade')) {
        child.classList.add('fade-in-section');
        fadeSections.push(child);
      }
    });
  }

  const fadeObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15 });

  fadeSections.forEach(section => fadeObserver.observe(section));
  // ==========================================
  // 3. FILTRAGE DYNAMIQUE DES FREELANCES (freelances.html)
  // ==========================================
  const filterButtons = document.querySelectorAll('.filter-btn');
  const featureCards = document.querySelectorAll('[data-category]');

  if (filterButtons.length && featureCards.length) {
    const setFilter = (category) => {
      featureCards.forEach(card => {
        const cardCategory = card.getAttribute('data-category');
        card.classList.toggle('d-none', category !== 'all' && cardCategory !== category);
      });
    };

    filterButtons.forEach(button => {
      button.addEventListener('click', () => {
        filterButtons.forEach(btn => btn.classList.remove('active'));
        button.classList.add('active');
        setFilter(button.getAttribute('data-filter'));
      });
    });
  }

  // ==========================================
  // 4. VALIDATION DU FORMULAIRE DE CONTACT (contact.html)
  //     Non intrusif : si la page n'a pas les éléments d'UI
  //     la logique injecte les messages d'erreur/succès dynamiquement
  // ==========================================
  let contactForm = document.getElementById('contact-form') || document.querySelector('.contact-form form') || document.querySelector('main form');
  let contactSuccess = document.getElementById('contact-success');

  if (contactForm) {
    // create contactSuccess container if missing
    if (!contactSuccess) {
      contactSuccess = document.createElement('div');
      contactSuccess.id = 'contact-success';
      contactSuccess.className = 'alert-success-custom';
      contactSuccess.setAttribute('role', 'alert');
      contactForm.parentNode.insertBefore(contactSuccess, contactForm);
    }

    contactForm.setAttribute('novalidate', '');

    const ensureErrorNode = (input) => {
      const group = input.closest('.form-group') || input.parentNode;
      let err = group.querySelector('.error-message');
      if (!err) {
        err = document.createElement('small');
        err.className = 'form-text text-danger d-none error-message';
        group.appendChild(err);
      }
      return err;
    };

    const fields = {
      prenom: {
        element: document.getElementById('prenom'),
        error: 'Veuillez renseigner votre prénom.'
      },
      nom: {
        element: document.getElementById('nom'),
        error: 'Veuillez renseigner votre nom.'
      },
      email: {
        element: document.getElementById('email'),
        error: 'Veuillez renseigner un email valide.',
        validator: (value) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)
      },
      sujet: {
        element: document.getElementById('sujet'),
        error: 'Veuillez sélectionner le sujet de votre message.',
        validator: (value) => value && value.trim() !== ''
      },
      message: {
        element: document.getElementById('message'),
        error: 'Votre message doit contenir au moins 20 caractères.',
        validator: (value) => value && value.trim().length >= 20
      }
    };

    const showError = (field, message) => {
      const input = field.element;
      if (!input) return;
      const error = ensureErrorNode(input);
      input.classList.add('is-invalid');
      error.textContent = message;
      error.classList.remove('d-none');
    };

    const hideError = (field) => {
      const input = field.element;
      if (!input) return;
      const group = input.closest('.form-group') || input.parentNode;
      const error = group.querySelector('.error-message');
      input.classList.remove('is-invalid');
      if (error) error.classList.add('d-none');
    };

    const validateField = (field) => {
      const el = field.element;
      if (!el) return true; // if field missing on page treat as valid
      const value = (el.value || '').trim();
      if (!value) {
        showError(field, field.error);
        return false;
      }
      if (field.validator && !field.validator(value)) {
        showError(field, field.error);
        return false;
      }
      hideError(field);
      return true;
    };

    Object.values(fields).forEach(field => {
      if (field.element) {
        field.element.addEventListener('input', () => validateField(field));
      }
    });

    contactForm.addEventListener('submit', (event) => {
      event.preventDefault();
      contactSuccess.style.display = 'none';
      const isValid = Object.values(fields).reduce((valid, field) => validateField(field) && valid, true);
      if (!isValid) return;
      contactSuccess.textContent = 'Merci ! Votre message a bien été envoyé. Nous revenons vers vous rapidement.';
      contactSuccess.style.display = 'block';
      contactForm.reset();
      Object.values(fields).forEach(hideError);
    });
  }
});
