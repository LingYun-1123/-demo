import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Sparkles, 
  BookOpen, 
  Lightbulb, 
  HelpCircle, 
  ChevronRight,
  Loader2,
  ArrowRight
} from 'lucide-react';
import { KnowledgeNode } from '../types';
import { GoogleGenAI } from "@google/genai";
import ReactMarkdown from 'react-markdown';

interface AIAssistantProps {
  selectedNode: KnowledgeNode | null;
}

export const AIAssistant: React.FC<AIAssistantProps> = ({ selectedNode }) => {
  const [loading, setLoading] = useState(false);
  const [explanation, setExplanation] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'explain' | 'points' | 'quiz'>('explain');

  useEffect(() => {
    if (selectedNode) {
      generateExplanation(selectedNode.name);
    } else {
      setExplanation(null);
    }
  }, [selectedNode]);

  const generateExplanation = async (topic: string) => {
    setLoading(true);
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY! });
      const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: `你是一个专业的 AI 学习助手。请为主题 "${topic}" 提供简洁明了的解释。
        包含：
        1. 概念定义
        2. 核心要点 (3-4点)
        3. 学习建议
        
        使用 Markdown 格式，语言要亲切易懂。`,
      });
      setExplanation(response.text || '无法生成解释。');
    } catch (error) {
      console.error('AI Error:', error);
      setExplanation('AI 助手暂时无法连接，请稍后再试。');
    } finally {
      setLoading(false);
    }
  };

  if (!selectedNode) {
    return (
      <div className="w-96 h-screen bg-white border-l border-slate-100 flex flex-col items-center justify-center p-8 text-center">
        <div className="w-20 h-20 bg-indigo-50 rounded-full flex items-center justify-center mb-6">
          <Sparkles className="w-10 h-10 text-indigo-400" />
        </div>
        <h3 className="text-lg font-semibold text-slate-800 mb-2">点击节点开始学习</h3>
        <p className="text-sm text-slate-500 leading-relaxed">
          选择左侧知识图谱中的任意节点，AI 助手将为您提供详细的解释、核心要点和练习题。
        </p>
      </div>
    );
  }

  return (
    <div className="w-96 h-screen bg-white border-l border-slate-100 flex flex-col shadow-xl z-10">
      {/* Header */}
      <div className="p-6 border-bottom border-slate-50">
        <div className="flex items-center gap-2 text-indigo-600 mb-2">
          <Sparkles className="w-4 h-4" />
          <span className="text-xs font-bold uppercase tracking-wider">AI 学习助手</span>
        </div>
        <h2 className="text-2xl font-bold text-slate-900">{selectedNode.name}</h2>
        <div className="mt-4 flex gap-2">
          <div className="px-3 py-1 bg-emerald-50 text-emerald-600 rounded-full text-xs font-medium flex items-center gap-1">
            {selectedNode.completed ? '已掌握' : '学习中'}
          </div>
          <div className="px-3 py-1 bg-slate-50 text-slate-500 rounded-full text-xs font-medium">
            难度: 中等
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex px-6 border-b border-slate-50">
        {[
          { id: 'explain', label: '详细解释', icon: BookOpen },
          { id: 'points', label: '核心要点', icon: Lightbulb },
          { id: 'quiz', label: '自测练习', icon: HelpCircle },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`flex-1 py-3 text-sm font-medium flex items-center justify-center gap-2 border-b-2 transition-colors ${
              activeTab === tab.id 
                ? 'border-indigo-600 text-indigo-600' 
                : 'border-transparent text-slate-400 hover:text-slate-600'
            }`}
          >
            <tab.icon className="w-4 h-4" />
            {tab.label}
          </button>
        ))}
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-6">
        <AnimatePresence mode="wait">
          {loading ? (
            <motion.div
              key="loading"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex flex-col items-center justify-center h-40 text-slate-400"
            >
              <Loader2 className="w-8 h-8 animate-spin mb-4" />
              <p className="text-sm">AI 正在思考中...</p>
            </motion.div>
          ) : (
            <motion.div
              key="content"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="prose prose-slate prose-sm max-w-none"
            >
              <div className="markdown-body">
                <ReactMarkdown>
                  {explanation || ''}
                </ReactMarkdown>
              </div>

              {/* Action Buttons */}
              <div className="mt-8 space-y-3">
                <button className="w-full py-3 px-4 bg-indigo-600 text-white rounded-xl font-medium text-sm flex items-center justify-center gap-2 hover:bg-indigo-700 transition-colors shadow-md shadow-indigo-100">
                  简单解释一下
                </button>
                <button className="w-full py-3 px-4 bg-white border border-slate-200 text-slate-700 rounded-xl font-medium text-sm flex items-center justify-center gap-2 hover:bg-slate-50 transition-colors">
                  举个例子
                </button>
                <button className="w-full py-3 px-4 bg-white border border-slate-200 text-slate-700 rounded-xl font-medium text-sm flex items-center justify-center gap-2 hover:bg-slate-50 transition-colors">
                  生成测试题
                </button>
              </div>

              {/* Next Topics */}
              <div className="mt-10">
                <h4 className="text-sm font-bold text-slate-900 mb-4 flex items-center gap-2">
                  <ArrowRight className="w-4 h-4 text-indigo-500" />
                  建议后续学习
                </h4>
                <div className="space-y-2">
                  {['深度学习基础', '模型评估指标', '特征工程'].map((topic) => (
                    <button
                      key={topic}
                      className="w-full p-3 text-left text-sm bg-slate-50 hover:bg-indigo-50 hover:text-indigo-600 rounded-xl transition-all border border-transparent hover:border-indigo-100 group flex items-center justify-between"
                    >
                      {topic}
                      <ChevronRight className="w-4 h-4 text-slate-300 group-hover:text-indigo-400" />
                    </button>
                  ))}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};
