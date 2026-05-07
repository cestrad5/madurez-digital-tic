import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { generateRoadmap } from '../lib/roadmap';
import { Calendar, CheckCircle2, Clock, Zap, ArrowLeft } from 'lucide-react';

const Roadmap = () => {
  const { id } = useParams();
  const [roadmap, setRoadmap] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const saved = localStorage.getItem(`assessment_${id}`);
    if (saved) {
      const parsed = JSON.parse(saved);
      setRoadmap(generateRoadmap(parsed.results));
    } else {
      navigate('/');
    }
  }, [id, navigate]);

  if (!roadmap) return null;

  const months = [
    { name: 'Mes 1', color: '#4C9B2F', subtitle: 'Cimentación y Prioridades', actions: roadmap.month1 },
    { name: 'Mes 2', color: '#76B852', subtitle: 'Ejecución y Despliegue', actions: roadmap.month2 },
    { name: 'Mes 3', color: '#1A2E1A', subtitle: 'Optimización y Escala', actions: roadmap.month3 },
  ];

  return (
    <div className="container" style={{ padding: '4rem 0' }}>
      {/* Botón Volver */}
      <div 
        role="button"
        onClick={() => navigate(`/results/${id}`)}
        className="no-print"
        style={{ 
          display: 'inline-flex', 
          alignItems: 'center', 
          gap: '0.5rem', 
          color: '#6B7280', 
          fontWeight: 700, 
          marginBottom: '2rem', 
          cursor: 'pointer' 
        }}
      >
        <ArrowLeft size={18} /> Volver a resultados
      </div>

      <div style={{ marginBottom: '5rem', textAlign: 'center' }}>
        <span style={{ 
          color: '#4C9B2F', 
          fontWeight: 800, 
          textTransform: 'uppercase', 
          letterSpacing: '2px',
          fontSize: '0.9rem'
        }}>Ruta de Transformación Digital</span>
        <h1 style={{ fontSize: '3.5rem', marginTop: '1rem', color: '#1A2E1A', letterSpacing: '-1px' }}>Plan de Acción 90 Días</h1>
        <p style={{ maxWidth: '650px', margin: '1.5rem auto', color: '#4B5563', fontSize: '1.1rem', lineHeight: '1.7' }}>
          Basado en su diagnóstico, hemos priorizado estas {roadmap.priorities.length} áreas críticas para maximizar el ROI de su inversión tecnológica.
        </p>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '5rem' }}>
        {months.map((month, idx) => (
          <div key={idx} style={{ position: 'relative' }}>
            {/* Timeline Vertical Line */}
            {idx < months.length - 1 && (
              <div style={{ 
                position: 'absolute', 
                left: '28px', 
                top: '70px', 
                bottom: '-70px', 
                width: '3px', 
                background: '#F3F4F6', 
                zIndex: -1 
              }}></div>
            )}

            <div style={{ display: 'flex', gap: '3rem', flexWrap: 'wrap' }}>
              {/* Badge Mes */}
              <div style={{ 
                width: '60px', 
                height: '60px', 
                borderRadius: '18px', 
                background: month.color, 
                color: 'white', 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center',
                fontWeight: 900,
                fontSize: '1.4rem',
                flexShrink: 0,
                boxShadow: `0 10px 20px ${month.color}33`,
                border: '4px solid white'
              }}>
                {idx + 1}
              </div>

              <div style={{ flex: 1, minWidth: '300px' }}>
                <div style={{ marginBottom: '2.5rem' }}>
                  <h2 style={{ 
                    fontSize: '1.8rem', 
                    color: '#1A2E1A', 
                    display: 'flex', 
                    alignItems: 'center', 
                    gap: '0.75rem',
                    marginBottom: '0.25rem'
                  }}>
                    <Calendar size={28} color={month.color} strokeWidth={2.5} /> {month.name}
                  </h2>
                  <p style={{ color: month.color, fontWeight: 700, textTransform: 'uppercase', fontSize: '0.85rem' }}>
                    {month.subtitle}
                  </p>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '2rem' }}>
                  {month.actions.map((action, actionIdx) => (
                    <div key={actionIdx} style={{ 
                      padding: '2rem', 
                      background: 'white',
                      borderRadius: '20px', 
                      border: '1px solid #e5e7eb',
                      boxShadow: '0 4px 15px rgba(0,0,0,0.03)',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '1.25rem',
                      position: 'relative',
                      overflow: 'hidden'
                    }}>
                      <div style={{ position: 'absolute', left: 0, top: 0, bottom: 0, width: '6px', background: month.color }}></div>
                      
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <div style={{ 
                          width: '40px', 
                          height: '40px', 
                          borderRadius: '10px', 
                          background: `${month.color}11`, 
                          display: 'flex', 
                          alignItems: 'center', 
                          justifyContent: 'center' 
                        }}>
                          <CheckCircle2 size={22} color={month.color} />
                        </div>
                        <span style={{ 
                          fontSize: '0.7rem', 
                          padding: '0.3rem 0.75rem', 
                          background: '#ECFDF5', 
                          color: '#059669', 
                          borderRadius: '100px', 
                          fontWeight: 800,
                          letterSpacing: '0.5px'
                        }}>
                          IMPACTO ALTO
                        </span>
                      </div>
                      
                      <p style={{ 
                        fontWeight: 700, 
                        fontSize: '1.05rem', 
                        color: '#1F2937', 
                        lineHeight: '1.5' 
                      }}>{action}</p>
                      
                      <div style={{ 
                        marginTop: 'auto', 
                        display: 'flex', 
                        alignItems: 'center', 
                        gap: '0.5rem', 
                        color: '#9CA3AF', 
                        fontSize: '0.85rem',
                        fontWeight: 600
                      }}>
                        <Clock size={16} /> Inversión: 2-3 semanas
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Footer CTA */}
      <div style={{ 
        marginTop: '8rem', 
        padding: '4rem', 
        background: '#F9FAFB', 
        borderRadius: '32px', 
        textAlign: 'center',
        border: '1px solid #e5e7eb',
        position: 'relative'
      }}>
        <div style={{ 
          position: 'absolute',
          top: '-30px',
          left: '50%',
          transform: 'translateX(-50%)',
          width: '60px',
          height: '60px',
          background: '#76B852',
          borderRadius: '20px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: 'white',
          boxShadow: '0 10px 20px rgba(118,184,82,0.3)'
        }}>
          <Zap size={32} />
        </div>
        <h2 style={{ fontSize: '2.2rem', color: '#1A2E1A', marginBottom: '1rem' }}>¿Listo para ejecutar este plan?</h2>
        <p style={{ maxWidth: '750px', margin: '0 auto 3rem auto', color: '#4B5563', fontSize: '1.1rem', lineHeight: '1.7' }}>
          Como socio estratégico de **SOFTLINE S.A.**, puede acceder a nuestra red de consultores expertos para acelerar la implementación de cada hito técnico de este roadmap.
        </p>
        <div 
          role="button"
          style={{
            display: 'inline-block',
            background: '#1A2E1A',
            color: 'white',
            padding: '1.25rem 3rem',
            borderRadius: '16px',
            fontWeight: 800,
            fontSize: '1.2rem',
            cursor: 'pointer',
            transition: 'all 0.2s ease',
            boxShadow: '0 10px 25px rgba(0,0,0,0.15)'
          }}
        >
          Agendar Mentoría Técnica
        </div>
      </div>
    </div>
  );
};

export default Roadmap;
