import React, { useState, useEffect } from 'react';
import { Outlet, Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { useTheme } from '../hooks/useTheme';
import { 
  BookOpen, LogOut, Users, BarChart3, Calendar,
  ChevronLeft, Shield, TrendingUp, HelpCircle, Library, FileText, Newspaper, BellRing, Menu, X
} from 'lucide-react';
import ThemeToggle from '../components/common/ThemeToggle';
import logoImg from '../assets/crackit-logo.webp';

const AdminDashboardLayout = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const { setManualTheme } = useTheme();

  // Sidebar collapse state
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

  // Load theme preference defaults on dashboard mount
  useEffect(() => {
    const storedTheme = localStorage.getItem('crackit_theme');
    if (!storedTheme) {
      setManualTheme('dark');
    }
  }, [setManualTheme]);

  // Mobile sidebar close on escape key
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        setIsMobileSidebarOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/login', { replace: true });
  };

  const navItems = [
    { name: 'Dashboard', path: '/admin/dashboard', icon: BarChart3 },
    { name: 'Study Library', path: '/admin/library', icon: Library },
    { name: 'Previous Papers', path: '/admin/papers', icon: FileText },
    { name: 'Mock Tests', path: '/admin/mocktests', icon: HelpCircle },
    { name: 'Current Affairs', path: '/admin/current-affairs', icon: Newspaper },
    { name: 'Exam Updates', path: '/admin/exam-updates', icon: BellRing },
    { name: 'Users', path: '/admin/users', icon: Users }
  ];

  const getActiveTabName = () => {
    const match = navItems.find(item => location.pathname === item.path);
    return match ? match.name : 'Dashboard';
  };

  return (
    <div className="h-screen overflow-hidden bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex font-sans select-none transition-colors duration-300">
      
      {/* MOBILE OVERLAY */}
      {isMobileSidebarOpen && (
        <div 
          className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-40 md:hidden"
          onClick={() => setIsMobileSidebarOpen(false)}
        />
      )}

      {/* SIDEBAR */}
      <aside 
        className={`fixed md:relative z-50 h-screen flex-shrink-0 border-r border-slate-200 dark:border-slate-900 bg-white dark:bg-slate-950 flex flex-col justify-between p-6 transition-all duration-300 
        ${isSidebarCollapsed ? 'md:w-20' : 'md:w-64'} 
        ${isMobileSidebarOpen ? 'w-64 translate-x-0' : '-translate-x-full md:translate-x-0'}
        `}
      >
        <div>
          {/* Collapse Trigger Button & Logo */}
          <div className="flex items-center justify-between mb-8">
            {!isSidebarCollapsed && (
              <div className="flex items-center gap-2.5">
                <img src={logoImg} alt="Crackit Logo" className="w-8 h-8 rounded-xl object-contain" />
                <span className="text-xl font-bold tracking-tight text-slate-900 dark:text-white">Crackit</span>
                <span className="text-[9px] bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border border-indigo-500/20 px-1.5 py-0.5 rounded font-semibold">ADMIN</span>
              </div>
            )}
            {isSidebarCollapsed && (
              <img src={logoImg} alt="Crackit Logo" className="w-8 h-8 rounded-xl object-contain mx-auto mb-2" />
            )}
            <button 
              onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
              className="p-1.5 rounded-lg border border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-900 text-slate-500 dark:text-slate-400 cursor-pointer hidden md:block"
            >
              <ChevronLeft size={14} className={`transition-transform duration-300 ${isSidebarCollapsed ? 'rotate-180' : ''}`} />
            </button>
            <button 
              onClick={() => setIsMobileSidebarOpen(false)}
              className="p-1.5 rounded-lg border border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-900 text-slate-500 dark:text-slate-400 cursor-pointer md:hidden"
            >
              <X size={14} />
            </button>
          </div>

          {/* Navigation Items */}
          <nav className="space-y-2 mt-4">
            {navItems.map((item, index) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;
              return (
                <div key={index} className="relative group">
                  <Link
                    to={item.path}
                    onClick={() => setIsMobileSidebarOpen(false)}
                    className={`flex items-center rounded-xl text-sm font-semibold transition-all duration-200 cursor-pointer ${
                      isActive 
                        ? 'bg-gradient-to-tr from-indigo-600 to-purple-600 text-white shadow-lg shadow-indigo-600/15'
                        : 'text-slate-500 hover:text-slate-900 hover:bg-slate-100 dark:text-slate-400 dark:hover:text-white dark:hover:bg-slate-900/50'
                    } ${
                      isSidebarCollapsed 
                        ? 'w-10 h-10 justify-center mx-auto' 
                        : 'w-full gap-3.5 px-4 py-3'
                    }`}
                  >
                    <Icon size={18} />
                    {!isSidebarCollapsed && <span>{item.name}</span>}
                  </Link>
                  {/* Tooltip support when collapsed */}
                  {isSidebarCollapsed && (
                    <div className="absolute left-16 top-1/2 -translate-y-1/2 bg-slate-900 text-white text-xs px-2.5 py-1.5 rounded-md opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity duration-200 z-50 whitespace-nowrap shadow-xl">
                      {item.name}
                    </div>
                  )}
                </div>
              );
            })}
          </nav>
        </div>

        {/* User Card & Logout button */}
        {isSidebarCollapsed ? (
          <div className="pt-4 border-t border-slate-200 dark:border-slate-900 flex flex-col items-center gap-4">
            {/* Avatar Icon */}
            <div className="relative group">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600/10 to-purple-600/10 text-indigo-600 dark:text-indigo-400 border border-indigo-500/15 flex items-center justify-center transition-all duration-200">
                <Shield size={16} />
              </div>
              <div className="absolute left-16 top-1/2 -translate-y-1/2 bg-slate-900 text-white text-xs px-2.5 py-1.5 rounded-md opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity duration-200 z-50 whitespace-nowrap shadow-xl">
                Administrator
              </div>
            </div>

            {/* Logout Icon */}
            <div className="relative group">
              <button 
                onClick={handleLogout}
                className="w-10 h-10 rounded-xl bg-red-500/5 hover:bg-red-500/10 text-red-600 dark:text-red-400 border border-red-500/10 flex items-center justify-center cursor-pointer transition-all duration-200"
              >
                <LogOut size={16} />
              </button>
              <div className="absolute left-16 top-1/2 -translate-y-1/2 bg-slate-900 text-white text-xs px-2.5 py-1.5 rounded-md opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity duration-200 z-50 whitespace-nowrap shadow-xl">
                Logout
              </div>
            </div>
          </div>
        ) : (
          <div className="pt-6 border-t border-slate-200 dark:border-slate-900 flex flex-col gap-4">
            <div className="flex items-center justify-between p-3 rounded-2xl bg-slate-100/50 dark:bg-slate-900/50 border border-slate-200/50 dark:border-slate-800/50">
              <div className="flex items-center gap-3 overflow-hidden">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600/10 to-purple-600/10 text-indigo-600 dark:text-indigo-400 border border-indigo-500/15 flex items-center justify-center flex-shrink-0">
                  <Shield size={16} />
                </div>
                <div className="overflow-hidden">
                  <h6 className="text-sm font-bold text-slate-900 dark:text-white truncate">{user?.name || 'Administrator'}</h6>
                  <p className="text-xs text-slate-500 truncate">{user?.email || 'admin@crackit.com'}</p>
                </div>
              </div>
              <button 
                onClick={handleLogout}
                className="p-2 rounded-xl bg-red-500/5 hover:bg-red-500/10 text-red-600 dark:text-red-400 border border-red-500/10 cursor-pointer transition-all duration-200 flex-shrink-0"
                title="Logout"
              >
                <LogOut size={16} />
              </button>
            </div>
          </div>
        )}
      </aside>

      {/* MAIN CONTAINER */}
      <div className="flex-grow h-screen overflow-hidden flex flex-col min-w-0 bg-slate-50 dark:bg-slate-950 transition-colors duration-300">
        
        {/* FLOATING TOP HEADER WRAPPER */}
        <div className="px-6 md:px-8 pt-4 md:pt-6 flex-shrink-0 relative z-40">
          <header className="h-18 px-6 flex items-center justify-between bg-white/80 dark:bg-slate-900/40 border border-slate-200/40 dark:border-slate-800/30 rounded-2xl shadow-xs backdrop-blur-md transition-all duration-300">
            {/* LEFT: Dynamic Icon & Page Name & Mobile Menu Toggle */}
            <div className="flex items-center gap-2.5">
              <button 
                onClick={() => setIsMobileSidebarOpen(true)}
                className="md:hidden p-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
              >
                <Menu size={18} />
              </button>
              <div className="hidden md:flex w-8 h-8 rounded-xl bg-indigo-500/10 text-indigo-500 dark:bg-indigo-500/[0.06] items-center justify-center">
                {React.createElement(
                  navItems.find(item => location.pathname === item.path)?.icon || BarChart3,
                  { size: 16 }
                )}
              </div>
              <span className="text-sm md:text-base font-extrabold text-slate-900 dark:text-white tracking-tight">
                {getActiveTabName()}
              </span>
            </div>

            {/* RIGHT: Actions Panel */}
            <div className="flex items-center gap-3">
              {/* Date Capsule */}
              <div className="hidden sm:flex items-center gap-2 text-slate-500 dark:text-slate-400 text-[11px] font-extrabold uppercase tracking-wider bg-slate-100/60 dark:bg-slate-900/40 px-3 py-1.5 rounded-xl border border-slate-200/40 dark:border-slate-800/30">
                <Calendar size={13} className="text-indigo-500" />
                <span>{new Date().toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}</span>
              </div>
              <div className="h-4 w-px bg-slate-200 dark:bg-slate-800 hidden sm:block"></div>
              <ThemeToggle />
            </div>
          </header>
        </div>

        {/* MAIN SCROLLABLE CONTENT */}
        <main className="flex-1 overflow-y-auto px-2 md:px-4 py-6 scroll-smooth">
          <Outlet />
        </main>
      </div>

    </div>
  );
};

export default AdminDashboardLayout;
