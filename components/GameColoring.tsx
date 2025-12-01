import React, { useState, useEffect, useRef } from 'react';
import { speak } from '../constants';
import { CharacterType } from '../types';
import { HeroAvatar, HeroMood } from './HeroAvatar';
import { RotateCcw, Check } from 'lucide-react';

interface Props {
  character: CharacterType;
  onComplete: () => void;
}

// Renk tanımları ve seslendirme metinleri
const PALETTE = [
  { hex: '#ef4444', name: 'Kırmızı', msg: 'Kırmızıyı seçtin!' },
  { hex: '#3b82f6', name: 'Mavi', msg: 'Maviyi seçtin!' },
  { hex: '#22c55e', name: 'Yeşil', msg: 'Yeşili seçtin!' },
  { hex: '#eab308', name: 'Sarı', msg: 'Sarıyı seçtin!' },
  { hex: '#a855f7', name: 'Mor', msg: 'Moru seçtin!' },
  { hex: '#f97316', name: 'Turuncu', msg: 'Turuncuyu seçtin!' },
];

export const GameColoring: React.FC<Props> = ({ character, onComplete }) => {
  const [selectedColor, setSelectedColor] = useState(PALETTE[0]);
  const [heroMood, setHeroMood] = useState<HeroMood>('IDLE');
  const [feedbackText, setFeedbackText] = useState("");
  
  // Boyanacak alanların durumu. Başlangıçta hepsi beyaz (#fff).
  // Anahtarlar SVG'deki id'lerle uyumlu olmalı mantıken ama burada state ile yönetiyoruz.
  const [fills, setFills] = useState({
    sky: '#fff',
    sun: '#fff',
    treeTrunk: '#fff',
    treeLeaves: '#fff',
    flowerPetals: '#fff',
    flowerCenter: '#fff',
    grass: '#fff'
  });

  // Hangi alanın en son boyandığını takip edip animasyon tetiklemek için
  const [lastPainted, setLastPainted] = useState<string | null>(null);

  const heroTimeoutRef = useRef<number | null>(null);

  useEffect(() => {
    speak("Şimdi resim yapalım! Aşağıdan bir renk seç ve boş yerleri boya.");
  }, []);

  // Kahraman tepkilerini yöneten yardımcı fonksiyon
  const triggerHeroReaction = (type: 'PAINT' | 'COMPLETE') => {
    if (heroTimeoutRef.current) clearTimeout(heroTimeoutRef.current);

    if (type === 'PAINT') {
      setHeroMood('HAPPY');
      const phrases = ["Harika!", "Çok güzel!", "Devam et!", "Süpersin!"];
      setFeedbackText(phrases[Math.floor(Math.random() * phrases.length)]);
      
      heroTimeoutRef.current = window.setTimeout(() => {
        setHeroMood('IDLE');
        setFeedbackText("");
      }, 1500);
    } else if (type === 'COMPLETE') {
      setHeroMood('VICTORY');
      setFeedbackText("Resmi tamamladın!");
    }
  };

  const handleColorSelect = (colorItem: typeof PALETTE[0]) => {
    setSelectedColor(colorItem);
    speak(colorItem.msg);
    // Kahraman düşünüyor moduna geçsin kısa bir süre
    if (heroMood !== 'VICTORY') {
      setHeroMood('THINKING');
      if (heroTimeoutRef.current) clearTimeout(heroTimeoutRef.current);
      heroTimeoutRef.current = window.setTimeout(() => setHeroMood('IDLE'), 1000);
    }
  };

  const handlePaint = (part: keyof typeof fills) => {
    // Eğer zaten boyanmışsa ve aynı renkse tepki verme (veya renk değiştirme izni ver)
    
    setFills(prev => ({ ...prev, [part]: selectedColor.hex }));
    setLastPainted(part);
    
    // Animasyonu sıfırlamak için kısa bir hack
    setTimeout(() => setLastPainted(null), 500);

    triggerHeroReaction('PAINT');

    // Bitiş Kontrolü
    // State güncellemesi asenkron olduğu için, yeni durumu manuel oluşturup kontrol edelim
    const nextFills = { ...fills, [part]: selectedColor.hex };
    const allPainted = Object.values(nextFills).every(color => color !== '#fff');

    if (allPainted) {
      triggerHeroReaction('COMPLETE');
      speak("Harikasın! Bütün resmi boyadın.");
      setTimeout(onComplete, 4000); // Kutlamayı izlemesi için süre
    }
  };

  const handleReset = () => {
    setFills({
      sky: '#fff',
      sun: '#fff',
      treeTrunk: '#fff',
      treeLeaves: '#fff',
      flowerPetals: '#fff',
      flowerCenter: '#fff',
      grass: '#fff'
    });
    speak("Hadi baştan başlayalım!");
  };

  return (
    <div className="flex flex-col h-full bg-slate-50 relative overflow-hidden">
      
      {/* Üst Bilgi Çubuğu */}
      <div className="absolute top-0 left-0 w-full p-4 flex justify-between items-center z-20 pointer-events-none">
        <div className="bg-white/90 px-6 py-2 rounded-full shadow-lg border-2 border-slate-200 pointer-events-auto">
          <span className="text-xl font-bold text-slate-600">
             Seçilen Renk: <span style={{ color: selectedColor.hex }}>{selectedColor.name.toUpperCase()}</span>
          </span>
        </div>
        
        <button 
          onClick={handleReset}
          className="bg-white p-3 rounded-full shadow-lg border-2 border-slate-200 pointer-events-auto active:scale-90 transition-transform"
        >
          <RotateCcw className="text-slate-500" />
        </button>
      </div>

      {/* Ana Tuval Alanı */}
      <div className="flex-1 relative flex items-center justify-center bg-gray-100 border-b-4 border-gray-200 shadow-inner">
        
        {/* Kahraman - Tuvalin içinde, çimlerin üzerinde dursun */}
        <div className="absolute bottom-4 right-4 md:right-12 z-10 transition-all duration-300">
          <HeroAvatar 
            character={character} 
            mood={heroMood} 
            onClick={() => triggerHeroReaction('PAINT')} 
          />
          {feedbackText && (
            <div className="absolute -top-16 left-1/2 -translate-x-1/2 bg-white px-4 py-2 rounded-2xl shadow-xl animate-pop whitespace-nowrap z-20">
               <span className="text-xl font-bold text-purple-600">{feedbackText}</span>
               <div className="absolute bottom-[-8px] left-1/2 -translate-x-1/2 w-4 h-4 bg-white rotate-45"></div>
            </div>
          )}
        </div>

        <svg viewBox="0 0 400 300" className="w-full h-full max-w-4xl select-none touch-manipulation">
          <defs>
             <filter id="glow">
                <feGaussianBlur stdDeviation="2.5" result="coloredBlur"/>
                <feMerge>
                    <feMergeNode in="coloredBlur"/>
                    <feMergeNode in="SourceGraphic"/>
                </feMerge>
            </filter>
          </defs>

          {/* Gökyüzü */}
          <rect 
            x="0" y="0" width="400" height="300" 
            fill={fills.sky} 
            onClick={() => handlePaint('sky')} 
            className={`cursor-pointer transition-colors duration-300 ${lastPainted === 'sky' ? 'animate-pulse' : ''}`}
          />
          
          {/* Güneş */}
          <g onClick={() => handlePaint('sun')} className="cursor-pointer hover:opacity-90">
             <circle 
                cx="50" cy="50" r="30" 
                fill={fills.sun} 
                stroke="black" strokeWidth="3" 
                className={`transition-all duration-300 ${lastPainted === 'sun' ? 'animate-pop' : ''}`}
             />
             {/* Güneş Işınları (Dekoratif) */}
             <path d="M50 10 L50 0 M50 90 L50 100 M10 50 L0 50 M90 50 L100 50" stroke="black" strokeWidth="3" />
          </g>
          
          {/* Çimen */}
          <path 
             d="M0 220 Q 100 200 200 220 T 400 220 L 400 300 L 0 300 Z" 
             fill={fills.grass} 
             stroke="black" strokeWidth="3" 
             onClick={() => handlePaint('grass')} 
             className={`cursor-pointer transition-colors duration-300 hover:opacity-90 ${lastPainted === 'grass' ? 'animate-pulse' : ''}`}
          />

          {/* Ağaç */}
          <g>
            {/* Gövde */}
            <rect 
               x="260" y="120" width="40" height="120" 
               fill={fills.treeTrunk} stroke="black" strokeWidth="3" 
               onClick={() => handlePaint('treeTrunk')} 
               className={`cursor-pointer hover:opacity-90 transition-colors duration-300 ${lastPainted === 'treeTrunk' ? 'animate-pop' : ''}`}
            />
            {/* Yapraklar (Tek bir grup olarak ele alıyoruz kolaylık için, ya da birleşik path) */}
            <path
              d="M280 40 Q 330 40 350 80 Q 370 120 340 140 Q 310 160 280 140 Q 250 160 220 140 Q 190 120 210 80 Q 230 40 280 40 Z"
              fill={fills.treeLeaves} stroke="black" strokeWidth="3"
              onClick={() => handlePaint('treeLeaves')}
              className={`cursor-pointer hover:opacity-90 transition-colors duration-300 ${lastPainted === 'treeLeaves' ? 'animate-pop' : ''}`}
            />
          </g>

          {/* Çiçek */}
          <g transform="translate(100, 240)">
             <path d="M0 0 L0 40" stroke="black" strokeWidth="3" /> {/* Sap - Boyanmaz */}
             {/* Yapraklar */}
             <g onClick={() => handlePaint('flowerPetals')} className="cursor-pointer hover:opacity-90">
                <circle cx="0" cy="-15" r="10" fill={fills.flowerPetals} stroke="black" strokeWidth="2" className={lastPainted === 'flowerPetals' ? 'animate-pop' : ''}/>
                <circle cx="15" cy="0" r="10" fill={fills.flowerPetals} stroke="black" strokeWidth="2" className={lastPainted === 'flowerPetals' ? 'animate-pop' : ''}/>
                <circle cx="0" cy="15" r="10" fill={fills.flowerPetals} stroke="black" strokeWidth="2" className={lastPainted === 'flowerPetals' ? 'animate-pop' : ''}/>
                <circle cx="-15" cy="0" r="10" fill={fills.flowerPetals} stroke="black" strokeWidth="2" className={lastPainted === 'flowerPetals' ? 'animate-pop' : ''}/>
             </g>
             {/* Orta */}
             <circle 
                cx="0" cy="0" r="8" 
                fill={fills.flowerCenter} stroke="black" strokeWidth="2" 
                onClick={() => handlePaint('flowerCenter')} 
                className={`cursor-pointer hover:opacity-90 ${lastPainted === 'flowerCenter' ? 'animate-pop' : ''}`}
             />
          </g>

        </svg>
      </div>

      {/* Renk Paleti Kontrol Alanı */}
      <div className="h-32 md:h-40 bg-white p-4 shadow-[0_-4px_20px_rgba(0,0,0,0.1)] z-20 flex flex-col items-center justify-center gap-2">
        <h3 className="text-gray-500 font-bold text-sm">BİR RENK SEÇ</h3>
        <div className="flex items-center justify-center gap-4 w-full overflow-x-auto pb-2 px-4 no-scrollbar">
          {PALETTE.map(color => (
            <button
              key={color.hex}
              onClick={() => handleColorSelect(color)}
              className={`
                group relative w-16 h-16 md:w-20 md:h-20 rounded-full border-4 shadow-md transition-all duration-300 flex-shrink-0
                ${selectedColor.hex === color.hex ? 'border-gray-800 scale-110 -translate-y-2' : 'border-white hover:scale-105'}
              `}
              style={{ backgroundColor: color.hex }}
            >
              {selectedColor.hex === color.hex && (
                <div className="absolute inset-0 flex items-center justify-center">
                   <Check className="text-white drop-shadow-md" size={32} strokeWidth={4} />
                </div>
              )}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};