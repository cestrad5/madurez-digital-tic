import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, ResponsiveContainer, Legend } from 'recharts';
import { getBenchmarkForCompany } from '../lib/benchmark';
import { FileDown, ArrowRight, Award, TrendingUp, Target, ShieldCheck } from 'lucide-react';

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
  const benchmark = getBenchmarkForCompany('desarrollo_sw', 'pequena');

  const chartData = [
    { subject: 'Estrategia', A: results.D1, B: benchmark.D1 },
    { subject: 'Tecnología', A: results.D2, B: benchmark.D2 },
    { subject: 'Talento', A: results.D3, B: benchmark.D3 },
    { subject: 'Datos', A: results.D4, B: benchmark.D4 },
    { subject: 'Cliente', A: results.D5, B: benchmark.D5 },
  ];

  return (
    <div className="container" style={{ padding: '3rem 0' }}>
      {/* Header Reporte */}
      <div style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'flex-end', 
        marginBottom: '3rem', 
        flexWrap: 'wrap', 
        gap: '1.5rem',
        borderBottom: '2px solid #f0f0f0',
        paddingBottom: '2rem'
      }}>
        <div>
          <h1 style={{ fontSize: '2.5rem', color: '#1A2E1A', marginBottom: '0.5rem' }}>Diagnóstico de Madurez Digital</h1>
          <p style={{ color: '#6B7280', fontWeight: 600 }}>Identificador: <span style={{ color: '#4C9B2F' }}>#{id}</span> • Generado el {new Date(data.createdAt).toLocaleDateString()}</p>
        </div>
        <div 
          role="button"
          tabIndex={0}
          onClick={() => window.print()}
          className="no-print"
          style={{ 
            padding: '0.8rem 1.8rem', 
            borderRadius: '12px', 
            display: 'flex', 
            alignItems: 'center', 
            gap: '0.6rem', 
            fontWeight: 700,
            background: '#1A2E1A',
            color: 'white',
            cursor: 'pointer',
            boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
          }}
        >
          <FileDown size={20} /> Guardar Reporte PDF
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '2.5rem', marginBottom: '4rem' }}>
        {/* Main Score Card */}
        <div style={{ 
          background: 'white',
          padding: '3rem', 
          borderRadius: '20px', 
          textAlign: 'center', 
          border: '1px solid #e5e7eb',
          boxShadow: '0 10px 25px rgba(0,0,0,0.04)',
          position: 'relative',
          overflow: 'hidden'
        }}>
          <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '8px', background: `var(--level-${results.levelInfo.level})` }}></div>
          <p style={{ textTransform: 'uppercase', fontSize: '0.85rem', fontWeight: 800, color: '#6B7280', letterSpacing: '1.5px', marginBottom: '1rem' }}>Puntaje Global</p>
          <div style={{ fontSize: '6rem', fontWeight: 900, color: '#1A2E1A', lineHeight: 1 }}>
            {results.total}<span style={{ fontSize: '1.5rem', color: '#9CA3AF' }}>/100</span>
          </div>
          <div style={{ marginTop: '2rem' }}>
            <div style={{ 
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.5rem',
              padding: '0.6rem 1.8rem', 
              background: `var(--level-${results.levelInfo.level})`, 
              color: 'white', 
              borderRadius: '100px',
              fontWeight: 800,
              fontSize: '1.1rem'
            }}>
              <ShieldCheck size={22} /> Nivel {results.levelInfo.level}: {results.levelInfo.name}
            </div>
          </div>
          <p style={{ marginTop: '2.5rem', fontSize: '1.05rem', color: '#374151', lineHeight: '1.6', fontWeight: 500 }}>{results.levelInfo.description}</p>
        </div>

        {/* Charts Card */}
        <div style={{ 
          background: 'white',
          padding: '2.5rem', 
          borderRadius: '20px', 
          border: '1px solid #e5e7eb',
          boxShadow: '0 10px 25px rgba(0,0,0,0.04)',
          display: 'flex', 
          flexDirection: 'column', 
          alignItems: 'center' 
        }}>
          <h3 style={{ marginBottom: '2rem', fontSize: '1.2rem', color: '#1A2E1A', fontWeight: 800 }}>Comparativa vs. Benchmark</h3>
          <div style={{ width: '100%', height: '320px' }}>
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart cx="50%" cy="50%" outerRadius="80%" data={chartData}>
                <PolarGrid stroke="#e5e7eb" />
                <PolarAngleAxis dataKey="subject" tick={{ fontSize: 13, fontWeight: 700, fill: '#374151' }} />
                <Radar name="Su Empresa" dataKey="A" stroke="#4C9B2F" fill="#4C9B2F" fillOpacity={0.5} />
                <Radar name="Mercado Regional" dataKey="B" stroke="#9CA3AF" fill="#9CA3AF" fillOpacity={0.15} />
                <Legend iconType="circle" wrapperStyle={{ paddingTop: '20px', fontWeight: 600 }} />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Dimensional Breakdown */}
      <h2 style={{ marginBottom: '2rem', fontSize: '1.8rem', fontWeight: 800 }}>Análisis Detallado por Área</h2>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1.5rem', marginBottom: '5rem' }}>
        {[
          { id: 'D1', label: 'Estrategia', val: results.D1, icon: <Award size={20} /> },
          { id: 'D2', label: 'Tecnología', val: results.D2, icon: <TrendingUp size={20} /> },
          { id: 'D3', label: 'Talento', val: results.D3, icon: <Award size={20} /> },
          { id: 'D4', label: 'Datos', val: results.D4, icon: <Target size={20} /> },
          { id: 'D5', label: 'Cliente', val: results.D5, icon: <TrendingUp size={20} /> },
        ].map(dim => {
          const color = dim.val > 70 ? '#4C9B2F' : dim.val > 40 ? '#D69E2E' : '#E53E3E';
          return (
            <div key={dim.id} style={{ 
              background: 'white',
              padding: '1.8rem', 
              borderRadius: '16px', 
              border: '1px solid #e5e7eb',
              borderBottom: `5px solid ${color}`,
              boxShadow: '0 4px 12px rgba(0,0,0,0.03)'
            }}>
              <div style={{ color: '#6B7280', fontSize: '0.85rem', fontWeight: 800, textTransform: 'uppercase', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                {dim.icon} {dim.label}
              </div>
              <div style={{ fontSize: '2.2rem', fontWeight: 900, margin: '0.75rem 0', color: '#1A2E1A' }}>{dim.val}%</div>
              <div style={{ background: '#F3F4F6', height: '8px', borderRadius: '4px' }}>
                <div style={{ 
                  background: color, 
                  width: `${dim.val}%`, 
                  height: '100%', 
                  borderRadius: '4px',
                  transition: 'width 1s ease-out'
                }}></div>
              </div>
            </div>
          );
        })}
      </div>

      {/* CTA to Roadmap - Hidden in print */}
      <div className="no-print" style={{ 
        background: '#1A2E1A', 
        color: 'white', 
        padding: '3.5rem', 
        borderRadius: '24px', 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: '2.5rem',
        boxShadow: '0 20px 40px rgba(76,155,47,0.15)'
      }}>
        <div style={{ maxWidth: '650px' }}>
          <h2 style={{ color: 'white', fontSize: '2rem', marginBottom: '1rem' }}>Su Hoja de Ruta de 90 Días está Lista</h2>
          <p style={{ opacity: 0.85, fontSize: '1.1rem', lineHeight: '1.6' }}>Hemos diseñado un plan de acción técnica y estratégica personalizado para elevar sus indicadores de madurez digital en el corto plazo.</p>
        </div>
        <div 
          role="button"
          tabIndex={0}
          onClick={() => navigate(`/roadmap/${id}`)}
          onKeyDown={(e) => e.key === 'Enter' && navigate(`/roadmap/${id}`)}
          style={{ 
            background: '#4C9B2F', 
            color: 'white', 
            padding: '1.2rem 2.5rem', 
            borderRadius: '12px', 
            fontWeight: 800, 
            fontSize: '1.1rem',
            display: 'flex', 
            alignItems: 'center', 
            gap: '0.7rem',
            cursor: 'pointer',
            transition: 'transform 0.2s ease',
            boxShadow: '0 8px 20px rgba(0,0,0,0.2)'
          }}
        >
          Explorar Plan de Acción <ArrowRight size={22} />
        </div>
      </div>
    </div>
  );
};

export default Results;
