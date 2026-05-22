import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Building2, MapPin, Globe2, Waves, Map, Save, Check, ArrowLeft, AlertCircle } from 'lucide-react';
import { COUNTRIES, STATES } from '../lib/locationData';
import CustomSelect from '../components/CustomSelect';

const REGIONS_LIST = [
  { id: 'norte_centro_america', label: 'Norteamérica y Centroamérica', Icon: Globe2 },
  { id: 'caribe',               label: 'Caribe',                       Icon: Waves  },
  { id: 'sudamerica',           label: 'Sudamérica',                   Icon: Map    },
];

const ErrorMsg = ({ msg }) =>
  msg ? (
    <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', marginTop: '0.45rem', color: '#DC2626', fontSize: '0.82rem', fontWeight: 600 }}>
      <AlertCircle size={13} /> {msg}
    </div>
  ) : null;

const Profile = () => {
  const navigate = useNavigate();
  const [saved, setSaved] = useState(false);
  const [errors, setErrors] = useState({});
  const [showBanner, setShowBanner] = useState(false);
  const bannerRef = useRef(null);

  const [form, setForm] = useState(() => {
    try {
      const user = JSON.parse(localStorage.getItem('user') || 'null');
      return {
        companyName: user?.companyName || '',
        region:      user?.region      || '',
        country:     user?.country     || '',
        state:       user?.state       || '',
      };
    } catch {
      return { companyName: '', region: '', country: '', state: '' };
    }
  });

  const clearError = (field) => setErrors(p => ({ ...p, [field]: '' }));

  const setRegion = (id) => {
    setForm(p => ({ ...p, region: id, country: '', state: '' }));
    clearError('region');
  };

  const validate = () => {
    const e = {};
    if (!form.region)  e.region  = 'Seleccione una región';
    if (!form.country) e.country = 'Seleccione un país';
    if (!form.state)   e.state   = 'Seleccione un departamento / estado / provincia';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSave = () => {
    if (!validate()) {
      setShowBanner(true);
      setTimeout(() => bannerRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' }), 50);
      return;
    }
    setShowBanner(false);
    try {
      const user = JSON.parse(localStorage.getItem('user') || 'null');
      if (!user) return;
      const updates = { region: form.region, country: form.country, state: form.state };
      if (form.companyName) updates.companyName = form.companyName;
      localStorage.setItem('user', JSON.stringify({ ...user, ...updates }));
      window.dispatchEvent(new Event('user-changed'));
      setSaved(true);
      setTimeout(() => setSaved(false), 2500);
    } catch { /* cuota */ }
  };

  const labelStyle = {
    display: 'block', fontWeight: 700, marginBottom: '0.5rem',
    fontSize: '0.85rem', color: '#374151', textTransform: 'uppercase', letterSpacing: '0.5px',
  };

  const cardStyle = {
    background: 'white', padding: '2rem 2.5rem',
    borderRadius: 'var(--radius-lg)', border: '1px solid #E5E7EB',
    boxShadow: '0 4px 20px rgba(0,0,0,0.03)', marginBottom: '1.5rem',
  };

  const iconBadge = (bg, color, Icon) => (
    <div style={{ background: bg, color, padding: '0.6rem', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <Icon size={20} />
    </div>
  );

  return (
    <div className="container" style={{ paddingTop: '3rem', paddingBottom: '4rem', maxWidth: '600px' }}>

      <button
        type="button"
        onClick={() => navigate(-1)}
        style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', background: 'none', border: 'none', cursor: 'pointer', color: 'var(--color-text-muted)', fontWeight: 600, fontSize: '0.875rem', marginBottom: '2rem', padding: 0 }}
      >
        <ArrowLeft size={15} /> Volver
      </button>

      <h1 style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>Mi Empresa</h1>
      <p style={{ color: 'var(--color-text-muted)', marginBottom: '2.5rem', fontSize: '0.95rem' }}>
        La ubicación es obligatoria. El nombre de la empresa es opcional y se pre-llena en cada diagnóstico.
      </p>

      {/* Nombre de la empresa — opcional */}
      <div style={cardStyle}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.5rem' }}>
          {iconBadge('#ECFDF5', '#4C9B2F', Building2)}
          <div>
            <h3 style={{ margin: 0, fontSize: '1.1rem' }}>Nombre de la Empresa</h3>
            <span style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', fontWeight: 600 }}>Opcional</span>
          </div>
        </div>
        <label style={labelStyle}>Nombre</label>
        <input
          type="text"
          value={form.companyName}
          onChange={e => setForm(p => ({ ...p, companyName: e.target.value }))}
          placeholder="Ej. Softline S.A.S."
          maxLength={100}
          style={{ width: '100%', padding: '0.875rem 1.25rem', borderRadius: 'var(--radius)', border: '1.5px solid #E5E7EB', fontSize: '1rem', outline: 'none', boxSizing: 'border-box', transition: 'border-color 0.2s, box-shadow 0.2s', fontFamily: 'var(--font-body)' }}
          onFocus={e => { e.target.style.borderColor = '#4C9B2F'; e.target.style.boxShadow = '0 0 0 3px rgba(76,155,47,0.12)'; }}
          onBlur={e => { e.target.style.borderColor = '#E5E7EB'; e.target.style.boxShadow = 'none'; }}
        />
      </div>

      {/* Banner de error general */}
      {showBanner && (
        <div ref={bannerRef} style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', background: '#FEF2F2', border: '1.5px solid #FECACA', borderRadius: 'var(--radius)', padding: '1rem 1.25rem', marginBottom: '1.25rem' }}>
          <AlertCircle size={18} color="#DC2626" style={{ flexShrink: 0 }} />
          <p style={{ margin: 0, color: '#991B1B', fontWeight: 600, fontSize: '0.9rem' }}>
            Complete los campos de ubicación geográfica para guardar los cambios.
          </p>
        </div>
      )}

      {/* Ubicación — obligatoria */}
      <div style={{ ...cardStyle, border: (errors.region || errors.country || errors.state) ? '1.5px solid #FECACA' : '1px solid #E5E7EB' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.75rem' }}>
          {iconBadge('#FEF3C7', '#D97706', MapPin)}
          <div>
            <h3 style={{ margin: 0, fontSize: '1.1rem' }}>Ubicación Geográfica</h3>
            <span style={{ fontSize: '0.75rem', color: '#DC2626', fontWeight: 600 }}>Obligatoria</span>
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          {/* Región */}
          <div>
            <label style={{ ...labelStyle, color: errors.region ? '#DC2626' : '#374151' }}>Región *</label>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.75rem' }}>
              {REGIONS_LIST.map(({ id, label, Icon }) => {
                const selected = form.region === id;
                return (
                  <div
                    key={id}
                    role="button"
                    tabIndex={0}
                    onClick={() => setRegion(id)}
                    onKeyDown={e => e.key === 'Enter' && setRegion(id)}
                    style={{
                      padding: '1.1rem 0.75rem', borderRadius: 'var(--radius)', textAlign: 'center', cursor: 'pointer',
                      border: selected ? '2px solid #4C9B2F' : errors.region ? '1.5px solid #FECACA' : '1.5px solid #E5E7EB',
                      background: selected ? '#F0FDF4' : errors.region ? '#FFF5F5' : 'white',
                      boxShadow: selected ? '0 0 0 3px rgba(76,155,47,0.12)' : 'none',
                      transition: 'all 0.15s ease',
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '0.5rem' }}>
                      <Icon size={22} color={selected ? '#4C9B2F' : errors.region ? '#DC2626' : '#6B7280'} strokeWidth={1.75} />
                    </div>
                    <div style={{ fontSize: '0.72rem', fontWeight: selected ? 800 : 600, color: selected ? '#4C9B2F' : errors.region ? '#DC2626' : '#374151', lineHeight: 1.3 }}>
                      {label}
                    </div>
                  </div>
                );
              })}
            </div>
            <ErrorMsg msg={errors.region} />
          </div>

          {/* País */}
          <div>
            <label style={{ ...labelStyle, color: errors.country ? '#DC2626' : '#374151' }}>País *</label>
            <CustomSelect
              value={form.country}
              onChange={val => { setForm(p => ({ ...p, country: val, state: '' })); clearError('country'); }}
              disabled={!form.region}
              placeholder="Seleccione un país"
              disabledPlaceholder="— Seleccione primero la región —"
              options={(form.region ? COUNTRIES[form.region] : []).map(c => ({ value: c.id, label: c.label }))}
              error={!!errors.country}
            />
            <ErrorMsg msg={errors.country} />
          </div>

          {/* Departamento / Estado */}
          <div>
            <label style={{ ...labelStyle, color: errors.state ? '#DC2626' : '#374151' }}>Departamento / Estado / Provincia *</label>
            <CustomSelect
              value={form.state}
              onChange={val => { setForm(p => ({ ...p, state: val })); clearError('state'); }}
              disabled={!form.country}
              placeholder="Seleccione su departamento / estado"
              disabledPlaceholder="— Seleccione primero el país —"
              options={(form.country ? STATES[form.country] ?? [] : []).map(s => ({ value: s, label: s }))}
              error={!!errors.state}
            />
            <ErrorMsg msg={errors.state} />
          </div>
        </div>
      </div>

      {/* Botón guardar */}
      <button
        type="button"
        onClick={handleSave}
        style={{
          width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.6rem',
          padding: '1rem', borderRadius: 'var(--radius)', border: 'none', cursor: 'pointer',
          fontSize: '1rem', fontWeight: 700,
          background: saved ? '#166534' : 'var(--color-primary)',
          color: 'white',
          transition: 'background 0.3s',
          boxShadow: '0 4px 12px rgba(76,155,47,0.2)',
        }}
      >
        {saved ? <><Check size={18} /> Cambios guardados</> : <><Save size={18} /> Guardar cambios</>}
      </button>
    </div>
  );
};

export default Profile;
