import { getDatabase, get, set, update, ref, onValue } from '@react-native-firebase/database';
import { createFirebaseDatabase } from './database.api';

export const firebaseDatabase = createFirebaseDatabase({
  async get(path) {
    const snapshot = await get(ref(getDatabase(), path));
    return snapshot.val() as unknown;
  },
  set(path, value) {
    return set(ref(getDatabase(), path), value);
  },
  update(path, value) {
    return update(ref(getDatabase(), path), value);
  },
  listen(path, cb) {
    const unsubscribe = onValue(ref(getDatabase(), path), (snap) => cb(snap.val()));
    return unsubscribe;
  },
});
