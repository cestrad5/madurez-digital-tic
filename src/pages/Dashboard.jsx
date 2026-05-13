import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell, PieChart, Pie } from 'recharts';
import { SECTORS, getSectorAverages, BENCHMARK_DATA } from '../lib/benchmark';
import { TrendingUp, Users, Target, Zap } from 'lucide-react';

const Dashboard = () => {
  const sectorAverages = getSectorAverages();
  
  // Data para distribución por tamaño
  const sizeDistribution = [
    { name: 'Micro', value: 45, color: '#4C9B2F' },
    { name: 'Pequeña', value: 30, color: '#76B852' },
    { name: 'Mediana', value: 15, color: '#3182CE' },
    { name: 'Grande', value: 10, color: '#1A2E1A' },
  ];

  const colors = ['#4C9B2F', '#3182CE', '#805AD5', '#DD6B20', '#E53E3E', '#38B2AC'];

  return (
    <div className="container" style={{ padding: '4rem 1.5rem' }}>
      <div style={{ marginBottom: '4rem' }}>
        <h1 style={{ fontSize: '2.8rem', color: '#1A2E1A', marginBottom: '1rem' }}>Benchmark Regional TIC</h1>
        <p style={{ color: '#6B7280', fontSize: '1.1rem', maxWidth: '700px' }}>
          Estado de la madurez digital en Antioquia. Datos agregados de más de 250 empresas del sector tecnológico.
        </p>
      </div>

      {/* KPI Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1.5rem', marginBottom: '4rem' }}>
        {[
          { label: 'Promedio Regional', val: '54%', icon: <TrendingUp />, color: '#4C9B2F' },
          { label: 'Empresas Evaluadas', val: '284', icon: <Users />, color: '#3182CE' },
          { label: 'Brecha Digital', val: '42%', icon: <Target />, color: '#E53E3E' },
          { label: 'Sector Líder', val: 'Software', icon: <Zap />, color: '#DD6B20' },
        ].map((kpi, i) => (
          <div key={i} style={{ background: 'white', padding: '2rem', borderRadius: '24px', border: '1px solid #E5E7EB', boxShadow: '0 4px 12px rgba(0,0,0,0.02)' }}>
            <div style={{ color: kpi.color, marginBottom: '1rem' }}>{kpi.icon}</div>
            <div style={{ fontSize: '2rem', fontWeight: 900, color: '#1A2E1A' }}>{kpi.val}</div>
            <div style={{ color: '#6B7280', fontSize: '0.85rem', fontWeight: 700, textTransform: 'uppercase' }}>{kpi.label}</div>
          </div>
        ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '2.5rem' }}>
        {/* Gráfico de Sectores */}
        <div style={{ background: 'white', padding: '2.5rem', borderRadius: '32px', border: '1px solid #E5E7EB', boxShadow: '0 10px 30px rgba(0,0,0,0.03)' }}>
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

        {/* Distribución por Tamaño */}
        <div style={{ background: 'white', padding: '2.5rem', borderRadius: '32px', border: '1px solid #E5E7EB', boxShadow: '0 10px 30px rgba(0,0,0,0.03)' }}>
          <h3 style={{ marginBottom: '2rem', fontSize: '1.3rem', fontWeight: 800 }}>Participación por Tamaño</h3>
          <div style={{ width: '100%', height: '350px', display: 'flex', alignItems: 'center' }}>
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={sizeDistribution}
                  cx="50%"
                  cy="50%"
                  innerRadius={80}
                  outerRadius={120}
                  paddingAngle={8}
                  dataKey="value"
                >
                  {sizeDistribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', paddingLeft: '2rem' }}>
              {sizeDistribution.map((s, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                  <div style={{ width: '12px', height: '12px', borderRadius: '50%', background: s.color }}></div>
                  <span style={{ fontSize: '0.9rem', fontWeight: 700, color: '#374151' }}>{s.name} ({s.value}%)</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Insight Section */}
      <div style={{ marginTop: '4rem', background: '#1A2E1A', padding: '3.5rem', borderRadius: '32px', color: 'white', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'relative', zIndex: 2 }}>
          <h2 style={{ color: 'white', fontSize: '2rem', marginBottom: '1rem' }}>Conclusión Estratégica</h2>
          <p style={{ opacity: 0.85, fontSize: '1.1rem', maxWidth: '800px', lineHeight: '1.7' }}>
            El sector de **Desarrollo de Software** lidera la transformación en la región, sin embargo, existe una brecha crítica en la **Gobernanza de Datos (D4)** en las Micro y Pequeñas empresas. Softline S.A. tiene una oportunidad clave en consultoría de arquitectura escalable para este segmento.
          </p>
        </div>
        <div style={{ position: 'absolute', right: '-50px', bottom: '-50px', opacity: 0.1 }}>
          <TrendingUp size={300} />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
