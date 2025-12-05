import { z } from 'zod';

export const FirebaseErrorSchema = z.object({
  code: z.string(),
});

export const SIGNIN_ERRORS = [
  'auth/user-not-found',
  'auth/wrong-password',
  'auth/invalid-email',
  'auth/weak-password',
  'auth/network-error',
  'auth/too-many-requests',
  'auth/internal-error',
] as const;

export const SIGNUP_ERRORS = [
  'auth/email-already-in-use',
  'auth/operation-not-allowed',
  'auth/invalid-email',
  'auth/weak-password',
  'auth/network-error',
  'auth/too-many-requests',
  'auth/internal-error',
] as const;

export const SIGNOUT_ERRORS = ['auth/internal-error', 'auth/unknown-error'] as const;

export type SignInError = (typeof SIGNIN_ERRORS)[number];
export type SignUpError = (typeof SIGNUP_ERRORS)[number];
export type SignOutError = (typeof SIGNOUT_ERRORS)[number];
