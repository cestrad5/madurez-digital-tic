import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { generateRoadmap } from '../lib/roadmap';
import { Clock, Zap, ArrowLeft, Printer, Mail, CheckCircle2, Circle, Trophy } from 'lucide-react';

const PROGRESS_KEY = (id) => `roadmap_progress_${id}`;

const Roadmap = () => {
  const { id } = useParams();
  const [roadmap, setRoadmap] = useState(null);
  const [companyName, setCompanyName] = useState('');
  const [checked, setChecked] = useState({});
  const navigate = useNavigate();

  useEffect(() => {
    const saved = localStorage.getItem(`assessment_${id}`);
    if (!saved) { navigate('/'); return; }
    try {
      const parsed = JSON.parse(saved);
      if (!parsed?.results) { localStorage.removeItem(`assessment_${id}`); navigate('/'); return; }
      setCompanyName(parsed.companyInfo?.companyName || '');
      setRoadmap(generateRoadmap(parsed.results));
      const savedProgress = localStorage.getItem(PROGRESS_KEY(id));
      if (savedProgress) setChecked(JSON.parse(savedProgress));
    } catch {
      localStorage.removeItem(`assessment_${id}`);
      navigate('/');
    }
  }, [id, navigate]);

  const toggleCheck = (key) => {
    setChecked(prev => {
      const next = { ...prev, [key]: !prev[key] };
      try { localStorage.setItem(PROGRESS_KEY(id), JSON.stringify(next)); } catch { /* cuota */ }
      return next;
    });
  };

  if (!roadmap) return null;

  const months = [
    { name: 'Mes 1', color: '#4C9B2F', subtitle: 'Cimentación y Prioridades', actions: roadmap.month1 },
    { name: 'Mes 2', color: '#3a7a22', subtitle: 'Ejecución y Despliegue',    actions: roadmap.month2 },
    { name: 'Mes 3', color: '#1A2E1A', subtitle: 'Optimización y Escala',     actions: roadmap.month3 },
  ];

  const totalActions = months.reduce((s, m) => s + m.actions.length, 0);
  const completedActions = Object.values(checked).filter(Boolean).length;
  const progressPct = totalActions > 0 ? Math.round((completedActions / totalActions) * 100) : 0;

  return (
    <div className="container" style={{ paddingTop: '3rem', paddingBottom: '5rem', maxWidth: '1100px' }}>

      {/* Barra superior */}
      <div className="no-print" style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '3rem', flexWrap: 'wrap' }}>
        <button
          type="button"
          onClick={() => navigate(`/results/${id}`)}
          style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', color: 'var(--color-text-muted)', fontWeight: 700, cursor: 'pointer', background: 'none', border: 'none', padding: 0, font: 'inherit', transition: 'color 0.15s' }}
          onMouseEnter={e => { e.currentTarget.style.color = 'var(--color-text)'; }}
          onMouseLeave={e => { e.currentTarget.style.color = 'var(--color-text-muted)'; }}
        >
          <ArrowLeft size={16} /> Volver a resultados
        </button>
        <button
          type="button"
          onClick={() => window.print()}
          style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', color: '#374151', fontWeight: 700, cursor: 'pointer', background: 'white', border: '1px solid var(--color-border)', borderRadius: 'var(--radius)', padding: '0.5rem 1rem', font: 'inherit', marginLeft: 'auto' }}
        >
          <Printer size={15} /> Imprimir
        </button>
      </div>

      {/* Hero */}
      <div style={{ textAlign: 'center', marginBottom: '3.5rem' }}>
        <span style={{ color: 'var(--color-primary)', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '2px', fontSize: '0.8rem' }}>
          Ruta de Transformación Digital
        </span>
        <h1 style={{ marginTop: '0.75rem', marginBottom: '0.75rem', color: '#1A2E1A' }}>
          Plan de Acción <span style={{ color: 'var(--color-primary)' }}>90 Días</span>
        </h1>
        {companyName && (
          <p style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--color-primary)', marginBottom: '0.5rem' }}>{companyName}</p>
        )}
        <p style={{ maxWidth: '560px', margin: '0 auto', color: 'var(--color-text-muted)', fontSize: '1rem', lineHeight: '1.7' }}>
          {roadmap.priorities.length > 0
            ? `${roadmap.priorities.length} área${roadmap.priorities.length > 1 ? 's' : ''} crítica${roadmap.priorities.length > 1 ? 's' : ''} priorizadas · ${totalActions} acciones en 90 días`
            : `Madurez alta en todas las dimensiones · ${totalActions} acciones de excelencia`}
        </p>

        {/* Barra de progreso general */}
        {totalActions > 0 && (
          <div style={{ maxWidth: '400px', margin: '2rem auto 0', background: 'white', border: '1px solid #E5E7EB', borderRadius: 'var(--radius-lg)', padding: '1.25rem 1.5rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.6rem' }}>
              <span style={{ fontSize: '0.8rem', fontWeight: 700, color: '#374151' }}>Progreso del Plan</span>
              <span style={{ fontSize: '0.8rem', fontWeight: 800, color: 'var(--color-primary)' }}>{completedActions}/{totalActions} acciones</span>
            </div>
            <div style={{ background: '#F3F4F6', borderRadius: '100px', height: '8px' }}>
              <div style={{ width: `${progressPct}%`, height: '100%', background: 'var(--color-primary)', borderRadius: '100px', transition: 'width 0.4s ease' }} />
            </div>
            {completedActions === totalActions && totalActions > 0 && (
              <p style={{ marginTop: '0.6rem', fontSize: '0.78rem', fontWeight: 700, color: '#166534', textAlign: 'center' }}>
                <Trophy size={14} style={{ display: 'inline', marginRight: '0.3rem', verticalAlign: 'middle' }} /> ¡Plan completado!
              </p>
            )}
          </div>
        )}

        {/* Indicador de progreso de meses */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 0, maxWidth: '340px', margin: '2.5rem auto 0' }}>
          {months.map((m, i) => [
            <div key={`dot-${i}`} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.4rem' }}>
              <div style={{ width: '36px', height: '36px', borderRadius: '50%', background: m.color, color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 900, fontSize: '0.85rem', boxShadow: `0 4px 12px ${m.color}40` }}>
                {i + 1}
              </div>
              <span style={{ fontSize: '0.62rem', fontWeight: 800, color: m.color, textTransform: 'uppercase', letterSpacing: '0.5px', whiteSpace: 'nowrap' }}>
                {m.name}
              </span>
            </div>,
            i < months.length - 1 && (
              <div key={`line-${i}`} style={{ width: '80px', height: '2px', background: `linear-gradient(90deg, ${months[i].color}, ${months[i + 1].color})`, margin: '0 0.75rem', marginBottom: '1.3rem', flexShrink: 0 }} />
            )
          ])}
        </div>
      </div>

      {/* Secciones por mes */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '3.5rem' }}>
        {months.map((month, idx) => (
          <div key={idx}>

            {/* Header de mes */}
            <div style={{
              display: 'flex', alignItems: 'center', gap: '1.25rem',
              padding: '1.25rem 1.75rem',
              background: `${month.color}08`,
              borderRadius: 'var(--radius-lg)',
              border: `1px solid ${month.color}20`,
              borderLeft: `5px solid ${month.color}`,
              marginBottom: '1.5rem',
            }}>
              <div style={{ width: '46px', height: '46px', borderRadius: '50%', background: month.color, color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 900, fontSize: '1.2rem', flexShrink: 0, boxShadow: `0 6px 16px ${month.color}35` }}>
                {idx + 1}
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.2rem', flexWrap: 'wrap' }}>
                  <span style={{ fontSize: '0.7rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '1.5px', color: month.color }}>
                    {month.name}
                  </span>
                  <span className="badge" style={{ background: `${month.color}18`, color: month.color }}>
                    {month.actions.length} {month.actions.length === 1 ? 'acción' : 'acciones'}
                  </span>
                </div>
                <p style={{ fontWeight: 700, fontSize: '1.1rem', color: '#1A2E1A', margin: 0 }}>{month.subtitle}</p>
              </div>
            </div>

            {/* Grid de tarjetas */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(min(300px,100%), 1fr))', gap: '1rem' }}>
              {month.actions.map((action, actionIdx) => {
                const key = `${idx}-${actionIdx}`;
                const done = !!checked[key];
                const isAlto = action.impact === 'ALTO';
                const impactStyle = isAlto
                  ? { bg: '#ECFDF5', color: '#047857' }
                  : { bg: '#EFF6FF', color: '#1d4ed8' };
                return (
                  <div key={actionIdx} className="card-hover" style={{
                    background: done ? '#F9FFF6' : 'white',
                    borderRadius: 'var(--radius)',
                    border: `1px solid ${done ? '#BBF7D0' : '#E5E7EB'}`,
                    overflow: 'hidden',
                    display: 'flex', flexDirection: 'column',
                    boxShadow: '0 2px 8px rgba(0,0,0,0.03)',
                    opacity: done ? 0.75 : 1,
                    transition: 'all 0.2s ease'
                  }}>
                    <div style={{ height: '4px', background: done ? '#4C9B2F' : month.color }} />

                    <div style={{ padding: '1.25rem 1.5rem', display: 'flex', flexDirection: 'column', gap: '0.85rem', flex: 1 }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                        <span style={{ fontSize: '1.75rem', fontWeight: 900, color: `${month.color}30`, lineHeight: 1, fontFamily: 'var(--font-heading)' }}>
                          {String(actionIdx + 1).padStart(2, '0')}
                        </span>
                        <span className="badge" style={{ background: impactStyle.bg, color: impactStyle.color, fontWeight: 800 }}>
                          {isAlto ? '↑ ALTO' : '→ MEDIO'}
                        </span>
                      </div>

                      <p style={{ fontWeight: 600, fontSize: '0.95rem', color: done ? '#6B7280' : '#1F2937', lineHeight: '1.55', margin: 0, flex: 1, textDecoration: done ? 'line-through' : 'none' }}>
                        {action.text}
                      </p>

                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingTop: '0.75rem', borderTop: '1px solid #F3F4F6', marginTop: 'auto' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: 'var(--color-text-muted)', fontSize: '0.78rem', fontWeight: 600 }}>
                          <Clock size={13} color={month.color} /> {action.weeks}
                        </div>
                        <button
                          type="button"
                          onClick={() => toggleCheck(key)}
                          style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', background: 'none', border: 'none', cursor: 'pointer', fontSize: '0.78rem', fontWeight: 700, color: done ? '#166534' : 'var(--color-text-muted)', padding: '0.2rem 0' }}
                        >
                          {done
                            ? <><CheckCircle2 size={16} color="#4C9B2F" /> Completada</>
                            : <><Circle size={16} /> Marcar lista</>
                          }
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      {/* CTA Footer */}
      <div style={{ marginTop: '5rem', background: '#1A2E1A', borderRadius: 'var(--radius-lg)', overflow: 'hidden', position: 'relative' }}>
        {/* Decoración */}
        <div style={{ position: 'absolute', right: '-60px', top: '-60px', width: '220px', height: '220px', borderRadius: '50%', background: 'rgba(76,155,47,0.12)' }} />
        <div style={{ position: 'absolute', right: '40px', bottom: '-40px', width: '140px', height: '140px', borderRadius: '50%', background: 'rgba(76,155,47,0.08)' }} />

        <div style={{ position: 'relative', padding: '3.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '2rem' }}>
          <div style={{ maxWidth: '580px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem' }}>
              <div style={{ width: '42px', height: '42px', borderRadius: 'var(--radius)', background: 'rgba(76,155,47,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Zap size={22} color="#76B852" />
              </div>
              <h2 style={{ color: 'white', fontSize: '1.6rem', margin: 0 }}>¿Listo para ejecutar este plan?</h2>
            </div>
            <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: '1rem', lineHeight: '1.7', margin: 0 }}>
              Acceda a nuestra red de consultores expertos de <strong style={{ color: 'white' }}>Softline S.A.</strong> para acelerar cada hito técnico de este roadmap.
            </p>
          </div>
          <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
            <button
              type="button"
              className="btn-hover"
              onClick={() => window.open('mailto:gerencia@softline.com.co?subject=Solicitud%20de%20Mentoría%20Técnica&body=Hola%2C%20me%20gustaría%20agendar%20una%20mentoría%20técnica%20para%20implementar%20mi%20plan%20de%20acción%20de%2090%20días.%0A%0ATeléfono%20de%20contacto%3A%20%2B57%20310%20839%206929%20%2F%20604%20681%200044', '_blank')}
              style={{ display: 'inline-flex', alignItems: 'center', gap: '0.6rem', background: 'var(--color-primary)', color: 'white', padding: '1rem 2rem', borderRadius: 'var(--radius)', fontWeight: 800, fontSize: '1rem', cursor: 'pointer', border: 'none', boxShadow: '0 8px 20px rgba(0,0,0,0.25)', whiteSpace: 'nowrap' }}
            >
              <Mail size={18} /> Agendar Mentoría
            </button>
            <a
              href="tel:+573108396929"
              style={{ display: 'inline-flex', alignItems: 'center', gap: '0.6rem', background: 'rgba(255,255,255,0.1)', color: 'white', padding: '1rem 1.5rem', borderRadius: 'var(--radius)', fontWeight: 700, fontSize: '1rem', border: '1px solid rgba(255,255,255,0.2)', whiteSpace: 'nowrap', textDecoration: 'none' }}
            >
              +57 310 839 6929
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Roadmap;
