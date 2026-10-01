import React, { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react';
import { storage } from './services/storage.js';
import authProvider from './services/authProvider.js';
import { normalizeResume, emptyResume } from './data/schema.js';
import { sampleResume } from './data/samples.js';

/* ───────── Router (hash based, works on any static host) ───────── */
function parseHash() {
  const h = window.location.hash.replace(/^#/, '') || '/';
  const [path, qs] = h.split('?');
  const params = Object.fromEntries(new URLSearchParams(qs || ''));
  return { path: path || '/', params };
}
export function useRoute() {
  const [route, setRoute] = useState(parseHash);
  useEffect(() => {
    const on = () => {
      setRoute(parseHash());
      window.scrollTo(0, 0);
    };
    window.addEventListener('hashchange', on);
    return () => window.removeEventListener('hashchange', on);
  }, []);
  return route;
}
export const navigate = (to) => {
  window.location.hash = to;
};

/* ───────── Toasts ───────── */
const ToastCtx = createContext(() => {});
export const useToast = () => useContext(ToastCtx);
export function ToastProvider({ children }) {
  const [items, setItems] = useState([]);
  const push = useCallback((msg, tone = 'info') => {
    const id = Math.random();
    setItems((x) => [...x, { id, msg, tone }]);
    setTimeout(() => setItems((x) => x.filter((t) => t.id !== id)), 3800);
  }, []);
  return (
    <ToastCtx.Provider value={push}>
      {children}
      <div className="toasts" role="status" aria-live="polite">
        {items.map((t) => <div key={t.id} className={`toast ${t.tone}`}>{t.msg}</div>)}
      </div>
    </ToastCtx.Provider>
  );
}

/* ───────── Auth ───────── */
const AuthCtx = createContext(null);
export const useAuth = () => useContext(AuthCtx);
export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [modal, setModal] = useState(null); // { reason, resolve }
  useEffect(() => authProvider.onChange(setUser), []);

  // Resolves true once the user is signed in (opens the login modal if needed).
  const requireLogin = useCallback(
    (reason) =>
      new Promise((resolve) => {
        if (user) return resolve(true);
        setModal({ reason, resolve });
      }),
    [user]
  );
  const value = useMemo(
    () => ({
      user,
      mode: authProvider.mode,
      requireLogin,
      openLogin: (reason) => setModal({ reason: reason || '', resolve: () => {} }),
      modal,
      closeModal: (ok) => {
        if (modal) modal.resolve(!!ok);
        setModal(null);
      },
      signIn: () => authProvider.signInWithGoogle(),
      signOut: () => authProvider.signOut(),
    }),
    [user, modal, requireLogin]
  );
  return <AuthCtx.Provider value={value}>{children}</AuthCtx.Provider>;
}

/* ───────── Resume store (autosaved to this browser) ───────── */
const KEY = 'rf.resume.v1';
const ResumeCtx = createContext(null);
export const useResume = () => useContext(ResumeCtx);

export function ResumeProvider({ children }) {
  const [resume, setResume] = useState(() => {
    const saved = storage.get(KEY, null);
    return saved ? normalizeResume(saved) : { ...sampleResume('professional'), __example: true };
  });
  const [savedAt, setSavedAt] = useState(null);
  const timer = useRef();

  useEffect(() => {
    clearTimeout(timer.current);
    timer.current = setTimeout(() => {
      if (storage.set(KEY, resume)) setSavedAt(new Date());
    }, 400);
    return () => clearTimeout(timer.current);
  }, [resume]);

  const api = useMemo(() => {
    const update = (fn) => setResume((r) => {
      const next = fn(structuredClone(r));
      delete next.__example;
      return next;
    });
    return {
      resume,
      savedAt,
      update,
      replace: (r, keepExampleFlag) => setResume(keepExampleFlag ? { ...normalizeResume(r), __example: true } : normalizeResume(r)),
      setTemplate: (id) => update((r) => ((r.settings.templateId = id), r)),
      startBlank: () => {
        const b = emptyResume();
        setResume((r) => ({ ...b, settings: { ...r.settings } }));
      },
      loadSample: (key) => setResume((r) => {
        const s = sampleResume(key);
        s.settings = { ...r.settings };
        return { ...s, __example: true };
      }),
    };
  }, [resume, savedAt]);

  return <ResumeCtx.Provider value={api}>{children}</ResumeCtx.Provider>;
}
