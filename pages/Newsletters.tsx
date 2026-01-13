import React, { useState, useEffect } from 'react';
import SectionHeader from '../components/SectionHeader';
import { Link } from 'react-router-dom';
import NewsletterForm from '../components/NewsletterForm';

interface NewsletterSummary {
  id: string;
  title: string;
  date: string;
  category: string;
  synthesis: string;
  insightCount: number;
}

const Newsletters: React.FC = () => {
  const [activeFilter, setActiveFilter] = useState('Todos');
  const [loading, setLoading] = useState(true);

  const filters = ['Todos', 'Estratégia', 'Tecnologia', 'Venture Capital', 'Macro'];

  const newsletters: NewsletterSummary[] = [
    {
      id: 'briefing-48',
      title: 'Disrupção e Liderança 4.0',
      date: '12 de Junho, 2024',
      category: 'Estratégia',
      synthesis: 'Como os agentes autônomos e a nova geopolítica dos semicondutores estão redefinindo o valor de mercado.',
      insightCount: 8
    },
    {
      id: 'briefing-47',
      title: 'A Nova Era do Capitalismo Sustentável',
      date: '05 de Junho, 2024',
      category: 'Macro',
      synthesis: 'Aporte recorde em ESG e a transição para economias de baixo carbono no Q3.',
      insightCount: 8
    },
    {
      id: 'briefing-46',
      title: 'O Fim da Criptografia Tradicional',
      date: '28 de Maio, 2024',
      category: 'Tecnologia',
      synthesis: 'Análise do marco da computação quântica e as implicações para a segurança cibernética global.',
      insightCount: 8
    },
    {
      id: 'briefing-45',
      title: 'Startups e a Liquidez de 2024',
      date: '21 de Maio, 2024',
      category: 'Venture Capital',
      synthesis: 'O retorno dos IPOs e as rodadas de investimento em logística e last-mile no Brasil.',
      insightCount: 8
    },
    {
      id: 'briefing-44',
      title: 'Reskilling em Larga Escala',
      date: '14 de Maio, 2024',
      category: 'Estratégia',
      synthesis: 'Preparando a força de trabalho para a colaboração homem-máquina em ambientes industriais.',
      insightCount: 8
    }
  ];

  useEffect(() => {
    setTimeout(() => setLoading(false), 800);
  }, []);

  const filteredNewsletters = activeFilter === 'Todos' 
    ? newsletters 
    : newsletters.filter(n => n.category === activeFilter);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white" role="status">
        <div className="text-center font-serif text-xl md:text-2xl animate-pulse text-accent tracking-tighter uppercase">
          Acessando Arquivo de Inteligência...
        </div>
      </div>
    );
  }

  return (
    <div className="pb-32 pt-16 md:pt-24">
      <div className="container mx-auto px-10 md:px-16 lg:px-24">
        <SectionHeader 
          title="Arquivo de Newsletters" 
          subtitle="Briefings estratégicos preservados para consulta tática. Explore as edições recentes antes de assinar nosso terminal premium."
        />

        {/* FILTERS */}
        <nav className="flex gap-4 overflow-x-auto pb-12 mb-16 scrollbar-hide border-b border-gray-100">
          {filters.map(f => (
            <button
              key={f}
              onClick={() => setActiveFilter(f)}
              className={`whitespace-nowrap px-8 py-3 rounded-full text-[10px] font-black uppercase tracking-[0.3em] transition-all ${
                activeFilter === f 
                ? 'bg-accent text-white shadow-xl shadow-accent/20' 
                : 'bg-lightGray text-secondary hover:bg-gray-200'
              }`}
            >
              {f}
            </button>
          ))}
        </nav>

        {/* GRID FLOW WITH IN-FEED SUBSCRIPTION */}
        <div className="space-y-12 md:space-y-20">
          {/* Mostramos as 2 primeiras Newsletters antes do formulário */}
          {filteredNewsletters.slice(0, 2).map((nl) => (
            <NewsletterCard key={nl.id} nl={nl} />
          ))}

          {/* COMPACT SUBSCRIPTION BLOCK (IN-FEED) */}
          <div className="bg-primary rounded-[3rem] p-8 md:p-16 relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-64 h-64 bg-accent/10 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl group-hover:bg-accent/20 transition-all duration-1000"></div>
            <div className="relative z-10 flex flex-col lg:flex-row gap-12 items-center">
              <div className="lg:w-1/3 text-center lg:text-left">
                <span className="text-accent text-[10px] font-black uppercase tracking-[0.6em] mb-4 block">Acesso Prioritário</span>
                <h3 className="text-white font-serif text-3xl md:text-4xl font-black uppercase leading-none tracking-tighter mb-4">
                  Receba o Próximo <br /> Ciclo no E-mail
                </h3>
                <p className="text-white/40 text-[11px] leading-relaxed italic max-w-sm mx-auto lg:mx-0">
                  Junte-se a 15k+ líderes. Dados sintetizados, sem ruído, diretamente na sua caixa de entrada.
                </p>
              </div>
              <div className="lg:w-2/3 w-full">
                <NewsletterForm variant="slim" />
              </div>
            </div>
          </div>

          {/* O restante das edições */}
          {filteredNewsletters.slice(2).map((nl) => (
            <NewsletterCard key={nl.id} nl={nl} />
          ))}
        </div>
      </div>
    </div>
  );
};

// Fixed: Using React.FC to allow intrinsic props like 'key' when used in JSX lists
const NewsletterCard: React.FC<{ nl: NewsletterSummary }> = ({ nl }) => (
  <Link 
    to={`/newsletter/${nl.id}`}
    className="group flex flex-col md:flex-row gap-8 md:gap-16 p-10 md:p-16 rounded-[3rem] bg-lightGray/30 border border-gray-50 hover:bg-white hover:shadow-2xl hover:border-accent/10 transition-all duration-500"
  >
    <div className="md:w-1/4 shrink-0 flex flex-col justify-between">
      <div>
        <span className="text-accent text-[10px] font-black uppercase tracking-[0.5em] block mb-4">{nl.category}</span>
        <p className="text-primary/40 text-[11px] font-black uppercase tracking-widest">{nl.date}</p>
      </div>
      <div className="mt-8 md:mt-0">
        <div className="w-10 h-10 rounded-full border border-accent/20 flex items-center justify-center text-accent font-black text-xs">
          {nl.insightCount}
        </div>
        <p className="text-[9px] font-bold text-gray-400 uppercase tracking-widest mt-2">Insights</p>
      </div>
    </div>

    <div className="md:w-3/4 flex flex-col justify-center gap-4">
      <h3 className="font-serif text-3xl md:text-5xl font-black text-primary uppercase leading-[0.9] tracking-tighter group-hover:text-accent transition-colors">
        {nl.title}
      </h3>
      <p className="text-secondary text-lg font-light leading-relaxed italic opacity-70 line-clamp-2">
        "{nl.synthesis}"
      </p>
      <div className="pt-4">
        <span className="inline-flex items-center gap-4 text-[10px] font-black uppercase tracking-[0.4em] text-primary group-hover:text-accent transition-colors">
          Acessar Inteligência
          <svg className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>
        </span>
      </div>
    </div>
  </Link>
);

export default Newsletters;