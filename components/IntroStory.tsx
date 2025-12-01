import React, { useState, useEffect } from 'react';
import { Cloud, Sun, Trees, Bird, ArrowRight, Frown, Smile } from 'lucide-react';
import { speak } from '../constants';
import { Button } from './Button';
import { CharacterType } from '../types';

interface Props {
  character: CharacterType | null;
  onComplete: () => void;
}

export const IntroStory: React.FC<Props> = ({ character, onComplete }) => {
  const [step, setStep] = useState(0);

  const scenes = [
    {
      text: "Burası Gökkuşağı Ormanı. Her yer ne kadar renkli ve mutlu!",
      bg: "bg-gradient-to-b from-sky-300 to-green-200",
      content: (
        <div className="relative w-72 h-72 flex items-center justify-center">
          <Sun className="absolute top-0 right-0 text-yellow-400 animate-spin-slow" size={100} />
          <Trees className="text-green-600 mt-10" size={160} />
          <Bird className="absolute bottom-4 left-4 text-red-500 animate-bounce" size={70} />
          <Smile className="absolute top-1/2 left-1/2 text-yellow-500 animate-pulse bg-white rounded-full" size={50} />
        </div>
      )
    },
    {
      text: "Ama bir gün yaramaz Gri Bulut geldi...",
      bg: "bg-slate-400 transition-colors duration-1000",
      content: (
        <div className="relative w-72 h-72 flex items-center justify-center">
          <Trees className="text-green-800 opacity-50 mt-10 blur-[1px]" size={160} />
          <Cloud className="absolute top-10 text-gray-700 animate-float drop-shadow-2xl" size={200} />
        </div>
      )
    },
    {
      text: "Üfledi, püfledi... Bütün renkleri alıp sakladı!",
      bg: "bg-gray-600 grayscale transition-all duration-1000",
      content: (
        <div className="relative w-72 h-72 flex items-center justify-center">
           <Trees className="text-gray-400 mt-10" size={160} />
           <Bird className="absolute bottom-4 right-4 text-gray-400" size={70} />
           <Cloud className="absolute top-0 left-0 text-gray-300 opacity-80" size={120} />
           <Frown className="absolute top-1/2 left-1/2 text-gray-800 animate-pulse bg-gray-200 rounded-full" size={60} />
        </div>
      )
    },
    {
      text: "Lütfen renkleri bulmamıza yardım et!",
      bg: "bg-sky-100",
      content: (
        <div className="flex flex-col items-center gap-4 animate-float">
           <Bird className="text-blue-500" size={140} />
           <div className="flex gap-2">
             <div className="w-6 h-6 rounded-full bg-red-400 animate-bounce delay-0" />
             <div className="w-6 h-6 rounded-full bg-yellow-400 animate-bounce delay-100" />
             <div className="w-6 h-6 rounded-full bg-green-400 animate-bounce delay-200" />
             <div className="w-6 h-6 rounded-full bg-blue-400 animate-bounce delay-300" />
           </div>
        </div>
      )
    }
  ];

  useEffect(() => {
    // Small delay to ensure previous speech is cancelled if fast clicking
    const timer = setTimeout(() => {
        speak(scenes[step].text);
    }, 100);
    return () => clearTimeout(timer);
  }, [step]);

  const nextStep = () => {
    if (step < scenes.length - 1) {
      setStep(step + 1);
    }
  };

  return (
    <div className={`h-full w-full flex flex-col items-center justify-center p-4 md:p-8 ${scenes[step].bg} transition-colors duration-1000`}>
      <div className="flex-1 w-full max-w-2xl flex items-center justify-center">
          <div className="relative bg-white/40 rounded-[3rem] p-12 shadow-2xl backdrop-blur-sm border-4 border-white/60">
            {scenes[step].content}
          </div>
      </div>
      
      <div className="w-full max-w-3xl text-center mb-8 min-h-[8rem] flex items-center justify-center px-4">
        <p className="text-2xl md:text-4xl font-bold text-slate-800 bg-white/90 p-6 rounded-3xl shadow-lg border-b-8 border-slate-200 w-full leading-relaxed">
          {scenes[step].text}
        </p>
      </div>

      <div className="h-24 flex items-start justify-center w-full">
        {step < scenes.length - 1 ? (
          <Button onClick={nextStep} color="bg-orange-500">
            <ArrowRight size={40} strokeWidth={3} /> DEVAM
          </Button>
        ) : (
          <Button onClick={onComplete} color="bg-green-500">
            BAŞLAYALIM!
          </Button>
        )}
      </div>
    </div>
  );
};