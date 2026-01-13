
import React, { useEffect, useState, useRef } from 'react';
import SectionHeader from '../components/SectionHeader';
import { fetchColumns, fetchLatestNews } from '../lib/mcpClient';
import { Columnist, NewsItem } from '../types';
import { useNavigate } from 'react-router-dom';

const ColumnsPage: React.FC = () => {
  const [columnists, setColumnists] = useState<Columnist[]>([]);
  const [columns, setColumns] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState(true);
  const scrollRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const loadData = async () => {
      const [colData, newsData] = await Promise.all([
        fetchColumns(),
        fetchLatestNews()
      ]);
      
      // Criando uma lista maior para o scroll
      setColumnists([...colData, ...colData, ...colData, ...colData]);
      
      const opinionColumns = newsData.map((item, idx) => ({
        ...item,
        category: 'Artigo de Opinião',
        author: colData[idx % colData.length]
      }));
      
      setColumns(opinionColumns);
      setLoading(false);
    };
    loadData();
  }, []);

  const handleScroll = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      const scrollAmount = scrollRef.current.clientWidth * 0.6;
      scrollRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth'
      });
    }
  };

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-white" role="status">
      <div className="text-center font-serif text-xl md:text-2xl animate-pulse text-accent tracking-tighter uppercase">
        Sincronizando Vozes...
      </div>
    </div>
  );

  return (
    <div className="bg-white min-h-screen selection:bg-accent selection:text-white">
      {/* 1. SEÇÃO DE COLUNISTAS (SCROLL HORIZONTAL MINIMALISTA) */}
      <section className="pt-16 md:pt-32 pb-8 md:pb-16 overflow-hidden">
        <div className="container mx-auto px-6 md:px-16 lg:px-24">
          <SectionHeader 
            title="Colunistas" 
            subtitle="As mentes que moldam o ecossistema digital."
          />
          
          <div className="relative mt-12 md:mt-24 group">
            {/* Controles Minimalistas */}
            <div className="absolute top-1/2 -translate-y-1/2 left-0 right-0 flex justify-between pointer-events-none z-20 px-4 md:-mx-12">
              <button 
                onClick={() => handleScroll('left')}
                className="pointer-events-auto w-10 h-10 md:w-12 md:h-12 bg-white/80 backdrop-blur-sm border border-gray-100 rounded-full flex items-center justify-center text-primary shadow-sm hover:bg-primary hover:text-white transition-all opacity-0 group-hover:opacity-100 translate-x-4 group-hover:translate-x-0"
                aria-label="Anterior"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 19l-7-7 7-7" /></svg>
              </button>
              <button 
                onClick={() => handleScroll('right')}
                className="pointer-events-auto w-10 h-10 md:w-12 md:h-12 bg-white/80 backdrop-blur-sm border border-gray-100 rounded-full flex items-center justify-center text-primary shadow-sm hover:bg-primary hover:text-white transition-all opacity-0 group-hover:opacity-100 -translate-x-4 group-hover:translate-x-0"
                aria-label="Próximo"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" /></svg>
              </button>
            </div>

            <div 
              ref={scrollRef}
              className="flex gap-10 md:gap-20 overflow-x-auto scrollbar-hide snap-x snap-mandatory scroll-smooth -mx-6 px-6 md:-mx-4 md:px-4"
            >
              {columnists.map((col, idx) => (
                <div 
                  key={`${col.id}-${idx}`} 
                  className="flex flex-col items-center text-center shrink-0 w-28 md:w-44 snap-center group cursor-pointer"
                  onClick={() => console.log('Filtrar por', col.name)}
                >
                  <div className="relative mb-6 md:mb-8 transition-transform duration-500 group-hover:scale-105">
                    <img 
                      src={col.avatarUrl} 
                      alt={col.name} 
                      className="w-24 h-24 md:w-40 md:h-40 rounded-full object-cover grayscale opacity-80 group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-700 ring-1 ring-gray-100 group-hover:ring-accent/20"
                    />
                  </div>
                  <h4 className="font-serif text-sm md:text-lg font-black uppercase tracking-tighter text-primary group-hover:text-accent transition-colors leading-tight">
                    {col.name}
                  </h4>
                  <p className="text-[7px] md:text-[9px] font-bold text-gray-300 uppercase tracking-[0.3em] mt-2 group-hover:text-gray-500 transition-colors">
                    {col.company}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* 2. TODAS AS COLUNAS / ARTIGOS DE OPINIÃO */}
      <section className="py-20 md:py-32 container mx-auto px-6 md:px-16 lg:px-24">
        <div className="flex flex-col md:flex-row items-baseline justify-between mb-16 md:mb-24 gap-4 border-b border-gray-100 pb-8 md:pb-12">
          <h2 className="font-serif text-4xl md:text-7xl lg:text-8xl font-black uppercase tracking-tighter text-primary">
            Opinião <span className="text-accent italic">&</span> Análise
          </h2>
          <span className="text-[10px] font-black uppercase tracking-[0.4em] text-gray-300 hidden md:block">
            Perspectivas que moldam o mercado
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-24">
          {columns.map((column) => {
            const author = (column as any).author as Columnist;
            return (
              <div 
                key={column.id} 
                className="group flex flex-col h-full bg-white rounded-[2rem] md:rounded-[3rem] border border-gray-50 hover:border-accent/10 hover:shadow-2xl hover:shadow-primary/5 transition-all duration-700 p-8 md:p-12"
              >
                {/* Atribuição de Autor (Preview) */}
                <div className="flex items-center gap-4 mb-10 pb-8 border-b border-gray-100">
                  <div className="relative shrink-0">
                    <img src={author.avatarUrl} className="w-10 h-10 md:w-14 md:h-14 rounded-full object-cover grayscale group-hover:grayscale-0 transition-all duration-500" alt={author.name} />
                  </div>
                  <div>
                    <p className="text-[9px] md:text-[11px] font-black text-primary uppercase tracking-widest">{author.name}</p>
                    <p className="text-[8px] md:text-[9px] font-bold text-accent uppercase tracking-[0.2em]">{author.role} @ {author.company}</p>
                  </div>
                </div>

                <div className="flex-grow space-y-6">
                  <span className="text-[9px] md:text-[10px] font-black text-accent uppercase tracking-[0.4em]">
                    {column.category}
                  </span>
                  <h3 className="font-serif text-2xl md:text-4xl font-black text-primary uppercase leading-tight tracking-tighter group-hover:text-accent transition-colors">
                    {column.title}
                  </h3>
                  <p className="text-secondary text-sm md:text-xl font-light leading-relaxed italic opacity-70 line-clamp-3">
                    {column.excerpt}
                  </p>
                </div>

                <div className="mt-12 pt-8 border-t border-gray-100 flex items-center justify-between">
                  <span className="text-[9px] font-black text-gray-300 uppercase tracking-widest">
                    {column.timestamp}
                  </span>
                  <button 
                    onClick={() => navigate(`/artigo/${column.id}`)}
                    className="flex items-center gap-4 text-[10px] font-black uppercase tracking-[0.4em] text-primary group-hover:text-accent transition-all"
                  >
                    Ler Artigo
                    <div className="w-10 h-10 rounded-full bg-lightGray/50 flex items-center justify-center group-hover:bg-accent group-hover:text-white transition-all shadow-sm">
                      <svg className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>
                    </div>
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Rodapé da Seção */}
        <div className="mt-20 md:mt-40 text-center">
          <button className="bg-primary text-white px-12 py-6 rounded-full text-[11px] font-black uppercase tracking-[0.4em] hover:bg-accent transition-all shadow-xl active:scale-95">
            Ver todas as Colunas do Acervo
          </button>
        </div>
      </section>
    </div>
  );
};

export default ColumnsPage;
