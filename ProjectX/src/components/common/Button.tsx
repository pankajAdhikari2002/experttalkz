import React from 'react';
import { Link } from 'react-router-dom';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  to?: string;
  fullWidth?: boolean;
  icon?: React.ReactNode;
  iconPosition?: 'left' | 'right';
}

const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'primary',
  size = 'md',
  to,
  fullWidth = false,
  icon,
  iconPosition = 'left',
  className = '',
  style,
  ...props
}) => {
  const baseClasses = `
    inline-flex items-center justify-center gap-2 rounded-md font-semibold cursor-pointer transition-all duration-200 border text-decoration-none font-inherit
    ${fullWidth ? 'w-full flex' : ''}
  `;

  const variantClasses = {
    primary: `
      bg-primary text-white border-white/10
      bg-[linear-gradient(135deg,var(--primary)_0%,#ff4d4d_100%)]
      shadow-[0_4px_15px_rgba(255,77,77,0.4),0_2px_4px_rgba(0,0,0,0.1)]
      drop-shadow-[0_1px_2px_rgba(0,0,0,0.2)]
      hover:scale-[1.02] hover:shadow-[0_6px_20px_rgba(255,77,77,0.6)] hover:brightness-110
      active:scale-[0.98]
    `,
    secondary: 'bg-secondary text-white border-secondary hover:bg-opacity-90',
    outline: 'bg-transparent text-primary border-primary hover:bg-primary/10',
    ghost: 'bg-transparent text-white/90 border-transparent hover:bg-white/10 hover:text-white',
  };

  const sizeClasses = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2 text-base',
    lg: 'px-6 py-3 text-lg',
  };

  const combinedClassName = `
    ${baseClasses}
    ${variantClasses[variant]}
    ${sizeClasses[size]}
    ${className}
  `.trim().replace(/\s+/g, ' ');

  const content = (
    <>
      {icon && iconPosition === 'left' && <span>{icon}</span>}
      {children}
      {icon && iconPosition === 'right' && <span>{icon}</span>}
    </>
  );

  if (to) {
    return (
      <Link to={to} className={combinedClassName} style={style}>
        {content}
      </Link>
    );
  }

  return (
    <button className={combinedClassName} style={style} {...props}>
      {content}
    </button>
  );
};

export default Button;
