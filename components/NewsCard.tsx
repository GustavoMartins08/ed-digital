
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { NewsItem } from '../types';

interface NewsCardProps {
  item: NewsItem;
  variant?: 'horizontal' | 'vertical';
}

const NewsCard: React.FC<NewsCardProps> = ({ item, variant = 'vertical' }) => {
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const [isCopied, setIsCopied] = useState(false);
  const [isSaved, setIsSaved] = useState(false);

  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem('saved_articles') || '[]');
    setIsSaved(saved.includes(item.id));
  }, [item.id]);

  const toggleSave = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const saved = JSON.parse(localStorage.getItem('saved_articles') || '[]');
    let newSaved;
    if (isSaved) {
      newSaved = saved.filter((id: string) => id !== item.id);
    } else {
      newSaved = [...saved, item.id];
    }
    localStorage.setItem('saved_articles', JSON.stringify(newSaved));
    setIsSaved(!isSaved);
  };

  const handleShareClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsShareModalOpen(true);
  };

  const articleUrl = `${window.location.origin}${window.location.pathname}#/artigo/${item.id}`;
  const shareText = encodeURIComponent(`${item.title} | Inteligência Estratégica`);

  const handleCopyLink = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    navigator.clipboard.writeText(articleUrl).then(() => {
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    });
  };

  const handleSocialShare = (platform: string, shareUrl: string) => {
    window.open(shareUrl, '_blank', 'noopener,noreferrer');
    setIsShareModalOpen(false);
  };

  const socialLinks = [
    { 
      name: 'LinkedIn', 
      color: '#0077b5',
      icon: (
        <svg className="w-5 h-5 md:w-6 md:h-6 fill-current" viewBox="0 0 24 24">
          <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
        </svg>
      ),
      url: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(articleUrl)}`
    },
    { 
      name: 'X (Twitter)', 
      color: '#000000',
      icon: (
        <svg className="w-5 h-5 md:w-6 md:h-6 fill-current" viewBox="0 0 24 24">
          <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
        </svg>
      ),
      url: `https://twitter.com/intent/tweet?url=${encodeURIComponent(articleUrl)}&text=${shareText}`
    },
    { 
      name: 'WhatsApp', 
      color: '#25d366',
      icon: (
        <svg className="w-5 h-5 md:w-6 md:h-6 fill-current" viewBox="0 0 24 24">
          <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.438 9.889-9.886.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z"/>
        </svg>
      ),
      url: `https://api.whatsapp.com/send?text=${shareText}%20${encodeURIComponent(articleUrl)}`
    },
    { 
      name: 'E-mail', 
      color: '#ff2768',
      icon: (
        <svg className="w-5 h-5 md:w-6 md:h-6 fill-none stroke-current" strokeWidth="2.5" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
        </svg>
      ),
      url: `mailto:?subject=${shareText}&body=${encodeURIComponent(item.excerpt)}%0A%0A${encodeURIComponent(articleUrl)}`
    },
  ];

  const shareModal = isShareModalOpen && (
    <div 
      className="fixed inset-0 z-[110] flex items-center justify-center p-6"
      role="dialog"
      aria-modal="true"
      aria-labelledby={`share-title-${item.id}`}
    >
      <div 
        className="absolute inset-0 bg-primary/40 backdrop-blur-md animate-in fade-in duration-300" 
        onClick={(e) => { e.preventDefault(); e.stopPropagation(); setIsShareModalOpen(false); }} 
      />
      <div className="bg-white rounded-[2.5rem] md:rounded-[3.5rem] w-full max-w-lg p-10 md:p-16 relative z-10 shadow-2xl animate-in zoom-in-95 duration-300 border border-gray-100">
        <div className="text-center mb-10 md:mb-12">
          <span className="text-accent text-[10px] font-black uppercase tracking-[0.6em] mb-4 block">Distribuição Premium</span>
          <h3 id={`share-title-${item.id}`} className="font-serif text-2xl md:text-4xl font-black text-primary uppercase tracking-tighter leading-tight">Compartilhar <br /> Insight</h3>
        </div>
        
        <div className="grid grid-cols-2 gap-4 md:gap-6 mb-8">
          {socialLinks.map(social => (
            <button 
              key={social.name}
              className="flex flex-col items-center justify-center gap-4 p-6 md:p-8 rounded-[1.5rem] md:rounded-[2rem] bg-lightGray hover:bg-white hover:shadow-xl hover:ring-2 hover:ring-accent/5 transition-all group active:scale-95 focus-visible:outline-accent"
              onClick={(e) => { 
                e.preventDefault(); 
                e.stopPropagation(); 
                handleSocialShare(social.name, social.url); 
              }}
            >
              <div 
                className="w-10 h-10 md:w-14 md:h-14 rounded-full flex items-center justify-center text-white shadow-lg"
                style={{ backgroundColor: social.color }}
                aria-hidden="true"
              >
                {social.icon}
              </div>
              <span className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-400 group-hover:text-primary">
                {social.name}
              </span>
            </button>
          ))}
        </div>

        <div className="pt-8 border-t border-gray-100">
          <button 
            onClick={handleCopyLink}
            className={`w-full flex items-center justify-between p-6 rounded-2xl transition-all border-2 ${
              isCopied ? 'bg-accent/5 border-accent text-accent' : 'bg-lightGray border-transparent text-primary hover:bg-gray-200'
            }`}
          >
            <div className="flex items-center gap-4">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3" />
              </svg>
              <span className="text-[11px] font-black uppercase tracking-widest">
                {isCopied ? 'Link Copiado!' : 'Copiar Link Estratégico'}
              </span>
            </div>
            {isCopied && (
              <svg className="w-5 h-5 animate-in zoom-in duration-300" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
            )}
          </button>
        </div>

        <button 
          onClick={(e) => { e.preventDefault(); e.stopPropagation(); setIsShareModalOpen(false); }}
          className="mt-10 md:mt-12 w-full text-center text-[10px] font-black uppercase tracking-[0.5em] text-gray-300 hover:text-accent transition-colors focus-visible:outline-accent"
        >
          Cancelar
        </button>
      </div>
    </div>
  );

  if (variant === 'horizontal') {
    return (
      <div className="relative group overflow-hidden rounded-[2rem]">
        <div className="absolute inset-0 bg-accent/[0.03] opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none z-10" />
        
        <Link to={`/artigo/${item.id}`} className="flex gap-4 md:gap-10 items-start relative z-0">
          <div className="w-1/3 aspect-[4/3] rounded-[1.5rem] md:rounded-[2.5rem] overflow-hidden shrink-0 shadow-sm border border-gray-50">
            <img 
              src={item.imageUrl} 
              alt={item.title} 
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-1000 grayscale group-hover:grayscale-0" 
            />
          </div>
          <div className="flex-grow pt-2">
            <span className="inline-block text-[10px] md:text-[11px] font-black uppercase tracking-[0.4em] text-accent mb-4">
              {item.category}
            </span>
            <h3 className="font-serif text-lg md:text-3xl font-black mb-4 group-hover:text-accent transition-colors leading-tight uppercase tracking-tighter">
              {item.title}
            </h3>
            <p className="text-secondary text-xs md:text-lg line-clamp-2 leading-relaxed font-light mb-8 opacity-70">
              {item.excerpt}
            </p>
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between border-t border-gray-100 pt-6 gap-4">
              <div className="flex items-center gap-5 text-[9px] md:text-[11px] font-bold text-gray-400 uppercase tracking-[0.3em]">
                <span className="text-primary/80">{item.source}</span>
                <span className="w-1.5 h-1.5 bg-gray-200 rounded-full"></span>
                <span className="opacity-60">{item.timestamp}</span>
              </div>
              <div className="flex items-center gap-8 self-end sm:self-auto">
                <button 
                  onClick={toggleSave}
                  className={`flex items-center gap-2.5 transition-all active:scale-95 ${isSaved ? 'text-accent' : 'text-gray-300 hover:text-accent'}`}
                >
                  <svg className="w-4.5 h-4.5" fill={isSaved ? "currentColor" : "none"} stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" /></svg>
                  <span className="text-[10px] font-black uppercase tracking-widest hidden sm:inline">{isSaved ? 'Salvo' : 'Salvar'}</span>
                </button>
                <button 
                  onClick={handleShareClick}
                  className="text-[10px] font-black uppercase tracking-widest text-gray-300 hover:text-accent flex items-center gap-2.5 transition-all active:scale-95"
                >
                  <svg className="w-4.5 h-4.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" /></svg>
                  <span className="hidden sm:inline">Compartilhar</span>
                </button>
              </div>
            </div>
          </div>
        </Link>
        {shareModal}
      </div>
    );
  }

  return (
    <div className="relative bg-white h-full flex flex-col rounded-[3rem] md:rounded-[5rem] overflow-hidden group shadow-lg border border-gray-100/50 hover:shadow-2xl hover:border-accent/10 transition-all duration-700">
      <div className="absolute inset-0 bg-gradient-to-br from-accent/[0.02] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none z-10" />
      
      <Link to={`/artigo/${item.id}`} className="block h-full flex flex-col relative z-0">
        <div className="aspect-[16/10] overflow-hidden bg-lightGray relative">
          <img 
            src={item.imageUrl} 
            alt={item.title} 
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000 grayscale group-hover:grayscale-0" 
          />
          <div className="absolute top-8 right-8 flex gap-4 opacity-0 group-hover:opacity-100 transition-opacity z-20">
            <button 
              onClick={toggleSave}
              className={`backdrop-blur-md p-5 rounded-full shadow-2xl active:scale-90 transition-all ${isSaved ? 'bg-accent text-white' : 'bg-white/95 text-primary hover:bg-accent hover:text-white'}`}
            >
              <svg className="w-6 h-6" fill={isSaved ? "currentColor" : "none"} stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" /></svg>
            </button>
            <button 
              onClick={handleShareClick}
              className="bg-white/95 backdrop-blur-md p-5 rounded-full text-primary hover:bg-accent hover:text-white transition-all shadow-2xl active:scale-90"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" /></svg>
            </button>
          </div>
        </div>
        
        <div className="px-8 md:px-14 py-10 md:py-16 flex flex-col flex-grow bg-white relative z-0">
          <div className="mb-8">
            <span className="text-[10px] md:text-[12px] font-black uppercase tracking-[0.5em] text-accent">
              {item.category}
            </span>
          </div>
          
          <h3 className="font-serif text-3xl md:text-5xl font-black mb-8 group-hover:text-accent transition-colors leading-[1.1] uppercase tracking-tighter text-primary">
            {item.title}
          </h3>
          
          <p className="text-secondary text-lg md:text-2xl line-clamp-3 leading-relaxed mb-12 font-light italic opacity-75">
            {item.excerpt}
          </p>
          
          <div className="mt-auto pt-10 border-t border-gray-100 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-8 text-[11px] font-black uppercase tracking-[0.4em] text-gray-400">
            <div className="flex items-center gap-6 flex-wrap">
              <span className="text-primary font-black">{item.source}</span>
              <span className="w-2 h-2 bg-gray-200 rounded-full" aria-hidden="true"></span>
              <span className="opacity-50">{item.timestamp}</span>
            </div>
            
            <div className="flex items-center gap-10 self-end sm:self-auto">
              <button 
                onClick={toggleSave}
                className={`flex items-center gap-3 transition-all active:scale-95 ${isSaved ? 'text-accent' : 'hover:text-accent'}`}
              >
                <svg className="w-5 h-5" fill={isSaved ? "currentColor" : "none"} stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" /></svg>
                <span className="tracking-[0.2em]">{isSaved ? 'Salvo' : 'Salvar'}</span>
              </button>
              
              <button 
                onClick={handleShareClick}
                className="hover:text-accent flex items-center gap-3 transition-all active:scale-95"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" /></svg>
                <span className="tracking-[0.2em]">Compartilhar</span>
              </button>
            </div>
          </div>
        </div>
      </Link>
      {shareModal}
    </div>
  );
};

export default NewsCard;
