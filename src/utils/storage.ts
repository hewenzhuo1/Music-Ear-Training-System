import { TrainingResult, UserProgress, DifficultyLevel, TrainingMode } from '../types';

const STORAGE_KEYS = {
  RESULTS: 'earTraining_results',
  PROGRESS: 'earTraining_progress',
  SETTINGS: 'earTraining_settings',
};

// Save training result
export function saveResult(result: TrainingResult) {
  const results = getResults();
  results.push(result);
  // Keep only last 1000 results
  if (results.length > 1000) {
    results.shift();
  }
  localStorage.setItem(STORAGE_KEYS.RESULTS, JSON.stringify(results));
}

// Get all results
export function getResults(): TrainingResult[] {
  const data = localStorage.getItem(STORAGE_KEYS.RESULTS);
  return data ? JSON.parse(data) : [];
}

// Get results for specific mode
export function getResultsByMode(mode: TrainingMode): TrainingResult[] {
  return getResults().filter(r => r.mode === mode);
}

// Get recent results (last n days)
export function getRecentResults(days: number = 7): TrainingResult[] {
  const cutoffTime = Date.now() - days * 24 * 60 * 60 * 1000;
  return getResults().filter(r => r.timestamp >= cutoffTime);
}

// Calculate accuracy for results
export function calculateAccuracy(results: TrainingResult[]): number {
  if (results.length === 0) return 0;
  const correct = results.filter(r => r.correct).length;
  return Math.round((correct / results.length) * 100);
}

// Get accuracy trend (last 7 days)
export function getAccuracyTrend(): { date: string; accuracy: number }[] {
  const trend: { date: string; accuracy: number }[] = [];
  const now = new Date();
  
  for (let i = 6; i >= 0; i--) {
    const date = new Date(now);
    date.setDate(date.getDate() - i);
    const dateStr = date.toLocaleDateString('zh-CN', { month: 'numeric', day: 'numeric' });
    
    const dayStart = new Date(date.setHours(0, 0, 0, 0)).getTime();
    const dayEnd = new Date(date.setHours(23, 59, 59, 999)).getTime();
    
    const dayResults = getResults().filter(
      r => r.timestamp >= dayStart && r.timestamp <= dayEnd
    );
    
    trend.push({
      date: dateStr,
      accuracy: calculateAccuracy(dayResults),
    });
  }
  
  return trend;
}

// Get weak points (items with low accuracy)
export function getWeakPoints(): { item: string; accuracy: number }[] {
  const results = getRecentResults(30);
  const itemStats: { [key: string]: { correct: number; total: number } } = {};
  
  results.forEach(r => {
    if (!itemStats[r.answer]) {
      itemStats[r.answer] = { correct: 0, total: 0 };
    }
    itemStats[r.answer].total++;
    if (r.correct) {
      itemStats[r.answer].correct++;
    }
  });
  
  return Object.entries(itemStats)
    .map(([item, stats]) => ({
      item,
      accuracy: Math.round((stats.correct / stats.total) * 100),
    }))
    .filter(item => item.accuracy < 70)
    .sort((a, b) => a.accuracy - b.accuracy)
    .slice(0, 5);
}

// Get mode statistics
export function getModeStats() {
  const modes: TrainingMode[] = ['note', 'interval', 'chord', 'scale'];
  return modes.map(mode => {
    const results = getResultsByMode(mode);
    const correct = results.filter(r => r.correct).length;
    return {
      mode,
      total: results.length,
      correct,
      accuracy: results.length > 0 ? Math.round((correct / results.length) * 100) : 0,
    };
  });
}

// User progress
export function getUserProgress(): UserProgress {
  const data = localStorage.getItem(STORAGE_KEYS.PROGRESS);
  if (data) {
    return JSON.parse(data);
  }
  
  // Default progress
  return {
    unlockedModes: ['note'],
    unlockedDifficulties: ['beginner'],
    totalChallengesCompleted: 0,
    achievements: [],
  };
}

export function saveUserProgress(progress: UserProgress) {
  localStorage.setItem(STORAGE_KEYS.PROGRESS, JSON.stringify(progress));
}

// Check and unlock new content
export function checkUnlocks(progress: UserProgress): UserProgress {
  const stats = getModeStats();
  const newProgress = { ...progress };
  
  // Unlock interval mode after 20 correct notes
  const noteStats = stats.find(s => s.mode === 'note');
  if (noteStats && noteStats.correct >= 20 && !newProgress.unlockedModes.includes('interval')) {
    newProgress.unlockedModes.push('interval');
  }
  
  // Unlock chord mode after 30 correct intervals
  const intervalStats = stats.find(s => s.mode === 'interval');
  if (intervalStats && intervalStats.correct >= 30 && !newProgress.unlockedModes.includes('chord')) {
    newProgress.unlockedModes.push('chord');
  }
  
  // Unlock scale mode after 40 correct chords
  const chordStats = stats.find(s => s.mode === 'chord');
  if (chordStats && chordStats.correct >= 40 && !newProgress.unlockedModes.includes('scale')) {
    newProgress.unlockedModes.push('scale');
  }
  
  // Unlock difficulties based on accuracy
  const recentResults = getRecentResults(7);
  const recentAccuracy = calculateAccuracy(recentResults);
  
  if (recentAccuracy >= 60 && recentResults.length >= 20 && !newProgress.unlockedDifficulties.includes('elementary')) {
    newProgress.unlockedDifficulties.push('elementary');
  }
  
  if (recentAccuracy >= 70 && recentResults.length >= 50 && !newProgress.unlockedDifficulties.includes('intermediate')) {
    newProgress.unlockedDifficulties.push('intermediate');
  }
  
  if (recentAccuracy >= 80 && recentResults.length >= 100 && !newProgress.unlockedDifficulties.includes('advanced')) {
    newProgress.unlockedDifficulties.push('advanced');
  }
  
  return newProgress;
}

// Settings
export function getSettings() {
  const data = localStorage.getItem(STORAGE_KEYS.SETTINGS);
  return data ? JSON.parse(data) : null;
}

export function saveSettings(settings: any) {
  localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(settings));
}
