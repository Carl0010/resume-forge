import React, { useState } from 'react';
import { SECTION_DEFS, sectionTitle, uid } from '../data/schema.js';
import { Ico } from '../components/ui.jsx';
import { useResume, useToast } from '../store.jsx';

function Field({ f, value, onChange, idp }) {
  const id = `${idp}-${f.name}`;
  let control;
  if (f.type === 'bullets' || f.type === 'textarea')
    control = <textarea id={id} className="input" rows={f.type === 'bullets' ? 4 : 2} value={value || ''} placeholder={f.ph} onChange={(e) => onChange(e.target.value)} />;
  else if (f.type === 'level')
    control = (
      <div className="level-pick" role="radiogroup" aria-label="Skill level">
        {[1, 2, 3, 4, 5].map((n) => (
          <button key={n} type="button" role="radio" aria-checked={Number(value) === n} className={Number(value) >= n ? 'on' : ''} onClick={() => onChange(n)} title={['Beginner', 'Elementary', 'Intermediate', 'Advanced', 'Expert'][n - 1]} />
        ))}
      </div>
    );
  else if (f.options)
    control = (
      <>
        <input id={id} className="input" list={id + '-l'} value={value || ''} placeholder={f.ph} onChange={(e) => onChange(e.target.value)} />
        <datalist id={id + '-l'}>{f.options.map((o) => <option key={o} value={o} />)}</datalist>
      </>
    );
  else control = <input id={id} className="input" value={value || ''} placeholder={f.ph} onChange={(e) => onChange(e.target.value)} />;
  return (
    <div className={'field' + (f.third ? ' third' : f.half ? ' half' : '')}>
      <label htmlFor={id}>{f.label}</label>
      {control}
    </div>
  );
}

function ListSection({ k }) {
  const { resume, update } = useResume();
  const def = SECTION_DEFS[k];
  const items = resume[k];
  const [open, setOpen] = useState(null);
  const set = (i, name, v) => update((r) => ((r[k][i][name] = v), r));
  const add = () => {
    const id = uid();
    update((r) => (r[k].push({ id, ...(k === 'skills' ? { level: 4 } : {}) }), r));
    setOpen(id);
  };
  const move = (i, d) => update((r) => {
    const j = i + d;
    if (j < 0 || j >= r[k].length) return r;
    [r[k][i], r[k][j]] = [r[k][j], r[k][i]];
    return r;
  });

  if (def.compact)
    return (
      <div className="compact-list">
        {items.map((it, i) => (
          <div key={it.id} className="compact-row">
            {def.fields.map((f) => (
              <Field key={f.name} f={{ ...f, half: false, third: false }} value={it[f.name]} idp={`${k}-${it.id}`} onChange={(v) => set(i, f.name, v)} />
            ))}
            <button className="icon-btn" onClick={() => update((r) => (r[k].splice(i, 1), r))} aria-label={`Remove ${def.title(it)}`}><Ico n="trash" size={16} /></button>
          </div>
        ))}
        <button className="btn dashed" onClick={add}><Ico n="plus" size={16} /> {def.addLabel}</button>
      </div>
    );

  return (
    <div className="items">
      {items.map((it, i) => {
        const isOpen = open === it.id;
        return (
          <div key={it.id} className={'item' + (isOpen ? ' open' : '')}>
            <div className="item-head">
              <button className="item-toggle" onClick={() => setOpen(isOpen ? null : it.id)} aria-expanded={isOpen}>
                <Ico n="chevron" size={16} className="chev" />
                <span>
                  <strong>{def.title(it)}</strong>
                  {def.subtitle && def.subtitle(it) && <small>{def.subtitle(it)}</small>}
                </span>
              </button>
              <div className="item-tools">
                <button className="icon-btn" onClick={() => move(i, -1)} disabled={i === 0} aria-label="Move up"><Ico n="up" size={15} /></button>
                <button className="icon-btn" onClick={() => move(i, 1)} disabled={i === items.length - 1} aria-label="Move down"><Ico n="down" size={15} /></button>
                <button className="icon-btn" onClick={() => update((r) => (r[k].splice(i + 1, 0, { ...r[k][i], id: uid() }), r))} aria-label="Duplicate"><Ico n="copy" size={15} /></button>
                <button className="icon-btn danger" onClick={() => update((r) => (r[k].splice(i, 1), r))} aria-label="Delete"><Ico n="trash" size={15} /></button>
              </div>
            </div>
            {isOpen && (
              <div className="item-body fields">
                {def.fields.map((f) => (
                  <Field key={f.name} f={f} value={it[f.name]} idp={`${k}-${it.id}`} onChange={(v) => set(i, f.name, v)} />
                ))}
              </div>
            )}
          </div>
        );
      })}
      <button className="btn dashed" onClick={add}><Ico n="plus" size={16} /> {def.addLabel}</button>
    </div>
  );
}

function SectionCard({ k, index, total, onAI }) {
  const { resume, update } = useResume();
  const [open, setOpen] = useState(k === 'summary' || k === 'experience');
  const [renaming, setRenaming] = useState(false);
  const hidden = !!resume.hidden[k];
  const def = SECTION_DEFS[k];
  const count = def.kind === 'list' ? resume[k].length : null;
  const move = (d) => update((r) => {
    const j = index + d;
    [r.order[index], r.order[j]] = [r.order[j], r.order[index]];
    return r;
  });
  return (
    <section className={'card sec-card' + (hidden ? ' is-hidden' : '')}>
      <div className="card-head">
        {renaming ? (
          <input
            id={`rename-${k}`}
            className="input rename"
            autoFocus
            defaultValue={sectionTitle(resume, k)}
            onBlur={(e) => {
              const v = e.target.value.trim();
              update((r) => ((r.titles[k] = v && v !== def.label ? v : undefined), r));
              setRenaming(false);
            }}
            onKeyDown={(e) => e.key === 'Enter' && e.currentTarget.blur()}
          />
        ) : (
          <button className="card-toggle" onClick={() => setOpen((o) => !o)} aria-expanded={open}>
            <Ico n="chevron" size={16} className="chev" />
            <span className="card-title">{sectionTitle(resume, k)}</span>
            {count != null && <span className="count">{count}</span>}
            {hidden && <span className="pill">Hidden</span>}
          </button>
        )}
        <div className="item-tools">
          <button className="icon-btn" onClick={() => setRenaming(true)} aria-label="Rename section" title="Rename section">Aa</button>
          <button className="icon-btn" onClick={() => update((r) => ((r.hidden[k] = !hidden), r))} aria-label={hidden ? 'Show section' : 'Hide section'} title={hidden ? 'Show on resume' : 'Hide from resume'}>
            <Ico n={hidden ? 'eyeOff' : 'eye'} size={16} />
          </button>
          <button className="icon-btn" onClick={() => move(-1)} disabled={index === 0} aria-label="Move section up"><Ico n="up" size={15} /></button>
          <button className="icon-btn" onClick={() => move(1)} disabled={index === total - 1} aria-label="Move section down"><Ico n="down" size={15} /></button>
        </div>
      </div>
      {open && (
        <div className="card-body">
          {def.kind === 'text' ? (
            <div className="field">
              <div className="label-row">
                <label htmlFor="summary">2–4 sentences on who you are and the value you bring</label>
                <button className="ai-chip" onClick={onAI}><Ico n="sparkle" size={14} /> Write with AI</button>
              </div>
              <textarea id="summary" className="input" rows={5} value={resume.summary} onChange={(e) => update((r) => ((r.summary = e.target.value), r))} placeholder="Product manager with 6 years in fintech…" />
              <small className="muted">{resume.summary.length} characters · aim for 300–600</small>
            </div>
          ) : (
            <ListSection k={k} />
          )}
        </div>
      )}
    </section>
  );
}

function Personal() {
  const { resume, update } = useResume();
  const toast = useToast();
  const p = resume.personal;
  const set = (k) => (e) => update((r) => ((r.personal[k] = e.target.value), r));
  const onPhoto = (e) => {
    const f = e.target.files && e.target.files[0];
    if (!f) return;
    if (!f.type.startsWith('image/')) return toast('Choose an image file (JPG or PNG).', 'err');
    if (f.size > 3 * 1048576) return toast('Photo must be under 3 MB.', 'err');
    const img = new Image();
    const url = URL.createObjectURL(f);
    img.onload = () => {
      // Downscale + square-crop to keep saved data small.
      const s = Math.min(img.width, img.height);
      const c = document.createElement('canvas');
      c.width = c.height = 360;
      c.getContext('2d').drawImage(img, (img.width - s) / 2, (img.height - s) / 2, s, s, 0, 0, 360, 360);
      update((r) => ((r.personal.photo = c.toDataURL('image/jpeg', 0.85)), r));
      URL.revokeObjectURL(url);
    };
    img.src = url;
    e.target.value = '';
  };
  const F = (k, label, ph, cls = 'half', type = 'text') => (
    <div className={'field ' + cls}>
      <label htmlFor={`p-${k}`}>{label}</label>
      <input id={`p-${k}`} className="input" type={type} value={p[k]} placeholder={ph} onChange={set(k)} />
    </div>
  );
  return (
    <section className="card">
      <div className="card-head static"><span className="card-title">Personal details</span></div>
      <div className="card-body">
        <div className="photo-row">
          <div className="photo-prev">{p.photo ? <img src={p.photo} alt="Your photo" /> : <Ico n="user" size={26} />}</div>
          <div>
            <label className="btn ghost sm file-btn">
              <Ico n="image" size={16} /> {p.photo ? 'Change photo' : 'Add photo'}
              <input id="p-photo" type="file" accept="image/*" onChange={onPhoto} />
            </label>
            {p.photo && <button className="btn text sm" onClick={() => update((r) => ((r.personal.photo = ''), r))}>Remove</button>}
            <small className="muted block">Shown only on templates with a photo slot. Many Indian, US and UK employers prefer no photo.</small>
          </div>
        </div>
        <div className="fields">
          {F('fullName', 'Full name', 'Aarav Mehta')}
          {F('jobTitle', 'Job title / headline', 'Senior Product Manager')}
          {F('email', 'Email', 'you@email.com', 'half', 'email')}
          {F('phone', 'Phone', '+91 98765 43210', 'half', 'tel')}
          {F('location', 'City, Country', 'Bengaluru, India')}
          {F('linkedin', 'LinkedIn', 'linkedin.com/in/you')}
          {F('website', 'Website / portfolio', 'yourname.dev')}
          {F('github', 'GitHub', 'github.com/you')}
        </div>
      </div>
    </section>
  );
}

export default function Editor({ onAI }) {
  const { resume } = useResume();
  return (
    <div className="editor">
      <Personal />
      {resume.order.map((k, i) => (
        <SectionCard key={k} k={k} index={i} total={resume.order.length} onAI={onAI} />
      ))}
    </div>
  );
}
