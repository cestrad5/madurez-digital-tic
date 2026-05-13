import { useNavigate } from 'react-router-dom';

const btnBase = {
  display: 'block',
  width: '100%',
  padding: '14px 20px',
  borderRadius: '12px',
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

  const handleDemo = () => {
    localStorage.setItem('user', JSON.stringify({ 
      name: 'Usuario Demo', 
      email: 'demo@softline.com',
      isDemo: true 
    }));
    navigate('/assessment');
  };

  return (
    <div style={{ 
      display: 'flex', 
      alignItems: 'center', 
      justifyContent: 'center', 
      minHeight: '80vh',
      padding: '2rem'
    }}>
      <div style={{ 
        background: 'white',
        padding: '2.5rem', 
        borderRadius: '1.5rem', 
        width: '100%', 
        maxWidth: '420px',
        textAlign: 'center',
        boxShadow: '0 20px 60px rgba(0,0,0,0.12)',
        border: '1px solid #E2E8F0'
      }}>

        {/* Icon */}
        <div style={{ 
          background: '#4C9B2F', 
          color: 'white', 
          width: '68px', 
          height: '68px', 
          borderRadius: '16px', 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'center',
          margin: '0 auto 1.25rem auto',
          fontSize: '2rem'
        }}>
          🚀
        </div>

        <h2 style={{ margin: '0 0 0.5rem', fontSize: '1.7rem', color: '#1A202C', fontFamily: 'Montserrat, sans-serif' }}>
          Bienvenido
        </h2>
        <p style={{ color: '#718096', marginBottom: '1.75rem', fontSize: '0.9rem' }}>
          Accede para medir y mejorar tu madurez digital.
        </p>

        {/* === DEMO BUTTON === */}
        <button
          type="button"
          onClick={handleDemo}
          style={{
            ...btnBase,
            background: '#4C9B2F',
            color: '#FFFFFF',
            border: '2px solid #3d8026',
            marginBottom: '12px',
            boxShadow: '0 4px 15px rgba(76,155,47,0.35)',
          }}
        >
          🎯 Acceso Demo — Explorar sin cuenta
        </button>

        {/* Divider */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', margin: '16px 0' }}>
          <div style={{ flex: 1, height: '1px', background: '#E2E8F0' }}></div>
          <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#A0AEC0', whiteSpace: 'nowrap' }}>
            O CON TU CUENTA
          </span>
          <div style={{ flex: 1, height: '1px', background: '#E2E8F0' }}></div>
        </div>

        {/* === GOOGLE BUTTON === */}
        <button
          type="button"
          onClick={handleDemo}
          style={{
            ...btnBase,
            background: '#FFFFFF',
            color: '#1A202C',
            border: '2px solid #CBD5E0',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '10px',
            marginBottom: '8px',
          }}
        >
          <svg width="18" height="18" viewBox="0 0 18 18" style={{ flexShrink: 0 }}>
            <path fill="#4285F4" d="M16.51 8H8.98v3h4.3c-.18 1-.74 1.48-1.6 2.04v2.01h2.6a7.8 7.8 0 0 0 2.38-5.88c0-.57-.05-.66-.15-1.18z"/>
            <path fill="#34A853" d="M8.98 17c2.16 0 3.97-.72 5.3-1.94l-2.6-2a4.8 4.8 0 0 1-7.18-2.54H1.83v2.07A8 8 0 0 0 8.98 17z"/>
            <path fill="#FBBC05" d="M4.5 10.52a4.8 4.8 0 0 1 0-3.04V5.41H1.83a8 8 0 0 0 0 7.18z"/>
            <path fill="#EA4335" d="M8.98 4.18c1.17 0 2.23.4 3.06 1.2l2.3-2.3A8 8 0 0 0 1.83 5.4L4.5 7.49a4.77 4.77 0 0 1 4.48-3.3z"/>
          </svg>
          Continuar con Google
        </button>

        <p style={{ marginTop: '1.25rem', fontSize: '0.75rem', color: '#A0AEC0' }}>
          Al continuar acepta nuestros términos conforme a la Ley 1581 de 2012.
        </p>
      </div>
    </div>
  );
};

export default Login;
