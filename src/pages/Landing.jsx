import { useNavigate } from 'react-router-dom';
import { Rocket, BarChart3, ListChecks, FileText, ChevronRight } from 'lucide-react';

const Landing = () => {
  const navigate = useNavigate();

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
            
            <h1 style={{
              fontSize: '3.5rem',
              lineHeight: 1.1,
              marginTop: '1.5rem',
              marginBottom: '1.5rem'
            }}>
              Mida la <span style={{ color: 'var(--color-primary)' }}>Madurez Digital</span> de su empresa TIC
            </h1>
            
            <p style={{
              fontSize: '1.2rem',
              opacity: 0.8,
              marginBottom: '2.5rem',
              maxWidth: '500px'
            }}>
              Obtenga un diagnóstico preciso en 5 dimensiones, compárese con el benchmark regional y reciba una hoja de ruta de 90 días para evolucionar.
            </p>

            <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
              <button 
                onClick={() => navigate('/assessment')}
                style={{
                  background: 'var(--color-primary)',
                  color: 'white',
                  padding: '1rem 2rem',
                  borderRadius: 'var(--radius)',
                  fontSize: '1.1rem',
                  fontWeight: 700,
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  boxShadow: '0 10px 20px rgba(76, 155, 47, 0.2)'
                }}
              >
                Empezar Diagnóstico <ChevronRight size={20} />
              </button>
              <button 
                onClick={() => navigate('/login')}
                style={{
                  background: 'white',
                  color: 'var(--color-text)',
                  padding: '1rem 2rem',
                  borderRadius: 'var(--radius)',
                  fontSize: '1.1rem',
                  fontWeight: 700,
                  border: '1px solid var(--color-border)'
                }}
              >
                Iniciar Sesión
              </button>
            </div>
          </div>

          <div style={{ position: 'relative' }}>
            <div className="glass" style={{
              padding: '2rem',
              borderRadius: 'var(--radius-lg)',
              boxShadow: 'var(--shadow-lg)',
              transform: 'rotate(2deg)'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
                <h3 style={{ fontSize: '1.2rem' }}>Puntaje de Madurez</h3>
                <span style={{ color: 'var(--color-primary)', fontWeight: 800 }}>74 / 100</span>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {[
                  { name: 'Estrategia', val: 80 },
                  { name: 'Tecnología', val: 65 },
                  { name: 'Cultura', val: 90 },
                ].map(stat => (
                  <div key={stat.name}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', marginBottom: '0.4rem' }}>
                      <span>{stat.name}</span>
                      <span>{stat.val}%</span>
                    </div>
                    <div style={{ background: 'var(--color-bg)', height: '8px', borderRadius: '4px' }}>
                      <div style={{ background: 'var(--color-primary)', width: `${stat.val}%`, height: '100%', borderRadius: '4px' }}></div>
                    </div>
                  </div>
                ))}
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
            <p style={{ opacity: 0.6 }}>Tres pasos simples para transformar su empresa.</p>
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
              <div key={i} className="glass" style={{
                padding: '2.5rem',
                borderRadius: 'var(--radius)',
                textAlign: 'center',
                transition: 'var(--transition)'
              }}>
                <div style={{ marginBottom: '1.5rem', display: 'flex', justifyContent: 'center' }}>{f.icon}</div>
                <h3 style={{ marginBottom: '1rem' }}>{f.title}</h3>
                <p style={{ fontSize: '0.95rem', opacity: 0.8 }}>{f.desc}</p>
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
          <p style={{ fontSize: '1.2rem', marginBottom: '3rem', opacity: 0.9, maxWidth: '700px', margin: '0 auto 3rem auto' }}>
            Únase a las empresas de Antioquia que ya están midiendo su evolución digital de forma profesional y gratuita.
          </p>
          <button 
            onClick={() => navigate('/assessment')}
            style={{
              background: 'white',
              color: 'var(--color-primary)',
              padding: '1.25rem 3rem',
              borderRadius: 'var(--radius)',
              fontSize: '1.2rem',
              fontWeight: 800,
              boxShadow: '0 10px 30px rgba(0,0,0,0.1)'
            }}
          >
            Registrarse y Empezar Ahora
          </button>
        </div>
      </section>

      <style>{`
        @media (max-width: 768px) {
          h1 { fontSize: 2.5rem !important; }
        }
      `}</style>
    </div>
  );
};

export default Landing;
