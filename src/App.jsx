import React from 'react';
import { AuthProvider, ResumeProvider, ToastProvider, useRoute } from './store.jsx';
import { Navbar, Footer, LoginModal } from './components/Shell.jsx';
import Home from './pages/Home.jsx';
import Templates from './pages/Templates.jsx';
import Builder from './pages/Builder.jsx';
import ImportPage from './pages/Import.jsx';
import AIWriter from './pages/AIWriter.jsx';

function NotFound() {
  return (
    <div className="wrap page center-page">
      <h1>Page not found</h1>
      <p className="muted">That link doesn’t go anywhere.</p>
      <a className="btn primary" href="#/">Go home</a>
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
