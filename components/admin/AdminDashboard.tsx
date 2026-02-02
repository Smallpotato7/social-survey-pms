import React, { useState } from 'react';
import { Users, Settings, Bell, Upload, Trash2, Edit2, Plus, X, Save, Shield, HardDrive } from 'lucide-react';

interface AdminDashboardProps {
  activeTab: string;
}

interface AdminUser {
    id: number;
    name: string;
    role: 'Student' | 'Teacher' | 'Admin';
    email: string;
    uploadLimitMB: number; // New field for quota
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({ activeTab }) => {
  const [users, setUsers] = useState<AdminUser[]>([
    { id: 1, name: '李华', role: 'Student', email: 'lihua@uni.edu', uploadLimitMB: 50 },
    { id: 2, name: '张教授', role: 'Teacher', email: 'zhang@uni.edu', uploadLimitMB: 500 },
    { id: 3, name: '王强', role: 'Student', email: 'wang@uni.edu', uploadLimitMB: 50 },
  ]);

  // Modal States
  const [isAddModalOpen, setAddModalOpen] = useState(false);
  const [isEditModalOpen, setEditModalOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState<AdminUser | null>(null);

  // Form States
  const [newUser, setNewUser] = useState<Partial<AdminUser>>({ role: 'Student', uploadLimitMB: 50 });

  const handleAddUser = (e: React.FormEvent) => {
      e.preventDefault();
      if (!newUser.name || !newUser.email) return;
      const u: AdminUser = {
          id: Date.now(),
          name: newUser.name,
          email: newUser.email,
          role: newUser.role as any,
          uploadLimitMB: newUser.uploadLimitMB || 50
      };
      setUsers([...users, u]);
      setAddModalOpen(false);
      setNewUser({ role: 'Student', uploadLimitMB: 50 });
      alert('用户添加成功');
  };

  const handleEditUser = (e: React.FormEvent) => {
      e.preventDefault();
      if (!currentUser) return;
      setUsers(users.map(u => u.id === currentUser.id ? currentUser : u));
      setEditModalOpen(false);
      setCurrentUser(null);
      alert('用户信息更新成功');
  };

  const handleDeleteUser = (id: number) => {
      if (confirm('确定要删除该用户吗？此操作不可恢复。')) {
          setUsers(users.filter(u => u.id !== id));
      }
  };

  const openEditModal = (user: AdminUser) => {
      setCurrentUser({...user});
      setEditModalOpen(true);
  };

  if (activeTab === 'users') {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
           <h3 className="text-2xl font-bold text-slate-800 tracking-tight">用户管理</h3>
           <div className="flex gap-3">
             <button className="bg-white border border-slate-300 text-slate-700 px-4 py-2 rounded-lg flex items-center gap-2 text-sm font-semibold hover:bg-slate-50 shadow-sm transition-all">
               <Upload size={16}/> 导入 CSV
             </button>
             <button 
                onClick={() => setAddModalOpen(true)}
                className="bg-brand-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 text-sm font-semibold hover:bg-brand-700 shadow-md transition-all"
            >
               <Plus size={16}/> 添加用户
             </button>
           </div>
        </div>
        
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
          <table className="w-full text-left">
            <thead className="bg-slate-50 border-b border-slate-200">
              <tr>
                <th className="px-6 py-4 font-bold text-slate-500 text-xs uppercase tracking-wider">姓名</th>
                <th className="px-6 py-4 font-bold text-slate-500 text-xs uppercase tracking-wider">角色</th>
                <th className="px-6 py-4 font-bold text-slate-500 text-xs uppercase tracking-wider">邮箱</th>
                <th className="px-6 py-4 font-bold text-slate-500 text-xs uppercase tracking-wider">上传配额</th>
                <th className="px-6 py-4 font-bold text-slate-500 text-xs uppercase tracking-wider text-right">操作</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {users.map(u => (
                <tr key={u.id} className="hover:bg-slate-50 transition-colors group">
                  <td className="px-6 py-4 text-slate-800 font-medium flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-slate-200 flex items-center justify-center text-xs font-bold text-slate-600">
                          {u.name.charAt(0)}
                      </div>
                      {u.name}
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-2.5 py-0.5 rounded-full text-xs font-semibold border ${
                        u.role === 'Teacher' 
                        ? 'bg-purple-50 text-purple-700 border-purple-100' 
                        : u.role === 'Admin' 
                        ? 'bg-slate-800 text-white border-slate-700'
                        : 'bg-brand-50 text-brand-700 border-brand-100'
                    }`}>
                      {u.role === 'Teacher' ? '教师' : u.role === 'Admin' ? '管理员' : '学生'}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-slate-600 font-mono text-sm">{u.email}</td>
                  <td className="px-6 py-4 text-slate-600 text-sm">
                      <span className="flex items-center gap-1.5">
                          <HardDrive size={14} className="text-slate-400"/>
                          {u.uploadLimitMB} MB
                      </span>
                  </td>
                  <td className="px-6 py-4 text-right flex justify-end gap-2 opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity">
                    <button 
                        onClick={() => openEditModal(u)}
                        className="p-2 text-slate-400 hover:text-brand-600 hover:bg-brand-50 rounded-lg transition-colors" title="编辑权限"
                    >
                        <Edit2 size={16}/>
                    </button>
                    <button 
                        onClick={() => handleDeleteUser(u.id)}
                        className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors" title="删除用户"
                    >
                        <Trash2 size={16}/>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Add User Modal */}
        {isAddModalOpen && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm">
                <div className="bg-white rounded-xl shadow-xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in-95 duration-200">
                    <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center bg-slate-50">
                        <h3 className="font-bold text-slate-800">添加新用户</h3>
                        <button onClick={() => setAddModalOpen(false)}><X size={20} className="text-slate-400 hover:text-slate-600"/></button>
                    </div>
                    <form onSubmit={handleAddUser} className="p-6 space-y-4">
                        <div>
                            <label className="block text-sm font-bold text-slate-700 mb-1">姓名</label>
                            <input type="text" required className="w-full border-slate-300 rounded-lg p-2.5 border focus:ring-2 focus:ring-brand-500"
                                value={newUser.name || ''} onChange={e => setNewUser({...newUser, name: e.target.value})} />
                        </div>
                        <div>
                            <label className="block text-sm font-bold text-slate-700 mb-1">邮箱</label>
                            <input type="email" required className="w-full border-slate-300 rounded-lg p-2.5 border focus:ring-2 focus:ring-brand-500"
                                value={newUser.email || ''} onChange={e => setNewUser({...newUser, email: e.target.value})} />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-bold text-slate-700 mb-1">角色</label>
                                <select className="w-full border-slate-300 rounded-lg p-2.5 border bg-white focus:ring-2 focus:ring-brand-500"
                                    value={newUser.role} onChange={e => setNewUser({...newUser, role: e.target.value as any})}>
                                    <option value="Student">学生</option>
                                    <option value="Teacher">教师</option>
                                    <option value="Admin">管理员</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-bold text-slate-700 mb-1">上传限额 (MB)</label>
                                <input type="number" className="w-full border-slate-300 rounded-lg p-2.5 border focus:ring-2 focus:ring-brand-500"
                                    value={newUser.uploadLimitMB} onChange={e => setNewUser({...newUser, uploadLimitMB: Number(e.target.value)})} />
                            </div>
                        </div>
                        <div className="pt-4 flex justify-end gap-3">
                            <button type="button" onClick={() => setAddModalOpen(false)} className="px-4 py-2 text-slate-600 hover:bg-slate-100 rounded-lg text-sm font-medium">取消</button>
                            <button type="submit" className="px-4 py-2 bg-brand-600 text-white rounded-lg text-sm font-medium hover:bg-brand-700">确认添加</button>
                        </div>
                    </form>
                </div>
            </div>
        )}

        {/* Edit User Modal */}
        {isEditModalOpen && currentUser && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm">
                <div className="bg-white rounded-xl shadow-xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in-95 duration-200">
                    <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center bg-slate-50">
                        <h3 className="font-bold text-slate-800 flex items-center gap-2">
                            <Settings size={18} className="text-brand-600"/> 
                            编辑用户权限: {currentUser.name}
                        </h3>
                        <button onClick={() => setEditModalOpen(false)}><X size={20} className="text-slate-400 hover:text-slate-600"/></button>
                    </div>
                    <form onSubmit={handleEditUser} className="p-6 space-y-4">
                        <div>
                            <label className="block text-sm font-bold text-slate-700 mb-1">系统角色 (赋权)</label>
                            <select className="w-full border-slate-300 rounded-lg p-2.5 border bg-white focus:ring-2 focus:ring-brand-500"
                                value={currentUser.role} onChange={e => setCurrentUser({...currentUser, role: e.target.value as any})}>
                                <option value="Student">学生 (普通权限)</option>
                                <option value="Teacher">教师 (管理作业)</option>
                                <option value="Admin">管理员 (系统设置)</option>
                            </select>
                        </div>
                        
                        <div className="p-4 bg-slate-50 rounded-lg border border-slate-100">
                            <label className="block text-sm font-bold text-slate-700 mb-2 flex items-center gap-2">
                                <HardDrive size={16}/> 文件上传配额限制
                            </label>
                            <div className="flex items-center gap-3">
                                <input type="number" className="flex-1 border-slate-300 rounded-lg p-2.5 border focus:ring-2 focus:ring-brand-500"
                                    value={currentUser.uploadLimitMB} onChange={e => setCurrentUser({...currentUser, uploadLimitMB: Number(e.target.value)})} />
                                <span className="text-slate-500 font-medium">MB</span>
                            </div>
                            <p className="text-xs text-slate-400 mt-2">限制该用户单次上传的最大文件大小。</p>
                        </div>

                        <div className="pt-4 flex justify-end gap-3">
                            <button type="button" onClick={() => setEditModalOpen(false)} className="px-4 py-2 text-slate-600 hover:bg-slate-100 rounded-lg text-sm font-medium">取消</button>
                            <button type="submit" className="px-4 py-2 bg-brand-600 text-white rounded-lg text-sm font-medium hover:bg-brand-700 flex items-center gap-2">
                                <Save size={16}/> 保存更改
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        )}
      </div>
    );
  }

  if (activeTab === 'notifications') {
    return (
        <div className="max-w-2xl bg-white p-8 rounded-xl shadow-sm border border-slate-200">
           <h3 className="text-xl font-bold text-slate-800 mb-6 flex items-center gap-2"><Bell size={20} className="text-brand-600"/> 通知与提醒</h3>
           <div className="space-y-4">
              <div className="p-4 bg-amber-50 rounded-lg border border-amber-100 mb-4 flex gap-3">
                 <Bell size={20} className="text-amber-600 mt-1 flex-shrink-0"/>
                 <div>
                    <h4 className="font-bold text-amber-800 text-sm">自动提醒规则</h4>
                    <p className="text-amber-700 text-xs mt-1 leading-relaxed">系统将自动检测逾期未提交的学生和待审核超过3天的教师任务。点击下方按钮手动触发通知。</p>
                 </div>
              </div>
              <button className="w-full border border-slate-300 bg-white py-3 rounded-lg text-sm font-semibold text-slate-700 hover:bg-slate-50 transition-colors flex justify-center items-center gap-2">
                 一键提醒：逾期未提交学生
              </button>
              <button className="w-full border border-slate-300 bg-white py-3 rounded-lg text-sm font-semibold text-slate-700 hover:bg-slate-50 transition-colors flex justify-center items-center gap-2">
                 一键提醒：待审核教师
              </button>
           </div>
        </div>
    )
  }

  return <div className="text-slate-500 p-8 text-center">请选择左侧菜单项</div>;
};