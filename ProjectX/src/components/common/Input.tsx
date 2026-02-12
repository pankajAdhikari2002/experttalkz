import React from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  fullWidth?: boolean;
}

const Input: React.FC<InputProps> = ({ 
  label, 
  error, 
  fullWidth = false, 
  className = '', 
  style, 
  ...props 
}) => {
  return (
    <div style={{ 
      display: 'flex', 
      flexDirection: 'column', 
      gap: '0.5rem', 
      width: fullWidth ? '100%' : 'auto',
      marginBottom: '1rem'
    }}>
      {label && (
        <label style={{ 
          fontSize: '0.875rem', 
          fontWeight: 500, 
          color: 'var(--text)' 
        }}>
          {label}
        </label>
      )}
      <input
        style={{
          padding: '0.75rem',
          borderRadius: '0.375rem',
          border: `1px solid ${error ? '#ef4444' : 'var(--border)'}`,
          outline: 'none',
          fontSize: '1rem',
          width: '100%',
          transition: 'border-color 0.2s',
          ...style
        }}
        className={className}
        {...props}
      />
      {error && (
        <span style={{ fontSize: '0.75rem', color: '#ef4444' }}>{error}</span>
      )}
    </div>
  );
};

export default Input;
