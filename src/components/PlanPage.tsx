import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Target, 
  Sparkles, 
  Clock, 
  BookOpen, 
  Lightbulb, 
  HelpCircle, 
  Play, 
  MessageSquare, 
  CheckCircle2,
  Loader2,
  ChevronRight,
  Info,
  TrendingUp,
  Brain,
  Zap,
  Calendar,
  CheckCircle,
  Circle,
  Send,
  Network,
  AlertCircle
} from 'lucide-react';
import { GoogleGenAI, Type } from "@google/genai";
import ReactMarkdown from 'react-markdown';
import { LearningPlan, RoadmapStage, DailyTask, Concept } from '../types';

// Simplified MindMap for Right Panel
const MiniMindMap = ({ concepts }: { concepts: Concept[] }) => {
  return (
    <div className="h-48 bg-slate-50 rounded-2xl border border-slate-100 relative overflow-hidden flex items-center justify-center">
      {concepts.length === 0 ? (
        <div className="text-slate-400 text-xs flex flex-col items-center gap-2">
          <Network className="w-8 h-8 opacity-20" />
          <span>暂无知识图谱数据</span>
        </div>
      ) : (
        <div className="relative w-full h-full p-4">
          {concepts.map((concept, i) => (
            <motion.div
              key={concept.id}
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="absolute bg-white px-3 py-1.5 rounded-full border border-indigo-100 shadow-sm text-[10px] font-medium text-indigo-600 whitespace-nowrap"
              style={{
                left: `${20 + (i % 3) * 30}%`,
                top: `${20 + Math.floor(i / 3) * 30}%`,
              }}
            >
              {concept.name}
            </motion.div>
          ))}
          {/* Simple SVG lines to simulate connections */}
          <svg className="absolute inset-0 w-full h-full pointer-events-none opacity-20">
            <line x1="30%" y1="30%" x2="60%" y2="30%" stroke="#6366F1" strokeWidth="1" />
            <line x1="30%" y1="30%" x2="30%" y2="60%" stroke="#6366F1" strokeWidth="1" />
          </svg>
        </div>
      )}
    </div>
  );
};

export const PlanPage = () => {
  const [goal, setGoal] = useState('');
  const [loading, setLoading] = useState(false);
  const [plan, setPlan] = useState<LearningPlan | null>(null);
  const [selectedStageId, setSelectedStageId] = useState<string | null>(null);
  const [chatInput, setChatInput] = useState('');
  const [chatMessages, setChatMessages] = useState<{ role: 'user' | 'ai', text: string }[]>([]);
  const [concepts, setConcepts] = useState<Concept[]>([]);
  const [streak, setStreak] = useState(3);
  const [isChatLoading, setIsChatLoading] = useState(false);

  const selectedStage = plan?.stages.find(s => s.id === selectedStageId);

  const generatePlan = async () => {
    if (!goal.trim()) return;
    setLoading(true);
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY! });
      const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: `请为学习目标 "${goal}" 生成一个结构化的学习计划。
        返回 JSON 格式，包含:
        - goal (string)
        - duration (string, e.g. "3 Months")
        - difficulty (string: "Beginner", "Intermediate", "Advanced")
        - weeklyHours (number)
        - stages (array of objects: { id, title, skills (array), duration, progress (0), tasks (array of { id, title, completed (false), status ("pending") }) })
        
        生成 4 个阶段，每个阶段 3-5 个任务。`,
        config: {
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              goal: { type: Type.STRING },
              duration: { type: Type.STRING },
              difficulty: { type: Type.STRING },
              weeklyHours: { type: Type.NUMBER },
              stages: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: {
                    id: { type: Type.STRING },
                    title: { type: Type.STRING },
                    skills: { type: Type.ARRAY, items: { type: Type.STRING } },
                    duration: { type: Type.STRING },
                    progress: { type: Type.NUMBER },
                    tasks: {
                      type: Type.ARRAY,
                      items: {
                        type: Type.OBJECT,
                        properties: {
                          id: { type: Type.STRING },
                          title: { type: Type.STRING },
                          completed: { type: Type.BOOLEAN },
                          status: { type: Type.STRING }
                        }
                      }
                    }
                  }
                }
              }
            }
          }
        }
      });

      const data = JSON.parse(response.text) as LearningPlan;
      setPlan(data);
      setGoal(data.goal);
      setSelectedStageId(data.stages[0]?.id || null);
      
      // Initial AI greeting
      setChatMessages([{ role: 'ai', text: `你好！我已经为你生成了 "${data.goal}" 的学习计划。这个计划预计需要 ${data.duration}，难度为 ${data.difficulty}。我们可以从第一个阶段 "${data.stages[0]?.title}" 开始。有什么我可以帮你的吗？` }]);
    } catch (error) {
      console.error('Generate Plan Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const toggleTask = (stageId: string, taskId: string) => {
    if (!plan) return;
    const newPlan = { ...plan };
    const stage = newPlan.stages.find(s => s.id === stageId);
    if (stage) {
      const task = stage.tasks.find(t => t.id === taskId);
      if (task) {
        task.completed = !task.completed;
        task.status = task.completed ? 'completed' : 'pending';
        
        // Update stage progress
        const completedCount = stage.tasks.filter(t => t.completed).length;
        stage.progress = Math.round((completedCount / stage.tasks.length) * 100);
        
        // Extract knowledge points if completed
        if (task.completed) {
          extractKnowledge(task.title);
        }
      }
    }
    setPlan(newPlan);
  };

  const extractKnowledge = async (taskTitle: string) => {
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY! });
      const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: `从学习任务 "${taskTitle}" 中提取 2-3 个核心知识点。
        返回 JSON 格式的数组，每个对象包含 id, name, description, relatedIds (empty array)。`,
        config: {
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                id: { type: Type.STRING },
                name: { type: Type.STRING },
                description: { type: Type.STRING },
                relatedIds: { type: Type.ARRAY, items: { type: Type.STRING } }
              }
            }
          }
        }
      });
      const newConcepts = JSON.parse(response.text) as Concept[];
      setConcepts(prev => [...prev, ...newConcepts].slice(-10)); // Keep last 10
    } catch (e) {
      console.error(e);
    }
  };

  const askAI = async () => {
    if (!chatInput.trim()) return;
    const userMsg = chatInput;
    setChatMessages(prev => [...prev, { role: 'user', text: userMsg }]);
    setChatInput('');
    setIsChatLoading(true);

    try {
      const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY! });
      const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: `作为学习助手，回答关于 "${selectedStage?.title}" 中 "${userMsg}" 的问题。简洁明了。`,
      });
      setChatMessages(prev => [...prev, { role: 'ai', text: response.text }]);
    } catch (error) {
      console.error(error);
    } finally {
      setIsChatLoading(false);
    }
  };

  return (
    <div className="flex-1 flex h-full bg-slate-50 overflow-hidden">
      {/* Center Workspace (Column 2) */}
      <div className="flex-1 flex flex-col min-w-0 overflow-y-auto custom-scrollbar">
        <div className="p-8 max-w-5xl mx-auto w-full space-y-8">
          
          {/* 1. Learning Goal Section */}
          <section className="bg-white rounded-3xl p-8 shadow-sm border border-slate-100 relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition-opacity">
              <Target className="w-32 h-32 text-indigo-600" />
            </div>
            
            <div className="relative z-10">
              <div className="flex items-center gap-2 text-indigo-600 mb-4">
                <Sparkles className="w-5 h-5" />
                <span className="text-xs font-bold uppercase tracking-widest">当前学习目标</span>
              </div>
              
              <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                <div className="space-y-4 flex-1">
                  <input
                    type="text"
                    value={goal}
                    onChange={(e) => setGoal(e.target.value)}
                    placeholder="输入你的学习目标，例如：3个月学会 Python 数据分析"
                    className="w-full text-3xl font-black text-slate-900 leading-tight bg-transparent border-b-2 border-slate-100 focus:border-indigo-500 outline-none transition-all pb-2 placeholder:text-slate-200"
                  />
                  <div className="flex flex-wrap gap-4 pt-2">
                    <div className="flex items-center gap-2 text-slate-500 text-sm bg-slate-50 px-3 py-1.5 rounded-xl">
                      <Calendar className="w-4 h-4 text-indigo-500" />
                      <span>预计时长: {plan?.duration || "--"}</span>
                    </div>
                    <div className="flex items-center gap-2 text-slate-500 text-sm bg-slate-50 px-3 py-1.5 rounded-xl">
                      <TrendingUp className="w-4 h-4 text-emerald-500" />
                      <span>难度: {plan?.difficulty || "--"}</span>
                    </div>
                    <div className="flex items-center gap-2 text-slate-500 text-sm bg-slate-50 px-3 py-1.5 rounded-xl">
                      <Clock className="w-4 h-4 text-amber-500" />
                      <span>每周投入: {plan?.weeklyHours || 0} 小时</span>
                    </div>
                  </div>
                </div>
                
                <button 
                  onClick={generatePlan}
                  disabled={loading}
                  className="bg-indigo-600 hover:bg-indigo-700 text-white px-8 py-4 rounded-2xl font-bold text-sm shadow-xl shadow-indigo-100 transition-all flex items-center gap-2 disabled:opacity-50 flex-shrink-0"
                >
                  {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Zap className="w-4 h-4 fill-current" />}
                  {plan ? "重新生成计划" : "生成学习计划"}
                </button>
              </div>
            </div>
          </section>

          {/* 2. Learning Roadmap Visualization */}
          <section className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
                <Network className="w-5 h-5 text-indigo-500" />
                学习路线图
              </h2>
              <div className="text-xs font-medium text-slate-400">点击阶段查看每日任务</div>
            </div>

            <div className="relative">
              {/* Roadmap Line */}
              <div className="absolute top-1/2 left-0 w-full h-1 bg-slate-100 -translate-y-1/2 z-0" />
              
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6 relative z-10">
                {plan?.stages.map((stage, idx) => (
                  <motion.div
                    key={stage.id}
                    whileHover={{ y: -5 }}
                    onClick={() => setSelectedStageId(stage.id)}
                    className={`cursor-pointer group relative ${selectedStageId === stage.id ? 'scale-105' : 'opacity-80 hover:opacity-100'}`}
                  >
                    <div className={`bg-white rounded-2xl p-5 border-2 transition-all shadow-sm ${selectedStageId === stage.id ? 'border-indigo-500 shadow-indigo-100' : 'border-transparent hover:border-slate-200'}`}>
                      <div className="flex items-center justify-between mb-3">
                        <span className="text-[10px] font-black text-slate-300 uppercase tracking-widest">Stage {idx + 1}</span>
                        {stage.progress === 100 && <CheckCircle className="w-4 h-4 text-emerald-500" />}
                      </div>
                      <h3 className="font-bold text-slate-800 mb-2 line-clamp-1">{stage.title}</h3>
                      <div className="flex flex-wrap gap-1 mb-4">
                        {stage.skills.slice(0, 2).map(skill => (
                          <span key={skill} className="text-[9px] bg-slate-50 text-slate-500 px-1.5 py-0.5 rounded-md">{skill}</span>
                        ))}
                      </div>
                      <div className="space-y-2">
                        <div className="flex items-center justify-between text-[10px] font-bold">
                          <span className="text-slate-400">{stage.duration}</span>
                          <span className="text-indigo-600">{stage.progress}%</span>
                        </div>
                        <div className="h-1.5 bg-slate-50 rounded-full overflow-hidden">
                          <motion.div 
                            initial={{ width: 0 }}
                            animate={{ width: `${stage.progress}%` }}
                            className="h-full bg-indigo-500" 
                          />
                        </div>
                      </div>
                    </div>
                    {/* Connector Dot */}
                    <div className={`absolute -bottom-3 left-1/2 -translate-x-1/2 w-3 h-3 rounded-full border-2 border-white shadow-sm z-20 transition-colors ${selectedStageId === stage.id ? 'bg-indigo-500' : 'bg-slate-200'}`} />
                  </motion.div>
                ))}
                
                {!plan && [1,2,3,4].map(i => (
                  <div key={i} className="bg-slate-100/50 rounded-2xl h-40 border border-dashed border-slate-200 animate-pulse" />
                ))}
              </div>
            </div>
          </section>

          {/* 3. Daily Learning Plan */}
          <AnimatePresence mode="wait">
            {selectedStage && (
              <motion.section
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 20 }}
                className="bg-white rounded-3xl p-8 shadow-sm border border-slate-100 space-y-6"
              >
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <h2 className="text-xl font-bold text-slate-800">{selectedStage.title} - 每日任务</h2>
                    <p className="text-sm text-slate-500">完成今日学习，保持你的学习连击！</p>
                  </div>
                  <div className="bg-indigo-50 px-4 py-2 rounded-2xl flex items-center gap-3">
                    <div className="text-right">
                      <div className="text-[10px] font-bold text-indigo-400 uppercase tracking-widest">当前进度</div>
                      <div className="text-sm font-black text-indigo-600">{selectedStage.tasks.filter(t => t.completed).length} / {selectedStage.tasks.length} 天</div>
                    </div>
                    <div className="w-10 h-10 rounded-full border-4 border-indigo-100 border-t-indigo-500 flex items-center justify-center">
                      <span className="text-[10px] font-bold text-indigo-600">{selectedStage.progress}%</span>
                    </div>
                  </div>
                </div>

                <div className="space-y-3">
                  {selectedStage.tasks.map((task, idx) => (
                    <div 
                      key={task.id}
                      className={`group flex items-center justify-between p-4 rounded-2xl border transition-all ${task.completed ? 'bg-slate-50 border-transparent' : 'bg-white border-slate-100 hover:border-indigo-200 shadow-sm'}`}
                    >
                      <div className="flex items-center gap-4">
                        <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold text-sm ${task.completed ? 'bg-emerald-100 text-emerald-600' : 'bg-slate-100 text-slate-400'}`}>
                          {idx + 1}
                        </div>
                        <div>
                          <h4 className={`font-bold text-sm ${task.completed ? 'text-slate-400 line-through' : 'text-slate-800'}`}>
                            {task.title}
                          </h4>
                          {task.completed && (
                            <span className="text-[10px] font-bold text-emerald-500 flex items-center gap-1 mt-0.5">
                              <CheckCircle2 className="w-3 h-3" /> 已完成
                            </span>
                          )}
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-3">
                        {!task.completed && (
                          <button className="px-4 py-2 text-xs font-bold text-indigo-600 hover:bg-indigo-50 rounded-xl transition-colors">
                            开始学习
                          </button>
                        )}
                        <button 
                          onClick={() => toggleTask(selectedStage.id, task.id)}
                          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${task.completed ? 'bg-white text-slate-400 border border-slate-200' : 'bg-indigo-600 text-white shadow-lg shadow-indigo-100'}`}
                        >
                          {task.completed ? "取消标记" : "标记完成"}
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </motion.section>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Right Panel: AI Learning Assistant (Column 3) */}
      <aside className="w-[400px] bg-white border-l border-slate-100 flex flex-col shadow-2xl z-30">
        {/* Header */}
        <div className="p-6 border-b border-slate-50 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-indigo-600 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-indigo-100">
              <Brain className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-bold text-slate-900">AI 学习助手</h3>
              <div className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" />
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">在线指导中</span>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2 bg-amber-50 px-3 py-1.5 rounded-full border border-amber-100">
            <Zap className="w-3 h-3 text-amber-500 fill-current" />
            <span className="text-[10px] font-bold text-amber-700">{streak} 天连击</span>
          </div>
        </div>

        {/* Tabs / Sections */}
        <div className="flex-1 overflow-y-auto custom-scrollbar p-6 space-y-8">
          
          {/* AI Chat Section */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest">智能问答</h4>
              <button className="text-[10px] font-bold text-indigo-600 hover:underline">清空对话</button>
            </div>
            
            <div className="bg-slate-50 rounded-2xl p-4 min-h-[200px] max-h-[300px] overflow-y-auto flex flex-col gap-4 text-sm">
              {chatMessages.length === 0 ? (
                <div className="flex-1 flex flex-col items-center justify-center text-slate-400 text-center space-y-2">
                  <MessageSquare className="w-8 h-8 opacity-20" />
                  <p className="text-xs">对当前学习阶段有疑问？<br/>随时问我！</p>
                </div>
              ) : (
                chatMessages.map((msg, i) => (
                  <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                    <div className={`max-w-[85%] p-3 rounded-2xl ${msg.role === 'user' ? 'bg-indigo-600 text-white rounded-tr-none' : 'bg-white border border-slate-100 text-slate-700 rounded-tl-none shadow-sm'}`}>
                      <div className="prose prose-sm max-w-none">
                        <ReactMarkdown>{msg.text}</ReactMarkdown>
                      </div>
                    </div>
                  </div>
                ))
              )}
              {isChatLoading && (
                <div className="flex justify-start">
                  <div className="bg-white border border-slate-100 p-3 rounded-2xl rounded-tl-none shadow-sm">
                    <Loader2 className="w-4 h-4 animate-spin text-indigo-500" />
                  </div>
                </div>
              )}
            </div>

            <div className="relative">
              <input 
                type="text" 
                value={chatInput}
                onChange={(e) => setChatInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && askAI()}
                placeholder="解释一下线性回归..."
                className="w-full bg-slate-50 border border-slate-100 rounded-2xl py-3 pl-4 pr-12 text-sm focus:ring-2 focus:ring-indigo-500/20 outline-none transition-all"
              />
              <button 
                onClick={askAI}
                className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 bg-indigo-600 text-white rounded-xl flex items-center justify-center hover:bg-indigo-700 transition-colors"
              >
                <Send className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Knowledge Extraction Section */}
          <div className="space-y-4">
            <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest">今日知识点</h4>
            <div className="grid grid-cols-1 gap-2">
              {concepts.length === 0 ? (
                <div className="p-4 border border-dashed border-slate-200 rounded-2xl text-center text-xs text-slate-400">
                  完成任务以提取知识点
                </div>
              ) : (
                concepts.map(concept => (
                  <motion.div 
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    key={concept.id} 
                    className="p-3 bg-white border border-slate-100 rounded-2xl shadow-sm hover:border-indigo-200 transition-colors group"
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-bold text-slate-800 text-xs">{concept.name}</span>
                      <ChevronRight className="w-3 h-3 text-slate-300 group-hover:text-indigo-500 transition-colors" />
                    </div>
                    <p className="text-[10px] text-slate-500 line-clamp-1">{concept.description}</p>
                  </motion.div>
                ))
              )}
            </div>
          </div>

          {/* Knowledge Mind Map Section */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest">知识脑图</h4>
              <button className="text-[10px] font-bold text-indigo-600 hover:underline">全屏查看</button>
            </div>
            <MiniMindMap concepts={concepts} />
          </div>

          {/* Smart Suggestions / Alerts */}
          <div className="bg-amber-50 border border-amber-100 rounded-2xl p-4 space-y-2">
            <div className="flex items-center gap-2 text-amber-700 font-bold text-xs">
              <AlertCircle className="w-4 h-4" />
              智能建议
            </div>
            <p className="text-[10px] text-amber-600 leading-relaxed">
              检测到你对 “线性代数” 的掌握程度可能不足以支撑后续的 “深度学习” 阶段。建议在进入 Stage 4 之前先复习矩阵运算。
            </p>
            <button className="text-[10px] font-bold text-amber-700 hover:underline">查看复习资料 →</button>
          </div>

        </div>
      </aside>
    </div>
  );
};
