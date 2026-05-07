import { DIMENSIONS } from './questions';

export function calculateScoring(answers) {
  const dimensionScores = {};
  
  DIMENSIONS.forEach(dim => {
    // Filtrar respuestas de esta dimensión
    const dimAnswers = Object.entries(answers)
      .filter(([id]) => {
        const questionId = parseInt(id);
        if (dim.id === 'D1') return questionId >= 1 && questionId <= 6;
        if (dim.id === 'D2') return questionId >= 7 && questionId <= 12;
        if (dim.id === 'D3') return questionId >= 13 && questionId <= 18;
        if (dim.id === 'D4') return questionId >= 19 && questionId <= 24;
        if (dim.id === 'D5') return questionId >= 25 && questionId <= 30;
        return false;
      })
      .map(([, value]) => value);

    if (dimAnswers.length === 0) {
      dimensionScores[dim.id] = 0;
    } else {
      // Promedio (escala 1-5) -> convertir a escala 0-100
      // formula: ((sum / n) - 1) * 25
      const sum = dimAnswers.reduce((a, b) => a + b, 0);
      const avg = sum / dimAnswers.length;
      dimensionScores[dim.id] = Math.round((avg - 1) * 25);
    }
  });

  // Calcular total ponderado
  let totalScore = 0;
  DIMENSIONS.forEach(dim => {
    totalScore += dimensionScores[dim.id] * dim.weight;
  });

  totalScore = Math.round(totalScore);

  return {
    ...dimensionScores,
    total: totalScore,
    levelInfo: getLevelInfo(totalScore)
  };
}

export function getLevelInfo(score) {
  if (score <= 30) return { level: 1, name: 'Inicial', description: 'La empresa tiene procesos digitales ad-hoc y carece de una estrategia formal.' };
  if (score <= 50) return { level: 2, name: 'En Desarrollo', description: 'Existen iniciativas digitales aisladas, pero falta integración y visión estratégica.' };
  if (score <= 70) return { level: 3, name: 'Definido', description: 'La empresa cuenta con procesos estandarizados y una hoja de ruta digital clara.' };
  if (score <= 85) return { level: 4, name: 'Gestionado', description: 'La tecnología es un habilitador clave del negocio con métricas de desempeño claras.' };
  return { level: 5, name: 'Optimizado', description: 'Referente digital con cultura de innovación continua y toma de decisiones basada en datos.' };
}
