import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { QUESTIONS, DIMENSIONS } from '../lib/questions';
import { calculateScoring } from '../lib/scoring';
import { SECTORS, SIZES } from '../lib/benchmark';
import { ChevronRight, ChevronLeft, Building2, Users, Rocket, Info } from 'lucide-react';

const Assessment = () => {
  const [step, setStep] = useState('profile'); // 'profile' or 'questions'
  const [currentDimensionIdx, setCurrentDimensionIdx] = useState(0);
  const [companyInfo, setCompanyInfo] = useState({ sector: '', size: '' });
  const [answers, setAnswers] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

  const handleAnswer = (questionId, value) => {
    setAnswers(prev => ({ ...prev, [questionId]: value }));
  };

  const startAssessment = () => {
    if (companyInfo.sector && companyInfo.size) {
      setStep('questions');
      window.scrollTo(0, 0);
    }
  };

  const currentDimension = DIMENSIONS[currentDimensionIdx];
  const dimensionQuestions = QUESTIONS.filter(q => q.dimension === currentDimension.id);
  const isDimensionComplete = dimensionQuestions.every(q => answers[q.id] !== undefined);

  const nextStep = () => {
    if (currentDimensionIdx < DIMENSIONS.length - 1) {
      setCurrentDimensionIdx(prev => prev + 1);
      window.scrollTo(0, 0);
    } else {
      handleSubmit();
    }
  };

  const handleSubmit = () => {
    setIsSubmitting(true);
    const results = calculateScoring(answers);
    const assessmentId = Date.now().toString();
    
    localStorage.setItem(`assessment_${assessmentId}`, JSON.stringify({
      id: assessmentId,
      companyInfo,
      answers,
      results,
      createdAt: new Date().toISOString()
    }));
    
    setTimeout(() => navigate(`/results/${assessmentId}`), 2000);
  };

  // --- RENDER: PASO DE PERFIL DE EMPRESA ---
  if (step === 'profile') {
    return (
      <div className="container" style={{ padding: '4rem 1.5rem', maxWidth: '900px' }}>
        <div style={{ textAlign: 'center', marginBottom: '3.5rem' }}>
          <h1 style={{ fontSize: '2.8rem', color: '#1A2E1A', marginBottom: '1rem' }}>Personalice su Diagnóstico</h1>
          <p style={{ color: '#6B7280', fontSize: '1.1rem', maxWidth: '600px', margin: '0 auto' }}>
            Para compararlo con el mercado regional, necesitamos conocer el perfil de su organización.
          </p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', gap: '2.5rem' }}>
          {/* Sub-Sector */}
          <div style={{ background: 'white', padding: '2.5rem', borderRadius: '24px', border: '1px solid #E5E7EB', boxShadow: '0 4px 20px rgba(0,0,0,0.03)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '2rem' }}>
              <div style={{ background: '#ECFDF5', color: '#4C9B2F', padding: '0.6rem', borderRadius: '12px' }}><Building2 /></div>
              <h3 style={{ margin: 0, fontSize: '1.25rem' }}>Sub-sector TIC</h3>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {SECTORS.map(s => (
                <div 
                  key={s.id} 
                  role="button"
                  onClick={() => setCompanyInfo(prev => ({ ...prev, sector: s.id }))}
                  style={{
                    padding: '1rem 1.25rem',
                    borderRadius: '14px',
                    border: companyInfo.sector === s.id ? '2px solid #4C9B2F' : '1px solid #E5E7EB',
                    background: companyInfo.sector === s.id ? '#F0FDF4' : 'white',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '1rem',
                    transition: 'all 0.2s ease',
                    fontWeight: companyInfo.sector === s.id ? 700 : 500,
                    color: companyInfo.sector === s.id ? '#166534' : '#374151'
                  }}
                >
                  <span style={{ fontSize: '1.2rem' }}>{s.icon}</span> {s.label}
                </div>
              ))}
            </div>
          </div>

          {/* Tamaño */}
          <div style={{ background: 'white', padding: '2.5rem', borderRadius: '24px', border: '1px solid #E5E7EB', boxShadow: '0 4px 20px rgba(0,0,0,0.03)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '2rem' }}>
              <div style={{ background: '#EFF6FF', color: '#3182CE', padding: '0.6rem', borderRadius: '12px' }}><Users /></div>
              <h3 style={{ margin: 0, fontSize: '1.25rem' }}>Tamaño de Empresa</h3>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {SIZES.map(z => (
                <div 
                  key={z.id} 
                  role="button"
                  onClick={() => setCompanyInfo(prev => ({ ...prev, size: z.id }))}
                  style={{
                    padding: '1rem 1.25rem',
                    borderRadius: '14px',
                    border: companyInfo.size === z.id ? '2px solid #3182CE' : '1px solid #E5E7EB',
                    background: companyInfo.size === z.id ? '#EFF6FF' : 'white',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '1rem',
                    transition: 'all 0.2s ease',
                    fontWeight: companyInfo.size === z.id ? 700 : 500,
                    color: companyInfo.size === z.id ? '#1E40AF' : '#374151'
                  }}
                >
                  <span style={{ fontSize: '1.2rem' }}>{z.icon}</span> {z.label}
                </div>
              ))}
            </div>
          </div>
        </div>

        <div style={{ textAlign: 'center', marginTop: '4rem' }}>
          <div 
            role="button"
            onClick={startAssessment}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.75rem',
              padding: '1.25rem 4rem',
              borderRadius: '16px',
              background: (companyInfo.sector && companyInfo.size) ? '#1A2E1A' : '#D1D5DB',
              color: 'white',
              fontWeight: 800,
              fontSize: '1.2rem',
              cursor: (companyInfo.sector && companyInfo.size) ? 'pointer' : 'not-allowed',
              transition: 'all 0.3s ease',
              boxShadow: (companyInfo.sector && companyInfo.size) ? '0 10px 25px rgba(0,0,0,0.15)' : 'none'
            }}
          >
            Comenzar Diagnóstico <ChevronRight />
          </div>
        </div>
      </div>
    );
  }

  // --- RENDER: PANTALLA DE CARGA ---
  if (isSubmitting) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '70vh', gap: '2rem' }}>
        <div style={{ width: '64px', height: '64px', border: '6px solid #F3F4F6', borderTop: '6px solid #4C9B2F', borderRadius: '50%', animation: 'spin 1s linear infinite' }}></div>
        <div style={{ textAlign: 'center' }}>
          <h2 style={{ fontSize: '2rem', color: '#1A2E1A' }}>Analizando su madurez...</h2>
          <p style={{ color: '#6B7280', fontSize: '1.1rem' }}>Comparando resultados con empresas del sector <span style={{ fontWeight: 700 }}>{SECTORS.find(s => s.id === companyInfo.sector)?.label}</span>.</p>
        </div>
        <style>{`@keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }`}</style>
      </div>
    );
  }

  // --- RENDER: FORMULARIO DE DIAGNÓSTICO (REDiseño UX) ---
  const colors = ['#E53E3E', '#DD6B20', '#D69E2E', '#76B852', '#4C9B2F'];

  return (
    <div className="container" style={{ padding: '4rem 1.5rem', maxWidth: '850px' }}>
      {/* Progress Bar */}
      <div style={{ marginBottom: '3.5rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
          <span style={{ fontWeight: 800, color: '#4C9B2F', textTransform: 'uppercase', letterSpacing: '1px', fontSize: '0.85rem' }}>
            {currentDimension.name}
          </span>
          <span style={{ color: '#6B7280', fontWeight: 600 }}>{currentDimensionIdx + 1} / {DIMENSIONS.length}</span>
        </div>
        <div style={{ height: '8px', background: '#F3F4F6', borderRadius: '100px', overflow: 'hidden', display: 'flex', gap: '4px' }}>
          {DIMENSIONS.map((_, i) => (
            <div key={i} style={{ flex: 1, background: i <= currentDimensionIdx ? '#4C9B2F' : 'transparent', borderRadius: '100px', transition: 'all 0.4s ease' }}></div>
          ))}
        </div>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '2.5rem' }}>
        {dimensionQuestions.map((q, idx) => (
          <div key={q.id} style={{ background: 'white', padding: '2.5rem', borderRadius: '24px', border: '1px solid #E5E7EB', boxShadow: '0 4px 15px rgba(0,0,0,0.02)' }}>
            <h3 style={{ fontSize: '1.2rem', fontWeight: 700, color: '#1A2E1A', marginBottom: '2rem', lineHeight: '1.5' }}>
              <span style={{ color: '#9CA3AF', marginRight: '0.75rem' }}>{idx + 1}.</span>
              {q.text}
            </h3>

            {/* SEGMENTED CONTROL UI (NUEVA UX) */}
            <div style={{ 
              display: 'flex', 
              background: '#F9FAFB', 
              padding: '0.5rem', 
              borderRadius: '20px', 
              border: '1px solid #E5E7EB',
              gap: '0.5rem',
              position: 'relative'
            }}>
              {q.options.map((opt, i) => {
                const isSelected = answers[q.id] === opt.value;
                return (
                  <div 
                    key={opt.value}
                    role="button"
                    onClick={() => handleAnswer(q.id, opt.value)}
                    style={{
                      flex: 1,
                      padding: '1.25rem 0.5rem',
                      borderRadius: '16px',
                      textAlign: 'center',
                      cursor: 'pointer',
                      transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                      background: isSelected ? colors[i] : 'transparent',
                      color: isSelected ? 'white' : '#4B5563',
                      boxShadow: isSelected ? `0 8px 20px ${colors[i]}44` : 'none',
                      transform: isSelected ? 'scale(1.02)' : 'scale(1)',
                      zIndex: isSelected ? 2 : 1
                    }}
                  >
                    <div style={{ fontSize: '1.4rem', fontWeight: 900, marginBottom: '0.25rem' }}>{opt.value}</div>
                    <div style={{ fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', opacity: isSelected ? 1 : 0.7 }}>{opt.label.split(' / ')[0]}</div>
                  </div>
                );
              })}
            </div>
            {/* Legend for the scale */}
            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '1rem', padding: '0 1rem' }}>
              <span style={{ fontSize: '0.75rem', color: '#9CA3AF', fontWeight: 600 }}>Nivel Inicial</span>
              <span style={{ fontSize: '0.75rem', color: '#9CA3AF', fontWeight: 600 }}>Nivel Optimizado</span>
            </div>
          </div>
        ))}
      </div>

      {/* Navigation */}
      <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '5rem', gap: '1.5rem' }}>
        <div 
          role="button"
          onClick={() => currentDimensionIdx > 0 && setCurrentDimensionIdx(prev => prev - 1)}
          style={{ 
            padding: '1rem 2rem', borderRadius: '14px', fontWeight: 700, cursor: 'pointer',
            background: 'white', color: '#374151', border: '2px solid #E5E7EB',
            display: 'flex', alignItems: 'center', gap: '0.5rem', opacity: currentDimensionIdx === 0 ? 0.3 : 1
          }}
        >
          <ChevronLeft /> Anterior
        </div>

        <div 
          role="button"
          onClick={isDimensionComplete ? nextStep : undefined}
          style={{ 
            padding: '1rem 3.5rem', borderRadius: '14px', fontWeight: 800,
            cursor: isDimensionComplete ? 'pointer' : 'not-allowed',
            background: isDimensionComplete ? '#1A2E1A' : '#D1D5DB',
            color: 'white', display: 'flex', alignItems: 'center', gap: '0.5rem',
            boxShadow: isDimensionComplete ? '0 8px 20px rgba(0,0,0,0.1)' : 'none'
          }}
        >
          {currentDimensionIdx === DIMENSIONS.length - 1 ? 'Finalizar Diagnóstico' : 'Siguiente Dimensión'} <ChevronRight />
        </div>
      </div>
    </div>
  );
};

export default Assessment;
