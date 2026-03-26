import React from 'react';
import { 
  MessageSquare, 
  LayoutDashboard, 
  Network, 
  BookOpen, 
  BarChart3,
  Settings,
  LogOut
} from 'lucide-react';
import { motion } from 'motion/react';
import { PageId } from '../types';

const navItems: { id: PageId; label: string; icon: any }[] = [
  { id: 'chat', label: 'AI 对话', icon: MessageSquare },
  { id: 'plan', label: '学习计划', icon: LayoutDashboard },
  { id: 'map', label: '知识图谱', icon: Network },
  { id: 'materials', label: '学习资料', icon: BookOpen },
  { id: 'analytics', label: '学习分析', icon: BarChart3 },
];

interface SidebarProps {
  currentPage: PageId;
  onNavigate: (page: PageId) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ currentPage, onNavigate }) => {
  return (
    <div className="w-64 h-screen bg-white border-r border-slate-100 flex flex-col p-4 shadow-sm z-30">
      <div className="flex items-center gap-3 px-2 mb-10">
        <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center">
          <Network className="text-white w-5 h-5" />
        </div>
        <span className="font-bold text-xl text-slate-800 tracking-tight">智学助手</span>
      </div>

      <nav className="flex-1 space-y-1">
        {navItems.map((item) => (
          <motion.button
            key={item.id}
            whileHover={{ x: 4 }}
            onClick={() => onNavigate(item.id)}
            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors ${
              currentPage === item.id 
                ? 'bg-indigo-50 text-indigo-600' 
                : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900'
            }`}
          >
            <item.icon className={`w-5 h-5 ${currentPage === item.id ? 'text-indigo-600' : 'text-slate-400'}`} />
            {item.label}
          </motion.button>
        ))}
      </nav>

      <div className="pt-4 border-t border-slate-50 space-y-1">
        <button className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-slate-500 hover:bg-slate-50 hover:text-slate-900 transition-colors">
          <Settings className="w-5 h-5 text-slate-400" />
          设置
        </button>
        <button className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-rose-500 hover:bg-rose-50 transition-colors">
          <LogOut className="w-5 h-5" />
          退出登录
        </button>
      </div>
    </div>
  );
};
