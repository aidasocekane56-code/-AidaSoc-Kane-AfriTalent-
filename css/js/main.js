document.addEventListener('DOMContentLoaded', () => {
  const themeToggleBtn = document.getElementById('theme-toggle');
  const themeToggleIcon = document.getElementById('theme-toggle-icon');
  const backToTopBtn = document.getElementById('back-to-top');

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
});


document.addEventListener('DOMContentLoaded', () => {

    
    // 1. ANIMATION DES COMPTEURS
    
    const counters = document.querySelectorAll('.stat-number');
    const counterSpeed = 100; // Plus petit = plus rapide

    const animateCounter = (counter) => {
        const target = parseInt(counter.getAttribute('data-target'), 10);
        // .trim() permet de supprimer les espaces invisibles autour du 0
        const currentText = counter.innerText.trim();
        const count = parseInt(currentText, 10) || 0; 
        
        const increment = Math.ceil(target / counterSpeed);

        if (count < target) {
            counter.innerText = Math.min(count + increment, target);
            setTimeout(() => animateCounter(counter), 15);
        } else {
            const suffix = counter.getAttribute('data-suffix') || '';
            counter.innerText = target + suffix;
        }
    };

    const counterObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                animateCounter(entry.target);
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1 }); // S'active dès que le haut du chiffre apparaît

    counters.forEach(counter => counterObserver.observe(counter));

    
    // 2. ANIMATIONS FADE-IN DES SECTIONS
    
    const fadeSections = document.querySelectorAll('.fade-in-section');

    const fadeObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('is-visible');
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1 }); // Déclenchement rapide dès que la section pointe son nez

    fadeSections.forEach(section => fadeObserver.observe(section));
});