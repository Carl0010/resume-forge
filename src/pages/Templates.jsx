import React, { useMemo, useState } from 'react';
import { TEMPLATES, CATEGORIES, LAYOUTS } from '../templates/registry.js';
import { sampleResume, SAMPLES } from '../data/samples.js';
import { CAREER_PRESETS, recommendTemplates, sampleKeyFor, FLAGSHIPS } from '../data/presets.js';
import { recordUsage } from '../services/usage.js';
import { ScaledResume, Modal, Ico } from '../components/ui.jsx';
import { navigate, useResume } from '../store.jsx';
import { ROUTES } from '../seo-data.js';

export default function Templates({ params }) {
  const { resume, configureTemplate } = useResume();
  const cat = CATEGORIES.some((c) => c.id === params.c) ? params.c : 'all';
  const meta = ROUTES[cat === 'all' ? '/templates' : '/templates/' + cat];
  const [q, setQ] = useState('');
  const [mine, setMine] = useState(false);
  const [preview, setPreview] = useState(null);
  const [career, setCareer] = useState(
    ['student', 'executive', 'academic'].includes(cat) ? cat : 'professional',
  );
  const [role, setRole] = useState('general');
  const [style, setStyle] = useState('traditional');
  const [sampleKey, setSampleKey] = useState('auto');
  const [applyOrder, setApplyOrder] = useState(false);
  const [defaults, setDefaults] = useState(true);
  const [compared, setCompared] = useState([]);
  const [comparing, setComparing] = useState(false);
  const recommendations = recommendTemplates(TEMPLATES, { career, role, style });
  const samples = useMemo(
    () => Object.fromEntries(Object.keys(SAMPLES).map((k) => [k, sampleResume(k)])),
    [],
  );
  const dataFor = (t) =>
    mine && !resume.__example
      ? resume
      : samples[sampleKey === 'auto' ? sampleKeyFor(t, cat) : sampleKey];
  const commonData =
    mine && !resume.__example
      ? resume
      : samples[sampleKey === 'auto' ? (role === 'general' ? career : role) : sampleKey];
  const overrides = defaults ? {} : resume.settings.overrides;
  const list = TEMPLATES.filter(
    (t) =>
      (cat === 'all' || (cat === 'ats' ? t.ats : t.tags.includes(cat))) &&
      (!q ||
        (t.name + ' ' + t.desc + ' ' + LAYOUTS[t.layout] + ' ' + t.tags.join(' '))
          .toLowerCase()
          .includes(q.toLowerCase())),
  );
  const use = (id) => {
    configureTemplate(id, {
      overrides: defaults ? {} : undefined,
      preset: applyOrder ? career : undefined,
    });
    navigate('/builder');
  };
  const toggleCompare = (id) =>
    setCompared((ids) =>
      ids.includes(id) ? ids.filter((x) => x !== id) : ids.length < 3 ? [...ids, id] : ids,
    );
  const card = (t, recommended = false) => (
    <div key={t.id} className="tpl-card">
      <button className="tpl-thumb" onClick={() => setPreview(t)} aria-label={`Preview ${t.name}`}>
        <ScaledResume resume={dataFor(t)} templateId={t.id} overrides={overrides} />
        <span className="tpl-hover">
          <Ico n="eye" /> Preview all pages
        </span>
      </button>
      <div className="tpl-meta">
        <div>
          <strong>{t.name}</strong>
          <small className="muted">
            {LAYOUTS[t.layout]} · {t.fs}pt
          </small>
        </div>
        {t.ats && <span className="pill ats">Simple</span>}
      </div>
      <p className="tpl-description">
        {recommended
          ? `${CAREER_PRESETS[career].description}. `
          : FLAGSHIPS.includes(t.id)
            ? 'Featured design. '
            : ''}
        {t.desc}
      </p>
      <button className="btn primary sm block" onClick={() => use(t.id)}>
        Use {t.name}
      </button>
      <label className="switch">
        <input
          type="checkbox"
          checked={compared.includes(t.id)}
          disabled={!compared.includes(t.id) && compared.length === 3}
          onChange={() => toggleCompare(t.id)}
        />
        Compare {t.name}
      </label>
    </div>
  );
  return (
    <div className="wrap page">
      <div className="page-head">
        <h1>{meta.h1}</h1>
        <p className="muted">{meta.intro}</p>
        <p className="muted small">
          52 designs with readable type and clickable links. “Simple” identifies single-column
          designs; hiring-system compatibility depends on the exported file and the employer’s
          system.
        </p>
      </div>
      <section className="template-finder" aria-labelledby="finder-title">
        <h2 id="finder-title">Find a layout for your next role</h2>
        <div className="finder-fields">
          <label>
            Career stage
            <select className="input" value={career} onChange={(e) => setCareer(e.target.value)}>
              {Object.entries(CAREER_PRESETS).map(([k, p]) => (
                <option key={k} value={k}>
                  {p.label}
                </option>
              ))}
            </select>
          </label>
          <label>
            Target role
            <select className="input" value={role} onChange={(e) => setRole(e.target.value)}>
              {[
                ['general', 'General / other'],
                ['engineering', 'Engineering'],
                ['design', 'Design'],
                ['finance', 'Finance'],
                ['sales', 'Sales'],
                ['healthcare', 'Healthcare'],
              ].map(([k, l]) => (
                <option key={k} value={k}>
                  {l}
                </option>
              ))}
            </select>
          </label>
          <label>
            Visual style
            <select className="input" value={style} onChange={(e) => setStyle(e.target.value)}>
              <option value="traditional">Traditional</option>
              <option value="minimal">Minimal</option>
              <option value="visual">More visual</option>
            </select>
          </label>
        </div>
        <div className="selection-options">
          <label className="switch">
            <input
              type="checkbox"
              checked={applyOrder}
              onChange={(e) => setApplyOrder(e.target.checked)}
            />
            Apply suggested section order when choosing a template
          </label>
          <label className="switch">
            <input
              type="checkbox"
              checked={defaults}
              onChange={(e) => setDefaults(e.target.checked)}
            />
            Use template fonts, spacing and colors
          </label>
        </div>
        <p className="muted small">
          Section presets keep your entries and reveal relevant sections. Examples are illustrative;
          choosing a design keeps your resume content.
        </p>
        <div className="recommendation-grid">{recommendations.map((t) => card(t, true))}</div>
      </section>
      <div className="filters">
        <div className="chips" aria-label="Template categories">
          {CATEGORIES.map((c) => (
            <button
              key={c.id}
              className={'chip' + (cat === c.id ? ' on' : '')}
              aria-pressed={cat === c.id}
              onClick={() => navigate(c.id === 'all' ? '/templates' : '/templates/' + c.id)}
            >
              {c.label}
              <span className="chip-n">
                {c.id === 'all'
                  ? TEMPLATES.length
                  : TEMPLATES.filter((t) => (c.id === 'ats' ? t.ats : t.tags.includes(c.id)))
                      .length}
              </span>
            </button>
          ))}
        </div>
        <div className="filter-right">
          <input
            className="input"
            type="search"
            placeholder="Search templates"
            value={q}
            onChange={(e) => setQ(e.target.value)}
            aria-label="Search templates"
          />
          <label>
            Example
            <select
              className="input"
              value={sampleKey}
              onChange={(e) => setSampleKey(e.target.value)}
            >
              <option value="auto">Match each template</option>
              {Object.entries(SAMPLES).map(([k, s]) => (
                <option key={k} value={k}>
                  {s.label}
                </option>
              ))}
            </select>
          </label>
          <label className="switch">
            <input
              type="checkbox"
              checked={mine}
              disabled={!!resume.__example}
              onChange={(e) => setMine(e.target.checked)}
            />
            Preview with my details
          </label>
        </div>
      </div>
      {compared.length > 0 && (
        <div className="compare-bar" role="status">
          <span>{compared.length} of 3 selected · Same content in each comparison</span>
          <button
            className="btn primary sm"
            disabled={compared.length < 2}
            onClick={() => {
              setComparing(true);
              compared.forEach((id) => recordUsage('comparison_opened', id));
            }}
          >
            Compare selected
          </button>
          <button className="btn ghost sm" onClick={() => setCompared([])}>
            Clear
          </button>
        </div>
      )}
      {!list.length && (
        <p className="empty">No templates match “{q}”. Try another name or layout.</p>
      )}
      <div className="tpl-grid all">{list.map((t) => card(t))}</div>
      <Modal open={!!preview} onClose={() => setPreview(null)} labelledBy="pv-title" wide>
        {preview && (
          <div className="pv">
            <div className="pv-paper">
              <ScaledResume
                resume={dataFor(preview)}
                templateId={preview.id}
                overrides={overrides}
                clip={false}
                pageSize={resume.settings.pageSize}
              />
            </div>
            <div className="pv-side">
              <h2 id="pv-title">{preview.name}</h2>
              <p className="muted">{preview.desc}</p>
              <dl className="pv-dl">
                <dt>Layout</dt>
                <dd>{LAYOUTS[preview.layout]}</dd>
                <dt>Body text</dt>
                <dd>{overrides.fs || preview.fs}pt</dd>
                <dt>Structure</dt>
                <dd>
                  {preview.ats
                    ? 'Single column'
                    : 'Visual layout; also available as a simple layout in Design'}
                </dd>
                <dt>Best for</dt>
                <dd>
                  {preview.tags
                    .filter((x) => x !== 'ats')
                    .map((x) => CATEGORIES.find((c) => c.id === x)?.label)
                    .join(', ')}
                </dd>
              </dl>
              <p className="muted small">
                Preview includes every page. Check the final PDF and follow the employer’s
                file-format instructions.
              </p>
              <button className="btn primary block" onClick={() => use(preview.id)}>
                Use {preview.name}
              </button>
            </div>
          </div>
        )}
      </Modal>
      <Modal open={comparing} onClose={() => setComparing(false)} labelledBy="compare-title" wide>
        <h2 id="compare-title">Compare with the same resume</h2>
        <p className="muted">
          {mine && !resume.__example ? 'Your details' : 'Illustrative example'} · All pages ·{' '}
          {resume.settings.pageSize}
        </p>
        <div className="comparison-grid">
          {compared.map((id) => {
            const t = TEMPLATES.find((t) => t.id === id);
            return (
              <div key={id}>
                <h3>{t.name}</h3>
                <p className="muted small">
                  {LAYOUTS[t.layout]} · {overrides.fs || t.fs}pt
                </p>
                <button className="btn primary sm block" onClick={() => use(id)}>
                  Use {t.name}
                </button>
                <ScaledResume
                  resume={commonData}
                  templateId={id}
                  overrides={overrides}
                  pageSize={resume.settings.pageSize}
                  clip={false}
                />
              </div>
            );
          })}
        </div>
      </Modal>
    </div>
  );
}
