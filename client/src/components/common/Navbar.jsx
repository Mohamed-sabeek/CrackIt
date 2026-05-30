import React, { useState, useEffect } from 'react';
import { Menu, X, BookOpen } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link, useNavigate, useLocation } from 'react-router-dom';

const Navbar = ({ sectionRefs }) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [hoveredIndex, setHoveredIndex] = useState(null);
  const [activeIndex, setActiveIndex] = useState(0); // Home active by default
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);

      // Detect active section on manual scroll
      if (!sectionRefs || location.pathname !== '/') return;

      const scrollPosition = window.scrollY + 160; // offset for floating navbar

      const homePos = sectionRefs.home?.current?.offsetTop || 0;
      const examsPos = sectionRefs.exams?.current?.offsetTop || 0;
      const featuresPos = sectionRefs.features?.current?.offsetTop || 0;
      const aiPos = sectionRefs.ai?.current?.offsetTop || 0;
      const aboutPos = sectionRefs.about?.current?.offsetTop || 0;

      if (scrollPosition >= aboutPos - 80) {
        setActiveIndex(4);
      } else if (scrollPosition >= aiPos - 80) {
        setActiveIndex(3);
      } else if (scrollPosition >= featuresPos - 80) {
        setActiveIndex(2);
      } else if (scrollPosition >= examsPos - 80) {
        setActiveIndex(1);
      } else {
        setActiveIndex(0);
      }
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [sectionRefs, location.pathname]);

  const menuItems = [
    { label: 'Home', targetId: 'home' },
    { label: 'Exams', targetId: 'exams' },
    { label: 'Features', targetId: 'features' },
    { label: 'AI Assistant', targetId: 'ai' },
    { label: 'About', targetId: 'about' },
  ];

  const handleNavClick = (targetId, index) => {
    setActiveIndex(index);
    setIsMobileMenuOpen(false);
    
    if (location.pathname !== '/') {
      navigate('/', { replace: true });
      // Wait for navigation before scrolling
      setTimeout(() => {
        const targetRef = sectionRefs?.[targetId];
        if (targetRef?.current) {
          targetRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }, 300);
      return;
    }

    const targetRef = sectionRefs?.[targetId];
    if (targetRef?.current) {
      targetRef.current.scrollIntoView({
        behavior: 'smooth',
        block: 'start'
      });
    }
  };

  return (
    <motion.header 
      initial={{ y: -50, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
      className={`fixed top-0 left-0 right-0 z-50 px-4 sm:px-6 lg:px-8 transition-all duration-500 ${
        isScrolled ? 'pt-3' : 'pt-5'
      }`}
    >
      <div 
        className={`max-w-6xl mx-auto rounded-full border transition-all duration-500 relative ${
          isScrolled 
            ? 'bg-white/70 backdrop-blur-lg border-slate-200/80 shadow-md py-2.5 px-6 shadow-slate-100/50' 
            : 'bg-white/50 backdrop-blur-md border-slate-100 py-3.5 px-8 shadow-sm'
        }`}
      >
        <div className="flex items-center justify-between">
          
          <div 
            onClick={() => handleNavClick('home', 0)}
            className="flex items-center gap-2.5 cursor-pointer group"
          >
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-tr from-blue-600 to-indigo-600 rounded-xl blur-sm opacity-50 group-hover:opacity-80 transition-opacity"></div>
              <div className="relative bg-gradient-to-tr from-blue-600 to-indigo-600 text-white p-2 rounded-xl shadow-md flex items-center justify-center transition-transform group-hover:scale-105">
                <BookOpen size={18} />
              </div>
            </div>
            <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 tracking-tight">
              Crackit
            </span>
          </div>

          <div className="hidden md:flex items-center gap-1.5 relative z-10">
            {menuItems.map((item, index) => {
              const isActive = activeIndex === index && location.pathname === '/';
              return (
                <button
                  key={index}
                  onClick={() => handleNavClick(item.targetId, index)}
                  onMouseEnter={() => setHoveredIndex(index)}
                  onMouseLeave={() => setHoveredIndex(null)}
                  className={`relative px-4 py-2 text-sm font-medium rounded-full transition-all duration-300 cursor-pointer ${
                    isActive ? 'text-blue-600' : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  <AnimatePresence>
                    {hoveredIndex === index && (
                      <motion.span
                        layoutId="navHoverPill"
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        transition={{ type: 'spring', stiffness: 350, damping: 30 }}
                        className="absolute inset-0 bg-blue-50/60 border border-blue-100/30 rounded-full -z-10"
                      />
                    )}
                  </AnimatePresence>
                  
                  {item.label}

                  {isActive && (
                    <motion.span 
                      layoutId="activeDot"
                      className="absolute bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-gradient-to-r from-blue-600 to-indigo-600"
                    />
                  )}
                </button>
              );
            })}
          </div>

          <div className="hidden md:flex items-center gap-3">
            <Link 
              to="/login"
              className="px-4.5 py-2 text-sm text-slate-600 font-semibold rounded-full border border-slate-200 bg-white/40 hover:bg-slate-50 hover:text-slate-900 transition-all duration-200"
            >
              Login
            </Link>
            <Link 
              to="/register"
              className="relative group overflow-hidden bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-700 text-white text-sm px-5.5 py-2.5 rounded-full font-semibold transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] shadow-md shadow-blue-500/10 hover:shadow-lg hover:shadow-blue-500/20"
            >
              <div className="absolute inset-0 w-1/2 h-full bg-white/20 transform -skew-x-12 -translate-x-full group-hover:animate-shine pointer-events-none"></div>
              Register
            </Link>
          </div>

          <div className="md:hidden">
            <button 
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} 
              className="text-slate-600 p-2 hover:bg-slate-100/60 rounded-full transition-colors cursor-pointer"
            >
              {isMobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {isMobileMenuOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.3 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsMobileMenuOpen(false)}
              className="fixed inset-0 bg-slate-950/20 backdrop-blur-xs z-40 md:hidden"
            />

            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 30, stiffness: 250 }}
              className="fixed right-0 top-0 bottom-0 w-80 max-w-[85vw] bg-white/90 backdrop-blur-xl z-50 shadow-2xl p-6 flex flex-col md:hidden border-l border-slate-200/50"
            >
              <div className="flex items-center justify-between pb-6 border-b border-slate-100 mb-8">
                <div className="flex items-center gap-2">
                  <div className="bg-gradient-to-tr from-blue-600 to-indigo-600 text-white p-2 rounded-xl">
                    <BookOpen size={16} />
                  </div>
                  <span className="text-lg font-bold text-slate-900">Crackit</span>
                </div>
                <button 
                  onClick={() => setIsMobileMenuOpen(false)} 
                  className="text-slate-500 p-1.5 hover:bg-slate-100 rounded-full transition-colors cursor-pointer"
                >
                  <X size={18} />
                </button>
              </div>

              <div className="flex flex-col gap-4">
                {menuItems.map((item, index) => {
                  const isActive = activeIndex === index && location.pathname === '/';
                  return (
                    <button
                      key={index}
                      onClick={() => handleNavClick(item.targetId, index)}
                      className={`text-base font-semibold text-left py-2.5 px-4 rounded-xl transition-all flex items-center justify-between group cursor-pointer ${
                        isActive 
                          ? 'bg-blue-50/80 text-blue-600 border border-blue-100/30' 
                          : 'text-slate-700 hover:text-blue-600 hover:bg-slate-50'
                      }`}
                    >
                      {item.label}
                      <span className={`transition-transform duration-300 ${
                        isActive ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0'
                      } text-blue-600`}>→</span>
                    </button>
                  );
                })}

                <div className="flex flex-col gap-3 pt-6 border-t border-slate-100 mt-4">
                  <Link 
                    to="/login"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="w-full text-center text-slate-700 font-bold py-3 border border-slate-200 rounded-xl bg-white hover:bg-slate-50 transition-all text-sm"
                  >
                    Login
                  </Link>
                  <Link 
                    to="/register"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="w-full text-center bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-bold py-3 rounded-xl hover:from-blue-700 hover:to-indigo-700 transition-all shadow-md shadow-blue-500/10 text-sm"
                  >
                    Register
                  </Link>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </motion.header>
  );
};

export default Navbar;
