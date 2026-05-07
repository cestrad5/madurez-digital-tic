export const BENCHMARK_DATA = [
  { sector: 'desarrollo_sw', size: 'micro',    D1: 42, D2: 38, D3: 35, D4: 28, D5: 40, total: 37 },
  { sector: 'desarrollo_sw', size: 'pequena',  D1: 58, D2: 55, D3: 52, D4: 45, D5: 55, total: 54 },
  { sector: 'desarrollo_sw', size: 'mediana',  D1: 72, D2: 70, D3: 65, D4: 62, D5: 68, total: 68 },
  { sector: 'consultoria',   size: 'micro',    D1: 48, D2: 35, D3: 50, D4: 32, D5: 45, total: 42 },
  { sector: 'consultoria',   size: 'pequena',  D1: 65, D2: 52, D3: 68, D4: 50, D5: 62, total: 60 },
  { sector: 'outsourcing',   size: 'micro',    D1: 35, D2: 42, D3: 38, D4: 25, D5: 38, total: 36 },
  { sector: 'outsourcing',   size: 'pequena',  D1: 55, D2: 60, D3: 48, D4: 42, D5: 52, total: 52 },
  { sector: 'ciberseguridad',size: 'pequena',  D1: 68, D2: 78, D3: 62, D4: 58, D5: 55, total: 65 },
  { sector: 'ciberseguridad',size: 'mediana',  D1: 78, D2: 85, D3: 72, D4: 68, D5: 65, total: 75 },
  { sector: 'otro',          size: 'micro',    D1: 30, D2: 30, D3: 30, D4: 25, D5: 35, total: 30 },
];

export function getBenchmarkForCompany(sector, size) {
  const match = BENCHMARK_DATA.find(b => b.sector === sector && b.size === size);
  if (match) return match;
  
  // Si no hay match exacto, buscar por tamaño promedio
  const sizeMatch = BENCHMARK_DATA.filter(b => b.size === size);
  if (sizeMatch.length > 0) {
    const avg = { D1: 0, D2: 0, D3: 0, D4: 0, D5: 0, total: 0 };
    sizeMatch.forEach(b => {
      avg.D1 += b.D1; avg.D2 += b.D2; avg.D3 += b.D3; avg.D4 += b.D4; avg.D5 += b.D5; avg.total += b.total;
    });
    Object.keys(avg).forEach(key => avg[key] = Math.round(avg[key] / sizeMatch.length));
    return avg;
  }

  return BENCHMARK_DATA[0]; // Fallback
}
