export enum Screen {
  SPLASH = 'SPLASH',
  CHARACTER_SELECT = 'CHARACTER_SELECT',
  INTRO_STORY = 'INTRO_STORY',
  GAME_PATTERN = 'GAME_PATTERN', // Şifreleme Oyunu
  GAME_HIDDEN = 'GAME_HIDDEN',   // Saklambaç (Artık BİLSEM Modülleri)
  GAME_COLORING = 'GAME_COLORING', // Boyama Oyunu
  VICTORY = 'VICTORY'
}

export enum CharacterType {
  BUNNY = 'BUNNY',
  BEAR = 'BEAR'
}

export interface GameState {
  currentScreen: Screen;
  character: CharacterType | null;
  score: number;
}

export interface PatternItem {
  id: number;
  shape: 'circle' | 'square' | 'triangle' | 'star';
  color: string;
  colorName: string; 
}

// --- NEW TYPES FOR BILSEM MODULES ---

export enum HiddenGameMode {
  MEMORY = 'MEMORY',
  SPEED = 'SPEED',
  PATTERN = 'PATTERN'
}

export enum Difficulty {
  EASY = 'EASY',
  MEDIUM = 'MEDIUM',
  HARD = 'HARD'
}
