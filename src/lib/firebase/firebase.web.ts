import { initializeApp, type FirebaseOptions } from 'firebase/app';
import { getDatabase } from 'firebase/database';
import { getAuth } from 'firebase/auth';

import { envWeb } from '../env/env.web';

const firebaseConfig: FirebaseOptions = {
  apiKey: envWeb.API_KEY,
  authDomain: envWeb.AUTH_DOMAIN,
  projectId: envWeb.PROJECT_ID,
  storageBucket: envWeb.STORAGE_BUCKET,
  messagingSenderId: envWeb.MESSAGING_SENDER_ID,
  appId: envWeb.APP_ID,
  measurementId: envWeb.MEASUREMENT_ID,
  databaseURL: envWeb.DATABASE_URL,
};

const app = initializeApp(firebaseConfig);
const database = getDatabase(app);
const auth = getAuth(app);

export const firebaseAuthWeb = auth;
export const firebaseDatabaseWeb = database;
