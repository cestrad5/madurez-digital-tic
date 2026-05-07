import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Rocket, Github, Chrome } from 'lucide-react';

const Login = () => {
  const navigate = useNavigate();

  const handleGoogleLogin = () => {
    // Simular login exitoso
    localStorage.setItem('user', JSON.stringify({ name: 'Usuario Demo', email: 'camilo@demo.com' }));
    navigate('/assessment');
  };

  return (
    <div className="container" style={{ 
      display: 'flex', 
      alignItems: 'center', 
      justifyContent: 'center', 
      minHeight: '80vh' 
    }}>
      <div className="glass" style={{ 
        padding: '3rem', 
        borderRadius: 'var(--radius-lg)', 
        width: '100%', 
        maxWidth: '450px',
        textAlign: 'center'
      }}>
        <div style={{ 
          background: 'var(--color-primary)', 
          color: 'white', 
          width: '64px', 
          height: '64px', 
          borderRadius: '16px', 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'center',
          margin: '0 auto 2rem auto'
        }}>
          <Rocket size={32} />
        </div>

        <h1 style={{ marginBottom: '0.5rem' }}>Bienvenido</h1>
        <p style={{ opacity: 0.6, marginBottom: '2.5rem' }}>Regístrese para medir su madurez digital y guardar su progreso.</p>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <button 
            onClick={handleGoogleLogin}
            style={{
              padding: '1.25rem',
              borderRadius: 'var(--radius)',
              background: '#FFFFFF',
              color: '#1A202C',
              border: '2px solid #E2E8F0',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '1rem',
              fontWeight: 800,
              fontSize: '1.1rem',
              cursor: 'pointer',
              boxShadow: '0 2px 4px rgba(0,0,0,0.05)'
            }}
          >
            <Chrome size={24} color="#4285F4" /> Continuar con Google
          </button>
          
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', margin: '1rem 0' }}>
            <div style={{ flex: 1, height: '1px', background: '#E2E8F0' }}></div>
            <span style={{ fontSize: '0.8rem', fontWeight: 700, color: '#A0AEC0' }}>O TAMBIÉN</span>
            <div style={{ flex: 1, height: '1px', background: '#E2E8F0' }}></div>
          </div>

          <button 
            style={{
              padding: '1.25rem',
              borderRadius: 'var(--radius)',
              background: '#2D3748',
              color: '#FFFFFF',
              border: 'none',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '1rem',
              fontWeight: 800,
              fontSize: '1.1rem',
              cursor: 'pointer'
            }}
          >
            <Github size={24} /> Continuar con GitHub
          </button>
        </div>

        <p style={{ marginTop: '2.5rem', fontSize: '0.85rem', opacity: 0.5 }}>
          Al continuar, acepta nuestros términos de servicio y políticas de privacidad conforme a la Ley 1581 de 2012.
        </p>
      </div>
    </div>
  );
};

export default Login;
