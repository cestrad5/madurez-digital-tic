import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, Legend, PolarRadiusAxis } from 'recharts';
import { getLevelInfo } from '../lib/scoring';
import { getBenchmarkForCompany } from '../lib/benchmark';
import { FileDown, ArrowRight, Award, TrendingUp, Target } from 'lucide-react';

const Results = () => {
  const { id } = useParams();
  const [data, setData] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const saved = localStorage.getItem(`assessment_${id}`);
    if (saved) {
      setData(JSON.parse(saved));
    } else {
      navigate('/');
    }
  }, [id, navigate]);

  if (!data) return null;

  const { results } = data;
  const benchmark = getBenchmarkForCompany('desarrollo_sw', 'pequena'); // Hardcoded para demo

  const chartData = [
    { subject: 'Estrategia', A: results.D1, B: benchmark.D1, fullMark: 100 },
    { subject: 'Tecnología', A: results.D2, B: benchmark.D2, fullMark: 100 },
    { subject: 'Talento', A: results.D3, B: benchmark.D3, fullMark: 100 },
    { subject: 'Datos', A: results.D4, B: benchmark.D4, fullMark: 100 },
    { subject: 'Cliente', A: results.D5, B: benchmark.D5, fullMark: 100 },
  ];

  const barData = [
    { name: 'Su Empresa', score: results.total },
    { name: 'Benchmark', score: benchmark.total },
  ];

  return (
    <div className="container" style={{ padding: '4rem 0' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '3rem', flexWrap: 'wrap', gap: '1.5rem' }}>
        <div>
          <h1 style={{ fontSize: '2.5rem' }}>Resultados del Diagnóstico</h1>
          <p style={{ opacity: 0.6 }}>Generado el {new Date(data.createdAt).toLocaleDateString()}</p>
        </div>
        <div
          role="button"
          tabIndex={0}
          className="glass"
          style={{ padding: '0.75rem 1.5rem', borderRadius: 'var(--radius)', display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 600, cursor: 'pointer', background: 'white', color: '#374151', border: '1px solid #E5E7EB' }}
        >
          📄 Exportar Reporte PDF
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem', marginBottom: '4rem' }}>
        {/* Main Score Card */}
        <div className="glass" style={{ padding: '2.5rem', borderRadius: 'var(--radius-lg)', textAlign: 'center', borderTop: `8px solid var(--level-${results.levelInfo.level})` }}>
          <p style={{ textTransform: 'uppercase', fontSize: '0.85rem', fontWeight: 800, opacity: 0.6, letterSpacing: '1px' }}>Madurez Digital Total</p>
          <div style={{ fontSize: '5rem', fontWeight: 900, color: `var(--level-${results.levelInfo.level})`, lineHeight: 1 }}>
            {results.total}<span style={{ fontSize: '1.5rem', opacity: 0.3 }}>/100</span>
          </div>
          <div style={{ marginTop: '1.5rem' }}>
            <span style={{ 
              padding: '0.5rem 1.5rem', 
              background: `var(--level-${results.levelInfo.level})`, 
              color: 'white', 
              borderRadius: '100px',
              fontWeight: 700,
              fontSize: '1.1rem'
            }}>Nivel {results.levelInfo.level}: {results.levelInfo.name}</span>
          </div>
          <p style={{ marginTop: '2rem', fontSize: '1rem', opacity: 0.8 }}>{results.levelInfo.description}</p>
        </div>

        {/* Charts Card */}
        <div className="glass" style={{ padding: '2rem', borderRadius: 'var(--radius-lg)', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <h3 style={{ marginBottom: '1.5rem', fontSize: '1.1rem' }}>Comparativa por Dimensión</h3>
          <div style={{ width: '100%', height: '300px' }}>
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart cx="50%" cy="50%" outerRadius="80%" data={chartData}>
                <PolarGrid stroke="var(--color-border)" />
                <PolarAngleAxis dataKey="subject" tick={{ fontSize: 12, fontWeight: 600 }} />
                <Radar name="Su Empresa" dataKey="A" stroke="var(--color-primary)" fill="var(--color-primary)" fillOpacity={0.6} />
                <Radar name="Benchmark" dataKey="B" stroke="var(--color-text-muted)" fill="var(--color-text-muted)" fillOpacity={0.1} />
                <Legend />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Dimensional Breakdown */}
      <h2 style={{ marginBottom: '2rem' }}>Desglose por Dimensión</h2>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.5rem', marginBottom: '4rem' }}>
        {[
          { id: 'D1', label: 'Estrategia', val: results.D1, icon: <Award /> },
          { id: 'D2', label: 'Tecnología', val: results.D2, icon: <TrendingUp /> },
          { id: 'D3', label: 'Talento', val: results.D3, icon: <Award /> },
          { id: 'D4', label: 'Datos', val: results.D4, icon: <Target /> },
          { id: 'D5', label: 'Cliente', val: results.D5, icon: <TrendingUp /> },
        ].map(dim => (
          <div key={dim.id} className="glass" style={{ padding: '1.5rem', borderRadius: 'var(--radius)', borderLeft: `4px solid ${dim.val > 70 ? 'var(--level-5)' : dim.val > 40 ? 'var(--level-3)' : 'var(--level-1)'}` }}>
            <div style={{ opacity: 0.6, fontSize: '0.8rem', fontWeight: 700, textTransform: 'uppercase' }}>{dim.label}</div>
            <div style={{ fontSize: '1.8rem', fontWeight: 800, margin: '0.5rem 0' }}>{dim.val}%</div>
            <div style={{ background: 'var(--color-bg)', height: '6px', borderRadius: '3px' }}>
              <div style={{ 
                background: dim.val > 70 ? 'var(--level-5)' : dim.val > 40 ? 'var(--level-3)' : 'var(--level-1)', 
                width: `${dim.val}%`, 
                height: '100%', 
                borderRadius: '3px' 
              }}></div>
            </div>
          </div>
        ))}
      </div>

      {/* CTA to Roadmap */}
      <div style={{ 
        background: 'var(--color-primary)', 
        color: 'white', 
        padding: '3rem', 
        borderRadius: 'var(--radius-lg)', 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: '2rem'
      }}>
        <div style={{ maxWidth: '600px' }}>
          <h2 style={{ color: 'white', marginBottom: '1rem' }}>Su Hoja de Ruta de 90 Días está Lista</h2>
          <p style={{ opacity: 0.9 }}>Hemos diseñado un plan de acción personalizado basado en sus áreas con mayor potencial de mejora.</p>
        </div>
        <div
          role="button"
          tabIndex={0}
          onClick={() => navigate(`/roadmap/${id}`)}
          onKeyDown={(e) => e.key === 'Enter' && navigate(`/roadmap/${id}`)}
          style={{ 
            background: 'white', 
            color: 'var(--color-primary)', 
            padding: '1rem 2rem', 
            borderRadius: 'var(--radius)', 
            fontWeight: 800, 
            display: 'flex', 
            alignItems: 'center', 
            gap: '0.5rem',
            cursor: 'pointer',
            userSelect: 'none'
          }}
        >
          Ver Plan de Acción →
        </div>
      </div>
    </div>
  );
};

export default Results;
