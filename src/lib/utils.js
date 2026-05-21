export const getScoreColor = (val) =>
  val > 70 ? 'var(--color-score-high)' : val > 40 ? 'var(--color-score-mid)' : 'var(--color-score-low)';

export const getScoreLevelLabel = (val) =>
  val > 75 ? 'Avanzado' : val > 50 ? 'En desarrollo' : 'Inicial';

export const readFromLocalStorage = (userId = null) => {
  const list = [];
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    if (key?.startsWith('assessment_')) {
      try {
        const parsed = JSON.parse(localStorage.getItem(key));
        if (parsed?.id && parsed?.results && parsed?.createdAt) {
          if (userId === null || parsed.userId === userId) list.push(parsed);
        }
      } catch {
        localStorage.removeItem(key);
      }
    }
  }
  return list;
};
