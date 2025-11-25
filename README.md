# 🎵 Music Ear Training System

一个现代化的音乐听力训练系统，帮助你提升音感识别能力。通过游戏化的训练方式，逐步掌握单音、音程、和弦和音阶的识别技巧。

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![React](https://img.shields.io/badge/React-18.3.1-61DAFB?logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0+-3178C6?logo=typescript)
![Vite](https://img.shields.io/badge/Vite-6.3.5-646CFF?logo=vite)

## ✨ 功能特性

### 🎯 四种训练模式

- **🎵 单音识别** - 训练识别单个音符的音高
- **🎼 音程识别** - 学习识别两个音之间的音程关系
- **🎹 和弦识别** - 掌握各种和弦类型的识别
- **🎶 音阶识别** - 熟悉不同音阶类型的特征

### 🎮 两种游戏模式

- **⚔️ 挑战模式 (Challenge)** - 限时挑战，有生命值系统，答错会扣血
- **🧘 禅模式 (Zen)** - 无压力练习模式，可以慢慢学习和探索

### 📊 进度追踪

- 实时统计训练数据
- 连击记录和最高分
- 成就解锁系统
- 可视化数据图表

### ⚙️ 个性化设置

- 可调节难度等级（初级/中级/高级）
- 自定义音符范围
- 选择八度范围
- 播放模式设置（和声/上行/下行）
- 深色/浅色主题支持

### 🎨 现代化 UI

- 精美的渐变背景和动画效果
- 流畅的交互动画（Framer Motion）
- 响应式设计，适配各种屏幕
- 基于 Radix UI 的组件库

## 🚀 快速开始

### 环境要求

- Node.js 18+ 
- npm 或 yarn

### 安装步骤

1. **克隆仓库**
```bash
git clone <repository-url>
cd Music-Ear-Training-System
```

2. **安装依赖**
```bash
npm install
```

3. **启动开发服务器**
```bash
npm run dev
```

4. **构建生产版本**
```bash
npm run build
```

访问 `http://localhost:5173` 开始使用！

## 📁 项目结构

```
Music-Ear-Training-System/
├── public/
│   └── piano-samples/      # 钢琴音频样本
├── src/
│   ├── components/          # React 组件
│   │   ├── NoteTraining.tsx      # 单音训练
│   │   ├── IntervalTraining.tsx  # 音程训练
│   │   ├── ChordTraining.tsx     # 和弦训练
│   │   ├── ScaleTraining.tsx     # 音阶训练
│   │   ├── Statistics.tsx        # 统计页面
│   │   ├── Settings.tsx          # 设置页面
│   │   └── ui/                   # UI 组件库
│   ├── utils/
│   │   ├── audioEngine.ts        # 音频引擎
│   │   ├── musicTheory.ts        # 音乐理论工具
│   │   └── storage.ts            # 本地存储
│   ├── types/
│   │   └── index.ts              # TypeScript 类型定义
│   ├── App.tsx                   # 主应用组件
│   └── main.tsx                  # 入口文件
├── package.json
└── vite.config.ts
```

## 🎓 使用指南

### 开始训练

1. 在主页面选择一种训练模式
2. 选择游戏模式（挑战模式或禅模式）
3. 点击"开始训练"按钮
4. 点击播放按钮聆听音频
5. 从选项中选择正确答案
6. 查看反馈并继续下一题

### 挑战模式规则

- 初始生命值：3 颗心 ❤️
- 答对：获得分数，增加连击
- 答错：扣除 1 颗心
- 生命值归零：游戏结束
- 可以查看最高连击和总分

### 解锁系统

- 完成特定训练模式可解锁新功能
- 达到一定分数可解锁新难度
- 查看统计页面了解解锁进度

## 🛠️ 技术栈

- **前端框架**: React 18.3.1
- **构建工具**: Vite 6.3.5
- **语言**: TypeScript
- **UI 组件**: Radix UI + shadcn/ui
- **动画**: Framer Motion
- **样式**: Tailwind CSS
- **图表**: Recharts
- **表单**: React Hook Form
- **图标**: Lucide React

## 📝 开发说明

### 添加新的训练模式

1. 在 `src/types/index.ts` 中添加新的 `TrainingMode` 类型
2. 创建对应的训练组件（如 `NewTraining.tsx`）
3. 在 `src/App.tsx` 中注册新组件
4. 更新 `MODE_INFO` 配置

### 自定义音频样本

将新的音频文件（FLAC 格式）放入 `public/piano-samples/` 目录，命名格式：`{Note}{Octave}v{Velocity}.flac`

例如：`C4v80.flac` 表示 C4 音符，力度 80



## 📄 许可证

MIT License

## 🤝 贡献

欢迎提交 Issue 和 Pull Request！

## 📧 联系方式

如有问题或建议，请通过 Issue 反馈。

---

**享受音乐，提升音感！** 🎶
