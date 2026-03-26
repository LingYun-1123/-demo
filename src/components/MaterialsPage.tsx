import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  FileText, 
  Upload, 
  Search, 
  MoreVertical, 
  Sparkles, 
  ChevronRight,
  ExternalLink,
  PlusCircle,
  Hash,
  BookOpen
} from 'lucide-react';
import ReactMarkdown from 'react-markdown';

interface Material {
  id: string;
  name: string;
  type: string;
  date: string;
  size: string;
}

export const MaterialsPage = () => {
  const [selectedId, setSelectedId] = useState('1');
  const [materials] = useState<Material[]>([
    { id: '1', name: '机器学习基础导论.pdf', type: 'PDF', date: '2024-03-10', size: '2.4 MB' },
    { id: '2', name: 'Python 进阶笔记.docx', type: 'DOCX', date: '2024-03-12', size: '1.1 MB' },
    { id: '3', name: '神经网络架构分析.pdf', type: 'PDF', date: '2024-03-13', size: '4.8 MB' },
  ]);

  const selectedMaterial = materials.find(m => m.id === selectedId);

  return (
    <div className="flex-1 flex bg-slate-50 overflow-hidden">
      {/* Left: Material List */}
      <div className="w-80 bg-white border-r border-slate-100 flex flex-col">
        <div className="p-6 border-b border-slate-50">
          <button className="w-full py-3 px-4 bg-indigo-600 text-white rounded-2xl font-bold text-sm flex items-center justify-center gap-2 hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-100">
            <Upload className="w-4 h-4" /> 上传资料
          </button>
          <div className="mt-6 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input 
              type="text" 
              placeholder="搜索资料..." 
              className="w-full bg-slate-50 border-none rounded-xl py-2 pl-10 pr-4 text-xs outline-none focus:ring-2 focus:ring-indigo-500/20 transition-all"
            />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-2">
          {materials.map((m) => (
            <button
              key={m.id}
              onClick={() => setSelectedId(m.id)}
              className={`w-full p-4 rounded-2xl text-left transition-all border ${
                selectedId === m.id 
                  ? 'bg-indigo-50 border-indigo-100 shadow-sm' 
                  : 'bg-white border-transparent hover:bg-slate-50'
              }`}
            >
              <div className="flex items-start justify-between mb-2">
                <div className={`p-2 rounded-lg ${selectedId === m.id ? 'bg-white text-indigo-600' : 'bg-slate-100 text-slate-500'}`}>
                  <FileText className="w-5 h-5" />
                </div>
                <MoreVertical className="w-4 h-4 text-slate-300" />
              </div>
              <p className={`text-sm font-bold truncate ${selectedId === m.id ? 'text-indigo-900' : 'text-slate-700'}`}>
                {m.name}
              </p>
              <div className="flex items-center gap-3 mt-2">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{m.type}</span>
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{m.size}</span>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Center: Viewer */}
      <div className="flex-1 flex flex-col bg-slate-100/50 p-8 overflow-y-auto">
        <div className="bg-white rounded-3xl shadow-xl border border-slate-200/50 min-h-full p-12 max-w-4xl mx-auto w-full">
          <div className="flex items-center justify-between mb-12">
            <h1 className="text-3xl font-black text-slate-900">{selectedMaterial?.name}</h1>
            <button className="p-3 bg-slate-50 text-slate-400 hover:text-indigo-600 rounded-2xl transition-all">
              <ExternalLink className="w-5 h-5" />
            </button>
          </div>
          
          <div className="space-y-8 text-slate-600 leading-relaxed">
            <p className="text-lg">
              机器学习是人工智能的一个子集，它专注于构建能够从数据中学习并根据数据做出预测或决策的系统。
              与传统的编程不同，机器学习算法不是通过显式的指令来执行任务，而是通过在大型数据集中识别模式来改进其性能。
            </p>
            <div className="p-6 bg-indigo-50/50 rounded-2xl border border-indigo-100/50 italic text-indigo-900">
              “机器学习的核心在于通过统计模型使计算机具备‘学习’的能力，而无需进行明确的编程。”
            </div>
            <p>
              监督学习是机器学习中最常见的类型之一。在监督学习中，模型在标记的数据集上进行训练，这意味着每个训练示例都配有一个输出标签。
              模型的目标是学习一个函数，该函数可以将输入映射到正确的输出。
            </p>
            <p>
              常见的监督学习算法包括线性回归、逻辑回归、决策树和支持向量机。这些算法广泛应用于图像识别、语音识别和预测分析等领域。
            </p>
          </div>
        </div>
      </div>

      {/* Right: AI Analysis */}
      <div className="w-96 bg-white border-l border-slate-100 flex flex-col shadow-xl z-10">
        <div className="p-6 border-b border-slate-50">
          <div className="flex items-center gap-2 text-indigo-600 mb-2">
            <Sparkles className="w-4 h-4" />
            <span className="text-xs font-bold uppercase tracking-wider">AI 文档分析</span>
          </div>
          <h3 className="text-xl font-bold text-slate-900">核心摘要</h3>
        </div>

        <div className="flex-1 overflow-y-auto p-6 space-y-8">
          <section>
            <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4">关键概念提取</h4>
            <div className="flex flex-wrap gap-2">
              {['监督学习', '线性回归', '决策树', '神经网络', '特征工程'].map((tag) => (
                <button
                  key={tag}
                  className="px-3 py-1.5 bg-slate-50 hover:bg-indigo-50 text-slate-600 hover:text-indigo-600 rounded-xl text-xs font-medium transition-all border border-transparent hover:border-indigo-100 flex items-center gap-1.5 group"
                >
                  <Hash className="w-3 h-3 text-slate-300 group-hover:text-indigo-400" />
                  {tag}
                  <PlusCircle className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                </button>
              ))}
            </div>
          </section>

          <section>
            <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4">AI 总结</h4>
            <div className="bg-slate-50 p-4 rounded-2xl text-sm text-slate-600 leading-relaxed border border-slate-100">
              本文档详细介绍了机器学习的基本定义及其分类。重点讨论了监督学习的机制，并列举了多种核心算法。
              文档强调了数据在模型训练中的决定性作用。
            </div>
          </section>

          <section>
            <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4">知识图谱关联</h4>
            <div className="space-y-3">
              <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-100 flex items-center gap-3">
                <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center text-emerald-600 shadow-sm">
                  <BookOpen className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-xs font-bold text-emerald-900">已关联节点</p>
                  <p className="text-[10px] text-emerald-600">机器学习 / 监督学习</p>
                </div>
              </div>
              <button className="w-full p-4 rounded-2xl bg-white border border-dashed border-slate-200 text-slate-400 hover:text-indigo-600 hover:border-indigo-200 hover:bg-indigo-50 transition-all flex items-center justify-center gap-2 text-xs font-bold">
                <PlusCircle className="w-4 h-4" /> 发现 3 个新概念
              </button>
            </div>
          </section>
        </div>

        <div className="p-6 border-t border-slate-50">
          <button className="w-full py-3 bg-white border border-slate-200 text-slate-700 rounded-xl font-bold text-sm hover:bg-slate-50 transition-all">
            生成复习导图
          </button>
        </div>
      </div>
    </div>
  );
};
