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

  // 8. Contact Form Handling
  const contactForm = document.getElementById('contact-form');
  const formToast = document.getElementById('form-toast');

  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const name = document.getElementById('name').value;
      const email = document.getElementById('email').value;
      const subject = document.getElementById('subject').value;
      const message = document.getElementById('message').value;

      // Construct mailto link as fallback
      const mailtoUrl = `mailto:alvaroddo@gmail.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(`De: ${name} (${email})\n\nMensaje:\n${message}`)}`;
      
      if (formToast) {
        formToast.classList.remove('hidden');
        setTimeout(() => {
          window.location.href = mailtoUrl;
        }, 800);
      } else {
        window.location.href = mailtoUrl;
      }
    });
  }

});
