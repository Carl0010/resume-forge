import React, { useState } from 'react';
import { Ico } from '../components/ui.jsx';
import { useAuth, useToast } from '../store.jsx';

// Reserved space for the upcoming "Build with AI" feature.
// Wire the real UI here and call aiWrite() from src/services/ai.js when the feature is defined.
const PLANNED = [
  ['Guided interview', 'Answer a few questions about your role and wins; AI turns them into a complete first draft.'],
  ['Bullet rewriter', 'Paste a plain duty and get achievement-style bullets with strong verbs and numbers.'],
  ['Job-match tailoring', 'Paste a job description to see missing keywords and a tailored summary.'],
  ['Summary generator', 'Three summary options in different tones, based on your experience.'],
];

export default function AIWriter() {
  const { user, requireLogin } = useAuth();
  const toast = useToast();
  const [joined, setJoined] = useState(false);
  return (
    <div className="wrap page ai-writer">
      <div className="page-head">
        <span className="pill soon">Coming soon</span>
        <h1>Build your resume with AI</h1>
        <p className="muted">We’re designing an assistant that writes with you, not for you. It will need a free Google sign-in.</p>
      </div>

      <div className="ai-slot" aria-label="AI writer workspace (reserved)">
        <div className="ai-slot-inner">
          <Ico n="sparkle" size={28} />
          <strong>The AI workspace will live here</strong>
          <span className="muted">Chat and suggestions on the left, your resume updating live on the right.</span>
        </div>
      </div>

      <div className="planned">
        {PLANNED.map(([h, p]) => (
          <div key={h} className="card pad">
            <h3>{h}</h3>
            <p className="muted small">{p}</p>
          </div>
        ))}
      </div>

      <div className="notify">
        {joined ? (
          <p><Ico n="check" /> You’re on the list{user ? ` as ${user.email}` : ''}. We’ll let you know when it launches.</p>
        ) : (
          <button
            className="btn primary"
            onClick={async () => {
              if (await requireLogin('Sign in so we can tell you when the AI writer launches.')) {
                setJoined(true);
                toast('Added to early access', 'ok');
              }
            }}
          >
            Get early access
          </button>
        )}
        <a className="btn ghost" href="#/builder">Build manually for now</a>
      </div>
    </div>
  );
}
