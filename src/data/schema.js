// Resume data model + section definitions used by the editor and the renderer.

export const uid = () => Math.random().toString(36).slice(2, 10);

// Every list section is described here once. The editor builds its forms from these specs,
// so adding a new section = add an entry here + (optionally) a renderer in templates/Resume.jsx.
export const SECTION_DEFS = {
  summary: { label: 'Profile Summary', kind: 'text' },
  experience: {
    label: 'Work Experience',
    kind: 'list',
    addLabel: 'Add position',
    title: (i) => i.role || 'Untitled position',
    subtitle: (i) => [i.company, [i.start, i.end].filter(Boolean).join(' – ')].filter(Boolean).join(' · '),
    fields: [
      { name: 'role', label: 'Job title', ph: 'Senior Product Manager', half: true },
      { name: 'company', label: 'Company', ph: 'Infosys', half: true },
      { name: 'start', label: 'Start', ph: 'Jan 2021', half: true, third: true },
      { name: 'end', label: 'End', ph: 'Present', half: true, third: true },
      { name: 'location', label: 'Location', ph: 'Bengaluru, India', half: true, third: true },
      { name: 'bullets', label: 'Achievements (one per line)', type: 'bullets', ph: 'Led a team of 6 engineers to ship…\nCut infra cost by 32% by…' },
    ],
  },
  education: {
    label: 'Education',
    kind: 'list',
    addLabel: 'Add education',
    title: (i) => i.degree || 'Untitled degree',
    subtitle: (i) => [i.school, [i.start, i.end].filter(Boolean).join(' – ')].filter(Boolean).join(' · '),
    fields: [
      { name: 'degree', label: 'Degree / Course', ph: 'B.Tech, Computer Science', half: true },
      { name: 'school', label: 'School / University', ph: 'IIT Delhi', half: true },
      { name: 'start', label: 'Start', ph: '2019', third: true },
      { name: 'end', label: 'End', ph: '2023', third: true },
      { name: 'grade', label: 'GPA / Grade', ph: '8.9 CGPA', third: true },
      { name: 'location', label: 'Location', ph: 'New Delhi', half: true },
      { name: 'bullets', label: 'Highlights (one per line)', type: 'bullets', ph: 'Relevant coursework: DBMS, OS, ML' },
    ],
  },
  skills: {
    label: 'Skills',
    kind: 'list',
    addLabel: 'Add skill',
    compact: true,
    title: (i) => i.name || 'Skill',
    fields: [
      { name: 'name', label: 'Skill', ph: 'Python', half: true },
      { name: 'group', label: 'Group (optional)', ph: 'Languages, Tools, Domain expertise', half: true },
      { name: 'level', label: 'Optional visual rating', type: 'level', half: true },
    ],
  },
  projects: {
    label: 'Projects',
    kind: 'list',
    addLabel: 'Add project',
    title: (i) => i.name || 'Untitled project',
    subtitle: (i) => i.link || '',
    fields: [
      { name: 'name', label: 'Project name', ph: 'Campus Connect App', half: true },
      { name: 'link', label: 'Link', ph: 'github.com/you/project', half: true },
      { name: 'start', label: 'Start', ph: 'Aug 2023', half: true },
      { name: 'end', label: 'End', ph: 'Dec 2023', half: true },
      { name: 'bullets', label: 'Description (one point per line)', type: 'bullets', ph: 'Built a React Native app used by 3,000+ students' },
    ],
  },
  certifications: {
    label: 'Certifications',
    kind: 'list',
    addLabel: 'Add certification',
    title: (i) => i.name || 'Certification',
    subtitle: (i) => [i.issuer, i.date].filter(Boolean).join(' · '),
    fields: [
      { name: 'name', label: 'Certification', ph: 'AWS Solutions Architect – Associate', half: true },
      { name: 'issuer', label: 'Issuer', ph: 'Amazon Web Services', half: true },
      { name: 'date', label: 'Date', ph: '2024', half: true },
    ],
  },
  awards: {
    label: 'Awards & Achievements',
    kind: 'list',
    addLabel: 'Add award',
    title: (i) => i.title || 'Award',
    subtitle: (i) => [i.issuer, i.date].filter(Boolean).join(' · '),
    fields: [
      { name: 'title', label: 'Title', ph: 'Smart India Hackathon – Winner', half: true },
      { name: 'issuer', label: 'Awarded by', ph: 'Govt. of India', half: true },
      { name: 'date', label: 'Date', ph: '2023', half: true },
      { name: 'description', label: 'Description', type: 'textarea', ph: 'Short note (optional)' },
    ],
  },
  languages: {
    label: 'Languages',
    kind: 'list',
    addLabel: 'Add language',
    compact: true,
    title: (i) => i.name || 'Language',
    fields: [
      { name: 'name', label: 'Language', ph: 'Hindi', half: true },
      { name: 'fluency', label: 'Fluency', ph: 'Native', half: true, options: ['Native', 'Fluent', 'Professional', 'Intermediate', 'Basic'] },
    ],
  },
  volunteer: {
    label: 'Volunteering',
    kind: 'list',
    addLabel: 'Add volunteering',
    title: (i) => i.role || 'Role',
    subtitle: (i) => i.org || '',
    fields: [
      { name: 'role', label: 'Role', ph: 'Mentor', half: true },
      { name: 'org', label: 'Organisation', ph: 'Teach For India', half: true },
      { name: 'start', label: 'Start', ph: '2022', half: true },
      { name: 'end', label: 'End', ph: 'Present', half: true },
      { name: 'bullets', label: 'Details (one per line)', type: 'bullets' },
    ],
  },
  publications: {
    label: 'Publications',
    kind: 'list',
    addLabel: 'Add publication',
    title: (i) => i.title || 'Publication',
    subtitle: (i) => [i.publisher, i.date].filter(Boolean).join(' · '),
    fields: [
      { name: 'title', label: 'Title', ph: 'Graph Neural Networks for…', half: true },
      { name: 'publisher', label: 'Journal / Conference', ph: 'IEEE ICASSP', half: true },
      { name: 'date', label: 'Date', ph: '2024', half: true },
      { name: 'link', label: 'Link / DOI', ph: 'doi.org/…', half: true },
    ],
  },
  interests: {
    label: 'Interests',
    kind: 'list',
    addLabel: 'Add interest',
    compact: true,
    title: (i) => i.name || 'Interest',
    fields: [{ name: 'name', label: 'Interest', ph: 'Marathon running' }],
  },
  references: {
    label: 'References',
    kind: 'list',
    addLabel: 'Add reference',
    title: (i) => i.name || 'Reference',
    subtitle: (i) => i.position || '',
    fields: [
      { name: 'name', label: 'Name', ph: 'Dr. A. Sharma', half: true },
      { name: 'position', label: 'Position & company', ph: 'Head of Engineering, TCS', half: true },
      { name: 'contact', label: 'Contact', ph: 'Available on request' },
    ],
  },
  custom: {
    label: 'Custom Section',
    kind: 'list',
    addLabel: 'Add entry',
    title: (i) => i.title || 'Entry',
    subtitle: (i) => i.subtitle || '',
    fields: [
      { name: 'title', label: 'Title', ph: 'Entry title', half: true },
      { name: 'subtitle', label: 'Subtitle', ph: 'Organisation / detail', half: true },
      { name: 'date', label: 'Date', ph: '2024', half: true },
      { name: 'bullets', label: 'Details (one per line)', type: 'bullets' },
    ],
  },
};

// Career-specific sections use the same editor and entry model as work experience.
for (const [key, label, entryLabel] of [
  ['highlights', 'Selected Achievements', 'achievement'], ['boards', 'Board & Advisory Roles', 'role'],
  ['research', 'Research Experience', 'research role'], ['teaching', 'Teaching Experience', 'teaching role'],
  ['grants', 'Grants & Funding', 'grant'], ['service', 'Academic Service', 'service role'],
]) {
  SECTION_DEFS[key] = { ...SECTION_DEFS.custom, label, addLabel: `Add ${entryLabel}` };
}

export const DEFAULT_ORDER = [
  'summary', 'experience', 'education', 'projects', 'skills', 'certifications',
  'awards', 'languages', 'volunteer', 'publications', 'interests', 'references', 'custom',
  'highlights', 'boards', 'research', 'teaching', 'grants', 'service',
];

// Sections that sidebar-style templates place in the narrow column.
export const SIDE_SECTIONS = ['skills', 'languages', 'certifications', 'interests', 'awards', 'references'];

export const DEFAULT_SETTINGS = {
  templateId: 'harvard',
  pageSize: 'A4',
  overrides: {}, // advanced settings: accent, text, headingFont, bodyFont, fontSize, lineHeight, margin, sectionGap, showPhoto, sideBg
};

export function emptyResume() {
  return {
    personal: { fullName: '', jobTitle: '', email: '', phone: '', location: '', website: '', linkedin: '', github: '', photo: '' },
    summary: '',
    experience: [], education: [], skills: [], projects: [], certifications: [], awards: [],
    languages: [], volunteer: [], publications: [], interests: [], references: [], custom: [],
    ...Object.fromEntries(['highlights', 'boards', 'research', 'teaching', 'grants', 'service'].map(k => [k, []])),
    order: [...DEFAULT_ORDER],
    hidden: { highlights: true, boards: true, research: true, teaching: true, grants: true, service: true, volunteer: true, publications: true, references: true, custom: true, interests: false },
    titles: {}, // user-renamed section titles
    settings: { ...DEFAULT_SETTINGS, overrides: {} },
  };
}

// Make any (possibly partial / server-provided) object a valid resume.
export function normalizeResume(input) {
  const base = emptyResume();
  if (!input || typeof input !== 'object') return base;
  const out = { ...base, ...input };
  out.personal = { ...base.personal, ...(input.personal || {}) };
  for (const key of Object.keys(SECTION_DEFS)) {
    if (SECTION_DEFS[key].kind !== 'list') continue;
    const arr = Array.isArray(input[key]) ? input[key] : [];
    out[key] = arr.map((item) => {
      const it = typeof item === 'string' ? { name: item, title: item } : { ...item };
      if (Array.isArray(it.bullets)) it.bullets = it.bullets.join('\n');
      if (key === 'skills' && it.level == null) it.level = 4;
      return { id: it.id || uid(), ...it };
    });
  }
  out.summary = typeof input.summary === 'string' ? input.summary : '';
  const order = Array.isArray(input.order) ? input.order.filter((k) => SECTION_DEFS[k]) : [];
  out.order = [...new Set(order), ...DEFAULT_ORDER.filter((k) => !order.includes(k))];
  out.hidden = { ...base.hidden, ...(input.hidden || {}) };
  out.titles = { ...(input.titles || {}) };
  out.settings = { ...DEFAULT_SETTINGS, ...(input.settings || {}), overrides: { ...((input.settings || {}).overrides || {}) } };
  return out;
}

export const sectionTitle = (resume, key) => (resume.titles && resume.titles[key]) || SECTION_DEFS[key].label;

export const bulletsOf = (text) =>
  String(text || '')
    .split('\n')
    .map((s) => s.replace(/^\s*[-•*▪◦]\s*/, '').trim())
    .filter(Boolean);
