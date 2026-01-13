
import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import Logo from './Logo';

const Header: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const user = localStorage.getItem('auth_user');
    setIsLoggedIn(!!user);
  }, [location.pathname]);

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'Notícias', path: '/ultimas-noticias' },
    { name: 'Newsletters', path: '/newsletters' },
    { name: 'Dossiês', path: '/edicoes' },
    { name: 'Vídeos', path: '/videos' },
    { name: 'Colunas', path: '/colunas' },
  ];

  useEffect(() => {
    if (isMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isMenuOpen]);

  useEffect(() => {
    setIsMenuOpen(false);
  }, [location.pathname]);

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);
  const closeMenu = () => setIsMenuOpen(false);

  return (
    <>
      <header className="sticky top-0 z-[100] bg-white border-b border-gray-100" role="banner">
        <div className="container mx-auto px-6 py-4 md:py-6 flex items-center justify-between relative z-[110]">
          <Link 
            to="/" 
            className="group transition-transform hover:scale-[1.02] active:scale-95" 
            onClick={closeMenu}
            aria-label="Ir para a Home"
          >
            <Logo />
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden lg:flex items-center space-x-10" aria-label="Navegação Principal">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`text-[12px] font-black uppercase tracking-[0.2em] transition-all hover:text-accent relative py-2 ${
                  location.pathname === link.path ? 'text-accent' : 'text-primary'
                }`}
              >
                {link.name}
                {location.pathname === link.path && (
                  <span className="absolute bottom-0 left-0 w-full h-0.5 bg-accent" />
                )}
              </Link>
            ))}
            
            <div className="flex items-center gap-6 border-l border-gray-100 pl-10">
              <Link 
                to={isLoggedIn ? "/perfil" : "/login"} 
                className={`p-2 rounded-full transition-all hover:bg-lightGray ${location.pathname === (isLoggedIn ? '/perfil' : '/login') ? 'text-accent' : 'text-primary'}`}
                aria-label={isLoggedIn ? "Meu Perfil" : "Fazer Login"}
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </Link>

              <Link to="/newsletters" className="bg-primary text-white px-8 py-3 rounded-full text-[11px] font-black uppercase tracking-[0.2em] hover:bg-accent transition-all shadow-xl shadow-primary/10 active:scale-95">
                Assinar
              </Link>
            </div>
          </nav>

          {/* Mobile Actions (Icone sempre visível) */}
          <div className="lg:hidden flex items-center gap-4">
            <Link 
              to={isLoggedIn ? "/perfil" : "/login"} 
              className="text-primary p-1"
              aria-label="Acesso do Usuário"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            </Link>
            <button 
              className="text-primary p-2 focus:outline-none relative z-[1001]"
              onClick={toggleMenu}
              aria-expanded={isMenuOpen}
              aria-label={isMenuOpen ? "Fechar menu" : "Abrir menu"}
            >
              <div className="w-8 h-8 flex flex-col justify-center items-end gap-1.5">
                <span className={`block h-0.5 bg-primary transition-all duration-300 origin-center ${isMenuOpen ? 'w-8 rotate-45 translate-y-1' : 'w-8'}`} />
                <span className={`block h-0.5 bg-primary transition-all duration-300 ${isMenuOpen ? 'opacity-0' : 'w-6 opacity-100'}`} />
                <span className={`block h-0.5 bg-primary transition-all duration-300 origin-center ${isMenuOpen ? 'w-8 -rotate-45 -translate-y-1' : 'w-4'}`} />
              </div>
            </button>
          </div>
        </div>
      </header>

      {/* Fullscreen Mobile Menu */}
      <div 
        className={`lg:hidden fixed inset-0 z-[999] bg-white transition-all duration-500 ease-in-out transform ${
          isMenuOpen ? 'translate-x-0 opacity-100' : 'translate-x-full opacity-0'
        }`}
        style={{ pointerEvents: isMenuOpen ? 'auto' : 'none' }}
      >
        <div className="flex flex-col h-full w-full bg-white overflow-y-auto pt-24 pb-12 px-10">
          <nav className="flex flex-col space-y-4 md:space-y-6 mt-8" aria-label="Menu Mobile">
            {navLinks.map((link, index) => (
              <Link
                key={link.path}
                to={link.path}
                className={`text-4xl sm:text-5xl font-serif font-black uppercase tracking-tighter py-3 border-b border-gray-100 transition-all duration-500 block ${
                  isMenuOpen ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'
                } ${
                  location.pathname === link.path ? 'text-accent' : 'text-primary'
                }`}
                style={{ transitionDelay: `${index * 60 + 150}ms` }}
                onClick={closeMenu}
              >
                {link.name}
              </Link>
            ))}
            <Link
              to={isLoggedIn ? "/perfil" : "/login"}
              className={`text-4xl sm:text-5xl font-serif font-black uppercase tracking-tighter py-3 border-b border-gray-100 transition-all duration-500 block ${
                isMenuOpen ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'
              } ${
                location.pathname === (isLoggedIn ? '/perfil' : '/login') ? 'text-accent' : 'text-primary'
              }`}
              style={{ transitionDelay: `${navLinks.length * 60 + 150}ms` }}
              onClick={closeMenu}
            >
              {isLoggedIn ? "Meu Perfil" : "Login"}
            </Link>
          </nav>

          <div className={`mt-auto pt-16 space-y-12 transition-all duration-700 ${isMenuOpen ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`} style={{ transitionDelay: '500ms' }}>
            <div className="space-y-6">
              <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.5em]">Acesso Estratégico</p>
              <Link 
                to="/newsletters" 
                onClick={closeMenu}
                className="bg-accent text-white px-10 py-6 rounded-2xl text-[12px] font-black uppercase tracking-[0.3em] w-full shadow-2xl shadow-accent/20 active:scale-95 transition-all text-center flex items-center justify-center gap-4"
              >
                Assinar Newsletter
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20"><path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" /><path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" /></svg>
              </Link>
            </div>

            <div className="flex justify-between items-center text-[9px] font-black text-gray-300 uppercase tracking-[0.4em] pt-8 border-t border-gray-100">
              <span>© 2024 Empresário Digital</span>
              <div className="flex gap-6">
                <a href="#" className="hover:text-accent">LI</a>
                <a href="#" className="hover:text-accent">TW</a>
                <a href="#" className="hover:text-accent">IG</a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Header;
