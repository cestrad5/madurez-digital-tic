// Cada acción tiene: text, impact ('ALTO'|'MEDIO'), weeks (string)
export const ROADMAP_CONTENT = {
  D1: {
    1: {
      month1: [
        { text: "Definir una visión digital alineada con los objetivos de negocio.", impact: 'ALTO', weeks: '1-2 semanas' },
        { text: "Identificar brechas tecnológicas críticas mediante un inventario rápido.", impact: 'ALTO', weeks: '1-2 semanas' },
      ],
      month2: [
        { text: "Designar un líder de transformación digital con responsabilidades claras.", impact: 'ALTO', weeks: '1 semana' },
        { text: "Evaluar presupuestos disponibles para proyectos piloto.", impact: 'MEDIO', weeks: '2-3 semanas' },
      ],
      month3: [
        { text: "Lanzar un proyecto digital de 'Quick Win' (ej: digitalizar un proceso manual).", impact: 'ALTO', weeks: '3-4 semanas' },
      ]
    },
    2: {
      month1: [
        { text: "Formalizar el comité de innovación con reuniones mensuales.", impact: 'MEDIO', weeks: '1-2 semanas' },
        { text: "Documentar el roadmap digital a 12 meses con hitos medibles.", impact: 'ALTO', weeks: '2-3 semanas' },
      ],
      month2: [
        { text: "Asignar presupuesto recurrente para I+D (mínimo 5% de ingresos).", impact: 'ALTO', weeks: '2-3 semanas' },
        { text: "Definir KPIs de éxito digital por área de negocio.", impact: 'MEDIO', weeks: '1-2 semanas' },
      ],
      month3: [
        { text: "Establecer alianzas con el ecosistema TIC regional (Ruta N, Gremios).", impact: 'MEDIO', weeks: '3-4 semanas' },
      ]
    },
    3: {
      month1: [
        { text: "Revisar y actualizar el modelo de negocio hacia una propuesta de valor digital.", impact: 'ALTO', weeks: '3-4 semanas' },
        { text: "Implementar metodologías de diseño centrado en el usuario (Design Thinking).", impact: 'MEDIO', weeks: '2-3 semanas' },
      ],
      month2: [
        { text: "Escalar pilotos exitosos a otras áreas de la empresa.", impact: 'ALTO', weeks: '3-4 semanas' },
        { text: "Capacitar a mandos medios en liderazgo digital.", impact: 'MEDIO', weeks: '2-3 semanas' },
      ],
      month3: [
        { text: "Medir el impacto financiero de las iniciativas digitales.", impact: 'ALTO', weeks: '1-2 semanas' },
      ]
    },
    4: {
      month1: [
        { text: "Optimizar el portafolio de productos digitales según ROI.", impact: 'ALTO', weeks: '3-4 semanas' },
        { text: "Implementar procesos de mejora continua automatizados.", impact: 'ALTO', weeks: '4-6 semanas' },
      ],
      month2: [
        { text: "Fomentar la innovación abierta con startups del ecosistema.", impact: 'MEDIO', weeks: '2-3 semanas' },
        { text: "Refinar el modelo de gobernanza digital.", impact: 'MEDIO', weeks: '2-3 semanas' },
      ],
      month3: [
        { text: "Evaluar la expansión a nuevos mercados digitales.", impact: 'ALTO', weeks: '4-6 semanas' },
      ]
    }
  },
  D2: {
    1: {
      month1: [
        { text: "Migrar correos y documentos a la nube (Google Workspace o Microsoft 365).", impact: 'ALTO', weeks: '2-3 semanas' },
        { text: "Instalar soluciones de antivirus y firewall gestionados.", impact: 'ALTO', weeks: '1-2 semanas' },
      ],
      month2: [
        { text: "Inventariar activos tecnológicos actuales (hardware, software, licencias).", impact: 'MEDIO', weeks: '1-2 semanas' },
        { text: "Evaluar la conectividad y estado del hardware crítico.", impact: 'MEDIO', weeks: '1-2 semanas' },
      ],
      month3: [
        { text: "Implementar copias de seguridad automáticas con política 3-2-1.", impact: 'ALTO', weeks: '1-2 semanas' },
      ]
    },
    2: {
      month1: [
        { text: "Migrar servidores locales a infraestructura en la nube (IaaS/PaaS).", impact: 'ALTO', weeks: '4-6 semanas' },
        { text: "Implementar autenticación de doble factor (2FA) en todos los accesos.", impact: 'ALTO', weeks: '1-2 semanas' },
      ],
      month2: [
        { text: "Adoptar herramientas de colaboración remota (Teams, Slack, ClickUp).", impact: 'MEDIO', weeks: '2-3 semanas' },
        { text: "Documentar y publicar las políticas de seguridad de la información.", impact: 'MEDIO', weeks: '2-3 semanas' },
      ],
      month3: [
        { text: "Evaluar y documentar la arquitectura de software actual.", impact: 'MEDIO', weeks: '2-3 semanas' },
      ]
    },
    3: {
      month1: [
        { text: "Migrar hacia arquitectura de APIs o microservicios desacoplados.", impact: 'ALTO', weeks: '4-6 semanas' },
        { text: "Implementar un pipeline CI/CD básico (GitHub Actions, GitLab CI).", impact: 'ALTO', weeks: '3-4 semanas' },
      ],
      month2: [
        { text: "Adoptar contenedores Docker para despliegues reproducibles.", impact: 'ALTO', weeks: '3-4 semanas' },
        { text: "Establecer monitoreo de infraestructura en tiempo real (Grafana, Datadog).", impact: 'ALTO', weeks: '2-3 semanas' },
      ],
      month3: [
        { text: "Realizar una auditoría de seguridad externa (pentesting).", impact: 'ALTO', weeks: '3-4 semanas' },
        { text: "Implementar políticas de acceso Zero Trust.", impact: 'MEDIO', weeks: '3-4 semanas' },
      ]
    }
  },
  D3: {
    1: {
      month1: [
        { text: "Sensibilizar al equipo sobre la importancia de lo digital con talleres internos.", impact: 'MEDIO', weeks: '1-2 semanas' },
        { text: "Identificar 'campeones digitales' en cada área.", impact: 'ALTO', weeks: '1 semana' },
      ],
      month2: [
        { text: "Realizar un diagnóstico de habilidades digitales del personal.", impact: 'ALTO', weeks: '2-3 semanas' },
        { text: "Lanzar talleres básicos de herramientas de oficina digital.", impact: 'MEDIO', weeks: '2-3 semanas' },
      ],
      month3: [
        { text: "Comunicar internamente los beneficios y avances de la transformación digital.", impact: 'MEDIO', weeks: '1-2 semanas' },
      ]
    },
    2: {
      month1: [
        { text: "Crear un plan de capacitación digital diferenciado por roles.", impact: 'ALTO', weeks: '2-3 semanas' },
        { text: "Adoptar una plataforma LMS para formación interna (Moodle, TalentLMS).", impact: 'MEDIO', weeks: '3-4 semanas' },
      ],
      month2: [
        { text: "Formalizar la función de gestión del talento digital (responsable dedicado).", impact: 'ALTO', weeks: '1-2 semanas' },
        { text: "Establecer metas de upskilling medibles por área (horas, certificaciones).", impact: 'MEDIO', weeks: '1-2 semanas' },
      ],
      month3: [
        { text: "Diseñar rutas de aprendizaje para perfiles técnicos clave (developers, analistas).", impact: 'ALTO', weeks: '3-4 semanas' },
      ]
    },
    3: {
      month1: [
        { text: "Implementar una estrategia de atracción de talento digital.", impact: 'ALTO', weeks: '4-6 semanas' },
        { text: "Crear un programa de mentoría entre perfiles senior y junior.", impact: 'ALTO', weeks: '2-3 semanas' },
      ],
      month2: [
        { text: "Medir el índice de adopción digital por área con encuestas periódicas.", impact: 'MEDIO', weeks: '1-2 semanas' },
        { text: "Vincular competencias digitales a las evaluaciones de desempeño.", impact: 'ALTO', weeks: '2-3 semanas' },
      ],
      month3: [
        { text: "Desarrollar un programa de certificaciones técnicas (AWS, Google, Azure).", impact: 'ALTO', weeks: '4-6 semanas' },
      ]
    }
  },
  D4: {
    1: {
      month1: [
        { text: "Identificar y documentar las fuentes de datos principales del negocio.", impact: 'ALTO', weeks: '1-2 semanas' },
        { text: "Centralizar datos operativos en hojas de cálculo compartidas en la nube.", impact: 'MEDIO', weeks: '1-2 semanas' },
      ],
      month2: [
        { text: "Definir los 5 KPIs más importantes para la dirección.", impact: 'ALTO', weeks: '1-2 semanas' },
        { text: "Empezar a medir y registrar el desempeño diario manualmente.", impact: 'MEDIO', weeks: '2-3 semanas' },
      ],
      month3: [
        { text: "Crear un tablero de control (Dashboard) básico en Google Sheets o Excel.", impact: 'ALTO', weeks: '2-3 semanas' },
      ]
    },
    2: {
      month1: [
        { text: "Implementar un CRM o ERP básico para centralizar datos operativos.", impact: 'ALTO', weeks: '4-6 semanas' },
        { text: "Estructurar los datos en una base de datos relacional documentada.", impact: 'ALTO', weeks: '3-4 semanas' },
      ],
      month2: [
        { text: "Establecer procesos de limpieza y validación de calidad de datos.", impact: 'MEDIO', weeks: '2-3 semanas' },
        { text: "Automatizar la recopilación de datos operativos clave.", impact: 'ALTO', weeks: '3-4 semanas' },
      ],
      month3: [
        { text: "Generar reportes automáticos semanales para la dirección.", impact: 'ALTO', weeks: '2-3 semanas' },
      ]
    },
    3: {
      month1: [
        { text: "Implementar una plataforma de Business Intelligence (Power BI, Looker Studio).", impact: 'ALTO', weeks: '4-6 semanas' },
        { text: "Definir y documentar la arquitectura de datos empresarial.", impact: 'MEDIO', weeks: '2-3 semanas' },
      ],
      month2: [
        { text: "Capacitar al equipo en análisis y visualización de datos.", impact: 'MEDIO', weeks: '3-4 semanas' },
        { text: "Integrar fuentes de datos externas al dashboard central.", impact: 'ALTO', weeks: '3-4 semanas' },
      ],
      month3: [
        { text: "Desarrollar modelos predictivos simples para ventas o demanda.", impact: 'ALTO', weeks: '4-6 semanas' },
      ]
    }
  },
  D5: {
    1: {
      month1: [
        { text: "Asegurar que el sitio web sea completamente responsive en móvil.", impact: 'ALTO', weeks: '1-2 semanas' },
        { text: "Habilitar un canal oficial de atención por WhatsApp Business.", impact: 'ALTO', weeks: '1 semana' },
      ],
      month2: [
        { text: "Crear una base de datos básica de clientes (CRM simple).", impact: 'ALTO', weeks: '2-3 semanas' },
        { text: "Solicitar feedback sistemático a los clientes actuales.", impact: 'MEDIO', weeks: '1-2 semanas' },
      ],
      month3: [
        { text: "Estandarizar la comunicación y frecuencia en redes sociales.", impact: 'MEDIO', weeks: '1-2 semanas' },
      ]
    },
    2: {
      month1: [
        { text: "Implementar un sistema de tickets o soporte en línea (Freshdesk, Zendesk).", impact: 'ALTO', weeks: '3-4 semanas' },
        { text: "Mapear el customer journey digital completo.", impact: 'ALTO', weeks: '2-3 semanas' },
      ],
      month2: [
        { text: "Activar campañas de email marketing automatizadas (Mailchimp, Brevo).", impact: 'MEDIO', weeks: '2-3 semanas' },
        { text: "Integrar un sistema de valoraciones y reseñas en el sitio.", impact: 'MEDIO', weeks: '1-2 semanas' },
      ],
      month3: [
        { text: "Definir métricas de experiencia del cliente (NPS, CSAT, CES) y medirlas.", impact: 'ALTO', weeks: '2-3 semanas' },
      ]
    },
    3: {
      month1: [
        { text: "Personalizar la experiencia digital mediante segmentación avanzada de clientes.", impact: 'ALTO', weeks: '3-4 semanas' },
        { text: "Implementar un chatbot de atención básica en web y WhatsApp.", impact: 'ALTO', weeks: '4-6 semanas' },
      ],
      month2: [
        { text: "Crear un programa de fidelización digital con incentivos medibles.", impact: 'ALTO', weeks: '3-4 semanas' },
        { text: "Integrar omnicanalidad (web, app móvil, WhatsApp, redes sociales).", impact: 'ALTO', weeks: '4-6 semanas' },
      ],
      month3: [
        { text: "Analizar comportamiento del cliente con analítica web avanzada (GA4, Hotjar).", impact: 'MEDIO', weeks: '2-3 semanas' },
      ]
    }
  }
};

export function generateRoadmap(scores) {
  const roadmap = { month1: [], month2: [], month3: [], priorities: [] };

  const dimsToImprove = Object.entries(scores)
    .filter(([key, val]) => key.startsWith('D') && val < 70)
    .sort((a, b) => a[1] - b[1]);

  roadmap.priorities = dimsToImprove.map(d => d[0]);

  if (dimsToImprove.length === 0) {
    return {
      month1: [
        { text: "Explorar adopción de Inteligencia Artificial en procesos clave del negocio.", impact: 'ALTO', weeks: '4-6 semanas' },
        { text: "Evaluar expansión a nuevos mercados digitales regionales o internacionales.", impact: 'ALTO', weeks: '4-6 semanas' },
      ],
      month2: [
        { text: "Implementar un programa de innovación abierta con startups del ecosistema TIC.", impact: 'MEDIO', weeks: '3-4 semanas' },
        { text: "Certificar procesos en estándares internacionales (ISO 27001, CMMI, SOC 2).", impact: 'ALTO', weeks: '4-6 semanas' },
      ],
      month3: [
        { text: "Desarrollar un programa de mentoría hacia otras empresas del sector.", impact: 'MEDIO', weeks: '3-4 semanas' },
        { text: "Publicar casos de éxito para posicionamiento como referente regional.", impact: 'MEDIO', weeks: '2-3 semanas' },
      ],
      priorities: []
    };
  }

  dimsToImprove.forEach(([dimId, score]) => {
    const level = Math.max(1, Math.floor(score / 25) + 1);
    const content = ROADMAP_CONTENT[dimId]?.[level];
    if (!content) return;
    roadmap.month1.push(...(content.month1 || []));
    roadmap.month2.push(...(content.month2 || []));
    roadmap.month3.push(...(content.month3 || []));
  });

  roadmap.month1 = roadmap.month1.slice(0, 4);
  roadmap.month2 = roadmap.month2.slice(0, 4);
  roadmap.month3 = roadmap.month3.slice(0, 4);

  return roadmap;
}
