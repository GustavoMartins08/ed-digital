
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { fetchLatestNews } from '../lib/mcpClient';
import { NewsletterEdition, NewsItem } from '../types';
import NewsletterForm from '../components/NewsletterForm';

const NewsletterDetail: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [edition, setEdition] = useState<NewsletterEdition | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadNewsletter = async () => {
      window.scrollTo(0, 0);
      const newsBase = await fetchLatestNews();
      
      // Construindo uma edição de Newsletter com 8 itens robustos
      const mockItems: NewsItem[] = [
        { 
          ...newsBase[0], 
          id: 'n1', 
          title: 'A Ascensão dos Agentes Autônomos na Gestão de Fundos',
          keyPoints: [
            'IA agora opera 24/7 em mercados secundários sem supervisão humana.',
            'Taxas de corretagem caíram 40% em corretoras que adotaram agentes nativos.',
            'Necessidade urgente de auditoria algorítmica em tempo real.'
          ]
        },
        { 
          ...newsBase[1], 
          id: 'n2', 
          title: 'Semicondutores: A Nova Geopolítica do Poder',
          keyPoints: [
            'China acelera produção doméstica de chips de 7nm.',
            'EUA apertam restrições de exportação para chips de IA de alto desempenho.',
            'Impacto direto no custo de servidores de nuvem para startups brasileiras.'
          ]
        },
        { 
          ...newsBase[2], 
          id: 'n3', 
          title: 'Tokenização de Ativos Reais: O Fim dos Intermediários?',
          keyPoints: [
            'Imóveis fracionados via blockchain batem recorde de liquidez.',
            'Bancos centrais testam integração de CBDCs com protocolos DeFi.',
            'Redução de custos operacionais em transações cross-border.'
          ]
        },
        { 
          ...newsBase[3], 
          id: 'n4', 
          title: 'Computação Quântica e a Quebra da Criptografia Atual',
          keyPoints: [
            'Google anuncia marco na correção de erros quânticos.',
            'Cripto-agilidade torna-se prioridade para segurança cibernética corporativa.',
            'Investimentos em criptografia pós-quântica aumentam 200%.'
          ]
        },
        { 
          ...newsBase[0], 
          id: 'n5', 
          title: 'Biotecnologia: O Próximo Unicórnio de Trilhões', 
          imageUrl: 'https://picsum.photos/seed/bio/800/450',
          keyPoints: [
            'CRISPR 2.0 permite edições genéticas mais precisas e baratas.',
            'Startups focadas em longevidade recebem aportes maciços de VCs tech.',
            'Convergência entre biologia sintética e IA acelera descoberta de fármacos.'
          ]
        },
        { 
          ...newsBase[1], 
          id: 'n6', 
          title: 'Energia de Fusão: O Marco da Abundância Energética', 
          imageUrl: 'https://picsum.photos/seed/energy/800/450',
          keyPoints: [
            'Reatores experimentais atingem ganho de energia líquida positivo.',
            'Logística global pode ser revolucionada por fontes de energia compactas.',
            'Surgimento de novos polos industriais perto de usinas de fusão.'
          ]
        },
        { 
          ...newsBase[2], 
          id: 'n7', 
          title: 'Cidades Inteligentes e a Privatização da Infraestrutura', 
          imageUrl: 'https://picsum.photos/seed/city/800/450',
          keyPoints: [
            'Redes 6G habilitam monitoramento urbano em nível de milissegundos.',
            'Mobilidade como serviço (MaaS) reduz necessidade de posse de veículos.',
            'Privacidade de dados urbanos torna-se o campo de batalha legislativo.'
          ]
        },
        { 
          ...newsBase[3], 
          id: 'n8', 
          title: 'Psicologia do Consumo no Metaverso Industrial', 
          imageUrl: 'https://picsum.photos/seed/meta/800/450',
          keyPoints: [
            'Gêmeos digitais de consumidores permitem prever demanda com 99% de acerto.',
            'Treinamento em VR reduz acidentes de trabalho em 60% em fábricas.',
            'Vendas de bens virtuais superam ativos físicos em certos nichos de luxo.'
          ]
        },
      ];

      const mockEdition: NewsletterEdition = {
        id: id || 'current',
        title: 'Briefing Estratégico: O Próximo Ciclo de Inovação',
        date: '12 de Junho, 2024',
        coverImage: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&q=80&w=1200',
        synthesis: 'Compilado técnico dos 8 vetores de disrupção que estão redefinindo as fronteiras da eficiência operacional e do valor de mercado nesta quinzena.',
        items: mockItems
      };

      setEdition(mockEdition);
      setLoading(false);
    };
    loadNewsletter();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white" role="status">
        <div className="text-center font-serif text-xl md:text-2xl animate-pulse text-accent tracking-tighter uppercase">
          Compilando Insight Tático...
        </div>
      </div>
    );
  }

  if (!edition) return <div className="p-20 text-center">Edição não encontrada.</div>;

  return (
    <div className="bg-white min-h-screen selection:bg-accent selection:text-white">
      {/* 1. HEADER REFINADO - Agora com cores contrastantes para visibilidade total */}
      <header className="relative h-[65vh] md:h-[80vh] overflow-hidden flex items-end">
        <img 
          src={edition.coverImage} 
          className="absolute inset-0 w-full h-full object-cover grayscale brightness-[0.25]" 
          alt="Capa"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-white via-transparent to-transparent"></div>
        <div className="absolute inset-0 bg-gradient-to-b from-primary/60 via-transparent to-transparent opacity-40"></div>
        
        <div className="container mx-auto px-10 md:px-16 lg:px-24 pb-20 relative z-10">
          <button 
            onClick={() => navigate(-1)}
            className="mb-10 flex items-center gap-4 text-[10px] font-black uppercase tracking-[0.5em] text-white/60 hover:text-accent transition-colors group"
          >
            <svg className="w-4 h-4 transform group-hover:-translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M15 19l-7-7 7-7" /></svg>
            Voltar ao Arquivo
          </button>
          
          <div className="max-w-5xl space-y-10">
            <span className="inline-block bg-accent text-white text-[10px] font-black uppercase tracking-[0.6em] px-10 py-4 rounded-full shadow-2xl">
              Terminal Exclusivo
            </span>
            <h1 className="font-serif text-5xl sm:text-7xl md:text-9xl font-black text-white uppercase leading-[0.85] tracking-tighter drop-shadow-2xl">
              {edition.title}
            </h1>
            <div className="flex flex-wrap items-center gap-8 text-[11px] font-black text-white/60 uppercase tracking-[0.5em]">
              <span>{edition.date}</span>
              <span className="w-2 h-2 bg-accent rounded-full"></span>
              <span>Edição #48</span>
              <span className="hidden md:inline w-2 h-2 bg-accent rounded-full"></span>
              <span className="hidden md:inline">8 Pontos de Disrupção</span>
            </div>
          </div>
        </div>
      </header>

      {/* 2. ABSTRACT BOX */}
      <section className="py-24 md:py-40 bg-lightGray/30 border-b border-gray-100">
        <div className="container mx-auto px-10 md:px-16 lg:px-24">
          <div className="max-w-4xl">
            <h2 className="text-[11px] font-black uppercase tracking-[0.8em] text-accent mb-12">Abstract Executivo</h2>
            <p className="font-serif text-2xl md:text-5xl font-black text-primary leading-[1.1] tracking-tight italic opacity-90 border-l-8 border-accent pl-12">
              "{edition.synthesis}"
            </p>
          </div>
        </div>
      </section>

      {/* 3. BRIEFING FEED (8 INSIGHTS) */}
      <main className="py-32 md:py-64">
        <div className="container mx-auto px-10 md:px-16 lg:px-24">
          <div className="max-w-4xl mx-auto space-y-48 md:space-y-80">
            {edition.items.map((item, index) => (
              <section key={item.id} className="group relative">
                {/* Index Background */}
                <div className="absolute -left-8 md:-left-32 -top-16 md:-top-24 text-[120px] md:text-[250px] font-serif font-black text-lightGray/40 -z-10 select-none leading-none pointer-events-none opacity-50">
                  {String(index + 1).padStart(2, '0')}
                </div>
                
                <div className="space-y-14">
                  {/* Category Header */}
                  <div className="flex items-center justify-between border-b border-gray-50 pb-8">
                    <span className="text-[11px] font-black uppercase tracking-[0.6em] text-accent">
                      Insight Estratégico {index + 1}
                    </span>
                    <span className="text-[9px] font-bold text-gray-300 uppercase tracking-widest hidden sm:block">
                      {item.category} • {item.source}
                    </span>
                  </div>

                  {/* Title */}
                  <h3 className="font-serif text-4xl md:text-7xl font-black text-primary uppercase leading-[0.9] tracking-tighter group-hover:text-accent transition-all duration-500">
                    <Link to={`/artigo/${item.id}`}>{item.title}</Link>
                  </h3>

                  {/* High Quality Hero Image */}
                  <div className="aspect-[21/9] rounded-[2.5rem] md:rounded-[4.5rem] overflow-hidden shadow-2xl bg-lightGray relative group/img">
                    <img 
                      src={item.imageUrl} 
                      className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-1000 group-hover:scale-105" 
                      alt={item.title} 
                    />
                    <div className="absolute inset-0 bg-primary/10 opacity-0 group-hover/img:opacity-100 transition-opacity"></div>
                  </div>

                  {/* Executive Summary */}
                  <div className="max-w-3xl">
                    <p className="text-secondary text-xl md:text-3xl font-light leading-relaxed italic opacity-80 mb-12">
                      {item.excerpt}
                    </p>

                    {/* KEY POINTS OF ATTENTION (PONTOS DE ATENÇÃO) */}
                    <div className="bg-lightGray rounded-[2rem] md:rounded-[3rem] p-8 md:p-14 border border-gray-100/50 shadow-sm">
                      <h4 className="text-[10px] font-black uppercase tracking-[0.5em] text-primary mb-8 flex items-center gap-4">
                        <span className="w-8 h-[2px] bg-accent"></span>
                        Principais Pontos de Atenção
                      </h4>
                      <ul className="space-y-6">
                        {item.keyPoints?.map((point, i) => (
                          <li key={i} className="flex gap-6 items-start group/point">
                            <span className="text-accent font-black text-lg md:text-xl leading-none mt-1 group-hover/point:scale-125 transition-transform">→</span>
                            <p className="text-primary text-base md:text-xl font-medium leading-snug tracking-tight">
                              {point}
                            </p>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  {/* Action Link */}
                  <div className="pt-10">
                    <Link 
                      to={`/artigo/${item.id}`}
                      className="inline-flex items-center gap-8 text-[12px] font-black uppercase tracking-[0.5em] text-primary group/link"
                    >
                      <span className="border-b-2 border-primary/10 group-hover/link:border-accent transition-all pb-3 group-hover/link:text-accent">Aprofundar Relatório Técnico</span>
                      <div className="w-14 h-14 rounded-full bg-lightGray flex items-center justify-center group-hover/link:bg-accent group-hover/link:text-white transition-all shadow-md group-hover/link:shadow-accent/20">
                        <svg className="w-6 h-6 transform group-hover/link:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>
                      </div>
                    </Link>
                  </div>
                </div>
                
                {/* Visual Separator */}
                {index < edition.items.length - 1 && (
                  <div className="mt-48 md:mt-80 flex justify-center opacity-20">
                     <div className="w-px h-24 bg-gradient-to-b from-primary to-transparent"></div>
                  </div>
                )}
              </section>
            ))}
          </div>
        </div>
      </main>

      {/* 4. PREMIUM CTA FOOTER */}
      <section className="bg-primary py-32 md:py-64 rounded-t-[5rem] md:rounded-t-[12rem] overflow-hidden relative">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[200%] aspect-square bg-accent/5 rounded-full -translate-y-[85%]"></div>
        
        <div className="container mx-auto px-10 md:px-16 lg:px-24 relative z-10 text-center">
          <h2 className="font-serif text-5xl md:text-8xl lg:text-9xl font-black uppercase tracking-tighter text-white leading-[0.8] mb-12">
            Mantenha-se na <br /> <span className="text-accent italic">Vanguarda</span>
          </h2>
          <p className="text-white/50 text-xl md:text-3xl max-w-3xl mx-auto mb-20 font-light italic leading-relaxed">
            Relatórios como este são distribuídos diariamente para nossa rede de parceiros premium. Garanta sua posição no próximo ciclo.
          </p>
          <div className="max-w-2xl mx-auto bg-white/5 backdrop-blur-xl p-8 md:p-16 rounded-[4rem] border border-white/10 shadow-2xl">
            <NewsletterForm variant="card" />
          </div>
        </div>
      </section>
    </div>
  );
};

export default NewsletterDetail;
