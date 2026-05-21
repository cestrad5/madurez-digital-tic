import { useNavigate } from 'react-router-dom';
import { ListChecks, BarChart3, FileText, ChevronRight, History } from 'lucide-react';
import { getScoreColor, readFromLocalStorage } from '../lib/utils';

const Landing = () => {
  const navigate = useNavigate();
  const isLoggedIn = !!localStorage.getItem('user');
  const user = (() => { try { return JSON.parse(localStorage.getItem('user') || 'null'); } catch { return null; } })();
  const handleStart = () => navigate(isLoggedIn ? '/assessment' : '/login');

  const userId = user?.uid || (user?.isDemo ? 'demo' : null);
  const allAssessments = readFromLocalStorage(userId).sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  const lastAssessment = allAssessments[0] || null;
  const hasHistory = allAssessments.length > 0;

  const previewDims = lastAssessment
    ? [
        { name: 'Estrategia', val: lastAssessment.results.D1 },
        { name: 'Tecnología', val: lastAssessment.results.D2 },
        { name: 'Talento',    val: lastAssessment.results.D3 },
        { name: 'Datos',      val: lastAssessment.results.D4 },
        { name: 'Cliente',    val: lastAssessment.results.D5 },
      ]
    : [
        { name: 'Estrategia', val: 80 },
        { name: 'Tecnología', val: 65 },
        { name: 'Talento',    val: 90 },
        { name: 'Datos',      val: 58 },
        { name: 'Cliente',    val: 74 },
      ];

  return (
    <div className="landing-page">
      {/* Hero Section */}
      <section style={{
        padding: '5rem 0',
        background: 'linear-gradient(135deg, var(--color-surface) 0%, var(--color-bg) 100%)',
        overflow: 'hidden',
        position: 'relative'
      }}>
        {/* Decorative elements */}
        <div style={{
          position: 'absolute',
          top: '-10%',
          right: '-5%',
          width: '400px',
          height: '400px',
          background: 'var(--color-primary)',
          filter: 'blur(150px)',
          opacity: 0.1,
          borderRadius: '50%'
        }}></div>

        <div className="container" style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
          alignItems: 'center',
          gap: '4rem',
          position: 'relative'
        }}>
          <div>
            <span style={{
              background: 'rgba(76, 155, 47, 0.1)',
              color: 'var(--color-primary)',
              padding: '0.5rem 1rem',
              borderRadius: '100px',
              fontSize: '0.85rem',
              fontWeight: 700,
              textTransform: 'uppercase',
              letterSpacing: '1px'
            }}>Reto UPB-SAPIENCIA 2026</span>

            <h1 style={{ fontSize: '3.5rem', lineHeight: 1.1, marginTop: '1.5rem', marginBottom: '1.5rem' }}>
              {hasHistory
                ? <>Bienvenido de vuelta{user?.name ? `, ${user.name.split(' ')[0]}` : ''} — <span style={{ color: 'var(--color-primary)' }}>siga evolucionando</span></>
                : <>Mida la <span style={{ color: 'var(--color-primary)' }}>Madurez Digital</span> de su empresa TIC</>
              }
            </h1>

            <p style={{ fontSize: '1.2rem', opacity: 0.8, marginBottom: '2.5rem', maxWidth: '500px' }}>
              {hasHistory
                ? `Tiene ${allAssessments.length} diagnóstico${allAssessments.length > 1 ? 's' : ''} registrado${allAssessments.length > 1 ? 's' : ''}. Realice uno nuevo para medir su evolución o revise su historial.`
                : 'Obtenga un diagnóstico preciso en 5 dimensiones, compárese con el benchmark regional y reciba una hoja de ruta de 90 días para evolucionar.'
              }
            </p>

            <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', alignItems: 'center' }}>
              <button
                type="button"
                className="btn-hover"
                onClick={handleStart}
                style={{ background: 'var(--color-primary)', color: 'white', padding: '1rem 2rem', borderRadius: 'var(--radius)', fontSize: '1.1rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.5rem', boxShadow: '0 10px 20px rgba(76, 155, 47, 0.2)', border: 'none', cursor: 'pointer' }}
              >
                {hasHistory ? 'Nuevo Diagnóstico' : 'Empezar Diagnóstico'} <ChevronRight size={20} />
              </button>
              {hasHistory ? (
                <button
                  type="button"
                  onClick={() => navigate('/history')}
                  style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', background: 'white', color: 'var(--color-text)', padding: '1rem 1.5rem', borderRadius: 'var(--radius)', fontSize: '1rem', fontWeight: 700, border: '1px solid var(--color-border)', cursor: 'pointer' }}
                >
                  <History size={18} /> Ver Historial
                </button>
              ) : (
                <p style={{ alignSelf: 'center', fontSize: '0.85rem', color: 'var(--color-text-muted)', fontWeight: 600, margin: 0 }}>
                  Gratis · Sin tarjeta · 10 minutos
                </p>
              )}
            </div>
          </div>

          <div style={{ position: 'relative' }}>
            <div className="glass" style={{
              padding: '2rem',
              borderRadius: 'var(--radius-lg)',
              boxShadow: 'var(--shadow-lg)',
              transform: 'rotate(2deg)'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                <h3 style={{ fontSize: '1.2rem' }}>Puntaje de Madurez</h3>
                <span style={{ color: 'var(--color-primary)', fontWeight: 800 }}>
                  {lastAssessment ? lastAssessment.results.total : 74} / 100
                </span>
              </div>
              <div style={{ marginBottom: '1rem' }}>
                {lastAssessment ? (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.2rem' }}>
                    {lastAssessment.companyInfo?.companyName && (
                      <span style={{ fontWeight: 800, fontSize: '0.85rem', color: '#1A2E1A' }}>{lastAssessment.companyInfo.companyName}</span>
                    )}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <span className="badge" style={{ color: '#166534', background: '#F0FDF4' }}>
                        {lastAssessment.results.levelInfo.name}
                      </span>
                      <span style={{ fontSize: '0.72rem', color: 'var(--color-text-muted)', fontWeight: 600 }}>
                        {new Date(lastAssessment.createdAt).toLocaleDateString('es-ES', { day: 'numeric', month: 'short', year: 'numeric' })}
                      </span>
                    </div>
                  </div>
                ) : (
                  <span className="badge" style={{ textTransform: 'uppercase', letterSpacing: '0.5px', color: 'var(--color-text-muted)', background: '#F3F4F6' }}>
                    Ejemplo ilustrativo
                  </span>
                )}
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
                {previewDims.map(stat => {
                  const color = getScoreColor(stat.val);
                  return (
                    <div key={stat.name}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.78rem', marginBottom: '0.35rem', fontWeight: 600 }}>
                        <span style={{ color: 'var(--color-text)' }}>{stat.name}</span>
                        <span style={{ color }}>{stat.val}%</span>
                      </div>
                      <div style={{ background: 'var(--color-bg)', height: '7px', borderRadius: '4px' }}>
                        <div style={{ background: color, width: `${stat.val}%`, height: '100%', borderRadius: '4px' }}></div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section style={{ padding: '6rem 0' }}>
        <div className="container">
          <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
            <h2>¿Cómo funciona el proceso?</h2>
            <p style={{ color: 'var(--color-text-muted)' }}>Tres pasos simples para transformar su empresa.</p>
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
            gap: '2.5rem'
          }}>
            {[
              {
                icon: <ListChecks size={40} color="var(--color-primary)" />,
                title: "1. Autodiagnóstico",
                desc: "Responda 30 preguntas clave en 5 dimensiones estratégicas del ecosistema TIC."
              },
              {
                icon: <BarChart3 size={40} color="var(--color-primary)" />,
                title: "2. Benchmarking",
                desc: "Vea su posición exacta respecto al promedio de empresas de su mismo tamaño y sub-sector."
              },
              {
                icon: <FileText size={40} color="var(--color-primary)" />,
                title: "3. Plan de Acción",
                desc: "Reciba una ruta de 90 días con tareas priorizadas por impacto y esfuerzo."
              }
            ].map((f, i) => (
              <div key={i} className="glass card-hover" style={{
                padding: '2.5rem',
                borderRadius: 'var(--radius)',
                textAlign: 'center'
              }}>
                <div style={{ marginBottom: '1.5rem', display: 'flex', justifyContent: 'center' }}>{f.icon}</div>
                <h3 style={{ marginBottom: '1rem' }}>{f.title}</h3>
                <p style={{ fontSize: '0.95rem', opacity: 0.8 }}>{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Social Proof Strip */}
      <section style={{ padding: '4rem 0', background: 'var(--color-surface)', borderTop: '1px solid var(--color-border)', borderBottom: '1px solid var(--color-border)' }}>
        <div className="container">
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '2rem', textAlign: 'center' }}>
            {[
              { value: '+3.500', label: 'Empresas TIC', sub: 'en Antioquia' },
              { value: '5', label: 'Dimensiones', sub: 'evaluadas en detalle' },
              { value: '90', label: 'Días de ruta', sub: 'plan concreto y priorizado' },
              { value: '100%', label: 'Gratuito', sub: 'sin tarjeta de crédito' },
            ].map((stat, i) => (
              <div key={i}>
                <div style={{ fontSize: '2.4rem', fontWeight: 900, color: 'var(--color-primary)', lineHeight: 1 }}>{stat.value}</div>
                <div style={{ fontWeight: 700, fontSize: '1rem', marginTop: '0.5rem' }}>{stat.label}</div>
                <div style={{ fontSize: '0.8rem', opacity: 0.5, marginTop: '0.2rem' }}>{stat.sub}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section style={{ padding: '6rem 0', background: 'var(--color-primary)', color: 'white' }}>
        <div className="container" style={{ textAlign: 'center' }}>
          <h2 style={{ color: 'white', fontSize: '2.5rem', marginBottom: '1.5rem' }}>
            ¿Listo para llevar su empresa al siguiente nivel?
          </h2>
          <p style={{ fontSize: '1.2rem', opacity: 0.9, maxWidth: '700px', margin: '0 auto 3rem auto' }}>
            Únase a las empresas de Antioquia que ya están midiendo su evolución digital de forma profesional y gratuita.
          </p>
          <button
            type="button"
            className="btn-hover"
            onClick={handleStart}
            style={{
              background: 'white',
              color: 'var(--color-primary)',
              padding: '1.25rem 3rem',
              borderRadius: 'var(--radius)',
              fontSize: '1.2rem',
              fontWeight: 800,
              boxShadow: '0 10px 30px rgba(0,0,0,0.1)',
              border: 'none',
              cursor: 'pointer'
            }}
          >
            {isLoggedIn ? 'Empezar nuevo diagnóstico' : 'Empezar con Google — es gratis'}
          </button>
        </div>
      </section>

    </div>
  );
};

export default Landing;
