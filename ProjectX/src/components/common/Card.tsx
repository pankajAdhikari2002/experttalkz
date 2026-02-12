import React from 'react';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
  hover?: boolean;
}

const Card: React.FC<CardProps> = ({ children, className = '', style, hover = true }) => {
  return (
    <div 
      className={`
        bg-card-dark 
        rounded-lg p-6 
        border border-white/5 
        shadow-sm hover:shadow-white/5
        transition-all duration-200
        ${hover ? 'hover:-translate-y-1' : ''}
        ${className}
      `}
      style={style}
    >
      {children}
    </div>
  );
};

export default Card;
