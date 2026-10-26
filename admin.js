/**
 * ADMIN DASHBOARD - JAVASCRIPT
 * Gestión de publicaciones y fotos en Supabase Storage
 */

document.addEventListener('DOMContentLoaded', async () => {
  let supabase = getSupabaseClient();
  let currentEditingPostId = null;

  // DOM Elements
  const loginSection = document.getElementById('login-section');
  const dashboardSection = document.getElementById('dashboard-section');
  const loginForm = document.getElementById('login-form');
  const loginError = document.getElementById('login-error');
  const logoutBtn = document.getElementById('logout-btn');

  // Config Accordion
  const toggleConfigBtn = document.getElementById('toggle-config-btn');
  const configPanel = document.getElementById('config-panel');
  const cfgUrl = document.getElementById('cfg-url');
  const cfgKey = document.getElementById('cfg-key');
  const saveCfgBtn = document.getElementById('save-cfg-btn');

  // Posts List Elements
  const postsListView = document.getElementById('posts-list-view');
  const postsLoading = document.getElementById('posts-loading');
  const postsTableContainer = document.getElementById('posts-table-container');
  const postsEmpty = document.getElementById('posts-empty');
  const newPostBtn = document.getElementById('new-post-btn');

  // Editor Elements
  const editorView = document.getElementById('editor-view');
  const editorHeading = document.getElementById('editor-heading');
  const cancelEditorBtn = document.getElementById('cancel-editor-btn');
  const savePostBtn = document.getElementById('save-post-btn');
  const postIdInput = document.getElementById('post-id');
  const postTitleInput = document.getElementById('post-title');
  const postSlugInput = document.getElementById('post-slug');
  const postExcerptInput = document.getElementById('post-excerpt');
  const postTagsInput = document.getElementById('post-tags');
  const postCoverUrlInput = document.getElementById('post-cover-url');
  const coverFileInput = document.getElementById('cover-file-input');
  const coverPreviewBox = document.getElementById('cover-preview-box');
  const coverPreviewImg = document.getElementById('cover-preview-img');
  const noCoverText = document.getElementById('no-cover-text');
  const uploadStatus = document.getElementById('upload-status');
  const postPublishedCheckbox = document.getElementById('post-published');
  const postContentTextarea = document.getElementById('post-content');
  const livePreview = document.getElementById('live-preview');
  const wordCountSpan = document.getElementById('word-count');
  const inlineImageInput = document.getElementById('inline-image-input');

  // 1. Initial State & Supabase Session Check
  const initAuth = async () => {
    supabase = getSupabaseClient();
    if (!supabase) {
      showLoginView();
      // Pre-fill config fields if stored
      if (cfgUrl) cfgUrl.value = window.localStorage.getItem('portfolio_supabase_url') || '';
      if (cfgKey) cfgKey.value = window.localStorage.getItem('portfolio_supabase_key') || '';
      return;
    }

    try {
      const { data: { session }, error } = await supabase.auth.getSession();
      if (session && session.user) {
        showDashboardView();
        loadPosts();
      } else {
        showLoginView();
      }
    } catch (err) {
      console.error('Error verificando sesión:', err);
      showLoginView();
    }
  };

  const showLoginView = () => {
    loginSection.classList.remove('hidden');
    dashboardSection.classList.add('hidden');
    logoutBtn.classList.add('hidden');
  };

  const showDashboardView = () => {
    loginSection.classList.add('hidden');
    dashboardSection.classList.remove('hidden');
    logoutBtn.classList.remove('hidden');
  };

  // 2. Config Accordion & Custom Credentials Handler
  if (toggleConfigBtn) {
    toggleConfigBtn.addEventListener('click', () => {
      configPanel.classList.toggle('hidden');
    });
  }

  if (saveCfgBtn) {
    saveCfgBtn.addEventListener('click', () => {
      const url = cfgUrl.value.trim();
      const key = cfgKey.value.trim();
      if (url && key) {
        window.localStorage.setItem('portfolio_supabase_url', url);
        window.localStorage.setItem('portfolio_supabase_key', key);
        supabaseClient = null; // Reset cached client
        supabase = getSupabaseClient();
        alert('Credenciales de Supabase guardadas en este navegador.');
        configPanel.classList.add('hidden');
      } else {
        alert('Por favor introduce tanto la URL como la Anon Key.');
      }
    });
  }

  // 3. Login Handling
  if (loginForm) {
    loginForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      loginError.classList.add('hidden');
      const email = document.getElementById('login-email').value.trim();
      const password = document.getElementById('login-password').value;

      supabase = getSupabaseClient();
      if (!supabase) {
        loginError.innerText = 'Debes configurar tu URL y Anon Key de Supabase primero (despliega el menú inferior).';
        loginError.classList.remove('hidden');
        return;
      }

      const submitBtn = document.getElementById('login-submit-btn');
      const originalText = submitBtn.innerHTML;
      submitBtn.disabled = true;
      submitBtn.innerHTML = 'Verificando...';

      try {
        const { data, error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
        showDashboardView();
        loadPosts();
      } catch (err) {
        console.error('Login error:', err);
        loginError.innerText = err.message || 'Error al iniciar sesión. Revisa tu correo y contraseña.';
        loginError.classList.remove('hidden');
      } finally {
        submitBtn.disabled = false;
        submitBtn.innerHTML = originalText;
      }
    });
  }

  // 4. Logout Handling
  if (logoutBtn) {
    logoutBtn.addEventListener('click', async () => {
      if (supabase) {
        await supabase.auth.signOut();
      }
      showLoginView();
    });
  }

  // 5. Load and Display Posts List
  const loadPosts = async () => {
    postsLoading.classList.remove('hidden');
    postsTableContainer.classList.add('hidden');
    postsEmpty.classList.add('hidden');

    if (!supabase) {
      postsLoading.classList.add('hidden');
      renderPosts(MOCK_FALLBACK_POSTS);
      return;
    }

    try {
      const { data: posts, error } = await supabase
        .from('posts')
        .select('*')
        .order('created_at', { ascending: false });

      postsLoading.classList.add('hidden');

      if (error) throw error;

      if (!posts || posts.length === 0) {
        postsEmpty.classList.remove('hidden');
      } else {
        renderPosts(posts);
      }
    } catch (err) {
      console.error('Error cargando posts:', err);
      postsLoading.classList.add('hidden');
      // Mostrar mocks si hay error de tabla aún no creada
      renderPosts(MOCK_FALLBACK_POSTS);
    }
  };

  const renderPosts = (posts) => {
    postsTableContainer.innerHTML = '';
    postsTableContainer.classList.remove('hidden');

    posts.forEach(post => {
      const card = document.createElement('div');
      card.className = 'glass-card rounded-2xl p-5 border border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-4 transition-all hover:border-cyan-400/40';

      const formattedDate = new Date(post.created_at).toLocaleDateString('es-ES', {
        year: 'numeric', month: 'short', day: 'numeric'
      });

      const statusBadge = post.is_published
        ? '<span class="px-2 py-0.5 rounded-full text-[11px] font-mono bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">Publicado</span>'
        : '<span class="px-2 py-0.5 rounded-full text-[11px] font-mono bg-amber-500/20 text-amber-300 border border-amber-500/30">Borrador</span>';

      card.innerHTML = `
        <div class="flex items-center gap-4 min-w-0">
          ${post.cover_image ? `<img src="${post.cover_image}" alt="Portada" class="w-16 h-16 rounded-xl object-cover border border-white/10 flex-shrink-0">` : `<div class="w-16 h-16 rounded-xl bg-black/40 border border-white/10 flex items-center justify-center text-xs text-slate-500 flex-shrink-0 font-mono">No img</div>`}
          <div class="min-w-0 space-y-1">
            <div class="flex items-center gap-2">
              ${statusBadge}
              <span class="text-xs text-slate-400 font-mono">${formattedDate}</span>
            </div>
            <h3 class="text-base font-bold font-outfit text-white truncate">${post.title}</h3>
            <p class="text-xs text-slate-400 truncate max-w-xl">${post.excerpt || 'Sin extracto'}</p>
          </div>
        </div>

        <div class="flex items-center gap-2 self-end sm:self-center">
          <button class="edit-post-btn btn-glass px-3 py-1.5 rounded-xl text-xs flex items-center gap-1.5 text-cyan-300 hover:text-white" data-id="${post.id}">
            <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"/></svg>
            <span>Editar</span>
          </button>
          <button class="delete-post-btn btn-glass px-3 py-1.5 rounded-xl text-xs flex items-center gap-1.5 text-rose-300 hover:text-white hover:bg-rose-500/20" data-id="${post.id}">
            <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/></svg>
            <span>Borrar</span>
          </button>
        </div>
      `;

      // Attach actions
      card.querySelector('.edit-post-btn').addEventListener('click', () => openEditorForPost(post));
      card.querySelector('.delete-post-btn').addEventListener('click', () => deletePost(post.id, post.title));

      postsTableContainer.appendChild(card);
    });
  };

  // 6. Editor Views Switching
  const showEditor = () => {
    postsListView.classList.add('hidden');
    editorView.classList.remove('hidden');
  };

  const hideEditor = () => {
    editorView.classList.add('hidden');
    postsListView.classList.remove('hidden');
    currentEditingPostId = null;
    clearEditorForm();
  };

  if (newPostBtn) {
    newPostBtn.addEventListener('click', () => {
      currentEditingPostId = null;
      editorHeading.innerText = 'Redactar Nueva Entrada';
      clearEditorForm();
      showEditor();
    });
  }

  if (cancelEditorBtn) {
    cancelEditorBtn.addEventListener('click', hideEditor);
  }

  const clearEditorForm = () => {
    postIdInput.value = '';
    postTitleInput.value = '';
    postSlugInput.value = '';
    postExcerptInput.value = '';
    postTagsInput.value = '';
    postCoverUrlInput.value = '';
    postContentTextarea.value = '';
    postPublishedCheckbox.checked = true;
    updateCoverPreview('');
    updateLivePreview();
  };

  const openEditorForPost = (post) => {
    currentEditingPostId = post.id;
    editorHeading.innerText = 'Editar Entrada';
    postIdInput.value = post.id;
    postTitleInput.value = post.title;
    postSlugInput.value = post.slug;
    postExcerptInput.value = post.excerpt || '';
    postTagsInput.value = Array.isArray(post.tags) ? post.tags.join(', ') : '';
    postCoverUrlInput.value = post.cover_image || '';
    postContentTextarea.value = post.content || '';
    postPublishedCheckbox.checked = post.is_published !== false;
    updateCoverPreview(post.cover_image || '');
    updateLivePreview();
    showEditor();
  };

  // Auto-generate slug from title
  postTitleInput.addEventListener('input', () => {
    if (!currentEditingPostId) {
      postSlugInput.value = postTitleInput.value
        .toLowerCase()
        .normalize('NFD').replace(/[\u0300-\u036f]/g, '') // Quitar tildes
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '');
    }
  });

  // 7. Live Preview & Word Counter
  const updateLivePreview = () => {
    const raw = postContentTextarea.value;
    if (window.marked) {
      livePreview.innerHTML = raw.trim() ? marked.parse(raw) : '<span class="text-slate-500 italic">La vista previa aparecerá aquí conforme escribas...</span>';
    } else {
      livePreview.innerText = raw;
    }

    const words = raw.trim() ? raw.trim().split(/\s+/).length : 0;
    wordCountSpan.innerText = `${words} palabras`;
  };

  postContentTextarea.addEventListener('input', updateLivePreview);

  // 8. Cover Photo Input / Preview
  const updateCoverPreview = (url) => {
    if (url) {
      coverPreviewImg.src = url;
      coverPreviewImg.classList.remove('hidden');
      noCoverText.classList.add('hidden');
    } else {
      coverPreviewImg.src = '';
      coverPreviewImg.classList.add('hidden');
      noCoverText.classList.remove('hidden');
    }
  };

  postCoverUrlInput.addEventListener('input', (e) => {
    updateCoverPreview(e.target.value.trim());
  });

  // 9. Supabase Storage: Upload Images (Cover & Inline)
  const uploadImageToSupabase = async (file) => {
    supabase = getSupabaseClient();
    if (!supabase) {
      throw new Error('Supabase no está configurado. Conéctalo primero con tus credenciales.');
    }

    const fileExt = file.name.split('.').pop();
    const cleanFileName = file.name.replace(/[^a-zA-Z0-9]/g, '_');
    const filePath = `${Date.now()}-${cleanFileName}.${fileExt}`;

    const { data, error } = await supabase.storage
      .from('blog-images')
      .upload(filePath, file, { cacheControl: '3600', upsert: true });

    if (error) throw error;

    const { data: { publicUrl } } = supabase.storage
      .from('blog-images')
      .getPublicUrl(filePath);

    return publicUrl;
  };

  // Handle Cover Image Upload
  if (coverFileInput) {
    coverFileInput.addEventListener('change', async (e) => {
      const file = e.target.files[0];
      if (!file) return;

      uploadStatus.innerText = 'Subiendo imagen al bucket...';
      try {
        const publicUrl = await uploadImageToSupabase(file);
        postCoverUrlInput.value = publicUrl;
        updateCoverPreview(publicUrl);
        uploadStatus.innerText = '✓ Subida con éxito';
        setTimeout(() => { uploadStatus.innerText = ''; }, 3000);
      } catch (err) {
        console.error('Error subiendo imagen:', err);
        uploadStatus.innerText = '✕ Error al subir';
        alert(`No se pudo subir la imagen: ${err.message}`);
      }
    });
  }

  // Handle Inline Image Upload into Markdown Textarea
  if (inlineImageInput) {
    inlineImageInput.addEventListener('change', async (e) => {
      const file = e.target.files[0];
      if (!file) return;

      try {
        const publicUrl = await uploadImageToSupabase(file);
        const imageMarkdown = `\n![${file.name.split('.')[0]}](${publicUrl})\n`;
        insertAtCursor(postContentTextarea, imageMarkdown);
        updateLivePreview();
      } catch (err) {
        console.error('Error insertando imagen:', err);
        alert(`Error al subir imagen al bucket: ${err.message}`);
      }
    });
  }

  // 10. Toolbar Formatting Buttons
  const insertAtCursor = (textarea, textToInsert) => {
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const value = textarea.value;

    textarea.value = value.substring(0, start) + textToInsert + value.substring(end);
    textarea.selectionStart = textarea.selectionEnd = start + textToInsert.length;
    textarea.focus();
    updateLivePreview();
  };

  const wrapSelection = (textarea, prefix, suffix = prefix) => {
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selected = textarea.value.substring(start, end) || 'texto';
    const replacement = prefix + selected + suffix;

    textarea.value = textarea.value.substring(0, start) + replacement + textarea.value.substring(end);
    textarea.selectionStart = start + prefix.length;
    textarea.selectionEnd = start + prefix.length + selected.length;
    textarea.focus();
    updateLivePreview();
  };

  document.querySelectorAll('.toolbar-btn[data-action]').forEach(btn => {
    btn.addEventListener('click', () => {
      const action = btn.getAttribute('data-action');
      switch (action) {
        case 'bold': wrapSelection(postContentTextarea, '**'); break;
        case 'italic': wrapSelection(postContentTextarea, '*'); break;
        case 'h2': insertAtCursor(postContentTextarea, '\n## Encabezado\n'); break;
        case 'h3': insertAtCursor(postContentTextarea, '\n### Subtítulo\n'); break;
        case 'quote': insertAtCursor(postContentTextarea, '\n> Cita o idea destacada\n'); break;
        case 'code': wrapSelection(postContentTextarea, '```bash\n', '\n```'); break;
        case 'list': insertAtCursor(postContentTextarea, '\n- Elemento 1\n- Elemento 2\n'); break;
        case 'link': wrapSelection(postContentTextarea, '[', '](https://url.com)'); break;
      }
    });
  });

  // 11. Save Post (Insert or Update in Supabase)
  if (savePostBtn) {
    savePostBtn.addEventListener('click', async () => {
      const title = postTitleInput.value.trim();
      const slug = postSlugInput.value.trim();
      const content = postContentTextarea.value.trim();
      const excerpt = postExcerptInput.value.trim();
      const cover_image = postCoverUrlInput.value.trim();
      const is_published = postPublishedCheckbox.checked;

      const tags = postTagsInput.value
        .split(',')
        .map(t => t.trim())
        .filter(t => t.length > 0);

      if (!title || !slug || !content) {
        alert('Por favor completa al menos el Título, el Slug y el Contenido.');
        return;
      }

      supabase = getSupabaseClient();
      if (!supabase) {
        alert('Supabase no está configurado todavía. Pega tus credenciales en el pie del login.');
        return;
      }

      const originalBtnText = savePostBtn.innerHTML;
      savePostBtn.disabled = true;
      savePostBtn.innerHTML = 'Guardando...';

      const postPayload = {
        title,
        slug,
        content,
        excerpt,
        cover_image: cover_image || null,
        tags,
        is_published,
        updated_at: new Date().toISOString()
      };

      try {
        let result;
        if (currentEditingPostId) {
          result = await supabase
            .from('posts')
            .update(postPayload)
            .eq('id', currentEditingPostId);
        } else {
          result = await supabase
            .from('posts')
            .insert([postPayload]);
        }

        if (result.error) throw result.error;

        alert('¡Entrada guardada con éxito en Supabase!');
        hideEditor();
        loadPosts();
      } catch (err) {
        console.error('Error al guardar:', err);
        alert(`Error al guardar la entrada: ${err.message}`);
      } finally {
        savePostBtn.disabled = false;
        savePostBtn.innerHTML = originalBtnText;
      }
    });
  }

  // 12. Delete Post
  const deletePost = async (id, title) => {
    if (!confirm(`¿Estás seguro de que deseas eliminar la publicación "${title}"?`)) {
      return;
    }

    supabase = getSupabaseClient();
    if (!supabase) return;

    try {
      const { error } = await supabase
        .from('posts')
        .delete()
        .eq('id', id);

      if (error) throw error;
      loadPosts();
    } catch (err) {
      console.error('Error al eliminar post:', err);
      alert(`No se pudo eliminar el post: ${err.message}`);
    }
  };

  // Run Auth Check on startup
  initAuth();
});
