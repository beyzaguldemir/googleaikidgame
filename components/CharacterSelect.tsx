import React from 'react';
import { Rabbit, Cat } from 'lucide-react'; // Using Cat as Bear proxy or generic cute animal
import { CharacterType } from '../types';
import { speak } from '../constants';

interface Props {
  onSelect: (char: CharacterType) => void;
}

export const CharacterSelect: React.FC<Props> = ({ onSelect }) => {
  
  React.useEffect(() => {
    speak("Hangi kahraman olmak istersin? Tavşan Zıpzıp mı, yoksa Ayı Paytak mı?");
  }, []);

  return (
    <div className="flex flex-col items-center justify-center h-full p-4 gap-8">
      <h2 className="text-4xl font-bold text-sky-800 mb-4 animate-bounce">Kahramanını Seç!</h2>
      
      <div className="flex flex-col md:flex-row gap-8">
        {/* Bunny Option */}
        <div 
          onClick={() => {
            speak("Harika! Ben Zıpzıp. Hadi maceraya başlayalım!");
            onSelect(CharacterType.BUNNY);
          }}
          className="game-card bg-white p-8 rounded-3xl shadow-xl flex flex-col items-center gap-4 cursor-pointer border-4 border-pink-300 hover:bg-pink-50 w-64"
        >
          <div className="w-32 h-32 bg-pink-100 rounded-full flex items-center justify-center">
            <Rabbit size={80} className="text-pink-500" />
          </div>
          <span className="text-3xl font-bold text-gray-700">Zıpzıp</span>
        </div>

        {/* Bear Option */}
        <div 
          onClick={() => {
            speak("Ben Paytak. Çok güçlüyüm! Hadi gidelim.");
            onSelect(CharacterType.BEAR);
          }}
          className="game-card bg-white p-8 rounded-3xl shadow-xl flex flex-col items-center gap-4 cursor-pointer border-4 border-amber-300 hover:bg-amber-50 w-64"
        >
          <div className="w-32 h-32 bg-amber-100 rounded-full flex items-center justify-center">
            <Cat size={80} className="text-amber-600" /> 
          </div>
          <span className="text-3xl font-bold text-gray-700">Paytak</span>
        </div>
      </div>
    </div>
  );
};
