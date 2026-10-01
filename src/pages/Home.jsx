import React, { useMemo } from 'react';
import { TEMPLATES } from '../templates/registry.js';
import { sampleResume } from '../data/samples.js';
import { ScaledResume, Ico } from '../components/ui.jsx';
import { navigate, useResume } from '../store.jsx';

const FEATURED = ['harvard', 'metro', 'summit', 'elegant', 'chrono', 'executive-pro'];

const AUDIENCES = [
  {
    key: 'student', title: 'College students & freshers', tpl: 'fresh-grad', cat: 'student',
    text: 'Education-first layouts that make projects, internships and hackathons count when work experience is thin.',
  },
  {
    key: 'professional', title: 'Corporate employees', tpl: 'stanford', cat: 'professional',
    text: 'Clean, ATS-friendly formats that put measurable achievements first and pass Workday, Taleo and Greenhouse.',
  },
  {
    key: 'executive', title: 'Senior leaders & executives', tpl: 'pinnacle', cat: 'executive',
    text: 'Board-ready CVs with a strong leadership summary, core competencies and P&L-scale results.',
  },
];

const FAQ = [
  ['Is it really free?', 'Yes. Every template, the live preview and PDF download are free. There is no paid tier hiding behind the download button and no watermark.'],
  ['Do I need to create an account?', 'No. Your resume is saved automatically in this browser. Sign-in with Google is only needed for AI features such as importing an old resume.'],
  ['Will my resume get past ATS software?', 'Templates tagged “ATS-friendly” use a single reading order, real text and standard headings, which is what applicant tracking systems parse most reliably.'],
  ['How do I download a PDF?', 'Click “Download PDF” in the builder and choose “Save as PDF” in the print dialog. The text stays selectable, which recruiters and ATS tools need.'],
  ['Can I change fonts and colours?', 'Yes. Open Design → Advanced settings to change the accent colour, text colour, fonts, size, spacing and margins. Templates look right without touching these.'],
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
          <span className="eyebrow">Free resume &amp; CV builder</span>
          <h1>
            A resume you’re proud of, <mark>before the deadline.</mark>
          </h1>
          <p className="lead">
            Pick from {TEMPLATES.length} recruiter-tested templates, type on the left, watch it update on the right, and download a clean PDF.
            No login. No hidden charges.
          </p>
          <div className="hero-cta">
            <a className="btn primary lg" href="#/builder">Start building, free</a>
            <a className="btn ghost lg" href="#/import"><Ico n="upload" /> Import old resume</a>
          </div>
          <ul className="ticks">
            <li><Ico n="check" size={16} /> Live preview as you type</li>
            <li><Ico n="check" size={16} /> ATS-friendly options</li>
            <li><Ico n="check" size={16} /> Autosaves in your browser</li>
          </ul>
        </div>
        <div className="hero-art" aria-hidden="true">
          <div className="paper p2"><ScaledResume resume={samples.student} templateId="campus" /></div>
          <div className="paper p1"><ScaledResume resume={samples.professional} templateId="stanford" /></div>
        </div>
      </section>

      <section className="strip">
        <div className="wrap strip-in">
          <div><strong>{TEMPLATES.length}</strong><span>templates</span></div>
          <div><strong>₹0</strong><span>to download</span></div>
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
                <a className="link" href={`#/templates?c=${a.cat}`}>See {a.cat === 'professional' ? 'corporate' : a.cat} templates <Ico n="chevron" size={14} /></a>
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
          <a className="btn ghost" href="#/templates">Browse all {TEMPLATES.length}</a>
        </div>
        <div className="tpl-grid">
          {FEATURED.map((id) => {
            const t = TEMPLATES.find((x) => x.id === id);
            return (
              <button key={id} className="tpl-card" onClick={() => use(id)}>
                <div className="tpl-thumb"><ScaledResume resume={samples.professional} templateId={id} /></div>
                <div className="tpl-meta">
                  <strong>{t.name}</strong>
                  {t.ats && <span className="pill ats">ATS</span>}
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
            <p className="muted">Filter by ATS-friendly, student, corporate, executive, creative or academic.</p>
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
          <a className="btn primary" href="#/import"><Ico n="upload" /> Import with AI</a>
        </div>
        <div className="ai-card muted-card">
          <span className="pill soon">Coming soon</span>
          <h3>Write it with AI</h3>
          <p>Answer a few questions and let AI draft your summary and achievement bullets.</p>
          <a className="btn ghost" href="#/ai-writer">Learn more</a>
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
