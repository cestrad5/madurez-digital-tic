import { useState, useEffect, useRef } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Menu, X, Rocket, LogOut, User, ChevronDown, Building2 } from 'lucide-react';
import { signOut } from 'firebase/auth';
import { auth } from '../../lib/firebase';

const Header = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [user, setUser] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();
  const userMenuRef = useRef(null);

  useEffect(() => {
    const refresh = () => {
      try {
        const saved = localStorage.getItem('user');
        setUser(saved ? JSON.parse(saved) : null);
      } catch {
        setUser(null);
      }
    };
    refresh();
    window.addEventListener('storage', refresh);
    window.addEventListener('user-changed', refresh);
    return () => {
      window.removeEventListener('storage', refresh);
      window.removeEventListener('user-changed', refresh);
    };
  }, []);

  useEffect(() => { setShowUserMenu(false); setIsOpen(false); }, [location.pathname]);

  useEffect(() => {
    const handleOutside = (e) => {
      if (userMenuRef.current && !userMenuRef.current.contains(e.target)) {
        setShowUserMenu(false);
      }
    };
    document.addEventListener('mousedown', handleOutside);
    return () => document.removeEventListener('mousedown', handleOutside);
  }, []);

  const handleLogout = async () => {
    setShowUserMenu(false);
    setIsOpen(false);
    try {
      if (!user?.isDemo) await signOut(auth);
    } catch { /* ignorar error de red al cerrar sesión */ }
    localStorage.removeItem('user');
    setUser(null);
    navigate('/');
  };

  const Avatar = ({ size = 32 }) => {
    if (user?.photo) {
      return (
        <img
          src={user.photo}
          alt={user.name}
          style={{ width: size, height: size, borderRadius: '50%', objectFit: 'cover', border: '2px solid var(--color-primary)', flexShrink: 0 }}
        />
      );
    }
    const initials = user?.name?.split(' ').map(n => n[0]).slice(0, 2).join('').toUpperCase() || '?';
    return (
      <div style={{ width: size, height: size, borderRadius: '50%', background: 'var(--color-primary)', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: size * 0.3 + 'px', fontWeight: 800, flexShrink: 0 }}>
        {initials}
      </div>
    );
  };

  return (
    <header className="glass no-print" style={{
      position: 'sticky', top: 0, zIndex: 100,
      padding: '0.75rem 0',
      boxShadow: 'var(--shadow)',
      borderBottom: '1px solid var(--color-border)'
    }}>
      <div className="container" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>

        {/* Logo */}
        <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <div style={{ background: 'var(--color-primary)', color: 'white', padding: '0.5rem', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Rocket size={24} />
          </div>
          <div>
            <span style={{ fontWeight: 700, fontSize: '1.25rem', color: 'var(--color-primary)', letterSpacing: '-0.5px' }}>Softline</span>
            <span style={{ fontWeight: 400, fontSize: '0.8rem', display: 'block', marginTop: '-4px', color: 'var(--color-text-muted)' }}>Madurez Digital</span>
          </div>
        </Link>

        {/* Desktop Nav */}
        <nav style={{ display: 'none', alignItems: 'center', gap: '2rem' }} className="desktop-nav">
          {(user ? [
            { to: '/', label: 'Inicio' },
            { to: '/assessment', label: 'Diagnóstico' },
            { to: '/dashboard', label: 'Benchmark' },
            { to: '/history', label: 'Historial' },
          ] : [
            { to: '/', label: 'Inicio' },
          ]).map(({ to, label }) => {
            const isActive = to === '/' ? location.pathname === '/' : location.pathname.startsWith(to);
            return (
              <Link key={to} to={to} style={{
                fontWeight: 700,
                color: isActive ? 'var(--color-primary)' : 'var(--color-text)',
                borderBottom: isActive ? '2px solid var(--color-primary)' : '2px solid transparent',
                paddingBottom: '2px',
                transition: 'color 0.2s, border-color 0.2s'
              }}>{label}</Link>
            );
          })}

          {user ? (
            <div style={{ position: 'relative' }} ref={userMenuRef}>
              {/* Trigger */}
              <button
                type="button"
                onClick={() => setShowUserMenu(prev => !prev)}
                style={{
                  display: 'flex', alignItems: 'center', gap: '0.5rem',
                  padding: '0.35rem 0.65rem 0.35rem 0.35rem',
                  borderRadius: '100px',
                  background: showUserMenu ? '#F3F4F6' : 'transparent',
                  border: `1px solid ${showUserMenu ? 'var(--color-border)' : 'transparent'}`,
                  cursor: 'pointer',
                  transition: 'background 0.15s, border-color 0.15s',
                }}
              >
                <Avatar size={30} />
                <ChevronDown
                  size={14}
                  style={{ color: 'var(--color-text-muted)', transform: showUserMenu ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'transform 0.2s' }}
                />
              </button>

              {/* Dropdown */}
              {showUserMenu && (
                <div style={{
                  position: 'absolute', right: 0, top: 'calc(100% + 8px)',
                  background: 'white',
                  borderRadius: 'var(--radius)',
                  border: '1px solid var(--color-border)',
                  boxShadow: '0 8px 24px rgba(0,0,0,0.1)',
                  minWidth: '210px',
                  overflow: 'hidden',
                  zIndex: 200,
                  animation: 'fadeInDown 0.15s ease',
                }}>
                  <div style={{ padding: '0.9rem 1rem 0.8rem', borderBottom: '1px solid var(--color-border)' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                      <Avatar size={36} />
                      <div style={{ minWidth: 0 }}>
                        <p style={{ fontWeight: 700, fontSize: '0.875rem', color: 'var(--color-text)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{user.name}</p>
                        {user.email && (
                          <p style={{ fontSize: '0.72rem', color: 'var(--color-text-muted)', marginTop: '0.1rem', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{user.email}</p>
                        )}
                      </div>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => { setShowUserMenu(false); navigate('/profile'); }}
                    style={{
                      width: '100%', display: 'flex', alignItems: 'center', gap: '0.6rem',
                      padding: '0.75rem 1rem',
                      background: 'none', border: 'none', borderBottom: '1px solid var(--color-border)', cursor: 'pointer',
                      color: 'var(--color-text)', fontSize: '0.875rem', fontWeight: 600,
                      textAlign: 'left', transition: 'background 0.15s',
                    }}
                    onMouseEnter={e => { e.currentTarget.style.background = '#F9FAFB'; }}
                    onMouseLeave={e => { e.currentTarget.style.background = 'none'; }}
                  >
                    <Building2 size={15} /> Mi Empresa
                  </button>
                  <button
                    type="button"
                    onClick={handleLogout}
                    style={{
                      width: '100%', display: 'flex', alignItems: 'center', gap: '0.6rem',
                      padding: '0.75rem 1rem',
                      background: 'none', border: 'none', cursor: 'pointer',
                      color: 'var(--color-danger)', fontSize: '0.875rem', fontWeight: 600,
                      textAlign: 'left', transition: 'background 0.15s',
                    }}
                    onMouseEnter={e => { e.currentTarget.style.background = '#FEF2F2'; }}
                    onMouseLeave={e => { e.currentTarget.style.background = 'none'; }}
                  >
                    <LogOut size={15} /> Cerrar sesión
                  </button>
                </div>
              )}
            </div>
          ) : (
            <Link to="/login" style={{ background: 'var(--color-primary)', color: 'white', padding: '0.5rem 1.25rem', borderRadius: 'var(--radius)', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <User size={16} /> Entrar
            </Link>
          )}
        </nav>

        {/* Mobile Toggle */}
        <button
          className="mobile-toggle"
          onClick={() => setIsOpen(!isOpen)}
          style={{ background: 'transparent', color: 'var(--color-text)', border: 'none', cursor: 'pointer' }}
        >
          {isOpen ? <X size={28} /> : <Menu size={28} />}
        </button>
      </div>

      {/* Mobile Menu */}
      <div style={{
        position: 'absolute', top: '100%', left: 0, width: '100%',
        background: 'var(--color-surface)',
        boxShadow: 'var(--shadow-lg)',
        borderTop: '1px solid var(--color-border)',
        overflow: 'hidden',
        maxHeight: isOpen ? '500px' : '0',
        transition: 'max-height 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
        zIndex: 99
      }}>
        <div style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          {user && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', paddingBottom: '1rem', borderBottom: '1px solid var(--color-border)' }}>
              <Avatar size={36} />
              <div>
                <p style={{ fontWeight: 700, fontSize: '0.95rem' }}>{user.name}</p>
                {user.email && <p style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>{user.email}</p>}
              </div>
            </div>
          )}
          {(user ? [
            { to: '/', label: 'Inicio' },
            { to: '/assessment', label: 'Realizar Diagnóstico' },
            { to: '/dashboard', label: 'Benchmark Regional' },
            { to: '/history', label: 'Mi Historial' },
          ] : [
            { to: '/', label: 'Inicio' },
          ]).map(({ to, label }) => {
            const isActive = to === '/' ? location.pathname === '/' : location.pathname.startsWith(to);
            return (
              <Link key={to} to={to} style={{
                fontSize: '1.05rem',
                fontWeight: isActive ? 800 : 600,
                color: isActive ? 'var(--color-primary)' : 'var(--color-text)',
                borderLeft: isActive ? '3px solid var(--color-primary)' : '3px solid transparent',
                paddingLeft: '0.75rem'
              }}>{label}</Link>
            );
          })}
          {user ? (
            <>
              <Link
                to="/profile"
                style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '1.05rem', fontWeight: 600, color: 'var(--color-text)', borderLeft: '3px solid transparent', paddingLeft: '0.75rem' }}
              >
                <Building2 size={18} /> Mi Empresa
              </Link>
              <button
                type="button"
                onClick={handleLogout}
                style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', background: 'var(--color-danger-light)', color: 'var(--color-danger)', border: '1px solid var(--color-danger-border)', borderRadius: 'var(--radius)', padding: '0.75rem', fontWeight: 700, cursor: 'pointer' }}
              >
                <LogOut size={18} /> Cerrar Sesión
              </button>
            </>
          ) : (
            <Link to="/login" style={{ background: 'var(--color-primary)', color: 'white', padding: '0.75rem', borderRadius: 'var(--radius)', textAlign: 'center', fontWeight: 700 }}>
              Iniciar Sesión
            </Link>
          )}
        </div>
      </div>

      {user?.isDemo && (
        <div style={{
          background: '#FEF3C7',
          borderTop: '1px solid #FDE68A',
          padding: '0.4rem',
          textAlign: 'center',
          fontSize: '0.8rem',
          fontWeight: 700,
          color: '#92400E'
        }}>
          Modo Demo — los datos de esta sesión no se guardan ·{' '}
          <button
            type="button"
            onClick={() => {
              localStorage.removeItem('user');
              setUser(null);
              navigate('/login');
            }}
            style={{ color: '#92400E', textDecoration: 'underline', background: 'none', border: 'none', cursor: 'pointer', fontWeight: 700, fontSize: 'inherit', padding: 0 }}
          >
            Crear cuenta real
          </button>
        </div>
      )}

    </header>
  );
};

export default Header;
