// Single source of truth for page titles, descriptions and keyword-rich intro copy.
// Imported by the app (client-side head updates) AND by scripts/prerender.mjs (build-time static HTML),
// so keep this file free of JSX / browser APIs.

export const SITE_URL = 'https://resume-forge-two-weld.vercel.app';
export const SITE_NAME = 'ResumeForge';

export const FAQ = [
  ['Is it really free?', 'Yes. Every template, the live preview and PDF download are free. There is no paid tier hiding behind the download button and no watermark.'],
  ['Do I need to create an account?', 'No. Your resume is saved automatically in this browser. Sign-in with Google is only needed for AI features such as importing an old resume.'],
  ['Will my resume get past ATS software?', 'Templates tagged “ATS-friendly” use a single reading order, real text and standard headings, which is what applicant tracking systems parse most reliably.'],
  ['How do I download a PDF?', 'Click “Download PDF” in the builder and choose “Save as PDF” in the print dialog. The text stays selectable, which recruiters and ATS tools need.'],
  ['Can I change fonts and colours?', 'Yes. Open Design → Advanced settings to change the accent colour, text colour, fonts, size, spacing and margins. Templates look right without touching these.'],
];

// path -> meta. `intro` is shown on the page and mirrored in the static fallback HTML.
export const ROUTES = {
  '/': {
    title: 'Free Resume Builder & CV Maker | ATS Templates, No Watermark',
    description: 'Build a professional resume or CV online for free. 50+ ATS-friendly resume templates, live preview and a clean PDF download with no watermark and no login.',
    h1: 'A resume you’re proud of, before the deadline.',
    intro: 'ResumeForge is a free online resume builder and CV maker. Pick from more than 50 recruiter-tested, ATS-friendly resume templates, edit with a live preview, and download a clean PDF with no watermark. No sign-up needed.',
  },
  '/templates': {
    title: 'Free Resume Templates – 50+ ATS-Friendly CV Designs | ResumeForge',
    description: 'Browse 50+ free resume and CV templates: ATS-friendly, modern, creative, corporate, executive, academic and fresher layouts. Pick one and edit it online, no login.',
    h1: 'Free resume templates',
    intro: 'Choose from more than 50 free resume templates across single-column, sidebar, banner, timeline and two-column layouts. Every template downloads as a clean PDF with no watermark.',
  },
  '/templates/ats': {
    title: 'ATS-Friendly Resume Templates – Free, Single-Column | ResumeForge',
    description: 'Free ATS-friendly resume templates with a single reading order, real text and standard headings, built to parse cleanly in Workday, Greenhouse, Lever and Taleo.',
    h1: 'ATS-friendly resume templates',
    intro: 'Applicant tracking systems read resumes best when the layout is simple: one reading order, real selectable text and standard section headings. These templates are built that way, and every one is free with no watermark.',
  },
  '/templates/student': {
    title: 'Resume Templates for Students & Freshers – Free | ResumeForge',
    description: 'Free resume templates for college students, graduates and freshers. Education-first layouts that put projects, internships and skills up front. No watermark.',
    h1: 'Resume templates for students and freshers',
    intro: 'Education-first layouts make projects, internships, hackathons and skills count when work experience is thin. Ideal for a first resume, campus placements and fresher job applications.',
  },
  '/templates/professional': {
    title: 'Corporate & Professional Resume Templates – Free | ResumeForge',
    description: 'Clean, professional resume templates for corporate roles. Put measurable achievements first with ATS-friendly formatting. Free PDF download, no watermark.',
    h1: 'Corporate and professional resume templates',
    intro: 'Clean, conservative formats that put measurable achievements first. A good fit for corporate, finance, consulting, operations and management roles.',
  },
  '/templates/executive': {
    title: 'Executive CV & Senior Leadership Resume Templates | ResumeForge',
    description: 'Executive CV templates for directors, VPs and senior leaders. Strong leadership summary, core competencies and results-focused layouts. Free, no watermark.',
    h1: 'Executive CV and senior leadership templates',
    intro: 'Board-ready CVs with a strong leadership summary, a core-competencies block and room for scale-of-impact results such as revenue, headcount and P&L ownership.',
  },
  '/templates/modern': {
    title: 'Modern Resume Templates – Free Online Resume Builder | ResumeForge',
    description: 'Modern resume templates with sidebars, banners and clean typography. Customise colours and fonts, preview live and download a free PDF. No login.',
    h1: 'Modern resume templates',
    intro: 'Contemporary layouts with sidebars, header banners and refined typography. Change the accent colour, fonts and spacing to make any template your own.',
  },
  '/templates/creative': {
    title: 'Creative Resume Templates for Designers & Developers | ResumeForge',
    description: 'Creative resume templates for designers, developers and marketers. Two-column and sidebar designs with photo options. Free download, no watermark.',
    h1: 'Creative resume templates',
    intro: 'Distinctive two-column and sidebar designs for designers, developers, marketers and other roles where a person reads your resume first.',
  },
  '/templates/academic': {
    title: 'Academic CV Templates for Researchers & Students | ResumeForge',
    description: 'Free academic CV templates for researchers, PhD students and lecturers. Room for publications, grants, teaching and awards. Download as PDF, no watermark.',
    h1: 'Academic CV templates',
    intro: 'Longer-form CV layouts with space for publications, research, teaching, awards and references, suited to PhD applications, research roles and academic positions.',
  },
  '/builder': {
    title: 'Online Resume Builder – Create a Resume Free, No Login | ResumeForge',
    description: 'Create your resume online with a live preview. Edit sections, switch templates, change fonts and colours, then download a free PDF with no watermark.',
    h1: 'Online resume builder',
    intro: 'Type your details on the left and watch your resume update on the right. Reorder or hide sections, switch templates any time, and download a free PDF.',
  },
  '/import': {
    title: 'Import & Convert an Old Resume with AI – PDF, Word, Photo | ResumeForge',
    description: 'Upload an old resume as PDF, Word, text or a photo and let AI rebuild it in a fresh ATS-friendly template. Sign-in required for AI import.',
    h1: 'Import an old resume with AI',
    intro: 'Upload a PDF, Word file, text file or even a phone photo of a printed resume. AI reads it and rebuilds it in the template you choose.',
  },
  '/ai-writer': {
    title: 'AI Resume Writer (Coming Soon) | ResumeForge',
    description: 'An AI writing assistant for resume summaries and achievement bullets is on its way to ResumeForge.',
    h1: 'AI resume writer',
    intro: 'Coming soon: generate a summary, rewrite bullets with stronger action verbs and tailor your resume to a job description.',
    noindex: true,
  },
};

export const NOT_FOUND = {
  title: 'Page not found | ResumeForge',
  description: 'That page does not exist.',
  noindex: true,
};

// Pages included in sitemap.xml
export const SITEMAP_PATHS = Object.keys(ROUTES).filter((p) => !ROUTES[p].noindex);

// Resolve a router location ({ path, params }) to the key used in ROUTES.
export function routeKey(path, params = {}) {
  if (path === '/templates' && params.c && ROUTES['/templates/' + params.c]) return '/templates/' + params.c;
  return path;
}

export function metaFor(path, params = {}) {
  return ROUTES[routeKey(path, params)] || NOT_FOUND;
}

export function canonicalFor(path, params = {}) {
  const key = routeKey(path, params);
  return SITE_URL + (key === '/' ? '/' : key);
}
