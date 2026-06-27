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
// ==========================================
// 1. FILTRAGE DYNAMIQUE DES FREELANCES (freelances.html)
// ==========================================
const filterButtons = document.querySelectorAll('.filter-btn');
const freelanceCards = document.querySelectorAll('.freelance-card');

if (filterButtons.length > 0 && freelanceCards.length > 0) {
    filterButtons.forEach(button => {
        button.addEventListener('click', () => {
            // Gérer la classe active sur les boutons
            filterButtons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');

            const selectedCategory = button.getAttribute('data-category');

            // Filtrer les cartes
            freelanceCards.forEach(card => {
                const cardCategory = card.getAttribute('data-category');
                
                if (selectedCategory === 'all' || cardCategory === selectedCategory) {
                    card.style.display = 'block';
                    // Optionnel : ajouter une petite classe d'animation pour l'apparition
                    setTimeout(() => card.style.opacity = '1', 10);
                } else {
                    card.style.opacity = '0';
                    card.style.display = 'none';
                }
            });
        });
    });
}

// ==========================================
// 2. VALIDATION DU FORMULAIRE DE CONTACT (contact.html)
// ==========================================
const contactForm = document.getElementById('contact-form');

if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
        e.preventDefault(); // Empêche le rechargement de la page
        
        let isValid = true;

        // Récupération des champs
        const nameInput = document.getElementById('contact-name');
        const emailInput = document.getElementById('contact-email');
        const subjectInput = document.getElementById('contact-subject');
        const messageInput = document.getElementById('contact-message');
        const successMessage = document.getElementById('form-success');

        // Regex pour valider le format de l'email
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        // Fonction utilitaire pour afficher les erreurs
        const showError = (input, message) => {
            const errorSpan = document.getElementById(`${input.id}-error`);
            if (errorSpan) {
                errorSpan.innerText = message;
                errorSpan.style.display = 'block';
            }
            input.classList.add('is-invalid');
            isValid = false;
        };

        // Fonction utilitaire pour masquer les erreurs
        const clearErrors = () => {
            const errorSpans = document.querySelectorAll('.error-message');
            errorSpans.forEach(span => span.style.display = 'none');
            
            const inputs = contactForm.querySelectorAll('.form-control');
            inputs.forEach(input => input.classList.remove('is-invalid'));
            
            if (successMessage) successMessage.style.display = 'none';
        };

        // Réinitialiser les erreurs avant la vérification
        clearErrors();

        // 1. Validation du Nom
        if (!nameInput.value.trim()) {
            showError(nameInput, "Le nom est obligatoire.");
        }

        // 2. Validation de l'Email
        if (!emailInput.value.trim()) {
            showError(emailInput, "L'adresse email est obligatoire.");
        } else if (!emailRegex.test(emailInput.value.trim())) {
            showError(emailInput, "Veuillez entrer un format d'email valide (ex: exemple@mail.com).");
        }

        // 3. Validation du Sujet
        if (!subjectInput.value.trim()) {
            showError(subjectInput, "Le sujet du message est obligatoire.");
        }

        // 4. Validation du Message (Minimum 20 caractères)
        if (!messageInput.value.trim()) {
            showError(messageInput, "Le message ne peut pas être vide.");
        } else if (messageInput.value.trim().length < 20) {
            showError(messageInput, "Le message doit contenir au moins 20 caractères.");
        }

        // Si tout est valide, on affiche le message de succès et on vide le formulaire
        if (isValid) {
            if (successMessage) {
                successMessage.innerText = "Votre message a été envoyé avec succès ! Notre équipe vous répondra sous 24h.";
                successMessage.style.display = 'block';
            }
            contactForm.reset(); // Vide les champs du formulaire
        }
    });
}