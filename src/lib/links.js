// Explicitly allow web URLs only; imported resume data must not create script links.
export function webHref(value) {
  const text = String(value || '').trim();
  if (!text || /[\s\u0000-\u001f]/.test(text) || text.startsWith('//')) return null;
  if (/^[a-z][a-z\d+.-]*:/i.test(text) && !/^https?:\/\//i.test(text)) return null;
  try {
    const url = new URL(/^https?:\/\//i.test(text) ? text : `https://${text}`);
    return ['https:', 'http:'].includes(url.protocol) && url.hostname.includes('.') && !url.username && !url.password ? url.href : null;
  } catch { return null; }
}

export function contactHref(kind, value) {
  const text = String(value || '').trim();
  if (kind === 'email') return /^[^\s@?&#]+@[^\s@?&#]+\.[^\s@?&#]+$/.test(text) ? `mailto:${text}` : null;
  if (kind === 'phone') return /^\+?[\d ()-]{5,}$/.test(text) ? `tel:${text.replace(/[^\d+]/g, '')}` : null;
  return ['website', 'linkedin', 'github'].includes(kind) ? webHref(text) : null;
}

export const linkLabel = (value) => String(value || '').replace(/^https?:\/\//i, '').replace(/\/$/, '');
