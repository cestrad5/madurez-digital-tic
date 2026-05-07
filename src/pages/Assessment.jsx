import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { QUESTIONS, DIMENSIONS } from '../lib/questions';
import { calculateScoring } from '../lib/scoring';
import { ChevronRight, ChevronLeft, CheckCircle2 } from 'lucide-react';

const Assessment = () => {
  const [currentStep, setCurrentStep] = useState(0); // 0-4 (dimensiones)
  const [answers, setAnswers] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

  const currentDimension = DIMENSIONS[currentStep];
  const dimensionQuestions = QUESTIONS.filter(q => q.dimension === currentDimension.id);

  const handleAnswer = (questionId, value) => {
    setAnswers(prev => ({ ...prev, [questionId]: value }));
  };

  const isStepComplete = dimensionQuestions.every(q => answers[q.id]);

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

  const handleSubmit = async () => {
    setIsSubmitting(true);
    // Simular guardado en Firestore
    const results = calculateScoring(answers);
    const assessmentId = Date.now().toString();
    localStorage.setItem(`assessment_${assessmentId}`, JSON.stringify({
      id: assessmentId,
      answers,
      results,
      createdAt: new Date().toISOString()
    }));
    
    // Simular delay
    setTimeout(() => {
      navigate(`/results/${assessmentId}`);
    }, 1500);
  };

  if (isSubmitting) {
    return (
      <div className="container" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '60vh' }}>
        <div className="spinner" style={{
          width: '50px',
          height: '50px',
          border: '5px solid rgba(76, 155, 47, 0.1)',
          borderTop: '5px solid var(--color-primary)',
          borderRadius: '50%',
          animation: 'spin 1s linear infinite',
          marginBottom: '2rem'
        }}></div>
        <h2>Calculando sus resultados...</h2>
        <p style={{ opacity: 0.7 }}>Estamos analizando su madurez digital vs. el benchmark regional.</p>
        <style>{`@keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }`}</style>
      </div>
    );
  }

  return (
    <div className="container" style={{ padding: '4rem 0' }}>
      <div style={{ maxWidth: '800px', margin: '0 auto' }}>
        {/* Progress Header */}
        <div style={{ marginBottom: '3rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem', fontSize: '0.9rem' }}>
            <span style={{ fontWeight: 700, color: 'var(--color-primary)' }}>
              Dimensión {currentStep + 1} de {DIMENSIONS.length}
            </span>
            <span style={{ opacity: 0.6 }}>
              {Math.round(((currentStep) / DIMENSIONS.length) * 100)}% Completado
            </span>
          </div>
          <div style={{ background: 'var(--color-border)', height: '6px', borderRadius: '3px', display: 'flex', gap: '4px' }}>
            {DIMENSIONS.map((_, i) => (
              <div key={i} style={{ 
                flex: 1, 
                height: '100%', 
                background: i <= currentStep ? 'var(--color-primary)' : 'transparent',
                borderRadius: '3px',
                transition: 'var(--transition)'
              }}></div>
            ))}
          </div>
        </div>

        {/* Dimension Info */}
        <div className="glass" style={{ padding: '2rem', borderRadius: 'var(--radius)', marginBottom: '2.5rem', borderLeft: `6px solid ${currentDimension.color}` }}>
          <h2 style={{ marginBottom: '0.5rem' }}>{currentDimension.name}</h2>
          <p style={{ opacity: 0.7, fontSize: '0.95rem' }}>Responda con honestidad para obtener un diagnóstico preciso del estado de su empresa en esta área.</p>
        </div>

        {/* Questions */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
          {dimensionQuestions.map((q, idx) => (
            <div key={q.id} className="glass" style={{ padding: '2rem', borderRadius: 'var(--radius)' }}>
              <p style={{ fontWeight: 600, fontSize: '1.1rem', marginBottom: '1.5rem' }}>
                <span style={{ opacity: 0.4, marginRight: '0.5rem' }}>{idx + 1}.</span> {q.text}
              </p>
              <div style={{ 
                display: 'flex',
                flexWrap: 'wrap',
                gap: '1rem' 
              }}>
                {(q.options || []).map(opt => (
                  <button
                    key={opt.value}
                    type="button"
                    onClick={() => handleAnswer(q.id, opt.value)}
                    style={{
                      flex: '1 1 150px',
                      padding: '1.25rem 1rem',
                      borderRadius: 'var(--radius)',
                      fontSize: '0.9rem',
                      fontWeight: 700,
                      textAlign: 'center',
                      background: answers[q.id] === opt.value ? 'var(--color-primary)' : 'white',
                      color: answers[q.id] === opt.value ? 'white' : 'var(--color-text)',
                      border: answers[q.id] === opt.value ? '1px solid var(--color-primary)' : '1px solid var(--color-border)',
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      gap: '0.5rem',
                      cursor: 'pointer',
                      transition: 'var(--transition)'
                    }}
                  >
                    <span style={{ fontSize: '1.5rem' }}>{opt.value}</span>
                    <span>{opt.label}</span>
                  </button>
                ))}
                {!q.options && <p style={{ color: 'red' }}>Error: No hay opciones para esta pregunta.</p>}
              </div>
            </div>
          ))}
        </div>

        {/* Navigation Buttons */}
        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '4rem' }}>
          <button
            onClick={prevStep}
            disabled={currentStep === 0}
            style={{
              padding: '1rem 2rem',
              borderRadius: 'var(--radius)',
              fontWeight: 700,
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              opacity: currentStep === 0 ? 0.3 : 1,
              background: 'transparent',
              color: 'var(--color-text)',
              border: '1px solid var(--color-border)'
            }}
          >
            <ChevronLeft size={20} /> Anterior
          </button>
          
          <button
            onClick={nextStep}
            disabled={!isStepComplete}
            style={{
              padding: '1rem 3rem',
              borderRadius: 'var(--radius)',
              fontWeight: 700,
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              background: isStepComplete ? 'var(--color-primary)' : 'var(--color-border)',
              color: 'white',
              cursor: isStepComplete ? 'pointer' : 'not-allowed'
            }}
          >
            {currentStep === DIMENSIONS.length - 1 ? 'Finalizar y Ver Resultados' : 'Siguiente'} <ChevronRight size={20} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default Assessment;
