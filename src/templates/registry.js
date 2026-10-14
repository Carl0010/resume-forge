// 52 templates across eight layout families. Tags describe design properties, not ATS certification.

export const FONTS = {
  Inter: "'Inter', 'Helvetica Neue', Arial, sans-serif",
  Lato: "'Lato', 'Helvetica Neue', Arial, sans-serif",
  Roboto: "'Roboto', Arial, sans-serif",
  'Open Sans': "'Open Sans', Arial, sans-serif",
  'Source Sans 3': "'Source Sans 3', 'Segoe UI', Arial, sans-serif",
  'IBM Plex Sans': "'IBM Plex Sans', 'Segoe UI', Arial, sans-serif",
  Montserrat: "'Montserrat', 'Segoe UI', Arial, sans-serif",
  Raleway: "'Raleway', 'Segoe UI', Arial, sans-serif",
  Poppins: "'Poppins', 'Segoe UI', Arial, sans-serif",
  'Nunito Sans': "'Nunito Sans', 'Segoe UI', Arial, sans-serif",
  'Work Sans': "'Work Sans', 'Segoe UI', Arial, sans-serif",
  Merriweather: "'Merriweather', Georgia, serif",
  'EB Garamond': "'EB Garamond', Garamond, Georgia, serif",
  Lora: "'Lora', Georgia, serif",
  'Playfair Display': "'Playfair Display', Georgia, serif",
  'Libre Baskerville': "'Libre Baskerville', Baskerville, Georgia, serif",
  'Crimson Pro': "'Crimson Pro', Georgia, serif",
  'PT Serif': "'PT Serif', Georgia, serif",
  Georgia: 'Georgia, serif',
  Arial: 'Arial, Helvetica, sans-serif',
  Calibri: "Calibri, Carlito, 'Segoe UI', Arial, sans-serif",
};

export const CATEGORIES = [
  { id: 'all', label: 'All' },
  { id: 'ats', label: 'Simple structure' },
  { id: 'student', label: 'Students & freshers' },
  { id: 'professional', label: 'Corporate' },
  { id: 'executive', label: 'Executive' },
  { id: 'modern', label: 'Modern' },
  { id: 'creative', label: 'Creative' },
  { id: 'academic', label: 'Academic CV' },
];

export const LAYOUTS = {
  classic: 'Single column',
  sidebar: 'Sidebar',
  banner: 'Header banner',
  labels: 'Side headings',
  timeline: 'Timeline',
  twocol: 'Two column',
  compact: 'Compact one-page',
  minimal: 'Minimal',
};

const D = {
  header: 'left', title: 'rule', skills: 'grouped', hf: 'Inter', bf: 'Inter',
  accent: '#1f2937', text: '#1f2328', sideBg: '#f3f5f8', side: 'left', bannerBg: '#1f2937',
  photo: false, fs: 10.5, lh: 1.4, margin: 16, gap: 12,
};

const t = (id, name, tags, layout, o = {}) => ({
  ...D, id, name, tags, layout, ...o,
  ats: tags.includes('ats') && ['classic', 'minimal', 'compact'].includes(layout),
});

export const TEMPLATES = [
  // ── Single column / ATS classics ─────────────────────────────
  t('harvard', 'Harvard', ['ats', 'student', 'professional'], 'classic', { header: 'center', title: 'rule', hf: 'EB Garamond', bf: 'EB Garamond', accent: '#111111', fs: 11, desc: 'The classic campus-recruiting format. Serif, centered, zero distractions.' }),
  t('oxford', 'Oxford', ['ats', 'professional', 'academic'], 'classic', { header: 'center', title: 'double', hf: 'Libre Baskerville', bf: 'Libre Baskerville', accent: '#1f3a5f', fs: 10.5, desc: 'Double-ruled headings and Baskerville for a traditional, scholarly look.' }),
  t('stanford', 'Stanford', ['ats', 'student', 'professional'], 'classic', { header: 'left', title: 'rule', hf: 'Source Sans 3', bf: 'Source Sans 3', accent: '#8c1515', fs: 10.5, desc: 'Clean sans with a cardinal accent. Great for tech and consulting.' }),
  t('princeton', 'Princeton', ['ats', 'professional'], 'classic', { header: 'center', title: 'caps', hf: 'Crimson Pro', bf: 'Crimson Pro', accent: '#222222', fs: 11.5, desc: 'Small-caps headings, generous serif body text.' }),
  t('yale', 'Yale', ['ats', 'professional'], 'classic', { header: 'underline', title: 'rule', hf: 'Lora', bf: 'Lora', accent: '#00356b', fs: 10.5, desc: 'Underlined name block with a navy accent.' }),
  t('columbia', 'Columbia', ['ats', 'professional', 'student'], 'classic', { header: 'center', title: 'bar', hf: 'Lato', bf: 'Lato', accent: '#1d4f91', fs: 10.5, desc: 'Accent bar headings make sections easy to scan.' }),
  t('berkeley', 'Berkeley', ['ats', 'professional'], 'classic', { header: 'left', title: 'fill', hf: 'Open Sans', bf: 'Open Sans', accent: '#003262', fs: 10.5, desc: 'Tinted heading strips with a deep blue accent.' }),
  t('wharton', 'Wharton', ['ats', 'executive', 'professional'], 'classic', { header: 'left', title: 'rule', hf: 'Merriweather', bf: 'Open Sans', accent: '#011f5b', fs: 10.5, desc: 'Business-school polish: serif headings, sans body.' }),
  t('ivy', 'Ivy League', ['ats', 'student'], 'classic', { header: 'center', title: 'dotted', hf: 'PT Serif', bf: 'PT Serif', accent: '#14532d', fs: 10.5, desc: 'Dotted rules and forest-green headings.' }),
  t('clean-ats', 'Clean ATS', ['ats', 'professional'], 'classic', { header: 'left', title: 'caps', hf: 'Roboto', bf: 'Roboto', accent: '#333333', fs: 10.5, desc: 'Plain single-column structure with standard headings.' }),
  t('corporate', 'Corporate', ['ats', 'professional'], 'classic', { header: 'split', title: 'rule', hf: 'IBM Plex Sans', bf: 'IBM Plex Sans', accent: '#0f4c81', fs: 10.5, desc: 'Name left, contacts right. Tidy and businesslike.' }),
  t('chairman', 'Chairman', ['ats', 'executive'], 'classic', { header: 'center', title: 'caps', hf: 'EB Garamond', bf: 'EB Garamond', accent: '#7c5c1c', fs: 11.5, desc: 'Understated gold accents for board-level profiles.' }),
  t('fresh-grad', 'Fresh Graduate', ['ats', 'student'], 'classic', { header: 'left', title: 'bar', hf: 'Poppins', bf: 'Poppins', accent: '#6d28d9', fs: 10.5, skills: 'grouped', desc: 'Clear headings and a restrained accent for first applications.' }),
  t('scholar', 'Scholar CV', ['ats', 'academic'], 'classic', { header: 'center', title: 'rule', hf: 'Crimson Pro', bf: 'Crimson Pro', accent: '#3f3f46', fs: 11.5, desc: 'Academic CV with room for publications.' }),

  // ── Minimal ─────────────────────────────────────────────────
  t('minimal', 'Minimal', ['ats', 'modern', 'professional'], 'minimal', { header: 'left', title: 'plain', hf: 'Inter', bf: 'Inter', accent: '#111827', fs: 10.5, desc: 'Whitespace does the work. No rules, no noise.' }),
  t('nordic', 'Nordic', ['ats', 'modern'], 'minimal', { header: 'left', title: 'plain', hf: 'Work Sans', bf: 'Work Sans', accent: '#0e7490', fs: 10.5, skills: 'grouped', desc: 'Light Scandinavian minimalism with a teal accent.' }),
  t('paper', 'Paper', ['ats', 'professional'], 'minimal', { header: 'center', title: 'plain', hf: 'Lora', bf: 'Source Sans 3', accent: '#44403c', fs: 10.5, desc: 'Soft serif headings on a quiet page.' }),

  // ── Sidebar ─────────────────────────────────────────────────
  t('metro', 'Metro', ['modern', 'professional'], 'sidebar', { side: 'left', sideBg: '#1e293b', hf: 'Poppins', bf: 'Poppins', accent: '#0284c7', photo: false, skills: 'grouped', title: 'caps', fs: 10.5, desc: 'Dark sidebar with grouped skills and optional photo.' }),
  t('horizon', 'Horizon', ['modern', 'professional', 'student'], 'sidebar', { side: 'left', sideBg: '#eef2f7', hf: 'Inter', bf: 'Inter', accent: '#2563eb', photo: false, skills: 'grouped', title: 'rule', fs: 10.5, desc: 'Light sidebar, restrained blue accents and grouped skills.' }),
  t('atlas', 'Atlas', ['modern', 'professional'], 'sidebar', { side: 'right', sideBg: '#eef7f5', hf: 'Montserrat', bf: 'Open Sans', accent: '#0f766e', skills: 'grouped', title: 'caps', fs: 10.5, desc: 'Right-hand sidebar keeps experience front and centre.' }),
  t('nova', 'Nova', ['modern', 'creative'], 'sidebar', { side: 'left', sideBg: '#134e4a', hf: 'Raleway', bf: 'Raleway', accent: '#0d9488', photo: false, skills: 'grouped', title: 'bar', fs: 10.5, desc: 'Deep teal sidebar with a confident feel.' }),
  t('quartz', 'Quartz', ['modern', 'professional'], 'sidebar', { side: 'right', sideBg: '#f5f5f4', hf: 'Lora', bf: 'Lato', accent: '#57534e', skills: 'grouped', title: 'rule', fs: 10.5, desc: 'Warm greys with serif headings.' }),
  t('cascade', 'Cascade', ['modern', 'professional'], 'sidebar', { side: 'left', sideBg: '#1e40af', hf: 'Nunito Sans', bf: 'Nunito Sans', accent: '#1d4ed8', photo: false, skills: 'grouped', title: 'caps', fs: 10.5, desc: 'Bold cobalt sidebar, crisp white text.' }),
  t('orbit', 'Orbit', ['modern', 'creative'], 'sidebar', { side: 'right', sideBg: '#111827', hf: 'Montserrat', bf: 'Inter', accent: '#7c3aed', skills: 'grouped', title: 'bar', fs: 10.5, desc: 'Charcoal sidebar with a violet accent.' }),
  t('sage', 'Sage', ['modern', 'student'], 'sidebar', { side: 'left', sideBg: '#e8f0ea', hf: 'Work Sans', bf: 'Work Sans', accent: '#3f6212', photo: false, skills: 'grouped', title: 'rule', fs: 10.5, desc: 'Calm green sidebar, grouped skills.' }),
  t('slate', 'Slate', ['modern', 'professional'], 'sidebar', { side: 'left', sideBg: '#334155', hf: 'IBM Plex Sans', bf: 'IBM Plex Sans', accent: '#475569', skills: 'grouped', title: 'caps', fs: 10.5, desc: 'Neutral slate sidebar for any industry.' }),
  t('ember', 'Ember', ['creative', 'modern'], 'sidebar', { side: 'left', sideBg: '#7c2d12', hf: 'Playfair Display', bf: 'Lato', accent: '#c2410c', photo: false, skills: 'grouped', title: 'rule', fs: 10.5, desc: 'Warm rust tones and an elegant serif.' }),
  t('campus', 'Campus', ['student', 'modern'], 'sidebar', { side: 'left', sideBg: '#f1eefc', hf: 'Nunito Sans', bf: 'Nunito Sans', accent: '#6d28d9', photo: false, skills: 'grouped', title: 'bar', fs: 10.5, desc: 'Approachable lavender sidebar for first jobs.' }),
  t('studio', 'Studio', ['creative'], 'sidebar', { side: 'right', sideBg: '#fdf2f8', hf: 'Raleway', bf: 'Raleway', accent: '#be185d', photo: false, skills: 'grouped', title: 'caps', fs: 10.5, desc: 'For designers and creatives who want personality.' }),

  // ── Banner ──────────────────────────────────────────────────
  t('summit', 'Summit', ['modern', 'professional'], 'banner', { header: 'banner', bannerBg: '#1e3a8a', hf: 'Montserrat', bf: 'Open Sans', accent: '#1e3a8a', title: 'rule', skills: 'grouped', fs: 10.5, desc: 'Navy header band, clean body.' }),
  t('aurora', 'Aurora', ['creative', 'modern'], 'banner', { header: 'banner', bannerBg: '#5b21b6', hf: 'Poppins', bf: 'Poppins', accent: '#6d28d9', photo: false, title: 'bar', skills: 'grouped', fs: 10.5, desc: 'Vivid violet header with an optional photo.' }),
  t('pinnacle', 'Pinnacle', ['executive'], 'banner', { header: 'banner', bannerBg: '#0c0a09', hf: 'Playfair Display', bf: 'Lato', accent: '#a16207', title: 'caps', skills: 'grouped', fs: 10.5, desc: 'Black and gold, made for the C-suite.' }),
  t('coral', 'Coral', ['creative', 'student'], 'banner', { header: 'banner', bannerBg: '#e25b45', hf: 'Nunito Sans', bf: 'Nunito Sans', accent: '#c2410c', photo: false, title: 'rule', skills: 'grouped', fs: 10.5, desc: 'Warm and upbeat for early careers.' }),
  t('skyline', 'Skyline', ['modern', 'professional'], 'banner', { header: 'banner', bannerBg: '#e0ecff', hf: 'Inter', bf: 'Inter', accent: '#1d4ed8', title: 'caps', skills: 'grouped', fs: 10.5, desc: 'Soft blue header with dark text.' }),
  t('crimson', 'Crimson', ['professional', 'executive'], 'banner', { header: 'banner', bannerBg: '#7f1d1d', hf: 'Merriweather', bf: 'Source Sans 3', accent: '#991b1b', title: 'rule', skills: 'grouped', fs: 10.5, desc: 'Deep red header, traditional body.' }),
  t('visionary', 'Visionary', ['executive'], 'banner', { header: 'banner', bannerBg: '#134e4a', hf: 'Libre Baskerville', bf: 'Source Sans 3', accent: '#0f766e', title: 'caps', skills: 'grouped', fs: 10.5, desc: 'Leadership profile with a teal masthead.' }),
  t('intern', 'Intern', ['student', 'modern'], 'banner', { header: 'banner', bannerBg: '#ccfbf1', hf: 'Work Sans', bf: 'Work Sans', accent: '#0f766e', title: 'bar', skills: 'grouped', fs: 10.5, desc: 'Fresh mint header for internships.' }),

  // ── Side headings ──────────────────────────────────────────
  t('elegant', 'Elegant', ['executive', 'professional'], 'labels', { header: 'left', title: 'side', hf: 'Playfair Display', bf: 'Lato', accent: '#a16207', fs: 10.5, desc: 'Headings in a margin column, gold accent.' }),
  t('swiss', 'Swiss', ['modern', 'creative'], 'labels', { header: 'left', title: 'side', hf: 'Inter', bf: 'Inter', accent: '#dc2626', fs: 10.5, skills: 'grouped', desc: 'International typographic style, red accent.' }),
  t('architect', 'Architect', ['ats', 'professional'], 'labels', { header: 'left', title: 'side', hf: 'Work Sans', bf: 'Work Sans', accent: '#334155', fs: 10.5, desc: 'Structured grid for engineers and architects.' }),
  t('editorial', 'Editorial', ['creative', 'professional'], 'labels', { header: 'center', title: 'side', hf: 'Lora', bf: 'Lora', accent: '#9a3412', fs: 10.5, desc: 'Magazine-like rhythm with serif type.' }),
  t('researcher', 'Researcher', ['academic', 'ats'], 'labels', { header: 'left', title: 'side', hf: 'PT Serif', bf: 'PT Serif', accent: '#1e3a8a', fs: 10.5, desc: 'Academic CV with margin headings.' }),

  // ── Timeline ───────────────────────────────────────────────
  t('chrono', 'Chrono', ['modern', 'professional'], 'timeline', { header: 'left', title: 'caps', hf: 'Inter', bf: 'Inter', accent: '#2563eb', skills: 'grouped', fs: 10.5, desc: 'Career path drawn as a timeline.' }),
  t('journey', 'Journey', ['creative', 'student'], 'timeline', { header: 'center', title: 'bar', hf: 'Poppins', bf: 'Poppins', accent: '#9333ea', skills: 'grouped', fs: 10.5, desc: 'Playful timeline with purple accents.' }),
  t('milestone', 'Milestone', ['professional'], 'timeline', { header: 'split', title: 'rule', hf: 'Source Sans 3', bf: 'Source Sans 3', accent: '#15803d', skills: 'grouped', fs: 10.5, desc: 'Timeline markers for long careers.' }),

  // ── Two column (no coloured sidebar) ───────────────────────
  t('executive-pro', 'Executive Pro', ['executive'], 'twocol', { header: 'underline', title: 'rule', hf: 'Merriweather', bf: 'Source Sans 3', accent: '#1e3a8a', skills: 'grouped', fs: 10.5, desc: 'Core competencies alongside a results-led career history.' }),
  t('boardroom', 'Boardroom', ['executive'], 'twocol', { header: 'center', title: 'double', hf: 'Libre Baskerville', bf: 'Lato', accent: '#0f172a', skills: 'grouped', fs: 10.5, desc: 'Formal, symmetrical and senior.' }),
  t('director', 'Director', ['executive', 'professional'], 'twocol', { header: 'split', title: 'caps', hf: 'IBM Plex Sans', bf: 'IBM Plex Sans', accent: '#334155', skills: 'grouped', fs: 10.5, desc: 'Two-column leadership profile with grouped expertise.' }),
  t('techie', 'Techie', ['modern', 'student'], 'twocol', { header: 'left', title: 'bar', hf: 'IBM Plex Sans', bf: 'IBM Plex Sans', accent: '#059669', skills: 'grouped', fs: 10.5, desc: 'Developer-focused with projects and grouped technical skills.' }),

  // ── Compact ────────────────────────────────────────────────
  t('compact-pro', 'Compact Pro', ['ats', 'professional'], 'compact', { header: 'split', title: 'rule', hf: 'Roboto', bf: 'Roboto', accent: '#1f2937', fs: 10.5, lh: 1.4, margin: 14, gap: 10, desc: 'Tighter spacing with readable type; length depends on your content.' }),
  t('one-pager', 'One Pager', ['ats', 'student'], 'compact', { header: 'center', title: 'caps', hf: 'Lato', bf: 'Lato', accent: '#0f4c81', fs: 10.5, lh: 1.4, margin: 14, gap: 10, desc: 'A focused fresher layout with space for relevant achievements.' }),
  t('dense', 'Dense', ['ats', 'professional'], 'compact', { header: 'left', title: 'fill', hf: 'Source Sans 3', bf: 'Source Sans 3', accent: '#7c2d12', fs: 10.5, lh: 1.4, margin: 14, gap: 10, desc: 'Tight spacing for experienced hires.' }),
];

export const getTemplate = (id) => TEMPLATES.find((x) => x.id === id) || TEMPLATES[0];

// Merge a template's defaults with the user's advanced-setting overrides.
export function resolveStyle(templateId, overrides = {}) {
  const base = getTemplate(templateId);
  const o = Object.fromEntries(Object.entries(overrides).filter(([, v]) => v !== '' && v != null));
  const style = { ...base, ...o };
  if (style.simpleLayout) Object.assign(style, { layout: 'classic', header: 'left', title: 'rule', skills: 'grouped', showPhoto: false });
  return style;
}

export function isDark(hex) {
  const h = String(hex || '').replace('#', '');
  if (!/^[0-9a-f]{6}$/i.test(h)) return false;
  const rgb = [0, 2, 4].map(i => parseInt(h.slice(i, i + 2), 16) / 255).map(c => c <= .04045 ? c / 12.92 : ((c + .055) / 1.055) ** 2.4);
  const luminance = .2126 * rgb[0] + .7152 * rgb[1] + .0722 * rgb[2];
  return (1.05 / (luminance + .05)) > ((luminance + .05) / .05);
}
