import { useState, useEffect } from 'react';
import { Volume2, Heart, Trophy, Zap, Eye } from 'lucide-react';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { Badge } from './ui/badge';
import { audioEngine } from '../utils/audioEngine';
import { NOTES, INTERVALS, getRandomItem, DIFFICULTY_PRESETS } from '../utils/musicTheory';
import { saveResult, getUserProgress, saveUserProgress, checkUnlocks } from '../utils/storage';
import { GameMode, DifficultyLevel, ChallengeState, TrainingSettings, PlayMode } from '../types';

interface Props {
  gameMode: GameMode;
  difficulty: DifficultyLevel;
  settings: TrainingSettings;
}

export function IntervalTraining({ gameMode, difficulty, settings }: Props) {
  const [currentInterval, setCurrentInterval] = useState<{
    name: string;
    notes: { note: string; octave: number }[];
  } | null>(null);
  const [showAnswer, setShowAnswer] = useState(false);
  const [challengeState, setChallengeState] = useState<ChallengeState>({
    lives: 3,
    streak: 0,
    maxStreak: 0,
    correctCount: 0,
    totalCount: 0,
    score: 0,
  });
  const [gameOver, setGameOver] = useState(false);
  const [rating, setRating] = useState<string>('');

  useEffect(() => {
    generateNewQuestion();
  }, [settings]);

  const generateNewQuestion = () => {
    const preset = DIFFICULTY_PRESETS[difficulty];
    const intervalName = getRandomItem(preset.intervals);
    const semitones = INTERVALS[intervalName as keyof typeof INTERVALS];
    
    const baseNote = getRandomItem(settings.noteRange);
    const baseOctave = settings.octaveRange[0] + 
      Math.floor(Math.random() * (settings.octaveRange[1] - settings.octaveRange[0] + 1));
    
    const baseNoteIndex = NOTES.indexOf(baseNote);
    let targetNoteIndex = (baseNoteIndex + semitones) % 12;
    let targetOctave = baseOctave + Math.floor((baseNoteIndex + semitones) / 12);
    
    setCurrentInterval({
      name: intervalName,
      notes: [
        { note: baseNote, octave: baseOctave },
        { note: NOTES[targetNoteIndex], octave: targetOctave },
      ],
    });
    setShowAnswer(false);
  };

  const playSound = () => {
    if (currentInterval) {
      audioEngine.playNotes(currentInterval.notes, settings.playMode, 1.2);
    }
  };

  const handleAnswer = (selectedInterval: string) => {
    if (!currentInterval || gameOver) return;

    const isCorrect = selectedInterval === currentInterval.name;
    
    saveResult({
      mode: 'interval',
      gameMode,
      correct: isCorrect,
      answer: currentInterval.name,
      userAnswer: selectedInterval,
      timestamp: Date.now(),
      difficulty,
    });

    if (gameMode === 'challenge') {
      const newState = { ...challengeState };
      newState.totalCount++;
      
      if (isCorrect) {
        newState.correctCount++;
        newState.streak++;
        newState.maxStreak = Math.max(newState.maxStreak, newState.streak);
        newState.score += 15 * (1 + newState.streak * 0.1);
      } else {
        newState.lives--;
        newState.streak = 0;
      }
      
      setChallengeState(newState);
      
      if (newState.lives <= 0) {
        endChallenge(newState);
      } else {
        setTimeout(generateNewQuestion, 1000);
      }
    } else {
      setShowAnswer(true);
      setTimeout(generateNewQuestion, 2500);
    }
    
    const progress = getUserProgress();
    const newProgress = checkUnlocks(progress);
    saveUserProgress(newProgress);
  };

  const endChallenge = (state: ChallengeState) => {
    setGameOver(true);
    const accuracy = (state.correctCount / state.totalCount) * 100;
    
    let newRating = 'F';
    if (accuracy >= 90) newRating = 'S';
    else if (accuracy >= 80) newRating = 'A';
    else if (accuracy >= 70) newRating = 'B';
    else if (accuracy >= 60) newRating = 'C';
    else if (accuracy >= 50) newRating = 'D';
    
    setRating(newRating);
    
    const progress = getUserProgress();
    progress.totalChallengesCompleted++;
    saveUserProgress(progress);
  };

  const restartChallenge = () => {
    setChallengeState({
      lives: 3,
      streak: 0,
      maxStreak: 0,
      correctCount: 0,
      totalCount: 0,
      score: 0,
    });
    setGameOver(false);
    setRating('');
    generateNewQuestion();
  };

  if (gameOver) {
    return (
      <div className="flex items-center justify-center min-h-[500px]">
        <Card className="p-8 max-w-md w-full text-center space-y-6">
          <Trophy className="w-16 h-16 mx-auto text-yellow-500" />
          <div className="space-y-2">
            <div className="space-y-1">
              <p className="text-muted-foreground">评级</p>
              <p className="text-6xl">{rating}</p>
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-muted-foreground">正确率</p>
              <p className="text-2xl">{Math.round((challengeState.correctCount / challengeState.totalCount) * 100)}%</p>
            </div>
            <div>
              <p className="text-muted-foreground">得分</p>
              <p className="text-2xl">{Math.round(challengeState.score)}</p>
            </div>
            <div>
              <p className="text-muted-foreground">最高连击</p>
              <p className="text-2xl">{challengeState.maxStreak}</p>
            </div>
            <div>
              <p className="text-muted-foreground">总答题数</p>
              <p className="text-2xl">{challengeState.totalCount}</p>
            </div>
          </div>
          
          <Button onClick={restartChallenge} className="w-full">
            再来一次
          </Button>
        </Card>
      </div>
    );
  }

  const availableIntervals = DIFFICULTY_PRESETS[difficulty].intervals;

  return (
    <div className="space-y-6 max-w-2xl mx-auto">
      {gameMode === 'challenge' && (
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <Heart className="w-5 h-5 text-red-500" />
              <span>{challengeState.lives}</span>
            </div>
            <div className="flex items-center gap-2">
              <Zap className="w-5 h-5 text-yellow-500" />
              <span>{challengeState.streak}</span>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div>
              <span className="text-muted-foreground">准确率: </span>
              <span>
                {challengeState.totalCount > 0
                  ? Math.round((challengeState.correctCount / challengeState.totalCount) * 100)
                  : 0}%
              </span>
            </div>
            <div>
              <span className="text-muted-foreground">得分: </span>
              <span>{Math.round(challengeState.score)}</span>
            </div>
          </div>
        </div>
      )}

      <Card className="p-8">
        <div className="text-center space-y-6">
          <div>
            <Badge variant="outline" className="mb-4">
              音程识别
            </Badge>
            <p className="text-muted-foreground">
              识别两个音符之间的音程关系
            </p>
          </div>

          <Button
            onClick={playSound}
            size="lg"
            className="w-32 h-32 rounded-full"
            disabled={!currentInterval}
          >
            <Volume2 className="w-12 h-12" />
          </Button>

          {gameMode === 'zen' && showAnswer && currentInterval && (
            <div className="flex items-center justify-center gap-2 p-4 bg-muted rounded-lg">
              <Eye className="w-5 h-5" />
              <span>答案: {currentInterval.name}</span>
            </div>
          )}

          <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
            {availableIntervals.map((interval) => (
              <Button
                key={interval}
                variant="outline"
                onClick={() => handleAnswer(interval)}
                disabled={gameMode === 'zen' && showAnswer}
                className="h-auto py-3"
              >
                {interval}
              </Button>
            ))}
          </div>
        </div>
      </Card>
    </div>
  );
}
