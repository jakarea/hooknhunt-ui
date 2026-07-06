'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

type Theme = 'light' | 'dark';

interface ThemeContextType {
  theme: Theme;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType>({
  theme: 'light',
  toggleTheme: () => {},
});

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setTheme] = useState<Theme>('dark');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);

    // Detect system theme preference
    const systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';

    // Use system theme (ignore localStorage for system-only mode)
    const themeToUse = systemTheme;
    setTheme(themeToUse);

    // Apply the theme to the DOM
    applyTheme(themeToUse);

    // Listen for system theme changes
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleSystemThemeChange = (e: MediaQueryListEvent) => {
      const newTheme = e.matches ? 'dark' : 'light';
      setTheme(newTheme);
      applyTheme(newTheme);
    };

    mediaQuery.addEventListener('change', handleSystemThemeChange);
    return () => mediaQuery.removeEventListener('change', handleSystemThemeChange);
  }, []);

  const applyTheme = (themeToApply: Theme) => {
    if (themeToApply === 'dark') {
      document.documentElement.classList.add('dark');
      document.documentElement.style.setProperty('--background', '#1f1515');
      document.documentElement.style.setProperty('--foreground', '#ededed');
      document.documentElement.style.colorScheme = 'dark';
      document.body.style.background = '#1f1515';
      document.body.style.color = '#ededed';
      document.body.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
      document.documentElement.style.setProperty('--background', '#ffffff');
      document.documentElement.style.setProperty('--foreground', '#171717');
      document.documentElement.style.colorScheme = 'light';
      document.body.style.background = '#ffffff';
      document.body.style.color = '#171717';
      document.body.classList.remove('dark');
    }
  };

  // Theme is now controlled by system preference only
  // This function is kept for backwards compatibility but does nothing
  const toggleTheme = () => {
    // Theme toggling disabled - using system preference only
  };

  // Prevent hydration mismatch
  if (!mounted) {
    return (
      <ThemeContext.Provider value={{ theme: 'dark', toggleTheme }}>
        {children}
      </ThemeContext.Provider>
    );
  }

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  return context;
}
