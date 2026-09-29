import React, { createContext, useContext, useState, useEffect } from 'react';
import { useColorScheme } from 'react-native';

type Theme = 'light' | 'dark' | 'system' | 'purple' | 'green' | 'gold';

interface ThemeColors {
  primary: string;
  background: string;
  card: string;
  text: string;
  border: string;
  notification: string;
  accent: string;
}

const themes: Record<Theme, ThemeColors> = {
  light: {
    primary: '#6366f1',
    background: '#f8fafc',
    card: '#ffffff',
    text: '#1e293b',
    border: '#e2e8f0',
    notification: '#ef4444',
    accent: '#8b5cf6',
  },
  dark: {
    primary: '#818cf8',
    background: '#0f172a',
    card: '#1e293b',
    text: '#f8fafc',
    border: '#334155',
    notification: '#ef4444',
    accent: '#a78bfa',
  },
  purple: {
    primary: '#8b5cf6',
    background: '#f5f3ff',
    card: '#ffffff',
    text: '#1e293b',
    border: '#ddd6fe',
    notification: '#ef4444',
    accent: '#6366f1',
  },
  green: {
    primary: '#10b981',
    background: '#f0fdf4',
    card: '#ffffff',
    text: '#1e293b',
    border: '#d1fae5',
    notification: '#ef4444',
    accent: '#059669',
  },
  gold: {
    primary: '#f59e0b',
    background: '#fffbeb',
    card: '#ffffff',
    text: '#1e293b',
    border: '#fef3c7',
    notification: '#ef4444',
    accent: '#d97706',
  },
  system: {
    primary: '#6366f1',
    background: '#f8fafc',
    card: '#ffffff',
    text: '#1e293b',
    border: '#e2e8f0',
    notification: '#ef4444',
    accent: '#8b5cf6',
  },
};

type ThemeContextType = {
  theme: Theme;
  colors: ThemeColors;
  setTheme: (theme: Theme) => void;
};

const ThemeContext = createContext<ThemeContextType>({
  theme: 'system',
  colors: themes.system,
  setTheme: () => {},
});

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const systemColorScheme = useColorScheme();
  const [theme, setTheme] = useState<Theme>('system');

  const getColors = (selectedTheme: Theme): ThemeColors => {
    if (selectedTheme === 'system') {
      return systemColorScheme === 'dark' ? themes.dark : themes.light;
    }
    return themes[selectedTheme];
  };

  const colors = getColors(theme);

  return (
    <ThemeContext.Provider value={{ theme, colors, setTheme }}>
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