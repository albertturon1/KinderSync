import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  User,
} from 'firebase/auth';
import { firebaseAuthWeb } from '../firebase.web';
import { createFirebaseAuth, FirebaseAuthUser } from './auth.api';
import { firebaseDatabase } from '../database/database';
import { SIGNIN_ERRORS, SIGNOUT_ERRORS, SIGNUP_ERRORS } from './auth.errors';
import { normalizeFirebaseAuthError } from '@/errors/normalizeFirebaseAuthError';

const mapUser = (user: User | null): FirebaseAuthUser | null => {
  if (!user) return null;
  return {
    uid: user.uid,
    email: user.email,
  };
};

export const firebaseAuth = createFirebaseAuth({
  async signIn(email, password) {
    try {
      await signInWithEmailAndPassword(firebaseAuthWeb, email, password);
      return { success: true };
    } catch (e) {
      return { success: false, error: normalizeFirebaseAuthError(e, SIGNIN_ERRORS) };
    }
  },

  async signUp(email, password, profile) {
    try {
      const userCredential = await createUserWithEmailAndPassword(firebaseAuthWeb, email, password);
      const uid = userCredential.user.uid;

      // Update profile with actual UID
      const profileWithUid = { ...profile, id: uid };

      await firebaseDatabase.set(`/users/${uid}`, profileWithUid);

      return { success: true };
    } catch (e) {
      return { success: false, error: normalizeFirebaseAuthError(e, SIGNUP_ERRORS) };
    }
  },

  async signOut() {
    try {
      await signOut(firebaseAuthWeb);
      return { success: true };
    } catch (e) {
      return { success: false, error: normalizeFirebaseAuthError(e, SIGNOUT_ERRORS) };
    }
  },

  onAuthStateChanged(cb) {
    return onAuthStateChanged(firebaseAuthWeb, (user) => {
      cb(mapUser(user));
    });
  },
});
