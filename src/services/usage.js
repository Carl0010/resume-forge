import { storage } from './storage.js';

const KEY = 'rf.usage.v1';
const EVENTS = new Set(['template_selected', 'template_switched', 'comparison_opened', 'pdf_requested', 'print_dialog_closed', 'text_export_created']);
// Aggregate counts stay in this browser. No resume content, identity or timestamps are recorded.
// A print-dialog close is NOT evidence that the user saved a PDF.
export function recordUsage(event, templateId) {
  if (!EVENTS.has(event) || !/^[a-z0-9-]+$/.test(templateId || '')) return;
  const stored = storage.get(KEY, {});
  const counts = stored && typeof stored === 'object' && !Array.isArray(stored) ? stored : {};
  const key = `${event}:${templateId}`;
  counts[key] = (Number(counts[key]) || 0) + 1;
  storage.set(KEY, counts);
  window.dispatchEvent(new CustomEvent('rf:usage', { detail: { event, templateId } }));
}
export const getUsageCounts = () => storage.get(KEY, {});
