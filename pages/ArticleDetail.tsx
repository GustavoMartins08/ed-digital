
import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { fetchLatestNews } from '../lib/mcpClient';
import { NewsItem, ArticleComment } from '../types';
import NewsCard from '../components/NewsCard';

const ArticleDetail: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [article, setArticle] = useState<NewsItem | null>(null);
  const [relatedArticles, setRelatedArticles] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const [showFloatingBack, setShowFloatingBack] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  
  // States para Comentários
  const [comments, setComments] = useState<ArticleComment[]>([]);
  const [commentName, setCommentName] = useState('');
  const [commentText, setCommentText] = useState('');

  // Mock author data
  const author = {
    name: 'Ricardo Montenegro',
    role: 'Analista Chefe de Estratégia',
    company: 'Empresário Digital',
    bio: 'Ricardo é especialista em inovação disruptiva e transformação digital, com mais de 15 anos de experiência aconselhando C-levels em estratégias de crescimento exponencial.',
    avatarUrl: 'https://i.pravatar.cc/150?u=ricardo'
  };

  useEffect(() => {
    const handleScroll = () => {
      setShowFloatingBack(window.scrollY > 400);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const load = async () => {
      window.scrollTo(0, 0); // Reset scroll on navigation
      const all = await fetchLatestNews();
      const found = all.find(a => a.id === id);
      
      if (found) {
        setArticle(found);
        const others = all.filter(a => a.id !== id);
        const related = others
          .filter(a => a.category === found.category)
          .concat(others.filter(a => a.category !== found.category))
          .slice(0, 3);
        
        setRelatedArticles(related);
        
        // Verificar se está salvo
        const saved = JSON.parse(localStorage.getItem('saved_articles') || '[]');
        setIsSaved(saved.includes(id));

        // Carregar comentários do localStorage
        const storedComments = localStorage.getItem(`comments_${id}`);
        if (storedComments) {
          setComments(JSON.parse(storedComments));
        } else {
          setComments([]);
        }
      }
      
      setLoading(false);
    };
    load();
  }, [id]);

  const toggleSave = () => {
    if (!id) return;
    const saved = JSON.parse(localStorage.getItem('saved_articles') || '[]');
    let newSaved;
    if (isSaved) {
      newSaved = saved.filter((sid: string) => sid !== id);
    } else {
      newSaved = [...saved, id];
    }
    localStorage.setItem('saved_articles', JSON.stringify(newSaved));
    setIsSaved(!isSaved);
  };

  const handleSendComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!commentName.trim() || !commentText.trim()) return;

    const newComment: ArticleComment = {
      id: Date.now().toString(),
      articleId: id || '',
      author: commentName,
      content: commentText,
      timestamp: new Date().toLocaleString('pt-BR', { 
        day: '2-digit', 
        month: '2-digit', 
        year: 'numeric', 
        hour: '2-digit', 
        minute: '2-digit' 
      })
    };

    const updatedComments = [newComment, ...comments];
    setComments(updatedComments);
    localStorage.setItem(`comments_${id}`, JSON.stringify(updatedComments));
    
    // Limpar campos
    setCommentName('');
    setCommentText('');
  };

  if (loading) return <div className="p-10 md:p-20 text-center font-serif text-lg md:text-xl animate-pulse uppercase tracking-[0.5em] text-accent" role="status">Abrindo Relatório Estratégico...</div>;
  if (!article) return <div className="p-10 md:p-20 text-center" role="alert">Artigo não encontrado.</div>;

  const socialLinks = [
    { name: 'LinkedIn', icon: 'L', color: '#0077b5' },
    { name: 'Twitter', icon: 'X', color: '#000000' },
    { name: 'WhatsApp', icon: 'W', color: '#25d366' },
    { name: 'E-mail', icon: '@', color: '#ff2768' },
  ];

  return (
    <article className="py-6 md:py-32 bg-white relative selection:bg-accent selection:text-white overflow-hidden" role="main">
      
      {/* Botão Flutuante de Retorno */}
      <button 
        onClick={() => navigate(-1)}
        className={`fixed left-4 md:left-12 top-24 md:top-32 z-50 bg-white/80 backdrop-blur-xl border border-gray-100 p-4 md:p-5 rounded-full shadow-2xl transition-all duration-500 hover:bg-accent hover:text-white hover:-translate-x-2 active:scale-90 group ${showFloatingBack ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-12 pointer-events-none'}`}
        aria-label="Voltar para a página anterior"
      >
        <svg className="w-5 h-5 md:w-6 md:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
        </svg>
      </button>

      <div className="container mx-auto px-4">
        {/* Header Section */}
        <div className="max-w-[850px] mx-auto mb-10 md:mb-20">
          
          <div className="flex items-center justify-between mb-8 md:mb-12">
            <button 
              onClick={() => navigate(-1)}
              className="flex items-center gap-4 text-[10px] md:text-[11px] font-black uppercase tracking-[0.4em] text-gray-400 hover:text-accent transition-colors group focus-visible:outline-accent"
            >
              <svg className="w-4 h-4 transform group-hover:-translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M15 19l-7-7 7-7" />
              </svg>
              Voltar ao Acervo
            </button>
            
            <nav className="hidden sm:flex items-center gap-3 md:gap-4 text-[9px] md:text-[11px] font-black uppercase tracking-[0.4em] md:tracking-[0.8em] text-gray-400" aria-label="Breadcrumb">
               <Link to="/" className="hover:text-accent transition-colors focus-visible:outline-accent">Home</Link>
               <span className="text-gray-200" aria-hidden="true">/</span>
               <Link to="/ultimas-noticias" className="hover:text-accent transition-colors focus-visible:outline-accent">Relatórios</Link>
               <span className="text-gray-200" aria-hidden="true">/</span>
               <span className="text-accent" aria-current="page">{article.category}</span>
            </nav>
          </div>

          <h1 className="font-serif text-3xl sm:text-4xl md:text-7xl lg:text-8xl font-black mb-8 md:mb-16 leading-[1] md:leading-[0.85] tracking-tighter text-primary uppercase">
            {article.title}
          </h1>

          <div className="flex flex-col md:flex-row md:items-center justify-between gap-8 md:gap-10 mb-10 md:mb-16 py-6 md:py-12 border-y border-gray-100">
            <div className="flex flex-wrap items-center gap-6 md:gap-16">
              <div className="flex flex-col">
                <span className="text-[9px] md:text-[10px] uppercase font-bold text-gray-500 tracking-[0.4em] md:tracking-[0.5em] mb-2 md:mb-4">Origem do Insight</span>
                <span className="text-[10px] md:text-[11px] font-black uppercase flex items-center gap-2 md:gap-3 tracking-widest text-primary">
                  <span className="w-1.5 h-1.5 bg-accent rounded-full animate-pulse" aria-hidden="true"></span>
                  {article.source}
                </span>
              </div>
              <div className="hidden sm:block w-px h-12 md:h-16 bg-gray-100"></div>
              <div className="flex flex-col">
                <span className="text-[9px] md:text-[10px] uppercase font-bold text-gray-500 tracking-[0.4em] md:tracking-[0.5em] mb-2 md:mb-4">Data de Emissão</span>
                <span className="text-[10px] md:text-[11px] font-black uppercase text-primary tracking-widest">{article.timestamp}</span>
              </div>
            </div>

            <div className="flex gap-4">
              <button 
                onClick={toggleSave}
                className={`inline-flex items-center justify-center gap-3 md:gap-4 text-[10px] md:text-[11px] font-black uppercase tracking-[0.3em] md:tracking-[0.5em] px-8 md:px-10 py-4 md:py-5 rounded-full border-2 transition-all active:scale-95 focus-visible:ring-2 focus-visible:ring-accent ${
                  isSaved ? 'bg-accent border-accent text-white shadow-xl shadow-accent/20' : 'bg-transparent border-primary/10 text-primary hover:border-accent hover:text-accent'
                }`}
              >
                <svg className="w-4 h-4" fill={isSaved ? "currentColor" : "none"} stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" /></svg>
                {isSaved ? 'Salvo no Acervo' : 'Salvar Relatório'}
              </button>
              <button 
                onClick={() => setIsShareModalOpen(true)}
                className="inline-flex items-center justify-center gap-3 md:gap-4 text-[10px] md:text-[11px] font-black uppercase tracking-[0.3em] md:tracking-[0.5em] text-white bg-primary px-8 md:px-14 py-4 md:py-5 rounded-full hover:bg-accent transition-all shadow-xl shadow-primary/10 active:scale-95 text-center focus-visible:ring-2 focus-visible:ring-accent"
              >
                Distribuir Visão
              </button>
            </div>
          </div>
        </div>

        {/* Featured Image */}
        <div className="max-w-[1200px] mx-auto mb-12 md:mb-32">
          <div className="aspect-video md:aspect-[21/9] rounded-[1.5rem] md:rounded-[4rem] overflow-hidden shadow-2xl ring-1 ring-black/5">
            <img 
              src={article.imageUrl} 
              className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-1000" 
              alt={`Imagem de capa: ${article.title}`} 
            />
          </div>
        </div>

        {/* Main Content Area */}
        <div className="max-w-[650px] mx-auto">
          <div className="space-y-12 md:space-y-32">
            
            <p className="text-xl md:text-4xl font-sans font-light leading-relaxed md:leading-[1.6] text-primary/80 tracking-tight italic">
              {article.excerpt}
            </p>

            <div className="text-base md:text-2xl text-secondary font-light leading-relaxed md:leading-[2.2] space-y-8 md:space-y-20">
              <p className="editorial-drop-cap">
                O cenário macroeconômico global exige, hoje, mais do que simples adaptação; exige uma reconfiguração completa do DNA organizacional. Enquanto modelos tradicionais de gestão se mostram obsoletos diante da velocidade da inteligência artificial, líderes visionários estão utilizando dados sintetizados para antecipar movimentos de mercado antes mesmo que eles se consolidem.
              </p>
              
              <p>
                A integração de ecossistemas digitais robustos não é mais uma opção de luxo para grandes corporações, mas sim a espinha dorsal de qualquer operação que pretenda manter relevância no próximo ciclo de inovação. Observamos uma migração massiva de capital para infraestruturas que privilegiam a agilidade decisória em detrimento da burocracia hierárquica.
              </p>

              <h2 className="font-serif text-2xl md:text-6xl font-black text-primary mt-12 md:mt-40 mb-6 md:mb-12 leading-tight md:leading-[0.95] uppercase tracking-tighter">
                A Próxima Fronteira da <span className="text-accent italic">Eficiência</span>
              </h2>

              <p>
                Dados recentes sugerem que empresas que adotaram automação de ponta a ponta no último semestre viram um aumento de 40% em sua capacidade produtiva. Este fenômeno, apelidado por especialistas como a "Grande Aceleração", está redefinindo as métricas de sucesso em todos os setores, do varejo à logística pesada.
              </p>

              <aside className="my-10 md:my-32 bg-lightGray rounded-[2rem] md:rounded-[4rem] p-8 md:p-24 border border-gray-100 relative overflow-hidden group">
                <div className="absolute top-0 right-0 w-40 h-40 md:w-80 md:h-80 bg-accent/5 rounded-full -translate-y-1/2 translate-x-1/2 group-hover:scale-110 transition-transform duration-1000" aria-hidden="true"></div>
                <blockquote className="text-xl md:text-6xl text-primary font-serif font-black leading-tight md:leading-[1.1] relative z-10 tracking-tighter uppercase italic">
                  "Informação é commodity; o insight estratégico é a nova moeda global."
                </blockquote>
              </aside>

              <p>
                Concluímos este briefing com uma provocação: sua liderança está preparada para gerir uma força de trabalho onde o componente humano e o algorítmico são indistinguíveis em termos de contribuição estratégica? O futuro não está batendo à porta; ele já está escrevendo o próximo capítulo da sua indústria.
              </p>
            </div>

            {/* Author Bio Section */}
            <section className="pt-12 md:pt-24 mt-16 md:mt-48 border-t border-gray-100" aria-labelledby="author-title">
              <div className="flex flex-col md:flex-row items-center md:items-start gap-8 md:gap-12">
                <div className="shrink-0">
                   <img 
                    src={author.avatarUrl} 
                    alt={author.name} 
                    className="w-20 h-20 md:w-44 md:h-44 rounded-full object-cover grayscale ring-4 md:ring-8 ring-lightGray shadow-xl" 
                  />
                </div>
                <div className="text-center md:text-left pt-2 md:pt-4">
                  <span className="text-accent text-[9px] md:text-[11px] font-black uppercase tracking-[0.4em] md:tracking-[0.6em] mb-2 md:mb-4 block">Redação Estratégica</span>
                  <h4 id="author-title" className="font-serif text-xl md:text-4xl font-black mb-1 md:mb-2 uppercase tracking-tight text-primary">{author.name}</h4>
                  <p className="text-[9px] md:text-[11px] font-black uppercase tracking-[0.2em] md:tracking-[0.3em] text-gray-500 mb-4 md:mb-8">{author.role} • {author.company}</p>
                  <p className="text-sm md:text-xl text-secondary leading-relaxed font-light italic max-w-lg">
                    "{author.bio}"
                  </p>
                </div>
              </div>
            </section>
          </div>
        </div>

        {/* Related Articles */}
        <section className="max-w-[1200px] mx-auto mt-20 md:mt-60 pt-16 md:pt-32 border-t border-gray-100" aria-labelledby="related-title">
          <div className="flex flex-col md:flex-row items-baseline justify-between mb-10 md:mb-24 gap-4 md:gap-6">
            <h3 id="related-title" className="font-serif text-3xl md:text-7xl font-black uppercase tracking-tighter text-primary italic">Continuidade <br />Estratégica</h3>
            <Link to="/ultimas-noticias" className="text-[10px] md:text-[11px] font-black uppercase tracking-[0.4em] md:tracking-[0.6em] text-accent border-b-2 border-accent/20 pb-1 md:pb-2 hover:text-primary hover:border-primary transition-all whitespace-nowrap focus-visible:outline-accent">Ver Todo o Acervo</Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-20">
            {relatedArticles.map(item => (
              <NewsCard key={item.id} item={item} />
            ))}
          </div>
        </section>

        {/* Comments Section */}
        <section className="max-w-[850px] mx-auto mt-20 md:mt-48 pt-16 border-t border-gray-100" aria-labelledby="comments-title">
          <div className="mb-10 md:mb-24">
            <span className="text-accent text-[10px] md:text-[11px] font-black uppercase tracking-[0.4em] md:tracking-[0.5em] mb-3 md:mb-4 block">Fórum de Liderança</span>
            <h3 id="comments-title" className="font-serif text-3xl md:text-6xl font-black uppercase tracking-tighter text-primary">Diálogo <br /> Estratégico</h3>
          </div>

          {/* Comment Form */}
          <form onSubmit={handleSendComment} className="bg-lightGray p-6 md:p-12 rounded-[1.5rem] md:rounded-[2.5rem] mb-12 md:mb-32">
            <div className="grid grid-cols-1 gap-4 md:gap-6">
              <div>
                <label htmlFor="comment-author" className="sr-only">Seu Nome e Cargo</label>
                <input 
                  id="comment-author"
                  required
                  type="text" 
                  placeholder="Seu Nome e Título"
                  className="w-full bg-white border border-gray-100 rounded-xl md:rounded-2xl px-5 py-3 md:px-6 md:py-4 text-primary font-bold placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-accent/20 transition-all text-sm md:text-base"
                  value={commentName}
                  onChange={(e) => setCommentName(e.target.value)}
                />
              </div>
              <div>
                <label htmlFor="comment-content" className="sr-only">Conteúdo do Comentário</label>
                <textarea 
                  id="comment-content"
                  required
                  rows={4}
                  placeholder="Compartilhe seu insight sobre este relatório..."
                  className="w-full bg-white border border-gray-100 rounded-xl md:rounded-2xl px-5 py-3 md:px-6 md:py-4 text-primary font-medium placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-accent/20 transition-all resize-none text-sm md:text-base"
                  value={commentText}
                  onChange={(e) => setCommentText(e.target.value)}
                />
              </div>
              <button 
                type="submit"
                className="bg-primary text-white font-black uppercase tracking-[0.2em] md:tracking-[0.3em] px-8 md:px-12 py-4 md:py-5 rounded-xl md:rounded-2xl hover:bg-accent transition-all shadow-xl shadow-primary/10 active:scale-95 text-[10px] md:text-[11px] w-full sm:w-fit focus-visible:ring-2 focus-visible:ring-accent"
              >
                Publicar Insight
              </button>
            </div>
          </form>

          {/* Comments List */}
          <div className="space-y-8 md:space-y-16">
            {comments.length > 0 ? (
              comments.map(comment => (
                <div key={comment.id} className="group relative">
                  <div className="flex gap-4 md:gap-10">
                    <div className="shrink-0" aria-hidden="true">
                      <div className="w-10 h-10 md:w-16 md:h-16 rounded-full bg-gray-100 flex items-center justify-center font-serif font-black text-gray-400 text-base md:text-xl uppercase group-hover:bg-accent group-hover:text-white transition-all">
                        {comment.author.charAt(0)}
                      </div>
                    </div>
                    <div className="flex-grow">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-2 md:mb-4 gap-1">
                        <h4 className="font-black text-[10px] md:text-sm uppercase tracking-wider text-primary">{comment.author}</h4>
                        <span className="text-[9px] md:text-[10px] font-bold text-gray-400 uppercase tracking-widest">{comment.timestamp}</span>
                      </div>
                      <p className="text-secondary text-sm md:text-lg font-light leading-relaxed">
                        {comment.content}
                      </p>
                    </div>
                  </div>
                  <div className="absolute -left-2 md:-left-4 top-0 bottom-0 w-0.5 md:w-1 bg-accent/0 group-hover:bg-accent transition-all rounded-full" aria-hidden="true"></div>
                </div>
              ))
            ) : (
              <div className="py-12 md:py-20 text-center border-2 border-dashed border-gray-100 rounded-[2rem] md:rounded-[3rem]">
                <p className="text-gray-400 text-[10px] md:text-xs font-black uppercase tracking-[0.3em] md:tracking-[0.4em]">Seja o primeiro a contribuir com este dossiê.</p>
              </div>
            )}
          </div>
        </section>
      </div>

      {/* Share Modal */}
      {isShareModalOpen && (
        <div 
          className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-6"
          role="dialog"
          aria-modal="true"
          aria-labelledby="share-modal-title"
        >
          <div className="absolute inset-0 bg-primary/40 backdrop-blur-2xl animate-in fade-in duration-500" onClick={() => setIsShareModalOpen(false)} aria-hidden="true" />
          <div className="bg-white rounded-[2rem] md:rounded-[4rem] w-full max-w-xl p-8 md:p-24 relative z-10 shadow-2xl animate-in zoom-in-95 duration-500">
            <div className="text-center mb-8 md:mb-16">
              <span className="text-accent text-[9px] md:text-[11px] font-black uppercase tracking-[0.5em] md:tracking-[0.7em] mb-4 md:mb-6 block">Premium Distribution</span>
              <h3 id="share-modal-title" className="font-serif text-2xl md:text-5xl font-black text-primary uppercase tracking-tighter leading-none">Distribuir <br /> Insight</h3>
            </div>
            
            <div className="grid grid-cols-2 gap-3 md:gap-8">
              <button 
                className="flex flex-col items-center justify-center gap-3 md:gap-6 p-6 md:p-12 rounded-[1.5rem] md:rounded-[3rem] bg-lightGray hover:bg-white hover:shadow-2xl hover:ring-2 hover:ring-accent/10 transition-all group active:scale-95 focus-visible:outline-accent"
                onClick={() => {
                  const url = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(window.location.href)}`;
                  window.open(url, '_blank');
                  setIsShareModalOpen(false);
                }}
              >
                <div className="w-10 h-10 md:w-16 md:h-16 rounded-full flex items-center justify-center text-white text-base md:text-2xl font-black shadow-xl bg-[#0077b5]">
                  L
                </div>
                <span className="text-[9px] md:text-[11px] font-black uppercase tracking-[0.3em] md:tracking-[0.4em] text-gray-500 group-hover:text-primary">
                  LinkedIn
                </span>
              </button>
              <button 
                className="flex flex-col items-center justify-center gap-3 md:gap-6 p-6 md:p-12 rounded-[1.5rem] md:rounded-[3rem] bg-lightGray hover:bg-white hover:shadow-2xl hover:ring-2 hover:ring-accent/10 transition-all group active:scale-95 focus-visible:outline-accent"
                onClick={() => {
                  const url = `https://twitter.com/intent/tweet?url=${encodeURIComponent(window.location.href)}&text=${encodeURIComponent(article.title)}`;
                  window.open(url, '_blank');
                  setIsShareModalOpen(false);
                }}
              >
                <div className="w-10 h-10 md:w-16 md:h-16 rounded-full flex items-center justify-center text-white text-base md:text-2xl font-black shadow-xl bg-[#000000]">
                  X
                </div>
                <span className="text-[9px] md:text-[11px] font-black uppercase tracking-[0.3em] md:tracking-[0.4em] text-gray-500 group-hover:text-primary">
                  X
                </span>
              </button>
              <button 
                className="flex flex-col items-center justify-center gap-3 md:gap-6 p-6 md:p-12 rounded-[1.5rem] md:rounded-[3rem] bg-lightGray hover:bg-white hover:shadow-2xl hover:ring-2 hover:ring-accent/10 transition-all group active:scale-95 focus-visible:outline-accent"
                onClick={() => {
                  const url = `https://api.whatsapp.com/send?text=${encodeURIComponent(article.title)}%20${encodeURIComponent(window.location.href)}`;
                  window.open(url, '_blank');
                  setIsShareModalOpen(false);
                }}
              >
                <div className="w-10 h-10 md:w-16 md:h-16 rounded-full flex items-center justify-center text-white text-base md:text-2xl font-black shadow-xl bg-[#25d366]">
                  W
                </div>
                <span className="text-[9px] md:text-[11px] font-black uppercase tracking-[0.3em] md:tracking-[0.4em] text-gray-500 group-hover:text-primary">
                  WhatsApp
                </span>
              </button>
              <button 
                className="flex flex-col items-center justify-center gap-3 md:gap-6 p-6 md:p-12 rounded-[1.5rem] md:rounded-[3rem] bg-lightGray hover:bg-white hover:shadow-2xl hover:ring-2 hover:ring-accent/10 transition-all group active:scale-95 focus-visible:outline-accent"
                onClick={() => {
                  const url = `mailto:?subject=${encodeURIComponent(article.title)}&body=${encodeURIComponent(window.location.href)}`;
                  window.location.href = url;
                  setIsShareModalOpen(false);
                }}
              >
                <div className="w-10 h-10 md:w-16 md:h-16 rounded-full flex items-center justify-center text-white text-base md:text-2xl font-black shadow-xl bg-[#ff2768]">
                  @
                </div>
                <span className="text-[9px] md:text-[11px] font-black uppercase tracking-[0.3em] md:tracking-[0.4em] text-gray-500 group-hover:text-primary">
                  E-mail
                </span>
              </button>
            </div>

            <button 
              onClick={() => setIsShareModalOpen(false)}
              className="mt-8 md:mt-16 w-full text-center text-[9px] md:text-[11px] font-black uppercase tracking-[0.4em] md:tracking-[0.5em] text-gray-400 hover:text-accent transition-colors focus-visible:outline-accent"
              aria-label="Fechar painel de compartilhamento"
            >
              Fechar Painel
            </button>
          </div>
        </div>
      )}
    </article>
  );
};

export default ArticleDetail;
