import React from 'react';
import { Rabbit, Cat } from 'lucide-react';
import { CharacterType } from '../types';

export type HeroMood = 'IDLE' | 'HAPPY' | 'SAD' | 'THINKING' | 'VICTORY';

interface HeroProps {
  character: CharacterType;
  mood: HeroMood;
  className?: string;
  onClick?: () => void;
}

export const HeroAvatar: React.FC<HeroProps> = ({ character, mood, className = '', onClick }) => {
  
  // Görsel Stil Ayarları
  const isBunny = character === CharacterType.BUNNY;
  
  const containerBase = `
    relative flex items-center justify-center rounded-full border-4 shadow-xl transition-all duration-300
    ${isBunny ? 'bg-pink-100 border-pink-400' : 'bg-amber-100 border-amber-500'}
    ${mood === 'HAPPY' ? 'animate-bounce' : ''}
    ${mood === 'VICTORY' ? 'animate-bounce-slow' : ''}
    ${mood === 'SAD' ? 'animate-shake grayscale-[0.5]' : ''}
    ${mood === 'THINKING' ? 'scale-105' : ''}
  `;

  // İkon Seçimi
  const Icon = isBunny ? Rabbit : Cat;
  const iconColor = isBunny ? 'text-pink-500' : 'text-amber-600';

  return (
    <div className={`relative group ${className}`} onClick={onClick}>
       {/* Konuşma Balonu (Opsiyonel Durumlar İçin) */}
       {mood === 'HAPPY' && (
         <div className="absolute -top-12 left-1/2 -translate-x-1/2 bg-white px-3 py-1 rounded-xl shadow-md whitespace-nowrap animate-pop z-20">
           <span className="text-xl">👏 Harika!</span>
           <div className="absolute bottom-[-6px] left-1/2 -translate-x-1/2 w-3 h-3 bg-white rotate-45"></div>
         </div>
       )}
       {mood === 'SAD' && (
         <div className="absolute -top-12 left-1/2 -translate-x-1/2 bg-white px-3 py-1 rounded-xl shadow-md whitespace-nowrap animate-pop z-20">
           <span className="text-xl">🤔 Tekrar dene</span>
           <div className="absolute bottom-[-6px] left-1/2 -translate-x-1/2 w-3 h-3 bg-white rotate-45"></div>
         </div>
       )}

       {/* Avatar Kutusu */}
       <div className={`${containerBase} w-24 h-24 md:w-32 md:h-32`}>
          <Icon size={isBunny ? 60 : 60} className={`${iconColor} transition-transform duration-300 ${mood === 'VICTORY' ? 'scale-125' : ''}`} />
          
          {/* Yüz İfadeleri (Basit CSS bindirmeleri) */}
          {mood === 'THINKING' && (
             <span className="absolute top-2 right-4 text-2xl animate-pulse">❓</span>
          )}
          {mood === 'VICTORY' && (
             <span className="absolute -top-2 -right-2 text-3xl animate-spin-slow">⭐</span>
          )}
       </div>
    </div>
  );
};