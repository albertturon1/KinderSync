import { createContext, useContext, useState, ReactNode, useCallback, useMemo } from 'react';

export type ThemeMode = 'light' | 'dark';

export const spacing = {
  0: 0,
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  '2xl': 48,
  '3xl': 64,
  screen: {
    horizontal: 16,
    vertical: 12,
  },
};

export const borderRadius = {
  none: 0,
  sm: 4,
  md: 8,
  lg: 12,
  xl: 16,
  '2xl': 20,
  '3xl': 24,
  full: 9999,
};

export type ThemeColors = {
  background: string;
  foreground: string;
  primary: string;
  primaryForeground: string;
  secondary: string;
  secondaryForeground: string;
  muted: string;
  mutedForeground: string;
  accent: string;
  accentForeground: string;
  destructive: string;
  destructiveForeground: string;
  border: string;
  input: string;
  ring: string;
  card: string;
  cardForeground: string;
  popover: string;
  popoverForeground: string;
};

export type ThemeColor = keyof ThemeColors;

export interface Theme {
  mode: ThemeMode;
  colors: ThemeColors;
  spacing: typeof spacing;
  borderRadius: typeof borderRadius;
  setMode: (mode: ThemeMode) => void;
  toggleMode: () => void;
}

const lightColors: ThemeColors = {
  background: '#FFFFFF',
  foreground: '#0A0A0A',
  primary: '#171717',
  primaryForeground: '#FFFFFF',
  secondary: '#F5F5F5',
  secondaryForeground: '#0A0A0A',
  muted: '#F5F5F5',
  mutedForeground: '#737373',
  accent: '#F5F5F5',
  accentForeground: '#0A0A0A',
  destructive: '#DC2626',
  destructiveForeground: '#FFFFFF',
  border: '#E5E5E5',
  input: '#E5E5E5',
  ring: '#0A0A0A',
  card: '#FFFFFF',
  cardForeground: '#0A0A0A',
  popover: '#FFFFFF',
  popoverForeground: '#0A0A0A',
};

const darkColors: ThemeColors = {
  background: '#0A0A0A',
  foreground: '#FAFAFA',
  primary: '#FAFAFA',
  primaryForeground: '#0A0A0A',
  secondary: '#262626',
  secondaryForeground: '#FAFAFA',
  muted: '#262626',
  mutedForeground: '#A1A1AA',
  accent: '#262626',
  accentForeground: '#FAFAFA',
  destructive: '#DC2626',
  destructiveForeground: '#FFFFFF',
  border: '#262626',
  input: '#262626',
  ring: '#D4D4D8',
  card: '#0A0A0A',
  cardForeground: '#FAFAFA',
  popover: '#0A0A0A',
  popoverForeground: '#FAFAFA',
};

const ThemeContext = createContext<Theme | undefined>(undefined);

export interface ThemeProviderProps {
  children: ReactNode;
}

export const ThemeProvider = ({ children }: ThemeProviderProps) => {
  const [mode, setMode] = useState<ThemeMode>('light');

  const toggleMode = useCallback(() => {
    setMode((prevMode) => (prevMode === 'light' ? 'dark' : 'light'));
  }, []);

  const theme: Theme = useMemo(
    () => ({
      mode,
      colors: mode === 'light' ? lightColors : darkColors,
      spacing,
      borderRadius,
      setMode,
      toggleMode,
    }),
    [mode, toggleMode]
  );

  return <ThemeContext.Provider value={theme}>{children}</ThemeContext.Provider>;
};

export const useTheme = () => {
  const theme = useContext(ThemeContext);
  if (!theme) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return theme;
};
