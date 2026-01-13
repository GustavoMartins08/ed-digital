
import React from 'react';

interface SectionHeaderProps {
  title: string;
  subtitle?: string;
}

const SectionHeader: React.FC<SectionHeaderProps> = ({ title, subtitle }) => {
  return (
    <div className="flex flex-col mb-8 md:mb-10 gap-4">
      <h2 className="font-serif text-4xl md:text-6xl lg:text-8xl font-black leading-[0.9] uppercase tracking-tighter text-primary">
        {title}
      </h2>
      {subtitle && (
        <p className="text-secondary text-base md:text-2xl tracking-tight max-w-2xl font-light leading-relaxed opacity-70 italic">
          {subtitle}
        </p>
      )}
    </div>
  );
};

export default SectionHeader;
