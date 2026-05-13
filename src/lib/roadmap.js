export const ROADMAP_CONTENT = {
  D1: {
    1: { // Inicial
      month1: ["Definir una visión digital alineada con los objetivos de negocio.", "Identificar brechas tecnológicas críticas."],
      month2: ["Designar un líder de transformación digital.", "Evaluar presupuestos para proyectos piloto."],
      month3: ["Lanzar un proyecto digital de 'Quick Win' (ej: digitalización de un proceso manual)."]
    },
    2: { // Desarrollo
      month1: ["Formalizar el comité de innovación.", "Documentar el roadmap digital a 12 meses."],
      month2: ["Asignar presupuesto recurrente para I+D.", "Definir KPIs de éxito digital."],
      month3: ["Establecer alianzas con el ecosistema TIC (Ruta N, Gremios)."]
    },
    3: { // Definido
      month1: ["Revisar y actualizar el modelo de negocio hacia lo digital.", "Implementar metodologías de diseño centrado en el usuario."],
      month2: ["Escalar pilotos exitosos a otras áreas de la empresa.", "Capacitar a mandos medios en liderazgo digital."],
      month3: ["Medir el impacto financiero de las iniciativas digitales."]
    },
    4: { // Gestionado
      month1: ["Optimizar el portafolio de productos digitales.", "Implementar procesos de mejora continua automatizados."],
      month2: ["Fomentar la innovación abierta con startups.", "Refinar el modelo de gobernanza digital."],
      month3: ["Evaluar la expansión a nuevos mercados digitales."]
    }
  },
  D2: {
    1: {
      month1: ["Migrar correos y documentos básicos a la nube (SaaS).", "Instalar antivirus y firewalls básicos."],
      month2: ["Inventariar activos tecnológicos actuales.", "Evaluar la conectividad y hardware básico."],
      month3: ["Implementar copias de seguridad (backups) automáticas."]
    },
    2: {
      month1: ["Migrar servidores locales a la nube (IaaS/PaaS).", "Implementar doble factor de autenticación (2FA)."],
      month2: ["Adoptar herramientas de colaboración (Teams, Slack, ClickUp).", "Documentar políticas de seguridad de la información."],
      month3: ["Evaluar la arquitectura de software actual."]
    },
    3: {
      month1: ["Migrar hacia arquitectura de APIs o microservicios.", "Implementar un pipeline CI/CD básico (GitHub Actions, GitLab CI)."],
      month2: ["Adoptar contenedores (Docker) para despliegues reproducibles.", "Establecer monitoreo de infraestructura en tiempo real (Grafana, Datadog)."],
      month3: ["Realizar una auditoría de seguridad externa.", "Implementar políticas de acceso basadas en Zero Trust."]
    }
  },
  D3: {
    1: {
      month1: ["Sensibilizar al equipo sobre la importancia de lo digital.", "Identificar 'campeones digitales' internos."],
      month2: ["Realizar un diagnóstico de habilidades digitales del personal.", "Lanzar talleres básicos de herramientas de oficina digital."],
      month3: ["Comunicar los beneficios de la transformación digital."]
    },
    2: {
      month1: ["Crear un plan de capacitación digital diferenciado por roles.", "Adoptar una plataforma LMS para formación interna (Moodle, TalentLMS)."],
      month2: ["Formalizar la función de gestión del talento digital.", "Establecer metas de upskilling medibles por área."],
      month3: ["Diseñar rutas de aprendizaje para perfiles técnicos clave."]
    },
    3: {
      month1: ["Implementar una estrategia de atracción de talento digital.", "Crear un programa de mentoría interna entre perfiles senior y junior."],
      month2: ["Medir el índice de adopción digital por área.", "Vincular competencias digitales a las evaluaciones de desempeño."],
      month3: ["Desarrollar un programa de certificaciones técnicas para el equipo."]
    }
  },
  D4: {
    1: {
      month1: ["Identificar las fuentes de datos principales del negocio.", "Centralizar datos en hojas de cálculo compartidas."],
      month2: ["Definir los 5 indicadores (KPIs) más importantes.", "Empezar a medir manualmente el desempeño diario."],
      month3: ["Crear un tablero de control (Dashboard) simple en Excel/Sheets."]
    },
    2: {
      month1: ["Implementar un CRM o ERP básico para centralizar datos operativos.", "Estructurar los datos en una base de datos relacional."],
      month2: ["Establecer procesos de limpieza y validación de calidad de datos.", "Automatizar la recopilación de datos operativos clave."],
      month3: ["Generar reportes automáticos semanales para la dirección."]
    },
    3: {
      month1: ["Implementar una plataforma de Business Intelligence (Power BI, Looker Studio).", "Definir una arquitectura de datos empresarial documentada."],
      month2: ["Capacitar al equipo en análisis de datos básico.", "Integrar fuentes de datos externas al dashboard central."],
      month3: ["Desarrollar modelos predictivos simples para ventas o demanda."]
    }
  },
  D5: {
    1: {
      month1: ["Asegurar que el sitio web sea responsive (móvil).", "Habilitar un canal de WhatsApp Business."],
      month2: ["Crear una base de datos básica de clientes.", "Solicitar feedback manual a los clientes actuales."],
      month3: ["Estandarizar la comunicación en redes sociales."]
    },
    2: {
      month1: ["Implementar un sistema de tickets o soporte en línea (Freshdesk, Zendesk).", "Mapear el customer journey digital completo."],
      month2: ["Activar campañas de email marketing automatizadas.", "Integrar un sistema de valoraciones y reseñas."],
      month3: ["Definir métricas de experiencia del cliente (NPS, CSAT, CES)."]
    },
    3: {
      month1: ["Personalizar la experiencia digital mediante segmentación de clientes.", "Implementar un chatbot de atención básica en web y WhatsApp."],
      month2: ["Crear un programa de fidelización digital.", "Integrar omnicanalidad (web, app móvil, WhatsApp, redes sociales)."],
      month3: ["Analizar el comportamiento del cliente con analítica web (GA4, Hotjar)."]
    }
  }
};

// Fallback para niveles superiores o faltantes
const DEFAULT_ACTIONS = ["Continuar monitoreando KPIs.", "Mantener la cultura de innovación.", "Explorar tendencias emergentes (IA, Web3)."];

export function generateRoadmap(scores) {
  const roadmap = {
    month1: [],
    month2: [],
    month3: [],
    priorities: []
  };

  // Identificar dimensiones con score bajo (< 60)
  const dimsToImprove = Object.entries(scores)
    .filter(([key, val]) => key.startsWith('D') && val < 70)
    .sort((a, b) => a[1] - b[1]);

  roadmap.priorities = dimsToImprove.map(d => d[0]);

  dimsToImprove.forEach(([dimId, score]) => {
    const level = Math.max(1, Math.floor(score / 25) + 1);
    const content = ROADMAP_CONTENT[dimId]?.[level] || { month1: DEFAULT_ACTIONS, month2: DEFAULT_ACTIONS, month3: DEFAULT_ACTIONS };
    
    roadmap.month1.push(...(content.month1 || []));
    roadmap.month2.push(...(content.month2 || []));
    roadmap.month3.push(...(content.month3 || []));
  });

  // Limitar a top acciones por mes
  roadmap.month1 = roadmap.month1.slice(0, 4);
  roadmap.month2 = roadmap.month2.slice(0, 4);
  roadmap.month3 = roadmap.month3.slice(0, 4);

  return roadmap;
}
