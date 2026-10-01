// Real Google sign-in via Firebase Auth. Not bundled until you enable it in authProvider.js.
// Requires: npm i firebase   +   VITE_FIREBASE_* values in .env
import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider, signInWithPopup, signOut as fbSignOut, onAuthStateChanged } from 'firebase/auth';
import { firebaseConfig } from '../config.js';

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const google = new GoogleAuthProvider();
google.setCustomParameters({ prompt: 'select_account' });

const toUser = (u) =>
  u && { uid: u.uid, displayName: u.displayName, email: u.email, photoURL: u.photoURL, provider: 'google.com' };

const firebaseProvider = {
  mode: 'firebase',
  async signInWithGoogle() {
    const res = await signInWithPopup(auth, google);
    return toUser(res.user);
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

export default firebaseProvider;
