-- ==============================================================================
-- SUPABASE SCHEMA: PORTAFOLIO BLOG & PROYECTOS
-- Copia y pega este script en el "SQL Editor" de tu panel de Supabase y pulsa "Run"
-- ==============================================================================

-- 1. Crear tabla de posts / entradas
CREATE TABLE IF NOT EXISTS public.posts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    slug TEXT NOT NULL UNIQUE,
    excerpt TEXT,
    content TEXT NOT NULL,
    cover_image TEXT,
    tags TEXT[] DEFAULT '{}',
    is_published BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Habilitar Row Level Security (RLS) para máxima seguridad
ALTER TABLE public.posts ENABLE ROW LEVEL SECURITY;

-- 2. Políticas de seguridad (RLS):
-- Cualquier visitante público puede LEER las entradas que estén publicadas
CREATE POLICY "Lectura pública de posts publicados" 
ON public.posts 
FOR SELECT 
USING (is_published = true OR auth.role() = 'authenticated');

-- Solo el usuario administrador autenticado puede CREAR posts
CREATE POLICY "Admin puede crear posts" 
ON public.posts 
FOR INSERT 
TO authenticated 
WITH CHECK (true);

-- Solo el usuario administrador autenticado puede EDITAR posts
CREATE POLICY "Admin puede actualizar posts" 
ON public.posts 
FOR UPDATE 
TO authenticated 
USING (true)
WITH CHECK (true);

-- Solo el usuario administrador autenticado puede ELIMINAR posts
CREATE POLICY "Admin puede borrar posts" 
ON public.posts 
FOR DELETE 
TO authenticated 
USING (true);

-- 3. Crear Storage Bucket para las imágenes del blog
INSERT INTO storage.buckets (id, name, public) 
VALUES ('blog-images', 'blog-images', true)
ON CONFLICT (id) DO NOTHING;

-- Políticas de Storage para el bucket blog-images:
DROP POLICY IF EXISTS "Acceso público a imágenes" ON storage.objects;
DROP POLICY IF EXISTS "Admin subida de imágenes" ON storage.objects;
DROP POLICY IF EXISTS "Admin actualización de imágenes" ON storage.objects;
DROP POLICY IF EXISTS "Admin borrado de imágenes" ON storage.objects;

-- 1. Lectura pública de imágenes
CREATE POLICY "Acceso público a imágenes" 
ON storage.objects 
FOR SELECT 
USING (bucket_id = 'blog-images');

-- 2. Subida de imágenes para usuario autenticado
CREATE POLICY "Admin subida de imágenes" 
ON storage.objects 
FOR INSERT 
TO authenticated 
WITH CHECK (bucket_id = 'blog-images');

-- 3. Actualización de imágenes para usuario autenticado
CREATE POLICY "Admin actualización de imágenes" 
ON storage.objects 
FOR UPDATE 
TO authenticated 
USING (bucket_id = 'blog-images')
WITH CHECK (bucket_id = 'blog-images');

-- 4. Eliminación de imágenes para usuario autenticado
CREATE POLICY "Admin borrado de imágenes" 
ON storage.objects 
FOR DELETE 
TO authenticated 
USING (bucket_id = 'blog-images');

-- 4. Datos de ejemplo iniciales (opcional)
INSERT INTO public.posts (title, slug, excerpt, content, cover_image, tags, is_published)
VALUES 
(
  'Bienvenido a mi Bitácora Técnica',
  'bienvenido-bitacora-tecnica',
  'Un espacio donde comparto arquitecturas cloud, experimentos en Kubernetes y reflexiones sobre computación de alto rendimiento.',
  '# ¡Hola mundo!\n\nEste es el nuevo espacio de mi portafolio donde publicaré avances sobre:\n\n- **Arquitecturas Cloud & DevOps:** Automatizaciones con Terraform, pipelines en GitLab CI y patrones de infraestructura.\n- **Kubernetes & Data Spaces:** Despliegues federados y soberanía digital europea.\n- **HPC (High Performance Computing):** Aprendizajes de mi Máster en la UPV sobre computación distribuida y paralela.\n\n¡Pronto más artículos detallados con código y diagramas!',
  'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=1200&q=80',
  ARRAY['Cloud', 'DevOps', 'Kubernetes'],
  true
)
ON CONFLICT (slug) DO NOTHING;
