import React, { createContext, useContext, useState, useEffect } from 'react';
import type { ReactNode } from 'react';

export type ThemeType = 'light' | 'dark';

export interface ThemeColors {
  background: string;
  foreground: string;
  card: string;
  cardForeground: string;
  primary: string;
  secondary: string;
  accent: string;
  accentForeground: string;
  muted: string;
  mutedForeground: string;
  border: string;
  glassBg: string;
  glassBorder: string;
  glassShadow: any;
  shadow: any;
  cardBorder: string;
  uniformPastelBg: string;
  uniformPastelText: string;
  uniformPastelBorder: string;
  uniformMenuBg: string;
  uniformMenuBorder: string;
}

const lightColors: ThemeColors = {
  background: '#EDF4F6', // Soft cool teal-tinted background matching primary theme
  foreground: '#0F172A',
  card: '#FFFFFF', // Pure clean white card background to pop out
  cardForeground: '#0F172A',
  primary: '#006B78', // HSL: 187 100% 25% (Teal)
  secondary: '#E65C00', // HSL: 24 100% 45% (Orange)
  accent: '#D0ECEF', // Accent color matching primary teal
  accentForeground: '#004F59',
  muted: '#E2ECEF', // Muted background color matching theme
  mutedForeground: '#475569',
  border: '#C0D3D6', // Light teal-gray border matching background
  glassBg: 'rgba(255, 255, 255, 0.55)',
  glassBorder: 'rgba(255, 255, 255, 0.5)',
  glassShadow: {
    shadowColor: '#004F59',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 16,
    elevation: 2,
  },
  shadow: {
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 3,
  },
  cardBorder: 'rgba(0, 107, 120, 0.06)',
  uniformPastelBg: '#E0F2F1',
  uniformPastelText: '#004D5A',
  uniformPastelBorder: '#B2DFDB',
  uniformMenuBg: '#E6F4F8',
  uniformMenuBorder: '#B9DFE6',
};

const darkColors: ThemeColors = {
  background: '#080F1D', // HSL: 222 47% 6%
  foreground: '#F8FAFC',
  card: '#0D1627', // HSL: 222 47% 9%
  cardForeground: '#F8FAFC',
  primary: '#00A3B8', // HSL: 187 100% 40% (Light Teal)
  secondary: '#FF7300', // HSL: 24 100% 55%
  accent: '#002E36', // HSL: 187 100% 12%
  accentForeground: '#D1FAFF',
  muted: '#14213B', // HSL: 222 47% 14%
  mutedForeground: '#9CA3AF',
  border: '#1E2F4C', // HSL: 222 47% 16%
  glassBg: 'rgba(10, 16, 30, 0.6)',
  glassBorder: 'rgba(255, 255, 255, 0.09)',
  glassShadow: {
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.4,
    shadowRadius: 20,
    elevation: 8,
  },
  shadow: {
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.3,
    shadowRadius: 15,
    elevation: 6,
  },
  cardBorder: 'rgba(255, 255, 255, 0.06)',
  uniformPastelBg: '#112E35',
  uniformPastelText: '#80DEEA',
  uniformPastelBorder: '#1A4B54',
  uniformMenuBg: '#0E2328',
  uniformMenuBorder: '#1A3B42',
};

interface ThemeContextProps {
  theme: ThemeType;
  toggleTheme: () => void;
  setTheme: (theme: ThemeType) => void;
  colors: ThemeColors;
}

const ThemeContext = createContext<ThemeContextProps | undefined>(undefined);

export const ThemeProvider = ({ children }: { children: ReactNode }) => {
  const [theme, setThemeState] = useState<ThemeType>('light');

  const setTheme = (newTheme: ThemeType) => {
    setThemeState(newTheme);
  };

  const toggleTheme = () => {
    setThemeState((prev) => (prev === 'light' ? 'dark' : 'light'));
  };

  const colors = theme === 'light' ? lightColors : darkColors;

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme, setTheme, colors }}>
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
