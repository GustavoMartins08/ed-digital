
import React, { useState } from 'react';
import { saveNewsletterSubscription } from '../lib/supabaseClient';
import { NewsletterSubscription } from '../types';

interface NewsletterFormProps {
  variant?: 'full' | 'card' | 'slim';
  theme?: 'light' | 'dark';
}

const NewsletterForm: React.FC<NewsletterFormProps> = ({ variant = 'full', theme = 'dark' }) => {
  const [formData, setFormData] = useState<NewsletterSubscription>({ 
    firstName: '', 
    lastName: '', 
    email: '',
    phone: '',
    jobTitle: '',
    company: ''
  });
  
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('loading');
    
    try {
      const result = await saveNewsletterSubscription(formData);
      if (result.success) {
        setStatus('success');
        setMessage(result.message);
        setFormData({ firstName: '', lastName: '', email: '', phone: '', jobTitle: '', company: '' });
      } else {
        throw new Error('Falha na sincronização');
      }
    } catch (err) {
      setStatus('error');
      setMessage('Falha na Transmissão: Verifique sua conexão e tente novamente.');
    }
  };

  const isDark = theme === 'dark';

  const inputBaseClasses = variant === 'slim' 
    ? "w-full border rounded-lg px-4 py-3 transition-all text-xs"
    : "w-full border rounded-xl px-6 py-4 transition-all font-medium text-sm";

  const themeClasses = isDark
    ? "bg-white/10 backdrop-blur-md border-white/20 text-white placeholder:text-white/40 focus:ring-accent/50"
    : "bg-lightGray border-gray-200 text-primary placeholder:text-gray-400 focus:ring-accent/20 focus:border-accent";

  const inputClasses = `${inputBaseClasses} ${themeClasses} focus:outline-none focus:ring-2`;

  if (status === 'success') {
    return (
      <div className={`${variant === 'slim' ? 'py-4' : 'p-10'} text-center animate-in zoom-in duration-500`}>
        <h3 className={`${isDark ? 'text-white' : 'text-primary'} text-sm font-black uppercase tracking-tighter mb-2`}>Acesso Liberado</h3>
        <p className={`${isDark ? 'text-white/50' : 'text-secondary/60'} text-[10px] italic leading-relaxed`}>{message}</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className={`${variant === 'slim' ? 'space-y-3' : 'space-y-4'}`}>
      {variant === 'slim' ? (
        <>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <input 
              required
              type="text" 
              placeholder="Nome Completo"
              className={inputClasses}
              value={`${formData.firstName} ${formData.lastName}`.trim()}
              onChange={(e) => {
                const parts = e.target.value.split(' ');
                setFormData({...formData, firstName: parts[0] || '', lastName: parts.slice(1).join(' ') || ''});
              }}
            />
            <input 
              required
              type="email" 
              placeholder="E-mail Corporativo"
              className={inputClasses}
              value={formData.email}
              onChange={(e) => setFormData({...formData, email: e.target.value})}
            />
            <input 
              required
              type="tel" 
              placeholder="WhatsApp"
              className={inputClasses}
              value={formData.phone}
              onChange={(e) => setFormData({...formData, phone: e.target.value})}
            />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <input 
              required
              type="text" 
              placeholder="Cargo"
              className={inputClasses}
              value={formData.jobTitle}
              onChange={(e) => setFormData({...formData, jobTitle: e.target.value})}
            />
            <input 
              required
              type="text" 
              placeholder="Empresa"
              className={inputClasses}
              value={formData.company}
              onChange={(e) => setFormData({...formData, company: e.target.value})}
            />
            <button 
              type="submit"
              disabled={status === 'loading'}
              className="bg-accent text-white font-black uppercase tracking-[0.2em] py-3 rounded-lg text-[10px] hover:scale-[1.02] active:scale-95 transition-all shadow-lg shadow-accent/10"
            >
              {status === 'loading' ? 'Assinando...' : 'Assinar Agora'}
            </button>
          </div>
        </>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input required type="text" placeholder="Nome" className={inputClasses} value={formData.firstName} onChange={(e) => setFormData({...formData, firstName: e.target.value})} />
            <input required type="text" placeholder="Sobrenome" className={inputClasses} value={formData.lastName} onChange={(e) => setFormData({...formData, lastName: e.target.value})} />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input required type="email" placeholder="E-mail" className={inputClasses} value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})} />
            <input required type="tel" placeholder="Telefone" className={inputClasses} value={formData.phone} onChange={(e) => setFormData({...formData, phone: e.target.value})} />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input required type="text" placeholder="Cargo" className={inputClasses} value={formData.jobTitle} onChange={(e) => setFormData({...formData, jobTitle: e.target.value})} />
            <input required type="text" placeholder="Empresa" className={inputClasses} value={formData.company} onChange={(e) => setFormData({...formData, company: e.target.value})} />
          </div>
          <button type="submit" disabled={status === 'loading'} className="w-full bg-accent text-white font-black uppercase tracking-[0.4em] py-5 rounded-xl text-[11px] hover:scale-[1.02] active:scale-95 transition-all focus:ring-4 focus:ring-accent/20 shadow-xl shadow-accent/10">
            {status === 'loading' ? 'Sincronizando...' : 'Solicitar Acesso Premium'}
          </button>
        </>
      )}
      
      {status === 'error' && (
        <div className={`mt-4 p-4 rounded-xl border animate-in fade-in slide-in-from-top-2 duration-300 ${isDark ? 'bg-accent/10 border-accent/20' : 'bg-accent/5 border-accent/10'}`}>
          <p className="text-[#e61e5a] text-[10px] md:text-[11px] font-black uppercase tracking-[0.2em] text-center leading-relaxed">
            {message}
          </p>
        </div>
      )}
    </form>
  );
};

export default NewsletterForm;
