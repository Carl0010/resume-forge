// AI features. Both require a signed-in user.
import { API_BASE, ENDPOINTS, UPLOAD } from '../config.js';
import auth from './authProvider.js';
import { normalizeResume } from '../data/schema.js';
import { sampleResume } from '../data/samples.js';

export function validateUpload(file) {
  if (!file) return 'Choose a file to upload.';
  if (file.size > UPLOAD.maxBytes) return `That file is ${(file.size / 1048576).toFixed(1)} MB. The limit is ${UPLOAD.maxBytes / 1048576} MB.`;
  const ext = '.' + (file.name.split('.').pop() || '').toLowerCase();
  if (!UPLOAD.accept.split(',').includes(ext)) return `“${ext}” files aren't supported. Use ${UPLOAD.mimeHint}.`;
  return null;
}

/**
 * Send an old resume to YOUR server for AI analysis.
 *
 * Request : POST {API_BASE}/api/resume/parse   (multipart/form-data)
 *           fields: file (binary), templateId (string)
 *           header: Authorization: Bearer <Firebase ID token>
 * Response: 200 JSON  { resume: <Resume JSON as in src/data/schema.js> }
 *           (bullets may be a string with \n or an array of strings; missing fields are fine)
 *
 * onStage(stageIndex) is called as work progresses so the UI can show steps.
 */
export async function parseResume(file, templateId, onStage = () => {}) {
  const token = await auth.getIdToken();
  if (!token) throw new Error('Please sign in to use AI import.');

  if (!API_BASE) {
    // DEMO MODE – no server configured. Simulates the pipeline and returns example data,
    // pulling the email / phone / name from plain-text uploads so the demo feels real.
    const stages = [700, 1100, 1200, 700];
    let extracted = {};
    if (/\.(txt|rtf)$/i.test(file.name)) {
      try {
        const text = await file.text();
        const email = text.match(/[\w.+-]+@[\w-]+\.[\w.]+/);
        const phone = text.match(/\+?\d[\d\s-]{8,}\d/);
        const firstLine = text.split('\n').map((s) => s.trim()).find(Boolean);
        extracted = { email: email && email[0], phone: phone && phone[0].trim(), fullName: firstLine && firstLine.length < 40 ? firstLine : undefined };
      } catch {
        /* ignore */
      }
    }
    for (let i = 0; i < stages.length; i++) {
      onStage(i);
      await new Promise((r) => setTimeout(r, stages[i]));
    }
    const r = sampleResume('professional');
    Object.entries(extracted).forEach(([k, v]) => v && (r.personal[k] = v));
    r.settings.templateId = templateId;
    return { resume: r, demo: true };
  }

  onStage(0);
  const body = new FormData();
  body.append('file', file);
  body.append('templateId', templateId);
  const res = await fetch(API_BASE + ENDPOINTS.parseResume, {
    method: 'POST',
    headers: { Authorization: `Bearer ${token}` },
    body,
  });
  onStage(2);
  if (!res.ok) {
    let msg = `Server returned ${res.status}.`;
    try {
      const j = await res.json();
      if (j.error || j.message) msg = j.error || j.message;
    } catch {
      /* ignore */
    }
    throw new Error(msg);
  }
  const json = await res.json();
  onStage(3);
  const r = normalizeResume(json.resume || json);
  r.settings.templateId = templateId;
  return { resume: r, demo: false };
}

// Reserved for the upcoming "Build with AI" writer. Define the contract here when ready.
export async function aiWrite(/* { prompt, resume, section } */) {
  throw new Error('AI writer is coming soon.');
}
