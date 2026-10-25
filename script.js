/**
 * LIQUID GLASS PORTFOLIO - JAVASCRIPT
 * Alvaro Mª Duarte Do Santos
 */

document.addEventListener('DOMContentLoaded', () => {

  // 1. Ambient Glow Cursor Effect (Desktop only)
  const cursorGlow = document.getElementById('cursor-glow');
  if (cursorGlow && window.matchMedia('(pointer: fine)').matches) {
    window.addEventListener('mousemove', (e) => {
      cursorGlow.style.left = `${e.clientX}px`;
      cursorGlow.style.top = `${e.clientY}px`;
    });
  }

  // 2. Liquid Glass Spotlight Cards (Tracks mouse coordinates inside cards)
  const spotlightCards = document.querySelectorAll('.glass-card-spotlight, .glass-card');
  spotlightCards.forEach((card) => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      card.style.setProperty('--mouse-x', `${x}px`);
      card.style.setProperty('--mouse-y', `${y}px`);
    });
  });

  // 3. Scroll Reveal Animation (Intersection Observer)
  const revealElements = document.querySelectorAll('section, .glass-card, .timeline-item');
  revealElements.forEach(el => el.classList.add('reveal'));

  const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('active');
        // Optional: unobserve once revealed for performance
        // observer.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.12,
    rootMargin: '0px 0px -50px 0px'
  });

  revealElements.forEach(el => revealObserver.observe(el));

  // 4. Sticky Navbar blur & Active Section Spy
  const navbar = document.getElementById('navbar');
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-link');

  window.addEventListener('scroll', () => {
    const scrollY = window.pageYOffset;

    // Navbar background intensify on scroll
    if (scrollY > 50) {
      navbar.classList.add('backdrop-blur-md');
    } else {
      navbar.classList.remove('backdrop-blur-md');
    }

    // Active Section Spy
    let currentSectionId = '';
    sections.forEach(section => {
      const sectionTop = section.offsetTop - 160;
      const sectionHeight = section.offsetHeight;
      if (scrollY >= sectionTop && scrollY < sectionTop + sectionHeight) {
        currentSectionId = section.getAttribute('id');
      }
    });

    navLinks.forEach(link => {
      link.classList.remove('active-nav');
      if (link.getAttribute('href') === `#${currentSectionId}`) {
        link.classList.add('active-nav');
      }
    });
  });

  // 5. Mobile Menu Toggle
  const mobileMenuBtn = document.getElementById('mobile-menu-btn');
  const mobileMenu = document.getElementById('mobile-menu');
  const mobileNavLinks = document.querySelectorAll('.mobile-nav-link');

  if (mobileMenuBtn && mobileMenu) {
    mobileMenuBtn.addEventListener('click', () => {
      mobileMenu.classList.toggle('hidden');
    });

    mobileNavLinks.forEach(link => {
      link.addEventListener('click', () => {
        mobileMenu.classList.add('hidden');
      });
    });
  }

  // 6. Copy Email to Clipboard
  const copyEmailBtn = document.getElementById('copy-email-btn');
  const emailText = document.getElementById('email-text');

  if (copyEmailBtn && emailText) {
    copyEmailBtn.addEventListener('click', async () => {
      const email = emailText.innerText.trim();
      try {
        await navigator.clipboard.writeText(email);
        const originalText = copyEmailBtn.innerText;
        copyEmailBtn.innerText = '✓ ¡Copiado!';
        copyEmailBtn.classList.add('text-cyan-300');
        setTimeout(() => {
          copyEmailBtn.innerText = originalText;
          copyEmailBtn.classList.remove('text-cyan-300');
        }, 2500);
      } catch (err) {
        console.error('No se pudo copiar el texto', err);
      }
    });
  }

  // 7. CV Modal handlers
  const downloadCvBtn = document.getElementById('download-cv-btn');
  const cvModal = document.getElementById('cv-modal');
  const closeCvModal = document.getElementById('close-cv-modal');
  const cancelCvModal = document.getElementById('cancel-cv-modal');
  const printCvBtn = document.getElementById('print-cv-btn');

  const openModal = () => {
    cvModal.classList.remove('hidden');
    document.body.style.overflow = 'hidden';
  };

  const closeModal = () => {
    cvModal.classList.add('hidden');
    document.body.style.overflow = 'auto';
  };

  if (downloadCvBtn) downloadCvBtn.addEventListener('click', openModal);
  if (closeCvModal) closeCvModal.addEventListener('click', closeModal);
  if (cancelCvModal) cancelCvModal.addEventListener('click', closeModal);

  if (cvModal) {
    cvModal.addEventListener('click', (e) => {
      if (e.target === cvModal) closeModal();
    });
  }

  if (printCvBtn) {
    printCvBtn.addEventListener('click', () => {
      window.print();
    });
  }

  // 8. Contact Form Handling (Envío directo a alvaroddo@gmail.com)
  const contactForm = document.getElementById('contact-form');
  const submitBtn = document.getElementById('submit-btn');
  const formToast = document.getElementById('form-toast');
  const formError = document.getElementById('form-error');

  if (contactForm && submitBtn) {
    contactForm.addEventListener('submit', async (e) => {
      e.preventDefault();

      const name = document.getElementById('name').value.trim();
      const email = document.getElementById('email').value.trim();
      const subject = document.getElementById('subject').value.trim();
      const message = document.getElementById('message').value.trim();
      const honey = document.getElementById('_honey') ? document.getElementById('_honey').value : '';

      // Filtro Honeypot antispam: si el campo invisible fue rellenado, es un bot
      if (honey !== '') {
        if (formToast) formToast.classList.remove('hidden');
        contactForm.reset();
        return;
      }

      const originalBtnHtml = submitBtn.innerHTML;
      submitBtn.disabled = true;
      submitBtn.innerHTML = `
        <svg class="animate-spin -ml-1 mr-2 h-4 w-4 text-white inline-block" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
          <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
        <span>Enviando mensaje...</span>
      `;

      if (formToast) formToast.classList.add('hidden');
      if (formError) formError.classList.add('hidden');

      try {
        const response = await fetch("https://formsubmit.co/ajax/alvaroddo@gmail.com", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Accept": "application/json"
          },
          body: JSON.stringify({
            name: name,
            email: email,
            _subject: `[Portfolio] ${subject}`,
            message: message,
            _template: "table",
            _captcha: "false"
          })
        });

        if (response.ok) {
          if (formToast) formToast.classList.remove('hidden');
          contactForm.reset();
        } else {
          throw new Error('Error al enviar el formulario');
        }
      } catch (err) {
        console.error('Error al enviar el mensaje:', err);
        if (formError) formError.classList.remove('hidden');
        // Fallback a mailto tras un breve instante
        setTimeout(() => {
          const mailtoUrl = `mailto:alvaroddo@gmail.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(`De: ${name} (${email})\n\nMensaje:\n${message}`)}`;
          window.location.href = mailtoUrl;
        }, 1500);
      } finally {
        submitBtn.disabled = false;
        submitBtn.innerHTML = originalBtnHtml;
      }
    });
  }

});
