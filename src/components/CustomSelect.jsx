import { useState, useEffect, useRef } from 'react';
import { ChevronDown, Check } from 'lucide-react';

const CustomSelect = ({ value, onChange, options, placeholder, disabledPlaceholder, disabled, error }) => {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const handler = e => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const selected = options.find(o => o.value === value);

  return (
    <div ref={ref} style={{ position: 'relative' }}>
      <div
        onClick={() => !disabled && setOpen(o => !o)}
        style={{
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          padding: '0.875rem 1.25rem', borderRadius: 'var(--radius)',
          border: open ? '1.5px solid #4C9B2F' : error ? '1.5px solid #FCA5A5' : '1.5px solid #E5E7EB',
          boxShadow: open ? '0 0 0 3px rgba(76,155,47,0.12)' : error ? '0 0 0 3px rgba(220,38,38,0.08)' : 'none',
          background: disabled ? '#F9FAFB' : error ? '#FFF5F5' : 'white',
          cursor: disabled ? 'not-allowed' : 'pointer',
          fontSize: '1rem', userSelect: 'none',
          color: selected ? '#111827' : '#9CA3AF',
          transition: 'border-color 0.15s, box-shadow 0.15s',
        }}
      >
        <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
          {selected ? selected.label : (disabled ? disabledPlaceholder : placeholder)}
        </span>
        <ChevronDown
          size={16}
          style={{ flexShrink: 0, marginLeft: '0.5rem', color: '#6B7280', transition: 'transform 0.2s', transform: open ? 'rotate(180deg)' : 'rotate(0deg)' }}
        />
      </div>

      {open && (
        <div style={{
          position: 'absolute', top: 'calc(100% + 6px)', left: 0, right: 0, zIndex: 200,
          background: 'white', borderRadius: 'var(--radius)',
          border: '1.5px solid #E5E7EB',
          boxShadow: '0 8px 28px rgba(0,0,0,0.10)',
          maxHeight: '220px', overflowY: 'auto',
        }}>
          {options.map(o => {
            const isSelected = o.value === value;
            return (
              <div
                key={o.value}
                onClick={() => { onChange(o.value); setOpen(false); }}
                style={{
                  display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                  padding: '0.7rem 1.25rem', cursor: 'pointer', fontSize: '0.95rem',
                  fontWeight: isSelected ? 700 : 400,
                  color: isSelected ? '#4C9B2F' : '#374151',
                  background: isSelected ? '#F0FDF4' : 'transparent',
                  transition: 'background 0.1s',
                }}
                onMouseEnter={e => { if (!isSelected) e.currentTarget.style.background = '#F9FAFB'; }}
                onMouseLeave={e => { if (!isSelected) e.currentTarget.style.background = 'transparent'; }}
              >
                <span>{o.label}</span>
                {isSelected && <Check size={15} color="#4C9B2F" strokeWidth={2.5} />}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default CustomSelect;
