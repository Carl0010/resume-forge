import { DEFAULT_ORDER } from './schema.js';

export const CAREER_PRESETS = {
  student: {
    label: 'Student / fresher',
    description: 'Education and projects first',
    order: ['education', 'projects', 'experience', 'skills', 'summary', 'certifications', 'awards'],
  },
  professional: {
    label: 'Experienced professional',
    description: 'Relevant experience first',
    order: ['summary', 'experience', 'skills', 'projects', 'education', 'certifications'],
  },
  executive: {
    label: 'Executive / leader',
    description: 'Leadership outcomes and scope',
    order: ['summary', 'highlights', 'experience', 'boards', 'skills', 'education'],
  },
  academic: {
    label: 'Academic / researcher',
    description: 'Research, publications and teaching',
    order: [
      'summary',
      'education',
      'publications',
      'research',
      'teaching',
      'grants',
      'experience',
      'service',
      'skills',
    ],
  },
};

export function applyCareerPreset(resume, key) {
  const preset = CAREER_PRESETS[key];
  if (!preset) return resume;
  const next = structuredClone(resume);
  next.order = [
    ...preset.order,
    ...new Set(
      [...(resume.order || []), ...DEFAULT_ORDER].filter((k) => !preset.order.includes(k)),
    ),
  ];
  // Keep every entry and existing visibility choice, except explicitly reveal the selected career's sections.
  for (const k of preset.order) next.hidden[k] = false;
  next.settings.careerPreset = key;
  return next;
}

export const FLAGSHIPS = ['harvard', 'stanford', 'chairman', 'horizon', 'quartz', 'techie'];
export function recommendTemplates(
  templates,
  { career = 'professional', role = 'general', style = 'traditional' } = {},
) {
  const picks = {
    student: ['harvard', 'stanford', 'fresh-grad'],
    professional: ['stanford', 'harvard', 'paper'],
    executive: ['chairman', 'wharton', 'executive-pro'],
    academic: ['scholar', 'researcher', 'oxford'],
  }[career] || ['stanford', 'harvard', 'paper'];
  return templates
    .map((t, index) => ({
      t,
      index,
      score:
        (picks.includes(t.id) ? 12 - picks.indexOf(t.id) : 0) +
        (t.tags.includes(career) ? 3 : 0) +
        (style === 'visual' && ['sidebar', 'banner', 'twocol'].includes(t.layout) ? 14 : 0) +
        (style === 'minimal' && t.layout === 'minimal' ? 16 : 0) +
        (role === 'engineering' && ['techie', 'stanford', 'architect'].includes(t.id) ? 10 : 0) +
        (role === 'design' && ['quartz', 'studio', 'swiss'].includes(t.id) ? 10 : 0) +
        (['finance', 'healthcare'].includes(role) &&
        ['harvard', 'corporate', 'wharton'].includes(t.id)
          ? 6
          : 0) +
        (role === 'sales' && ['stanford', 'summit', 'horizon'].includes(t.id) ? 8 : 0),
    }))
    .sort((a, b) => b.score - a.score || a.index - b.index)
    .slice(0, 3)
    .map((x) => x.t);
}

export function sampleKeyFor(template, category) {
  if (category === 'academic' || template?.tags.includes('academic')) return 'academic';
  if (category === 'student') return 'student';
  if (category === 'executive' || template?.tags.includes('executive')) return 'executive';
  if (template?.id === 'techie') return 'engineering';
  if (category === 'creative' || template?.tags.includes('creative')) return 'design';
  if (template?.tags.includes('student')) return 'student';
  return 'professional';
}
