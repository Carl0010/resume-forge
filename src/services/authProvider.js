// ─────────────────────────────────────────────────────────────────────────────
// Auth provider switch.
// The app talks to auth ONLY through this interface:
//   signInWithGoogle() -> Promise<User>
//   signOut()          -> Promise<void>
//   onChange(cb)       -> unsubscribe fn   (cb receives User | null)
//   getIdToken()       -> Promise<string|null>  (sent to your AI server as Bearer token)
//
// DUMMY MODE (current): simulates Google sign-in so the whole UI flow works today.
// To go live with Firebase:
//   1) npm i firebase
//   2) fill VITE_FIREBASE_* in .env (see src/config.js)
//   3) replace the export at the bottom of this file with:
//        export { default } from './firebaseProvider.js';
// ─────────────────────────────────────────────────────────────────────────────
import { storage } from './storage.js';

const KEY = 'rf.demoUser';
const listeners = new Set();
const emit = (u) => listeners.forEach((cb) => cb(u));

const dummyProvider = {
  mode: 'demo',
  async signInWithGoogle() {
    await new Promise((r) => setTimeout(r, 900));
    const user = {
      uid: 'demo-' + Math.random().toString(36).slice(2, 8),
      displayName: 'Demo User',
      email: 'demo.user@gmail.com',
      photoURL: '',
      provider: 'google.com (demo)',
    };
    storage.set(KEY, user);
    emit(user);
    return user;
  },
  async signOut() {
    storage.remove(KEY);
    emit(null);
  },
  onChange(cb) {
    listeners.add(cb);
    cb(storage.get(KEY, null));
    return () => listeners.delete(cb);
  },
  async getIdToken() {
    const u = storage.get(KEY, null);
    return u ? `demo-token-${u.uid}` : null;
  },
};

export default dummyProvider;
