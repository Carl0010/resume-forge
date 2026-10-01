import React, { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import Resume, { resumeToText } from '../templates/Resume.jsx';
import { getTemplate, resolveStyle } from '../templates/registry.js';
import { SAMPLES } from '../data/samples.js';
import { normalizeResume } from '../data/schema.js';
import Editor from '../builder/Editor.jsx';
import DesignPanel from '../builder/DesignPanel.jsx';
import { Ico, Modal } from '../components/ui.jsx';
import { navigate, useResume, useToast } from '../store.jsx';

const PAGE = { A4: { w: 794, h: 1123 }, Letter: { w: 816, h: 1056 } };

function download(name, text, type) {
  const blob = new Blob([text], { type });
  const a = document.createElement('a');
  a.href = URL.createObjectURL(blob);
  a.download = name;
  document.body.appendChild(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(a.href), 2000);
}

function Preview({ resume }) {
  const wrap = useRef(null);
  const paper = useRef(null);
  const [avail, setAvail] = useState(0);
  const [zoom, setZoom] = useState(null); // null = fit width
  const [h, setH] = useState(1123);
  const size = PAGE[resume.settings.pageSize] || PAGE.A4;

  useLayoutEffect(() => {
    const ro = new ResizeObserver(([e]) => setAvail(e.contentRect.width));
    ro.observe(wrap.current);
    return () => ro.disconnect();
  }, []);
  useLayoutEffect(() => {
    if (!paper.current) return;
    const ro = new ResizeObserver(() => setH(paper.current.offsetHeight));
    ro.observe(paper.current);
    return () => ro.disconnect();
  }, []);

  const fit = avail ? Math.min(1, (avail - 32) / size.w) : 0.6;
  const scale = zoom || fit;
  // Mirror the print rules: first page has no top margin, later pages have top + bottom margins.
  const st = resolveStyle(resume.settings.templateId, resume.settings.overrides);
  const mPx = Math.round(st.margin * 0.8) * 3.78;
  const first = size.h - mPx;
  const rest = size.h - 2 * mPx;
  const pages = h - 4 <= first ? 1 : 1 + Math.ceil((h - 4 - first) / rest);
  const breakAt = (i) => first + i * rest;

  return (
    <div className="preview" ref={wrap}>
      <div className="zoom">
        <button className="icon-btn" onClick={() => setZoom(Math.max(0.3, +(scale - 0.1).toFixed(2)))} aria-label="Zoom out"><Ico n="zoomOut" size={17} /></button>
        <button className="zoom-val" onClick={() => setZoom(null)} title="Fit to width">{Math.round(scale * 100)}%</button>
        <button className="icon-btn" onClick={() => setZoom(Math.min(2, +(scale + 0.1).toFixed(2)))} aria-label="Zoom in"><Ico n="zoomIn" size={17} /></button>
        <span className="zoom-sep" />
        <span className={'pages' + (pages > 2 ? ' warn' : '')}>{pages} page{pages > 1 ? 's' : ''}</span>
      </div>
      <div className="paper-scroll">
        <div className="paper-frame" style={{ width: size.w * scale, height: Math.max(h, size.h) * scale }}>
          <div className="paper-scale" style={{ transform: `scale(${scale})`, width: size.w }}>
            <div ref={paper}><Resume resume={resume} pageSize={resume.settings.pageSize} /></div>
            {Array.from({ length: pages - 1 }, (_, i) => (
              <div key={i} className="page-break" style={{ top: breakAt(i) }}><span>Page {i + 2}</span></div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function Builder({ params }) {
  const { resume, update, replace, startBlank, loadSample, savedAt, setTemplate } = useResume();
  const toast = useToast();
  const [tab, setTab] = useState(params.tab === 'design' ? 'design' : 'content');
  const [mobileView, setMobileView] = useState('edit');
  const [menu, setMenu] = useState(false);
  const [ai, setAi] = useState(false);
  const [confirm, setConfirm] = useState(null);
  const fileRef = useRef(null);
  const tpl = getTemplate(resume.settings.templateId);

  useEffect(() => {
    if (params.t && params.t !== resume.settings.templateId) setTemplate(params.t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [params.t]);

  const fileBase = (resume.personal.fullName || 'resume').trim().replace(/\s+/g, '_');

  const printPdf = () => {
    setMenu(false);
    const s = resolveStyle(resume.settings.templateId, resume.settings.overrides);
    const st = document.getElementById('print-page-style') || document.head.appendChild(Object.assign(document.createElement('style'), { id: 'print-page-style' }));
    const size = resume.settings.pageSize === 'Letter' ? 'letter' : 'A4';
    st.textContent = `@page{size:${size};margin:${Math.round(s.margin * 0.8)}mm 0}@page:first{margin-top:0}`;
    const prev = document.title;
    document.title = fileBase;
    setTimeout(() => {
      try {
        window.print();
      } catch {
        toast('Press Ctrl+P (or Cmd+P) and choose “Save as PDF”.');
      }
      document.title = prev;
    }, 60);
  };

  const importJson = async (e) => {
    const f = e.target.files && e.target.files[0];
    e.target.value = '';
    if (!f) return;
    try {
      const data = JSON.parse(await f.text());
      replace(normalizeResume(data.resume || data));
      toast('Backup restored', 'ok');
    } catch {
      toast('That file is not a valid resume backup (.json).', 'err');
    }
  };

  return (
    <div className="builder" data-view={mobileView}>
      <div className="toolbar">
        <div className="tb-left">
          <button className="tb-tpl" onClick={() => { setTab('design'); setMobileView('edit'); }} title="Change template">
            <Ico n="layout" size={16} /> <span>{tpl.name}</span>
          </button>
          <span className="saved muted">
            {savedAt ? <><Ico n="check" size={14} /> Saved in this browser</> : 'Autosave on'}
          </span>
        </div>
        <div className="tb-right">
          <select id="load-sample" className="input sm" value="" onChange={(e) => {
            const v = e.target.value;
            if (!v) return;
            setConfirm({ text: v === 'blank' ? 'Clear everything and start with a blank resume?' : `Replace your current content with the “${SAMPLES[v].label}” example?`, act: () => (v === 'blank' ? startBlank() : loadSample(v)) });
          }} aria-label="Start over or load example">
            <option value="">Start over…</option>
            <option value="blank">Blank resume</option>
            {Object.entries(SAMPLES).map(([k, s]) => <option key={k} value={k}>Example: {s.label}</option>)}
          </select>
          <div className="dl">
            <button className="btn primary sm" onClick={printPdf}><Ico n="download" size={16} /> Download PDF</button>
            <button className="btn primary sm dl-more" onClick={() => setMenu((m) => !m)} aria-label="More download options" aria-expanded={menu}><Ico n="down" size={15} /></button>
            {menu && (
              <div className="dropdown right" onMouseLeave={() => setMenu(false)}>
                <button onClick={printPdf}><Ico n="file" size={16} /> PDF (print → Save as PDF)</button>
                <button onClick={() => { setMenu(false); download(`${fileBase}.txt`, resumeToText(resume), 'text/plain'); }}><Ico n="file" size={16} /> Plain text for job portals</button>
                <button onClick={() => { setMenu(false); download(`${fileBase}.resume.json`, JSON.stringify({ app: 'ResumeForge', version: 1, resume }, null, 2), 'application/json'); }}><Ico n="download" size={16} /> Backup file (.json)</button>
                <button onClick={() => { setMenu(false); fileRef.current.click(); }}><Ico n="upload" size={16} /> Restore from backup</button>
                <hr />
                <button onClick={() => navigate('/import')}><Ico n="sparkle" size={16} /> Import old resume with AI</button>
              </div>
            )}
            <input ref={fileRef} id="restore-json" type="file" accept=".json,application/json" hidden onChange={importJson} />
          </div>
        </div>
      </div>

      {resume.__example && (
        <div className="example-note">
          <span>You’re looking at example content. Edit it, or</span>
          <button className="btn text sm" onClick={startBlank}>start blank</button>
          <span>·</span>
          <button className="btn text sm" onClick={() => navigate('/import')}>import your old resume</button>
        </div>
      )}

      <div className="split">
        <div className="panel">
          <div className="tabs" role="tablist">
            <button role="tab" aria-selected={tab === 'content'} className={tab === 'content' ? 'on' : ''} onClick={() => setTab('content')}><Ico n="file" size={16} /> Content</button>
            <button role="tab" aria-selected={tab === 'design'} className={tab === 'design' ? 'on' : ''} onClick={() => setTab('design')}><Ico n="sliders" size={16} /> Design</button>
            <button className="ai-tab" onClick={() => setAi(true)}><Ico n="sparkle" size={16} /> AI assist <span className="pill soon">Soon</span></button>
          </div>
          <div className="panel-scroll">{tab === 'content' ? <Editor onAI={() => setAi(true)} /> : <DesignPanel />}</div>
        </div>
        <Preview resume={resume} />
      </div>

      <button className="mobile-switch" onClick={() => setMobileView((v) => (v === 'edit' ? 'preview' : 'edit'))}>
        <Ico n={mobileView === 'edit' ? 'eye' : 'file'} size={18} /> {mobileView === 'edit' ? 'Preview' : 'Edit'}
      </button>

      {createPortal(
        <div id="print-root"><Resume resume={resume} pageSize={resume.settings.pageSize} /></div>,
        document.body
      )}

      <Modal open={ai} onClose={() => setAi(false)} labelledBy="ai-title">
        <div className="soon-modal">
          <div className="login-badge"><Ico n="sparkle" size={22} /></div>
          <h2 id="ai-title">AI writing assistant is on its way</h2>
          <p className="muted">Soon you’ll be able to generate a summary, rewrite bullets with stronger action verbs and tailor your resume to a job description. It will need a free sign-in.</p>
          <div className="soon-actions">
            <a className="btn primary" href="#/ai-writer" onClick={() => setAi(false)}>See what’s planned</a>
            <button className="btn ghost" onClick={() => setAi(false)}>Keep editing</button>
          </div>
        </div>
      </Modal>

      <Modal open={!!confirm} onClose={() => setConfirm(null)} labelledBy="cf-title">
        {confirm && (
          <div className="soon-modal">
            <h2 id="cf-title">Are you sure?</h2>
            <p className="muted">{confirm.text} Download a backup first if you might want it back.</p>
            <div className="soon-actions">
              <button className="btn primary" onClick={() => { confirm.act(); setConfirm(null); toast('Done', 'ok'); }}>Yes, replace</button>
              <button className="btn ghost" onClick={() => setConfirm(null)}>Cancel</button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
