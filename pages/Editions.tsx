
import React, { useEffect, useState } from 'react';
import SectionHeader from '../components/SectionHeader';
import { fetchEditorials } from '../lib/mcpClient';
import { Editorial } from '../types';

const Editions: React.FC = () => {
  const [editorials, setEditorials] = useState<Editorial[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchEditorials().then(data => {
      setEditorials(data);
      setLoading(false);
    });
  }, []);

  if (loading) return <div className="p-20 text-center font-serif text-xl animate-pulse text-accent uppercase tracking-widest">Acessando Arquivos...</div>;

  return (
    <div className="container mx-auto px-4 py-16 md:py-32">
      <SectionHeader 
        title="Dossiês Editoriais" 
        subtitle="Análises verticais profundas sobre os pilares que sustentam a economia digital global."
      />
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-12 md:gap-20">
        {editorials.map(ed => (
          <div key={ed.id} className="group cursor-pointer">
            <div className="relative aspect-[3/4] mb-8 rounded-[2rem] overflow-hidden shadow-2xl transition-all duration-700 group-hover:shadow-accent/10 group-hover:-translate-y-4">
              <img 
                src={ed.imageUrl} 
                className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-1000 scale-105 group-hover:scale-100" 
                alt={ed.theme} 
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-60 group-hover:opacity-40 transition-opacity"></div>
              <div className="absolute inset-0 flex flex-col justify-end p-10 translate-y-4 group-hover:translate-y-0 transition-transform">
                <span className="text-[10px] font-black text-accent uppercase tracking-[0.5em] mb-2">{ed.monthYear}</span>
                <h3 className="text-3xl font-serif font-black text-white uppercase leading-tight tracking-tighter mb-6">{ed.theme}</h3>
                <button className="bg-white text-primary w-fit px-8 py-3 rounded-full text-[10px] font-black uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-all transform translate-y-4 group-hover:translate-y-0">
                  Desbloquear Dossiê
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Editions;
