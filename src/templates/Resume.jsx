import React from 'react';
import { FONTS, isDark, resolveStyle } from './registry.js';
import { bulletsOf, sectionTitle, SIDE_SECTIONS } from '../data/schema.js';

const range = (a, b) => [a, b].filter(Boolean).join(' – ');
const has = (v) => v != null && String(v).trim() !== '';

const Icon = ({ k }) => {
  const p = {
    email: 'M3 5h18v14H3z M3 6l9 7 9-7',
    phone: 'M5 3h4l2 5-3 2a12 12 0 0 0 6 6l2-3 5 2v4a2 2 0 0 1-2 2A18 18 0 0 1 3 5a2 2 0 0 1 2-2z',
    location: 'M12 21s-7-6.5-7-12a7 7 0 0 1 14 0c0 5.5-7 12-7 12z M12 11.5a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5z',
    website: 'M12 3a9 9 0 1 0 0 18 9 9 0 0 0 0-18z M3 12h18 M12 3c3 3.5 3 14.5 0 18 M12 3c-3 3.5-3 14.5 0 18',
    linkedin: 'M4 9h4v11H4z M6 4a2 2 0 1 1 0 4 2 2 0 0 1 0-4z M10 9h4v2c1-1.5 2.5-2.2 4-2.2 2.5 0 3 1.8 3 4.2v7h-4v-6c0-1.4-.3-2.3-1.6-2.3-1.4 0-2.4 1-2.4 2.6V20h-4z',
    github: 'M9 19c-4 1.5-4-2-6-2.5m12 5v-3.5c0-1 .1-1.4-.5-2 2.8-.3 5.5-1.4 5.5-6a4.6 4.6 0 0 0-1.3-3.2 4.2 4.2 0 0 0-.1-3.2s-1-.3-3.4 1.3a11.6 11.6 0 0 0-6 0C6.8 2.3 5.8 2.6 5.8 2.6a4.2 4.2 0 0 0-.1 3.2A4.6 4.6 0 0 0 4.4 9c0 4.6 2.7 5.7 5.5 6-.6.6-.6 1.2-.5 2V21',
  }[k];
  return (
    <svg className="rs-ic" viewBox="0 0 24 24" width="1em" height="1em" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d={p} />
    </svg>
  );
};

const CONTACT_KEYS = ['email', 'phone', 'location', 'website', 'linkedin', 'github'];

function Contacts({ p, icons, stacked }) {
  const items = CONTACT_KEYS.filter((k) => has(p[k]));
  if (!items.length) return null;
  return (
    <div className={'rs-contacts' + (stacked ? ' stacked' : '')}>
      {items.map((k) => (
        <span key={k} className="rs-contact">
          {icons && <Icon k={k} />}
          <span>{p[k]}</span>
        </span>
      ))}
    </div>
  );
}

function Photo({ src, name }) {
  if (src) return <img className="rs-photo" src={src} alt="" />;
  const initials = (name || '?').split(/\s+/).filter(Boolean).slice(0, 2).map((s) => s[0]).join('').toUpperCase();
  return <div className="rs-photo rs-photo-ph">{initials || '?'}</div>;
}

function Level({ n, mode }) {
  const v = Math.max(0, Math.min(5, Number(n) || 0));
  if (mode === 'bars') return <span className="rs-bar"><i style={{ width: `${v * 20}%` }} /></span>;
  if (mode === 'dots')
    return (
      <span className="rs-dots">
        {[1, 2, 3, 4, 5].map((i) => <i key={i} className={i <= v ? 'on' : ''} />)}
      </span>
    );
  return null;
}

function Bullets({ text }) {
  const b = bulletsOf(text);
  if (!b.length) return null;
  return <ul className="rs-ul">{b.map((x, i) => <li key={i}>{x}</li>)}</ul>;
}

function Entry({ title, sub, date, meta, children }) {
  return (
    <div className="rs-item">
      <div className="rs-row">
        <div className="rs-head">
          {has(title) && <span className="rs-it">{title}</span>}
          {has(sub) && <span className="rs-sub">{sub}</span>}
        </div>
        {has(date) && <div className="rs-date">{date}</div>}
      </div>
      {has(meta) && <div className="rs-meta">{meta}</div>}
      {children}
    </div>
  );
}

function SectionBody({ k, r, s, inSide }) {
  switch (k) {
    case 'summary':
      return has(r.summary) ? <p className="rs-p">{r.summary}</p> : null;
    case 'experience':
      return r.experience.map((e) => (
        <Entry key={e.id} title={e.role} sub={e.company} date={range(e.start, e.end)} meta={e.location}>
          <Bullets text={e.bullets} />
        </Entry>
      ));
    case 'education':
      return r.education.map((e) => (
        <Entry key={e.id} title={e.degree} sub={e.school} date={range(e.start, e.end)} meta={[e.location, e.grade].filter(Boolean).join(' · ')}>
          <Bullets text={e.bullets} />
        </Entry>
      ));
    case 'projects':
      return r.projects.map((e) => (
        <Entry key={e.id} title={e.name} sub={e.link} date={range(e.start, e.end)}>
          <Bullets text={e.bullets} />
        </Entry>
      ));
    case 'volunteer':
      return r.volunteer.map((e) => (
        <Entry key={e.id} title={e.role} sub={e.org} date={range(e.start, e.end)}>
          <Bullets text={e.bullets} />
        </Entry>
      ));
    case 'custom':
      return r.custom.map((e) => (
        <Entry key={e.id} title={e.title} sub={e.subtitle} date={e.date}>
          <Bullets text={e.bullets} />
        </Entry>
      ));
    case 'publications':
      return r.publications.map((e) => (
        <Entry key={e.id} title={e.title} sub={e.publisher} date={e.date} meta={e.link} />
      ));
    case 'certifications':
      return r.certifications.map((e) => <Entry key={e.id} title={e.name} sub={e.issuer} date={e.date} />);
    case 'awards':
      return r.awards.map((e) => (
        <Entry key={e.id} title={e.title} sub={e.issuer} date={e.date}>
          {has(e.description) && <p className="rs-p rs-small">{e.description}</p>}
        </Entry>
      ));
    case 'references':
      return r.references.map((e) => <Entry key={e.id} title={e.name} sub={e.position} meta={e.contact} />);
    case 'skills': {
      const list = r.skills.filter((x) => has(x.name));
      let mode = s.skills;
      if (!inSide && (mode === 'bars' || mode === 'dots') && s.layout !== 'twocol') mode = 'grid-' + mode;
      if (mode === 'inline') return <p className="rs-p">{list.map((x) => x.name).join('  •  ')}</p>;
      if (mode === 'tags') return <div className="rs-tags">{list.map((x) => <span key={x.id} className="rs-tag">{x.name}</span>)}</div>;
      if (mode === 'list') return <ul className="rs-ul rs-plain">{list.map((x) => <li key={x.id}>{x.name}</li>)}</ul>;
      const m = mode.replace('grid-', '');
      return (
        <div className={'rs-levels' + (mode.startsWith('grid-') ? ' grid' : '')}>
          {list.map((x) => (
            <div key={x.id} className="rs-level"><span>{x.name}</span><Level n={x.level} mode={m} /></div>
          ))}
        </div>
      );
    }
    case 'languages': {
      const list = r.languages.filter((x) => has(x.name));
      if (inSide || s.layout === 'twocol')
        return <div className="rs-kv">{list.map((x) => <div key={x.id}><span>{x.name}</span><em>{x.fluency}</em></div>)}</div>;
      return <p className="rs-p">{list.map((x) => (x.fluency ? `${x.name} (${x.fluency})` : x.name)).join('  •  ')}</p>;
    }
    case 'interests': {
      const list = r.interests.filter((x) => has(x.name));
      if (s.skills === 'tags') return <div className="rs-tags">{list.map((x) => <span key={x.id} className="rs-tag">{x.name}</span>)}</div>;
      return <p className="rs-p">{list.map((x) => x.name).join('  •  ')}</p>;
    }
    default:
      return null;
  }
}

const isEmpty = (r, k) => (k === 'summary' ? !has(r.summary) : !(r[k] && r[k].length));

function Section({ k, r, s, inSide }) {
  if (r.hidden[k] || isEmpty(r, k)) return null;
  return (
    <section className={`rs-sec rs-sec-${k}`}>
      <h2 className="rs-st"><span>{sectionTitle(r, k)}</span></h2>
      <div className="rs-body"><SectionBody k={k} r={r} s={s} inSide={inSide} /></div>
    </section>
  );
}

function Header({ r, s, showPhoto, compactContacts }) {
  const p = r.personal;
  return (
    <header className="rs-header">
      {showPhoto && <Photo src={p.photo} name={p.fullName} />}
      <div className="rs-id">
        <h1 className="rs-name">{p.fullName || 'Your Name'}</h1>
        {has(p.jobTitle) && <div className="rs-title">{p.jobTitle}</div>}
      </div>
      {!compactContacts && <Contacts p={p} icons={s.layout !== 'classic' && s.layout !== 'compact' && s.header !== 'center'} />}
    </header>
  );
}

export function styleVars(s) {
  const sideDark = isDark(s.sideBg);
  const bannerDark = isDark(s.bannerBg);
  return {
    '--accent': s.accent,
    '--text': s.text,
    '--hf': FONTS[s.hf] || s.hf,
    '--bf': FONTS[s.bf] || s.bf,
    '--fs': `${s.fs}pt`,
    '--lh': s.lh,
    '--pad': `${s.margin}mm`,
    '--gap': `${s.gap}pt`,
    '--side-bg': s.sideBg,
    '--side-fg': sideDark ? '#f8fafc' : s.text,
    '--side-accent': sideDark ? '#ffffff' : s.accent,
    '--side-muted': sideDark ? 'rgba(255,255,255,.72)' : '#5b6472',
    '--banner-bg': s.bannerBg,
    '--banner-fg': bannerDark ? '#ffffff' : s.text,
    '--banner-muted': bannerDark ? 'rgba(255,255,255,.8)' : '#4b5563',
  };
}

// The resume renderer. `resume` is the data model, `pageSize` = 'A4' | 'Letter'.
export default function Resume({ resume, templateId, overrides, pageSize = 'A4', className = '' }) {
  const r = resume;
  const tid = templateId || r.settings.templateId;
  const s = resolveStyle(tid, overrides || r.settings.overrides);
  const showPhoto = s.showPhoto != null ? !!s.showPhoto : s.photo;
  const order = r.order;
  const attrs = {
    className: `rs ${className}`,
    'data-layout': s.layout,
    'data-header': s.header,
    'data-title': s.title,
    'data-side': s.side,
    'data-page': pageSize,
    style: styleVars(s),
  };

  if (s.layout === 'sidebar') {
    const side = order.filter((k) => SIDE_SECTIONS.includes(k));
    const main = order.filter((k) => !SIDE_SECTIONS.includes(k));
    return (
      <div {...attrs}>
        <aside className="rs-side">
          {showPhoto && <Photo src={r.personal.photo} name={r.personal.fullName} />}
          <section className="rs-sec">
            <h2 className="rs-st"><span>Contact</span></h2>
            <Contacts p={r.personal} icons stacked />
          </section>
          {side.map((k) => <Section key={k} k={k} r={r} s={s} inSide />)}
        </aside>
        <main className="rs-main">
          <Header r={r} s={s} showPhoto={false} compactContacts />
          {main.map((k) => <Section key={k} k={k} r={r} s={s} />)}
        </main>
      </div>
    );
  }

  if (s.layout === 'twocol') {
    const side = order.filter((k) => SIDE_SECTIONS.includes(k));
    const main = order.filter((k) => !SIDE_SECTIONS.includes(k));
    return (
      <div {...attrs}>
        <Header r={r} s={s} showPhoto={showPhoto} />
        <div className="rs-cols">
          <main className="rs-main">{main.map((k) => <Section key={k} k={k} r={r} s={s} />)}</main>
          <aside className="rs-aside">{side.map((k) => <Section key={k} k={k} r={r} s={s} inSide />)}</aside>
        </div>
      </div>
    );
  }

  return (
    <div {...attrs}>
      <Header r={r} s={s} showPhoto={showPhoto} />
      <div className="rs-flow">{order.map((k) => <Section key={k} k={k} r={r} s={s} />)}</div>
    </div>
  );
}

// Plain-text export (ATS-safe .txt)
export function resumeToText(r) {
  const p = r.personal;
  const lines = [p.fullName, p.jobTitle, CONTACT_KEYS.map((k) => p[k]).filter(Boolean).join(' | '), ''];
  for (const k of r.order) {
    if (r.hidden[k] || isEmpty(r, k)) continue;
    lines.push(sectionTitle(r, k).toUpperCase());
    if (k === 'summary') lines.push(r.summary);
    else if (k === 'skills') lines.push(r.skills.map((x) => x.name).join(', '));
    else if (k === 'languages') lines.push(r.languages.map((x) => `${x.name}${x.fluency ? ` (${x.fluency})` : ''}`).join(', '));
    else if (k === 'interests') lines.push(r.interests.map((x) => x.name).join(', '));
    else
      for (const e of r[k]) {
        const title = e.role || e.degree || e.name || e.title || '';
        const sub = e.company || e.school || e.org || e.issuer || e.publisher || e.subtitle || e.position || e.link || '';
        const date = e.date || range(e.start, e.end);
        lines.push([title, sub].filter(Boolean).join(', ') + (date ? ` (${date})` : ''));
        bulletsOf(e.bullets).forEach((b) => lines.push(`  - ${b}`));
        if (e.description) lines.push(`  ${e.description}`);
      }
    lines.push('');
  }
  return lines.filter((l) => l != null).join('\n');
}
