import React, { useMemo, useState } from 'react';
import { TEMPLATES, CATEGORIES, FONTS, getTemplate, resolveStyle } from '../templates/registry.js';
import { sampleResume } from '../data/samples.js';
import { ScaledResume, Ico } from '../components/ui.jsx';
import { useResume } from '../store.jsx';

const SWATCHES = ['#111111', '#1f3a5f', '#1d4ed8', '#0f766e', '#15803d', '#7c3aed', '#be185d', '#b91c1c', '#c2410c', '#a16207', '#334155'];

function Color({ id, label, value, onChange }) {
  return (
    <div className="field">
      <label htmlFor={id}>{label}</label>
      <div className="color-row">
        <input id={id} type="color" value={value} onChange={(e) => onChange(e.target.value)} />
        <input className="input mono" value={value} onChange={(e) => /^#[0-9a-f]{0,6}$/i.test(e.target.value) && onChange(e.target.value)} aria-label={`${label} hex`} />
      </div>
      <div className="swatches">
        {SWATCHES.map((c) => (
          <button key={c} style={{ background: c }} className={value.toLowerCase() === c ? 'on' : ''} onClick={() => onChange(c)} aria-label={`Use ${c}`} />
        ))}
      </div>
    </div>
  );
}

function Range({ id, label, value, min, max, step, unit, onChange }) {
  return (
    <div className="field">
      <label htmlFor={id} className="range-label">
        {label} <output>{value}{unit}</output>
      </label>
      <input id={id} type="range" min={min} max={max} step={step} value={value} onChange={(e) => onChange(Number(e.target.value))} />
    </div>
  );
}

export default function DesignPanel() {
  const { resume, update, setTemplate } = useResume();
  const [cat, setCat] = useState('all');
  const [adv, setAdv] = useState(false);
  const sample = useMemo(() => sampleResume('professional'), []);
  const tid = resume.settings.templateId;
  const ov = resume.settings.overrides || {};
  const s = resolveStyle(tid, ov);
  const base = getTemplate(tid);
  const setOv = (k, v) => update((r) => ((r.settings.overrides[k] = v), r));
  const changed = Object.keys(ov).filter((k) => ov[k] !== '' && ov[k] != null).length;
  const list = TEMPLATES.filter((t) => cat === 'all' || t.tags.includes(cat));
  const data = resume.__example ? sample : resume;

  return (
    <div className="design">
      <section className="card">
        <div className="card-head static">
          <span className="card-title">Template</span>
          <span className="muted small">{base.name}</span>
        </div>
        <div className="card-body">
          <div className="chips small-chips">
            {CATEGORIES.map((c) => (
              <button key={c.id} className={'chip' + (cat === c.id ? ' on' : '')} onClick={() => setCat(c.id)}>{c.label}</button>
            ))}
          </div>
          <div className="mini-grid">
            {list.map((t) => (
              <button key={t.id} className={'mini' + (t.id === tid ? ' on' : '')} onClick={() => setTemplate(t.id)} aria-pressed={t.id === tid}>
                <ScaledResume resume={data} templateId={t.id} />
                <span>{t.name}{t.ats ? ' · ATS' : ''}</span>
              </button>
            ))}
          </div>
        </div>
      </section>

      <section className="card">
        <div className="card-head static"><span className="card-title">Page</span></div>
        <div className="card-body fields">
          <div className="field half">
            <label htmlFor="page-size">Paper size</label>
            <select id="page-size" className="input" value={resume.settings.pageSize} onChange={(e) => update((r) => ((r.settings.pageSize = e.target.value), r))}>
              <option value="A4">A4 (India, UK, EU)</option>
              <option value="Letter">US Letter</option>
            </select>
          </div>
          <div className="field half">
            <label htmlFor="show-photo">Photo</label>
            <select id="show-photo" className="input" value={ov.showPhoto == null ? 'auto' : ov.showPhoto ? 'on' : 'off'} onChange={(e) => setOv('showPhoto', e.target.value === 'auto' ? null : e.target.value === 'on')}>
              <option value="auto">Template default ({base.photo ? 'shown' : 'hidden'})</option>
              <option value="on">Show photo</option>
              <option value="off">Hide photo</option>
            </select>
          </div>
        </div>
      </section>

      <section className="card">
        <button className="card-head card-toggle adv-toggle" onClick={() => setAdv((a) => !a)} aria-expanded={adv}>
          <Ico n="chevron" size={16} className="chev" />
          <span className="card-title">Advanced settings</span>
          {changed > 0 && <span className="count">{changed} changed</span>}
        </button>
        {!adv && <p className="card-note muted">Colours, fonts, size and spacing. Each template already has sensible defaults.</p>}
        {adv && (
          <div className="card-body">
            <div className="fields">
              <div className="half"><Color id="c-accent" label="Accent colour" value={s.accent} onChange={(v) => setOv('accent', v)} /></div>
              <div className="half"><Color id="c-text" label="Text colour" value={s.text} onChange={(v) => setOv('text', v)} /></div>
              {base.layout === 'sidebar' && <div className="half"><Color id="c-side" label="Sidebar colour" value={s.sideBg} onChange={(v) => setOv('sideBg', v)} /></div>}
              {base.header === 'banner' && <div className="half"><Color id="c-banner" label="Header colour" value={s.bannerBg} onChange={(v) => setOv('bannerBg', v)} /></div>}
              <div className="field half">
                <label htmlFor="f-head">Heading font</label>
                <select id="f-head" className="input" value={s.hf} onChange={(e) => setOv('hf', e.target.value)}>
                  {Object.keys(FONTS).map((f) => <option key={f} value={f}>{f}</option>)}
                </select>
              </div>
              <div className="field half">
                <label htmlFor="f-body">Body font</label>
                <select id="f-body" className="input" value={s.bf} onChange={(e) => setOv('bf', e.target.value)}>
                  {Object.keys(FONTS).map((f) => <option key={f} value={f}>{f}</option>)}
                </select>
              </div>
              <div className="half"><Range id="r-fs" label="Font size" value={s.fs} min={8} max={13} step={0.5} unit="pt" onChange={(v) => setOv('fs', v)} /></div>
              <div className="half"><Range id="r-lh" label="Line spacing" value={s.lh} min={1.1} max={1.8} step={0.05} unit="" onChange={(v) => setOv('lh', v)} /></div>
              <div className="half"><Range id="r-m" label="Page margins" value={s.margin} min={8} max={25} step={1} unit="mm" onChange={(v) => setOv('margin', v)} /></div>
              <div className="half"><Range id="r-g" label="Section spacing" value={s.gap} min={4} max={22} step={1} unit="pt" onChange={(v) => setOv('gap', v)} /></div>
              <div className="field half">
                <label htmlFor="sel-title">Heading style</label>
                <select id="sel-title" className="input" value={s.title} onChange={(e) => setOv('title', e.target.value)}>
                  {[['rule', 'Underline'], ['double', 'Double rule'], ['caps', 'Small caps'], ['bar', 'Accent bar'], ['fill', 'Tinted strip'], ['dotted', 'Dotted'], ['plain', 'Plain'], ['side', 'Side heading']].map(([v, l]) => <option key={v} value={v}>{l}</option>)}
                </select>
              </div>
              <div className="field half">
                <label htmlFor="sel-skills">Skills display</label>
                <select id="sel-skills" className="input" value={s.skills} onChange={(e) => setOv('skills', e.target.value)}>
                  {[['inline', 'Comma list'], ['tags', 'Tags'], ['list', 'Bullets'], ['bars', 'Level bars'], ['dots', 'Level dots']].map(([v, l]) => <option key={v} value={v}>{l}</option>)}
                </select>
              </div>
            </div>
            <button className="btn ghost sm" onClick={() => update((r) => ((r.settings.overrides = {}), r))} disabled={!changed}>
              <Ico n="reset" size={15} /> Reset to template defaults
            </button>
          </div>
        )}
      </section>
    </div>
  );
}
