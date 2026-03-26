import React, { useState } from 'react';
import { Sidebar } from './components/Sidebar';
import { MindMap } from './components/MindMap';
import { AIAssistant } from './components/AIAssistant';
import { ChatPage } from './components/ChatPage';
import { PlanPage } from './components/PlanPage';
import { MaterialsPage } from './components/MaterialsPage';
import { AnalyticsPage } from './components/AnalyticsPage';
import { initialTreeData } from './data/knowledgeTree';
import { KnowledgeNode, PageId } from './types';
import { motion, AnimatePresence } from 'motion/react';
import { Search, Bell, User } from 'lucide-react';

export default function App() {
  const [currentPage, setCurrentPage] = useState<PageId>('chat');
  const [selectedNode, setSelectedNode] = useState<KnowledgeNode | null>(null);

  const handleNodeClick = (node: KnowledgeNode) => {
    setSelectedNode(node);
  };

  const renderContent = () => {
    switch (currentPage) {
      case 'chat':
        return <ChatPage />;
      case 'plan':
        return <PlanPage />;
      case 'map':
        return (
          <div className="flex-1 flex overflow-hidden">
            <div className="flex-1 relative">
              <MindMap 
                data={initialTreeData} 
                onNodeClick={handleNodeClick} 
                selectedNodeId={selectedNode?.id}
              />
            </div>
            <AIAssistant selectedNode={selectedNode} />
          </div>
        );
      case 'materials':
        return <MaterialsPage />;
      case 'analytics':
        return <AnalyticsPage />;
      default:
        return <ChatPage />;
    }
  };

  return (
    <div className="flex h-screen bg-slate-50 font-sans text-slate-900 overflow-hidden">
      {/* Left Sidebar */}
      <Sidebar currentPage={currentPage} onNavigate={setCurrentPage} />

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col min-w-0 relative h-full">
        {/* Header */}
        <header className="h-16 bg-white/80 backdrop-blur-md border-b border-slate-100 flex items-center justify-between px-8 z-20 flex-shrink-0">
          <div className="flex items-center gap-4 flex-1 max-w-md">
            <div className="relative w-full">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input 
                type="text" 
                placeholder="搜索知识点、资料、计划..." 
                className="w-full bg-slate-50 border-none rounded-xl py-2 pl-10 pr-4 text-sm focus:ring-2 focus:ring-indigo-500/20 transition-all outline-none"
              />
            </div>
          </div>

          <div className="flex items-center gap-4">
            <button className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-50 rounded-lg transition-all relative">
              <Bell className="w-5 h-5" />
              <span className="absolute top-2 right-2 w-2 h-2 bg-rose-500 rounded-full border-2 border-white" />
            </button>
            <div className="h-8 w-px bg-slate-100 mx-2" />
            <div className="flex items-center gap-3 pl-2">
              <div className="text-right hidden sm:block">
                <p className="text-sm font-semibold text-slate-800">学习者</p>
                <p className="text-xs text-slate-400">黄金会员</p>
              </div>
              <div className="w-10 h-10 bg-indigo-100 rounded-full flex items-center justify-center text-indigo-600 border-2 border-white shadow-sm">
                <User className="w-6 h-6" />
              </div>
            </div>
          </div>
        </header>

        {/* Page Content Area */}
        <div className="flex-1 overflow-hidden relative">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentPage}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.2 }}
              className="w-full h-full flex"
            >
              {renderContent()}
            </motion.div>
          </AnimatePresence>
        </div>
      </main>
    </div>
  );
}
