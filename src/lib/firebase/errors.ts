export interface NativeFirebaseError extends Error {
  code: string;
  message: string;
  name: string;
  namespace: string;
  nativeErrorCode: string | number;
  nativeErrorMessage: string;
  stack?: string;
  cause?: unknown;
}

/**
 * Custom Firebase Error class that implements NativeFirebaseError interface
 * Allows for instanceof checks and proper error handling
 */
export class FirebaseError extends Error implements NativeFirebaseError {
  code: string;
  namespace: string;
  nativeErrorCode: string | number;
  nativeErrorMessage: string;
  cause?: unknown;

  constructor(
    code: string,
    message: string,
    namespace = 'firebase',
    nativeErrorCode?: string | number,
    nativeErrorMessage?: string,
    cause?: unknown
  ) {
    super(message);
    this.name = 'FirebaseError';
    this.code = code;
    this.namespace = namespace;
    this.nativeErrorCode = nativeErrorCode ?? '';
    this.nativeErrorMessage = nativeErrorMessage ?? '';
    this.cause = cause;

    // Maintains proper stack trace for where our error was thrown (only available on V8)
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, FirebaseError);
    }
  }

  isAuthError(): boolean {
    return this.namespace === 'auth' || this.code.startsWith('auth/');
  }

  isDatabaseError(): boolean {
    return this.namespace === 'database' || this.code.startsWith('database/');
  }

  // TODO: add proper translations
  getUserMessage(): string {
    const authMessages: Record<string, string> = {
      'auth/user-not-found': 'No account found with this email',
      'auth/wrong-password': 'Incorrect password',
      'auth/invalid-email': 'Invalid email address',
      'auth/too-many-requests': 'Too many failed attempts. Please try again later',
      'auth/email-already-in-use': 'Email is already in use',
      'auth/weak-password': 'Password is too weak',
      'auth/network-request-failed': 'Network error. Please check your connection',
    };

    const databaseMessages: Record<string, string> = {
      'database/permission-denied': "Permission denied. You don't have access to this data",
      'database/disconnected': 'Connection to database lost',
      'database/timeout': 'Request timed out',
      'database/unavailable': 'Database is currently unavailable',
    };

    if (this.isAuthError()) {
      return authMessages[this.code] || this.message;
    }

    if (this.isDatabaseError()) {
      return databaseMessages[this.code] || this.message;
    }

    return this.message;
  }

  toJSON(): Record<string, unknown> {
    return {
      name: this.name,
      code: this.code,
      message: this.message,
      namespace: this.namespace,
      nativeErrorCode: this.nativeErrorCode,
      nativeErrorMessage: this.nativeErrorMessage,
      stack: this.stack,
      cause: this.cause,
    };
  }
}

export function isNativeFirebaseError(error: unknown): error is NativeFirebaseError {
  if (!(error instanceof Error)) {
    return false;
  }

  const err = error as Partial<NativeFirebaseError>;
  return (
    typeof err.code === 'string' &&
    typeof err.namespace === 'string' &&
    typeof err.nativeErrorCode !== 'undefined' &&
    typeof err.nativeErrorMessage === 'string'
  );
}

export function isFirebaseError(error: unknown): error is FirebaseError {
  return error instanceof FirebaseError;
}

export function toFirebaseError(error: unknown, fallbackCode = 'unknown'): FirebaseError {
  if (isFirebaseError(error)) {
    return error;
  }

  if (isNativeFirebaseError(error)) {
    return new FirebaseError(
      error.code,
      error.message,
      error.namespace,
      error.nativeErrorCode,
      error.nativeErrorMessage,
      error.cause
    );
  }

  if (error instanceof Error) {
    return new FirebaseError(fallbackCode, error.message, 'firebase', undefined, undefined, error);
  }

  if (typeof error === 'string') {
    return new FirebaseError(fallbackCode, error, 'firebase');
  }

  return new FirebaseError(fallbackCode, 'An unknown error occurred', 'firebase');
}

export const FIREBASE_ERROR_CODES = {
  // Auth errors
  USER_NOT_FOUND: 'auth/user-not-found',
  WRONG_PASSWORD: 'auth/wrong-password',
  INVALID_EMAIL: 'auth/invalid-email',
  TOO_MANY_REQUESTS: 'auth/too-many-requests',
  EMAIL_ALREADY_IN_USE: 'auth/email-already-in-use',
  WEAK_PASSWORD: 'auth/weak-password',
  NETWORK_REQUEST_FAILED: 'auth/network-request-failed',

  // Database errors
  PERMISSION_DENIED: 'database/permission-denied',
  DISCONNECTED: 'database/disconnected',
  TIMEOUT: 'database/timeout',
  UNAVAILABLE: 'database/unavailable',
} as const;

export type FirebaseErrorCode = (typeof FIREBASE_ERROR_CODES)[keyof typeof FIREBASE_ERROR_CODES];
