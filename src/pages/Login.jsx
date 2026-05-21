import { useState } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { signInWithPopup } from 'firebase/auth';
import { auth, googleProvider } from '../lib/firebase';
import { BarChart3, ArrowLeft } from 'lucide-react';

const btnBase = {
  display: 'block',
  width: '100%',
  padding: '14px 20px',
  borderRadius: 'var(--radius)',
  fontFamily: 'Montserrat, sans-serif',
  fontWeight: '800',
  fontSize: '15px',
  cursor: 'pointer',
  textAlign: 'center',
  boxSizing: 'border-box',
  lineHeight: '1.4',
  appearance: 'none',
  WebkitAppearance: 'none',
};

const Login = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from || '/assessment';
  const [loadingGoogle, setLoadingGoogle] = useState(false);
  const [error, setError] = useState('');

  const handleDemo = () => {
    const demoAssessment = {
      id: 'demo',
      companyInfo: { sector: 'servicios_ti', size: 'pequena' },
      answers: {},
      results: {
        D1: 68, D2: 72, D3: 55, D4: 42, D5: 58,
        total: 60,
        levelInfo: { level: 3, name: 'Definido', description: 'La empresa cuenta con procesos estandarizados y documentados. Existe conciencia digital pero la implementación es parcial y requiere mayor consistencia operativa.' }
      },
      createdAt: new Date().toISOString()
    };
    localStorage.setItem('user', JSON.stringify({ name: 'Usuario Demo', email: 'demo@softline.com', isDemo: true }));
    localStorage.setItem('assessment_demo', JSON.stringify(demoAssessment));
    window.dispatchEvent(new Event('user-changed'));
    navigate('/');
  };

  const handleGoogleLogin = async () => {
    setLoadingGoogle(true);
    setError('');
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const { displayName, email, photoURL, uid } = result.user;
      localStorage.setItem('user', JSON.stringify({ name: displayName, email, photo: photoURL, uid, isDemo: false }));
      window.dispatchEvent(new Event('user-changed'));
      const hasHistory = Object.keys(localStorage).some(k => k.startsWith('assessment_'));
      if (from !== '/assessment') {
        navigate(from);
      } else {
        navigate(hasHistory ? '/' : '/assessment');
      }
    } catch (err) {
      console.error('[Google Login Error]', err.code, err.message);
      if (err.code !== 'auth/popup-closed-by-user') {
        setError('No se pudo iniciar sesión con Google. Intenta de nuevo.');
      }
    } finally {
      setLoadingGoogle(false);
    }
  };

  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: '80vh',
      padding: '2rem'
    }}>
      <div className="glass" style={{
        padding: '2.5rem',
        borderRadius: 'var(--radius-lg)',
        width: '100%',
        maxWidth: '420px',
        textAlign: 'center',
      }}>

        {/* Link volver */}
        <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: '#718096', fontSize: '0.82rem', fontWeight: 600, marginBottom: '1.5rem', justifyContent: 'flex-start' }}>
          <ArrowLeft size={14} /> Volver al inicio
        </Link>

        {/* Icon */}
        <div style={{
          background: '#4C9B2F',
          color: 'white',
          width: '68px',
          height: '68px',
          borderRadius: 'var(--radius-lg)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          margin: '0 auto 1.25rem auto',
        }}>
          <BarChart3 size={34} />
        </div>

        <h2 style={{ margin: '0 0 0.5rem', fontSize: '1.7rem', color: '#1A202C', fontFamily: 'Montserrat, sans-serif' }}>
          Bienvenido
        </h2>
        <p style={{ color: '#718096', marginBottom: '1.75rem', fontSize: '0.9rem' }}>
          Accede para medir y mejorar la madurez digital de tu empresa.
        </p>

        {/* === GOOGLE BUTTON (acción principal) === */}
        <button
          type="button"
          onClick={handleGoogleLogin}
          disabled={loadingGoogle}
          style={{
            ...btnBase,
            background: '#FFFFFF',
            color: loadingGoogle ? '#A0AEC0' : '#1A202C',
            border: '2px solid #CBD5E0',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '10px',
            marginBottom: '12px',
            cursor: loadingGoogle ? 'not-allowed' : 'pointer',
            opacity: loadingGoogle ? 0.7 : 1,
            boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
          }}
        >
          {loadingGoogle ? (
            <>
              <div style={{ width: '18px', height: '18px', border: '2px solid #CBD5E0', borderTop: '2px solid #4285F4', borderRadius: '50%', animation: 'spin 0.8s linear infinite', flexShrink: 0 }} />
              Iniciando sesión...
            </>
          ) : (
            <>
              <svg width="18" height="18" viewBox="0 0 18 18" aria-label="Logo de Google" style={{ flexShrink: 0 }}>
                <path fill="#4285F4" d="M16.51 8H8.98v3h4.3c-.18 1-.74 1.48-1.6 2.04v2.01h2.6a7.8 7.8 0 0 0 2.38-5.88c0-.57-.05-.66-.15-1.18z"/>
                <path fill="#34A853" d="M8.98 17c2.16 0 3.97-.72 5.3-1.94l-2.6-2a4.8 4.8 0 0 1-7.18-2.54H1.83v2.07A8 8 0 0 0 8.98 17z"/>
                <path fill="#FBBC05" d="M4.5 10.52a4.8 4.8 0 0 1 0-3.04V5.41H1.83a8 8 0 0 0 0 7.18z"/>
                <path fill="#EA4335" d="M8.98 4.18c1.17 0 2.23.4 3.06 1.2l2.3-2.3A8 8 0 0 0 1.83 5.4L4.5 7.49a4.77 4.77 0 0 1 4.48-3.3z"/>
              </svg>
              Continuar con Google
            </>
          )}
        </button>

        {/* Divider */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', margin: '16px 0' }}>
          <div style={{ flex: 1, height: '1px', background: '#E2E8F0' }}></div>
          <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#A0AEC0', whiteSpace: 'nowrap' }}>
            O SIN CUENTA
          </span>
          <div style={{ flex: 1, height: '1px', background: '#E2E8F0' }}></div>
        </div>

        {/* === DEMO BUTTON (acción secundaria) === */}
        <button
          type="button"
          onClick={handleDemo}
          style={{
            ...btnBase,
            background: '#F7FAFC',
            color: '#4A5568',
            border: '1.5px solid #E2E8F0',
            marginBottom: '4px',
          }}
        >
          Explorar en modo demo
        </button>
        <p style={{ fontSize: '0.75rem', color: '#A0AEC0', margin: '0 0 4px 0' }}>
          Sin cuenta · Los datos no se guardan
        </p>

        {error && (
          <p style={{ marginTop: '0.75rem', fontSize: '0.8rem', color: '#E53E3E', fontWeight: 600 }}>
            {error}
          </p>
        )}

        <p style={{ marginTop: '1.25rem', fontSize: '0.75rem', color: '#A0AEC0' }}>
          Al continuar acepta nuestros términos conforme a la Ley 1581 de 2012.
        </p>
      </div>
    </div>
  );
};

export default Login;
