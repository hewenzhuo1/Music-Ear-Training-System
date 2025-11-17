import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { TrendingUp, Target, Award } from 'lucide-react';
import { Card } from './ui/card';
import { Badge } from './ui/badge';
import { getAccuracyTrend, getWeakPoints, getModeStats, getResults } from '../utils/storage';

const MODE_NAMES = {
  note: '单音识别',
  interval: '音程识别',
  chord: '和弦识别',
  scale: '音阶识别',
};

export function Statistics() {
  const accuracyTrend = getAccuracyTrend();
  const weakPoints = getWeakPoints();
  const modeStats = getModeStats();
  const totalResults = getResults().length;

  return (
    <div className="space-y-6 max-w-6xl mx-auto p-6">
      <div>
        <h2>数据统计</h2>
        <p className="text-muted-foreground">查看您的训练进度和表现</p>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="p-6">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-blue-500/10 flex items-center justify-center">
              <Award className="w-6 h-6 text-blue-500" />
            </div>
            <div>
              <p className="text-muted-foreground">总训练次数</p>
              <p className="text-2xl">{totalResults}</p>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-green-500/10 flex items-center justify-center">
              <Target className="w-6 h-6 text-green-500" />
            </div>
            <div>
              <p className="text-muted-foreground">7日平均正确率</p>
              <p className="text-2xl">
                {accuracyTrend.length > 0
                  ? Math.round(accuracyTrend.reduce((sum, d) => sum + d.accuracy, 0) / accuracyTrend.length)
                  : 0}%
              </p>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-purple-500/10 flex items-center justify-center">
              <TrendingUp className="w-6 h-6 text-purple-500" />
            </div>
            <div>
              <p className="text-muted-foreground">今日训练次数</p>
              <p className="text-2xl">
                {accuracyTrend.length > 0 ? Math.round(totalResults / 7) : 0}
              </p>
            </div>
          </div>
        </Card>
      </div>

      {/* Accuracy Trend Chart */}
      <Card className="p-6">
        <div className="space-y-4">
          <div>
            <h3>正确率趋势（最近7天）</h3>
            <p className="text-muted-foreground">追踪您的进步情况</p>
          </div>
          {accuracyTrend.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={accuracyTrend}>
                <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                <XAxis dataKey="date" className="text-muted-foreground" />
                <YAxis domain={[0, 100]} className="text-muted-foreground" />
                <Tooltip 
                  contentStyle={{ backgroundColor: 'hsl(var(--card))', border: '1px solid hsl(var(--border))' }}
                  formatter={(value: number) => [`${value}%`, '正确率']}
                />
                <Line 
                  type="monotone" 
                  dataKey="accuracy" 
                  stroke="hsl(var(--primary))" 
                  strokeWidth={2}
                  dot={{ fill: 'hsl(var(--primary))' }}
                />
              </LineChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-[300px] flex items-center justify-center text-muted-foreground">
              暂无数据，开始训练以查看趋势
            </div>
          )}
        </div>
      </Card>

      {/* Mode Statistics */}
      <Card className="p-6">
        <div className="space-y-4">
          <div>
            <h3>各模式训练统计</h3>
            <p className="text-muted-foreground">不同训练模式的表现</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {modeStats.map((stat) => (
              <div key={stat.mode} className="p-4 border rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <span>{MODE_NAMES[stat.mode]}</span>
                  <Badge variant={stat.accuracy >= 70 ? 'default' : 'secondary'}>
                    {stat.accuracy}%
                  </Badge>
                </div>
                <div className="flex items-center justify-between text-muted-foreground">
                  <span>总数: {stat.total}</span>
                  <span>正确: {stat.correct}</span>
                </div>
                <div className="mt-2 h-2 bg-muted rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-primary rounded-full transition-all"
                    style={{ width: `${stat.accuracy}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </Card>

      {/* Weak Points */}
      {weakPoints.length > 0 && (
        <Card className="p-6">
          <div className="space-y-4">
            <div>
              <h3>薄弱点分析</h3>
              <p className="text-muted-foreground">需要加强训练的项目</p>
            </div>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={weakPoints}>
                <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                <XAxis dataKey="item" className="text-muted-foreground" />
                <YAxis domain={[0, 100]} className="text-muted-foreground" />
                <Tooltip 
                  contentStyle={{ backgroundColor: 'hsl(var(--card))', border: '1px solid hsl(var(--border))' }}
                  formatter={(value: number) => [`${value}%`, '正确率']}
                />
                <Bar dataKey="accuracy" radius={[8, 8, 0, 0]}>
                  {weakPoints.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill="hsl(var(--destructive))" />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>
      )}
    </div>
  );
}
