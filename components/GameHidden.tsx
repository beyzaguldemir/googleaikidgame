import React, { useState, useEffect, useRef } from 'react';
import { Feather, Brain, Zap, Grid, Star, Play, ArrowLeft, CheckCircle } from 'lucide-react';
import { speak } from '../constants';
import { Button } from './Button';
import { HiddenGameMode, Difficulty, CharacterType } from '../types';
import { HeroAvatar, HeroMood } from './HeroAvatar';

// --- CUSTOM HOOK FOR HERO LOGIC ---
const useHero = (initialCharacter: CharacterType) => {
  const [mood, setMood] = useState<HeroMood>('IDLE');
  const timeoutRef = useRef<number | null>(null);

  const resetToIdle = (delay = 2000) => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    timeoutRef.current = window.setTimeout(() => {
      setMood('IDLE');
    }, delay);
  };

  const celebrate = () => {
    setMood('HAPPY');
    resetToIdle(2000);
  };

  const encourage = () => {
    setMood('SAD');
    speak("Hata olabilir, tekrar dene!");
    resetToIdle(2000);
  };

  const think = () => {
    setMood('THINKING');
    resetToIdle(3000);
  };

  const victory = () => {
    setMood('VICTORY');
    resetToIdle(5000);
  };

  return { mood, celebrate, encourage, think, victory };
};

// --- INTERFACES ---
interface Props {
  onComplete: () => void;
  character: CharacterType;
}

interface MiniGameProps {
  difficulty: Difficulty;
  onWin: () => void;
  hero: ReturnType<typeof useHero>;
}

// --- SVG BIRD AVATAR COMPONENT ---
const BirdAvatar: React.FC<{ progress: number }> = ({ progress }) => {
  const bodyColor = progress >= 1 ? "#3b82f6" : "#cbd5e1"; 
  const wingColor = progress >= 2 ? "#ef4444" : "#94a3b8"; 
  const tailColor = progress >= 3 ? "#eab308" : "#64748b"; 

  return (
    <svg width="120" height="120" viewBox="0 0 100 100" className="drop-shadow-lg transition-all duration-1000">
      <path d="M10,60 Q5,80 20,85 T30,70" fill={tailColor} stroke="white" strokeWidth="2" className="transition-all duration-500" />
      <ellipse cx="50" cy="50" rx="30" ry="25" fill={bodyColor} stroke="white" strokeWidth="2" className="transition-all duration-500" />
      <circle cx="70" cy="35" r="15" fill={bodyColor} stroke="white" strokeWidth="2" className="transition-all duration-500" />
      <circle cx="75" cy="30" r="2" fill="black" />
      <path d="M82,32 L95,35 L82,40 Z" fill="orange" />
      <path d="M35,45 Q65,45 60,65 Q40,75 35,45" fill={wingColor} stroke="white" strokeWidth="2" className="transition-all duration-500" />
    </svg>
  );
};

export const GameHidden: React.FC<Props> = ({ onComplete, character }) => {
  const [phase, setPhase] = useState<'INTRO' | 'MENU' | 'DIFFICULTY' | 'GAME' | 'SUCCESS'>('INTRO');
  const [feathersCollected, setFeathersCollected] = useState(0);
  const [selectedMode, setSelectedMode] = useState<HiddenGameMode | null>(null);
  const [difficulty, setDifficulty] = useState<Difficulty | null>(null);
  const [gameFinished, setGameFinished] = useState(false);
  
  // Init Hero
  const hero = useHero(character);

  // --- INTRO PHASE ---
  useEffect(() => {
    if (phase === 'INTRO') {
      speak("Merhaba! Tüylerim döküldü. Oyunları kazanarak bana 3 tane tüy toplar mısın?");
      hero.think();
    }
  }, [phase]);

  // --- GAME COMPLETION CHECK ---
  useEffect(() => {
    // Sadece oyun menüye döndüğünde ve 3 tüy varsa bitir.
    // SUCCESS aşamasında bitirirsek kullanıcı 3. tüyü kazandığını göremez.
    if (feathersCollected >= 3 && phase === 'MENU' && !gameFinished) {
       setGameFinished(true); // Tekrar tetiklenmeyi önle
       setTimeout(() => {
         hero.victory();
         speak("Yaşasın! Bütün renklerim geri geldi. Çok teşekkür ederim!");
         onComplete();
       }, 1500);
    }
  }, [feathersCollected, phase, onComplete, gameFinished]);

  const handleGameWin = () => {
    hero.celebrate();
    speak("Harika! Bir tüy kazandın.");
    
    // State updater kullanarak güvenli artırım
    setFeathersCollected(prev => {
      const newVal = prev + 1;
      return newVal;
    });
    
    setPhase('SUCCESS');
    
    // Başarı ekranından menüye dönüş
    setTimeout(() => {
      // Eğer oyun bitmemişse menüye dön
      setPhase('MENU');
      setSelectedMode(null);
      setDifficulty(null);
    }, 3000);
  };

  // --- RENDERERS ---

  if (phase === 'INTRO') {
    return (
      <div className="h-full flex flex-col items-center justify-center p-6 bg-sky-50 text-center relative">
        <div className="mb-8 animate-bounce-slow">
          <BirdAvatar progress={0} />
        </div>
        <h2 className="text-3xl font-bold text-slate-700 mb-8">Kuşa Yardım Et</h2>
        <Button onClick={() => setPhase('MENU')} color="bg-green-500">
          <Play size={32} /> TAMAM
        </Button>
        
        {/* Hero Positioned */}
        <div className="absolute bottom-4 right-4">
           <HeroAvatar character={character} mood={hero.mood} />
        </div>
      </div>
    );
  }

  if (phase === 'SUCCESS') {
    return (
      <div className="h-full flex flex-col items-center justify-center bg-yellow-100 p-6 relative">
        <div className="scale-150 mb-10 transition-transform duration-1000">
           <BirdAvatar progress={feathersCollected} />
        </div>
        <h2 className="text-4xl font-bold text-orange-500 animate-bounce">TÜY KAZANDIN!</h2>
        <div className="flex gap-4 mt-8">
           {[...Array(3)].map((_, i) => (
             <Feather 
               key={i} 
               size={48} 
               className={i < feathersCollected ? "text-purple-600 fill-purple-600 animate-pulse" : "text-gray-300"} 
             />
           ))}
        </div>
        {/* Hero Celebrating */}
        <div className="absolute bottom-10 left-10 animate-bounce">
           <HeroAvatar character={character} mood="HAPPY" />
        </div>
      </div>
    );
  }

  if (phase === 'MENU') {
    return (
      <div className="h-full flex flex-col items-center justify-center p-4 bg-sky-50 relative">
        <div className="absolute top-4 right-4 transform scale-75">
           <BirdAvatar progress={feathersCollected} />
        </div>
        <div className="absolute top-4 left-4 flex gap-1">
           {[...Array(3)].map((_, i) => (
             <Feather key={i} size={32} className={i < feathersCollected ? "text-purple-600 fill-purple-600" : "text-gray-300"} />
           ))}
        </div>

        <h2 className="text-3xl font-bold text-slate-700 mb-8 mt-12">Oyun Seç</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-4xl z-10">
          <button 
            onClick={() => { setSelectedMode(HiddenGameMode.MEMORY); setPhase('DIFFICULTY'); speak("Hafıza Oyunu. Sırayı takip et."); hero.think(); }}
            className="bg-white p-6 rounded-3xl shadow-lg border-b-8 border-purple-200 active:translate-y-2 active:border-b-0 transition-all flex flex-col items-center gap-4 hover:bg-purple-50"
          >
            <div className="bg-purple-100 p-4 rounded-full">
              <Brain size={48} className="text-purple-500" />
            </div>
            <span className="text-2xl font-bold text-purple-700">HAFIZA</span>
          </button>

          <button 
            onClick={() => { setSelectedMode(HiddenGameMode.SPEED); setPhase('DIFFICULTY'); speak("Hızlı Bulma. Doğru rengi yakala."); hero.think(); }}
            className="bg-white p-6 rounded-3xl shadow-lg border-b-8 border-blue-200 active:translate-y-2 active:border-b-0 transition-all flex flex-col items-center gap-4 hover:bg-blue-50"
          >
            <div className="bg-blue-100 p-4 rounded-full">
              <Zap size={48} className="text-blue-500" />
            </div>
            <span className="text-2xl font-bold text-blue-700">HIZLI BUL</span>
          </button>

          <button 
            onClick={() => { setSelectedMode(HiddenGameMode.PATTERN); setPhase('DIFFICULTY'); speak("Desen Oyunu. Yerleri hatırla."); hero.think(); }}
            className="bg-white p-6 rounded-3xl shadow-lg border-b-8 border-orange-200 active:translate-y-2 active:border-b-0 transition-all flex flex-col items-center gap-4 hover:bg-orange-50"
          >
            <div className="bg-orange-100 p-4 rounded-full">
              <Grid size={48} className="text-orange-500" />
            </div>
            <span className="text-2xl font-bold text-orange-700">DESEN</span>
          </button>
        </div>

        {/* Hero Positioned - Bottom Left */}
        <div className="absolute bottom-4 left-4">
           <HeroAvatar character={character} mood={hero.mood} />
        </div>
      </div>
    );
  }

  if (phase === 'DIFFICULTY') {
    return (
      <div className="h-full flex flex-col items-center justify-center p-4 bg-sky-50 relative">
        <div className="w-full max-w-2xl mb-8 flex items-center justify-start z-10">
           <button onClick={() => setPhase('MENU')} className="bg-white p-3 rounded-full shadow-md"><ArrowLeft /></button>
        </div>
        <h2 className="text-3xl font-bold text-slate-700 mb-8">Zorluk Seç</h2>
        
        <div className="flex flex-col gap-4 w-64 z-10">
          <Button 
            onClick={() => { setDifficulty(Difficulty.EASY); setPhase('GAME'); }} 
            color="bg-green-500" 
            className="text-xl py-2"
          >
             <Star className="fill-yellow-300 text-yellow-300" /> KOLAY
          </Button>
          <Button 
            onClick={() => { setDifficulty(Difficulty.MEDIUM); setPhase('GAME'); }} 
            color="bg-yellow-500" 
            className="text-xl py-2"
          >
             <div className="flex"><Star className="fill-white text-white" /><Star className="fill-white text-white" /></div> ORTA
          </Button>
          <Button 
            onClick={() => { setDifficulty(Difficulty.HARD); setPhase('GAME'); }} 
            color="bg-red-500" 
            className="text-xl py-2"
          >
             <div className="flex"><Star className="fill-yellow-300 text-yellow-300" /><Star className="fill-yellow-300 text-yellow-300" /><Star className="fill-yellow-300 text-yellow-300" /></div> ZOR
          </Button>
        </div>

        {/* Hero Positioned */}
        <div className="absolute bottom-4 right-4 opacity-50">
           <HeroAvatar character={character} mood={hero.mood} />
        </div>
      </div>
    );
  }

  // --- ACTUAL MINI-GAME ROUTER ---
  return (
    <div className="h-full w-full bg-slate-50 relative">
      <button 
        onClick={() => setPhase('MENU')} 
        className="absolute top-4 left-4 bg-white p-2 rounded-full shadow-lg z-50 text-slate-500"
      >
        <ArrowLeft />
      </button>

      {/* Hero Overlay on Games - Bottom Left Fixed */}
      <div className="absolute bottom-4 left-4 z-40 pointer-events-none">
          <HeroAvatar character={character} mood={hero.mood} />
      </div>

      {selectedMode === HiddenGameMode.MEMORY && difficulty && (
        <MemoryGame difficulty={difficulty} onWin={handleGameWin} hero={hero} />
      )}
      {selectedMode === HiddenGameMode.SPEED && difficulty && (
        <SpeedGame difficulty={difficulty} onWin={handleGameWin} hero={hero} />
      )}
      {selectedMode === HiddenGameMode.PATTERN && difficulty && (
        <PatternGame difficulty={difficulty} onWin={handleGameWin} hero={hero} />
      )}
    </div>
  );
};

// ==========================================
// MINI GAME: MEMORY (Simon Says Style)
// ==========================================
const MemoryGame: React.FC<MiniGameProps> = ({ difficulty, onWin, hero }) => {
  const [sequence, setSequence] = useState<number[]>([]);
  const [userStep, setUserStep] = useState(0);
  const [isPlayingSequence, setIsPlayingSequence] = useState(false);
  const [activeFeather, setActiveFeather] = useState<number | null>(null);

  const colors = ['text-red-500', 'text-blue-500', 'text-yellow-500', 'text-green-500'];
  const sequenceLength = difficulty === Difficulty.EASY ? 3 : difficulty === Difficulty.MEDIUM ? 4 : 5;
  const speed = difficulty === Difficulty.EASY ? 1000 : 700;

  useEffect(() => {
    startNewGame();
  }, []);

  const startNewGame = () => {
    const newSeq = Array.from({ length: sequenceLength }, () => Math.floor(Math.random() * 4));
    setSequence(newSeq);
    setUserStep(0);
    playSequence(newSeq);
  };

  const playSequence = async (seq: number[]) => {
    hero.think(); // Hero thinks while showing pattern
    setIsPlayingSequence(true);
    await new Promise(r => setTimeout(r, 1000));
    
    for (let i = 0; i < seq.length; i++) {
      setActiveFeather(seq[i]);
      await new Promise(r => setTimeout(r, speed));
      setActiveFeather(null);
      await new Promise(r => setTimeout(r, 200));
    }
    setIsPlayingSequence(false);
    speak("Şimdi sıra sende!");
    // Hero goes idle or happy to prompt user
  };

  const handlePress = (index: number) => {
    if (isPlayingSequence) return;

    setActiveFeather(index);
    setTimeout(() => setActiveFeather(null), 300);

    if (index === sequence[userStep]) {
      // Correct Step
      const nextStep = userStep + 1;
      setUserStep(nextStep);
      
      if (nextStep === sequence.length) {
        onWin();
      }
    } else {
      // Wrong
      hero.encourage();
      setTimeout(startNewGame, 1000);
    }
  };

  return (
    <div className="h-full flex flex-col items-center justify-center">
      <h3 className="text-2xl font-bold mb-8 text-purple-600">Sırayı Takip Et</h3>
      <div className="grid grid-cols-2 gap-8">
        {colors.map((color, idx) => (
          <button
            key={idx}
            onClick={() => handlePress(idx)}
            className={`
              p-6 rounded-full bg-white shadow-xl transition-all duration-200 border-4 border-transparent
              ${activeFeather === idx ? 'scale-110 border-gray-300 ring-4 ring-purple-300 bg-purple-50' : 'hover:scale-105'}
            `}
          >
            <Feather size={80} className={`${color} ${activeFeather === idx ? 'fill-current' : ''}`} strokeWidth={2} />
          </button>
        ))}
      </div>
      {isPlayingSequence && <div className="mt-8 text-xl font-bold animate-pulse text-gray-500">İzle...</div>}
    </div>
  );
};

// ==========================================
// MINI GAME: SPEED (Reflex/Attention)
// ==========================================
const SpeedGame: React.FC<MiniGameProps> = ({ difficulty, onWin, hero }) => {
  const [targetColor, setTargetColor] = useState<'red' | 'blue' | 'green'>('red');
  const [score, setScore] = useState(0);
  const [activeItems, setActiveItems] = useState<{id: number, color: string, x: number, y: number}[]>([]);
  const [gameActive, setGameActive] = useState(true);
  
  const targetScore = difficulty === Difficulty.EASY ? 5 : difficulty === Difficulty.MEDIUM ? 8 : 10;
  const spawnRate = difficulty === Difficulty.EASY ? 1500 : difficulty === Difficulty.MEDIUM ? 1000 : 700;
  const duration = difficulty === Difficulty.EASY ? 2000 : 1500;

  // Initialize Game
  useEffect(() => {
    const colors = ['red', 'blue', 'green'] as const;
    const t = colors[Math.floor(Math.random() * colors.length)];
    setTargetColor(t);
    const colorName = t === 'red' ? 'KIRMIZI' : t === 'blue' ? 'MAVİ' : 'YEŞİL';
    speak(`Sadece ${colorName} tüyleri yakala!`);
    
    // Spawn Loop
    const interval = window.setInterval(() => {
      if(gameActive) {
         spawnFeather(t);
      }
    }, spawnRate);

    return () => clearInterval(interval);
  }, [gameActive]); // Only depends on gameActive toggling

  // Check Win Condition in UseEffect to avoid "update while rendering" error
  useEffect(() => {
    if (score >= targetScore && gameActive) {
      setGameActive(false); // Stop spawning
      setActiveItems([]); // Clear screen
      onWin();
    }
  }, [score, targetScore, onWin, gameActive]);

  const spawnFeather = (target: string) => {
    const id = Date.now();
    const colors = ['red', 'blue', 'green'];
    const isTarget = Math.random() > 0.4;
    const color = isTarget ? target : colors.filter(c => c !== target)[Math.floor(Math.random() * 2)];
    const x = 10 + Math.random() * 80;
    const y = 20 + Math.random() * 60;

    setActiveItems(prev => [...prev, { id, color, x, y }]);

    setTimeout(() => {
      setActiveItems(prev => prev.filter(i => i.id !== id));
    }, duration);
  };

  const handleTap = (item: {id: number, color: string}) => {
    if (!gameActive) return;

    // Prevent double clicking same item
    if (!activeItems.find(i => i.id === item.id)) return;

    if (item.color === targetColor) {
      hero.celebrate();
      // Remove clicked item immediately
      setActiveItems(prev => prev.filter(i => i.id !== item.id));
      // Pure state update
      setScore(s => s + 1);
    } else {
      hero.encourage();
      // Maybe penalty or just shake?
    }
  };

  const colorClass = (c: string) => c === 'red' ? 'text-red-500' : c === 'blue' ? 'text-blue-500' : 'text-green-500';

  return (
    <div className="h-full w-full relative overflow-hidden bg-sky-50 touch-none select-none">
       <div className="absolute top-0 w-full flex justify-between items-center p-4 bg-white/80 z-10">
          <div className="flex items-center gap-2">
             <span className="text-xl font-bold text-gray-600">Hedef:</span>
             <Feather className={`${colorClass(targetColor)} fill-current`} />
          </div>
          <div className="text-xl font-bold text-gray-600">
            {score} / {targetScore}
          </div>
       </div>

       {activeItems.map(item => (
         <div 
           key={item.id}
           onPointerDown={() => handleTap(item)}
           className="absolute p-4 animate-bounce-slow cursor-pointer"
           style={{ left: `${item.x}%`, top: `${item.y}%` }}
         >
            <Feather size={64} className={`${colorClass(item.color)} drop-shadow-lg`} strokeWidth={3} />
         </div>
       ))}
    </div>
  );
};

// ==========================================
// MINI GAME: PATTERN (Grid Memory)
// ==========================================
const PatternGame: React.FC<MiniGameProps> = ({ difficulty, onWin, hero }) => {
  const [gridSize, setGridSize] = useState(3);
  const [pattern, setPattern] = useState<number[]>([]);
  const [userPattern, setUserPattern] = useState<number[]>([]);
  const [isMemorizing, setIsMemorizing] = useState(true);

  useEffect(() => {
    let size = 3;
    let count = 3;
    if (difficulty === Difficulty.MEDIUM) { count = 4; }
    if (difficulty === Difficulty.HARD) { size = 4; count = 6; }
    
    setGridSize(size);
    generatePattern(size, count);
  }, []);

  const generatePattern = (size: number, count: number) => {
    const totalCells = size * size;
    const newPattern: number[] = [];
    while (newPattern.length < count) {
      const r = Math.floor(Math.random() * totalCells);
      if (!newPattern.includes(r)) newPattern.push(r);
    }
    setPattern(newPattern);
    
    hero.think(); // Hero is watching
    speak("Tüylerin yerini iyice izle!");
    
    setTimeout(() => {
      setIsMemorizing(false);
      speak("Şimdi tüylerin olduğu kutulara dokun.");
    }, 2500); 
  };

  const handleCellClick = (index: number) => {
    if (isMemorizing) return;

    const isSelected = userPattern.includes(index);
    let newUserPattern = isSelected 
      ? userPattern.filter(i => i !== index)
      : [...userPattern, index];
    
    setUserPattern(newUserPattern);

    if (newUserPattern.length === pattern.length) {
      const isCorrect = pattern.every(p => newUserPattern.includes(p));
      if (isCorrect) {
         onWin();
      } else {
         hero.encourage();
      }
    }
  };

  return (
    <div className="h-full flex flex-col items-center justify-center p-4">
      <h3 className="text-2xl font-bold mb-4 text-orange-600">
        {isMemorizing ? "İZLE..." : "YERLEŞTİR!"}
      </h3>
      
      <div 
        className="grid gap-2 bg-orange-100 p-4 rounded-xl shadow-inner"
        style={{ 
          gridTemplateColumns: `repeat(${gridSize}, minmax(0, 1fr))` 
        }}
      >
        {[...Array(gridSize * gridSize)].map((_, i) => {
          const showFeather = isMemorizing ? pattern.includes(i) : userPattern.includes(i);
          return (
            <div
              key={i}
              onClick={() => handleCellClick(i)}
              className={`
                w-16 h-16 md:w-20 md:h-20 rounded-lg border-2 flex items-center justify-center cursor-pointer transition-colors
                ${showFeather ? 'bg-white border-orange-400 shadow-sm' : 'bg-orange-50/50 border-orange-200'}
              `}
            >
              {showFeather && (
                <Feather className="text-orange-500 animate-bounce-slow" size={32} />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};