import React from 'react';

interface SectionProps {
  children: React.ReactNode;
  variant?: 'white' | 'surface' | 'dark' | 'transparent';
  className?: string;
  style?: React.CSSProperties;
  id?: string;
}

const Section: React.FC<SectionProps> = ({ 
  children, 
  variant = 'transparent', 
  className = '', 
  style,
  id
}) => {
  const getVariantClass = () => {
    switch (variant) {
      case 'white': return 'bg-background-dark';
      case 'surface': return 'bg-surface-dark';
      case 'dark': return 'bg-slate-900 text-white';
      default: return 'bg-transparent';
    }
  };

  return (
    <section 
      id={id}
      className={`py-16 ${getVariantClass()} ${className}`}
      style={style}
    >
      <div className="container mx-auto px-6 lg:px-10">
        {children}
      </div>
    </section>
  );
};

export default Section;
