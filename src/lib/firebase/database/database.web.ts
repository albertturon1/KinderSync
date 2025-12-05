import { get, set, update, ref, onValue } from 'firebase/database';
import { createFirebaseDatabase } from './database.api';
import { firebaseDatabaseWeb } from '../firebase.web';

export const firebaseDatabase = createFirebaseDatabase({
  async get(path) {
    const snapshot = await get(ref(firebaseDatabaseWeb, path));
    return snapshot.val() as unknown;
  },
  set(path, value) {
    return set(ref(firebaseDatabaseWeb, path), value);
  },
  update(path, value) {
    return update(ref(firebaseDatabaseWeb, path), value);
  },
  listen(path, cb) {
    const unsubscribe = onValue(ref(firebaseDatabaseWeb, path), (snap) => cb(snap.val()));
    return unsubscribe;
  },
});
