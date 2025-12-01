import React, { useState } from 'react';
import { Screen, CharacterType } from './types';
import { speak } from './constants';
import { Button } from './components/Button';
import { CharacterSelect } from './components/CharacterSelect';
import { IntroStory } from './components/IntroStory';
import { GamePattern } from './components/GamePattern';
import { GameHidden } from './components/GameHidden';
import { GameColoring } from './components/GameColoring';
import { Play, RotateCcw, PartyPopper } from 'lucide-react';

export default function App() {
  const [screen, setScreen] = useState<Screen>(Screen.SPLASH);
  const [character, setCharacter] = useState<CharacterType | null>(null);

  const startIntro = () => {
    speak("Merhaba! Gökkuşağı Ormanı'nın renkleri kayboldu. Bize yardım eder misin?");
    setScreen(Screen.CHARACTER_SELECT);
  };

  const handleCharacterSelect = (char: CharacterType) => {
    setCharacter(char);
    // Short delay for voice to finish
    setTimeout(() => {
      setScreen(Screen.INTRO_STORY);
    }, 1500);
  };

  const renderScreen = () => {
    switch (screen) {
      case Screen.SPLASH:
        return (
          <div className="h-screen w-screen flex flex-col items-center justify-center bg-gradient-to-b from-sky-300 to-sky-100">
            <h1 className="text-5xl md:text-7xl font-bold text-white mb-8 text-center drop-shadow-md tracking-wider">
              GÖKKUŞAĞI<br/>ORMANI
            </h1>
            <div className="animate-bounce-slow">
              <Button onClick={startIntro} color="bg-green-500">
                <Play fill="white" size={40} /> OYNA
              </Button>
            </div>
          </div>
        );

      case Screen.CHARACTER_SELECT:
        return <CharacterSelect onSelect={handleCharacterSelect} />;

      case Screen.INTRO_STORY:
        return (
          <IntroStory 
            character={character} 
            onComplete={() => setScreen(Screen.GAME_PATTERN)} 
          />
        );

      case Screen.GAME_PATTERN:
        return <GamePattern onComplete={() => setScreen(Screen.GAME_HIDDEN)} />;

      case Screen.GAME_HIDDEN:
        // Pass the selected character to the game hub
        return <GameHidden character={character || CharacterType.BUNNY} onComplete={() => setScreen(Screen.GAME_COLORING)} />;

      case Screen.GAME_COLORING:
        return <GameColoring character={character || CharacterType.BUNNY} onComplete={() => setScreen(Screen.VICTORY)} />;

      case Screen.VICTORY:
        return (
          <div className="h-full flex flex-col items-center justify-center bg-gradient-to-r from-red-200 via-yellow-200 to-blue-200">
            <div className="animate-spin mb-8">
               <PartyPopper size={100} className="text-purple-600" />
            </div>
            <h1 className="text-5xl font-bold text-purple-600 mb-4 text-center">TEBRİKLER!</h1>
            <p className="text-2xl text-purple-500 mb-12 font-bold">Orman kurtuldu!</p>
            <Button onClick={() => setScreen(Screen.SPLASH)} color="bg-pink-500">
              <RotateCcw size={40} /> TEKRAR OYNA
            </Button>
          </div>
        );
      
      default:
        return <div>Hata</div>;
    }
  };

  return (
    <div className="h-screen w-screen bg-sky-50 font-['Fredoka'] text-gray-800">
      {renderScreen()}
    </div>
  );
}