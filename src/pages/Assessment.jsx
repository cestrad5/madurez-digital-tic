import { useState, useEffect, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { QUESTIONS, DIMENSIONS } from '../lib/questions';
import { calculateScoring } from '../lib/scoring';
import { SECTORS, SIZES } from '../lib/benchmark';
import { saveAssessment, saveShare } from '../lib/db';
import { REGIONS, COUNTRIES, STATES } from '../lib/locationData';
import { ChevronRight, ChevronLeft, Building2, Users, ArrowRight, Clock, AlertTriangle, Code2, Shield, Server, GraduationCap, CreditCard, Radio, User, Building, Mail, MapPin, Globe2, Waves, Map } from 'lucide-react';
import CustomSelect from '../components/CustomSelect';

const SECTOR_ICONS = {
  software:        <Code2 size={18} />,
  servicios_ti:    <Shield size={18} />,
  infraestructura: <Server size={18} />,
  edtech:          <GraduationCap size={18} />,
  fintech:         <CreditCard size={18} />,
  telecom:         <Radio size={18} />,
};
const SIZE_ICONS = {
  micro:    <User size={18} />,
  pequena:  <Users size={18} />,
  mediana:  <Building size={18} />,
  grande:   <Building2 size={18} />,
};

const DRAFT_KEY = 'assessment_draft';

const SCALE_COLORS = [
  { css: 'var(--level-1)', hex: '#E53E3E' },
  { css: 'var(--level-2)', hex: '#DD6B20' },
  { css: 'var(--level-3)', hex: '#B45309' },
  { css: 'var(--level-4)', hex: '#38A169' },
  { css: 'var(--level-5)', hex: '#4C9B2F' },
];

const Assessment = () => {
  const [step, setStep] = useState('profile');
  const [currentQuestionIdx, setCurrentQuestionIdx] = useState(0);
  const [savedProfile] = useState(() => { try { return JSON.parse(localStorage.getItem('user') || 'null'); } catch { return null; } });
  const [companyInfo, setCompanyInfo] = useState(() => {
    try {
      const user = JSON.parse(localStorage.getItem('user') || 'null');
      return { sector: user?.sector || '', size: user?.size || '', companyName: user?.companyName || '', email: user?.email || '', region: user?.region || '', country: user?.country || '', state: user?.state || '' };
    } catch { return { sector: '', size: '', companyName: '', email: '', region: '', country: '', state: '' }; }
  });
  const [answers, setAnswers] = useState({});
  const [advancing, setAdvancing] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [editingSectorSize, setEditingSectorSize] = useState(() => {
    try {
      const user = JSON.parse(localStorage.getItem('user') || 'null');
      return !(user?.sector && user?.size);
    } catch { return true; }
  });
  const navigate = useNavigate();
  const submitTimerRef = useRef(null);

  // Restore draft on mount
  useEffect(() => {
    try {
      const draft = JSON.parse(sessionStorage.getItem(DRAFT_KEY) || 'null');
      if (draft?.answers && draft?.companyInfo?.sector) {
        setCompanyInfo(draft.companyInfo);
        setAnswers(draft.answers);
        setCurrentQuestionIdx(draft.questionIdx ?? 0);
        setStep('questions');
      }
    } catch { /* draft corrupto, ignorar */ }
    return () => clearTimeout(submitTimerRef.current);
  }, []);

  const saveDraft = useCallback((newAnswers, qIdx, info) => {
    try {
      sessionStorage.setItem(DRAFT_KEY, JSON.stringify({ answers: newAnswers, questionIdx: qIdx, companyInfo: info }));
    } catch { /* cuota agotada, no bloquear */ }
  }, []);

  const startAssessment = () => {
    if (!companyInfo.sector || !companyInfo.size || !companyInfo.region || !companyInfo.country || !companyInfo.state) return;
    sessionStorage.removeItem(DRAFT_KEY);
    setAnswers({});
    setCurrentQuestionIdx(0);
    setStep('questions');
    window.scrollTo(0, 0);
  };

  const question = QUESTIONS[currentQuestionIdx];
  const currentDimension = DIMENSIONS.find(d => d.id === question?.dimension);
  const dimQuestions = QUESTIONS.filter(q => q.dimension === question?.dimension);
  const dimQuestionPos = dimQuestions.findIndex(q => q.id === question?.id) + 1;
  const progress = Math.round(((currentQuestionIdx + (answers[question?.id] !== undefined ? 1 : 0)) / QUESTIONS.length) * 100);
  const isLast = currentQuestionIdx === QUESTIONS.length - 1;

  const goNext = useCallback(() => {
    if (currentQuestionIdx < QUESTIONS.length - 1) {
      setCurrentQuestionIdx(i => i + 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, [currentQuestionIdx]);

  const goPrev = useCallback(() => {
    if (currentQuestionIdx > 0) {
      setCurrentQuestionIdx(i => i - 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, [currentQuestionIdx]);

  const handleAnswer = useCallback((value) => {
    if (advancing) return;
    const newAnswers = { ...answers, [question.id]: value };
    setAnswers(newAnswers);
    const nextIdx = currentQuestionIdx + 1;
    saveDraft(newAnswers, nextIdx < QUESTIONS.length ? nextIdx : currentQuestionIdx, companyInfo);

    if (isLast) return; // stay — submit button appears

    setAdvancing(true);
    submitTimerRef.current = setTimeout(() => {
      setCurrentQuestionIdx(i => i + 1);
      setAdvancing(false);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }, 380);
  }, [advancing, answers, question, currentQuestionIdx, isLast, companyInfo, saveDraft]);

  // Keyboard 1-5 to answer, ← → to navigate
  useEffect(() => {
    if (step !== 'questions') return;
    const handler = (e) => {
      const n = parseInt(e.key);
      if (n >= 1 && n <= 5) { handleAnswer(n); return; }
      if ((e.key === 'ArrowRight' || e.key === 'Enter') && answers[question?.id] !== undefined) { goNext(); return; }
      if (e.key === 'ArrowLeft') { goPrev(); }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [step, handleAnswer, goNext, goPrev, answers, question]);

  const handleSubmit = async () => {
    const allAnswered = QUESTIONS.every(q => answers[q.id] !== undefined);
    if (!allAnswered) return;
    setIsSubmitting(true);
    const results = calculateScoring(answers);
    const assessmentId = Date.now().toString();
    const shareToken = crypto.randomUUID();
    const currentUser = (() => { try { return JSON.parse(localStorage.getItem('user') || 'null'); } catch { return null; } })();
    const userId = currentUser?.uid || (currentUser?.isDemo ? 'demo' : null);
    if (currentUser) {
      try {
        const updates = {};
        if (companyInfo.companyName) updates.companyName = companyInfo.companyName;
        if (companyInfo.sector)      updates.sector      = companyInfo.sector;
        if (companyInfo.size)        updates.size        = companyInfo.size;
        if (companyInfo.region)      updates.region      = companyInfo.region;
        if (companyInfo.country)     updates.country     = companyInfo.country;
        if (companyInfo.state)       updates.state       = companyInfo.state;
        localStorage.setItem('user', JSON.stringify({ ...currentUser, ...updates }));
        window.dispatchEvent(new Event('user-changed'));
      } catch { /* cuota */ }
    }
    const assessmentData = { id: assessmentId, shareToken, companyInfo, answers, results, createdAt: new Date().toISOString(), userId };

    try {
      localStorage.setItem(`assessment_${assessmentId}`, JSON.stringify(assessmentData));
    } catch (e) {
      if (e instanceof DOMException && e.name === 'QuotaExceededError') {
        setIsSubmitting(false);
        alert('No hay espacio en el navegador. Elimine diagnósticos anteriores desde el Historial.');
        return;
      }
      throw e;
    }

    // Guardar en Firestore si el usuario es real
    try {
      const user = JSON.parse(localStorage.getItem('user') || 'null');
      if (user?.uid && !user?.isDemo) {
        await saveAssessment(user.uid, assessmentData);
        await saveShare(shareToken, assessmentData);
      }
    } catch { /* fallo de red: los datos ya están en localStorage */ }

    // Enviar a n8n (fire-and-forget — no bloquea al usuario)
    const n8nPayload = JSON.stringify({
      empresa:      companyInfo.companyName || 'Anónimo',
      correo:       companyInfo.email || null,
      region:       companyInfo.region ? REGIONS.find(r => r.id === companyInfo.region)?.label || companyInfo.region : null,
      pais:         companyInfo.region && companyInfo.country ? COUNTRIES[companyInfo.region]?.find(c => c.id === companyInfo.country)?.label || companyInfo.country : null,
      estado:       companyInfo.state || null,
      sector:       SECTORS.find(s => s.id === companyInfo.sector)?.label || companyInfo.sector,
      tamaño:       SIZES.find(z => z.id === companyInfo.size)?.label || companyInfo.size,
      puntajeTotal: results.total,
      nivel:        results.levelInfo.name,
      dimensiones:  { D1: results.D1, D2: results.D2, D3: results.D3, D4: results.D4, D5: results.D5 },
      fecha:        new Date().toISOString(),
      shareToken
    });
    fetch('https://mairidhmon.app.n8n.cloud/webhook/diagnostico', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: n8nPayload,
      keepalive: true
    })
      .then(r => console.log('[n8n] fetch status:', r.status, r.ok))
      .catch(e => console.error('[n8n] fetch error:', e.message));

    sessionStorage.removeItem(DRAFT_KEY);
    submitTimerRef.current = setTimeout(() => navigate(`/results/${assessmentId}`), 1800);
  };

  // ─── PERFIL ───────────────────────────────────────────────────────────────
  if (step === 'profile') {
    return (
      <div className="container" style={{ paddingTop: '4rem', paddingBottom: '4rem', maxWidth: '900px' }}>
        <div style={{ textAlign: 'center', marginBottom: '3.5rem' }}>
          <h1 style={{ color: '#1A2E1A', marginBottom: '1rem' }}>Personalice su Diagnóstico</h1>
          <p style={{ color: '#6B7280', fontSize: '1.1rem', maxWidth: '600px', margin: '0 auto 1.25rem auto' }}>
            Para compararlo con el mercado regional, necesitamos conocer el perfil de su organización.
          </p>
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', background: '#F0FDF4', color: '#166534', fontSize: '0.82rem', fontWeight: 700, padding: '0.35rem 1rem', borderRadius: '100px', border: '1px solid #BBF7D0' }}>
            <Clock size={13} /> Aproximadamente 10 minutos · 30 preguntas en 5 dimensiones
          </span>
        </div>

        {/* Nombre de empresa + Email */}
        <div style={{ maxWidth: '560px', margin: '0 auto 2.5rem auto', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          <div>
            <label style={{ display: 'block', fontWeight: 700, marginBottom: '0.75rem', fontSize: '1rem', color: '#374151' }}>
              Nombre de su empresa <span style={{ color: 'var(--color-text-muted)', fontWeight: 500, fontSize: '0.88rem' }}>(opcional)</span>
            </label>
            {savedProfile?.companyName ? (
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0.875rem 1.25rem', borderRadius: 'var(--radius)', border: '1.5px solid #E5E7EB', background: '#F9FAFB', fontSize: '1rem', color: '#374151' }}>
                <span style={{ fontWeight: 600 }}>{companyInfo.companyName}</span>
                <a href="/profile" style={{ fontSize: '0.78rem', color: '#4C9B2F', fontWeight: 700, textDecoration: 'none' }}>Editar en Mi Empresa</a>
              </div>
            ) : (
              <input
                type="text"
                placeholder="Ej: TechSolutions S.A.S."
                value={companyInfo.companyName}
                onChange={e => setCompanyInfo(prev => ({ ...prev, companyName: e.target.value }))}
                maxLength={80}
                style={{ width: '100%', padding: '0.875rem 1.25rem', borderRadius: 'var(--radius)', border: '1px solid #E5E7EB', fontSize: '1rem', fontFamily: 'var(--font-body)', outline: 'none', boxSizing: 'border-box', transition: 'border-color 0.2s' }}
                onFocus={e => { e.target.style.borderColor = '#4C9B2F'; e.target.style.boxShadow = '0 0 0 3px rgba(76,155,47,0.12)'; }}
                onBlur={e => { e.target.style.borderColor = '#E5E7EB'; e.target.style.boxShadow = 'none'; }}
              />
            )}
          </div>
          <div>
            <label style={{ display: 'block', fontWeight: 700, marginBottom: '0.75rem', fontSize: '1rem', color: '#374151' }}>
              Correo electrónico <span style={{ color: 'var(--color-text-muted)', fontWeight: 500, fontSize: '0.88rem' }}>(opcional · para recibir sus resultados)</span>
            </label>
            {savedProfile?.email ? (
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.875rem 1.25rem', borderRadius: 'var(--radius)', border: '1.5px solid #E5E7EB', background: '#F9FAFB', fontSize: '1rem', color: '#374151' }}>
                <Mail size={16} color="#9CA3AF" />
                <span style={{ fontWeight: 600 }}>{companyInfo.email}</span>
              </div>
            ) : (
              <div style={{ position: 'relative' }}>
                <Mail size={16} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: '#9CA3AF', pointerEvents: 'none' }} />
                <input
                  type="email"
                  placeholder="correo@empresa.com"
                  value={companyInfo.email}
                  onChange={e => setCompanyInfo(prev => ({ ...prev, email: e.target.value }))}
                  maxLength={120}
                  style={{ width: '100%', padding: '0.875rem 1.25rem 0.875rem 2.75rem', borderRadius: 'var(--radius)', border: '1px solid #E5E7EB', fontSize: '1rem', fontFamily: 'var(--font-body)', outline: 'none', boxSizing: 'border-box', transition: 'border-color 0.2s' }}
                  onFocus={e => { e.target.style.borderColor = '#4C9B2F'; e.target.style.boxShadow = '0 0 0 3px rgba(76,155,47,0.12)'; }}
                  onBlur={e => { e.target.style.borderColor = '#E5E7EB'; e.target.style.boxShadow = 'none'; }}
                />
              </div>
            )}
          </div>
        </div>

        {/* --- UBICACIÓN GEOGRÁFICA --- oculta si ya está en el perfil */}
        {savedProfile?.region && savedProfile?.country && savedProfile?.state ? (
          <div style={{ maxWidth: '560px', margin: '0 auto 2.5rem auto', background: '#FFFBEB', border: '1.5px solid #FDE68A', borderRadius: 'var(--radius-lg)', padding: '1.25rem 1.75rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '1rem', flexWrap: 'wrap' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <div style={{ background: '#FEF3C7', color: '#D97706', padding: '0.5rem', borderRadius: '10px', display: 'flex' }}><MapPin size={18} /></div>
              <div>
                <p style={{ margin: 0, fontSize: '0.72rem', fontWeight: 700, color: '#92400E', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Ubicación guardada</p>
                <p style={{ margin: 0, fontWeight: 700, color: '#1A2E1A', fontSize: '0.95rem' }}>
                  {savedProfile.state} · {COUNTRIES[savedProfile.region]?.find(c => c.id === savedProfile.country)?.label || savedProfile.country}
                </p>
              </div>
            </div>
            <a href="/profile" style={{ background: 'white', border: '1px solid #FDE68A', borderRadius: 'var(--radius)', padding: '0.5rem 1rem', fontWeight: 700, fontSize: '0.82rem', color: '#92400E', cursor: 'pointer', textDecoration: 'none' }}>
              Cambiar
            </a>
          </div>
        ) : (
          <div style={{ maxWidth: '560px', margin: '0 auto 2.5rem auto', background: 'white', padding: '2.5rem', borderRadius: 'var(--radius-lg)', border: '1px solid #E5E7EB', boxShadow: '0 4px 20px rgba(0,0,0,0.03)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '2rem' }}>
              <div style={{ background: '#FEF3C7', color: '#D97706', padding: '0.6rem', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><MapPin size={20} /></div>
              <h3 style={{ margin: 0, fontSize: '1.25rem' }}>Ubicación Geográfica</h3>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              <div>
                <label style={{ display: 'block', fontWeight: 700, marginBottom: '0.75rem', fontSize: '0.9rem', color: '#374151', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Región *</label>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.75rem' }}>
                  {[
                    { id: 'norte_centro_america', label: 'Norteamérica y Centroamérica', Icon: Globe2 },
                    { id: 'caribe',               label: 'Caribe',                       Icon: Waves  },
                    { id: 'sudamerica',            label: 'Sudamérica',                   Icon: Map    },
                  ].map(({ id, label, Icon }) => {
                    const selected = companyInfo.region === id;
                    return (
                      <div key={id} role="button" tabIndex={0}
                        onKeyDown={e => e.key === 'Enter' && setCompanyInfo(prev => ({ ...prev, region: id, country: '', state: '' }))}
                        onClick={() => setCompanyInfo(prev => ({ ...prev, region: id, country: '', state: '' }))}
                        style={{ padding: '1.1rem 0.75rem', borderRadius: 'var(--radius)', border: selected ? '2px solid #4C9B2F' : '1.5px solid #E5E7EB', background: selected ? '#F0FDF4' : 'white', cursor: 'pointer', textAlign: 'center', transition: 'all 0.15s ease', boxShadow: selected ? '0 0 0 3px rgba(76,155,47,0.12)' : 'none' }}
                      >
                        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '0.5rem' }}>
                          <Icon size={22} color={selected ? '#4C9B2F' : '#6B7280'} strokeWidth={1.75} />
                        </div>
                        <div style={{ fontSize: '0.72rem', fontWeight: selected ? 800 : 600, color: selected ? '#4C9B2F' : '#374151', lineHeight: 1.3 }}>{label}</div>
                      </div>
                    );
                  })}
                </div>
              </div>
              <div>
                <label style={{ display: 'block', fontWeight: 700, marginBottom: '0.5rem', fontSize: '0.9rem', color: '#374151', textTransform: 'uppercase', letterSpacing: '0.5px' }}>País *</label>
                <CustomSelect
                  value={companyInfo.country}
                  onChange={val => setCompanyInfo(prev => ({ ...prev, country: val, state: '' }))}
                  disabled={!companyInfo.region}
                  placeholder="Seleccione un país"
                  disabledPlaceholder="— Seleccione primero la región —"
                  options={(companyInfo.region ? COUNTRIES[companyInfo.region] : []).map(c => ({ value: c.id, label: c.label }))}
                />
              </div>
              <div>
                <label style={{ display: 'block', fontWeight: 700, marginBottom: '0.5rem', fontSize: '0.9rem', color: '#374151', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Departamento / Estado / Provincia *</label>
                <CustomSelect
                  value={companyInfo.state}
                  onChange={val => setCompanyInfo(prev => ({ ...prev, state: val }))}
                  disabled={!companyInfo.country}
                  placeholder="Seleccione su departamento / estado"
                  disabledPlaceholder="— Seleccione primero el país —"
                  options={(companyInfo.country ? STATES[companyInfo.country] ?? [] : []).map(s => ({ value: s, label: s }))}
                />
              </div>
            </div>
          </div>
        )}

        {/* Sub-sector + Tamaño — compacto si ya están guardados */}
        {!editingSectorSize && companyInfo.sector && companyInfo.size ? (
          <div style={{ maxWidth: '560px', margin: '0 auto', background: '#F0FDF4', border: '1.5px solid #BBF7D0', borderRadius: 'var(--radius-lg)', padding: '1.25rem 1.75rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '1rem', flexWrap: 'wrap' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <div style={{ background: '#ECFDF5', color: '#4C9B2F', padding: '0.5rem', borderRadius: '10px', display: 'flex' }}><Building2 size={18} /></div>
              <div>
                <p style={{ margin: 0, fontSize: '0.72rem', fontWeight: 700, color: '#166534', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Perfil de empresa guardado</p>
                <p style={{ margin: 0, fontWeight: 700, color: '#1A2E1A', fontSize: '0.95rem' }}>
                  {SECTORS.find(s => s.id === companyInfo.sector)?.label} · {SIZES.find(z => z.id === companyInfo.size)?.label}
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => setEditingSectorSize(true)}
              style={{ background: 'white', border: '1px solid #BBF7D0', borderRadius: 'var(--radius)', padding: '0.5rem 1rem', fontWeight: 700, fontSize: '0.82rem', color: '#166534', cursor: 'pointer' }}
            >
              Cambiar
            </button>
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(350px, 100%), 1fr))', gap: '2.5rem' }}>
            {/* Sub-Sector */}
            <div style={{ background: 'white', padding: '2.5rem', borderRadius: 'var(--radius-lg)', border: '1px solid #E5E7EB', boxShadow: '0 4px 20px rgba(0,0,0,0.03)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '2rem' }}>
                <div style={{ background: '#ECFDF5', color: '#4C9B2F', padding: '0.6rem', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Building2 size={20} /></div>
                <h3 style={{ margin: 0, fontSize: '1.25rem' }}>Sub-sector TIC</h3>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                {SECTORS.map(s => (
                  <div
                    key={s.id}
                    role="button"
                    tabIndex={0}
                    onKeyDown={e => e.key === 'Enter' && setCompanyInfo(prev => ({ ...prev, sector: s.id }))}
                    onClick={() => setCompanyInfo(prev => ({ ...prev, sector: s.id }))}
                    className="card-hover"
                    style={{
                      padding: '1rem 1.25rem', borderRadius: 'var(--radius)',
                      border: companyInfo.sector === s.id ? '2px solid #4C9B2F' : '1px solid #E5E7EB',
                      background: companyInfo.sector === s.id ? '#F0FDF4' : 'white',
                      cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '1rem',
                      fontWeight: companyInfo.sector === s.id ? 700 : 500,
                      color: companyInfo.sector === s.id ? '#166534' : '#374151'
                    }}
                  >
                    <span style={{ display: 'flex', alignItems: 'center' }}>{SECTOR_ICONS[s.id]}</span> {s.label}
                  </div>
                ))}
              </div>
            </div>

            {/* Tamaño */}
            <div style={{ background: 'white', padding: '2.5rem', borderRadius: 'var(--radius-lg)', border: '1px solid #E5E7EB', boxShadow: '0 4px 20px rgba(0,0,0,0.03)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '2rem' }}>
                <div style={{ background: '#EFF6FF', color: '#3182CE', padding: '0.6rem', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Users size={20} /></div>
                <h3 style={{ margin: 0, fontSize: '1.25rem' }}>Tamaño de Empresa</h3>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                {SIZES.map(z => (
                  <div
                    key={z.id}
                    role="button"
                    tabIndex={0}
                    onKeyDown={e => e.key === 'Enter' && setCompanyInfo(prev => ({ ...prev, size: z.id }))}
                    onClick={() => setCompanyInfo(prev => ({ ...prev, size: z.id }))}
                    className="card-hover"
                    style={{
                      padding: '1rem 1.25rem', borderRadius: 'var(--radius)',
                      border: companyInfo.size === z.id ? '2px solid #3182CE' : '1px solid #E5E7EB',
                      background: companyInfo.size === z.id ? '#EFF6FF' : 'white',
                      cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '1rem',
                      fontWeight: companyInfo.size === z.id ? 700 : 500,
                      color: companyInfo.size === z.id ? '#1E40AF' : '#374151'
                    }}
                  >
                    <span style={{ display: 'flex', alignItems: 'center' }}>{SIZE_ICONS[z.id]}</span> {z.label}
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        <div style={{ textAlign: 'center', marginTop: '4rem' }}>
          <button
            type="button"
            className={(companyInfo.sector && companyInfo.size && companyInfo.region && companyInfo.country && companyInfo.state) ? 'btn-hover' : ''}
            onClick={startAssessment}
            disabled={!companyInfo.sector || !companyInfo.size || !companyInfo.region || !companyInfo.country || !companyInfo.state}
            style={{
              display: 'inline-flex', alignItems: 'center', gap: '0.75rem',
              padding: '1.25rem 4rem', borderRadius: 'var(--radius-lg)',
              background: (companyInfo.sector && companyInfo.size && companyInfo.region && companyInfo.country && companyInfo.state) ? '#1A2E1A' : '#D1D5DB',
              color: 'white', fontWeight: 800, fontSize: '1.2rem',
              cursor: (companyInfo.sector && companyInfo.size && companyInfo.region && companyInfo.country && companyInfo.state) ? 'pointer' : 'not-allowed',
              boxShadow: (companyInfo.sector && companyInfo.size && companyInfo.region && companyInfo.country && companyInfo.state) ? '0 10px 25px rgba(0,0,0,0.15)' : 'none',
              border: 'none', transition: 'all 0.3s ease'
            }}
          >
            Comenzar Diagnóstico <ChevronRight />
          </button>
        </div>
      </div>
    );
  }

  // ─── ENVIANDO ─────────────────────────────────────────────────────────────
  if (isSubmitting) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '70vh', gap: '2rem' }}>
        <div className="spinner" style={{ width: '64px', height: '64px', borderWidth: '6px' }}></div>
        <div style={{ textAlign: 'center' }}>
          <h2 style={{ fontSize: '2rem', color: '#1A2E1A' }}>Analizando su madurez...</h2>
          <p style={{ color: '#6B7280', fontSize: '1.1rem' }}>
            Comparando con empresas del sector <strong>{SECTORS.find(s => s.id === companyInfo.sector)?.label}</strong>.
          </p>
        </div>
      </div>
    );
  }

  // ─── PREGUNTA ─────────────────────────────────────────────────────────────
  const selectedValue = answers[question.id];
  const allAnswered = QUESTIONS.every(q => answers[q.id] !== undefined);

  return (
    <div className="container" style={{ paddingTop: '3rem', paddingBottom: '3rem', maxWidth: '780px' }}>

      {/* Mapa de 5 dimensiones */}
      <div style={{ display: 'flex', gap: '6px', marginBottom: '1.25rem' }}>
        {DIMENSIONS.map(dim => {
          const dimQs = QUESTIONS.filter(q => q.dimension === dim.id);
          const answered = dimQs.filter(q => answers[q.id] !== undefined).length;
          const isActive = dim.id === question?.dimension;
          const isComplete = answered === dimQs.length;
          const isTouched = answered > 0 && !isComplete;
          return (
            <div
              key={dim.id}
              title={`${dim.name}: ${answered}/${dimQs.length}`}
              style={{
                flex: 1, height: '8px', borderRadius: '100px',
                background: isComplete ? dim.color : isTouched ? `${dim.color}60` : '#E5E7EB',
                boxShadow: isActive ? `0 0 0 3px ${dim.color}30` : 'none',
                transition: 'all 0.3s ease'
              }}
            />
          );
        })}
      </div>

      {/* Barra de progreso */}
      <div style={{ marginBottom: '1.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.6rem' }}>
          <span style={{ fontWeight: 800, fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '1px', color: currentDimension?.color || '#4C9B2F' }}>
            {currentDimension?.name}
          </span>
          <span style={{ fontSize: '0.78rem', color: 'var(--color-text-muted)', fontWeight: 600 }}>
            · {dimQuestionPos} de {dimQuestions.length} en esta área
          </span>
        </div>
        <div style={{ height: '6px', background: '#F3F4F6', borderRadius: '100px', overflow: 'hidden' }}>
          <div style={{
            width: `${progress}%`, height: '100%',
            background: `linear-gradient(90deg, #4C9B2F, ${currentDimension?.color || '#4C9B2F'})`,
            borderRadius: '100px', transition: 'width 0.4s ease'
          }} />
        </div>
      </div>

      {/* Tarjeta de pregunta */}
      <div style={{
        background: 'white', borderRadius: 'var(--radius-lg)',
        border: '1px solid #E5E7EB', boxShadow: '0 8px 32px rgba(0,0,0,0.05)',
        padding: '2rem 2.5rem 1.75rem',
        opacity: advancing ? 0.4 : 1,
        transition: 'opacity 0.2s ease'
      }}>
        <p style={{ fontSize: '0.75rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '1.5px', color: 'var(--color-text-muted)', marginBottom: '1.25rem' }}>
          Pregunta {currentQuestionIdx + 1}
        </p>
        <h2 style={{ fontSize: '1.35rem', fontWeight: 700, color: '#1A2E1A', lineHeight: '1.55', marginBottom: '1.5rem' }}>
          {question.text}
        </h2>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          {question.options.map((opt, i) => {
            const isSelected = selectedValue === opt.value;
            const { css: color, hex: colorHex } = SCALE_COLORS[i];
            return (
              <button
                key={opt.value}
                type="button"
                onClick={() => handleAnswer(opt.value)}
                style={{
                  display: 'flex', alignItems: 'center', gap: '1rem',
                  padding: '0.75rem 1.25rem', borderRadius: 'var(--radius)', textAlign: 'left',
                  cursor: 'pointer', width: '100%',
                  border: isSelected ? `2px solid ${color}` : '2px solid #E5E7EB',
                  background: isSelected ? `${colorHex}12` : 'white',
                  transition: 'all 0.18s ease',
                  transform: isSelected ? 'scale(1.01)' : 'scale(1)',
                  boxShadow: isSelected ? `0 4px 16px ${colorHex}30` : 'none'
                }}
              >
                <span style={{
                  width: '28px', height: '28px', borderRadius: '50%', flexShrink: 0,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontWeight: 900, fontSize: '0.85rem',
                  background: isSelected ? color : '#F3F4F6',
                  color: isSelected ? 'white' : '#6B7280'
                }}>
                  {opt.value}
                </span>
                <div>
                  <p style={{ fontWeight: isSelected ? 700 : 500, color: isSelected ? '#1A2E1A' : '#374151', fontSize: '0.98rem', margin: 0 }}>
                    {opt.label}
                  </p>
                </div>
                {isSelected && <ArrowRight size={18} style={{ marginLeft: 'auto', color, flexShrink: 0 }} />}
              </button>
            );
          })}
        </div>

        <p style={{ marginTop: '1.25rem', fontSize: '0.75rem', color: 'var(--color-text-muted)', textAlign: 'center' }}>
          Tip: usa las teclas 1-5 para responder, ← → para navegar
        </p>
      </div>

      {/* Advertencia preguntas sin responder */}
      {isLast && !allAnswered && (() => {
        const unanswered = QUESTIONS.filter(q => answers[q.id] === undefined);
        return (
          <div style={{
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            background: '#FEF3C7', border: '1px solid #FDE68A',
            borderRadius: 'var(--radius)', padding: '0.85rem 1.25rem',
            marginTop: '1.5rem', gap: '1rem', flexWrap: 'wrap'
          }}>
            <span style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.88rem', fontWeight: 700, color: '#92400E' }}>
              <AlertTriangle size={15} /> {unanswered.length} pregunta{unanswered.length !== 1 ? 's' : ''} sin responder
            </span>
            <button
              type="button"
              onClick={() => setCurrentQuestionIdx(QUESTIONS.findIndex(q => answers[q.id] === undefined))}
              style={{ fontSize: '0.82rem', fontWeight: 700, color: '#92400E', background: '#FDE68A', border: 'none', borderRadius: '8px', padding: '0.3rem 0.85rem', cursor: 'pointer' }}
            >
              Ir a primera sin responder
            </button>
          </div>
        );
      })()}

      {/* Navegación */}
      <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '2rem', gap: '1rem', flexWrap: 'wrap' }}>
        <button
          type="button"
          onClick={goPrev}
          disabled={currentQuestionIdx === 0}
          style={{
            padding: '0.9rem 1.75rem', borderRadius: 'var(--radius)', fontWeight: 700,
            background: 'white', color: '#374151', border: '2px solid #E5E7EB',
            display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer',
            opacity: currentQuestionIdx === 0 ? 0.3 : 1, transition: 'opacity 0.2s'
          }}
        >
          <ChevronLeft size={18} /> Anterior
        </button>

        {isLast ? (
          <button
            type="button"
            className={allAnswered ? 'btn-hover' : ''}
            onClick={handleSubmit}
            disabled={!allAnswered}
            style={{
              padding: '0.9rem 2.5rem', borderRadius: 'var(--radius)', fontWeight: 800,
              background: allAnswered ? '#1A2E1A' : '#D1D5DB', color: 'white',
              border: 'none', display: 'flex', alignItems: 'center', gap: '0.5rem',
              cursor: allAnswered ? 'pointer' : 'not-allowed',
              boxShadow: allAnswered ? '0 8px 20px rgba(0,0,0,0.15)' : 'none'
            }}
          >
            Finalizar Diagnóstico <ChevronRight size={18} />
          </button>
        ) : (
          <button
            type="button"
            onClick={goNext}
            disabled={selectedValue === undefined}
            style={{
              padding: '0.9rem 2rem', borderRadius: 'var(--radius)', fontWeight: 700,
              background: selectedValue !== undefined ? '#F0FDF4' : '#F9FAFB',
              color: selectedValue !== undefined ? '#166534' : '#9CA3AF',
              border: `2px solid ${selectedValue !== undefined ? '#86EFAC' : '#E5E7EB'}`,
              display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer'
            }}
          >
            Siguiente <ChevronRight size={18} />
          </button>
        )}
      </div>
    </div>
  );
};

export default Assessment;
