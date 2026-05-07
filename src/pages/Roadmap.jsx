import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { generateRoadmap } from '../lib/roadmap';
import { Calendar, CheckCircle2, ChevronRight, Clock, Zap } from 'lucide-react';

const Roadmap = () => {
  const { id } = useParams();
  const [data, setData] = useState(null);
  const [roadmap, setRoadmap] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const saved = localStorage.getItem(`assessment_${id}`);
    if (saved) {
      const parsed = JSON.parse(saved);
      setData(parsed);
      setRoadmap(generateRoadmap(parsed.results));
    } else {
      navigate('/');
    }
  }, [id, navigate]);

  if (!roadmap) return null;

  const months = [
    { name: 'Mes 1', color: 'var(--color-primary)', actions: roadmap.month1 },
    { name: 'Mes 2', color: 'var(--color-accent)', actions: roadmap.month2 },
    { name: 'Mes 3', color: 'var(--color-text-muted)', actions: roadmap.month3 },
  ];

  return (
    <div className="container" style={{ padding: '4rem 0' }}>
      <div style={{ marginBottom: '4rem', textAlign: 'center' }}>
        <span style={{ color: 'var(--color-primary)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '1px' }}>Plan de Transformación Digital</span>
        <h1 style={{ fontSize: '3rem', marginTop: '1rem' }}>Su Ruta de 90 Días</h1>
        <p style={{ maxWidth: '600px', margin: '1rem auto', opacity: 0.7 }}>
          Acciones prioritarias diseñadas para elevar su nivel de madurez digital, enfocadas en {roadmap.priorities.length} dimensiones clave.
        </p>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '3rem' }}>
        {months.map((month, idx) => (
          <div key={idx} style={{ position: 'relative' }}>
            {/* Timeline Line */}
            {idx < months.length - 1 && (
              <div style={{ 
                position: 'absolute', 
                left: '25px', 
                top: '50px', 
                bottom: '-50px', 
                width: '2px', 
                background: 'var(--color-border)', 
                zIndex: -1 
              }}></div>
            )}

            <div style={{ display: 'flex', gap: '2rem', flexWrap: 'wrap' }}>
              <div style={{ 
                width: '50px', 
                height: '50px', 
                borderRadius: '50%', 
                background: month.color, 
                color: 'white', 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center',
                fontWeight: 800,
                fontSize: '1.2rem',
                flexShrink: 0,
                boxShadow: `0 0 20px ${month.color}44`
              }}>
                {idx + 1}
              </div>

              <div style={{ flex: 1, minWidth: '300px' }}>
                <h2 style={{ marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                  <Calendar size={24} color={month.color} /> {month.name}: Cimentación y Ejecución
                </h2>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.5rem' }}>
                  {month.actions.map((action, actionIdx) => (
                    <div key={actionIdx} className="glass" style={{ 
                      padding: '1.5rem', 
                      borderRadius: 'var(--radius)', 
                      borderTop: `4px solid ${month.color}`,
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '1rem'
                    }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                        <CheckCircle2 size={24} color={month.color} />
                        <div style={{ display: 'flex', gap: '0.5rem' }}>
                          <span style={{ fontSize: '0.7rem', padding: '0.2rem 0.5rem', background: 'rgba(76, 155, 47, 0.1)', color: 'var(--color-primary)', borderRadius: '4px', fontWeight: 700 }}>
                            IMPACTO ALTO
                          </span>
                        </div>
                      </div>
                      <p style={{ fontWeight: 600 }}>{action}</p>
                      <div style={{ marginTop: 'auto', display: 'flex', alignItems: 'center', gap: '0.5rem', opacity: 0.5, fontSize: '0.8rem' }}>
                        <Clock size={14} /> Duración estimada: 2 semanas
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="glass" style={{ marginTop: '6rem', padding: '3rem', borderRadius: 'var(--radius-lg)', textAlign: 'center' }}>
        <Zap size={48} color="var(--color-accent)" style={{ marginBottom: '1.5rem' }} />
        <h2>¿Necesita acompañamiento para ejecutar este plan?</h2>
        <p style={{ maxWidth: '700px', margin: '1rem auto 2.5rem auto', opacity: 0.7 }}>
          Como socio estratégico de SOFTLINE S.A., puede acceder a mentorías personalizadas para acelerar cada uno de estos hitos tecnológicos.
        </p>
        <button style={{
          background: 'var(--color-text)',
          color: 'white',
          padding: '1rem 2.5rem',
          borderRadius: 'var(--radius)',
          fontWeight: 700,
          fontSize: '1.1rem'
        }}>Solicitar Mentoría con Expertos</button>
      </div>
    </div>
  );
};

export default Roadmap;
