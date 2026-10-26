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

  // 9. Dynamic Blog Loader & Reader Modal
  const blogPostsGrid = document.getElementById('blog-posts-grid');
  const blogReaderModal = document.getElementById('blog-reader-modal');
  const closeBlogReader = document.getElementById('close-blog-reader');
  const readerCoverContainer = document.getElementById('reader-cover-container');
  const readerCoverImg = document.getElementById('reader-cover-img');
  const readerTitle = document.getElementById('reader-title');
  const readerDate = document.getElementById('reader-date');
  const readerReadingTime = document.getElementById('reader-reading-time');
  const readerTags = document.getElementById('reader-tags');
  const readerContent = document.getElementById('reader-content');

  let currentLoadedPosts = [];

  const loadBlogPosts = async () => {
    if (!blogPostsGrid) return;

    let posts = [];
    const client = typeof getSupabaseClient === 'function' ? getSupabaseClient() : null;

    if (client) {
      try {
        const { data, error } = await client
          .from('posts')
          .select('*')
          .eq('is_published', true)
          .order('created_at', { ascending: false });

        if (!error && data && data.length > 0) {
          posts = data;
        } else {
          posts = typeof MOCK_FALLBACK_POSTS !== 'undefined' ? MOCK_FALLBACK_POSTS : [];
        }
      } catch (err) {
        console.warn('Usando posts de respaldo para la bitácora:', err);
        posts = typeof MOCK_FALLBACK_POSTS !== 'undefined' ? MOCK_FALLBACK_POSTS : [];
      }
    } else {
      posts = typeof MOCK_FALLBACK_POSTS !== 'undefined' ? MOCK_FALLBACK_POSTS : [];
    }

    currentLoadedPosts = posts;
    renderBlogGrid(posts);
  };

  const renderBlogGrid = (posts) => {
    if (!blogPostsGrid) return;
    blogPostsGrid.innerHTML = '';

    if (posts.length === 0) {
      blogPostsGrid.innerHTML = `
        <div class="col-span-full text-center py-12 glass-card rounded-2xl border border-white/10 p-6">
          <p class="text-slate-300">Pronto publicaré las primeras reflexiones y avances técnicos aquí.</p>
        </div>
      `;
      return;
    }

    posts.forEach((post) => {
      const card = document.createElement('div');
      card.className = 'glass-card rounded-2xl overflow-hidden border border-white/10 hover:border-cyan-400/40 transition-all duration-300 flex flex-col group cursor-pointer';

      const formattedDate = new Date(post.created_at).toLocaleDateString('es-ES', {
        year: 'numeric', month: 'short', day: 'numeric'
      });

      const words = (post.content || '').trim().split(/\s+/).length;
      const readingMinutes = Math.max(1, Math.ceil(words / 200));

      const tagsHtml = Array.isArray(post.tags)
        ? post.tags.slice(0, 3).map(tag => `<span class="tech-pill-sm">${tag}</span>`).join('')
        : '';

      const coverHtml = post.cover_image
        ? `<div class="h-44 overflow-hidden relative">
             <img src="${post.cover_image}" alt="${post.title}" class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500">
             <div class="absolute inset-0 bg-gradient-to-t from-[#0d1326] via-transparent to-transparent"></div>
           </div>`
        : `<div class="h-28 bg-gradient-to-br from-cyan-950/40 via-indigo-950/40 to-black/60 flex items-center justify-center border-b border-white/5">
             <span class="text-xs font-mono text-cyan-400/60 font-semibold tracking-widest uppercase">Nota de Arquitectura</span>
           </div>`;

      card.innerHTML = `
        ${coverHtml}
        <div class="p-6 flex-1 flex flex-col justify-between space-y-4">
          <div class="space-y-2.5">
            <div class="flex items-center justify-between text-xs text-slate-400 font-mono">
              <span>${formattedDate}</span>
              <span class="text-cyan-300">${readingMinutes} min lectura</span>
            </div>
            <h3 class="text-lg font-bold font-outfit text-white group-hover:text-cyan-300 transition-colors line-clamp-2">
              ${post.title}
            </h3>
            <p class="text-slate-400 text-xs line-clamp-3 leading-relaxed">
              ${post.excerpt || (post.content ? post.content.substring(0, 140) + '...' : '')}
            </p>
          </div>

          <div class="pt-4 border-t border-white/10 flex items-center justify-between">
            <div class="flex flex-wrap gap-1.5">${tagsHtml}</div>
            <span class="text-xs font-semibold text-cyan-400 group-hover:translate-x-1 transition-transform inline-flex items-center gap-1">
              <span>Leer</span>
              <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/></svg>
            </span>
          </div>
        </div>
      `;

      card.addEventListener('click', () => openBlogReader(post));
      blogPostsGrid.appendChild(card);
    });
  };

  const openBlogReader = (post) => {
    if (!blogReaderModal) return;

    if (post.cover_image) {
      readerCoverImg.src = post.cover_image;
      readerCoverContainer.classList.remove('hidden');
    } else {
      readerCoverContainer.classList.add('hidden');
    }

    readerTitle.innerText = post.title;
    readerDate.innerText = new Date(post.created_at).toLocaleDateString('es-ES', {
      year: 'numeric', month: 'long', day: 'numeric'
    });

    const words = (post.content || '').trim().split(/\s+/).length;
    readerReadingTime.innerText = `${Math.max(1, Math.ceil(words / 200))} min de lectura`;

    readerTags.innerHTML = Array.isArray(post.tags)
      ? post.tags.map(t => `<span class="tech-tag">${t}</span>`).join('')
      : '';

    if (window.marked && post.content) {
      readerContent.innerHTML = marked.parse(post.content);
    } else {
      readerContent.innerText = post.content || '';
    }

    blogReaderModal.classList.remove('hidden');
    document.body.style.overflow = 'hidden';
  };

  const closeReader = () => {
    if (!blogReaderModal) return;
    blogReaderModal.classList.add('hidden');
    document.body.style.overflow = 'auto';
  };

  if (closeBlogReader) closeBlogReader.addEventListener('click', closeReader);
  if (blogReaderModal) {
    blogReaderModal.addEventListener('click', (e) => {
      if (e.target === blogReaderModal) closeReader();
    });
  }

  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && blogReaderModal && !blogReaderModal.classList.contains('hidden')) {
      closeReader();
    }
  });

  // Load blog posts on page ready
  loadBlogPosts();

});
