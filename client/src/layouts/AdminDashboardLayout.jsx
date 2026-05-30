import React, { useState, useEffect } from 'react';
import { Outlet, Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { useTheme } from '../hooks/useTheme';
import { 
  BookOpen, LogOut, Users, BarChart3, Settings, Calendar, Bell, 
  ChevronLeft, Shield, TrendingUp, HelpCircle, Bot, Library, FileText
} from 'lucide-react';
import ThemeToggle from '../components/common/ThemeToggle';

const AdminDashboardLayout = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const { setManualTheme } = useTheme();

  // Sidebar collapse state
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  // Load theme preference defaults on dashboard mount
  useEffect(() => {
    const storedTheme = localStorage.getItem('crackit_theme');
    if (!storedTheme) {
      setManualTheme('dark');
    }
  }, [setManualTheme]);

  const handleLogout = () => {
    logout();
    navigate('/login', { replace: true });
  };

  const navItems = [
    { name: 'Dashboard', path: '/admin/dashboard', icon: BarChart3 },
    { name: 'Study Library', path: '/admin/library', icon: Library },
    { name: 'Previous Papers', path: '/admin/papers', icon: FileText },
    { name: 'Mock Tests', path: '/admin/mocktests', icon: HelpCircle },
    { name: 'Users', path: '/admin/users', icon: Users },
    { name: 'Exams', path: '/admin/exams', icon: BookOpen },
    { name: 'AI Assistant', path: '/admin/ai', icon: Bot },
    { name: 'Analytics', path: '/admin/analytics', icon: TrendingUp },
    { name: 'Settings', path: '/admin/settings', icon: Settings }
  ];

  const getActiveTabName = () => {
    const match = navItems.find(item => location.pathname === item.path);
    return match ? match.name : 'Dashboard';
  };

  return (
    <div className="h-screen overflow-hidden bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex font-sans select-none transition-colors duration-300">
      
      {/* SIDEBAR */}
      <aside className={`h-screen flex-shrink-0 border-r border-slate-200 dark:border-slate-900 bg-white dark:bg-slate-950 flex flex-col justify-between p-6 transition-all duration-300 ${isSidebarCollapsed ? 'w-20' : 'w-64'}`}>
        <div>
          {/* Collapse Trigger Button & Logo */}
          <div className="flex items-center justify-between mb-8">
            {!isSidebarCollapsed && (
              <div className="flex items-center gap-2.5">
                <div className="bg-gradient-to-tr from-indigo-600 to-purple-600 text-white p-2 rounded-xl">
                  <Shield size={18} />
                </div>
                <span className="text-xl font-bold tracking-tight text-slate-900 dark:text-white">Crackit Admin</span>
              </div>
            )}
            {isSidebarCollapsed && (
              <div className="bg-gradient-to-tr from-indigo-600 to-purple-600 text-white p-2 rounded-xl mx-auto mb-2">
                <Shield size={18} />
              </div>
            )}
            <button 
              onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
              className="p-1.5 rounded-lg border border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-900 text-slate-500 dark:text-slate-400 cursor-pointer hidden md:block"
            >
              <ChevronLeft size={14} className={`transition-transform duration-300 ${isSidebarCollapsed ? 'rotate-180' : ''}`} />
            </button>
          </div>

          {/* Navigation Items */}
          <nav className="space-y-1">
            {navItems.map((item, index) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;
              return (
                <div key={index} className="relative group">
                  <Link
                    to={item.path}
                    className={`w-full flex items-center gap-3.5 px-4 py-3 rounded-xl text-sm font-semibold transition-all duration-200 cursor-pointer ${
                      isActive 
                        ? 'bg-gradient-to-tr from-indigo-600 to-purple-600 text-white shadow-lg shadow-indigo-600/15'
                        : 'text-slate-500 hover:text-slate-900 hover:bg-slate-100 dark:text-slate-400 dark:hover:text-white dark:hover:bg-slate-900/50'
                    } ${isSidebarCollapsed ? 'justify-center px-0' : ''}`}
                  >
                    <Icon size={18} />
                    {!isSidebarCollapsed && <span>{item.name}</span>}
                  </Link>
                  {/* Tooltip support when collapsed */}
                  {isSidebarCollapsed && (
                    <div className="absolute left-20 top-1/2 -translate-y-1/2 bg-slate-900 text-white text-xs px-2.5 py-1.5 rounded-md opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity duration-200 z-50 whitespace-nowrap shadow-xl">
                      {item.name}
                    </div>
                  )}
                </div>
              );
            })}
          </nav>
        </div>

        {/* User Card & Logout button */}
        <div className="pt-6 border-t border-slate-200 dark:border-slate-900 flex flex-col gap-4">
          <div className={`flex items-center gap-3 ${isSidebarCollapsed ? 'justify-center px-0' : 'px-2'}`}>
            <div className="w-10 h-10 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-indigo-600 dark:text-indigo-500 border border-slate-200 dark:border-slate-700 flex-shrink-0">
              <Shield size={18} />
            </div>
            {!isSidebarCollapsed && (
              <div className="overflow-hidden">
                <h6 className="text-sm font-bold text-slate-900 dark:text-white truncate">{user?.name || 'Administrator'}</h6>
                <p className="text-xs text-slate-500 truncate">{user?.email || 'admin@crackit.com'}</p>
              </div>
            )}
          </div>
          <button 
            onClick={handleLogout}
            className={`flex items-center gap-2 px-4 py-3 bg-red-500/5 border border-red-500/10 hover:bg-red-500/10 text-red-600 dark:text-red-400 rounded-xl text-sm font-semibold transition-colors duration-200 cursor-pointer ${isSidebarCollapsed ? 'justify-center px-0' : 'justify-center'}`}
          >
            <LogOut size={16} />
            {!isSidebarCollapsed && <span>Logout</span>}
          </button>
        </div>
      </aside>

      {/* MAIN CONTAINER */}
      <div className="flex-grow h-screen overflow-hidden flex flex-col min-w-0 bg-slate-50 dark:bg-slate-950 transition-colors duration-300">
        
        {/* TOP NAVBAR */}
        <header className="h-16 border-b border-slate-200 dark:border-slate-900 px-8 flex items-center justify-between bg-white/70 dark:bg-slate-950/60 backdrop-blur-md sticky top-0 z-30 transition-colors duration-300">
          <div className="flex items-center gap-2 text-sm font-bold text-slate-850 dark:text-slate-200">
            <span>{getActiveTabName()}</span>
          </div>

          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 text-slate-500 dark:text-slate-400 text-xs font-semibold bg-white dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 px-3.5 py-2 rounded-xl shadow-xs transition-colors">
              <Calendar size={14} />
              <span>{new Date().toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}</span>
            </div>
            <ThemeToggle />
            <button className="relative p-2 hover:bg-slate-100 dark:hover:bg-slate-900 rounded-full text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors duration-200 cursor-pointer">
              <Bell size={18} />
              <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 bg-indigo-500 rounded-full animate-pulse"></span>
            </button>
          </div>
        </header>

        {/* MAIN BODY AREA WITH SCROLL */}
        <main className="p-6 md:p-8 flex-grow overflow-y-auto w-full">
          <Outlet />
        </main>
      </div>

    </div>
  );
};

export default AdminDashboardLayout;
