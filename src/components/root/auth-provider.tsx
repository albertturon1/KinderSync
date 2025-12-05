import React, { createContext, useContext, useMemo, useCallback, useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { firebaseAuth } from '@/lib/firebase/auth/auth';
import { FirebaseAuthUser } from '@/lib/firebase/auth/auth.api';
import { UserProfile } from '@/lib/validation/schemas';

interface SignInAuthError {
  type: 'INVALID_CREDENTIALS' | 'NETWORK_ERROR' | 'TOO_MANY_ATTEMPTS' | 'UNKNOWN';
  userMessage: string;
}

interface SignUpAuthError {
  type: 'EMAIL_IN_USE' | 'WEAK_PASSWORD' | 'INVALID_EMAIL' | 'NETWORK_ERROR' | 'UNKNOWN';
  userMessage: string;
}

interface SignOutAuthError {
  type: 'UNKNOWN';
  userMessage: string;
}

type AuthSignInResult = { success: true } | { success: false; error: SignInAuthError };
type AuthSignUpResult = { success: true } | { success: false; error: SignUpAuthError };
type AuthSignOutResult = { success: true } | { success: false; error: SignOutAuthError };

interface AuthContextData {
  user: FirebaseAuthUser | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<AuthSignInResult>;
  signUp: (email: string, password: string, profile: UserProfile) => Promise<AuthSignUpResult>;
  signOut: () => Promise<AuthSignOutResult>;
}

const AuthContext = createContext<AuthContextData | undefined>(undefined);

interface AuthProviderProps {
  children: React.ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const { t } = useTranslation();
  const [user, setUser] = useState<FirebaseAuthUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const subscriber = firebaseAuth.onAuthStateChanged((firebaseUser) => {
      setUser(firebaseUser);
      setLoading(false);
    });

    return subscriber;
  }, []);

  const signIn = useCallback(
    async (email: string, password: string): Promise<AuthSignInResult> => {
      const result = await firebaseAuth.signIn(email, password);
      if (!result.success) {
        let error: SignInAuthError;
        switch (result.error.type) {
          case 'auth/user-not-found':
          case 'auth/wrong-password':
            error = {
              type: 'INVALID_CREDENTIALS',
              userMessage: t('auth.signIn.errors.invalidCredentials'),
            };
            break;
          case 'auth/too-many-requests':
            error = {
              type: 'TOO_MANY_ATTEMPTS',
              userMessage: t('auth.signIn.errors.tooManyRequests'),
            };
            break;
          case 'auth/network-error':
            error = { type: 'NETWORK_ERROR', userMessage: t('auth.signIn.errors.networkError') };
            break;
          default:
            error = { type: 'UNKNOWN', userMessage: t('auth.signIn.errors.signInFailed') };
        }

        return { success: false, error };
      }

      return result;
    },
    [t]
  );

  const signUp = useCallback(
    async (email: string, password: string, profile: UserProfile): Promise<AuthSignUpResult> => {
      const result = await firebaseAuth.signUp(email, password, profile);
      if (!result.success) {
        let error: SignUpAuthError;
        switch (result.error.type) {
          case 'auth/email-already-in-use':
            error = {
              type: 'EMAIL_IN_USE',
              userMessage: t('auth.signUp.errors.emailAlreadyInUse'),
            };
            break;
          case 'auth/weak-password':
            error = { type: 'WEAK_PASSWORD', userMessage: t('auth.signUp.errors.weakPassword') };
            break;
          case 'auth/invalid-email':
            error = { type: 'INVALID_EMAIL', userMessage: t('auth.signUp.errors.invalidEmail') };
            break;
          case 'auth/network-error':
            error = { type: 'NETWORK_ERROR', userMessage: t('auth.signIn.errors.networkError') };
            break;
          default:
            error = { type: 'UNKNOWN', userMessage: t('auth.signUp.errors.registrationFailed') };
        }

        return { success: false, error };
      }

      return result;
    },
    [t]
  );

  const signOut = useCallback(async () => {
    const result = await firebaseAuth.signOut();
    if (!result.success) {
      const error: SignOutAuthError = { type: 'UNKNOWN', userMessage: t('auth.errors.generic') }
      return { success: false, error: error };
    }

    return result;
  }, [t]);

  const value = useMemo(
    () => ({
      user,
      loading,
      signIn,
      signUp,
      signOut,
    }),
    [user, loading, signIn, signUp, signOut]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
