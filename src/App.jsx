import React, { useEffect } from 'react';
import { AuthProvider, ResumeProvider, ToastProvider, useRoute } from './store.jsx';
import { Navbar, Footer, LoginModal } from './components/Shell.jsx';
import Home from './pages/Home.jsx';
import Templates from './pages/Templates.jsx';
import Builder from './pages/Builder.jsx';
import ImportPage from './pages/Import.jsx';
import AIWriter from './pages/AIWriter.jsx';
import { metaFor, canonicalFor } from './seo-data.js';

function setMeta(sel, attr, key, value) {
  let el = document.head.querySelector(sel);
  if (!el) {
    el = document.createElement('meta');
    el.setAttribute(attr, key);
    document.head.appendChild(el);
  }
  el.setAttribute('content', value);
}

// Keep title/description/canonical/social tags correct as the user navigates (crawlers get the same values from the pre-rendered HTML).
function useHead(path, params, known) {
  useEffect(() => {
    const m = known ? metaFor(path, params) : metaFor('/__missing__');
    document.title = m.title;
    setMeta('meta[name="description"]', 'name', 'description', m.description);
    setMeta('meta[property="og:title"]', 'property', 'og:title', m.title);
    setMeta('meta[property="og:description"]', 'property', 'og:description', m.description);
    const url = known ? canonicalFor(path, params) : canonicalFor('/');
    setMeta('meta[property="og:url"]', 'property', 'og:url', url);
    let link = document.head.querySelector('link[rel="canonical"]');
    if (!link) {
      link = document.createElement('link');
      link.rel = 'canonical';
      document.head.appendChild(link);
    }
    link.href = url;
    setMeta('meta[name="robots"]', 'name', 'robots', m.noindex ? 'noindex, follow' : 'index, follow');
  }, [path, params.c, known]);
}

function NotFound() {
  return (
    <div className="wrap page center-page">
      <h1>Page not found</h1>
      <p className="muted">That link doesn’t go anywhere.</p>
      <a className="btn primary" href="/">Go home</a>
    </div>
  );
}

function Routes() {
  const { path, params } = useRoute();
  let page;
  if (path === '/') page = <Home />;
  else if (path.startsWith('/templates')) page = <Templates params={params} key={params.c || 'all'} />;
  else if (path.startsWith('/builder')) page = <Builder params={params} />;
  else if (path.startsWith('/import')) page = <ImportPage params={params} />;
  else if (path.startsWith('/ai-writer')) page = <AIWriter />;
  else page = <NotFound />;
  const known = ['/', '/templates', '/builder', '/import', '/ai-writer'].includes(path);
  useHead(path, params, known);
  const isBuilder = path.startsWith('/builder');
  return (
    <div className={'app' + (isBuilder ? ' app-builder' : '')}>
      <a className="skip-link" href="#main" onClick={(e) => { e.preventDefault(); const m = document.getElementById("main"); if (m) { m.focus(); m.scrollIntoView(); } }}>Skip to content</a>
      {!isBuilder && <Navbar path={path} />}
      <main id="main" className="app-main" tabIndex={-1}>{page}</main>
      {!isBuilder && <Footer />}
      <LoginModal />
    </div>
  );
}

export default function App() {
  return (
    <ToastProvider>
      <AuthProvider>
        <ResumeProvider>
          <Routes />
        </ResumeProvider>
      </AuthProvider>
    </ToastProvider>
  );
}
