import React from 'react';
import { useTheme } from '../../hooks/useTheme';
import { motion, AnimatePresence } from 'framer-motion';
import { Sun, Moon } from 'lucide-react';

const ThemeToggle = ({ className = '' }) => {
  const { theme, toggleTheme } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      className={`relative p-2.5 rounded-full flex items-center justify-center transition-all duration-300 outline-none overflow-hidden border cursor-pointer ${
        theme === 'dark'
          ? 'bg-slate-900/60 border-slate-800 text-amber-400 hover:bg-slate-800/80 hover:text-amber-300'
          : 'bg-white/60 border-slate-200 text-slate-700 hover:bg-slate-100/80 hover:text-slate-900 shadow-sm'
      } ${className}`}
      aria-label="Toggle Theme Mode"
    >
      <AnimatePresence mode="wait" initial={false}>
        <motion.div
          key={theme}
          initial={{ y: -20, rotate: -90, opacity: 0 }}
          animate={{ y: 0, rotate: 0, opacity: 1 }}
          exit={{ y: 20, rotate: 90, opacity: 0 }}
          transition={{ duration: 0.25, ease: 'easeInOut' }}
          className="flex items-center justify-center"
        >
          {theme === 'dark' ? (
            <Sun size={18} className="stroke-[2.2]" />
          ) : (
            <Moon size={18} className="stroke-[2.2]" />
          )}
        </motion.div>
      </AnimatePresence>
    </button>
  );
};

export default ThemeToggle;
