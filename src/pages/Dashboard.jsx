import { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell, Radar, RadarChart, PolarGrid, PolarAngleAxis, Legend } from 'recharts';
import { SECTORS, SIZES, getSectorAverages, getBenchmarkForCompany } from '../lib/benchmark';
import { TrendingUp, Users, Target, Zap } from 'lucide-react';
import { getScoreColor, readFromLocalStorage } from '../lib/utils';

const DIM_LABELS = { D1: 'Estrategia Digital', D2: 'Tecnología e Infraestructura', D3: 'Talento y Cultura', D4: 'Gobernanza de Datos', D5: 'Experiencia del Cliente' };

const Dashboard = () => {
  const sectorAverages = getSectorAverages();
  const [stats, setStats] = useState({ count: 0, avg: 0, topSector: '—', gap: 0 });
  const [insight, setInsight] = useState(null);
  const [userRadar, setUserRadar] = useState(null);
  const [bmContext, setBmContext] = useState(null);

  useEffect(() => {
    const items = readFromLocalStorage();
    if (items.length === 0) return;
    const avg = Math.round(items.reduce((s, d) => s + d.results.total, 0) / items.length);
    const sectorCount = {};
    items.forEach(d => {
      const s = d.companyInfo?.sector;
      if (s) sectorCount[s] = (sectorCount[s] || 0) + 1;
    });
    const topSectorId = Object.entries(sectorCount).sort((a, b) => b[1] - a[1])[0]?.[0];
    const topSectorLabel = SECTORS.find(s => s.id === topSectorId)?.label || '—';
    const topSector = topSectorLabel.split(' ')[0];
    setStats({ count: items.length, avg, topSector, gap: Math.max(0, 96 - avg) });

    // Calcular dimensión más débil y más fuerte de todos los diagnósticos
    const dimSums = { D1: 0, D2: 0, D3: 0, D4: 0, D5: 0 };
    items.forEach(d => {
      ['D1','D2','D3','D4','D5'].forEach(k => { dimSums[k] += (d.results[k] || 0); });
    });
    const dimAvgs = Object.entries(dimSums).map(([k, v]) => ({ id: k, avg: Math.round(v / items.length) }));
    const weakest = dimAvgs.sort((a, b) => a.avg - b.avg)[0];
    const strongest = dimAvgs.sort((a, b) => b.avg - a.avg)[0];
    setInsight({ weakest, strongest, topSectorLabel, count: items.length, avg });

    const latest = [...items].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))[0];
    const bm = getBenchmarkForCompany(latest.companyInfo?.sector, latest.companyInfo?.size);
    const sectorLabel = SECTORS.find(s => s.id === latest.companyInfo?.sector)?.label;
    const sizeLabel = SIZES.find(z => z.id === latest.companyInfo?.size)?.label;
    if (sectorLabel || sizeLabel) setBmContext({ sectorLabel, sizeLabel });
    setUserRadar([
      { subject: 'Estrategia', empresa: latest.results.D1, mercado: bm.D1 },
      { subject: 'Tecnología', empresa: latest.results.D2, mercado: bm.D2 },
      { subject: 'Talento', empresa: latest.results.D3, mercado: bm.D3 },
      { subject: 'Datos', empresa: latest.results.D4, mercado: bm.D4 },
      { subject: 'Cliente', empresa: latest.results.D5, mercado: bm.D5 },
    ]);
  }, []);
  
  const colors = ['#4C9B2F', '#3182CE', '#805AD5', '#DD6B20', '#E53E3E', '#38B2AC'];

  return (
    <div className="container" style={{ paddingTop: '4rem', paddingBottom: '4rem' }}>
      <div style={{ marginBottom: '4rem' }}>
        <h1 style={{ fontSize: '2.5rem', color: 'var(--color-text)', marginBottom: '1rem' }}>Benchmark Regional TIC</h1>
        <p style={{ color: '#6B7280', fontSize: '1.1rem', maxWidth: '700px' }}>
          Estado de la madurez digital en Antioquia. Datos agregados de más de 250 empresas del sector tecnológico.
        </p>
      </div>

      {/* KPI Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1.5rem', marginBottom: '4rem' }}>
        {[
          { label: 'Promedio de Diagnósticos', val: stats.count > 0 ? `${stats.avg}%` : '—', icon: <TrendingUp />, color: '#4C9B2F' },
          { label: 'Diagnósticos Realizados', val: stats.count > 0 ? stats.count : '—', icon: <Users />, color: '#3182CE' },
          { label: 'Brecha al Óptimo', val: stats.count > 0 ? `${stats.gap}%` : '—', icon: <Target />, color: '#E53E3E' },
          { label: 'Sector más Activo', val: stats.topSector, icon: <Zap />, color: '#DD6B20' },
        ].map((kpi, i) => (
          <div key={i} className="card-hover" style={{ background: 'white', padding: '2rem', borderRadius: 'var(--radius-lg)', border: '1px solid #E5E7EB', boxShadow: '0 4px 12px rgba(0,0,0,0.02)' }}>
            <div style={{ color: kpi.color, marginBottom: '1rem' }}>{kpi.icon}</div>
            <div style={{ fontSize: '2rem', fontWeight: 900, color: '#1A2E1A' }}>{kpi.val}</div>
            {kpi.val === '—' && <div style={{ fontSize: '0.7rem', color: 'var(--color-text-muted)', marginTop: '0.15rem', marginBottom: '-0.25rem' }}>sin datos aún</div>}
            <div style={{ color: '#6B7280', fontSize: '0.85rem', fontWeight: 700, textTransform: 'uppercase' }}>{kpi.label}</div>
          </div>
        ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(400px, 100%), 1fr))', gap: '2.5rem' }}>
        {/* Gráfico de Sectores */}
        <div style={{ background: 'white', padding: '2.5rem', borderRadius: 'var(--radius-lg)', border: '1px solid #E5E7EB', boxShadow: '0 10px 30px rgba(0,0,0,0.03)' }}>
          <h3 style={{ marginBottom: '2rem', fontSize: '1.3rem', fontWeight: 800 }}>Madurez por Sub-sector</h3>
          <div style={{ width: '100%', height: '350px' }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={sectorAverages} layout="vertical" margin={{ left: 40, right: 40 }}>
                <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} stroke="#F3F4F6" />
                <XAxis type="number" hide />
                <YAxis 
                  dataKey="name" 
                  type="category" 
                  tick={{ fontSize: 11, fontWeight: 700, fill: '#4B5563' }} 
                  width={140}
                />
                <Tooltip 
                  cursor={{ fill: '#F9FAFB' }}
                  contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 25px rgba(0,0,0,0.1)' }}
                />
                <Bar dataKey="score" radius={[0, 10, 10, 0]} barSize={30}>
                  {sectorAverages.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Perfil del Último Diagnóstico */}
        <div style={{ background: 'white', padding: '2.5rem', borderRadius: 'var(--radius-lg)', border: '1px solid #E5E7EB', boxShadow: '0 10px 30px rgba(0,0,0,0.03)' }}>
          <div style={{ marginBottom: '2rem' }}>
            <h3 style={{ fontSize: '1.3rem', fontWeight: 800, marginBottom: '0.3rem' }}>Perfil del Último Diagnóstico</h3>
            {bmContext && (
              <p style={{ fontSize: '0.78rem', fontWeight: 600, color: 'var(--color-text-muted)', margin: 0 }}>
                vs. Benchmark
                {bmContext.sectorLabel && <> · <span style={{ color: 'var(--color-primary)' }}>{bmContext.sectorLabel}</span></>}
                {bmContext.sizeLabel && <> · {bmContext.sizeLabel}</>}
              </p>
            )}
          </div>
          {userRadar ? (
            <div style={{ width: '100%', height: '320px' }}>
              <ResponsiveContainer width="100%" height="100%">
                <RadarChart cx="50%" cy="50%" outerRadius="75%" data={userRadar}>
                  <PolarGrid stroke="#e5e7eb" />
                  <PolarAngleAxis dataKey="subject" tick={{ fontSize: 12, fontWeight: 700, fill: '#374151' }} />
                  <Radar name="Su Empresa" dataKey="empresa" stroke="#4C9B2F" fill="#4C9B2F" fillOpacity={0.5} />
                  <Radar name="Benchmark" dataKey="mercado" stroke="#9CA3AF" fill="#9CA3AF" fillOpacity={0.15} />
                  <Legend iconType="circle" wrapperStyle={{ paddingTop: '16px', fontWeight: 600, fontSize: '0.85rem' }} />
                  <Tooltip />
                </RadarChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '280px', gap: '1rem', color: 'var(--color-text-muted)' }}>
              <Target size={48} strokeWidth={1} />
              <p style={{ fontWeight: 700, fontSize: '1rem', textAlign: 'center', maxWidth: '220px' }}>
                Realice un diagnóstico para ver su perfil dimensional
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Insight Section — dinámica según datos reales */}
      <div style={{ marginTop: '4rem', background: '#1A2E1A', padding: '3.5rem', borderRadius: 'var(--radius-lg)', color: 'white', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'relative', zIndex: 2 }}>
          <h2 style={{ color: 'white', fontSize: '2rem', marginBottom: '1rem' }}>Conclusión Estratégica</h2>
          {insight ? (
            <p style={{ opacity: 0.85, fontSize: '1.1rem', maxWidth: '800px', lineHeight: '1.7' }}>
              Con base en <strong>{insight.count} diagnóstico{insight.count !== 1 ? 's' : ''}</strong> realizados, el promedio regional es de <strong>{insight.avg} / 100</strong>.
              {insight.topSectorLabel !== '—' && <> El sub-sector más activo es <strong>{insight.topSectorLabel}</strong>.</>}
              {' '}La dimensión con mayor brecha es <strong>{DIM_LABELS[insight.weakest.id]} ({insight.weakest.avg}%)</strong>, mientras que <strong>{DIM_LABELS[insight.strongest.id]} ({insight.strongest.avg}%)</strong> muestra el mayor avance. Contáctenos en <strong>gerencia@softline.com.co</strong> para una consultoría enfocada en el área más débil del ecosistema.
            </p>
          ) : (
            <p style={{ opacity: 0.85, fontSize: '1.1rem', maxWidth: '800px', lineHeight: '1.7' }}>
              Aún no hay diagnósticos registrados en esta sesión. Realice el primer autodiagnóstico para generar conclusiones estratégicas basadas en datos reales.
            </p>
          )}
        </div>
        <div style={{ position: 'absolute', right: '-50px', bottom: '-50px', opacity: 0.1 }}>
          <TrendingUp size={300} />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
