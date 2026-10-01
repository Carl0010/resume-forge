import React, { useMemo, useRef, useState } from 'react';
import { TEMPLATES, getTemplate } from '../templates/registry.js';
import { sampleResume } from '../data/samples.js';
import { UPLOAD, API_BASE } from '../config.js';
import { parseResume, validateUpload } from '../services/ai.js';
import { ScaledResume, Ico } from '../components/ui.jsx';
import { navigate, useAuth, useResume, useToast } from '../store.jsx';

const STAGES = ['Uploading your file', 'Reading text (OCR for images and scans)', 'Understanding sections and dates', 'Building your new resume'];
const fmtSize = (b) => (b > 1048576 ? `${(b / 1048576).toFixed(1)} MB` : `${Math.max(1, Math.round(b / 1024))} KB`);

export default function ImportPage({ params }) {
  const { user, requireLogin } = useAuth();
  const { resume, replace } = useResume();
  const toast = useToast();
  const [file, setFile] = useState(null);
  const [err, setErr] = useState('');
  const [drag, setDrag] = useState(false);
  const [tid, setTid] = useState(params.t || resume.settings.templateId || 'harvard');
  const [stage, setStage] = useState(-1);
  const [showAll, setShowAll] = useState(false);
  const input = useRef(null);
  const sample = useMemo(() => sampleResume('professional'), []);
  const busy = stage >= 0;

  const pick = (f) => {
    const e = validateUpload(f);
    setErr(e || '');
    setFile(e ? null : f);
  };

  const run = async () => {
    if (!file) return setErr('Choose a file to upload first.');
    const ok = await requireLogin('AI import reads your old resume and rebuilds it for you.');
    if (!ok) return;
    setErr('');
    setStage(0);
    try {
      const { resume: r, demo } = await parseResume(file, tid, setStage);
      replace(r);
      toast(demo ? 'Demo mode: filled with example data until your AI server is connected.' : 'Your resume is ready to edit', 'ok');
      navigate('/builder');
    } catch (e) {
      setErr(e.message || 'Something went wrong while analysing the file. Try again or use a PDF.');
    } finally {
      setStage(-1);
    }
  };

  const shown = showAll ? TEMPLATES : TEMPLATES.slice(0, 11).concat(TEMPLATES.find((t) => t.id === tid) && !TEMPLATES.slice(0, 11).some((t) => t.id === tid) ? [getTemplate(tid)] : []);

  return (
    <div className="wrap page import">
      <div className="page-head">
        <span className="pill">AI · sign-in with Google required</span>
        <h1>Turn your old resume into a new one</h1>
        <p className="muted">Upload any version of your resume. The AI extracts your details and rebuilds them in the template you pick. You can edit everything afterwards.</p>
      </div>

      <div className="import-grid">
        <div className="import-main">
          <h2 className="step-h"><span>1</span> Upload your old resume</h2>
          <div
            className={'drop' + (drag ? ' drag' : '') + (file ? ' has' : '')}
            onDragOver={(e) => { e.preventDefault(); setDrag(true); }}
            onDragLeave={() => setDrag(false)}
            onDrop={(e) => { e.preventDefault(); setDrag(false); pick(e.dataTransfer.files[0]); }}
            onClick={() => !busy && input.current.click()}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && input.current.click()}
          >
            <input ref={input} id="upload-file" type="file" accept={UPLOAD.accept} hidden onChange={(e) => pick(e.target.files[0])} />
            {file ? (
              <div className="file-chip">
                <Ico n="file" size={26} />
                <div>
                  <strong>{file.name}</strong>
                  <small className="muted">{fmtSize(file.size)} · click to choose a different file</small>
                </div>
                <button className="icon-btn" onClick={(e) => { e.stopPropagation(); setFile(null); }} aria-label="Remove file"><Ico n="x" /></button>
              </div>
            ) : (
              <>
                <Ico n="upload" size={30} />
                <strong>Drop your file here or click to browse</strong>
                <small className="muted">{UPLOAD.mimeHint} · up to {UPLOAD.maxBytes / 1048576} MB</small>
              </>
            )}
          </div>

          <h2 className="step-h"><span>2</span> Choose the new template</h2>
          <div className="mini-grid import-tpls">
            {shown.map((t) => (
              <button key={t.id} className={'mini' + (t.id === tid ? ' on' : '')} onClick={() => setTid(t.id)} aria-pressed={t.id === tid}>
                <ScaledResume resume={sample} templateId={t.id} />
                <span>{t.name}</span>
              </button>
            ))}
          </div>
          {!showAll && <button className="btn text sm" onClick={() => setShowAll(true)}>Show all {TEMPLATES.length} templates</button>}

          <h2 className="step-h"><span>3</span> Analyse and build</h2>
          {err && <p className="error" role="alert">{err}</p>}
          {busy ? (
            <ol className="progress">
              {STAGES.map((s, i) => (
                <li key={s} className={i < stage ? 'done' : i === stage ? 'now' : ''}>
                  {i < stage ? <Ico n="check" size={16} /> : i === stage ? <span className="spinner" /> : <span className="dot" />}
                  {s}
                </li>
              ))}
            </ol>
          ) : (
            <button className="btn primary lg" onClick={run} disabled={!file}>
              {user ? <Ico n="sparkle" /> : <Ico n="lock" />}
              {user ? `Build my resume in ${getTemplate(tid).name}` : 'Sign in and build my resume'}
            </button>
          )}
          {!resume.__example && !busy && <p className="tiny muted">This replaces the resume currently in your builder. Download a backup first if you want to keep it.</p>}
        </div>

        <aside className="import-side">
          <div className="card pad">
            <h3><Ico n="shield" /> Your file, handled carefully</h3>
            <ul className="plain-list">
              <li>Used only to build your resume</li>
              <li>Sent over an encrypted connection to our AI server</li>
              <li>Your edited resume stays in your browser</li>
            </ul>
          </div>
          <div className="card pad">
            <h3><Ico n="bolt" /> Works with</h3>
            <p className="muted small">Text PDFs, scanned PDFs, Word files, phone photos of printed resumes, LinkedIn “Save to PDF” exports.</p>
          </div>
          {!API_BASE && <p className="tiny muted">Developer note: no AI server is configured (VITE_API_BASE), so this runs in demo mode with example data.</p>}
        </aside>
      </div>
    </div>
  );
}
