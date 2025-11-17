import { useState, useEffect, useRef } from 'react';
import { Music2, BarChart3, Settings as SettingsIcon, Swords, Flower2, Lock, Sparkles } from 'lucide-react';
import { Button } from './components/ui/button';
import { Card } from './components/ui/card';
import { Badge } from './components/ui/badge';
import { NoteTraining } from './components/NoteTraining';
import { IntervalTraining } from './components/IntervalTraining';
import { ChordTraining } from './components/ChordTraining';
import { ScaleTraining } from './components/ScaleTraining';
import { Statistics } from './components/Statistics';
import { Settings } from './components/Settings';
import { FloatingNotes } from './components/FloatingNotes';
import { TrainingMode, GameMode, DifficultyLevel, TrainingSettings } from './types';
import { getUserProgress, getSettings } from './utils/storage';
import { DIFFICULTY_PRESETS } from './utils/musicTheory';
import { motion } from 'framer-motion';

type View = 'home' | 'training' | 'statistics' | 'settings';

const MODE_INFO = {
  note: {
    name: '单音识别',
    icon: '🎵',
    description: '识别单个音符的音高',
  },
  interval: {
    name: '音程识别',
    icon: '🎼',
    description: '识别两个音之间的音程关系',
  },
  chord: {
    name: '和弦识别',
    icon: '🎹',
    description: '识别各种和弦类型',
  },
  scale: {
    name: '音阶识别',
    icon: '🎶',
    description: '识别不同音阶类型',
  },
};

export default function App() {
  const [view, setView] = useState<View>('home');
  const [selectedMode, setSelectedMode] = useState<TrainingMode>('note');
  const [gameMode, setGameMode] = useState<GameMode>('challenge');
  const [difficulty, setDifficulty] = useState<DifficultyLevel>('beginner');
  const [settings, setSettings] = useState<TrainingSettings>({
    noteRange: DIFFICULTY_PRESETS.beginner.noteRange,
    octaveRange: DIFFICULTY_PRESETS.beginner.octaveRange,
    playMode: 'harmonic',
    difficulty: 'beginner',
  });
  const [userProgress, setUserProgress] = useState(getUserProgress());
  const prevViewRef = useRef<View>(view);

  useEffect(() => {
    const savedSettings = getSettings();
    if (savedSettings) {
      setSettings(savedSettings);
      setDifficulty(savedSettings.difficulty);
    }
  }, []);

  useEffect(() => {
    // Refresh user progress when returning to home
    if (view === 'home') {
      setUserProgress(getUserProgress());
    }
    // Reload settings when leaving settings page
    if (prevViewRef.current === 'settings' && view !== 'settings') {
      const savedSettings = getSettings();
      if (savedSettings) {
        setSettings(savedSettings);
        setDifficulty(savedSettings.difficulty);
      }
    }
    prevViewRef.current = view;
  }, [view]);

  const startTraining = (mode: TrainingMode, game: GameMode) => {
    setSelectedMode(mode);
    setGameMode(game);
    setView('training');
  };

  const isUnlocked = (mode: TrainingMode) => {
    return userProgress.unlockedModes.includes(mode);
  };

  const renderTraining = () => {
    const props = { gameMode, difficulty, settings };
    
    switch (selectedMode) {
      case 'note':
        return <NoteTraining {...props} />;
      case 'interval':
        return <IntervalTraining {...props} />;
      case 'chord':
        return <ChordTraining {...props} />;
      case 'scale':
        return <ScaleTraining {...props} />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 relative overflow-hidden">
      <FloatingNotes />
      
      {/* Decorative gradient orbs */}
      <div className="fixed top-0 left-0 w-96 h-96 bg-gradient-to-br from-indigo-400/20 to-purple-400/20 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2" />
      <div className="fixed bottom-0 right-0 w-96 h-96 bg-gradient-to-br from-purple-400/20 to-pink-400/20 rounded-full blur-3xl translate-x-1/2 translate-y-1/2" />
      
      {/* Header */}
      <header className="border-b backdrop-blur-sm bg-white/50 relative z-10">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <motion.button 
              onClick={() => setView('home')}
              className="flex items-center gap-3 hover:opacity-80 transition-opacity"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-lg">
                <Music2 className="w-7 h-7 text-white" />
              </div>
              <div className="text-left">
                <h1 className="bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">音感训练系统</h1>
                <p className="text-xs text-muted-foreground">Ear Training System</p>
              </div>
            </motion.button>
            <nav className="flex items-center gap-2">
              <Button
                variant={view === 'home' ? 'default' : 'ghost'}
                onClick={() => setView('home')}
                className={view === 'home' ? 'bg-gradient-to-r from-indigo-500 to-purple-600' : ''}
              >
                训练
              </Button>
              <Button
                variant={view === 'statistics' ? 'default' : 'ghost'}
                onClick={() => setView('statistics')}
                className={`gap-2 ${view === 'statistics' ? 'bg-gradient-to-r from-indigo-500 to-purple-600' : ''}`}
              >
                <BarChart3 className="w-4 h-4" />
                统计
              </Button>
              <Button
                variant={view === 'settings' ? 'default' : 'ghost'}
                onClick={() => setView('settings')}
                className={`gap-2 ${view === 'settings' ? 'bg-gradient-to-r from-indigo-500 to-purple-600' : ''}`}
              >
                <SettingsIcon className="w-4 h-4" />
                设置
              </Button>
            </nav>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8 relative z-10">
        {view === 'home' && (
          <motion.div 
            className="space-y-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            {/* Welcome Section */}
            <motion.div 
              className="text-center space-y-4"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 }}
            >
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-indigo-500/10 to-purple-500/10 border border-indigo-200">
                <Sparkles className="w-4 h-4 text-indigo-600" />
                <span className="text-sm text-indigo-700">开启您的音乐之旅</span>
              </div>
              <h2 className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">欢迎来到音感训练系统</h2>
              <p className="text-muted-foreground">
                通过科学的训练方法，提升您的音乐听觉能力
              </p>
            </motion.div>

            {/* Progress Overview */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <Card className="p-6 bg-gradient-to-br from-white to-indigo-50/30 backdrop-blur-sm border-indigo-100 shadow-xl">
                <div className="space-y-4">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-gradient-to-r from-indigo-500 to-purple-500 animate-pulse" />
                    <h3 className="bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">您的进度</h3>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <motion.div 
                      className="p-4 rounded-lg bg-gradient-to-br from-indigo-50 to-indigo-100/50 border border-indigo-200"
                      whileHover={{ scale: 1.05, rotate: 1 }}
                      transition={{ type: "spring", stiffness: 300 }}
                    >
                      <p className="text-muted-foreground">已解锁模式</p>
                      <p className="text-3xl bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">{userProgress.unlockedModes.length} / 4</p>
                    </motion.div>
                    <motion.div 
                      className="p-4 rounded-lg bg-gradient-to-br from-purple-50 to-purple-100/50 border border-purple-200"
                      whileHover={{ scale: 1.05, rotate: -1 }}
                      transition={{ type: "spring", stiffness: 300 }}
                    >
                      <p className="text-muted-foreground">已解锁难度</p>
                      <p className="text-3xl bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">{userProgress.unlockedDifficulties.length} / 4</p>
                    </motion.div>
                    <motion.div 
                      className="p-4 rounded-lg bg-gradient-to-br from-pink-50 to-pink-100/50 border border-pink-200"
                      whileHover={{ scale: 1.05, rotate: 1 }}
                      transition={{ type: "spring", stiffness: 300 }}
                    >
                      <p className="text-muted-foreground">完成挑战</p>
                      <p className="text-3xl bg-gradient-to-r from-pink-600 to-rose-600 bg-clip-text text-transparent">{userProgress.totalChallengesCompleted}</p>
                    </motion.div>
                  </div>
                </div>
              </Card>
            </motion.div>

            {/* Training Modes */}
            <div className="space-y-4">
              <h3>选择训练模式</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {(Object.keys(MODE_INFO) as TrainingMode[]).map((mode, index) => {
                  const locked = !isUnlocked(mode);
                  return (
                    <motion.div
                      key={mode}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.4 + index * 0.1 }}
                    >
                      <Card 
                        className={`p-6 transition-all duration-300 hover:shadow-2xl ${
                          locked 
                            ? 'opacity-60 bg-gray-50' 
                            : 'bg-gradient-to-br from-white to-indigo-50/20 border-indigo-100 hover:border-indigo-300'
                        }`}
                      >
                        <div className="space-y-4">
                          <div className="flex items-start justify-between">
                            <div className="flex items-center gap-3">
                              <motion.span 
                                className="text-5xl"
                                whileHover={{ scale: 1.2, rotate: 10 }}
                                transition={{ type: "spring", stiffness: 300 }}
                              >
                                {MODE_INFO[mode].icon}
                              </motion.span>
                              <div>
                                <h3 className="flex items-center gap-2">
                                  {MODE_INFO[mode].name}
                                  {locked && <Lock className="w-4 h-4 text-gray-400" />}
                                </h3>
                                <p className="text-muted-foreground">
                                  {MODE_INFO[mode].description}
                                </p>
                              </div>
                            </div>
                          </div>

                          {locked ? (
                            <div className="text-sm text-muted-foreground p-3 bg-gray-100 rounded-lg">
                              🔒 {mode === 'interval' && '完成20次单音训练解锁'}
                              {mode === 'chord' && '完成30次音程训练解锁'}
                              {mode === 'scale' && '完成40次和弦训练解锁'}
                            </div>
                          ) : (
                            <div className="flex gap-2">
                              <motion.div className="flex-1" whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                                <Button
                                  onClick={() => startTraining(mode, 'challenge')}
                                  className="w-full gap-2 bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 shadow-lg"
                                >
                                  <Swords className="w-4 h-4" />
                                  挑战模式
                                </Button>
                              </motion.div>
                              <motion.div className="flex-1" whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                                <Button
                                  onClick={() => startTraining(mode, 'zen')}
                                  variant="outline"
                                  className="w-full gap-2 border-indigo-200 hover:bg-indigo-50"
                                >
                                  <Flower2 className="w-4 h-4" />
                                  禅模式
                                </Button>
                              </motion.div>
                            </div>
                          )}
                        </div>
                      </Card>
                    </motion.div>
                  );
                })}
              </div>
            </div>

            {/* Tips */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8 }}
            >
              <Card className="p-6 bg-gradient-to-br from-indigo-50 to-purple-50 border-indigo-200 shadow-lg">
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <Sparkles className="w-5 h-5 text-indigo-600" />
                    <h3 className="text-indigo-900">训练提示</h3>
                  </div>
                  <ul className="space-y-2 text-muted-foreground">
                    <li className="flex items-start gap-2">
                      <span className="text-indigo-500">🎯</span>
                      <span>挑战模式：测试您的技能，获得评级和成就</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-purple-500">🧘</span>
                      <span>禅模式：无压力练习，可查看答案</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-pink-500">🔓</span>
                      <span>完成训练可解锁新的模式和难度</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-indigo-500">⚙️</span>
                      <span>在设置中调整训练参数以适应您的水平</span>
                    </li>
                  </ul>
                </div>
              </Card>
            </motion.div>
          </motion.div>
        )}

        {view === 'training' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <Button variant="outline" onClick={() => setView('home')}>
                  ← 返回
                </Button>
                <div>
                  <h2>{MODE_INFO[selectedMode].name}</h2>
                  <div className="flex items-center gap-2">
                    <Badge variant={gameMode === 'challenge' ? 'default' : 'secondary'}>
                      {gameMode === 'challenge' ? '挑战模式' : '禅模式'}
                    </Badge>
                    <Badge variant="outline">
                      {difficulty === 'beginner' && '初学者'}
                      {difficulty === 'elementary' && '入门'}
                      {difficulty === 'intermediate' && '进阶'}
                      {difficulty === 'advanced' && '专业'}
                    </Badge>
                  </div>
                </div>
              </div>
            </div>

            {renderTraining()}
          </div>
        )}

        {view === 'statistics' && <Statistics />}

        {view === 'settings' && <Settings />}
      </main>

      {/* Footer */}
      <footer className="border-t mt-12">
        <div className="container mx-auto px-4 py-6 text-center text-muted-foreground">
          <p>音感训练系统 - 提升您的音乐听觉能力</p>
        </div>
      </footer>
    </div>
  );
}