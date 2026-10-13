import React from 'react';
import { ROUTES, GUIDES } from '../seo-data.js';
import { SITE_CONTACT } from '../content/pages.js';
import { Ico } from '../components/ui.jsx';

const fmtDate = (iso) => new Date(iso + 'T00:00:00Z').toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric', timeZone: 'UTC' });

function Sections({ sections }) {
  return sections.map((s) => (
    <section key={s.h} className="doc-sec">
      <h2>{s.h}</h2>
      {(s.p || []).map((t) => <p key={t}>{t}</p>)}
      {s.ul && <ul>{s.ul.map((t) => <li key={t}>{t}</li>)}</ul>}
    </section>
  ));
}

export function GuidesIndex() {
  const m = ROUTES['/guides'];
  return (
    <div className="wrap page doc">
      <div className="page-head">
        <h1>{m.h1}</h1>
        <p className="muted">{m.intro}</p>
      </div>
      <div className="guide-grid">
        {GUIDES.map((g) => (
          <a key={g.slug} href={`/guides/${g.slug}`} className="guide-card">
            <h2>{g.h1.charAt(0).toUpperCase() + g.h1.slice(1)}</h2>
            <p className="muted">{g.description}</p>
            <span className="link">Read the guide <Ico n="chevron" size={14} /></span>
          </a>
        ))}
      </div>
    </div>
  );
}

export default function Doc({ path }) {
  const m = ROUTES[path];
  const isGuide = m.kind === 'guide';
  return (
    <article className="wrap page doc">
      {isGuide && (
        <nav className="crumbs" aria-label="Breadcrumb">
          <a href="/">Home</a> <span aria-hidden="true">/</span> <a href="/guides">Guides</a>
        </nav>
      )}
      <header className="page-head">
        <h1>{m.h1}</h1>
        {isGuide && <p className="tiny muted">Updated {fmtDate(m.date)}</p>}
        <p className="lead doc-lead">{m.intro}</p>
      </header>
      <div className="doc-body">
        <Sections sections={m.sections} />
        {path === '/contact' && SITE_CONTACT.email && (
          <section className="doc-sec">
            <h2>Email</h2>
            <p><a href={`mailto:${SITE_CONTACT.email}`}>{SITE_CONTACT.email}</a></p>
          </section>
        )}
        {path === '/contact' && (
          <p><a className="btn primary" href={SITE_CONTACT.githubIssues} target="_blank" rel="noopener noreferrer">Open an issue on GitHub</a></p>
        )}
      </div>
      {isGuide && (
        <aside className="doc-cta">
          <a className="btn primary lg" href={m.cta.href}>{m.cta.label} <Ico n="chevron" size={16} /></a>
          {m.related && (
            <div className="doc-related">
              <strong>Keep reading</strong>
              {m.related.map((r) => <a key={r.href} href={r.href}>{r.label}</a>)}
            </div>
          )}
        </aside>
      )}
    </article>
  );
}
