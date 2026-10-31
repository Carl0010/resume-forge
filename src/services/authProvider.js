// Google sign-in via Firebase Auth. The app talks to auth ONLY through this interface:
//   signInWithGoogle() -> Promise<User>
//   signOut()          -> Promise<void>
//   onChange(cb)       -> unsubscribe fn   (cb receives User | null)
//   getIdToken()       -> Promise<string|null>  (sent to your AI server as Bearer token)
// Config comes from the VITE_FIREBASE_* values in .env (see src/config.js).
import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider, signInWithPopup, signOut as fbSignOut, onAuthStateChanged } from 'firebase/auth';
import { firebaseConfig } from '../config.js';

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const google = new GoogleAuthProvider();
google.setCustomParameters({ prompt: 'select_account' });

const toUser = (u) =>
  u && { uid: u.uid, displayName: u.displayName, email: u.email, photoURL: u.photoURL, provider: 'google.com' };

const MESSAGES = {
  'auth/popup-closed-by-user': 'Sign-in was cancelled.',
  'auth/cancelled-popup-request': 'Sign-in was cancelled.',
  'auth/popup-blocked': 'Your browser blocked the sign-in popup. Allow popups for this site and try again.',
  'auth/network-request-failed': 'Network error. Check your connection and try again.',
  'auth/unauthorized-domain': 'This domain is not authorised for sign-in yet.',
};

const authProvider = {
  async signInWithGoogle() {
    try {
      const res = await signInWithPopup(auth, google);
      return toUser(res.user);
    } catch (e) {
      throw new Error(MESSAGES[e.code] || 'Sign-in failed. Try again.');
    }
  },
  async signOut() {
    await fbSignOut(auth);
  },
  onChange(cb) {
    return onAuthStateChanged(auth, (u) => cb(toUser(u)));
  },
  async getIdToken() {
    return auth.currentUser ? auth.currentUser.getIdToken() : null;
  },
};

export default authProvider;
