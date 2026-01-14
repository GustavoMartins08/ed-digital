
import React, { useEffect, useState, useRef } from 'react';
import SectionHeader from '../components/SectionHeader';
import NewsCard from '../components/NewsCard';
import NewsletterForm from '../components/NewsletterForm';
import { fetchLatestNews, fetchEditorials, fetchVideos } from '../lib/mcpClient';
import { NewsItem, Editorial, Video } from '../types';
import { useNavigate, Link } from 'react-router-dom';

const Home: React.FC = () => {
  const [news, setNews] = useState<NewsItem[]>([]);
  const [newsletters, setNewsletters] = useState<NewsItem[]>([]);
  const [editorials, setEditorials] = useState<Editorial[]>([]);
  const [videos, setVideos] = useState<Video[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // Refs para controle de scroll
  const newsRef = useRef<HTMLDivElement>(null);
  const newslettersRef = useRef<HTMLDivElement>(null);
  const editorialsRef = useRef<HTMLDivElement>(null);
  const videosRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const loadData = async () => {
      const [newsData, editorialData, videoData] = await Promise.all([
        fetchLatestNews(),
        fetchEditorials(),
        fetchVideos()
      ]);

      const mainNews = [...newsData, ...newsData.map(n => ({ ...n, id: n.id + '_extra' }))].slice(0, 6);
      setNews(mainNews);

      const mockNewsletters = newsData.map(n => ({
        ...n,
        id: 'nl_' + n.id,
        category: 'Briefing Tático',
        title: 'Edição: ' + n.title
      }));
      setNewsletters(mockNewsletters);

      setEditorials(editorialData);
      setVideos(videoData);
      setLoading(false);
    };
    loadData();
  }, []);

  const handleScroll = (ref: React.RefObject<HTMLDivElement | null>, direction: 'left' | 'right') => {
    if (ref.current) {
      const scrollAmount = ref.current.clientWidth * 0.8;
      ref.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth'
      });
    }
  };

  const NavControls = ({ refTarget, actionLabel, onAction }: { refTarget: React.RefObject<HTMLDivElement | null>, actionLabel?: string, onAction?: () => void }) => (
    <div className="flex items-center justify-between mb-6 md:mb-10 gap-6 border-b border-gray-100 pb-4 md:pb-6">
      {actionLabel ? (
        <button
          onClick={onAction}
          className="text-[10px] md:text-[11px] font-black uppercase tracking-[0.4em] text-accent flex items-center gap-3 group border-b-2 border-accent/0 hover:border-accent transition-all pb-1"
        >
          {actionLabel}
          <svg className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>
        </button>
      ) : <div />}

      <div className="flex gap-2 md:gap-3">
        <button
          onClick={() => handleScroll(refTarget, 'left')}
          className="w-10 h-10 md:w-14 md:h-14 rounded-full bg-white border border-gray-100 flex items-center justify-center hover:bg-primary hover:text-white transition-all active:scale-90 shadow-md focus-visible:outline-accent"
          aria-label="Voltar"
        >
          <svg className="w-4 h-4 md:w-5 md:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M15 19l-7-7 7-7" /></svg>
        </button>
        <button
          onClick={() => handleScroll(refTarget, 'right')}
          className="w-10 h-10 md:w-14 md:h-14 rounded-full bg-white border border-gray-100 flex items-center justify-center hover:bg-primary hover:text-white transition-all active:scale-90 shadow-md focus-visible:outline-accent"
          aria-label="Avançar"
        >
          <svg className="w-4 h-4 md:w-5 md:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M9 5l7 7-7 7" /></svg>
        </button>
      </div>
    </div>
  );

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white" role="status">
        <div className="text-center font-serif text-xl md:text-2xl animate-pulse text-accent tracking-tighter uppercase">
          Sincronizando Inteligência...
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-6 md:px-16 lg:px-24 pt-4 md:pt-10 space-y-16 md:space-y-32 overflow-hidden">

      {/* 1. HERO SECTION - More compact to ensure 'Briefings Diários' peeks through */}
      <section className="max-w-5xl mx-auto text-center space-y-8 md:space-y-10 pt-10 md:pt-24 pb-12 md:pb-20 animate-in fade-in slide-in-from-top-8 duration-1000">
        <div className="space-y-6 md:space-y-8">
          <div className="flex justify-center">
            <span className="inline-block bg-accent text-white text-[9px] md:text-[11px] font-black uppercase tracking-[0.5em] px-8 py-3 rounded-full shadow-2xl shadow-accent/20">
              Premium Intelligence
            </span>
          </div>
          <h1 className="font-serif text-4xl sm:text-6xl md:text-7xl lg:text-[7.5rem] font-black leading-[0.85] tracking-tighter uppercase text-primary">
            Inteligência <br /> <span className="text-accent italic">Estratégica</span>.
          </h1>
          <p className="text-secondary text-lg md:text-2xl max-w-2xl mx-auto leading-relaxed font-light italic opacity-80 px-4">
            Curadoria técnica sintetizada para líderes que projetam o próximo ciclo econômico.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row justify-center gap-4 md:gap-8 pt-4 px-4">
          <button
            onClick={() => navigate('/newsletters')}
            className="bg-primary text-white px-10 md:px-16 py-5 md:py-6 rounded-full text-[10px] md:text-[12px] font-black uppercase tracking-[0.4em] hover:bg-accent transition-all shadow-xl shadow-primary/5 active:scale-95 flex items-center justify-center gap-4 group"
          >
            Acessar Newsletter
            <svg className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
          </button>
          <button
            onClick={() => navigate('/ultimas-noticias')}
            className="border-2 border-primary/10 text-primary px-10 md:px-16 py-5 md:py-6 rounded-full text-[10px] md:text-[12px] font-black uppercase tracking-[0.4em] hover:border-accent hover:text-accent transition-all flex items-center justify-center gap-4 group"
          >
            Últimas Notícias
            <svg className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity" fill="currentColor" viewBox="0 0 20 20"><path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" /><path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" /></svg>
          </button>
        </div>

        {/* Scroll Hint for Desktop */}
        <div className="hidden lg:flex flex-col items-center pt-8 animate-bounce opacity-20">
          <span className="text-[9px] font-black uppercase tracking-[0.4em] mb-2">Role para descobrir</span>
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7-7-7" /></svg>
        </div>
      </section>

      {/* 2. ÚLTIMAS NEWSLETTERS (Briefings) */}
      <section className="animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-300">
        <SectionHeader
          title="Briefings Diários"
          subtitle="O resumo estratégico condensado em dossiês de alta densidade."
        />

        <NavControls
          refTarget={newslettersRef}
          actionLabel="Ver Arquivo"
          onAction={() => navigate('/newsletters')}
        />

        {newsletters.length > 0 ? (
          <div
            ref={newslettersRef}
            className="flex gap-8 md:gap-16 overflow-x-auto pb-12 snap-x snap-mandatory scrollbar-hide scroll-smooth -mx-6 px-6 md:-mx-16 md:px-16 lg:-mx-24 lg:px-24"
          >
            {newsletters.map(nl => (
              <div key={nl.id} className="min-w-[85vw] md:min-w-[400px] snap-start">
                <Link to={`/newsletter/${nl.id}`}>
                  <NewsCard item={nl} />
                </Link>
              </div>
            ))}
          </div>
        ) : (
          <div className="flex items-center justify-center py-12 border border-dashed border-gray-200 rounded-3xl bg-gray-50/50">
            <p className="text-sm font-medium text-gray-400 uppercase tracking-widest">Ainda não há briefings disponíveis</p>
          </div>
        )}
      </section>

      {/* 3. ÚLTIMAS NOTÍCIAS */}
      <section className="animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-500">
        <SectionHeader
          title="Últimas Notícias"
          subtitle="Relatórios técnicos processados em tempo real por nossa infraestrutura."
        />

        <NavControls
          refTarget={newsRef}
          actionLabel="Ver acervo completo"
          onAction={() => navigate('/ultimas-noticias')}
        />

        {news.length > 0 ? (
          <div
            ref={newsRef}
            className="flex gap-8 md:gap-16 overflow-x-auto pb-12 snap-x snap-mandatory scrollbar-hide scroll-smooth -mx-6 px-6 md:-mx-16 md:px-16 lg:-mx-24 lg:px-24"
          >
            {news.map(item => (
              <div key={item.id} className="min-w-[85vw] md:min-w-[380px] snap-start">
                <NewsCard item={item} />
              </div>
            ))}
          </div>
        ) : (
          <div className="flex items-center justify-center py-12 border border-dashed border-gray-200 rounded-3xl bg-gray-50/50">
            <p className="text-sm font-medium text-gray-400 uppercase tracking-widest">Ainda não há inteligência disponível</p>
          </div>
        )}
      </section>

      {/* 4. EDIÇÕES MENSAIS */}
      <section className="bg-lightGray py-20 md:py-32 -mx-6 px-6 md:-mx-16 md:px-16 lg:-mx-24 lg:px-24 overflow-hidden rounded-[3rem] md:rounded-[6rem] border-y border-gray-50">
        <div className="container mx-auto relative">
          <SectionHeader
            title="Edições Mensais"
            subtitle="Análises verticais de setores estratégicos e disrupção tecnológica."
          />

          <NavControls refTarget={editorialsRef} actionLabel="Ver todas as Edições" onAction={() => navigate('/edicoes')} />

          {editorials.length > 0 ? (
            <div ref={editorialsRef} className="flex gap-8 md:gap-16 overflow-x-auto pb-12 snap-x snap-mandatory scrollbar-hide scroll-smooth">
              {editorials.map(ed => (
                <div key={ed.id} className="min-w-[280px] md:min-w-[380px] snap-start group cursor-pointer" onClick={() => navigate(`/newsletter/${ed.id}`)}>
                  <div className="aspect-[3/4] rounded-[2rem] md:rounded-[3rem] overflow-hidden shadow-xl mb-6 md:mb-8 relative bg-white">
                    <img src={ed.imageUrl} className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-1000 group-hover:scale-105" alt={ed.theme} />
                    <div className="absolute inset-0 bg-primary/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center backdrop-blur-md">
                      <button className="bg-white text-primary px-8 py-4 rounded-full text-[10px] font-black uppercase tracking-[0.3em] shadow-2xl">Ler Edição</button>
                    </div>
                  </div>
                  <div className="px-4">
                    <p className="text-[9px] font-black uppercase tracking-[0.4em] text-accent mb-2 md:mb-3">{ed.monthYear}</p>
                    <h4 className="font-serif text-xl md:text-3xl font-black uppercase tracking-tighter leading-tight group-hover:text-accent transition-colors">{ed.theme}</h4>
                    {ed.summary && (
                      <p className="text-secondary text-sm md:text-base font-light italic mt-3 opacity-60 leading-relaxed line-clamp-2">
                        {ed.summary}
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="flex items-center justify-center py-20 md:py-32">
              <p className="text-sm md:text-base font-medium text-gray-400 uppercase tracking-widest">Nenhuma edição publicada</p>
            </div>
          )}
        </div>
      </section>

      {/* 5. BRIEFINGS VISUAIS */}
      <section className="pb-8">
        <SectionHeader
          title="Briefings Visuais"
          subtitle="Inteligência sintetizada em formatos de vídeo de alta densidade."
        />

        <NavControls refTarget={videosRef} actionLabel="Ver todos os vídeos" onAction={() => navigate('/videos')} />

        {videos.length > 0 ? (
          <div ref={videosRef} className="flex gap-8 md:gap-12 overflow-x-auto pb-12 snap-x snap-mandatory scrollbar-hide scroll-smooth -mx-6 px-6 md:-mx-16 md:px-16 lg:-mx-24 lg:px-24">
            {videos.map(video => (
              <div key={video.id} className="min-w-[300px] md:min-w-[480px] snap-start group cursor-pointer">
                <div className="aspect-video rounded-[2rem] md:rounded-[3rem] overflow-hidden mb-6 md:mb-8 relative shadow-xl bg-black">
                  <img src={video.imageUrl} className="w-full h-full object-cover opacity-80 grayscale group-hover:grayscale-0 group-hover:scale-105 group-hover:opacity-100 transition-all duration-1000" alt={video.title} />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-16 h-16 bg-white/95 text-primary rounded-full flex items-center justify-center shadow-xl group-hover:scale-110 transition-transform">
                      <svg className="w-8 h-8 fill-current translate-x-1" viewBox="0 0 24 24"><path d="M8 5v14l11-7z" /></svg>
                    </div>
                  </div>
                </div>
                <div className="px-4">
                  <p className="text-[9px] font-black uppercase tracking-[0.4em] text-accent mb-2 md:mb-3">{video.category}</p>
                  <h4 className="font-serif text-xl md:text-3xl font-black uppercase tracking-tighter leading-tight group-hover:text-accent transition-colors">{video.title}</h4>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="flex items-center justify-center py-12 border border-dashed border-gray-200 rounded-3xl bg-gray-50/50">
            <p className="text-sm font-medium text-gray-400 uppercase tracking-widest">Ainda não há vídeos disponíveis</p>
          </div>
        )}
      </section>
      {/* 6. ASSINE A INTELIGÊNCIA */}
      <section className="max-w-[1280px] mx-auto overflow-hidden rounded-[2.5rem] md:rounded-[4rem] bg-lightGray border border-gray-100 shadow-2xl relative group mb-12">
        <div className="flex flex-col lg:flex-row items-stretch">
          <div className="lg:w-1/2 relative min-h-[300px] md:min-h-[500px] overflow-hidden order-1">
            <img
              src="https://images.unsplash.com/photo-1542744173-8e7e53415bb0?auto=format&fit=crop&q=80&w=1200"
              alt="Estratégia Corporativa e Análise"
              className="absolute inset-0 w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-1000 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-primary/50 to-transparent lg:bg-gradient-to-r" aria-hidden="true"></div>
            <div className="absolute bottom-8 left-8 z-10">
              <span className="text-white text-[9px] font-black uppercase tracking-[0.5em] bg-accent px-6 py-3 rounded-full shadow-2xl">Terminal Exclusivo</span>
            </div>
          </div>

          <div className="lg:w-1/2 p-10 md:p-20 flex flex-col justify-center bg-white order-2">
            <h2 className="font-serif text-4xl md:text-6xl font-black text-primary uppercase leading-[0.9] tracking-tighter mb-6">
              Assine a <br /> <span className="text-accent">Inteligência</span>
            </h2>
            <p className="text-secondary text-lg md:text-2xl font-light leading-relaxed mb-10 italic opacity-90">
              Receba o briefing matinal que dita o ritmo das decisões estratégicas. Zero ruído, 100% tático.
            </p>
            <NewsletterForm variant="card" theme="light" />
          </div>
        </div>
      </section>

    </div>
  );
};

export default Home;
