import React, { useState, useEffect } from 'react';
import { Star, Circle, Square, Lock, LockOpen, Sparkles, Brain } from 'lucide-react';
import { PATTERN_LEVELS, PATTERN_ITEMS, speak } from '../constants';

interface Props {
  onComplete: () => void;
}

export const GamePattern: React.FC<Props> = ({ onComplete }) => {
  const [difficulty, setDifficulty] = useState<'EASY' | 'HARD' | null>(null);
  const [inputSequence, setInputSequence] = useState<number[]>([]);
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [isError, setIsError] = useState(false);

  // Initial greeting for difficulty selection
  useEffect(() => {
    if (!difficulty) {
      speak("Oyuna başlamadan önce seç bakalım: Kolay mı olsun, zor mu?");
    }
  }, [difficulty]);

  // Effect when difficulty is selected (Game Start)
  useEffect(() => {
    if (difficulty) {
      speak("Kapı kilitli! Yukarıdaki şekillere bak. Doğru renkli düğmelere sırayla bas.");
    }
  }, [difficulty]);

  const currentPattern = difficulty ? PATTERN_LEVELS[difficulty] : [];

  const handleInput = (item: typeof PATTERN_ITEMS[0]) => {
    if (isUnlocked || !difficulty) return;

    const nextIndex = inputSequence.length;
    const targetItem = currentPattern[nextIndex];

    // Check if correct color/shape pressed for current position
    if (item.id === targetItem.id) {
      const newSequence = [...inputSequence, item.id];
      setInputSequence(newSequence);
      
      if (newSequence.length === currentPattern.length) {
        setIsUnlocked(true);
        speak("Yaşasın! Şifreyi çözdün. Kapı açıldı!");
        setTimeout(onComplete, 2000);
      }
    } else {
      // Wrong input
      setIsError(true);
      speak("Hayır, bu yanlış renk. Tekrar dene!");
      setInputSequence([]);
      setTimeout(() => setIsError(false), 500);
    }
  };

  const renderIcon = (shape: string, className: string) => {
    if (shape === 'star') return <Star className={className} />;
    if (shape === 'circle') return <Circle className={className} />;
    return <Square className={className} />;
  };

  // Difficulty Selection Screen
  if (!difficulty) {
    return (
      <div className="flex flex-col items-center justify-center h-full p-4 gap-8">
        <h2 className="text-3xl md:text-4xl font-bold text-sky-800 text-center animate-bounce">
          Zorluk Seçimi
        </h2>
        
        <div className="flex flex-col md:flex-row gap-6">
          <button 
            onClick={() => setDifficulty('EASY')}
            className="group bg-white p-8 rounded-3xl shadow-xl border-b-8 border-green-200 active:border-b-0 active:translate-y-2 transition-all flex flex-col items-center gap-4 w-64 hover:bg-green-50"
          >
            <div className="bg-green-100 p-4 rounded-full">
              <Sparkles size={60} className="text-green-500 group-hover:spin-slow" />
            </div>
            <span className="text-3xl font-bold text-green-600">KOLAY</span>
            <div className="flex gap-1">
              <Star size={24} className="fill-yellow-400 text-yellow-400" />
              <Star size={24} className="text-gray-300" />
              <Star size={24} className="text-gray-300" />
            </div>
          </button>

          <button 
            onClick={() => setDifficulty('HARD')}
            className="group bg-white p-8 rounded-3xl shadow-xl border-b-8 border-red-200 active:border-b-0 active:translate-y-2 transition-all flex flex-col items-center gap-4 w-64 hover:bg-red-50"
          >
             <div className="bg-red-100 p-4 rounded-full">
              <Brain size={60} className="text-red-500 group-hover:scale-110 transition-transform" />
            </div>
            <span className="text-3xl font-bold text-red-600">ZOR</span>
            <div className="flex gap-1">
              <Star size={24} className="fill-yellow-400 text-yellow-400" />
              <Star size={24} className="fill-yellow-400 text-yellow-400" />
              <Star size={24} className="fill-yellow-400 text-yellow-400" />
            </div>
          </button>
        </div>
      </div>
    );
  }

  // Game Screen
  return (
    <div className="flex flex-col items-center justify-center h-full p-4 max-w-2xl mx-auto">
      <h2 className="text-3xl font-bold text-purple-700 mb-6 text-center">Şifreli Kapı</h2>

      {/* The Lock Display */}
      <div className={`
        relative bg-slate-200 p-6 md:p-8 rounded-3xl border-8 mb-8 md:mb-12 w-full transition-colors duration-500
        ${isUnlocked ? 'border-green-400 bg-green-100' : 'border-slate-400'}
        ${isError ? 'animate-shake bg-red-100' : ''}
      `}>
        <div className="flex justify-center items-center gap-4 mb-6">
          {isUnlocked ? <LockOpen size={64} className="text-green-500" /> : <Lock size={64} className="text-slate-500" />}
        </div>
        
        {/* The Pattern to Match */}
        <div className="flex justify-center flex-wrap gap-2 md:gap-4">
          {currentPattern.map((item, index) => (
            <div 
              key={index} 
              className={`
                w-12 h-12 md:w-16 md:h-16 rounded-xl flex items-center justify-center border-4
                transition-all duration-300
                ${index < inputSequence.length ? item.color : 'bg-white border-dashed border-gray-400'}
              `}
            >
              {renderIcon(item.shape, `w-8 h-8 md:w-10 md:h-10 ${index < inputSequence.length ? 'text-white' : 'text-gray-300'}`)}
            </div>
          ))}
        </div>
      </div>

      {/* Controls */}
      <div className="grid grid-cols-3 gap-4 md:gap-8">
        {/* We use PATTERN_ITEMS because the input buttons are always the set of available shapes/colors */}
        {/* Shuffling them slightly for display so they aren't always 1-2-3 ordered visually if desired, 
            but for kids keeping them consistent (Star/Circle/Square) is usually better for muscle memory. 
            We'll stick to the defined PATTERN_ITEMS order or a fixed reorder. */}
        {[PATTERN_ITEMS[1], PATTERN_ITEMS[0], PATTERN_ITEMS[2]].map((btn) => (
           <button
             key={btn.id}
             onClick={() => handleInput(btn)}
             className={`
               ${btn.color} w-20 h-20 md:w-24 md:h-24 rounded-full shadow-lg border-b-8 border-black/20
               active:border-b-0 active:translate-y-2 transition-all
               flex items-center justify-center
             `}
           >
             {renderIcon(btn.shape, "text-white w-10 h-10 md:w-12 md:h-12")}
           </button>
        ))}
      </div>
    </div>
  );
};