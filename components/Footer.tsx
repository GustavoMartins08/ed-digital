
import React from 'react';
import { Link } from 'react-router-dom';
import Logo from './Logo';

const Footer: React.FC = () => {
  return (
    <footer className="bg-white border-t border-gray-100 pt-24 pb-12">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-16 mb-20">
          <div className="md:col-span-2">
            <Logo className="mb-8" />
            <p className="text-secondary max-w-sm text-base leading-relaxed font-light italic">
              "A inteligência estratégica não é sobre ter mais dados, mas sobre ter a síntese correta no momento decisivo."
            </p>
          </div>
          <div>
            <h4 className="font-black text-[10px] uppercase tracking-[0.4em] text-gray-300 mb-8">Navegação</h4>
            <ul className="space-y-4 text-xs font-bold uppercase tracking-widest text-secondary">
              <li><Link to="/ultimas-noticias" className="hover:text-accent transition-colors">Últimas Notícias</Link></li>
              <li><Link to="/edicoes" className="hover:text-accent transition-colors">Edições Mensais</Link></li>
              <li><Link to="/videos" className="hover:text-accent transition-colors">Vídeos & Podcasts</Link></li>
              <li><Link to="/colunas" className="hover:text-accent transition-colors">Colunistas</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-black text-[10px] uppercase tracking-[0.4em] text-gray-300 mb-8">Estratégico</h4>
            <ul className="space-y-4 text-xs font-bold uppercase tracking-widest text-secondary">
              <li><Link to="/privacy" className="hover:text-accent transition-colors">Privacidade</Link></li>
              <li><Link to="/terms" className="hover:text-accent transition-colors">Termos de Uso</Link></li>
              <li><Link to="/contact" className="hover:text-accent transition-colors">Anuncie Conosco</Link></li>
              <li><Link to="/media-kit" className="hover:text-accent transition-colors">Media Kit 2024</Link></li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-gray-100 pt-12 flex flex-col md:flex-row justify-between items-center text-[9px] font-bold text-gray-400 tracking-[0.3em] uppercase">
          <div className="flex flex-col md:flex-row items-center gap-4 md:gap-8">
            <p>© 2024 EMPRESÁRIO DIGITAL</p>
            <span className="hidden md:block w-1 h-1 bg-gray-200 rounded-full"></span>
            <p>INTELIGÊNCIA SINTETIZADA</p>
          </div>
          <div className="mt-6 md:mt-0 flex gap-6">
            <a href="#" className="hover:text-accent transition-colors">LinkedIn</a>
            <a href="#" className="hover:text-accent transition-colors">Instagram</a>
            <a href="#" className="hover:text-accent transition-colors">Twitter (X)</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
