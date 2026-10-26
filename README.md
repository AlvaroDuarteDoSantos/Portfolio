# Portafolio Profesional - Álvaro Mª Duarte Do Santos
> **DevOps & Cloud Engineer** | Especializado en Kubernetes, GCP, IaC (Terraform) y Arquitecturas de Alto Rendimiento.

Sitio web estático moderno con estética **Liquid Glass (Glassmorphism)**, optimizado para rendimiento, diseño 100% responsivo y listo para desplegarse directamente en **GitHub Pages**.

---

## ✨ Características y Diseño

- **Estilo Liquid Glass (Glassmorphism):**
  - Fondos orgánicos con blobs fluidos y gradientes dinámicos en tonos cian, azul profundo, índigo y púrpura.
  - Tarjetas semitransparentes con `backdrop-filter: blur(20px)` y bordes translúcidos reflectantes.
  - Efecto interactivo *Spotlight* que sigue las coordenadas del cursor del ratón sobre las tarjetas de cristal.
- **Tipografía:** Combinación moderna de `Outfit` (titulares y acentos) e `Inter` (cuerpo de texto legible) con toques de código en `JetBrains Mono`.
- **Tema Dark Mode Nativo:** Contraste elevado para destacar las transparencias y reflejos de luz.
- **Micro-interacciones y Animaciones:**
  - Animaciones suaves de scroll reveal (`IntersectionObserver`).
  - Navegación fija con efecto de desenfoque y detección activa de sección (Scrollspy).
  - Menú hamburguesa responsivo para móviles y tabletas.
  - Botón de copiado al portapapeles para el email y modal interactivo para previsualizar/imprimir el CV.
  - Formulario de contacto integrado con feedback visual instantáneo.

---

## 📂 Estructura del Proyecto

```text
portfolio-alvaro/
│
├── index.html           # Estructura semántica con portafolio y bitácora dinámica
├── admin.html           # Panel de administración protegido (editor Markdown y bucket)
├── admin.js             # Lógica del panel de administración (CRUD y subida de fotos)
├── supabase-config.js   # Configuración y conexión con Supabase (PostgreSQL + Storage)
├── schema.sql           # Script SQL de 1 clic para configurar Supabase automáticamente
├── style.css            # Estilos Liquid Glass, animaciones y tipografía Markdown
├── script.js           # Lógica del portafolio, lector modal de blog y formulario
├── favicon.svg          # Favicon oficial con monograma AD
├── og-preview.png       # Miniatura Open Graph para LinkedIn (1200x627 px)
└── README.md            # Documentación y guía de despliegue
```

---

## 📝 Configuración de la Bitácora y Panel de Administración (Supabase)

El sistema de blog y proyectos incluye un panel de administración en `/admin.html` conectado a **Supabase** (nivel gratuito, sin servidores).

### Paso 1: Crear proyecto en Supabase
1. Entra en [Supabase](https://supabase.com) (gratis con tu cuenta de GitHub o Google).
2. Haz clic en **New project**, ponle nombre (ej: `portfolio`) y una contraseña de base de datos.

### Paso 2: Ejecutar el script SQL de 1 clic
1. En el menú lateral izquierdo de Supabase, entra en **SQL Editor**.
2. Haz clic en **New query**, pega todo el contenido de [`schema.sql`](schema.sql) y pulsa **Run**.
   - Esto creará la tabla `posts`, las políticas de seguridad (RLS) y el bucket de almacenamiento público `blog-images` para tus fotos.

### Paso 3: Crear tu usuario Administrador
1. En el menú lateral de Supabase, ve a **Authentication > Users**.
2. Haz clic en **Add user > Create user**.
3. Introduce tu email (ej: `alvaroddo@gmail.com`) y la contraseña que quieras usar para entrar al panel.

### Paso 4: Conectar las claves
1. En Supabase, ve a **Project Settings > API**.
2. Copia tu **Project URL** y tu **anon public key**.
3. Puedes pegarlas en `supabase-config.js` o introducirlas directamente en la pantalla de login de `/admin.html` (desplegando "Configurar claves de Supabase").

¡Listo! Ya puedes redactar entradas, insertar imágenes subiéndolas al bucket y publicarlas en tiempo real en tu portafolio.

---

## 🚀 Cómo Probarlo en Local

Dado que es un sitio estático puro (HTML, CSS y Vanilla JS), no requiere ningún proceso de compilación:

1. **Opción Directa:**
   Simplemente haz doble clic sobre el archivo `index.html` para abrirlo en tu navegador favorito (Chrome, Brave, Edge, Firefox, etc.).

2. **Opción con Servidor Local (Recomendado):**
   Si tienes Python o Node instalado en tu terminal:
   ```bash
   # Con Python:
   python -m http.server 8000
   # Luego abre en tu navegador: http://localhost:8000

   # O con npx:
   npx serve .
   ```

---

## 🌐 Cómo Desplegarlo en GitHub Pages (Paso a Paso)

Para tener tu portafolio online gratis con tu propio dominio o enlace `https://tu-usuario.github.io/portafolio`:

### Paso 1: Inicializar el repositorio Git
Abre la terminal en la carpeta `portfolio-alvaro`:
```bash
git init
git add .
git commit -m "feat: initial commit liquid glass portfolio"
```

### Paso 2: Crear el repositorio en GitHub
1. Entra en tu cuenta de [GitHub](https://github.com) y crea un nuevo repositorio (por ejemplo `portfolio` o `mi-portafolio`).
2. Copia la URL del repositorio remoto.

### Paso 3: Subir tus archivos
```bash
git branch -M main
git remote add origin https://github.com/AlvaroDuarteDoSantos/TU_REPOSITORIO.git
git push -u origin main
```

### Paso 4: Activar GitHub Pages
1. En GitHub, ve a la pestaña **Settings** (Configuración) de tu repositorio.
2. En la barra lateral izquierda, haz clic en **Pages**.
3. En **Build and deployment > Branch**, selecciona la rama `main` y la carpeta `/ (root)`.
4. Haz clic en **Save**.
5. ¡Listo! En un par de minutos tu web estará disponible en:
   `https://TU_USUARIO.github.io/TU_REPOSITORIO/`

---

## 🛠️ Personalizaciones Rápidas

- **Correo de contacto:** Modifica `alvaro.duarte@example.com` en `index.html` (sección `#contacto`) y en `script.js` con tu dirección real de correo.
- **Redes Sociales:** Actualiza los enlaces a tu perfil de LinkedIn y GitHub en los botones de `#contacto` y en la cabecera/pie.
- **Añadir tu PDF del CV:** Si tienes tu currículum en formato `cv.pdf`, colócalo en la misma carpeta y enlaza el botón `<button id="download-cv-btn">` con un `<a href="cv.pdf" download>` si prefieres descarga directa de archivo.
