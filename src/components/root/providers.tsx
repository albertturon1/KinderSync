import { ReactNode } from 'react';
import { AuthProvider } from './auth-provider';

interface ProvidersProps {
  children: ReactNode;
}

export const Providers = ({ children }: ProvidersProps) => {
  return <AuthProvider>{children}</AuthProvider>;
};
