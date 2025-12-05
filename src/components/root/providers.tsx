import { ReactNode } from 'react';
import { AuthProvider } from './auth-provider';
import { SafeAreaProvider } from 'react-native-safe-area-context';

interface ProvidersProps {
  children: ReactNode;
}

export const Providers = ({ children }: ProvidersProps) => {
  return (
    <SafeAreaProvider>
      <AuthProvider>{children}</AuthProvider>
    </SafeAreaProvider>
  );
};
