import { UserProfile } from '@/lib/validation/schemas';
import { SignInError, SignOutError, SignUpError } from './auth.errors';
import { NormalizedError } from '@/errors/createErrorNormalizer';

export type SignInResult =
  | { success: true }
  | { success: false; error: NormalizedError<SignInError> };

export type SignUpResult =
  | { success: true }
  | { success: false; error: NormalizedError<SignUpError> };

export type SignOutResult =
  | { success: true }
  | { success: false; error: NormalizedError<SignOutError> };

export interface FirebaseAuthUser {
  uid: string;
  email: string | null;
}

export interface FirebaseAuthApi {
  signIn: (email: string, pass: string) => Promise<SignInResult>;
  signUp: (email: string, pass: string, profile: UserProfile) => Promise<SignUpResult>;
  signOut: () => Promise<SignOutResult>;
  onAuthStateChanged: (callback: (user: FirebaseAuthUser | null) => void) => () => void;
}

export const createFirebaseAuth = (impl: FirebaseAuthApi) => impl;
