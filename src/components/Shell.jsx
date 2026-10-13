import React, { useState } from 'react';
import { APP_NAME } from '../config.js';
import { useAuth, useToast } from '../store.jsx';
import { Ico, GoogleG, Modal } from './ui.jsx';

export function Logo() {
  return (
    <a href="/" className="logo" aria-label={`${APP_NAME} home`}>
      <svg width="26" height="26" viewBox="0 0 32 32" aria-hidden="true">
        <rect x="5" y="3" width="20" height="26" rx="3" fill="var(--primary)" />
        <rect x="9" y="8" width="9" height="2.4" rx="1.2" fill="#fff" />
        <rect x="9" y="13" width="12" height="1.6" rx=".8" fill="#fff" opacity=".75" />
        <rect x="9" y="16.5" width="12" height="1.6" rx=".8" fill="#fff" opacity=".75" />
        <rect x="9" y="20" width="8" height="1.6" rx=".8" fill="#fff" opacity=".75" />
        <circle cx="25" cy="25" r="5" fill="var(--marker)" stroke="var(--bg)" strokeWidth="2" />
      </svg>
      <span>{APP_NAME}</span>
    </a>
  );
}

const LINKS = [
  { href: '/templates', label: 'Templates', match: '/templates' },
  { href: '/builder', label: 'Builder', match: '/builder' },
  { href: '/import', label: 'AI Import', match: '/import' },
  { href: '/ai-writer', label: 'AI Writer', match: '/ai-writer', soon: true },
];

const THEME_KEY = 'resumeforge-theme';

function systemTheme() {
  return window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
}

function currentTheme() {
  return document.documentElement.getAttribute('data-theme') || systemTheme();
}

export function ThemeToggle() {
  const [theme, setTheme] = useState(currentTheme);
  const next = theme === 'dark' ? 'light' : 'dark';
  const toggle = () => {
    document.documentElement.setAttribute('data-theme', next);
    try {
      localStorage.setItem(THEME_KEY, next);
    } catch (e) {
      /* storage unavailable (private mode) – theme still applies for this visit */
    }
    setTheme(next);
  };
  return (
    <button className="icon-btn theme-toggle" onClick={toggle} aria-label={`Switch to ${next} theme`} title={`Switch to ${next} theme`}>
      <Ico n={theme === 'dark' ? 'sun' : 'moon'} size={18} />
    </button>
  );
}

export function Navbar({ path }) {
  const { user, openLogin, signOut } = useAuth();
  const toast = useToast();
  const [open, setOpen] = useState(false);
  const [menu, setMenu] = useState(false);
  return (
    <header className="nav">
      <div className="nav-in">
        <Logo />
        <nav className={'nav-links' + (open ? ' open' : '')} onClick={() => setOpen(false)}>
          {LINKS.map((l) => (
            <a key={l.href} href={l.href} className={path.startsWith(l.match) ? 'active' : ''}>
              {l.label}
              {l.soon && <span className="pill soon">Soon</span>}
            </a>
          ))}
        </nav>
        <div className="nav-right">
          <ThemeToggle />
          {user ? (
            <div className="user-menu">
              <button className="avatar-btn" onClick={() => setMenu((m) => !m)} aria-expanded={menu} aria-label="Account menu">
                {user.photoURL ? <img src={user.photoURL} alt="" /> : <span>{(user.displayName || 'U')[0]}</span>}
              </button>
              {menu && (
                <div className="dropdown" onMouseLeave={() => setMenu(false)}>
                  <div className="dd-user">
                    <strong>{user.displayName}</strong>
                    <small>{user.email}</small>
                  </div>
                  <button
                    onClick={async () => {
                      setMenu(false);
                      await signOut();
                      toast('Signed out');
                    }}
                  >
                    <Ico n="logout" size={16} /> Sign out
                  </button>
                </div>
              )}
            </div>
          ) : (
            <button className="btn ghost sm" onClick={() => openLogin('')}>Sign in</button>
          )}
          <a href="/builder" className="btn primary sm hide-sm">Build my resume</a>
          <button className="icon-btn show-sm" onClick={() => setOpen((o) => !o)} aria-label="Menu"><Ico n="menu" /></button>
        </div>
      </div>
    </header>
  );
}

export function Footer() {
  return (
    <footer className="footer">
      <div className="footer-in">
        <div>
          <Logo />
          <p className="muted">Free resume and CV builder. No sign-up, no watermarks, no paywall at download.</p>
        </div>
        <div className="footer-cols">
          <div>
            <h4>Build</h4>
            <a href="/templates">All templates</a>
            <a href="/builder">Resume builder</a>
            <a href="/templates/student">Student resumes</a>
            <a href="/templates/executive">Executive CVs</a>
          </div>
          <div>
            <h4>AI tools</h4>
            <a href="/import">Import an old resume</a>
            <a href="/ai-writer">AI Writer (soon)</a>
          </div>
          <div>
            <h4>Promise</h4>
            <span>Free forever</span>
            <span>Your data stays in your browser</span>
            <span>No hidden charges</span>
          </div>
        </div>
      </div>
      <div className="footer-base">© {new Date().getFullYear()} {APP_NAME}. Made for people who need a resume tonight.</div>
    </footer>
  );
}

export function LoginModal() {
  const { modal, closeModal, signIn, mode } = useAuth();
  const toast = useToast();
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState('');
  const go = async () => {
    setBusy(true);
    setErr('');
    try {
      const u = await signIn();
      toast(`Signed in as ${u.displayName}`, 'ok');
      closeModal(true);
    } catch (e) {
      setErr(e.message || 'Sign-in failed. Try again.');
    } finally {
      setBusy(false);
    }
  };
  return (
    <Modal open={!!modal} onClose={() => closeModal(false)} labelledBy="login-title">
      <div className="login">
        <div className="login-badge"><Ico n="sparkle" size={22} /></div>
        <h2 id="login-title">Sign in to use AI features</h2>
        <p className="muted">
          {modal && modal.reason ? modal.reason + ' ' : ''}
          The resume builder, templates and downloads stay free without an account. Sign-in is only needed for AI tools.
        </p>
        <button className="btn google" onClick={go} disabled={busy}>
          {busy ? <span className="spinner" /> : <GoogleG />}
          {busy ? 'Connecting to Google…' : 'Continue with Google'}
        </button>
        {err && <p className="error">{err}</p>}
        {mode === 'demo' && <p className="tiny muted">Demo sign-in: no real Google account is used yet.</p>}
      </div>
    </Modal>
  );
}
