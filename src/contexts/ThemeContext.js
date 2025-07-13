import React, { createContext, useState, useMemo, useContext } from 'react';

export const ThemeContext = createContext();

export const useTheme = () => {
    return useContext(ThemeContext);
    }

export const ThemeProvider = ({ children }) => {
  const [theme, setTheme] = useState('dark');

  const value = useMemo(() => ({
    theme,
    setTheme
  }), [theme]);

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
};
