/**
 * CONFIGURACIÓN DE SUPABASE
 * Pega aquí tus credenciales de Supabase (Project Settings > API)
 * O configúralas directamente desde el panel de administración /admin.html
 */

const SUPABASE_CONFIG = {
  // Sustituye con tu Project URL de Supabase (ej: 'https://xyzcompany.supabase.co')
  url: window.localStorage.getItem('portfolio_supabase_url') || 'https://TU_PROYECTO.supabase.co',
  
  // Sustituye con tu 'anon' public API key de Supabase
  anonKey: window.localStorage.getItem('portfolio_supabase_key') || 'TU_SUPABASE_ANON_KEY'
};

// Inicializador seguro del cliente Supabase
let supabaseClient = null;

function getSupabaseClient() {
  if (supabaseClient) return supabaseClient;

  const url = window.localStorage.getItem('portfolio_supabase_url') || SUPABASE_CONFIG.url;
  const anonKey = window.localStorage.getItem('portfolio_supabase_key') || SUPABASE_CONFIG.anonKey;

  const isConfigured = url && !url.includes('TU_PROYECTO') && anonKey && !anonKey.includes('TU_SUPABASE');

  if (isConfigured && window.supabase && typeof window.supabase.createClient === 'function') {
    try {
      supabaseClient = window.supabase.createClient(url, anonKey);
      return supabaseClient;
    } catch (err) {
      console.warn('Error inicializando Supabase:', err);
    }
  }
  return null;
}

// Posts de respaldo en caso de que Supabase aún no esté vinculado
const MOCK_FALLBACK_POSTS = [
  {
    id: 'demo-1',
    title: 'Despliegues Sovereign Data Space en Kubernetes',
    slug: 'sovereign-data-space-k8s',
    excerpt: 'Cómo arquitectar entornos de validación seguros cumpliendo con las directivas europeas de soberanía de datos.',
    content: `# Despliegues Sovereign Data Space en Kubernetes\n\nEn la actualidad, los espacios de datos europeos demandan un estándar riguroso de interoperabilidad y control de acceso soberano.\n\n### Arquitectura de referencia\n\n1. **Conectores federados:** Desplegados como microservicios con ingress TLS mutuo (mTLS).\n2. **Infraestructura como Código:** Aprovisionamiento reproducible con Terraform sobre clústeres gestionados de Kubernetes (GKE).\n3. **Pipelines de Validación:** Tests automáticos integrados en GitLab CI/CD antes de promover cambios a producción.\n\n> La soberanía del dato no es solo una regulación, es una garantía de control criptográfico y arquitectónico.`,
    cover_image: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=1200&q=80',
    tags: ['Kubernetes', 'Data Spaces', 'GCP', 'DevOps'],
    is_published: true,
    created_at: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString()
  },
  {
    id: 'demo-2',
    title: 'Telemetría IoT en CPD de Misión Crítica',
    slug: 'telemetria-iot-data-center',
    excerpt: 'Integración física de climatización y ventilación en redes de monitorización continua con Zabbix y Grafana.',
    content: `# Telemetría IoT en CPD de Misión Crítica\n\nLa fiabilidad de un centro de datos no termina en los servidores; el entorno físico de climatización y ventilación es el verdadero corazón que previene cortes catastróficos.\n\n### Claves de implementación\n- Conexión vía Ethernet industrial y sondas SNMP.\n- Tableros en tiempo real con umbrales de alerta temprana en Zabbix.\n- Correlación de métricas de temperatura con cargas de CPU en racks de alto consumo.`,
    cover_image: 'https://images.unsplash.com/photo-1544197150-b99a580bb7a8?auto=format&fit=crop&w=1200&q=80',
    tags: ['Data Center', 'IoT', 'Zabbix', 'Hardware'],
    is_published: true,
    created_at: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString()
  }
];
