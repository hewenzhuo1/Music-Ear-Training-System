import * as Tone from 'tone';
import { PlayMode } from '../types';

class AudioEngine {
  private piano: Tone.Sampler | null = null;
  private initialized: boolean = false;
  private loadingPromise: Promise<void> | null = null;

  // 构建采样映射对象
  // 使用已有的采样文件，对于没有直接采样的音符，Sampler 会自动通过改变播放速度生成
  private buildSampleMap(): Record<string, string> {
    const sampleMap: Record<string, string> = {};
    
    // 已有的采样文件：C2-C7 和 F#1-F#6
    // 使用 v100 (力度100) 作为默认采样
    const cOctaves = [2, 3, 4, 5, 6, 7];
    const fSharpOctaves = [1, 2, 3, 4, 5, 6];
    
    // 添加 C 音符采样
    cOctaves.forEach(octave => {
      const note = `C${octave}`;
      sampleMap[note] = `/piano-samples/C${octave}v100.flac`;
    });
    
    // 添加 F# 音符采样
    fSharpOctaves.forEach(octave => {
      const note = `F#${octave}`;
      sampleMap[note] = `/piano-samples/F#${octave}v100.flac`;
    });
    
    return sampleMap;
  }

  async initialize() {
    if (this.initialized && this.piano) return;
    
    // 如果正在加载，等待加载完成
    if (this.loadingPromise) {
      await this.loadingPromise;
      return;
    }
    
    // 开始加载
    this.loadingPromise = (async () => {
      // 初始化 Tone.js（需要用户交互后才能启动音频上下文）
      await Tone.start();
      
      // 构建采样映射
      const urls = this.buildSampleMap();
      
      // 创建钢琴采样器
      // Sampler 会自动处理没有直接采样的音符（通过改变播放速度）
      this.piano = new Tone.Sampler({
        urls: urls,
        release: 1.5, // 释放时间（稍长一些，让音符自然衰减）
        baseUrl: '', // 采样文件的基础路径已经在 urls 中指定
        onload: () => {
          console.log('钢琴采样加载完成');
        },
        onerror: (error) => {
          console.error('钢琴采样加载失败:', error);
          // 如果 FLAC 不支持，可以尝试转换为 WAV 或 MP3
          console.warn('提示：如果浏览器不支持 FLAC 格式，请将采样文件转换为 WAV 或 MP3 格式');
        },
      }).toDestination();

      this.piano.volume.value = -3; // 调整音量
      this.initialized = true;
    })();
    
    await this.loadingPromise;
  }

  // 将音符名称转换为 Tone.js 格式 (例如: "C", 4 -> "C4")
  private formatNote(note: string, octave: number): string {
    return `${note}${octave}`;
  }

  // Play a single note
  async playNote(note: string, octave: number, duration: number = 1.0) {
    await this.initialize();
    if (!this.piano) return;

    const noteName = this.formatNote(note, octave);
    this.piano.triggerAttackRelease(noteName, duration);
  }

  // Play multiple notes (chord or interval)
  async playNotes(notes: { note: string; octave: number }[], mode: PlayMode, duration: number = 1.0) {
    await this.initialize();
    if (!this.piano) return;

    if (mode === 'harmonic') {
      // 同时播放所有音符（和弦）
      const noteNames = notes.map(({ note, octave }) => this.formatNote(note, octave));
      this.piano.triggerAttackRelease(noteNames, duration);
    } else if (mode === 'ascending') {
      // 依次播放音符（上行）
      notes.forEach(({ note, octave }, index) => {
        const noteName = this.formatNote(note, octave);
        setTimeout(() => {
          if (this.piano) {
            this.piano.triggerAttackRelease(noteName, duration * 0.6);
          }
        }, index * 400);
      });
    } else if (mode === 'descending') {
      // 依次播放音符（下行）
      [...notes].reverse().forEach(({ note, octave }, index) => {
        const noteName = this.formatNote(note, octave);
        setTimeout(() => {
          if (this.piano) {
            this.piano.triggerAttackRelease(noteName, duration * 0.6);
          }
        }, index * 400);
      });
    }
  }

  // Play a scale
  async playScale(notes: { note: string; octave: number }[], ascending: boolean = true) {
    await this.initialize();
    if (!this.piano) return;
    
    const notesToPlay = ascending ? notes : [...notes].reverse();
    
    notesToPlay.forEach(({ note, octave }, index) => {
      const noteName = this.formatNote(note, octave);
      setTimeout(() => {
        if (this.piano) {
          this.piano.triggerAttackRelease(noteName, 0.5);
        }
      }, index * 300);
    });
  }

  // Stop all sounds
  stop() {
    if (this.piano) {
      this.piano.releaseAll();
    }
  }

  // 清理资源
  dispose() {
    if (this.piano) {
      this.piano.dispose();
      this.piano = null;
    }
    this.initialized = false;
    this.loadingPromise = null;
  }
}

export const audioEngine = new AudioEngine();
