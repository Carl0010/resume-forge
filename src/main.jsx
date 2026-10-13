import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.jsx';
import { installLinkHandler } from './store.jsx';
import './styles/app.css';
import './templates/resume.css';

installLinkHandler();
createRoot(document.getElementById('root')).render(<App />);
