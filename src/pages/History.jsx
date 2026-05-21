import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { History as HistoryIcon, ArrowUpRight, Calendar, BarChart2, Building2, Trash2, RefreshCw, Plus, TrendingUp } from 'lucide-react';
import { SECTORS, SIZES } from '../lib/benchmark';
import { getScoreColor, readFromLocalStorage } from '../lib/utils';
import { getAssessments } from '../lib/db';

const merge = (local, remote) => {
  const map = new Map();
  [...local, ...remote].forEach(a => map.set(a.id, a)); // remote overwrites local (más fresco)
  return Array.from(map.values()).sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
};

const History = () => {
  const [assessments, setAssessments] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const load = async () => {
    setLoading(true);
    const local = readFromLocalStorage();
    setAssessments(local.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)));

    try {
      const user = JSON.parse(localStorage.getItem('user') || 'null');
      if (user?.uid && !user?.isDemo) {
        const remote = await getAssessments(user.uid);
        // Sincronizar los remotos al localStorage para acceso offline
        remote.forEach(a => {
          if (!localStorage.getItem(`assessment_${a.id}`)) {
            try { localStorage.setItem(`assessment_${a.id}`, JSON.stringify(a)); } catch { /* cuota */ }
          }
        });
        setAssessments(merge(local, remote));
      }
    } catch { /* sin conexión: mostrar solo los locales */ }

    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const handleDelete = (id) => {
    if (!window.confirm('¿Eliminar este diagnóstico? Esta acción no se puede deshacer.')) return;
    localStorage.removeItem(`assessment_${id}`);
    setAssessments(prev => prev.filter(a => a.id !== id));
  };

  return (
    <div className="container" style={{ paddingTop: '4rem', paddingBottom: '4rem' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '3rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <HistoryIcon size={32} color="var(--color-primary)" />
          <h1 style={{ fontSize: '2.5rem' }}>Historial de Diagnósticos</h1>
        </div>
        <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
          {assessments.length > 0 && (
            <button
              type="button"
              onClick={() => navigate('/assessment')}
              style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', background: 'var(--color-primary)', color: 'white', border: 'none', borderRadius: 'var(--radius)', padding: '0.6rem 1.2rem', fontWeight: 700, fontSize: '0.85rem', cursor: 'pointer' }}
            >
              <Plus size={15} /> Nuevo Diagnóstico
            </button>
          )}
          <button
            type="button"
            onClick={load}
            style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', background: 'white', border: '1px solid var(--color-border)', borderRadius: 'var(--radius)', padding: '0.6rem 1.2rem', fontWeight: 700, fontSize: '0.85rem', cursor: 'pointer', color: 'var(--color-text)' }}
          >
            <RefreshCw size={15} /> Actualizar
          </button>
        </div>
      </div>

      {/* Gráfico de tendencia — solo si hay 2+ diagnósticos */}
      {assessments.length >= 2 && (() => {
        const chartData = [...assessments]
          .sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt))
          .map(a => ({
            fecha: new Date(a.createdAt).toLocaleDateString('es-ES', { day: 'numeric', month: 'short' }),
            puntaje: a.results.total,
            empresa: a.companyInfo?.companyName || 'Sin nombre'
          }));
        const first = chartData[0].puntaje;
        const last = chartData[chartData.length - 1].puntaje;
        const totalDelta = last - first;
        return (
          <div style={{ background: 'white', borderRadius: 'var(--radius-lg)', border: '1px solid #E5E7EB', padding: '2rem 2.5rem', marginBottom: '2.5rem', boxShadow: '0 4px 12px rgba(0,0,0,0.03)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                <TrendingUp size={20} color="var(--color-primary)" />
                <h3 style={{ margin: 0, fontSize: '1rem', fontWeight: 800 }}>Evolución del Puntaje</h3>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <span style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)', fontWeight: 600 }}>
                  {chartData[0].fecha} → {chartData[chartData.length - 1].fecha}
                </span>
                <span style={{
                  fontSize: '0.82rem', fontWeight: 800, padding: '0.2rem 0.75rem',
                  borderRadius: '100px',
                  background: totalDelta >= 0 ? '#F0FDF4' : '#FEF2F2',
                  color: totalDelta >= 0 ? '#166534' : '#991B1B'
                }}>
                  {totalDelta >= 0 ? `↑ +${totalDelta}` : `↓ ${totalDelta}`} pts total
                </span>
              </div>
            </div>
            <div style={{ width: '100%', height: '180px' }}>
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={chartData} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="gradPuntaje" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#4C9B2F" stopOpacity={0.15} />
                      <stop offset="95%" stopColor="#4C9B2F" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#F3F4F6" vertical={false} />
                  <XAxis dataKey="fecha" tick={{ fontSize: 11, fontWeight: 600, fill: '#6B7280' }} axisLine={false} tickLine={false} />
                  <YAxis domain={[0, 100]} tick={{ fontSize: 11, fill: '#6B7280' }} axisLine={false} tickLine={false} />
                  <Tooltip
                    contentStyle={{ borderRadius: '10px', border: 'none', boxShadow: '0 8px 20px rgba(0,0,0,0.1)', fontSize: '0.85rem' }}
                    formatter={(val) => [`${val} pts`, 'Puntaje']}
                    labelFormatter={(label) => `Diagnóstico: ${label}`}
                  />
                  <Area type="monotone" dataKey="puntaje" stroke="#4C9B2F" strokeWidth={2.5} fill="url(#gradPuntaje)" dot={{ fill: '#4C9B2F', strokeWidth: 2, r: 4 }} activeDot={{ r: 6 }} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>
        );
      })()}

      {loading && assessments.length === 0 ? (
        <div style={{ display: 'flex', justifyContent: 'center', padding: '4rem' }}>
          <div className="spinner" />
        </div>
      ) : assessments.length === 0 ? (
        <div className="glass" style={{ padding: '4rem', textAlign: 'center', borderRadius: 'var(--radius-lg)' }}>
          <BarChart2 size={64} opacity={0.2} style={{ marginBottom: '1.5rem' }} />
          <h3>Aún no ha realizado diagnósticos</h3>
          <p style={{ color: 'var(--color-text-muted)', marginBottom: '2rem' }}>Realice su primer autodiagnóstico para ver su progreso aquí.</p>
          <button
            type="button"
            onClick={() => navigate('/assessment')}
            style={{ background: 'var(--color-primary)', color: 'white', padding: '1rem 2.5rem', borderRadius: 'var(--radius)', fontWeight: 800, border: 'none', cursor: 'pointer' }}
          >
            Empezar Nuevo Diagnóstico
          </button>
        </div>
      ) : (
        <div style={{ display: 'grid', gap: '1.5rem' }}>
          {assessments.map((item, idx) => {
            const isFirst = idx === 0;
            const prev = assessments[idx + 1];
            const delta = prev ? item.results.total - prev.results.total : null;
            return (
              <div key={item.id} className="glass card-hover" style={{
                padding: '1.5rem 2.5rem', borderRadius: 'var(--radius)',
                display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                flexWrap: 'wrap', gap: '1.5rem',
                borderLeft: isFirst ? '4px solid var(--color-primary)' : undefined
              }}>
                <div>
                  {isFirst && (
                    <span className="badge" style={{ fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.5px', color: '#4C9B2F', background: '#F0FDF4', marginBottom: '0.5rem' }}>
                      Más reciente
                    </span>
                  )}
                  {item.companyInfo?.companyName && (
                    <p style={{ fontWeight: 800, fontSize: '1.05rem', marginBottom: '0.2rem', color: '#1A2E1A' }}>
                      {item.companyInfo.companyName}
                    </p>
                  )}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem', color: 'var(--color-text-muted)', fontSize: '0.85rem' }}>
                    <Calendar size={16} />
                    {new Date(item.createdAt).toLocaleDateString('es-ES', { day: 'numeric', month: 'long', year: 'numeric' })}
                  </div>
                  {item.companyInfo?.sector && (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', marginBottom: '0.5rem', fontSize: '0.8rem', color: 'var(--color-primary)', fontWeight: 700 }}>
                      <Building2 size={13} />
                      {SECTORS.find(s => s.id === item.companyInfo.sector)?.label}
                      {item.companyInfo.size && (
                        <span style={{ opacity: 0.7, fontWeight: 500 }}>
                          · {SIZES.find(z => z.id === item.companyInfo.size)?.label}
                        </span>
                      )}
                    </div>
                  )}
                  <div style={{ display: 'flex', alignItems: 'baseline', gap: '1rem', flexWrap: 'wrap' }}>
                    <span style={{ fontSize: '1.8rem', fontWeight: 800 }}>{item.results.total} / 100</span>
                    <span className="badge" style={{ background: `var(--level-${item.results.levelInfo.level})`, color: 'white' }}>
                      {item.results.levelInfo.name}
                    </span>
                    {delta !== null && (
                      <span style={{ fontSize: '0.85rem', fontWeight: 800, color: delta >= 0 ? '#4C9B2F' : '#E53E3E' }}>
                        {delta >= 0 ? `↑ +${delta}pts` : `↓ ${delta}pts`} vs anterior
                      </span>
                    )}
                  </div>
                  {/* Mini barras dimensionales */}
                  <div style={{ display: 'flex', gap: '0.6rem', marginTop: '0.75rem', flexWrap: 'wrap' }}>
                    {[{ k: 'D1', l: 'Est' }, { k: 'D2', l: 'Tec' }, { k: 'D3', l: 'Tal' }, { k: 'D4', l: 'Dat' }, { k: 'D5', l: 'Cli' }].map(({ k, l }) => {
                      const val = item.results[k] ?? 0;
                      const c = getScoreColor(val);
                      return (
                        <div key={k} style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                          <span style={{ fontSize: '0.62rem', fontWeight: 700, color: 'var(--color-text-muted)', width: '20px' }}>{l}</span>
                          <div style={{ width: '44px', height: '5px', background: '#F3F4F6', borderRadius: '3px' }}>
                            <div style={{ width: `${val}%`, height: '100%', background: c, borderRadius: '3px' }} />
                          </div>
                          <span style={{ fontSize: '0.62rem', fontWeight: 800, color: c }}>{val}</span>
                        </div>
                      );
                    })}
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
                  <button
                    type="button"
                    className="btn-hover"
                    onClick={() => navigate(`/results/${item.id}`)}
                    style={{ background: 'var(--color-bg)', color: 'var(--color-text)', padding: '0.75rem 1.5rem', borderRadius: 'var(--radius)', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.5rem', border: '1px solid var(--color-border)', cursor: 'pointer' }}
                  >
                    Ver Resultados <ArrowUpRight size={18} />
                  </button>
                  <button
                    type="button"
                    className="btn-hover"
                    onClick={() => navigate(`/roadmap/${item.id}`)}
                    style={{ background: 'var(--color-primary)', color: 'white', padding: '0.75rem 1.5rem', borderRadius: 'var(--radius)', fontWeight: 700, border: 'none', cursor: 'pointer' }}
                  >
                    Hoja de Ruta
                  </button>
                  <button
                    type="button"
                    className="btn-hover"
                    onClick={() => handleDelete(item.id)}
                    title="Eliminar diagnóstico"
                    style={{ background: 'var(--color-danger-light)', color: 'var(--color-danger)', padding: '0.75rem', borderRadius: 'var(--radius)', border: '1px solid var(--color-danger-border)', display: 'flex', alignItems: 'center', cursor: 'pointer' }}
                  >
                    <Trash2 size={17} />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default History;
