
import React, { useEffect, useState } from 'react';
import SectionHeader from '../components/SectionHeader';
import { fetchVideos } from '../lib/mcpClient';
import { Video } from '../types';

const VideosPage: React.FC = () => {
  const [videos, setVideos] = useState<Video[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchVideos().then(data => {
      setVideos(data);
      setLoading(false);
    });
  }, []);

  return (
    <div className="container mx-auto px-4 py-16 md:py-32">
      <SectionHeader
        title="Briefings Visuais"
        subtitle="Conteúdo multimídia de alta densidade sintetizado para o consumo rápido e eficiente."
      />

      {videos.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          {videos.map(video => (
            <div key={video.id} className="group relative bg-black rounded-[2.5rem] overflow-hidden aspect-video shadow-2xl">
              <img
                src={video.imageUrl}
                className="w-full h-full object-cover opacity-60 group-hover:opacity-100 group-hover:scale-105 transition-all duration-1000 grayscale group-hover:grayscale-0"
                alt={video.title}
              />
              <div className="absolute inset-0 p-8 md:p-12 flex flex-col justify-between">
                <div className="flex justify-between items-start">
                  <span className="bg-accent text-white text-[9px] font-black px-4 py-1.5 rounded-full uppercase tracking-widest">
                    {video.category}
                  </span>
                  <span className="text-white/50 text-[10px] font-bold uppercase tracking-widest">
                    {video.duration}
                  </span>
                </div>
                <div className="space-y-4">
                  <h3 className="text-2xl md:text-4xl font-serif font-black text-white uppercase leading-tight tracking-tighter max-w-md">
                    {video.title}
                  </h3>
                  <button className="flex items-center gap-4 text-white text-[10px] font-black uppercase tracking-[0.4em] group-hover:text-accent transition-colors">
                    <span className="w-12 h-12 bg-white/10 backdrop-blur-md rounded-full flex items-center justify-center group-hover:bg-accent group-hover:text-white transition-all">
                      <svg className="w-5 h-5 fill-current translate-x-0.5" viewBox="0 0 24 24"><path d="M8 5v14l11-7z" /></svg>
                    </span>
                    Assistir Agora
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="flex items-center justify-center py-32 border-2 border-dashed border-gray-100 rounded-[3rem]">
          <p className="text-gray-400 text-xs font-black uppercase tracking-[0.5em]">Nenhum vídeo disponível no momento.</p>
        </div>
      )}
    </div>
  );
};

export default VideosPage;
