// Central app configuration. Values can be supplied through Vite env vars (.env file):
//   VITE_API_BASE=https://api.yourdomain.com      -> your AI server (resume parsing)
//   VITE_FIREBASE_API_KEY=...                        -> see src/services/firebaseProvider.js
const env = (typeof import.meta !== 'undefined' && import.meta.env) || {};

export const APP_NAME = 'ResumeForge';

// Base URL of YOUR AI server. Leave empty to run the upload/analyse flow in demo (mock) mode.
export const API_BASE = env.VITE_API_BASE || '';

// Endpoint paths on your server
export const ENDPOINTS = {
  parseResume: '/api/resume/parse', // POST multipart/form-data { file, templateId } -> Resume JSON (see README)
  aiWriter: '/api/resume/ai-write', // reserved for the upcoming AI writer
};

// Upload limits for the AI import feature
export const UPLOAD = {
  maxBytes: 10 * 1024 * 1024,
  accept: '.pdf,.png,.jpg,.jpeg,.webp,.doc,.docx,.txt,.rtf,.odt',
  mimeHint: 'PDF, Word (DOC/DOCX), image (PNG/JPG/WEBP), TXT or RTF',
};

export const firebaseConfig = {
  apiKey: env.VITE_FIREBASE_API_KEY || '',
  authDomain: env.VITE_FIREBASE_AUTH_DOMAIN || '',
  projectId: env.VITE_FIREBASE_PROJECT_ID || '',
  appId: env.VITE_FIREBASE_APP_ID || '',
};
