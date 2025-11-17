import { useState, useEffect } from 'react';
import { Volume2, Heart, Trophy, Zap, Eye, EyeOff } from 'lucide-react';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { Badge } from './ui/badge';
import { audioEngine } from '../utils/audioEngine';
import { NOTES, getRandomItem, DIFFICULTY_PRESETS } from '../utils/musicTheory';
import { saveResult, getUserProgress, saveUserProgress, checkUnlocks } from '../utils/storage';
import { GameMode, DifficultyLevel, ChallengeState, TrainingSettings } from '../types';
import { motion } from 'framer-motion';

interface Props {
  gameMode: GameMode;
  difficulty: DifficultyLevel;
  settings: TrainingSettings;
}

export function NoteTraining({ gameMode, difficulty, settings }: Props) {
  const [currentNote, setCurrentNote] = useState<{ note: string; octave: number } | null>(null);
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
    const note = getRandomItem(settings.noteRange);
    const octave = settings.octaveRange[0] + 
      Math.floor(Math.random() * (settings.octaveRange[1] - settings.octaveRange[0] + 1));
    
    setCurrentNote({ note, octave });
    setShowAnswer(false);
  };

  const playSound = () => {
    if (currentNote) {
      audioEngine.playNote(currentNote.note, currentNote.octave, 1.0);
    }
  };

  const handleAnswer = (selectedNote: string) => {
    if (!currentNote || gameOver) return;

    const isCorrect = selectedNote === currentNote.note;
    
    // Save result
    saveResult({
      mode: 'note',
      gameMode,
      correct: isCorrect,
      answer: currentNote.note,
      userAnswer: selectedNote,
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
        newState.score += 10 * (1 + newState.streak * 0.1);
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
      // Zen mode - just show the answer
      setShowAnswer(true);
      setTimeout(() => {
        generateNewQuestion();
      }, 2000);
    }
    
    // Check for unlocks
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
    
    // Update progress
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
    const getRatingColor = (rating: string) => {
      switch(rating) {
        case 'S': return 'from-yellow-400 to-orange-500';
        case 'A': return 'from-green-400 to-emerald-500';
        case 'B': return 'from-blue-400 to-cyan-500';
        case 'C': return 'from-purple-400 to-pink-500';
        case 'D': return 'from-gray-400 to-gray-500';
        default: return 'from-red-400 to-red-600';
      }
    };

    return (
      <motion.div 
        className="flex items-center justify-center min-h-[500px]"
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ type: "spring", duration: 0.6 }}
      >
        <Card className="p-10 max-w-md w-full text-center space-y-6 bg-gradient-to-br from-white to-indigo-50/30 border-indigo-100 shadow-2xl">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1, rotate: [0, 360] }}
            transition={{ delay: 0.2, duration: 0.6, ease: "backOut" }}
          >
            <div className={`w-20 h-20 mx-auto rounded-full bg-gradient-to-br ${getRatingColor(rating)} flex items-center justify-center shadow-lg`}>
              <Trophy className="w-12 h-12 text-white" />
            </div>
          </motion.div>
          
          <motion.div 
            className="space-y-2"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <p className="text-muted-foreground">评级</p>
            <motion.p 
              className={`text-8xl bg-gradient-to-r ${getRatingColor(rating)} bg-clip-text text-transparent`}
              animate={{ scale: [1, 1.1, 1] }}
              transition={{ delay: 0.5, duration: 0.5 }}
            >
              {rating}
            </motion.p>
          </motion.div>
          
          <motion.div 
            className="grid grid-cols-2 gap-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
          >
            <div className="p-4 rounded-lg bg-gradient-to-br from-indigo-50 to-indigo-100/50 border border-indigo-200">
              <p className="text-muted-foreground">正确率</p>
              <p className="text-3xl bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                {Math.round((challengeState.correctCount / challengeState.totalCount) * 100)}%
              </p>
            </div>
            <div className="p-4 rounded-lg bg-gradient-to-br from-purple-50 to-purple-100/50 border border-purple-200">
              <p className="text-muted-foreground">得分</p>
              <p className="text-3xl bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                {Math.round(challengeState.score)}
              </p>
            </div>
            <div className="p-4 rounded-lg bg-gradient-to-br from-pink-50 to-pink-100/50 border border-pink-200">
              <p className="text-muted-foreground">最高连击</p>
              <p className="text-3xl bg-gradient-to-r from-pink-600 to-rose-600 bg-clip-text text-transparent">
                {challengeState.maxStreak}
              </p>
            </div>
            <div className="p-4 rounded-lg bg-gradient-to-br from-blue-50 to-blue-100/50 border border-blue-200">
              <p className="text-muted-foreground">总答题数</p>
              <p className="text-3xl bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">
                {challengeState.totalCount}
              </p>
            </div>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <Button 
              onClick={restartChallenge} 
              className="w-full bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 shadow-lg"
            >
              再来一次
            </Button>
          </motion.div>
        </Card>
      </motion.div>
    );
  }

  return (
    <div className="space-y-6 max-w-2xl mx-auto">
      {gameMode === 'challenge' && (
        <motion.div 
          className="flex items-center justify-between p-4 rounded-xl bg-gradient-to-r from-white to-indigo-50/50 backdrop-blur-sm border border-indigo-100 shadow-lg"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="flex items-center gap-6">
            <motion.div 
              className="flex items-center gap-2"
              animate={challengeState.lives <= 1 ? { scale: [1, 1.1, 1] } : {}}
              transition={{ repeat: challengeState.lives <= 1 ? Infinity : 0, duration: 1 }}
            >
              <Heart className={`w-6 h-6 ${challengeState.lives <= 1 ? 'text-red-600' : 'text-red-500'}`} fill="currentColor" />
              <span className="text-xl">{challengeState.lives}</span>
            </motion.div>
            <motion.div 
              className="flex items-center gap-2"
              animate={challengeState.streak > 0 ? { scale: [1, 1.05, 1] } : {}}
              transition={{ duration: 0.3 }}
            >
              <Zap className="w-6 h-6 text-amber-500" fill="currentColor" />
              <span className="text-xl">{challengeState.streak}</span>
            </motion.div>
          </div>
          <div className="flex items-center gap-6">
            <div className="text-right">
              <p className="text-xs text-muted-foreground">准确率</p>
              <p className="text-xl bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                {challengeState.totalCount > 0
                  ? Math.round((challengeState.correctCount / challengeState.totalCount) * 100)
                  : 0}%
              </p>
            </div>
            <div className="text-right">
              <p className="text-xs text-muted-foreground">得分</p>
              <p className="text-xl bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                {Math.round(challengeState.score)}
              </p>
            </div>
          </div>
        </motion.div>
      )}

      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.1 }}
      >
        <Card className="p-12 bg-gradient-to-br from-white to-indigo-50/30 backdrop-blur-sm border-indigo-100 shadow-2xl">
          <div className="text-center space-y-8">
            <div className="space-y-2">
              <Badge variant="outline" className="mb-4 border-indigo-300 text-indigo-700">
                🎵 单音识别
              </Badge>
              <p className="text-muted-foreground">
                {gameMode === 'zen' ? '聆听音符，识别音高' : '识别播放的音符'}
              </p>
            </div>

            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Button
                onClick={playSound}
                size="lg"
                className="w-40 h-40 rounded-full bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 hover:from-indigo-600 hover:via-purple-600 hover:to-pink-600 shadow-2xl border-4 border-white"
                disabled={!currentNote}
              >
                <Volume2 className="w-16 h-16 text-white" />
              </Button>
            </motion.div>

            {gameMode === 'zen' && showAnswer && currentNote && (
              <motion.div 
                className="flex items-center justify-center gap-3 p-4 bg-gradient-to-r from-indigo-100 to-purple-100 rounded-xl border border-indigo-200"
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <Eye className="w-5 h-5 text-indigo-600" />
                <span className="text-indigo-900">答案: <strong>{currentNote.note}</strong></span>
              </motion.div>
            )}

            <div className="grid grid-cols-4 gap-3">
              {DIFFICULTY_PRESETS[difficulty].noteRange.map((note, index) => (
                <motion.div
                  key={note}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 + index * 0.03 }}
                >
                  <Button
                    variant="outline"
                    onClick={() => handleAnswer(note)}
                    disabled={gameMode === 'zen' && showAnswer}
                    className="w-full h-14 border-2 border-indigo-200 hover:border-indigo-400 hover:bg-indigo-50 hover:scale-105 transition-all"
                  >
                    <span className="text-lg">{note}</span>
                  </Button>
                </motion.div>
              ))}
            </div>
          </div>
        </Card>
      </motion.div>
    </div>
  );
}