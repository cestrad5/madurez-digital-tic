// Categorías estandarizadas para la industria TIC
export const SECTORS = [
  { id: 'software', label: 'Desarrollo de Software & Apps', icon: '💻' },
  { id: 'servicios_ti', label: 'Servicios TI & Consultoría', icon: '🛡️' },
  { id: 'infraestructura', label: 'Infraestructura & Hardware', icon: '🏗️' },
  { id: 'edtech', label: 'EdTech & Formación Digital', icon: '🎓' },
  { id: 'fintech', label: 'Fintech & E-commerce', icon: '💳' },
  { id: 'telecom', label: 'Telecomunicaciones', icon: '📡' },
];

export const SIZES = [
  { id: 'micro', label: 'Micro (1-10 emp.)', icon: '🌱' },
  { id: 'pequena', label: 'Pequeña (11-50 emp.)', icon: '🌿' },
  { id: 'mediana', label: 'Mediana (51-200 emp.)', icon: '🌳' },
  { id: 'grande', label: 'Grande (+200 emp.)', icon: '🏙️' },
];

// Generación de data simulada para el benchmark regional (Antioquia TIC)
// Esto simula promedios de madurez por cada combinación de sector/tamaño
const generateBenchmarkData = () => {
  const data = [];
  SECTORS.forEach(sector => {
    SIZES.forEach(size => {
      // Base de madurez según tamaño (más grandes suelen tener más procesos)
      let base = size.id === 'micro' ? 30 : size.id === 'pequena' ? 45 : size.id === 'mediana' ? 60 : 75;
      
      // Ajuste por sector
      if (sector.id === 'software') base += 10;
      if (sector.id === 'telecom') base += 5;
      
      data.push({
        sector: sector.id,
        size: size.id,
        D1: Math.min(95, base + Math.floor(Math.random() * 15)),
        D2: Math.min(95, base + Math.floor(Math.random() * 15)),
        D3: Math.min(95, base + Math.floor(Math.random() * 15)),
        D4: Math.min(95, base + Math.floor(Math.random() * 15)),
        D5: Math.min(95, base + Math.floor(Math.random() * 15)),
        total: 0 // Se calcula abajo
      });
    });
  });

  return data.map(d => ({
    ...d,
    total: Math.round((d.D1 + d.D2 + d.D3 + d.D4 + d.D5) / 5)
  }));
};

export const BENCHMARK_DATA = generateBenchmarkData();

export function getBenchmarkForCompany(sectorId, sizeId) {
  const match = BENCHMARK_DATA.find(b => b.sector === sectorId && b.size === sizeId);
  return match || BENCHMARK_DATA[0];
}

// Data para el Dashboard Global (Promedios por sector)
export function getSectorAverages() {
  return SECTORS.map(s => {
    const sectorData = BENCHMARK_DATA.filter(b => b.sector === s.id);
    const avg = sectorData.reduce((acc, curr) => acc + curr.total, 0) / sectorData.length;
    return { name: s.label, score: Math.round(avg) };
  });
}
