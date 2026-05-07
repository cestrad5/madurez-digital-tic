import React from 'react';

const Footer = () => {
  return (
    <footer style={{
      background: 'var(--color-surface)',
      borderTop: '1px solid var(--color-border)',
      padding: '3rem 0',
      marginTop: 'auto'
    }}>
      <div className="container" style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
        gap: '2rem'
      }}>
        <div>
          <h3 style={{ color: 'var(--color-primary)', marginBottom: '1rem' }}>Softline S.A.</h3>
          <p style={{ fontSize: '0.9rem', opacity: 0.8 }}>
            "We do IT simple"<br />
            Soluciones tecnológicas que agregan valor real a su empresa.
          </p>
        </div>
        <div>
          <h4 style={{ marginBottom: '1rem' }}>Enlaces</h4>
          <ul style={{ listStyle: 'none', fontSize: '0.9rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            <li><a href="https://softline.com.co" target="_blank" rel="noreferrer">Sitio Oficial</a></li>
            <li><a href="/assessment">Autodiagnóstico</a></li>
            <li><a href="/login">Registro</a></li>
          </ul>
        </div>
        <div>
          <h4 style={{ marginBottom: '1rem' }}>Contacto</h4>
          <p style={{ fontSize: '0.9rem', opacity: 0.8 }}>
            Antioquia, Colombia<br />
            gerencia@softline.com.co
          </p>
        </div>
      </div>
      <div className="container" style={{
        marginTop: '3rem',
        paddingTop: '1.5rem',
        borderTop: '1px solid var(--color-border)',
        textAlign: 'center',
        fontSize: '0.8rem',
        opacity: 0.6
      }}>
        © 2026 Programa UPB-SAPIENCIA. Reto de Innovación Empresarial para Softline S.A.
      </div>
    </footer>
  );
};

export default Footer;
