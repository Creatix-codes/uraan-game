export type ScreenName = 'home' | 'map' | 'game' | 'victory' | 'settings';

export type LevelSlug =
  | 'lahore'
  | 'karachi'
  | 'mohenjo-daro'
  | 'islamabad'
  | 'swat'
  | 'hunza'
  | 'skardu'
  | 'fairy-meadows';

export interface LevelPalette {
  skyTop: string;
  skyBottom: string;
  haze: string;
  sun: string;
  glow: string;
  cloud: string;
  far: string;
  farLight: string;
  mid: string;
  midLight: string;
  near: string;
  groundTop: string;
  groundBottom: string;
  accent: string;
  accentSoft: string;
  ink: string;
  obstacle: string;
  obstacleLight: string;
  obstacleDark: string;
}

export interface LevelConfig {
  id: number;
  slug: LevelSlug;
  city: string;
  region: string;
  landmark: string;
  tagline: string;
  description: string;
  funFact: string;
  foodieNote: string;
  palette: LevelPalette;
  /* Gameplay tuning */
  speed: number;
  gap: number;
  spacing: number;
  lengthMeters: number;
  starGoals: [number, number];
  /* Normalised position on the illustrated map */
  map: { x: number; y: number };
  labelSide: 'left' | 'right';
}

export interface LevelProgress {
  completed: boolean;
  bestStars: number;
  bestScore: number;
  plays: number;
}

export interface GameSettings {
  music: boolean;
  sfx: boolean;
}

export interface ProgressState {
  version: 1;
  unlocked: number;
  levels: Record<string, LevelProgress>;
  tutorialSeen: boolean;
  settings: GameSettings;
  totalFlights: number;
}

export interface LevelResult {
  levelId: number;
  completed: true;
  rating: number;
  starsCollected: number;
  heartsLeft: number;
  score: number;
  distance: number;
  isNewBest: boolean;
}
