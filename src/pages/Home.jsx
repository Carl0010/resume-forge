import React, { useMemo } from 'react';
import { TEMPLATES } from '../templates/registry.js';
import { sampleResume } from '../data/samples.js';
import { ScaledResume, Ico } from '../components/ui.jsx';
import { navigate, useResume } from '../store.jsx';
import { FAQ } from '../seo-data.js';

const FEATURED = ['harvard', 'metro', 'summit', 'elegant', 'chrono', 'executive-pro'];

const AUDIENCES = [
  {
    key: 'student', title: 'College students & freshers', tpl: 'fresh-grad', cat: 'student',
    text: 'Education-first layouts that make projects, internships and hackathons count when work experience is thin.',
  },
  {
    key: 'professional', title: 'Corporate employees', tpl: 'stanford', cat: 'professional',
    text: 'Clear formats that put measurable achievements first, with a simple single-column option for applications.',
  },
  {
    key: 'executive', title: 'Senior leaders & executives', tpl: 'pinnacle', cat: 'executive',
    text: 'Board-ready CVs with a strong leadership summary, core competencies and P&L-scale results.',
  },
];


export default function Home() {
  const { setTemplate } = useResume();
  const samples = useMemo(() => ({
    professional: sampleResume('professional'),
    student: sampleResume('student'),
    executive: sampleResume('executive'),
  }), []);

  const use = (id) => {
    setTemplate(id);
    navigate('/builder');
  };

  return (
    <div className="home">
      <section className="hero wrap">
        <div className="hero-copy">
          <span className="hero-kicker"><span className="live-dot" aria-hidden="true" /> Free resume &amp; CV builder · no login</span>
          <h1>
            A resume you’re proud of, <mark>before the deadline.</mark>
          </h1>
          <p className="lead">
            Pick from {TEMPLATES.length} readable templates, type on the left, watch it update on the right, and download a clean PDF.
            No watermark, no hidden charges.
          </p>
          <div className="hero-cta">
            <a className="btn primary lg" href="/builder">Start building <Ico n="chevron" size={16} /></a>
            <a className="btn text lg" href="/import"><Ico n="upload" /> or import an old resume</a>
          </div>
          <dl className="hero-facts">
            <div><dt>{TEMPLATES.length}</dt><dd>templates</dd></div>
            <div className="fact-hero"><dt><mark>No watermark</mark></dt><dd>on any download</dd></div>
            <div><dt>2 min</dt><dd>to a first draft</dd></div>
          </dl>
          <p className="hero-ats tiny muted">Layouts with clear headings and selectable text. Follow the employer’s file-format instructions.</p>
        </div>

        <div className="hero-art" aria-hidden="true">
          <div className="demo">
            <div className="demo-bar"><i /><i /><i /><span>resumeforge / builder</span></div>
            <div className="demo-body">
              <div className="demo-panel">
                <div className="demo-tabs"><b>Content</b><span>Design</span></div>
                <div className="demo-field"><small>Full name</small><div>Aarav Mehta<u className="caret" /></div></div>
                <div className="demo-field"><small>Job title</small><div>Senior Product Manager</div></div>
                <div className="demo-chips"><span className="on">Summary</span><span>Experience</span><span>Skills</span></div>
                <div className="demo-lines"><i /><i /><i /></div>
              </div>
              <div className="demo-paper"><ScaledResume resume={samples.professional} templateId="stanford" /></div>
            </div>
          </div>
          <div className="float f-pdf"><Ico n="download" size={15} /> PDF ready</div>
          <div className="float f-ats"><Ico n="check" size={15} /> Simple structure</div>
          <div className="hero-side"><ScaledResume resume={samples.student} templateId="campus" /></div>
        </div>
      </section>

      <section className="strip">
        <div className="wrap strip-in">
          <div><strong>{TEMPLATES.length}</strong><span>templates</span></div>
          <div><strong>Free</strong><span>every template, always</span></div>
          <div><strong>0</strong><span>sign-ups needed</span></div>
          <div><strong>A4 / Letter</strong><span>page sizes</span></div>
        </div>
      </section>

      <section className="wrap section">
        <div className="section-head">
          <h2>Built for where you are in your career</h2>
          <p className="muted">Each audience gets layouts and example content that match what recruiters look for at that level.</p>
        </div>
        <div className="aud-grid">
          {AUDIENCES.map((a) => (
            <article key={a.key} className="aud">
              <div className="aud-thumb"><ScaledResume resume={samples[a.key]} templateId={a.tpl} /></div>
              <div className="aud-body">
                <h3>{a.title}</h3>
                <p className="muted">{a.text}</p>
                <a className="link" href={`/templates/${a.cat}`}>See {a.cat === 'professional' ? 'corporate' : a.cat} templates <Ico n="chevron" size={14} /></a>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="wrap section">
        <div className="section-head row">
          <div>
            <h2>Popular templates</h2>
            <p className="muted">Click any design to start with it. You can switch templates later without retyping.</p>
          </div>
          <a className="btn ghost" href="/templates">Browse all {TEMPLATES.length}</a>
        </div>
        <div className="tpl-grid">
          {FEATURED.map((id) => {
            const t = TEMPLATES.find((x) => x.id === id);
            return (
              <button key={id} className="tpl-card" onClick={() => use(id)}>
                <div className="tpl-thumb"><ScaledResume resume={samples.professional} templateId={id} /></div>
                <div className="tpl-meta">
                  <strong>{t.name}</strong>
                  {t.ats && <span className="pill ats">Simple</span>}
                </div>
              </button>
            );
          })}
        </div>
      </section>

      <section className="wrap section steps-sec">
        <h2>From blank page to PDF in three steps</h2>
        <ol className="steps">
          <li>
            <h3>Choose a template</h3>
            <p className="muted">Filter by simple structure, student, corporate, executive, creative or academic.</p>
          </li>
          <li>
            <h3>Fill in your details</h3>
            <p className="muted">Guided sections with examples. Reorder, rename or hide any section.</p>
          </li>
          <li>
            <h3>Download</h3>
            <p className="muted">Export a crisp PDF, a plain-text version for online forms, or a backup file.</p>
          </li>
        </ol>
      </section>

      <section className="wrap section ai-band">
        <div className="ai-card">
          <span className="pill">AI · sign-in required</span>
          <h3>Have an old resume?</h3>
          <p>Upload a PDF, Word file or even a photo. Our AI reads it and rebuilds it in the template you choose.</p>
          <a className="btn primary" href="/import"><Ico n="upload" /> Import with AI</a>
        </div>
        <div className="ai-card muted-card">
          <span className="pill soon">Coming soon</span>
          <h3>Write it with AI</h3>
          <p>Answer a few questions and let AI draft your summary and achievement bullets.</p>
          <a className="btn ghost" href="/ai-writer">Learn more</a>
        </div>
      </section>

      <section className="wrap section faq">
        <h2>Questions</h2>
        {FAQ.map(([q, a]) => (
          <details key={q}>
            <summary>{q}</summary>
            <p className="muted">{a}</p>
          </details>
        ))}
      </section>
    </div>
  );
}
