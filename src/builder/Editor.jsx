import React, { useEffect, useRef, useState } from 'react';
import { SECTION_DEFS, sectionTitle, uid } from '../data/schema.js';
import { Ico } from '../components/ui.jsx';
import { useResume, useToast } from '../store.jsx';
import { resolveStyle } from '../templates/registry.js';

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
      {f.type === 'bullets' && <small className="muted">Action → scope → outcome. Use evidence you can explain in an interview; include numbers only when accurate.</small>}
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
          <div key={it.id} className={"compact-row" + (k === "skills" ? " skill-row" : "")}>
            {def.fields.filter(f => f.type !== 'level' || ['bars', 'dots'].includes(resolveStyle(resume.settings.templateId, resume.settings.overrides).skills)).map((f) => (
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
                {def.fields.filter(f => f.type !== 'level' || ['bars', 'dots'].includes(resolveStyle(resume.settings.templateId, resume.settings.overrides).skills)).map((f) => (
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

function isFilled(resume, k) {
  if (k === 'personal') return !!(resume.personal.fullName.trim() && (resume.personal.email.trim() || resume.personal.phone.trim()));
  const def = SECTION_DEFS[k];
  return def.kind === 'list' ? resume[k].length > 0 : !!String(resume[k] || '').trim();
}

function KebabMenu({ items }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);
  useEffect(() => {
    if (!open) return undefined;
    const away = (e) => ref.current && !ref.current.contains(e.target) && setOpen(false);
    const esc = (e) => e.key === 'Escape' && setOpen(false);
    document.addEventListener('mousedown', away);
    document.addEventListener('keydown', esc);
    return () => {
      document.removeEventListener('mousedown', away);
      document.removeEventListener('keydown', esc);
    };
  }, [open]);
  return (
    <div className="kebab" ref={ref}>
      <button className="icon-btn" onClick={() => setOpen((o) => !o)} aria-haspopup="menu" aria-expanded={open} aria-label="Section options" title="Section options">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><circle cx="12" cy="5" r="1.8" /><circle cx="12" cy="12" r="1.8" /><circle cx="12" cy="19" r="1.8" /></svg>
      </button>
      {open && (
        <div className="dropdown right kebab-menu" role="menu">
          {items.map((it) => (
            <button key={it.label} role="menuitem" disabled={it.disabled} onClick={() => { setOpen(false); it.run(); }}>
              {it.icon ? <Ico n={it.icon} size={16} /> : <span className="kebab-aa">Aa</span>} {it.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

function SectionCard({ k, index, total, onAI, open, onToggle }) {
  const { resume, update } = useResume();
  const [renaming, setRenaming] = useState(false);
  const hidden = !!resume.hidden[k];
  const def = SECTION_DEFS[k];
  const count = def.kind === 'list' ? resume[k].length : null;
  const filled = isFilled(resume, k);
  const move = (d) => update((r) => {
    const j = index + d;
    [r.order[index], r.order[j]] = [r.order[j], r.order[index]];
    return r;
  });
  return (
    <section id={`sec-${k}`} className={'card sec-card' + (hidden ? ' is-hidden' : '')}>
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
          <button className="card-toggle" onClick={onToggle} aria-expanded={open}>
            <Ico n="chevron" size={16} className="chev" />
            <span className={'dot' + (filled ? ' on' : '')} title={filled ? 'Filled in' : 'Empty'} aria-hidden="true" />
            <span className="card-title">{sectionTitle(resume, k)}</span>
            {count != null && <span className="count">{count}</span>}
            {hidden && <span className="pill">Hidden</span>}
            <span className="sr-only">{filled ? 'Filled in' : 'Empty'}</span>
          </button>
        )}
        <div className="item-tools">
          <button className="icon-btn" onClick={() => update((r) => ((r.hidden[k] = !hidden), r))} aria-label={hidden ? 'Show section' : 'Hide section'} title={hidden ? 'Show on resume' : 'Hide from resume'}>
            <Ico n={hidden ? 'eyeOff' : 'eye'} size={16} />
          </button>
          <KebabMenu
            items={[
              { label: 'Rename section', run: () => setRenaming(true) },
              { label: 'Move up', icon: 'up', disabled: index === 0, run: () => move(-1) },
              { label: 'Move down', icon: 'down', disabled: index === total - 1, run: () => move(1) },
            ]}
          />
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

function Personal({ open, onToggle }) {
  const { resume, update } = useResume();
  const toast = useToast();
  const p = resume.personal;
  // The photo slot is only usable when the chosen template will actually show a photo.
  const st = resolveStyle(resume.settings.templateId, resume.settings.overrides);
  const hasSlot = st.showPhoto != null ? !!st.showPhoto : !!st.photo;
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
    <section id="sec-personal" className="card">
      <div className="card-head">
        <button className="card-toggle" onClick={onToggle} aria-expanded={open}>
          <Ico n="chevron" size={16} className="chev" />
          <span className={'dot' + (isFilled(resume, 'personal') ? ' on' : '')} aria-hidden="true" />
          <span className="card-title">Personal details</span>
          <span className="sr-only">{isFilled(resume, 'personal') ? 'Filled in' : 'Empty'}</span>
        </button>
      </div>
      {open && (
      <div className="card-body">
        <div className={'photo-row' + (hasSlot ? '' : ' off')}>
          <div className="photo-prev">{p.photo ? <img src={p.photo} alt="Your photo" /> : <Ico n="user" size={26} />}</div>
          <div>
            <label className={'btn ghost sm file-btn' + (hasSlot ? '' : ' is-disabled')} aria-disabled={!hasSlot}>
              <Ico n="image" size={16} /> {p.photo ? 'Change photo' : 'Add photo'}
              <input id="p-photo" type="file" accept="image/*" onChange={onPhoto} disabled={!hasSlot} />
            </label>
            {p.photo && <button className="btn text sm" onClick={() => update((r) => ((r.personal.photo = ''), r))}>Remove</button>}
            <small className="muted block">
              {hasSlot
                ? 'Follow the employer’s instructions and local hiring conventions. Photos are optional.'
                : 'Photos are off. To add one, set Photo to “Show photo” in Design and turn off Simple layout.'}
            </small>
          </div>
        </div>
        <div className="fields">
          {F('fullName', 'Full name', 'John Doe')}
          {F('jobTitle', 'Job title / headline', 'Senior Product Manager')}
          {F('email', 'Email', 'you@email.com', 'half', 'email')}
          {F('phone', 'Phone', '+91 98765 43210', 'half', 'tel')}
          {F('location', 'City, Country', 'Bengaluru, India')}
          {F('linkedin', 'LinkedIn', 'linkedin.com/in/you')}
          {F('website', 'Website / portfolio', 'yourname.dev')}
          {F('github', 'GitHub', 'github.com/you')}
        </div>
      </div>
      )}
    </section>
  );
}

export default function Editor({ onAI }) {
  const { resume } = useResume();
  const [openKeys, setOpenKeys] = useState(() => new Set(['personal', 'summary', 'experience']));
  const keys = ['personal', ...resume.order];
  const visible = keys.filter((k) => k === 'personal' || !resume.hidden[k]);
  const filledCount = visible.filter((k) => isFilled(resume, k)).length;
  const pct = Math.round((filledCount / Math.max(1, visible.length)) * 100);
  const allOpen = keys.every((k) => openKeys.has(k));

  const toggle = (k) => setOpenKeys((cur) => {
    const n = new Set(cur);
    if (n.has(k)) n.delete(k); else n.add(k);
    return n;
  });
  const jump = (k) => {
    setOpenKeys((cur) => new Set(cur).add(k));
    requestAnimationFrame(() => {
      // Scroll only the panel (scrollIntoView would also scroll the clipped page behind it).
      const el = document.getElementById(`sec-${k}`);
      const box = el && el.closest('.panel-scroll');
      if (!box) return;
      const nav = box.querySelector('.sec-nav');
      const y = el.getBoundingClientRect().top - box.getBoundingClientRect().top + box.scrollTop - (nav ? nav.offsetHeight - 16 : 0) - 8;
      box.scrollTo({ top: Math.max(0, y), behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth' });
    });
  };
  const label = (k) => (k === 'personal' ? 'Personal' : sectionTitle(resume, k));

  return (
    <div className="editor">
      <div className="sec-nav" role="navigation" aria-label="Jump to section">
        <div className="sec-progress">
          <div className="sec-progress-bar" role="progressbar" aria-valuemin={0} aria-valuemax={100} aria-valuenow={pct} aria-label="Resume completion"><span style={{ width: pct + '%' }} /></div>
          <span className="tiny muted">{filledCount} of {visible.length} sections filled</span>
          <button className="btn text sm" onClick={() => setOpenKeys(allOpen ? new Set() : new Set(keys))}>{allOpen ? 'Collapse all' : 'Expand all'}</button>
        </div>
        <div className="sec-chips">
          {keys.map((k) => (
            <button key={k} className={'sec-chip' + (isFilled(resume, k) ? ' filled' : '') + (resume.hidden[k] ? ' off' : '')} onClick={() => jump(k)}>
              <span className="dot" aria-hidden="true" />{label(k)}
            </button>
          ))}
        </div>
      </div>
      <Personal open={openKeys.has('personal')} onToggle={() => toggle('personal')} />
      {resume.order.map((k, i) => (
        <SectionCard key={k} k={k} index={i} total={resume.order.length} onAI={onAI} open={openKeys.has(k)} onToggle={() => toggle(k)} />
      ))}
    </div>
  );
}
