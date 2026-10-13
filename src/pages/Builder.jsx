import React, { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import Resume, { resumeToText } from '../templates/Resume.jsx';
import { getTemplate, resolveStyle } from '../templates/registry.js';
import { SAMPLES } from '../data/samples.js';
import { normalizeResume } from '../data/schema.js';
import Editor from '../builder/Editor.jsx';
import DesignPanel from '../builder/DesignPanel.jsx';
import { Ico, Modal } from '../components/ui.jsx';
import { ThemeToggle } from '../components/Shell.jsx';
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

const PANEL = { min: 340, max: 760, def: 440, key: 'resumeforge-panel-w', previewMin: 420 };

function clampPanel(w) {
  const room = typeof window === 'undefined' ? PANEL.max : window.innerWidth - PANEL.previewMin;
  return Math.round(Math.max(PANEL.min, Math.min(w, PANEL.max, Math.max(PANEL.min, room))));
}

function usePanelWidth() {
  const [w, setW] = useState(() => {
    try {
      const v = parseInt(localStorage.getItem(PANEL.key), 10);
      return clampPanel(Number.isFinite(v) ? v : PANEL.def);
    } catch {
      return PANEL.def;
    }
  });
  const save = (v) => {
    try {
      localStorage.setItem(PANEL.key, String(v));
    } catch {
      /* storage unavailable – width still applies for this visit */
    }
  };
  // Keep the panel inside its limits when the window is resized.
  useEffect(() => {
    const onResize = () => setW((cur) => clampPanel(cur));
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);
  return [w, setW, save];
}

function PanelResizer({ width, setWidth, save, panelRef }) {
  const [drag, setDrag] = useState(false);
  const onDown = (e) => {
    e.preventDefault();
    e.currentTarget.setPointerCapture(e.pointerId);
    setDrag(true);
  };
  const onMove = (e) => {
    if (!drag || !panelRef.current) return;
    setWidth(clampPanel(e.clientX - panelRef.current.getBoundingClientRect().left));
  };
  const onUp = (e) => {
    if (!drag) return;
    e.currentTarget.releasePointerCapture(e.pointerId);
    setDrag(false);
    save(width);
  };
  const onKey = (e) => {
    const step = e.shiftKey ? 60 : 20;
    let next = null;
    if (e.key === 'ArrowLeft') next = width - step;
    else if (e.key === 'ArrowRight') next = width + step;
    else if (e.key === 'Home') next = PANEL.min;
    else if (e.key === 'End') next = PANEL.max;
    if (next === null) return;
    e.preventDefault();
    const v = clampPanel(next);
    setWidth(v);
    save(v);
  };
  return (
    <div
      className={'resizer' + (drag ? ' on' : '')}
      role="separator"
      aria-orientation="vertical"
      aria-label="Resize editor panel"
      aria-valuemin={PANEL.min}
      aria-valuemax={PANEL.max}
      aria-valuenow={width}
      tabIndex={0}
      title="Drag to resize · double-click to reset"
      onPointerDown={onDown}
      onPointerMove={onMove}
      onPointerUp={onUp}
      onPointerCancel={onUp}
      onKeyDown={onKey}
      onDoubleClick={() => {
        setWidth(PANEL.def);
        save(PANEL.def);
      }}
    />
  );
}

function StartOver({ onPick }) {
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
  const pick = (v) => {
    setOpen(false);
    onPick(v);
  };
  return (
    <div className="startover" ref={ref}>
      <button className="btn ghost sm" onClick={() => setOpen((o) => !o)} aria-haspopup="menu" aria-expanded={open}>
        <Ico n="reset" size={15} /> <span>Start over</span> <Ico n="down" size={13} className="so-caret" />
      </button>
      {open && (
        <div className="dropdown right so-menu" role="menu">
          <button role="menuitem" onClick={() => pick('blank')}>
            <span className="so-ico"><Ico n="file" size={16} /></span>
            <span className="so-txt"><strong>Blank resume</strong><small>Clear everything and begin fresh</small></span>
          </button>
          <hr />
          <div className="so-label">Load an example</div>
          {Object.entries(SAMPLES).map(([k, s]) => (
            <button role="menuitem" key={k} onClick={() => pick(k)}>
              <span className="so-ico"><Ico n="user" size={16} /></span>
              <span className="so-txt"><strong>{s.label}</strong><small>Example content you can edit</small></span>
            </button>
          ))}
        </div>
      )}
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
  const panelRef = useRef(null);
  const [panelW, setPanelW, savePanelW] = usePanelWidth();
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
          <a href="/" className="tb-home" title="ResumeForge home" aria-label="ResumeForge home"><Ico n="home" size={17} /></a>
          <button className="tb-tpl" onClick={() => { setTab('design'); setMobileView('edit'); }} title="Change template">
            <Ico n="layout" size={16} /> <span>{tpl.name}</span>
          </button>
          <span className="saved muted">
            {savedAt ? <><Ico n="check" size={14} /> Saved in this browser</> : 'Autosave on'}
          </span>
        </div>
        <div className="tb-right">
          <ThemeToggle />
          <StartOver
            onPick={(v) =>
              setConfirm({
                text: v === 'blank' ? 'Clear everything and start with a blank resume?' : `Replace your current content with the “${SAMPLES[v].label}” example?`,
                act: () => (v === 'blank' ? startBlank() : loadSample(v)),
              })
            }
          />
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

      <div className="split" style={{ '--panel-w': panelW + 'px' }}>
        <div className="panel" ref={panelRef}>
          <div className="tabs" role="tablist">
            <button role="tab" aria-selected={tab === 'content'} className={tab === 'content' ? 'on' : ''} onClick={() => setTab('content')}><Ico n="file" size={16} /> Content</button>
            <button role="tab" aria-selected={tab === 'design'} className={tab === 'design' ? 'on' : ''} onClick={() => setTab('design')}><Ico n="sliders" size={16} /> Design</button>
            <button className="ai-tab" onClick={() => setAi(true)}><Ico n="sparkle" size={16} /> AI assist <span className="pill soon">Soon</span></button>
          </div>
          <div className="panel-scroll">{tab === 'content' ? <Editor onAI={() => setAi(true)} /> : <DesignPanel />}</div>
          <PanelResizer width={panelW} setWidth={setPanelW} save={savePanelW} panelRef={panelRef} />
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
            <a className="btn primary" href="/ai-writer" onClick={() => setAi(false)}>See what’s planned</a>
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
