
import React from 'react';

interface LogoProps {
  className?: string;
  light?: boolean;
}

const Logo: React.FC<LogoProps> = ({ className = "", light = false }) => {
  return (
    <div className={`flex flex-col leading-none tracking-tighter ${className}`}>
      <span className={`text-[9px] md:text-[12px] font-black uppercase tracking-[0.4em] mb-0.5 ${light ? 'text-white/70' : 'text-secondary opacity-80'}`}>
        empresário
      </span>
      <span className={`text-xl md:text-3xl font-serif font-black uppercase ${light ? 'text-white' : 'text-primary'}`}>
        digital<span className="text-accent italic">.</span>
      </span>
    </div>
  );
};

export default Logo;
