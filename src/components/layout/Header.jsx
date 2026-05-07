import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Menu, X, Rocket, User } from 'lucide-react';
import { useState } from 'react';

const Header = () => {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();

  return (
    <header className="glass no-print" style={{
      position: 'sticky',
      top: 0,
      zIndex: 100,
      padding: '0.75rem 0',
      boxShadow: 'var(--shadow)',
      borderBottom: '1px solid var(--color-border)'
    }}>
      <div className="container" style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
      }}>
        <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <div style={{
            background: 'var(--color-primary)',
            color: 'white',
            padding: '0.5rem',
            borderRadius: '10px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <Rocket size={24} />
          </div>
          <div>
            <span style={{ 
              fontWeight: 700, 
              fontSize: '1.25rem', 
              color: 'var(--color-primary)',
              letterSpacing: '-0.5px'
            }}>Softline</span>
            <span style={{ 
              fontWeight: 400, 
              fontSize: '0.8rem', 
              display: 'block', 
              marginTop: '-4px',
              opacity: 0.8
            }}>Madurez Digital</span>
          </div>
        </Link>

        {/* Desktop Nav */}
        <nav style={{ display: 'none', gap: '2rem' }} className="desktop-nav">
          <Link to="/" style={{ fontWeight: 600 }}>Inicio</Link>
          <Link to="/assessment" style={{ fontWeight: 600 }}>Diagnóstico</Link>
          <Link to="/history" style={{ fontWeight: 600 }}>Historial</Link>
          <Link to="/login" style={{
            background: 'var(--color-primary)',
            color: 'white',
            padding: '0.5rem 1.25rem',
            borderRadius: 'var(--radius)',
            fontWeight: 600
          }}>Entrar</Link>
        </nav>

        {/* Mobile Toggle */}
        <button 
          onClick={() => setIsOpen(!isOpen)}
          style={{ background: 'transparent', color: 'var(--color-text)' }}
        >
          {isOpen ? <X size={28} /> : <Menu size={28} />}
        </button>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div style={{
          position: 'absolute',
          top: '100%',
          left: 0,
          width: '100%',
          background: 'var(--color-surface)',
          padding: '1.5rem',
          display: 'flex',
          flexDirection: 'column',
          gap: '1.5rem',
          boxShadow: 'var(--shadow-lg)',
          borderTop: '1px solid var(--color-border)'
        }}>
          <Link to="/" onClick={() => setIsOpen(false)} style={{ fontSize: '1.1rem', fontWeight: 600 }}>Inicio</Link>
          <Link to="/assessment" onClick={() => setIsOpen(false)} style={{ fontSize: '1.1rem', fontWeight: 600 }}>Realizar Diagnóstico</Link>
          <Link to="/history" onClick={() => setIsOpen(false)} style={{ fontSize: '1.1rem', fontWeight: 600 }}>Mi Historial</Link>
          <Link to="/login" onClick={() => setIsOpen(false)} style={{
            background: 'var(--color-primary)',
            color: 'white',
            padding: '0.75rem',
            borderRadius: 'var(--radius)',
            textAlign: 'center',
            fontWeight: 700
          }}>Iniciar Sesión</Link>
        </div>
      )}

      <style>{`
        @media (min-width: 768px) {
          .desktop-nav { display: flex !important; }
          button { display: none !important; }
        }
      `}</style>
    </header>
  );
};

export default Header;
