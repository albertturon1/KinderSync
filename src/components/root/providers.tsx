import { ReactNode } from 'react';
import { I18nextProvider } from 'react-i18next';
import { AuthProvider } from './auth-provider';
import { ThemeProvider } from '@/components/ui/useTheme';
import { i18nInstance } from '@/translation';

type ProvidersProps = {
  children: ReactNode;
};

export const Providers = ({ children }: ProvidersProps) => {
  return (
    <I18nextProvider i18n={i18nInstance}>
      <ThemeProvider>
        <AuthProvider>{children}</AuthProvider>
      </ThemeProvider>
    </I18nextProvider>
  );
};
