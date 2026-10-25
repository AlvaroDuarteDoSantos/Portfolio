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
├── index.html       # Estructura semántica HTML5 con todo el contenido del CV
├── style.css        # Reglas de Liquid Glass, animaciones y efectos visuales
├── script.js       # Interacciones, cursor glow, scroll reveal y formulario
└── README.md        # Documentación y guía de despliegue
```

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
