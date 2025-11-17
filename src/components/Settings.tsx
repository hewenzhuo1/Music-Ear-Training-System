import { useState, useEffect } from 'react';
import { Settings as SettingsIcon, Save } from 'lucide-react';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { Label } from './ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Badge } from './ui/badge';
import { getSettings, saveSettings } from '../utils/storage';
import { DIFFICULTY_PRESETS } from '../utils/musicTheory';
import { DifficultyLevel, PlayMode, TrainingSettings } from '../types';

const DIFFICULTY_INFO = {
  beginner: {
    name: '初学者',
    description: '基础音符和简单音程',
  },
  elementary: {
    name: '入门',
    description: '扩展音域和更多音程类型',
  },
  intermediate: {
    name: '进阶',
    description: '完整音程、复杂和弦和多种音阶',
  },
  advanced: {
    name: '专业',
    description: '全部内容，挑战极限',
  },
};

const PLAY_MODE_INFO = {
  harmonic: '和声播放 - 同时播放所有音符',
  ascending: '上行播放 - 从低音到高音依次播放',
  descending: '下行播放 - 从高音到低音依次播放',
};

export function Settings() {
  const [settings, setSettings] = useState<TrainingSettings>({
    noteRange: DIFFICULTY_PRESETS.beginner.noteRange,
    octaveRange: DIFFICULTY_PRESETS.beginner.octaveRange,
    playMode: 'harmonic',
    difficulty: 'beginner',
  });
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    const savedSettings = getSettings();
    if (savedSettings) {
      setSettings(savedSettings);
    }
  }, []);

  const handleDifficultyChange = (difficulty: DifficultyLevel) => {
    const preset = DIFFICULTY_PRESETS[difficulty];
    setSettings({
      ...settings,
      difficulty,
      noteRange: preset.noteRange,
      octaveRange: preset.octaveRange,
    });
  };

  const handleSave = () => {
    saveSettings(settings);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto p-6">
      <div>
        <h2>个性化设置</h2>
        <p className="text-muted-foreground">自定义您的训练参数</p>
      </div>

      {/* Difficulty Presets */}
      <Card className="p-6">
        <div className="space-y-4">
          <div>
            <h3>难度预设</h3>
            <p className="text-muted-foreground">选择适合您水平的训练难度</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {(Object.keys(DIFFICULTY_PRESETS) as DifficultyLevel[]).map((level) => (
              <button
                key={level}
                onClick={() => handleDifficultyChange(level)}
                className={`p-4 border rounded-lg text-left transition-all hover:border-primary ${
                  settings.difficulty === level ? 'border-primary bg-primary/5' : ''
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <span>{DIFFICULTY_INFO[level].name}</span>
                  {settings.difficulty === level && (
                    <Badge>当前选择</Badge>
                  )}
                </div>
                <p className="text-muted-foreground">
                  {DIFFICULTY_INFO[level].description}
                </p>
                <div className="mt-2 flex gap-2 flex-wrap">
                  <Badge variant="outline">
                    音符: {DIFFICULTY_PRESETS[level].noteRange.length}
                  </Badge>
                  <Badge variant="outline">
                    八度: {DIFFICULTY_PRESETS[level].octaveRange[0]}-{DIFFICULTY_PRESETS[level].octaveRange[1]}
                  </Badge>
                </div>
              </button>
            ))}
          </div>
        </div>
      </Card>

      {/* Play Mode */}
      <Card className="p-6">
        <div className="space-y-4">
          <div>
            <h3>播放模式</h3>
            <p className="text-muted-foreground">选择音符的播放方式（适用于音程、和弦训练）</p>
          </div>

          <div className="space-y-3">
            {(Object.keys(PLAY_MODE_INFO) as PlayMode[]).map((mode) => (
              <button
                key={mode}
                onClick={() => setSettings({ ...settings, playMode: mode })}
                className={`w-full p-4 border rounded-lg text-left transition-all hover:border-primary ${
                  settings.playMode === mode ? 'border-primary bg-primary/5' : ''
                }`}
              >
                <div className="flex items-center justify-between">
                  <span>{PLAY_MODE_INFO[mode]}</span>
                  {settings.playMode === mode && (
                    <Badge>当前选择</Badge>
                  )}
                </div>
              </button>
            ))}
          </div>
        </div>
      </Card>

      {/* Current Settings Summary */}
      <Card className="p-6">
        <div className="space-y-4">
          <div>
            <h3>当前设置概览</h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>音符范围</Label>
              <div className="flex gap-2 flex-wrap">
                {settings.noteRange.map((note) => (
                  <Badge key={note} variant="secondary">
                    {note}
                  </Badge>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <Label>八度范围</Label>
              <div className="flex gap-2">
                <Badge variant="secondary">
                  {settings.octaveRange[0]} - {settings.octaveRange[1]}
                </Badge>
              </div>
            </div>

            <div className="space-y-2">
              <Label>播放模式</Label>
              <Badge variant="secondary">
                {settings.playMode === 'harmonic' && '和声播放'}
                {settings.playMode === 'ascending' && '上行播放'}
                {settings.playMode === 'descending' && '下行播放'}
              </Badge>
            </div>

            <div className="space-y-2">
              <Label>难度等级</Label>
              <Badge variant="secondary">
                {DIFFICULTY_INFO[settings.difficulty].name}
              </Badge>
            </div>
          </div>
        </div>
      </Card>

      {/* Save Button */}
      <div className="flex justify-end gap-3">
        {saved && (
          <span className="text-green-600 flex items-center gap-2">
            <span>✓</span>
            <span>设置已保存</span>
          </span>
        )}
        <Button onClick={handleSave} className="gap-2">
          <Save className="w-4 h-4" />
          保存设置
        </Button>
      </div>
    </div>
  );
}
