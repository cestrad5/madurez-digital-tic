import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, ResponsiveContainer, Legend } from 'recharts';
import { getBenchmarkForCompany } from '../lib/benchmark';
import { getAssessment } from '../lib/db';
import { FileDown, ArrowRight, ArrowLeft, Award, TrendingUp, TrendingDown, Target, ShieldCheck, Share2, Check, Users, Star } from 'lucide-react';
import { getScoreColor, getScoreLevelLabel, readFromLocalStorage } from '../lib/utils';

const Results = () => {
  const { id } = useParams();
  const [data, setData] = useState(null);
  const [prevData, setPrevData] = useState(null);
  const [copied, setCopied] = useState(false);
  const navigate = useNavigate();

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }).catch(() => {});
  };

  useEffect(() => {
    const load = async () => {
      // 1. Intentar localStorage (path rápido — siempre disponible justo tras el assessment)
      const saved = localStorage.getItem(`assessment_${id}`);
      if (saved) {
        try {
          const parsed = JSON.parse(saved);
          setData(parsed);
          const currentUser = (() => { try { return JSON.parse(localStorage.getItem('user') || 'null'); } catch { return null; } })();
          const uid = currentUser?.uid || (currentUser?.isDemo ? 'demo' : null);
          const all = readFromLocalStorage(uid).sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
          const idx = all.findIndex(a => a.id === id);
          if (idx !== -1 && idx < all.length - 1) setPrevData(all[idx + 1]);
          return;
        } catch { localStorage.removeItem(`assessment_${id}`); }
      }

      // 2. Fallback a Firestore (otro dispositivo, historial sincronizado)
      try {
        const user = JSON.parse(localStorage.getItem('user') || 'null');
        if (user?.uid && !user?.isDemo) {
          const remote = await getAssessment(user.uid, id);
          if (remote) {
            try { localStorage.setItem(`assessment_${id}`, JSON.stringify(remote)); } catch { /* cuota */ }
            setData(remote);
            return;
          }
        }
      } catch { /* sin red */ }

      navigate('/');
    };
    load();
  }, [id, navigate]);

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
    { subject: 'Talento', A: results.D3, B: benchmark.D3 },
    { subject: 'Datos', A: results.D4, B: benchmark.D4 },
    { subject: 'Cliente', A: results.D5, B: benchmark.D5 },
  ];

  return (
    <div className="container" style={{ paddingTop: '3rem', paddingBottom: '4rem' }}>
      <button
        type="button"
        onClick={() => navigate(-1)}
        className="no-print"
        style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', background: 'none', border: 'none', cursor: 'pointer', color: 'var(--color-text-muted)', fontWeight: 600, fontSize: '0.875rem', marginBottom: '1.5rem', padding: 0 }}
      >
        <ArrowLeft size={15} /> Volver
      </button>

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
          <h1 style={{ color: '#1A2E1A', marginBottom: '0.5rem' }}>
            {data.companyInfo?.companyName ? `${data.companyInfo.companyName}` : 'Diagnóstico de Madurez Digital'}
          </h1>
          {data.companyInfo?.companyName && (
            <p style={{ color: '#4C9B2F', fontWeight: 700, fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '0.25rem' }}>
              Diagnóstico de Madurez Digital
            </p>
          )}
          <p style={{ color: '#6B7280', fontWeight: 600 }}>
            {new Date(data.createdAt).toLocaleDateString('es-ES', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
            <span style={{ opacity: 0.5, fontSize: '0.82rem', marginLeft: '0.5rem' }}>· ref #{id.slice(-6)}</span>
          </p>
        </div>
        <div className="no-print" style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap', justifyContent: 'flex-end' }}>
          <button
            type="button"
            onClick={handleShare}
            style={{
              padding: '0.8rem 1.5rem', borderRadius: 'var(--radius)',
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.6rem', fontWeight: 700,
              minWidth: '160px',
              background: copied ? '#F0FDF4' : 'white',
              color: copied ? '#166534' : '#4B5563',
              cursor: 'pointer',
              border: `1px solid ${copied ? '#86EFAC' : '#E5E7EB'}`,
              transition: 'all 0.2s ease'
            }}
          >
            {copied
              ? <><Check size={18} /> ¡Enlace copiado!</>
              : <><Share2 size={18} /> Compartir</>
            }
          </button>

          <button
            type="button"
            className="btn-hover"
            onClick={() => navigate('/assessment')}
            style={{
              padding: '0.8rem 1.5rem',
              borderRadius: 'var(--radius)',
              display: 'flex',
              alignItems: 'center',
              gap: '0.6rem',
              fontWeight: 700,
              background: '#F3F4F6',
              color: '#4B5563',
              cursor: 'pointer',
              border: '1px solid #E5E7EB'
            }}
          >
            <ArrowRight size={18} /> Nuevo Diagnóstico
          </button>
          <button
            type="button"
            className="btn-hover"
            onClick={() => window.print()}
            style={{
              padding: '0.8rem 1.8rem',
              borderRadius: 'var(--radius)',
              display: 'flex',
              alignItems: 'center',
              gap: '0.6rem',
              fontWeight: 700,
              background: '#1A2E1A',
              color: 'white',
              cursor: 'pointer',
              boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
              border: 'none'
            }}
          >
            <FileDown size={20} /> Guardar Reporte PDF
          </button>
        </div>
      </div>

      {/* Comparativa vs. diagnóstico anterior */}
      {prevData && (() => {
        const delta = results.total - prevData.results.total;
        const isUp = delta >= 0;
        const dims = ['D1','D2','D3','D4','D5'];
        const dimLabels = { D1: 'Est', D2: 'Tec', D3: 'Tal', D4: 'Dat', D5: 'Cli' };
        return (
          <div style={{
            marginBottom: '2rem',
            background: isUp ? '#F0FDF4' : '#FFF7ED',
            border: `1px solid ${isUp ? '#BBF7D0' : '#FED7AA'}`,
            borderRadius: 'var(--radius-lg)',
            padding: '1.25rem 1.75rem',
            display: 'flex', alignItems: 'center', gap: '1.5rem', flexWrap: 'wrap'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <span style={{ display: 'flex', color: isUp ? '#166534' : '#9A3412' }}>{isUp ? <TrendingUp size={28} /> : <TrendingDown size={28} />}</span>
              <div>
                <p style={{ margin: 0, fontSize: '0.72rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '1px', color: isUp ? '#166534' : '#9A3412' }}>
                  Evolución vs. diagnóstico anterior
                </p>
                <p style={{ margin: 0, fontSize: '0.78rem', color: 'var(--color-text-muted)', fontWeight: 600 }}>
                  {new Date(prevData.createdAt).toLocaleDateString('es-ES', { day: 'numeric', month: 'long', year: 'numeric' })}
                  {prevData.companyInfo?.companyName && ` · ${prevData.companyInfo.companyName}`}
                </p>
              </div>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <span style={{ fontSize: '1.5rem', fontWeight: 900, color: isUp ? '#166534' : '#9A3412' }}>
                {isUp ? `+${delta}` : delta} pts
              </span>
              <span style={{ fontSize: '0.78rem', color: 'var(--color-text-muted)', fontWeight: 600 }}>
                ({prevData.results.total} → {results.total})
              </span>
            </div>
            <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', marginLeft: 'auto' }}>
              {dims.map(d => {
                const diff = (results[d] ?? 0) - (prevData.results[d] ?? 0);
                return (
                  <span key={d} style={{
                    fontSize: '0.72rem', fontWeight: 800, padding: '0.2rem 0.6rem',
                    borderRadius: '100px',
                    background: diff > 0 ? '#DCFCE7' : diff < 0 ? '#FEE2E2' : '#F3F4F6',
                    color: diff > 0 ? '#166534' : diff < 0 ? '#991B1B' : '#6B7280'
                  }}>
                    {dimLabels[d]} {diff > 0 ? `+${diff}` : diff}
                  </span>
                );
              })}
            </div>
          </div>
        );
      })()}

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '2.5rem', marginBottom: '4rem' }}>
        {/* Main Score Card */}
        <div style={{ 
          background: 'white',
          padding: '3rem', 
          borderRadius: 'var(--radius-lg)', 
          textAlign: 'center', 
          border: '1px solid #e5e7eb',
          boxShadow: '0 10px 25px rgba(0,0,0,0.04)',
          position: 'relative',
          overflow: 'hidden'
        }}>
          <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '8px', background: `var(--level-${results.levelInfo.level})` }}></div>
          <p style={{ textTransform: 'uppercase', fontSize: '0.85rem', fontWeight: 800, color: '#6B7280', letterSpacing: '1.5px', marginBottom: '1rem' }}>Puntaje Global</p>
          <div style={{ fontSize: '6rem', fontWeight: 900, color: '#1A2E1A', lineHeight: 1 }}>
            {results.total}<span style={{ fontSize: '1.5rem', color: 'var(--color-text-muted)' }}>/100</span>
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
          borderRadius: 'var(--radius-lg)', 
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
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.25rem', marginBottom: '5rem' }}>
        {[
          { id: 'D1', label: 'Estrategia', val: results.D1, bm: benchmark.D1, icon: <Award size={20} /> },
          { id: 'D2', label: 'Tecnología', val: results.D2, bm: benchmark.D2, icon: <TrendingUp size={20} /> },
          { id: 'D3', label: 'Talento',    val: results.D3, bm: benchmark.D3, icon: <Users size={20} /> },
          { id: 'D4', label: 'Datos',      val: results.D4, bm: benchmark.D4, icon: <Target size={20} /> },
          { id: 'D5', label: 'Cliente',    val: results.D5, bm: benchmark.D5, icon: <Star size={20} /> },
        ].map(dim => {
          const color = getScoreColor(dim.val);
          const levelLabel = getScoreLevelLabel(dim.val);
          const vsMarket = dim.val - dim.bm;
          const isAbove = vsMarket >= 0;

          // Mini arco SVG
          const R = 28, cx = 34, cy = 34, stroke = 6;
          const circ = 2 * Math.PI * R;
          const filled = circ * (dim.val / 100);
          const gap = circ - filled;

          return (
            <div key={dim.id} className="card-hover" style={{
              background: 'white',
              borderRadius: 'var(--radius-lg)',
              border: '1px solid #E5E7EB',
              boxShadow: '0 4px 16px rgba(0,0,0,0.04)',
              overflow: 'hidden',
              display: 'flex',
              flexDirection: 'column',
            }}>
              {/* Acento superior */}
              <div style={{ height: '5px', background: color }} />

              <div style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem', flex: 1 }}>
                {/* Encabezado: ícono + nombre */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                  <div style={{ background: `${color}18`, color, padding: '0.45rem', borderRadius: '10px', display: 'flex' }}>
                    {dim.icon}
                  </div>
                  <span style={{ fontWeight: 800, fontSize: '0.95rem', color: '#1A2E1A' }}>{dim.label}</span>
                </div>

                {/* Puntaje + arco */}
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <div style={{ lineHeight: 1 }}>
                    <span style={{ fontSize: '3rem', fontWeight: 900, color, lineHeight: 1 }}>{dim.val}</span>
                    <span style={{ fontSize: '0.9rem', color: '#9CA3AF', fontWeight: 600 }}>/100</span>
                    <div style={{ marginTop: '0.4rem' }}>
                      <span style={{ display: 'inline-block', fontSize: '0.72rem', fontWeight: 700, padding: '0.2rem 0.65rem', borderRadius: '100px', background: `${color}15`, color }}>
                        {levelLabel}
                      </span>
                    </div>
                  </div>
                  <svg width={cx * 2} height={cy * 2} style={{ transform: 'rotate(-90deg)' }}>
                    <circle cx={cx} cy={cy} r={R} fill="none" stroke="#F3F4F6" strokeWidth={stroke} />
                    <circle cx={cx} cy={cy} r={R} fill="none" stroke={color} strokeWidth={stroke}
                      strokeDasharray={`${filled} ${gap}`} strokeLinecap="round" />
                    {/* Marcador benchmark */}
                    {(() => {
                      const angle = (dim.bm / 100) * 2 * Math.PI - Math.PI / 2;
                      const mx = cx + R * Math.cos(angle);
                      const my = cy + R * Math.sin(angle);
                      return <circle cx={mx} cy={my} r={4} fill="#9CA3AF" />;
                    })()}
                  </svg>
                </div>

                {/* Benchmark row */}
                <div style={{
                  display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                  paddingTop: '0.75rem', borderTop: '1px solid #F3F4F6',
                }}>
                  <span style={{ fontSize: '0.75rem', color: '#9CA3AF', fontWeight: 600 }}>
                    Mercado: <strong style={{ color: '#6B7280' }}>{dim.bm}</strong>
                  </span>
                  <span style={{
                    fontSize: '0.75rem', fontWeight: 800, padding: '0.2rem 0.65rem',
                    borderRadius: '100px',
                    background: isAbove ? '#DCFCE7' : '#FEE2E2',
                    color: isAbove ? '#166534' : '#991B1B',
                  }}>
                    {isAbove ? `+${vsMarket}` : vsMarket} pts
                  </span>
                </div>
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
        borderRadius: 'var(--radius-lg)', 
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
        <button
          type="button"
          onClick={() => navigate(`/roadmap/${id}`)}
          style={{
            background: '#4C9B2F',
            color: 'white',
            padding: '1.2rem 2.5rem',
            borderRadius: 'var(--radius)',
            fontWeight: 800,
            fontSize: '1.1rem',
            display: 'flex',
            alignItems: 'center',
            gap: '0.7rem',
            cursor: 'pointer',
            transition: 'transform 0.2s ease',
            boxShadow: '0 8px 20px rgba(0,0,0,0.2)',
            border: 'none'
          }}
        >
          Explorar Plan de Acción <ArrowRight size={22} />
        </button>
      </div>
    </div>
  );
};

export default Results;
