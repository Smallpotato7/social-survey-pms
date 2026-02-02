import React, { useState } from 'react';
import { UserRole, User } from '../types';
import { 
  LogOut, 
  Menu, 
  BookOpen, 
  Upload, 
  CheckSquare, 
  PieChart, 
  Target, 
  FileText, 
  Search, 
  CheckCircle, 
  Users,
  Bell
} from 'lucide-react';

interface LayoutProps {
  user: User;
  onLogout: () => void;
  children: React.ReactNode;
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

export const Layout: React.FC<LayoutProps> = ({ user, onLogout, children, activeTab, setActiveTab }) => {
  const [isSidebarOpen, setSidebarOpen] = useState(true);

  const getMenuItems = () => {
    switch (user.role) {
      case UserRole.TEACHER:
        return [
          { id: 'publish', label: '发布作业', icon: <BookOpen size={20} /> },
          { id: 'upload', label: '上传资料', icon: <Upload size={20} /> },
          { id: 'grading', label: '审核评分', icon: <CheckSquare size={20} /> },
          { id: 'insights', label: '教学洞察', icon: <PieChart size={20} /> },
        ];
      case UserRole.STUDENT:
        return [
          { id: 'tasks', label: '任务中心', icon: <Target size={20} /> },
          { id: 'group', label: '我的小组', icon: <Users size={20} /> }, // New Group Module
          { id: 'resources', label: '资料中心', icon: <FileText size={20} /> },
          { id: 'query', label: '作业查询', icon: <Search size={20} /> }, 
          { id: 'format', label: '格式检验', icon: <CheckCircle size={20} /> },
        ];
      case UserRole.ADMIN:
        return [
          { id: 'users', label: '用户管理', icon: <Users size={20} /> },
          { id: 'notifications', label: '通知提醒', icon: <Bell size={20} /> },
        ];
      default:
        return [];
    }
  };

  return (
    <div className="flex h-screen bg-[#fcfbf9] overflow-hidden text-slate-800">
      {/* Sidebar */}
      <div className={`${isSidebarOpen ? 'w-64' : 'w-20'} bg-brand-900 text-brand-50 transition-all duration-300 flex flex-col shadow-2xl z-20`}>
        <div className="p-5 flex items-center justify-between border-b border-brand-800/50">
          {isSidebarOpen && <span className="font-bold text-lg tracking-wide truncate text-brand-50">社会调查管理</span>}
          <button onClick={() => setSidebarOpen(!isSidebarOpen)} className="p-1.5 hover:bg-brand-800 rounded-md text-brand-200 hover:text-white transition-colors">
            <Menu size={20} />
          </button>
        </div>
        
        <div className="flex-1 overflow-y-auto py-6">
          <nav className="space-y-1.5 px-3">
            {getMenuItems().map((item) => (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`w-full flex items-center space-x-3 px-3 py-3.5 rounded-xl transition-all duration-200 group ${
                  activeTab === item.id 
                    ? 'bg-brand-700 text-white shadow-lg shadow-brand-950/20' 
                    : 'text-brand-200 hover:bg-brand-800 hover:text-white'
                }`}
              >
                <div className={`${activeTab === item.id ? 'text-white' : 'text-brand-300 group-hover:text-white'} transition-colors`}>
                    {item.icon}
                </div>
                {isSidebarOpen && <span className="font-medium text-sm tracking-wide">{item.label}</span>}
              </button>
            ))}
          </nav>
        </div>

        <div className="p-4 border-t border-brand-800/50 bg-brand-950/30">
          <div 
            className="flex items-center space-x-3 mb-4 px-2 cursor-pointer hover:bg-brand-800/50 p-2 rounded-lg transition-colors group"
            onClick={() => setActiveTab('profile')}
            title="进入个人中心"
          >
             <div className="h-9 w-9 rounded-full bg-brand-600 flex items-center justify-center text-sm font-bold shadow-md ring-2 ring-brand-500 group-hover:ring-brand-400 transition-all text-white">
                {user.name.charAt(0)}
             </div>
             {isSidebarOpen && (
               <div className="flex-1 overflow-hidden">
                 <p className="text-sm font-medium truncate text-brand-100 group-hover:text-white">{user.name}</p>
                 <p className="text-xs text-brand-400 truncate capitalize">
                   {user.role === UserRole.TEACHER ? '教师' : user.role === UserRole.STUDENT ? '学生' : '管理员'}
                 </p>
               </div>
             )}
          </div>
          <button 
            onClick={onLogout}
            className="w-full flex items-center space-x-3 px-3 py-2 text-brand-300 hover:bg-red-900/30 hover:text-red-200 rounded-lg transition-colors"
          >
            <LogOut size={20} />
            {isSidebarOpen && <span>退出登录</span>}
          </button>
        </div>
      </div>

      {/* Main Content */}
      <main className="flex-1 flex flex-col overflow-hidden relative bg-[#fcfbf9]">
        <header className="h-16 bg-white shadow-sm flex items-center justify-between px-8 z-10 border-b border-brand-100 backdrop-blur-sm bg-white/90">
          <h2 className="text-xl font-bold text-slate-800 tracking-tight">
            {activeTab === 'profile' ? '个人信息' : getMenuItems().find(i => i.id === activeTab)?.label || '仪表盘'}
          </h2>
          <div className="flex items-center space-x-6">
            <div className="relative group">
                <Bell size={20} className="text-slate-400 hover:text-brand-600 cursor-pointer transition-colors" />
                <span className="absolute -top-0.5 -right-0.5 h-2.5 w-2.5 bg-red-500 rounded-full border-2 border-white"></span>
            </div>
            <div 
                className="flex items-center gap-3 pl-6 border-l border-brand-200 cursor-pointer hover:opacity-80 transition-opacity"
                onClick={() => setActiveTab('profile')}
            >
                <div className="text-right hidden md:block">
                    <p className="text-sm font-semibold text-slate-700">{user.name}</p>
                    <p className="text-xs text-slate-500">
                      {user.role === UserRole.TEACHER ? '教师' : user.role === UserRole.STUDENT ? '学生' : '管理员'}
                    </p>
                </div>
                <div className="h-10 w-10 rounded-full bg-brand-100 text-brand-700 flex items-center justify-center text-lg font-bold border border-brand-200 shadow-sm">
                   {user.name.charAt(0)}
                </div>
            </div>
          </div>
        </header>
        <div className="flex-1 overflow-y-auto p-8 scroll-smooth">
          {children}
        </div>
      </main>
    </div>
  );
};