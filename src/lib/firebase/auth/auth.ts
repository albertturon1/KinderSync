import {
  FirebaseAuthTypes,
  getAuth,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
} from '@react-native-firebase/auth';
import { createFirebaseAuth, FirebaseAuthUser } from './auth.api';
import { firebaseDatabase } from '../database/database';
import { SIGNIN_ERRORS, SIGNOUT_ERRORS, SIGNUP_ERRORS } from './auth.errors';
import { normalizeFirebaseAuthError } from '@/errors/normalizeFirebaseAuthError';

const mapUser = (user: FirebaseAuthTypes.User | null): FirebaseAuthUser | null => {
  if (!user) return null;
  return {
    uid: user.uid,
    email: user.email,
  };
};

// Dependency Injection for Database might be useful here
export const firebaseAuth = createFirebaseAuth({
  async signIn(email, password) {
    try {
      await signInWithEmailAndPassword(getAuth(), email, password);
      return { success: true };
    } catch (e) {
      return { success: false, error: normalizeFirebaseAuthError(e, SIGNIN_ERRORS) };
    }
  },

  async signUp(email, password, profile) {
    try {
      const userCredential = await createUserWithEmailAndPassword(getAuth(), email, password);
      const uid = userCredential.user.uid;

      const profileWithUid = { ...profile, id: uid };

      await firebaseDatabase.set(`/users/${uid}`, profileWithUid);

      return { success: true };
    } catch (e) {
      return { success: false, error: normalizeFirebaseAuthError(e, SIGNUP_ERRORS) };
    }
  },

  async signOut() {
    try {
      await signOut(getAuth());
      return { success: true };
    } catch (e) {
      return { success: false, error: normalizeFirebaseAuthError(e, SIGNOUT_ERRORS) };
    }
  },

  onAuthStateChanged(cb) {
    return onAuthStateChanged(getAuth(), (user) => {
      cb(mapUser(user));
    });
  },
});
