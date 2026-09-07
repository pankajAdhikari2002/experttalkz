interface LoaderProps {
  fullScreen?: boolean;
  size?: 'sm' | 'md' | 'lg';
  text?: string;
  className?: string;
}

export default function Loader({
  fullScreen = false,
  size = 'md',
  text,
  className = '',
}: LoaderProps) {
  const sizeClasses = {
    sm: 'w-5 h-5 border-2',
    md: 'w-8 h-8 border-2',
    lg: 'w-10 h-10 border-[2.5px]',
  };

  const containerClasses = fullScreen
    ? 'min-h-screen bg-[#070b14]'
    : className.includes('min-h-') || className.includes('py-') || className.includes('h-')
    ? ''
    : 'min-h-[50vh]';

  return (
    <div
      className={`flex flex-col items-center justify-center gap-3 ${containerClasses} text-white ${className}`}
    >
      <div
        className={`${sizeClasses[size]} rounded-full border-white/10 border-t-primary animate-spin`}
      />
      {text && <p className="text-xs text-slate-400 font-medium tracking-wide">{text}</p>}
    </div>
  );
}
