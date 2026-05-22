import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, ResponsiveContainer, Legend } from 'recharts';
import { getBenchmarkForCompany } from '../lib/benchmark';
import { getShare } from '../lib/db';
import { FileDown, Award, TrendingUp, Target, ShieldCheck, Users, Star, Lock } from 'lucide-react';
import { getScoreColor, getScoreLevelLabel } from '../lib/utils';

const ShareResults = () => {
  const { token } = useParams();
  const [data, setData] = useState(null);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    const load = async () => {
      // 1. Buscar en localStorage por shareToken
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key?.startsWith('assessment_')) {
          try {
            const item = JSON.parse(localStorage.getItem(key));
            if (item?.shareToken === token) { setData(item); return; }
          } catch { /* ignorar */ }
        }
      }
      // 2. Fallback a Firestore (otro dispositivo)
      try {
        const remote = await getShare(token);
        if (remote) { setData(remote); return; }
      } catch { /* sin red */ }

      setNotFound(true);
    };
    load();
  }, [token]);

  if (notFound) return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '60vh', gap: '1.5rem', textAlign: 'center', padding: '2rem' }}>
      <div style={{ fontSize: '5rem', fontWeight: 900, color: '#E5E7EB' }}>404</div>
      <h2>Diagnóstico no encontrado</h2>
      <p style={{ color: '#6B7280', maxWidth: '400px' }}>Este enlace no es válido o el diagnóstico no está disponible.</p>
      <Link to="/" style={{ background: '#4C9B2F', color: 'white', padding: '0.875rem 2rem', borderRadius: 'var(--radius)', fontWeight: 700, textDecoration: 'none' }}>
        Ir al Inicio
      </Link>
    </div>
  );

  if (!data) return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '60vh' }}>
      <div className="spinner" />
    </div>
  );

  const { results, companyInfo } = data;
  const benchmark = getBenchmarkForCompany(companyInfo?.sector, companyInfo?.size);
  const chartData = [
    { subject: 'Estrategia', A: results.D1, B: benchmark.D1 },
    { subject: 'Tecnología', A: results.D2, B: benchmark.D2 },
    { subject: 'Talento',    A: results.D3, B: benchmark.D3 },
    { subject: 'Datos',      A: results.D4, B: benchmark.D4 },
    { subject: 'Cliente',    A: results.D5, B: benchmark.D5 },
  ];

  return (
    <div className="container" style={{ paddingTop: '4rem', paddingBottom: '4rem' }}>

      {/* Banner vista compartida */}
      <div style={{ background: '#F0FDF4', border: '1px solid #BBF7D0', borderRadius: 'var(--radius)', padding: '0.75rem 1.25rem', marginBottom: '2rem', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
        <ShieldCheck size={16} color="#166534" />
        <p style={{ margin: 0, fontSize: '0.85rem', color: '#166534', fontWeight: 600 }}>
          Informe compartido · acceso exclusivo con este enlace
        </p>
      </div>

      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '3rem', flexWrap: 'wrap', gap: '1.5rem', borderBottom: '2px solid #f0f0f0', paddingBottom: '2rem' }}>
        <div>
          <h1 style={{ color: '#1A2E1A', marginBottom: '0.5rem' }}>
            {companyInfo?.companyName || 'Diagnóstico de Madurez Digital'}
          </h1>
          {companyInfo?.companyName && (
            <p style={{ color: '#4C9B2F', fontWeight: 700, fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '0.25rem' }}>
              Diagnóstico de Madurez Digital
            </p>
          )}
          <p style={{ color: '#6B7280', fontWeight: 600 }}>
            {new Date(data.createdAt).toLocaleDateString('es-ES', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
          </p>
        </div>
        <button
          type="button"
          className="no-print"
          onClick={() => window.print()}
          style={{ padding: '0.8rem 1.8rem', borderRadius: 'var(--radius)', display: 'flex', alignItems: 'center', gap: '0.6rem', fontWeight: 700, background: '#1A2E1A', color: 'white', cursor: 'pointer', border: 'none' }}
        >
          <FileDown size={20} /> Guardar PDF
        </button>
      </div>

      {/* Score + Radar */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '2.5rem', marginBottom: '4rem' }}>
        <div style={{ background: 'white', padding: '3rem', borderRadius: 'var(--radius-lg)', textAlign: 'center', border: '1px solid #e5e7eb', boxShadow: '0 10px 25px rgba(0,0,0,0.04)', position: 'relative', overflow: 'hidden' }}>
          <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '8px', background: `var(--level-${results.levelInfo.level})` }} />
          <p style={{ textTransform: 'uppercase', fontSize: '0.85rem', fontWeight: 800, color: '#6B7280', letterSpacing: '1.5px', marginBottom: '1rem' }}>Puntaje Global</p>
          <div style={{ fontSize: '6rem', fontWeight: 900, color: '#1A2E1A', lineHeight: 1 }}>
            {results.total}<span style={{ fontSize: '1.5rem', color: 'var(--color-text-muted)' }}>/100</span>
          </div>
          <div style={{ marginTop: '2rem' }}>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', padding: '0.6rem 1.8rem', background: `var(--level-${results.levelInfo.level})`, color: 'white', borderRadius: '100px', fontWeight: 800, fontSize: '1.1rem' }}>
              <ShieldCheck size={22} /> Nivel {results.levelInfo.level}: {results.levelInfo.name}
            </div>
          </div>
          <p style={{ marginTop: '2.5rem', fontSize: '1.05rem', color: '#374151', lineHeight: '1.6', fontWeight: 500 }}>{results.levelInfo.description}</p>
        </div>

        <div style={{ background: 'white', padding: '2.5rem', borderRadius: 'var(--radius-lg)', border: '1px solid #e5e7eb', boxShadow: '0 10px 25px rgba(0,0,0,0.04)', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
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

      {/* Dimensiones */}
      <h2 style={{ marginBottom: '2rem', fontSize: '1.8rem', fontWeight: 800 }}>Análisis Detallado por Área</h2>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1.5rem', marginBottom: '5rem' }}>
        {[
          { id: 'D1', label: 'Estrategia', val: results.D1, bm: benchmark.D1, icon: <Award size={18} /> },
          { id: 'D2', label: 'Tecnología', val: results.D2, bm: benchmark.D2, icon: <TrendingUp size={18} /> },
          { id: 'D3', label: 'Talento',    val: results.D3, bm: benchmark.D3, icon: <Users size={18} /> },
          { id: 'D4', label: 'Datos',      val: results.D4, bm: benchmark.D4, icon: <Target size={18} /> },
          { id: 'D5', label: 'Cliente',    val: results.D5, bm: benchmark.D5, icon: <Star size={18} /> },
        ].map(dim => {
          const color = getScoreColor(dim.val);
          const levelLabel = getScoreLevelLabel(dim.val);
          const vsMarket = dim.val - dim.bm;
          return (
            <div key={dim.id} className="card-hover" style={{ background: 'white', padding: '1.75rem', borderRadius: 'var(--radius-lg)', border: '1px solid #e5e7eb', borderLeft: `4px solid ${color}`, boxShadow: '0 4px 12px rgba(0,0,0,0.03)', display: 'flex', flexDirection: 'column', gap: '1.1rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                  <div style={{ background: `${color}18`, color, padding: '0.4rem', borderRadius: 'var(--radius)', display: 'flex', alignItems: 'center' }}>{dim.icon}</div>
                  <span style={{ fontWeight: 800, fontSize: '0.9rem', color: '#374151' }}>{dim.label}</span>
                </div>
                <span className="badge" style={{ background: `${color}15`, color, whiteSpace: 'nowrap' }}>{levelLabel}</span>
              </div>
              <div style={{ lineHeight: 1 }}>
                <span style={{ fontSize: '2.6rem', fontWeight: 900, color }}>{dim.val}</span>
                <span style={{ fontSize: '1rem', color: 'var(--color-text-muted)', fontWeight: 600 }}>/100</span>
              </div>
              <div>
                <div style={{ background: '#F3F4F6', height: '8px', borderRadius: '4px', position: 'relative' }}>
                  <div style={{ background: color, width: `${dim.val}%`, height: '100%', borderRadius: '4px' }} />
                  <div style={{ position: 'absolute', top: '-3px', left: `${dim.bm}%`, width: '3px', height: '14px', background: '#9CA3AF', borderRadius: '2px', transform: 'translateX(-50%)' }} />
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '0.5rem' }}>
                  <span style={{ fontSize: '0.72rem', color: 'var(--color-text-muted)', fontWeight: 600 }}>Benchmark: {dim.bm}%</span>
                  <span style={{ fontSize: '0.72rem', fontWeight: 800, color: vsMarket >= 0 ? '#4C9B2F' : '#E53E3E' }}>
                    {vsMarket >= 0 ? `+${vsMarket}` : vsMarket} pts vs mercado
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* CTA Plan de Acción */}
      <div className="no-print" style={{ background: '#1A2E1A', color: 'white', padding: '3.5rem', borderRadius: 'var(--radius-lg)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '2.5rem', boxShadow: '0 20px 40px rgba(76,155,47,0.15)' }}>
        <div style={{ maxWidth: '650px' }}>
          <h2 style={{ color: 'white', fontSize: '2rem', marginBottom: '1rem' }}>Hoja de Ruta de 90 Días</h2>
          <p style={{ opacity: 0.85, fontSize: '1.1rem', lineHeight: '1.6' }}>
            El plan de acción detallado está disponible en la plataforma. Inicie sesión o cree una cuenta gratuita para acceder.
          </p>
        </div>
        <Link
          to="/login"
          style={{ background: '#4C9B2F', color: 'white', padding: '1.2rem 2.5rem', borderRadius: 'var(--radius)', fontWeight: 800, fontSize: '1.1rem', display: 'flex', alignItems: 'center', gap: '0.7rem', textDecoration: 'none', boxShadow: '0 8px 20px rgba(0,0,0,0.2)' }}
        >
          <Lock size={20} /> Acceder a la Plataforma
        </Link>
      </div>
    </div>
  );
};

export default ShareResults;
