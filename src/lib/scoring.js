import { DIMENSIONS, QUESTIONS } from './questions';

export function calculateScoring(answers) {
  const dimensionScores = {};

  DIMENSIONS.forEach(dim => {
    const dimAnswers = QUESTIONS
      .filter(q => q.dimension === dim.id)
      .map(q => answers[q.id])
      .filter(v => v !== undefined);

    if (dimAnswers.length === 0) {
      dimensionScores[dim.id] = 0;
    } else {
      const sum = dimAnswers.reduce((a, b) => a + b, 0);
      const avg = sum / dimAnswers.length;
      // escala 1-5 → 0-100
      dimensionScores[dim.id] = Math.round((avg - 1) * 25);
    }
  });

  let totalScore = 0;
  DIMENSIONS.forEach(dim => {
    totalScore += dimensionScores[dim.id] * dim.weight;
  });

  return {
    ...dimensionScores,
    total: Math.round(totalScore),
    levelInfo: getLevelInfo(Math.round(totalScore))
  };
}

export function getLevelInfo(score) {
  if (score <= 30) return { level: 1, name: 'Inicial',       description: 'La empresa tiene procesos digitales ad-hoc y carece de una estrategia formal.' };
  if (score <= 50) return { level: 2, name: 'En Desarrollo', description: 'Existen iniciativas digitales aisladas, pero falta integración y visión estratégica.' };
  if (score <= 70) return { level: 3, name: 'Definido',      description: 'La empresa cuenta con procesos estandarizados y una hoja de ruta digital clara.' };
  if (score <= 85) return { level: 4, name: 'Gestionado',    description: 'La tecnología es un habilitador clave del negocio con métricas de desempeño claras.' };
  return             { level: 5, name: 'Optimizado',    description: 'Referente digital con cultura de innovación continua y toma de decisiones basada en datos.' };
}
