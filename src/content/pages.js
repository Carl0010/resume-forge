// Long-form page content: guides + About / Contact / Privacy / Terms.
// Plain data (no JSX) so the build-time prerender script can import it too.
//
// Each page: { title, description, h1, intro, sections: [{ h, p?: [], ul?: [] }], cta?: { href, label } }
// Guides additionally have: slug, date, related: [{ href, label }]

export const SITE_CONTACT = {
  // TODO(owner): set an email address here if you want one shown on the Contact page. Leave '' to show only GitHub.
  email: '',
  githubIssues: 'https://github.com/Carl0010/resume-forge/issues',
};

export const UPDATED = '13 October 2026';

/* ───────────────────────────── Guides ───────────────────────────── */

export const GUIDES = [
  {
    slug: 'fresher-resume',
    date: '2026-10-13',
    title: 'How to Write a Fresher Resume With No Experience',
    description: 'A step-by-step guide to writing a fresher or student resume: what to put first, how to turn projects and internships into strong bullets, and mistakes to avoid.',
    h1: 'How to write a fresher resume with no experience',
    intro: 'Recruiters hiring freshers know you have not had a full-time job yet. They are looking for evidence that you can learn, build things and finish them. A good fresher resume makes that evidence easy to find in about thirty seconds.',
    cta: { href: '/templates/student', label: 'Browse student and fresher templates' },
    related: [
      { href: '/guides/resume-summary-examples', label: 'Resume summary examples' },
      { href: '/guides/ats-friendly-resume', label: 'ATS-friendly resume tips' },
    ],
    sections: [
      {
        h: '1. Keep it to one page, education first',
        p: ['With little work history, lead with Education, then Projects, then Internships or Experience, then Skills. One page is the right length. If you are spilling onto a second page, you are including things that do not help.'],
      },
      {
        h: '2. Write a two-line summary, not a vague objective',
        p: ['Skip lines like “Seeking a challenging position in a reputed organisation.” They say nothing. Instead state what you studied, what you can do and the kind of role you want.'],
        ul: ['Example: “Final-year B.Tech (CSE) student who builds full-stack web apps with React and Node.js. Shipped three projects used by real people. Looking for a software engineering internship.”'],
      },
      {
        h: '3. Treat projects as your experience',
        p: ['Projects are where freshers win. For each one give the name, the tools, and two or three bullets that say what you built and what happened because of it. Start each bullet with a strong verb and add a number when you honestly have one.'],
        ul: [
          'Weak: “Made a website for a college club.”',
          'Stronger: “Built an event-registration site for a 400-member college club using React and Firebase; replaced a manual spreadsheet process and cut sign-up time from days to minutes.”',
          'Add a link to the live project or the code repository so a recruiter can open it.',
        ],
      },
      {
        h: '4. List skills honestly and group them',
        p: ['Group skills by type (for example Languages, Frameworks, Tools) so they can be scanned. Only list what you could talk about in an interview. Rating yourself with bars or stars adds little; a plain list reads better and is safer for applicant tracking systems.'],
      },
      {
        h: '5. Add proof that you take initiative',
        ul: [
          'Internships, even short or unpaid ones',
          'Hackathons, competitions and open-source contributions',
          'Leadership in clubs, events or volunteering',
          'Certifications that relate to the job you want',
        ],
      },
      {
        h: '6. Check the basics before you send it',
        ul: [
          'Use a clean font at 10 to 11 pt, with consistent dates and spacing.',
          'Use a professional email address and add a LinkedIn or portfolio link.',
          'Save it as a PDF with selectable text. Name it something like YourName_Resume.pdf.',
          'Read it aloud once. Typos are the most common reason a strong profile gets passed over.',
          'Tailor the skills and project order to each job description.',
        ],
      },
      {
        h: 'Should a fresher add a photo?',
        p: ['It depends on the country and the employer. Many employers in India, the US and the UK prefer no photo, and some applicant tracking systems ignore images. If a company or country expects one, use a plain, professional headshot. If in doubt, leave it out.'],
      },
    ],
  },
  {
    slug: 'ats-friendly-resume',
    date: '2026-10-13',
    title: 'ATS-Friendly Resume Tips: Formatting That Parses Cleanly',
    description: 'What an applicant tracking system (ATS) does with your resume, and the formatting, keyword and file-type rules that help it read your resume correctly.',
    h1: 'ATS-friendly resume tips: formatting that parses cleanly',
    intro: 'Most mid-size and large employers use an applicant tracking system, or ATS, to collect applications. The software reads your file, pulls out fields such as name, jobs and skills, and lets recruiters search and filter. A resume that parses badly can be hard to find, however good it looks.',
    cta: { href: '/templates/ats', label: 'See ATS-friendly resume templates' },
    related: [
      { href: '/guides/resume-format', label: 'Best resume format' },
      { href: '/guides/fresher-resume', label: 'Fresher resume guide' },
    ],
    sections: [
      {
        h: 'What an ATS actually does',
        p: ['An ATS mainly organises applications and makes them searchable. Some employers also use filters or knockout questions, such as work authorisation or required skills. A person usually still makes the final shortlist. So the goal is two-fold: be parsed correctly, and read well to a human.'],
      },
      {
        h: 'Formatting rules that help',
        ul: [
          'Use a simple layout with one clear reading order. Single-column layouts parse most reliably.',
          'Use standard headings such as Experience, Education, Skills and Projects. Creative headings can confuse the parser.',
          'Keep important details out of headers, footers, text boxes and images. Some systems skip them.',
          'Use real text, not a screenshot or scanned image of your resume.',
          'Avoid complex tables and heavy graphics. Plain bullets are safest.',
          'Use a standard font such as Arial, Calibri, Georgia or Inter at 10 to 12 pt.',
          'Write dates in a consistent format, for example “Mar 2022 – Present”.',
        ],
      },
      {
        h: 'Use keywords naturally',
        p: ['Read the job description and note the skills, tools and job titles it repeats. If you genuinely have them, use the same wording in your summary, skills and bullets. Spell out an acronym once, then use the short form, for example “Search Engine Optimisation (SEO)”. Do not stuff keywords or add hidden text; recruiters notice, and it can get you rejected.'],
      },
      {
        h: 'Choose the right file type',
        p: ['A PDF with selectable text works for most systems and keeps your layout. If a job posting asks for Word (.docx), send that. When you are unsure, check the application page for instructions.'],
      },
      {
        h: 'Quick test',
        p: ['Open your PDF, select all the text and paste it into a plain-text editor. If the order is jumbled or parts are missing, a parser will probably struggle too. ResumeForge can also export a plain-text version for online application forms.'],
      },
      {
        h: 'No template can guarantee a result',
        p: ['Systems differ and employers set their own filters. Following these rules gives you the best chance of being read correctly, but a strong, honest, well-targeted resume still matters most.'],
      },
    ],
  },
  {
    slug: 'resume-vs-cv',
    date: '2026-10-13',
    title: 'Resume vs CV: What Is the Difference and Which Should You Use?',
    description: 'The difference between a resume and a CV, how the terms vary by country, and which one to send for jobs, internships, academic roles and applications abroad.',
    h1: 'Resume vs CV: what is the difference?',
    intro: 'People use “resume” and “CV” interchangeably, but they can mean different documents depending on where you are applying and for what. Here is how to tell which one a job wants.',
    cta: { href: '/templates/academic', label: 'Browse academic CV templates' },
    related: [
      { href: '/guides/how-long-should-a-resume-be', label: 'How long should a resume be?' },
      { href: '/guides/resume-format', label: 'Best resume format' },
    ],
    sections: [
      {
        h: 'The short answer',
        p: ['A resume is a short, targeted summary of your career, usually one or two pages, tailored to a specific job. A curriculum vitae (CV) is a longer, complete record of your academic and professional history, and it grows as your career does.'],
      },
      {
        h: 'Key differences',
        ul: [
          'Length: a resume is 1 to 2 pages. A CV can run to many pages, especially in academia.',
          'Purpose: a resume is tailored per job. A CV is a comprehensive record that you trim only when needed.',
          'Content: resumes focus on skills and achievements. CVs add publications, research, grants, teaching, conferences and awards.',
          'Use: resumes for most corporate, startup and non-academic roles. CVs for academic, research, medical and scientific positions.',
        ],
      },
      {
        h: 'It also depends on the country',
        ul: [
          'United States and Canada: “resume” means the short document. “CV” is used mainly for academic and research roles.',
          'United Kingdom, Ireland and much of Europe: “CV” is the normal word for what Americans call a resume, usually two pages.',
          'India: both words are used; for most corporate and fresher jobs, a one- to two-page document is expected whichever name is used.',
        ],
      },
      {
        h: 'How to decide',
        p: ['Follow the job posting. If it asks for a CV, check whether it means the short UK-style document or a full academic CV. If you are still unsure, a one- to two-page resume is the safe choice for non-academic roles, and a full CV is the right choice when applying for a PhD, research post or lectureship.'],
      },
    ],
  },
  {
    slug: 'resume-summary-examples',
    date: '2026-10-13',
    title: 'Resume Summary Examples and How to Write Your Own',
    description: 'A simple formula for writing a resume summary, with examples for freshers, experienced professionals, career changers and senior leaders.',
    h1: 'Resume summary examples and how to write your own',
    intro: 'The summary is the first thing a recruiter reads. In two to four lines it should say who you are, what you are good at and the kind of result you deliver. Here is a simple formula and some examples you can adapt.',
    cta: { href: '/builder', label: 'Write your summary in the builder' },
    related: [
      { href: '/guides/fresher-resume', label: 'Fresher resume guide' },
      { href: '/guides/ats-friendly-resume', label: 'ATS-friendly resume tips' },
    ],
    sections: [
      {
        h: 'A simple formula',
        p: ['Who you are, plus your strongest skills or years of experience, plus the kind of result you create or the role you want. Keep it to two to four lines, in plain language, and tailor it to the job.'],
      },
      {
        h: 'Fresher or student',
        ul: ['“Final-year B.Com student with internship experience in accounting and Excel reporting. Completed a project that reconciled 2,000 invoice records for a local business. Looking for a junior finance analyst role.”'],
      },
      {
        h: 'Experienced professional',
        ul: ['“Product manager with 6 years in B2B software. Led a team of 8 to launch a payments feature used by thousands of merchants. Strong at turning ambiguous problems into clear roadmaps.”'],
      },
      {
        h: 'Career changer',
        ul: ['“Former school teacher moving into learning and development. Eight years designing lessons and coaching colleagues, now certified in instructional design. Ready to build practical training for corporate teams.”'],
      },
      {
        h: 'Senior leader',
        ul: ['“Operations director with 15 years running multi-site teams. Reduced delivery costs and improved on-time performance across regional operations. Known for building leaders and turning around struggling units.”'],
      },
      {
        h: 'Tips',
        ul: [
          'Use numbers only when they are true and you can explain them in an interview.',
          'Avoid empty phrases like “hard-working team player” unless backed by an example.',
          'Mirror a few key terms from the job description, naturally.',
          'The examples above are illustrations. Write yours from your own experience.',
        ],
      },
    ],
  },
  {
    slug: 'resume-format',
    date: '2026-10-13',
    title: 'Best Resume Format: Chronological, Functional or Combination?',
    description: 'Compare the three main resume formats, learn when to use each, and get layout guidance on fonts, margins, section order and length.',
    h1: 'Best resume format: chronological, functional or combination?',
    intro: 'There are three common resume formats. For most people, one of them is clearly the right choice. Here is how they differ and how to lay out the page.',
    cta: { href: '/templates', label: 'Browse all resume templates' },
    related: [
      { href: '/guides/ats-friendly-resume', label: 'ATS-friendly resume tips' },
      { href: '/guides/how-long-should-a-resume-be', label: 'How long should a resume be?' },
    ],
    sections: [
      {
        h: 'Reverse-chronological: the default',
        p: ['Your most recent job comes first, then earlier ones. Recruiters and applicant tracking systems expect this format, and it works well if you have a steady career in one field. When in doubt, choose this one.'],
      },
      {
        h: 'Functional: use with care',
        p: ['A functional resume groups your experience by skill and plays down dates. It is sometimes used to hide gaps or a career change, but many recruiters distrust it and some systems parse it poorly. Prefer the combination format instead.'],
      },
      {
        h: 'Combination (hybrid)',
        p: ['A short skills or achievements section at the top, followed by a reverse-chronological work history. It suits career changers, people returning to work and specialists who want to highlight key skills first.'],
      },
      {
        h: 'Which one should you pick?',
        ul: [
          'Steady career in one field: reverse-chronological.',
          'Changing fields or with a gap: combination.',
          'Student or fresher: reverse-chronological with Education and Projects first.',
          'Academic or research role: a full CV format.',
        ],
      },
      {
        h: 'Layout basics',
        ul: [
          'Margins of about 0.5 to 1 inch, and body text at 10 to 12 pt.',
          'One or two fonts, one accent colour, and plenty of white space.',
          'Standard section headings and a consistent date format.',
          'Section order for experienced candidates: Summary, Experience, Skills, Education, then extras such as certifications.',
          'Plain bullets that start with a strong verb and show a result.',
        ],
      },
    ],
  },
  {
    slug: 'how-long-should-a-resume-be',
    date: '2026-10-13',
    title: 'How Long Should a Resume Be? One Page or Two?',
    description: 'How many pages your resume should be depending on experience, plus practical ways to shorten it without losing what matters.',
    h1: 'How long should a resume be?',
    intro: 'Length matters less than relevance, but there are sensible rules of thumb. Recruiters skim, so every line should earn its place.',
    cta: { href: '/builder', label: 'Check your page count in the builder' },
    related: [
      { href: '/guides/resume-vs-cv', label: 'Resume vs CV' },
      { href: '/guides/resume-format', label: 'Best resume format' },
    ],
    sections: [
      {
        h: 'Rules of thumb',
        ul: [
          'Students, freshers and early career (under about 10 years): one page.',
          'Experienced professionals: one to two pages. Two is fine if the content is relevant.',
          'Senior leaders and executives: up to two pages, sometimes slightly more.',
          'Academic CVs and some technical or medical CVs: longer is normal, because they list publications and research.',
        ],
      },
      {
        h: 'If you have too much content',
        ul: [
          'Cut old or irrelevant jobs. Roles from more than 10 to 15 years ago can usually be one line.',
          'Trim bullets to the strongest two to five per role. Lead with results.',
          'Remove filler such as “references available on request” and generic objectives.',
          'Merge or drop low-value sections.',
          'Adjust margins and font size only as a last resort. Stay at 10 pt or above.',
        ],
      },
      {
        h: 'If you have too little',
        p: ['Do not pad it. Add projects, internships, volunteering, certifications or relevant coursework, and write fuller bullets. A focused page is better than two thin ones.'],
      },
      {
        h: 'Avoid a nearly empty second page',
        p: ['If your resume spills onto page two by only a few lines, tighten it back to one page. If you genuinely need two pages, make the second page at least half full. In the ResumeForge builder, the preview shows page breaks and a live page count so you can see this as you edit.'],
      },
    ],
  },
];

/* ───────────────────── About / Contact / Privacy / Terms ───────────────────── */

export const INFO_PAGES = {
  '/about': {
    title: 'About ResumeForge – A Free Resume & CV Builder',
    description: 'ResumeForge is a free, no-login resume and CV builder with 50+ templates. Learn what it is, how it works and what we promise.',
    h1: 'About ResumeForge',
    intro: 'ResumeForge is a free online resume and CV builder. It was made for people who need a clean, professional resume tonight, without creating an account or hitting a paywall at the download button.',
    sections: [
      {
        h: 'What you can do',
        ul: [
          'Choose from 50+ templates, including ATS-friendly, student, corporate, executive, modern, creative and academic designs.',
          'Edit your details with a live preview, reorder or hide sections, and customise fonts, colours and spacing.',
          'Download a clean PDF with selectable text, a plain-text version for online forms, or a backup file.',
          'Import an old resume with AI (sign-in required) and rebuild it in a new template.',
        ],
      },
      {
        h: 'Our principles',
        ul: [
          'Free to use, with no watermark on your download.',
          'No account needed to build and download a resume.',
          'Your resume stays in your browser. We do not keep a copy on our servers.',
          'Honest, plain-language guidance about resumes, not tricks.',
        ],
      },
      {
        h: 'Who makes it',
        p: ['ResumeForge is built and maintained by an independent developer. It is a small project that keeps improving as people use it. If something is wrong or you have an idea, please tell us on the Contact page.'],
      },
    ],
  },
  '/contact': {
    title: 'Contact ResumeForge – Feedback, Bugs and Questions',
    description: 'Get in touch with ResumeForge to report a bug, suggest a template or ask a question about the resume builder.',
    h1: 'Contact us',
    intro: 'The fastest way to get a bug fixed or a template added is to tell us exactly what you were doing and what you expected.',
    sections: [
      {
        h: 'Report a bug or suggest a feature',
        p: ['Open an issue on GitHub: github.com/Carl0010/resume-forge/issues. Please include the page you were on, what you clicked, your browser and a screenshot if you can. Do not include personal details from your resume.'],
      },
      {
        h: 'Privacy requests',
        p: ['Your resume is stored only in your browser, so you can delete it yourself by using “Start over” in the builder or clearing this site’s data in your browser settings. For any other privacy question, contact us using the method above.'],
      },
    ],
  },
  '/privacy': {
    title: 'Privacy Policy | ResumeForge',
    description: 'How ResumeForge handles your data: your resume stays in your browser, what we collect, third-party services, and your choices.',
    h1: 'Privacy policy',
    intro: 'Short version: your resume stays in your browser, and you do not need an account to use ResumeForge. This page explains the details. Last updated ' + UPDATED + '.',
    sections: [
      {
        h: 'Your resume data',
        p: ['The details you type into the builder are saved in your browser’s local storage on your own device. They are not sent to our servers when you edit, preview or download. If you clear your browser data or use “Start over”, the data is gone, so download a backup file if you want to keep a copy.'],
      },
      {
        h: 'What we store in your browser',
        p: ['We use local storage to remember your resume, your theme choice (light or dark) and your editor panel width. We do not use it to track you across sites.'],
      },
      {
        h: 'Sign-in and AI features',
        p: ['You do not need to sign in to build or download a resume. Some AI features, such as importing an old resume, require signing in with Google. When you sign in, we receive the basic profile information Google shares, such as your name, email address and profile picture.',
          'If you use AI import, the file you choose is sent to the server that processes it so that it can be read and converted into your resume. Only upload files you are comfortable having processed.'],
      },
      {
        h: 'Third-party services',
        ul: [
          'Hosting: the site is served by a hosting provider, which may keep standard server logs such as IP address, browser type and the pages requested.',
          'Fonts: fonts are loaded from Google Fonts. When your browser requests them, Google receives your IP address and browser details.',
          'Sign-in: if you use Google sign-in, Google’s own privacy policy applies to that process.',
        ],
      },
      {
        h: 'Analytics and advertising',
        p: ['At the time of writing, ResumeForge does not use analytics or advertising cookies. If we add analytics or show ads in future, we will update this policy first and, where the law requires, ask for your consent before setting non-essential cookies. Advertising will never appear inside the resume builder.'],
      },
      {
        h: 'Children',
        p: ['ResumeForge is not directed at children under 13, and we do not knowingly collect personal information from them.'],
      },
      {
        h: 'Your choices',
        ul: [
          'Delete your resume at any time with “Start over” or by clearing site data in your browser.',
          'Sign out whenever you like, and remove ResumeForge’s access from your Google account settings.',
          'Contact us with any privacy question using the Contact page.',
        ],
      },
      {
        h: 'Changes to this policy',
        p: ['We may update this policy as the site changes. The date at the top shows when it was last updated.'],
      },
    ],
  },
  '/terms': {
    title: 'Terms of Use | ResumeForge',
    description: 'The terms for using ResumeForge, the free online resume and CV builder.',
    h1: 'Terms of use',
    intro: 'By using ResumeForge you agree to these terms. They are written to be short and readable. Last updated ' + UPDATED + '.',
    sections: [
      {
        h: 'Using the service',
        p: ['ResumeForge is provided free of charge for personal use to create resumes and CVs. Please use it lawfully and do not try to disrupt, overload or misuse the site or its services.'],
      },
      {
        h: 'Your content',
        p: ['You own the content you enter and the documents you create. You are responsible for making sure it is accurate and that you have the right to use anything you upload. Because your resume is stored in your browser, you are also responsible for keeping backups.'],
      },
      {
        h: 'No guarantees about results',
        p: ['Templates, guides and tips are provided to help you present your experience clearly. We cannot guarantee that a resume will pass any particular applicant tracking system, get an interview or lead to a job offer.'],
      },
      {
        h: 'Availability and changes',
        p: ['The service is provided “as is” and “as available”. Features may change, be paused or be removed, including AI features that are marked as coming soon.'],
      },
      {
        h: 'Limitation of liability',
        p: ['To the extent permitted by law, ResumeForge and its maintainers are not liable for any loss arising from your use of the service, including lost data or lost opportunities.'],
      },
      {
        h: 'Changes to these terms',
        p: ['We may update these terms from time to time. Continuing to use the site after changes means you accept the updated terms.'],
      },
    ],
  },
};
