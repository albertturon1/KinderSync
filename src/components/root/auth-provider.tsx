import React, {
  createContext,
  useContext,
  useEffect,
  useReducer,
  useMemo,
  useCallback,
} from 'react';
import {
  FirebaseAuthTypes,
  getAuth,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signOut,
} from '@react-native-firebase/auth';
import { getDatabase, onValue, ref } from '@react-native-firebase/database';
import { UserProfile as UserProfileType, UserProfileSchema } from 'lib/validation/schemas';
import { FirebaseError, toFirebaseError,  } from 'lib/firebase/errors';

export type UserProfile = UserProfileType;
export type UserProfileRole = UserProfileType['role'];

export type AuthStatus = 'idle' | 'loading' | 'authenticated' | 'unauthenticated' | 'error';

export interface UserPermissions {
  canWriteActivity: boolean;
  canViewGallery: boolean;
  canManageBilling: boolean;
}

interface AuthState {
  status: AuthStatus;
  user: FirebaseAuthTypes.User | null;
  profile: UserProfileType | null;
  permissions: UserPermissions;
  error: FirebaseError | null;
  isLoading: boolean;
}

type AuthAction =
  | { type: 'AUTH_LOADING' }
  | { type: 'AUTH_SUCCESS'; user: FirebaseAuthTypes.User }
  | { type: 'AUTH_ERROR'; error: FirebaseError }
  | { type: 'PROFILE_LOADING' }
  | { type: 'PROFILE_SUCCESS'; profile: UserProfileType }
  | { type: 'PROFILE_ERROR'; error: FirebaseError }
  | { type: 'CLEAR_ERROR' }
  | { type: 'RESET' };

interface AuthContextData {
  state: AuthState;
  login: (
    email: string,
    password: string
  ) => Promise<{ success: true } | { success: false; error: FirebaseError }>;
  logout: () => Promise<{ success: true } | { success: false; error: FirebaseError }>;
  clearError: () => void;
  getErrorMessage: () => string;
}

const INITIAL_PERMISSIONS: UserPermissions = {
  canWriteActivity: false,
  canViewGallery: false,
  canManageBilling: false,
};

const calculatePermissions = (profile: UserProfile | null): UserPermissions => {
  if (!profile) return INITIAL_PERMISSIONS;

  switch (profile.role) {
    case 'teacher':
      return {
        canWriteActivity: true,
        canViewGallery: true,
        canManageBilling: false,
      };
    case 'parent':
      return {
        canWriteActivity: false,
        canViewGallery: true,
        canManageBilling: profile.isPayer,
      };
    case 'manager':
      return {
        canWriteActivity: true,
        canViewGallery: true,
        canManageBilling: true,
      };
    default:
      return INITIAL_PERMISSIONS;
  }
};

const initialState: AuthState = {
  status: 'idle',
  user: null,
  profile: null,
  permissions: INITIAL_PERMISSIONS,
  error: null,
  isLoading: true,
};

const authReducer = (state: AuthState, action: AuthAction): AuthState => {
  switch (action.type) {
    case 'AUTH_LOADING':
      return {
        ...state,
        isLoading: true,
        error: null,
      };

    case 'AUTH_SUCCESS':
      return {
        ...state,
        status: 'authenticated',
        user: action.user,
        isLoading: false,
        error: null,
      };

    case 'AUTH_ERROR':
      return {
        ...state,
        status: 'error',
        user: null,
        profile: null,
        permissions: INITIAL_PERMISSIONS,
        error: action.error,
        isLoading: false,
      };

    case 'PROFILE_LOADING':
      return {
        ...state,
        isLoading: state.user !== null,
        error: null,
      };

    case 'PROFILE_SUCCESS':
      return {
        ...state,
        profile: action.profile,
        permissions: calculatePermissions(action.profile),
        isLoading: false,
        error: null,
      };

    case 'PROFILE_ERROR':
      return {
        ...state,
        profile: null,
        permissions: INITIAL_PERMISSIONS,
        error: action.error,
        isLoading: false,
      };

    case 'CLEAR_ERROR':
      return {
        ...state,
        error: null,
      };

    case 'RESET':
      return {
        ...initialState,
        status: 'unauthenticated',
        isLoading: false,
      };

    default:
      return state;
  }
};

const AuthContext = createContext<AuthContextData | undefined>(undefined);

interface AuthProviderProps {
  children: React.ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [state, dispatch] = useReducer(authReducer, initialState);

  const getErrorMessage = useCallback((): string => {
    if (!state.error) return '';
    return state.error.getUserMessage();
  }, [state.error]);

  const clearError = useCallback(() => {
    dispatch({ type: 'CLEAR_ERROR' });
  }, []);

  useEffect(() => {
    dispatch({ type: 'AUTH_LOADING' });

    const subscriber = onAuthStateChanged(getAuth(), (firebaseUser) => {
      if (firebaseUser) {
        dispatch({ type: 'AUTH_SUCCESS', user: firebaseUser });
      } else {
        dispatch({ type: 'RESET' });
      }
    });

    return subscriber;
  }, []);

  useEffect(() => {
    if (!state.user) return;

    dispatch({ type: 'PROFILE_LOADING' });

    const usersRef = ref(getDatabase(), `/users/${state.user.uid}`);

    const onProfileChange = onValue(
      usersRef,
      (snapshot) => {
        const data = snapshot.val();

        if (data) {
          const profileResult = UserProfileSchema.safeParse(data);
          if (profileResult.success) {
            dispatch({ type: 'PROFILE_SUCCESS', profile: profileResult.data });
          } else {
            const error = toFirebaseError(
              `Invalid profile data: ${profileResult.error.message}`,
              'database/invalid-data'
            );
            dispatch({ type: 'PROFILE_ERROR', error });
          }
        } else {
          const error = toFirebaseError(
            'User authenticated but no profile found in DB',
            'database/not-found'
          );
          dispatch({ type: 'PROFILE_ERROR', error });
        }
      },
      (err) => {
        const firebaseError = toFirebaseError(err, 'database/unknown');
        dispatch({ type: 'PROFILE_ERROR', error: firebaseError });
      }
    );

    return () => {
      usersRef.off('value', onProfileChange);
    };
  }, [state.user, state.isLoading]);

  const login = useCallback(
    async (
      email: string,
      password: string
    ): Promise<{ success: true } | { success: false; error: FirebaseError }> => {
      try {
        await signInWithEmailAndPassword(getAuth(), email, password);
        return { success: true };
      } catch (error) {
        const firebaseError = toFirebaseError(error, 'auth/unknown');
        return { success: false, error: firebaseError };
      }
    },
    []
  );

  const logout = useCallback(async (): Promise<
    { success: true } | { success: false; error: FirebaseError }
  > => {
    try {
      await signOut(getAuth());
      return { success: true };
    } catch (error) {
      const firebaseError = toFirebaseError(error, 'auth/unknown');
      return { success: false, error: firebaseError };
    }
  }, []);

  const value = useMemo(
    () => ({
      state,
      login,
      logout,
      clearError,
      getErrorMessage,
    }),
    [state, login, logout, clearError, getErrorMessage]
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
