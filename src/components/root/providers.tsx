import { ReactNode } from 'react';
import { ThemeProvider } from '@/components/ui/useTheme';

type ProvidersProps = {
  children: ReactNode;
};

export const Providers = ({ children }: ProvidersProps) => {
  return <ThemeProvider>{children}</ThemeProvider>;
};
