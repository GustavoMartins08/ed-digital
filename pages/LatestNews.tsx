
import React, { useEffect, useState, useRef, useCallback } from 'react';
import NewsCard from '../components/NewsCard';
import SectionHeader from '../components/SectionHeader';
import { fetchLatestNews } from '../lib/mcpClient';
import { NewsItem } from '../types';

const LatestNews: React.FC = () => {
  const [news, setNews] = useState<NewsItem[]>([]);
  const [activeCategory, setActiveCategory] = useState('Todas');
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  
  const observerTarget = useRef<HTMLDivElement>(null);

  const categories = ['Todas', 'Negócios', 'Startups', 'Inovação', 'Carreira', 'Tecnologia', 'IA', 'Mercado'];

  // Carga inicial e troca de categoria
  useEffect(() => {
    const loadInitialNews = async () => {
      setLoading(true);
      setPage(1);
      setHasMore(true);
      const data = await fetchLatestNews(activeCategory);
      setNews(data);
      setLoading(false);
    };
    loadInitialNews();
  }, [activeCategory]);

  // Função para carregar mais itens (Simulando paginação com o mock atual)
  const loadMoreItems = useCallback(async () => {
    if (loadingMore || !hasMore) return;
    
    setLoadingMore(true);
    // Simula atraso de rede para feedback visual
    await new Promise(resolve => setTimeout(resolve, 1200));
    
    const moreData = await fetchLatestNews(activeCategory);
    
    // Simulação: paramos após 4 "páginas" no mock
    if (page >= 4) {
      setHasMore(false);
    } else {
      // Modificamos os IDs para evitar colisões no React (apenas para o mock)
      const newsWithNewIds = moreData.map(item => ({
        ...item,
        id: `${item.id}-p${page}`
      }));
      
      setNews(prev => [...prev, ...newsWithNewIds]);
      setPage(prev => prev + 1);
    }
    
    setLoadingMore(false);
  }, [activeCategory, page, loadingMore, hasMore]);

  // Intersection Observer para disparar o scroll infinito
  useEffect(() => {
    const observer = new IntersectionObserver(
      entries => {
        if (entries[0].isIntersecting && hasMore && !loading && !loadingMore) {
          loadMoreItems();
        }
      },
      { threshold: 0.1, rootMargin: '100px' }
    );

    if (observerTarget.current) {
      observer.observe(observerTarget.current);
    }

    return () => {
      if (observerTarget.current) {
        observer.unobserve(observerTarget.current);
      }
    };
  }, [loadMoreItems, hasMore, loading, loadingMore]);

  return (
    <div className="container mx-auto px-4 py-16 md:py-32">
      <SectionHeader 
        title="Últimas Notícias" 
        subtitle="O pulso do mercado atualizado em tempo real por nossa inteligência artificial."
      />

      <nav className="flex gap-4 overflow-x-auto pb-8 mb-16 scrollbar-hide" aria-label="Filtro de categorias">
        {categories.map(cat => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className={`whitespace-nowrap px-8 py-3 rounded-full text-[11px] font-black uppercase tracking-[0.2em] transition-all focus-visible:ring-2 focus-visible:ring-accent ${
              activeCategory === cat 
              ? 'bg-accent text-white shadow-xl shadow-accent/20' 
              : 'bg-lightGray text-secondary hover:bg-gray-200'
            }`}
          >
            {cat}
          </button>
        ))}
      </nav>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-16 md:gap-24">
          {[1,2,3,4].map(i => (
            <div key={i} className="animate-pulse space-y-8" aria-hidden="true">
              <div className="aspect-video bg-lightGray rounded-[2.5rem]"></div>
              <div className="space-y-4 px-2">
                <div className="h-4 bg-lightGray rounded-full w-1/4"></div>
                <div className="h-10 bg-lightGray rounded-2xl w-3/4"></div>
                <div className="h-20 bg-lightGray rounded-2xl w-full"></div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="space-y-24">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-16 md:gap-24">
            {news.length > 0 ? (
              news.map((item, index) => (
                <div key={item.id} className="animate-in fade-in slide-in-from-bottom-4 duration-700" style={{ animationDelay: `${(index % 4) * 100}ms` }}>
                  <NewsCard item={item} variant="vertical" />
                </div>
              ))
            ) : (
              <div className="col-span-full py-32 text-center border-2 border-dashed border-gray-100 rounded-[3rem]">
                <p className="text-gray-400 text-xs font-black uppercase tracking-[0.5em]">Nenhuma inteligência encontrada para este setor.</p>
              </div>
            )}
          </div>

          {/* Elemento Sentinela e Loading More UI */}
          <div 
            ref={observerTarget} 
            className="py-20 flex flex-col items-center justify-center gap-6"
            aria-live="polite"
          >
            {loadingMore && (
              <>
                <div className="flex gap-2">
                  <span className="w-2 h-2 bg-accent rounded-full animate-bounce [animation-delay:-0.3s]"></span>
                  <span className="w-2 h-2 bg-accent rounded-full animate-bounce [animation-delay:-0.15s]"></span>
                  <span className="w-2 h-2 bg-accent rounded-full animate-bounce"></span>
                </div>
                <p className="text-[10px] font-black uppercase tracking-[0.6em] text-gray-400">Processando novos relatórios...</p>
              </>
            )}
            {!hasMore && news.length > 0 && (
              <div className="flex flex-col items-center gap-4">
                <div className="w-1 h-12 bg-gradient-to-b from-gray-100 to-transparent rounded-full"></div>
                <p className="text-[10px] font-black uppercase tracking-[0.6em] text-gray-300">Você chegou ao fim do acervo estratégico.</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default LatestNews;
