import { Link } from 'react-router-dom';
import { MapPin, Phone, Mail, Linkedin } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="no-print" style={{
      background: 'var(--color-surface)',
      borderTop: '1px solid var(--color-border)',
      padding: '3rem 0',
      marginTop: 'auto',
    }}>
      <div className="container" style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
        gap: '2rem'
      }}>
        <div>
          <h3 style={{ color: 'var(--color-primary)', marginBottom: '1rem' }}>Softline S.A.</h3>
          <p style={{ fontSize: '0.9rem', opacity: 0.8 }}>
            &ldquo;We do IT simple&rdquo;<br />
            Soluciones tecnológicas que agregan valor real a su empresa.
          </p>
        </div>
        <div>
          <h4 style={{ marginBottom: '1rem' }}>Enlaces</h4>
          <ul style={{ listStyle: 'none', fontSize: '0.9rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            <li><a href="https://softline.com.co" target="_blank" rel="noreferrer">Sitio Oficial</a></li>
            <li><Link to="/assessment">Autodiagnóstico</Link></li>
            <li><Link to="/login">Registro</Link></li>
          </ul>
        </div>
        <div>
          <h4 style={{ marginBottom: '1rem' }}>Contacto</h4>
          <ul style={{ listStyle: 'none', fontSize: '0.9rem', display: 'flex', flexDirection: 'column', gap: '0.75rem', padding: 0, margin: 0 }}>
            <li style={{ display: 'flex', alignItems: 'flex-start', gap: '0.6rem', color: 'var(--color-text-muted)' }}>
              <MapPin size={15} style={{ flexShrink: 0, marginTop: '2px', color: 'var(--color-primary)' }} />
              <span>Cl 17C SUR # 44 – 85 Ed. El Nilo Of. 1401, Medellín – Colombia</span>
            </li>
            <li style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
              <Phone size={15} style={{ flexShrink: 0, color: 'var(--color-primary)' }} />
              <span>
                <a href="tel:+573108396929" style={{ color: 'var(--color-primary)', fontWeight: 600 }}>+57 310 839 6929</a>
                {' · '}
                <a href="tel:+576046810044" style={{ color: 'var(--color-primary)', fontWeight: 600 }}>604 681 0044</a>
              </span>
            </li>
            <li style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
              <Mail size={15} style={{ flexShrink: 0, color: 'var(--color-primary)' }} />
              <a href="mailto:gerencia@softline.com.co" style={{ color: 'var(--color-primary)', fontWeight: 600 }}>
                gerencia@softline.com.co
              </a>
            </li>
            <li style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
              <Linkedin size={15} style={{ flexShrink: 0, color: 'var(--color-primary)' }} />
              <a href="https://www.linkedin.com/company/softline-sa" target="_blank" rel="noreferrer" style={{ color: 'var(--color-primary)', fontWeight: 600 }}>
                Softline S.A.
              </a>
            </li>
          </ul>
        </div>
      </div>
      <div className="container" style={{
        marginTop: '3rem',
        paddingTop: '1.5rem',
        borderTop: '1px solid var(--color-border)',
        textAlign: 'center',
        fontSize: '0.8rem',
        color: 'var(--color-text-muted)'
      }}>
        © 2026 Programa UPB-SAPIENCIA. Reto de Innovación Empresarial para Softline S.A.
      </div>
    </footer>
  );
};

export default Footer;
