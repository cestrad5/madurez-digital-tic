import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { QUESTIONS, DIMENSIONS } from '../lib/questions';
import { calculateScoring } from '../lib/scoring';

const Assessment = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [answers, setAnswers] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

  const currentDimension = DIMENSIONS[currentStep];
  const dimensionQuestions = QUESTIONS.filter(q => q.dimension === currentDimension.id);
  const isStepComplete = dimensionQuestions.every(q => answers[q.id] !== undefined);

  const handleAnswer = (questionId, value) => {
    setAnswers(prev => ({ ...prev, [questionId]: value }));
  };

  const nextStep = () => {
    if (currentStep < DIMENSIONS.length - 1) {
      setCurrentStep(prev => prev + 1);
      window.scrollTo(0, 0);
    } else {
      handleSubmit();
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(prev => prev - 1);
      window.scrollTo(0, 0);
    }
  };

  const handleSubmit = () => {
    setIsSubmitting(true);
    const results = calculateScoring(answers);
    const assessmentId = Date.now().toString();
    localStorage.setItem(`assessment_${assessmentId}`, JSON.stringify({
      id: assessmentId, answers, results,
      createdAt: new Date().toISOString()
    }));
    setTimeout(() => navigate(`/results/${assessmentId}`), 1500);
  };

  if (isSubmitting) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '60vh', gap: '1.5rem' }}>
        <div style={{
          width: '56px', height: '56px',
          border: '5px solid #e5e7eb',
          borderTop: '5px solid #4C9B2F',
          borderRadius: '50%',
          animation: 'spin 1s linear infinite'
        }}></div>
        <h2 style={{ color: '#1A2E1A' }}>Calculando sus resultados...</h2>
        <p style={{ color: '#6B7280' }}>Analizando su madurez digital vs. el benchmark regional.</p>
        <style>{`@keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }`}</style>
      </div>
    );
  }

  const progressPct = Math.round((currentStep / DIMENSIONS.length) * 100);

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto', padding: '3rem 1.5rem' }}>

      {/* Progress */}
      <div style={{ marginBottom: '2.5rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.75rem', fontSize: '0.9rem' }}>
          <span style={{ fontWeight: 700, color: '#4C9B2F' }}>
            Dimensión {currentStep + 1} de {DIMENSIONS.length}
          </span>
          <span style={{ color: '#6B7280' }}>{progressPct}% Completado</span>
        </div>
        <div style={{ background: '#E5E7EB', height: '8px', borderRadius: '4px', display: 'flex', gap: '3px' }}>
          {DIMENSIONS.map((_, i) => (
            <div key={i} style={{
              flex: 1, height: '100%',
              background: i <= currentStep ? '#4C9B2F' : 'transparent',
              borderRadius: '4px',
              transition: 'background 0.3s ease'
            }}></div>
          ))}
        </div>
      </div>

      {/* Dimension Header */}
      <div style={{
        background: 'white', padding: '1.75rem 2rem',
        borderRadius: '12px', marginBottom: '2rem',
        borderLeft: `5px solid ${currentDimension.color}`,
        boxShadow: '0 2px 12px rgba(0,0,0,0.06)'
      }}>
        <h2 style={{ margin: '0 0 0.5rem', color: '#1A2E1A', fontSize: '1.4rem' }}>{currentDimension.name}</h2>
        <p style={{ margin: 0, color: '#6B7280', fontSize: '0.9rem' }}>
          Responda con honestidad para obtener un diagnóstico preciso de su empresa en esta área.
        </p>
      </div>

      {/* Questions */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
        {dimensionQuestions.map((q, idx) => (
          <div key={q.id} style={{
            background: 'white', padding: '1.75rem',
            borderRadius: '12px', boxShadow: '0 2px 12px rgba(0,0,0,0.06)'
          }}>
            <p style={{ fontWeight: 600, fontSize: '1rem', color: '#1A2E1A', marginBottom: '1.25rem', lineHeight: '1.5' }}>
              <span style={{ color: '#9CA3AF', marginRight: '0.5rem' }}>{idx + 1}.</span>
              {q.text}
            </p>

            {/* Answer Options */}
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.75rem' }}>
              {(q.options || []).map(opt => {
                const isSelected = answers[q.id] === opt.value;
                return (
                  <div
                    key={opt.value}
                    role="button"
                    tabIndex={0}
                    onClick={() => handleAnswer(q.id, opt.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleAnswer(q.id, opt.value)}
                    style={{
                      flex: '1 1 130px',
                      padding: '1rem 0.75rem',
                      borderRadius: '10px',
                      fontSize: '0.85rem',
                      fontWeight: 600,
                      textAlign: 'center',
                      cursor: 'pointer',
                      background: isSelected ? '#4C9B2F' : '#F9FAFB',
                      color: isSelected ? '#FFFFFF' : '#374151',
                      border: isSelected ? '2px solid #4C9B2F' : '2px solid #E5E7EB',
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      gap: '0.4rem',
                      transition: 'all 0.2s ease',
                      userSelect: 'none',
                    }}
                  >
                    <span style={{ fontSize: '1.4rem' }}>{opt.value}</span>
                    <span style={{ lineHeight: '1.3' }}>{opt.label}</span>
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      {/* Navigation */}
      <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '3rem', gap: '1rem' }}>
        <div
          role="button"
          tabIndex={0}
          onClick={prevStep}
          onKeyDown={(e) => e.key === 'Enter' && prevStep()}
          style={{
            padding: '0.9rem 1.75rem',
            borderRadius: '10px',
            fontWeight: 700,
            fontSize: '0.95rem',
            cursor: currentStep === 0 ? 'not-allowed' : 'pointer',
            opacity: currentStep === 0 ? 0.35 : 1,
            background: 'white',
            color: '#374151',
            border: '2px solid #E5E7EB',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            userSelect: 'none',
          }}
        >
          ← Anterior
        </div>

        <div
          role="button"
          tabIndex={0}
          onClick={isStepComplete ? nextStep : undefined}
          onKeyDown={(e) => e.key === 'Enter' && isStepComplete && nextStep()}
          style={{
            padding: '0.9rem 2.25rem',
            borderRadius: '10px',
            fontWeight: 800,
            fontSize: '0.95rem',
            cursor: isStepComplete ? 'pointer' : 'not-allowed',
            background: isStepComplete ? '#4C9B2F' : '#D1D5DB',
            color: 'white',
            border: 'none',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            boxShadow: isStepComplete ? '0 4px 14px rgba(76,155,47,0.3)' : 'none',
            userSelect: 'none',
          }}
        >
          {currentStep === DIMENSIONS.length - 1 ? '✅ Finalizar y Ver Resultados' : 'Siguiente →'}
        </div>
      </div>

      {/* Helper text */}
      {!isStepComplete && (
        <p style={{ textAlign: 'center', color: '#9CA3AF', fontSize: '0.82rem', marginTop: '1rem' }}>
          Responde todas las preguntas de esta dimensión para continuar.
        </p>
      )}
    </div>
  );
};

export default Assessment;
