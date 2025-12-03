import { ReactNode } from 'react';
import { AuthProvider } from './auth-provider';
import { ThemeProvider } from '@/components/ui/useTheme';

interface ProvidersProps {
  children: ReactNode;
}

export const Providers = ({ children }: ProvidersProps) => {
  return (
    <ThemeProvider>
      <AuthProvider>{children}</AuthProvider>
    </ThemeProvider>
  );
};
