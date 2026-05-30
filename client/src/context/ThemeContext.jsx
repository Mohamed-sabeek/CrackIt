import React, { createContext, useContext, useState, useEffect } from 'react';

export const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
  const [theme, setTheme] = useState(() => {
    // Check localStorage first
    const storedTheme = localStorage.getItem('crackit_theme');
    if (storedTheme) {
      return storedTheme;
    }
    
    // Otherwise, check current path to determine default
    const isDashboard = window.location.pathname.includes('/dashboard');
    return isDashboard ? 'dark' : 'light';
  });

  // Track page change to adjust default theme if no user manual setting exists
  useEffect(() => {
    const storedTheme = localStorage.getItem('crackit_theme');
    if (!storedTheme) {
      const handlePathChange = () => {
        const isDashboard = window.location.pathname.includes('/dashboard');
        const defaultTheme = isDashboard ? 'dark' : 'light';
        setTheme(defaultTheme);
      };

      // Listen to path updates
      window.addEventListener('popstate', handlePathChange);
      return () => window.removeEventListener('popstate', handlePathChange);
    }
  }, []);

  // Sync theme changes with DOM element and localStorage
  useEffect(() => {
    const root = document.documentElement;
    const isLandingPage = window.location.pathname === '/';
    
    if (theme === 'dark' && !isLandingPage) {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
  }, [theme, window.location.pathname]);

  const toggleTheme = () => {
    const nextTheme = theme === 'dark' ? 'light' : 'dark';
    setTheme(nextTheme);
    localStorage.setItem('crackit_theme', nextTheme);
  };

  const setManualTheme = (newTheme) => {
    setTheme(newTheme);
    localStorage.setItem('crackit_theme', newTheme);
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme, setManualTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};
