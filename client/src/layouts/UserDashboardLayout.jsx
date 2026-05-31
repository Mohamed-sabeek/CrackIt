import React, { useState, useEffect } from 'react';
import { Outlet, Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { useTheme } from '../hooks/useTheme';
import { 
  BookOpen, LogOut, LayoutDashboard, Compass, HelpCircle, 
  Bot, BarChart3, Settings, Calendar, Bell, ChevronLeft, Search, Flame, User, FileText, Award, ChevronDown, Newspaper, BellRing, Menu, X
} from 'lucide-react';
import ThemeToggle from '../components/common/ThemeToggle';
import logoImg from '../assets/crackit-logo.webp';

const UserDashboardLayout = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const { setManualTheme } = useTheme();

  // Sidebar collapse state
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

  // Dropdown states
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  // Dynamic notification states
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);

  const fetchNotifications = async () => {
    try {
      const token = localStorage.getItem('crackit_token');
      if (!token) return;

      const headers = { 'Authorization': `Bearer ${token}` };

      const listRes = await fetch('/api/notifications', { headers });
      const listData = await listRes.json();
      if (listData.success) {
        setNotifications(listData.data || []);
      }

      const countRes = await fetch('/api/notifications/unread-count', { headers });
      const countData = await countRes.json();
      if (countData.success) {
        setUnreadCount(countData.unreadCount || 0);
      }
    } catch (err) {
      console.error('Failed to fetch notifications:', err);
    }
  };

  const markAsRead = async (id) => {
    try {
      const token = localStorage.getItem('crackit_token');
      const headers = { 
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      };
      await fetch(`/api/notifications/${id}/read`, { 
        method: 'PUT',
        headers 
      });
      fetchNotifications();
    } catch (err) {
      console.error('Failed to mark read:', err);
    }
  };

  const markAllAsRead = async () => {
    try {
      const token = localStorage.getItem('crackit_token');
      const headers = { 
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      };
      await fetch('/api/notifications/read-all', { 
        method: 'PUT',
        headers 
      });
      fetchNotifications();
    } catch (err) {
      console.error('Failed to mark all read:', err);
    }
  };

  const formatTimeAgo = (dateString) => {
    const now = new Date();
    const date = new Date(dateString);
    const seconds = Math.floor((now - date) / 1000);

    if (seconds < 60) return 'Just now';
    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) return `${minutes}m ago`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours}h ago`;
    const days = Math.floor(hours / 24);
    if (days === 1) return 'Yesterday';
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  // Poll for notifications every 60 seconds
  useEffect(() => {
    fetchNotifications();
    const interval = setInterval(fetchNotifications, 60000);
    return () => clearInterval(interval);
  }, []);

  // Load theme preference defaults on dashboard mount
  useEffect(() => {
    const storedTheme = localStorage.getItem('crackit_theme');
    if (!storedTheme) {
      setManualTheme('dark');
    }
  }, [setManualTheme]);

  // Click outside listener for dropdowns
  useEffect(() => {
    const handleOutsideClick = (e) => {
      // Don't close if clicking inside notification or profile toggles
      if (!e.target.closest('.no-close-dropdown')) {
        setIsNotificationOpen(false);
        setIsProfileOpen(false);
      }
    };
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        setIsMobileSidebarOpen(false);
        setIsNotificationOpen(false);
        setIsProfileOpen(false);
      }
    };
    window.addEventListener('click', handleOutsideClick);
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('click', handleOutsideClick);
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/login', { replace: true });
  };

  const getInitials = (name) => {
    if (!name) return 'ST';
    return name
      .split(' ')
      .map(part => part[0])
      .slice(0, 2)
      .join('')
      .toUpperCase();
  };

  const getGreeting = () => {
    const hour = new Date().getHours();
    const firstName = user?.name ? user.name.split(' ')[0] : 'Student';
    if (hour < 12) return `Good morning, ${firstName} 👋`;
    if (hour < 17) return `Good afternoon, ${firstName} 👋`;
    return `Good evening, ${firstName} 👋`;
  };

  const navItems = [
    { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
    { name: 'Study Library', path: '/dashboard/syllabus', icon: Compass },
    { name: 'Previous Papers', path: '/dashboard/papers', icon: FileText },
    { name: 'Mock Tests', path: '/dashboard/mocktests', icon: HelpCircle },
    { name: 'My Results', path: '/dashboard/results', icon: Award },
    { name: 'AI Mentor', path: '/dashboard/ai-assistant', icon: Bot },
    { name: 'Current Affairs', path: '/dashboard/current-affairs', icon: Newspaper },
    { name: 'Exam Updates', path: '/dashboard/exam-updates', icon: BellRing },
    { name: 'Profile', path: '/dashboard/profile', icon: User }
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
                <span className="text-[9px] bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20 px-1.5 py-0.5 rounded font-semibold">TNPSC</span>
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
                        ? 'bg-gradient-to-tr from-blue-600 to-indigo-600 text-white shadow-lg shadow-blue-600/15'
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
              <Link 
                to="/dashboard/profile"
                onClick={() => setIsMobileSidebarOpen(false)}
                className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600/10 to-indigo-600/10 hover:from-blue-600/20 hover:to-indigo-600/20 text-blue-600 dark:text-blue-400 border border-blue-500/15 flex items-center justify-center cursor-pointer transition-all duration-200"
              >
                <User size={16} />
              </Link>
              <div className="absolute left-16 top-1/2 -translate-y-1/2 bg-slate-900 text-white text-xs px-2.5 py-1.5 rounded-md opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity duration-200 z-50 whitespace-nowrap shadow-xl">
                Profile Settings
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
            <div className="flex items-center gap-3 px-2">
              <div className="w-10 h-10 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-blue-600 dark:text-blue-500 border border-slate-200 dark:border-slate-700 flex-shrink-0">
                <User size={18} />
              </div>
              <div className="overflow-hidden">
                <h6 className="text-sm font-bold text-slate-900 dark:text-white truncate">{user?.name || 'Mohamed Sabeek'}</h6>
                <p className="text-xs text-slate-500 truncate">{user?.email || 'sabeek@gmail.com'}</p>
              </div>
            </div>
            <button 
              onClick={handleLogout}
              className="flex items-center justify-center gap-2 px-4 py-3 bg-red-500/5 border border-red-500/10 hover:bg-red-500/10 text-red-650 dark:text-red-400 rounded-xl text-sm font-semibold transition-colors duration-200 cursor-pointer w-full"
            >
              <LogOut size={16} />
              <span>Logout</span>
            </button>
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
              <div className="hidden md:flex w-8 h-8 rounded-xl bg-blue-500/10 text-blue-500 dark:bg-blue-500/[0.06] items-center justify-center">
                {React.createElement(
                  navItems.find(item => location.pathname === item.path)?.icon || LayoutDashboard,
                  { size: 16 }
                )}
              </div>
              <span className="text-sm md:text-base font-extrabold text-slate-900 dark:text-white tracking-tight">
                {getActiveTabName()}
              </span>
            </div>

            {/* RIGHT: Actions Panel */}
            <div className="flex items-center gap-3">
              {/* 1. Date Capsule */}
              <div className="hidden sm:flex items-center gap-2 text-slate-500 dark:text-slate-400 text-[11px] font-extrabold uppercase tracking-wider bg-slate-100/60 dark:bg-slate-900/40 px-3 py-1.5 rounded-xl border border-slate-200/40 dark:border-slate-800/30">
                <Calendar size={13} className="text-blue-500" />
                <span>{new Date().toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}</span>
              </div>

              {/* 2. Theme Toggle (Desktop Only) */}
              <div className="hidden sm:block">
                <ThemeToggle />
              </div>

              {/* 3. Notifications */}
              <div className="relative no-close-dropdown" onClick={(e) => e.stopPropagation()}>
                <button 
                  onClick={() => {
                    setIsNotificationOpen(!isNotificationOpen);
                    setIsProfileOpen(false);
                  }}
                  className="relative w-8 h-8 flex items-center justify-center hover:bg-slate-100 dark:hover:bg-slate-900 border border-slate-200/40 dark:border-slate-800/30 rounded-xl text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-all cursor-pointer"
                >
                  <Bell size={15} />
                  {unreadCount > 0 && (
                    <span className="absolute -top-1.5 -right-1.5 min-w-5 h-5 px-1 bg-blue-600 text-[8px] font-black text-white rounded-full flex items-center justify-center border-2 border-white dark:border-slate-950 shadow-sm animate-pulse">
                      {unreadCount}
                    </span>
                  )}
                </button>
                
                {isNotificationOpen && (
                  <div className="absolute -right-14 sm:right-0 mt-2.5 w-[300px] min-[375px]:w-[320px] sm:w-80 bg-white dark:bg-slate-900 border border-slate-150 dark:border-slate-800/60 rounded-2xl shadow-xl p-3 sm:p-4 z-[100] space-y-3.5 animate-in fade-in slide-in-from-top-2 duration-150">
                    <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-2">
                      <span className="text-[10px] font-extrabold text-slate-900 dark:text-white uppercase tracking-wider">Alerts & Notifications</span>
                      <div className="flex items-center gap-2">
                        {unreadCount > 0 && (
                          <button 
                            onClick={markAllAsRead} 
                            className="text-[9px] text-blue-500 hover:text-blue-600 font-extrabold uppercase hover:underline cursor-pointer"
                          >
                            Mark All Read
                          </button>
                        )}
                        <span className="text-[9px] bg-blue-500/10 text-blue-500 px-1.5 py-0.5 rounded-md font-extrabold uppercase">
                          {unreadCount} New
                        </span>
                      </div>
                    </div>
                    <div className="space-y-2 max-h-64 overflow-y-auto pr-1">
                      {notifications.length === 0 ? (
                        <div className="text-center py-6 text-slate-400 dark:text-slate-500 text-[10px] font-bold uppercase tracking-wider">
                          No new notifications
                        </div>
                      ) : (
                        notifications.map((n) => (
                          <div 
                            key={n._id}
                            onClick={() => {
                              if (!n.isRead) markAsRead(n._id);
                              setIsNotificationOpen(false);
                            }}
                            className={`relative text-xs p-2.5 rounded-xl transition-all cursor-pointer border ${
                              n.isRead 
                                ? 'bg-transparent border-transparent hover:bg-slate-50/50 dark:hover:bg-slate-950/20' 
                                : 'bg-blue-50/40 dark:bg-blue-950/10 border-blue-500/10 hover:bg-blue-50/60 dark:hover:bg-blue-950/20'
                            }`}
                          >
                            <div className="flex items-start justify-between gap-2">
                              <p className="font-extrabold text-slate-850 dark:text-slate-200 text-[11px] leading-tight">
                                {n.title}
                              </p>
                              {!n.isRead && (
                                <span className="w-1.5 h-1.5 rounded-full bg-blue-600 flex-shrink-0 mt-1"></span>
                              )}
                            </div>
                            <p className="text-[10px] text-slate-400 dark:text-slate-500 mt-1 font-medium leading-relaxed">
                              {n.message}
                            </p>
                            <p className="text-[9px] text-slate-400 dark:text-slate-650 mt-1.5 font-bold uppercase tracking-wider">
                              {formatTimeAgo(n.createdAt)}
                            </p>
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                )}
              </div>

              {/* 4. User Profile Dropdown */}
              <div className="relative no-close-dropdown" onClick={(e) => e.stopPropagation()}>
                <button 
                  onClick={() => {
                    setIsProfileOpen(!isProfileOpen);
                    setIsNotificationOpen(false);
                  }}
                  className="flex items-center gap-1.5 hover:opacity-90 transition-opacity cursor-pointer focus:outline-none"
                >
                  <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-600 text-white font-extrabold text-xs flex items-center justify-center shadow-md shadow-blue-500/15">
                    {getInitials(user?.name)}
                  </div>
                  <ChevronDown size={12} className={`text-slate-400 dark:text-slate-500 transition-transform duration-200 ${isProfileOpen ? 'rotate-180' : ''}`} />
                </button>

                {isProfileOpen && (
                  <div className="absolute right-[-12px] sm:right-0 mt-2.5 w-[220px] sm:w-48 bg-white dark:bg-slate-900 border border-slate-150 dark:border-slate-800/60 rounded-2xl shadow-xl py-2 z-[100] animate-in fade-in slide-in-from-top-2 duration-150">
                    <div className="px-4 py-2.5 border-b border-slate-100 dark:border-slate-800">
                      <p className="text-xs font-bold text-slate-900 dark:text-white truncate">{user?.name || 'Mohamed Sabeek'}</p>
                      <p className="text-[10px] text-slate-500 dark:text-slate-400 truncate">{user?.email || 'sabeek@gmail.com'}</p>
                    </div>
                    <div className="p-1 space-y-0.5">
                      <Link 
                        to="/dashboard/profile" 
                        onClick={() => setIsProfileOpen(false)}
                        className="w-full flex items-center gap-2.5 px-3 py-2 text-xs font-bold rounded-xl text-slate-700 dark:text-slate-350 hover:bg-slate-50 dark:hover:bg-slate-950/40 hover:text-blue-500 dark:hover:text-blue-400 transition-colors"
                      >
                        <User size={13} className="text-blue-500" />
                        <span>My Profile</span>
                      </Link>
                      <Link 
                        to="/dashboard/ai-assistant" 
                        onClick={() => setIsProfileOpen(false)}
                        className="w-full flex items-center gap-2.5 px-3 py-2 text-xs font-bold rounded-xl text-slate-700 dark:text-slate-350 hover:bg-slate-50 dark:hover:bg-slate-950/40 hover:text-emerald-500 dark:hover:text-emerald-400 transition-colors"
                      >
                        <Bot size={13} className="text-emerald-500" />
                        <span>AI Mentor</span>
                      </Link>
                      <button 
                        onClick={() => {
                          setIsProfileOpen(false);
                          handleLogout();
                        }}
                        className="w-full flex items-center gap-2.5 px-3 py-2 text-xs font-bold rounded-xl text-red-600 dark:text-red-400 hover:bg-red-500/5 transition-colors cursor-pointer text-left"
                      >
                        <LogOut size={13} className="text-red-500" />
                        <span>Logout</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </header>
        </div>

        {/* MAIN BODY AREA WITH SCROLL & MAX-WIDTH BOUNDARY */}
        <main className="px-6 md:px-8 pb-6 md:pb-8 pt-4 md:pt-6 flex-grow overflow-y-auto w-full">
          <div className="max-w-7xl mx-auto w-full">
            <Outlet />
          </div>
        </main>
      </div>

    </div>
  );
};

export default UserDashboardLayout;
