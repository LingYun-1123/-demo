import React from 'react';
import { motion } from 'motion/react';
import { 
  BarChart3, 
  Clock, 
  CheckCircle2, 
  Network, 
  TrendingUp, 
  Calendar,
  ChevronRight,
  ArrowUpRight,
  Target
} from 'lucide-react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  AreaChart,
  Area
} from 'recharts';

const timeData = [
  { name: '周一', hours: 2.5 },
  { name: '周二', hours: 3.8 },
  { name: '周三', hours: 1.5 },
  { name: '周四', hours: 4.2 },
  { name: '周五', hours: 3.0 },
  { name: '周六', hours: 5.5 },
  { name: '周日', hours: 2.0 },
];

const progressData = [
  { name: '1月', score: 45 },
  { name: '2月', score: 52 },
  { name: '3月', score: 68 },
  { name: '4月', score: 75 },
  { name: '5月', score: 82 },
  { name: '6月', score: 90 },
];

export const AnalyticsPage = () => {
  return (
    <div className="flex-1 p-8 bg-slate-50 overflow-y-auto">
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Header Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            { label: '本周学习时长', value: '22.5h', icon: Clock, color: 'text-indigo-600', bg: 'bg-indigo-50', trend: '+12%' },
            { label: '已完成任务', value: '48', icon: CheckCircle2, color: 'text-emerald-600', bg: 'bg-emerald-50', trend: '+5' },
            { label: '掌握知识点', value: '124', icon: Network, color: 'text-amber-600', bg: 'bg-amber-50', trend: '+18' },
            { label: '学习效率', value: '92%', icon: TrendingUp, color: 'text-rose-600', bg: 'bg-rose-50', trend: '+3%' },
          ].map((stat, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
              className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100"
            >
              <div className="flex items-start justify-between mb-4">
                <div className={`p-3 rounded-2xl ${stat.bg} ${stat.color}`}>
                  <stat.icon className="w-6 h-6" />
                </div>
                <span className="text-xs font-bold text-emerald-500 bg-emerald-50 px-2 py-1 rounded-lg flex items-center gap-1">
                  <ArrowUpRight className="w-3 h-3" /> {stat.trend}
                </span>
              </div>
              <p className="text-sm font-bold text-slate-400 uppercase tracking-widest">{stat.label}</p>
              <h4 className="text-3xl font-black text-slate-900 mt-1">{stat.value}</h4>
            </motion.div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Weekly Time Chart */}
          <div className="lg:col-span-2 bg-white p-8 rounded-3xl shadow-sm border border-slate-100">
            <div className="flex items-center justify-between mb-8">
              <h3 className="text-xl font-bold text-slate-800 flex items-center gap-2">
                <Calendar className="w-6 h-6 text-indigo-500" /> 每周学习时长
              </h3>
              <select className="bg-slate-50 border-none rounded-xl px-4 py-2 text-xs font-bold text-slate-500 outline-none">
                <option>最近 7 天</option>
                <option>最近 30 天</option>
              </select>
            </div>
            <div className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={timeData}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis 
                    dataKey="name" 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{ fill: '#94a3b8', fontSize: 12, fontWeight: 600 }}
                    dy={10}
                  />
                  <YAxis hide />
                  <Tooltip 
                    cursor={{ fill: '#f8fafc' }}
                    contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                  />
                  <Bar 
                    dataKey="hours" 
                    fill="#6366f1" 
                    radius={[8, 8, 8, 8]} 
                    barSize={32}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Mastery Indicators */}
          <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100">
            <h3 className="text-xl font-bold text-slate-800 mb-8 flex items-center gap-2">
              <Target className="w-6 h-6 text-indigo-500" /> 知识掌握度
            </h3>
            <div className="space-y-6">
              {[
                { label: '机器学习基础', score: 95, color: 'bg-emerald-500' },
                { label: '深度学习', score: 65, color: 'bg-indigo-500' },
                { label: '数据处理', score: 82, color: 'bg-amber-500' },
                { label: '算法优化', score: 40, color: 'bg-rose-500' },
              ].map((item, idx) => (
                <div key={idx}>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-bold text-slate-700">{item.label}</span>
                    <span className="text-sm font-black text-slate-900">{item.score}%</span>
                  </div>
                  <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                    <motion.div 
                      initial={{ width: 0 }}
                      animate={{ width: `${item.score}%` }}
                      transition={{ duration: 1, delay: idx * 0.1 }}
                      className={`h-full ${item.color} rounded-full`} 
                    />
                  </div>
                </div>
              ))}
            </div>
            
            <div className="mt-10 p-6 bg-indigo-50 rounded-2xl border border-indigo-100">
              <p className="text-xs font-bold text-indigo-900 mb-2">AI 建议</p>
              <p className="text-xs text-indigo-600 leading-relaxed">
                你在“机器学习基础”方面表现优异。建议接下来重点攻克“算法优化”，这能显著提升你的整体水平。
              </p>
              <button className="mt-4 w-full py-2 bg-white text-indigo-600 rounded-xl text-xs font-bold hover:bg-indigo-100 transition-colors flex items-center justify-center gap-2">
                查看建议路径 <ChevronRight className="w-3 h-3" />
              </button>
            </div>
          </div>
        </div>

        {/* Learning Progress Dashboard */}
        <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100">
          <h3 className="text-xl font-bold text-slate-800 mb-8 flex items-center gap-2">
            <TrendingUp className="w-6 h-6 text-indigo-500" /> 学习成长曲线
          </h3>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={progressData}>
                <defs>
                  <linearGradient id="colorScore" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#6366f1" stopOpacity={0.1}/>
                    <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis 
                  dataKey="name" 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fill: '#94a3b8', fontSize: 12, fontWeight: 600 }}
                  dy={10}
                />
                <YAxis hide />
                <Tooltip 
                  contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                />
                <Area 
                  type="monotone" 
                  dataKey="score" 
                  stroke="#6366f1" 
                  strokeWidth={4}
                  fillOpacity={1} 
                  fill="url(#colorScore)" 
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};
