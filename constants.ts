import { PatternItem } from './types';

export const COLORS = {
  red: 'bg-red-500',
  blue: 'bg-blue-500',
  green: 'bg-green-500',
  yellow: 'bg-yellow-400',
  purple: 'bg-purple-500',
  orange: 'bg-orange-500',
};

export const SPEAK_OPTIONS: SpeechSynthesisUtterance = new SpeechSynthesisUtterance();
SPEAK_OPTIONS.lang = 'tr-TR';
SPEAK_OPTIONS.rate = 0.9; // Biraz yavaş konuşsun
SPEAK_OPTIONS.pitch = 1.1; // Biraz neşeli ton

// Helper to speak text
export const speak = (text: string) => {
  window.speechSynthesis.cancel(); // Stop previous
  SPEAK_OPTIONS.text = text;
  window.speechSynthesis.speak(SPEAK_OPTIONS);
};

// Base items available in the game
export const PATTERN_ITEMS: PatternItem[] = [
  { id: 1, shape: 'star', color: 'bg-yellow-400', colorName: 'Sarı' },
  { id: 2, shape: 'circle', color: 'bg-red-500', colorName: 'Kırmızı' },
  { id: 3, shape: 'square', color: 'bg-blue-500', colorName: 'Mavi' },
];

// Define sequences for different difficulties
export const PATTERN_LEVELS = {
  EASY: [PATTERN_ITEMS[0], PATTERN_ITEMS[1], PATTERN_ITEMS[2]],
  HARD: [
    PATTERN_ITEMS[0], 
    PATTERN_ITEMS[1], 
    PATTERN_ITEMS[2], 
    PATTERN_ITEMS[0], 
    PATTERN_ITEMS[1]
  ]
};