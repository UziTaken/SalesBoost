import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import { useAuthStore } from '@/store/auth.store';
import { 
  BookOpen, 
  LayoutDashboard, 
  CheckSquare, 
  BarChart2, 
  Database,
  HelpCircle,
  Share2,
  LogOut,
  ChevronDown,
  User
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useToast } from '@/hooks/use-toast';

export default function AdminLayout() {
  const { user, signOut } = useAuthStore();
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleSignOut = async () => {
    await signOut();
    navigate('/login');
  };

  const handleSwitchToStudent = () => {
    navigate('/student/dashboard');
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: '销冠AI系统 - 管理端',
        text: 'AI智能销售培训管理平台',
        url: window.location.href,
      });
    } else {
      toast({
        title: '分享链接',
        description: '链接已复制到剪贴板',
      });
    }
  };

  const handleHelp = () => {
    toast({
      title: '帮助中心',
      description: '帮助文档正在编写中，请联系管理员获取支持',
    });
  };

  const navItems = [
    { to: '/admin/dashboard', icon: BookOpen, label: '统一培训' },
    { to: '/admin/courses', icon: LayoutDashboard, label: '课程管理' },
    { to: '/admin/tasks', icon: CheckSquare, label: '任务管理' },
    { to: '/admin/analysis', icon: BarChart2, label: '能力分析' },
    { to: '/admin/knowledge', icon: Database, label: '知识库房' },
  ];

  return (
    <div className="flex h-screen bg-gray-50 font-sans">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r border-gray-200 flex flex-col z-20">
        {/* Logo Area */}
        <div className="p-6 flex items-center space-x-3">
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-indigo-600 flex items-center justify-center text-white font-bold text-lg shadow-md">
            AI
          </div>
          <div>
            <h1 className="text-base font-bold text-gray-900 leading-tight">销冠AI系统</h1>
            <p className="text-xs text-gray-500">管理型基础协同</p>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-4 space-y-2 mt-4">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                `flex items-center px-4 py-3 text-sm font-medium rounded-xl transition-all duration-200 group ${
                  isActive
                    ? 'bg-gradient-to-r from-purple-50 to-indigo-50 text-indigo-700 shadow-sm'
                    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                }`
              }
            >
              {({ isActive }) => (
                <>
                  <item.icon className={`w-5 h-5 mr-3 ${isActive ? 'text-indigo-600' : 'text-gray-400 group-hover:text-gray-600'}`} />
                  {item.label}
                </>
              )}
            </NavLink>
          ))}
        </nav>

        {/* User Profile (Bottom) */}
        <div className="p-4 border-t border-gray-100">
          <div className="flex items-center p-2 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer">
            <Avatar className="h-9 w-9 border border-gray-200">
              <AvatarImage src={user?.user_metadata?.avatar_url} />
              <AvatarFallback className="bg-purple-100 text-purple-700 font-medium">
                {user?.user_metadata?.full_name?.charAt(0) || user?.email?.charAt(0).toUpperCase() || '管'}
              </AvatarFallback>
            </Avatar>
            <div className="ml-3 flex-1 overflow-hidden">
              <p className="text-sm font-medium text-gray-900 truncate">{user?.user_metadata?.full_name || '管理员'}</p>
              <p className="text-xs text-gray-500 truncate">{user?.email || 'admin@company.com'}</p>
            </div>
            <LogOut
              className="w-4 h-4 text-gray-400 hover:text-red-500 ml-2 cursor-pointer"
              onClick={(e) => {
                e.stopPropagation();
                handleSignOut();
              }}
            />
          </div>
        </div>
      </aside>

      {/* Main Layout */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top Header */}
        <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-8 z-10">
          <div className="flex items-center">
            <h2 className="text-lg font-semibold text-gray-800">AI Sales Training Agent</h2>
            <ChevronDown className="w-4 h-4 ml-2 text-gray-400 cursor-pointer" />
          </div>
          
          <div className="flex items-center space-x-4">
            <Button 
              variant="ghost" 
              size="icon" 
              className="rounded-full text-gray-500 hover:text-gray-700 hover:bg-gray-100"
              onClick={handleHelp}
            >
              <HelpCircle className="w-5 h-5" />
            </Button>
            
            <Button 
              variant="outline" 
              className="rounded-full border-gray-200 text-gray-600 hover:bg-gray-50 hover:text-gray-900"
              onClick={handleSwitchToStudent}
            >
              切换到学员端
            </Button>
            
            <Button 
              className="rounded-full bg-indigo-600 hover:bg-indigo-700 text-white shadow-md shadow-indigo-200"
              onClick={handleShare}
            >
              <Share2 className="w-4 h-4 mr-2" />
              Share
            </Button>
          </div>
        </header>

        {/* Content Area */}
        <main className="flex-1 overflow-auto bg-gray-50 p-8">
          <div className="max-w-7xl mx-auto h-full">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}
