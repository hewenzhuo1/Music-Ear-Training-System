// Training modes
export type TrainingMode = 'note' | 'interval' | 'chord' | 'scale';

// Game modes
export type GameMode = 'challenge' | 'zen';

// Difficulty levels
export type DifficultyLevel = 'beginner' | 'elementary' | 'intermediate' | 'advanced';

// Play modes for intervals and chords
export type PlayMode = 'harmonic' | 'ascending' | 'descending';

// Training settings
export interface TrainingSettings {
  noteRange: string[];
  octaveRange: [number, number];
  playMode: PlayMode;
  difficulty: DifficultyLevel;
  enabledIntervals?: string[];
  enabledChords?: string[];
  enabledScales?: string[];
}

// Training result
export interface TrainingResult {
  mode: TrainingMode;
  gameMode: GameMode;
  correct: boolean;
  answer: string;
  userAnswer: string;
  timestamp: number;
  difficulty: DifficultyLevel;
}

// Challenge mode state
export interface ChallengeState {
  lives: number;
  streak: number;
  maxStreak: number;
  correctCount: number;
  totalCount: number;
  score: number;
}

// User progress
export interface UserProgress {
  unlockedModes: TrainingMode[];
  unlockedDifficulties: DifficultyLevel[];
  totalChallengesCompleted: number;
  achievements: string[];
}

// Statistics data
export interface StatisticsData {
  results: TrainingResult[];
  accuracyTrend: { date: string; accuracy: number }[];
  weakPoints: { item: string; accuracy: number }[];
  modeStats: {
    mode: TrainingMode;
    total: number;
    correct: number;
    accuracy: number;
  }[];
}
