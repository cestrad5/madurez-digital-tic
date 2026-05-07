import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { History as HistoryIcon, ArrowUpRight, Calendar, BarChart2 } from 'lucide-react';

const History = () => {
  const [assessments, setAssessments] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const list = [];
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key.startsWith('assessment_')) {
        list.push(JSON.parse(localStorage.getItem(key)));
      }
    }
    setAssessments(list.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)));
  }, []);

  return (
    <div className="container" style={{ padding: '4rem 0' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '3rem' }}>
        <HistoryIcon size={32} color="var(--color-primary)" />
        <h1>Historial de Diagnósticos</h1>
      </div>

      {assessments.length === 0 ? (
        <div className="glass" style={{ padding: '4rem', textAlign: 'center', borderRadius: 'var(--radius-lg)' }}>
          <BarChart2 size={64} opacity={0.2} style={{ marginBottom: '1.5rem' }} />
          <h3>Aún no ha realizado diagnósticos</h3>
          <p style={{ opacity: 0.6, marginBottom: '2rem' }}>Realice su primer autodiagnóstico para ver su progreso aquí.</p>
          <button 
            onClick={() => navigate('/assessment')}
            style={{ 
              background: 'var(--color-primary)', 
              color: 'white', 
              padding: '1rem 2.5rem', 
              borderRadius: 'var(--radius)', 
              fontWeight: 800 
            }}
          >
            Empezar Nuevo Diagnóstico
          </button>
        </div>
      ) : (
        <div style={{ display: 'grid', gap: '1.5rem' }}>
          {assessments.map(item => (
            <div key={item.id} className="glass" style={{ 
              padding: '1.5rem 2.5rem', 
              borderRadius: 'var(--radius)', 
              display: 'flex', 
              justifyContent: 'space-between', 
              alignItems: 'center',
              flexWrap: 'wrap',
              gap: '1.5rem'
            }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem', opacity: 0.6, fontSize: '0.85rem' }}>
                  <Calendar size={16} /> {new Date(item.createdAt).toLocaleDateString('es-ES', { day: 'numeric', month: 'long', year: 'numeric' })}
                </div>
                <div style={{ display: 'flex', alignItems: 'baseline', gap: '1rem' }}>
                  <span style={{ fontSize: '1.8rem', fontWeight: 800 }}>{item.results.total} / 100</span>
                  <span style={{ 
                    padding: '0.2rem 0.8rem', 
                    background: `var(--level-${item.results.levelInfo.level})`, 
                    color: 'white', 
                    borderRadius: '100px', 
                    fontSize: '0.75rem', 
                    fontWeight: 700 
                  }}>{item.results.levelInfo.name}</span>
                </div>
              </div>

              <div style={{ display: 'flex', gap: '1rem' }}>
                <button 
                  onClick={() => navigate(`/results/${item.id}`)}
                  style={{ 
                    background: 'var(--color-bg)', 
                    color: 'var(--color-text)', 
                    padding: '0.75rem 1.5rem', 
                    borderRadius: 'var(--radius)', 
                    fontWeight: 600,
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem'
                  }}
                >
                  Ver Resultados <ArrowUpRight size={18} />
                </button>
                <button 
                  onClick={() => navigate(`/roadmap/${item.id}`)}
                  style={{ 
                    background: 'var(--color-primary)', 
                    color: 'white', 
                    padding: '0.75rem 1.5rem', 
                    borderRadius: 'var(--radius)', 
                    fontWeight: 700 
                  }}
                >
                  Hoja de Ruta
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default History;
