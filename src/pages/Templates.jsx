import React, { useMemo, useState } from 'react';
import { TEMPLATES, CATEGORIES, LAYOUTS } from '../templates/registry.js';
import { sampleResume } from '../data/samples.js';
import { ScaledResume, Modal, Ico } from '../components/ui.jsx';
import { navigate, useResume } from '../store.jsx';

export default function Templates({ params }) {
  const { resume, setTemplate } = useResume();
  const [cat, setCat] = useState(params.c || 'all');
  const [q, setQ] = useState('');
  const [mine, setMine] = useState(false);
  const [preview, setPreview] = useState(null);
  const sample = useMemo(() => sampleResume(cat === 'student' ? 'student' : cat === 'executive' ? 'executive' : 'professional'), [cat]);
  const data = mine && !resume.__example ? resume : sample;

  const list = TEMPLATES.filter(
    (t) =>
      (cat === 'all' || t.tags.includes(cat)) &&
      (!q || (t.name + ' ' + t.desc + ' ' + LAYOUTS[t.layout] + ' ' + t.tags.join(' ')).toLowerCase().includes(q.toLowerCase()))
  );

  const use = (id) => {
    setTemplate(id);
    navigate('/builder');
  };

  return (
    <div className="wrap page">
      <div className="page-head">
        <h1>Resume templates</h1>
        <p className="muted">
          {TEMPLATES.length} designs across 8 layout families. Templates marked <span className="pill ats">ATS</span> use a single reading order and standard headings for applicant tracking systems.
        </p>
      </div>

      <div className="filters">
        <div className="chips" role="tablist" aria-label="Template categories">
          {CATEGORIES.map((c) => (
            <button key={c.id} role="tab" aria-selected={cat === c.id} className={'chip' + (cat === c.id ? ' on' : '')} onClick={() => setCat(c.id)}>
              {c.label}
              <span className="chip-n">{c.id === 'all' ? TEMPLATES.length : TEMPLATES.filter((t) => t.tags.includes(c.id)).length}</span>
            </button>
          ))}
        </div>
        <div className="filter-right">
          <input id="tpl-search" className="input" type="search" placeholder="Search templates" value={q} onChange={(e) => setQ(e.target.value)} aria-label="Search templates" />
          <label className="switch" title={resume.__example ? 'Add your details in the builder first' : ''}>
            <input id="tpl-mine" type="checkbox" checked={mine} disabled={!!resume.__example} onChange={(e) => setMine(e.target.checked)} />
            <span>Preview with my details</span>
          </label>
        </div>
      </div>

      {list.length === 0 && <p className="empty">No templates match “{q}”. Try “modern”, “serif” or “sidebar”.</p>}

      <div className="tpl-grid all">
        {list.map((t) => (
          <div key={t.id} className="tpl-card">
            <button className="tpl-thumb" onClick={() => setPreview(t)} aria-label={`Preview ${t.name}`}>
              <ScaledResume resume={data} templateId={t.id} />
              <span className="tpl-hover"><Ico n="eye" /> Preview</span>
            </button>
            <div className="tpl-meta">
              <div>
                <strong>{t.name}</strong>
                <small className="muted">{LAYOUTS[t.layout]}</small>
              </div>
              {t.ats && <span className="pill ats">ATS</span>}
            </div>
            <button className="btn primary sm block" onClick={() => use(t.id)}>Use this template</button>
          </div>
        ))}
      </div>

      <Modal open={!!preview} onClose={() => setPreview(null)} labelledBy="pv-title" wide>
        {preview && (
          <div className="pv">
            <div className="pv-paper"><ScaledResume resume={data} templateId={preview.id} clip={false} /></div>
            <div className="pv-side">
              <h2 id="pv-title">{preview.name}</h2>
              <p className="muted">{preview.desc}</p>
              <dl className="pv-dl">
                <dt>Layout</dt><dd>{LAYOUTS[preview.layout]}</dd>
                <dt>Fonts</dt><dd>{preview.hf}{preview.bf !== preview.hf ? ` / ${preview.bf}` : ''}</dd>
                <dt>ATS</dt><dd>{preview.ats ? 'Optimised' : 'Best when a person reads it first'}</dd>
                <dt>Best for</dt><dd>{preview.tags.filter((x) => x !== 'ats').map((x) => CATEGORIES.find((c) => c.id === x)?.label).join(', ')}</dd>
              </dl>
              <button className="btn primary block" onClick={() => use(preview.id)}>Use {preview.name}</button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
