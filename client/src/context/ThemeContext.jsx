import { createContext, useContext, useState, useEffect } from 'react';

export const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
  const [theme, setTheme] = useState(() => {
    // Check localStorage first
    const storedTheme = localStorage.getItem('crackit_theme');
    if (storedTheme) {
      return storedTheme;
    }
    
    // Otherwise, default to light
    return 'light';
  });

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
