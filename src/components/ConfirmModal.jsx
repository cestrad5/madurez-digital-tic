import { useEffect } from 'react';
import { AlertTriangle, Trash2, X } from 'lucide-react';

const VARIANTS = {
  danger:  { bg: '#FEF2F2', border: '#FECACA', icon: '#DC2626', btn: '#DC2626', btnHover: '#B91C1C' },
  warning: { bg: '#FFFBEB', border: '#FDE68A', icon: '#D97706', btn: '#D97706', btnHover: '#B45309' },
  primary: { bg: '#F0FDF4', border: '#BBF7D0', icon: '#4C9B2F', btn: '#4C9B2F', btnHover: '#166534' },
};

const ICONS = {
  danger:  <Trash2 size={22} />,
  warning: <AlertTriangle size={22} />,
  primary: <AlertTriangle size={22} />,
};

export default function ConfirmModal({
  open,
  title,
  message,
  confirmLabel = 'Confirmar',
  cancelLabel  = 'Cancelar',
  variant      = 'danger',
  loading      = false,
  onConfirm,
  onCancel,
}) {
  const v = VARIANTS[variant] || VARIANTS.danger;
  const showCancel = !!onCancel;

  useEffect(() => {
    if (!open) return;
    const handler = (e) => { if (e.key === 'Escape' && showCancel) onCancel(); };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [open, onCancel, showCancel]);

  if (!open) return null;

  return (
    <div
      style={{
        position: 'fixed', inset: 0, zIndex: 1000,
        background: 'rgba(0,0,0,0.45)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        padding: '1rem',
      }}
      onClick={showCancel ? onCancel : undefined}
    >
      <div
        role="dialog"
        aria-modal="true"
        onClick={e => e.stopPropagation()}
        style={{
          background: 'white', borderRadius: 'var(--radius-lg)',
          boxShadow: '0 20px 60px rgba(0,0,0,0.18)',
          maxWidth: '440px', width: '100%',
          padding: '2rem',
          animation: 'fadeInScale 0.15s ease',
        }}
      >
        {/* Ícono */}
        <div style={{
          width: '52px', height: '52px', borderRadius: '14px',
          background: v.bg, border: `1px solid ${v.border}`,
          color: v.icon, display: 'flex', alignItems: 'center', justifyContent: 'center',
          marginBottom: '1.25rem',
        }}>
          {ICONS[variant]}
        </div>

        {/* Título */}
        <h3 style={{ margin: '0 0 0.5rem', fontSize: '1.1rem', fontWeight: 800, color: '#111827' }}>
          {title}
        </h3>

        {/* Mensaje */}
        <p style={{ margin: '0 0 1.75rem', fontSize: '0.93rem', color: '#6B7280', lineHeight: 1.6 }}>
          {message}
        </p>

        {/* Botones */}
        <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'flex-end' }}>
          {showCancel && (
            <button
              type="button"
              onClick={onCancel}
              disabled={loading}
              style={{
                padding: '0.65rem 1.5rem', borderRadius: 'var(--radius)',
                fontWeight: 700, fontSize: '0.9rem',
                background: 'white', color: '#374151',
                border: '1.5px solid #E5E7EB', cursor: 'pointer',
                opacity: loading ? 0.5 : 1,
              }}
            >
              {cancelLabel}
            </button>
          )}
          <button
            type="button"
            onClick={onConfirm}
            disabled={loading}
            style={{
              padding: '0.65rem 1.5rem', borderRadius: 'var(--radius)',
              fontWeight: 700, fontSize: '0.9rem',
              background: v.btn, color: 'white',
              border: 'none', cursor: loading ? 'not-allowed' : 'pointer',
              opacity: loading ? 0.7 : 1,
              display: 'flex', alignItems: 'center', gap: '0.5rem',
            }}
          >
            {loading && <span className="spinner" style={{ width: '14px', height: '14px', borderWidth: '2px', borderColor: 'rgba(255,255,255,0.3)', borderTopColor: 'white' }} />}
            {confirmLabel}
          </button>
        </div>
      </div>

      <style>{`
        @keyframes fadeInScale {
          from { opacity: 0; transform: scale(0.95); }
          to   { opacity: 1; transform: scale(1); }
        }
      `}</style>
    </div>
  );
}
