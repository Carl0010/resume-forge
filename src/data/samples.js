import { applyCareerPreset } from './presets.js';
import { normalizeResume } from './schema.js';

// Example content for each audience. Shown in template thumbnails and loadable in the builder.
const professional = {
  personal: {
    fullName: 'Aarav Mehta',
    jobTitle: 'Senior Product Manager',
    email: 'aarav.mehta@email.com',
    phone: '+91 98765 43210',
    location: 'Bengaluru, India',
    website: 'aaravmehta.dev',
    linkedin: 'linkedin.com/in/aaravmehta',
    github: '',
    photo: '',
  },
  summary:
    'Product manager with 8+ years building B2B SaaS and fintech products used by 2M+ users. Known for turning ambiguous problems into shipped roadmaps, partnering closely with engineering and design, and growing revenue through data-driven experimentation.',
  experience: [
    {
      role: 'Senior Product Manager', company: 'Razorpay', location: 'Bengaluru', start: 'Mar 2021', end: 'Present',
      bullets: 'Own the payouts platform roadmap serving 40,000+ businesses and ₹1.2L Cr annual volume\nLaunched instant settlements, adding ₹38 Cr ARR within 9 months of release\nCut merchant onboarding time from 5 days to 36 hours by redesigning KYC flow with ops and risk teams\nMentor 3 associate PMs; introduced a quarterly discovery ritual adopted across 4 squads',
    },
    {
      role: 'Product Manager', company: 'Freshworks', location: 'Chennai', start: 'Jul 2018', end: 'Feb 2021',
      bullets: 'Led the Freshdesk automation module; grew weekly active admins by 64%\nShipped AI-assisted ticket routing that reduced first-response time by 27%\nRan 45+ A/B tests with growth team, lifting trial-to-paid conversion from 9% to 12.5%',
    },
    {
      role: 'Business Analyst', company: 'Deloitte', location: 'Hyderabad', start: 'Jun 2016', end: 'Jun 2018',
      bullets: 'Delivered requirements and UAT for a core-banking migration across 1,100 branches\nBuilt Tableau dashboards used by the CFO office for weekly liquidity reviews',
    },
  ],
  education: [
    { degree: 'MBA, Product & Strategy', school: 'IIM Bangalore', location: 'Bengaluru', start: '2014', end: '2016', grade: '', bullets: '' },
    { degree: 'B.Tech, Computer Science', school: 'NIT Trichy', location: 'Tiruchirappalli', start: '2010', end: '2014', grade: '8.4 CGPA', bullets: '' },
  ],
  skills: [
    { name: 'Product Strategy', level: 5 }, { name: 'Roadmapping', level: 5 }, { name: 'SQL & Analytics', level: 4 },
    { name: 'A/B Testing', level: 4 }, { name: 'Stakeholder Management', level: 5 }, { name: 'Figma', level: 3 },
    { name: 'Jira & Confluence', level: 4 }, { name: 'Payments & Fintech', level: 5 },
  ],
  projects: [
    { name: 'Open-source PRD Toolkit', link: 'github.com/aarav/prd-kit', start: '2023', end: '', bullets: 'Templates and checklists for product specs; 1.8k GitHub stars' },
  ],
  certifications: [
    { name: 'Certified Scrum Product Owner (CSPO)', issuer: 'Scrum Alliance', date: '2020' },
    { name: 'Product Analytics Certification', issuer: 'Amplitude', date: '2022' },
  ],
  awards: [{ title: 'Razorpay Rocket Award', issuer: 'Razorpay', date: '2023', description: 'Top 1% impact across product org' }],
  languages: [
    { name: 'English', fluency: 'Fluent' }, { name: 'Hindi', fluency: 'Native' }, { name: 'Tamil', fluency: 'Intermediate' },
  ],
  interests: [{ name: 'Long-distance running' }, { name: 'Chess' }, { name: 'Mentoring' }],
  hidden: { volunteer: true, publications: true, references: true, custom: true, interests: false },
};

const student = {
  personal: {
    fullName: 'Priya Sharma',
    jobTitle: 'Computer Science Undergraduate',
    email: 'priya.sharma@college.edu',
    phone: '+91 91234 56789',
    location: 'Pune, India',
    website: '',
    linkedin: 'linkedin.com/in/priyasharma',
    github: 'github.com/priyasharma',
    photo: '',
  },
  summary:
    'Final-year Computer Science student with hands-on experience in full-stack web development and machine learning. Seeking a software engineering internship where I can ship real features and learn from a strong engineering team.',
  experience: [
    {
      role: 'Software Engineering Intern', company: 'Zoho', location: 'Chennai', start: 'May 2025', end: 'Jul 2025',
      bullets: 'Built a React dashboard for internal QA metrics used by 120+ engineers\nWrote REST APIs in Java with 90% unit-test coverage\nReduced report load time by 40% using query caching',
    },
    {
      role: 'Technical Lead', company: 'Google Developer Student Club', location: 'Pune', start: 'Aug 2024', end: 'Present',
      bullets: 'Organised 12 workshops on web and cloud for 600+ students\nLed a team of 8 building a campus lost-and-found app',
    },
  ],
  education: [
    { degree: 'B.E., Computer Engineering', school: 'College of Engineering Pune (COEP)', location: 'Pune', start: '2022', end: '2026', grade: '9.1 CGPA', bullets: 'Relevant coursework: Data Structures, DBMS, Operating Systems, Machine Learning' },
    { degree: 'Class XII (CBSE)', school: 'Delhi Public School', location: 'Pune', start: '', end: '2022', grade: '95.4%', bullets: '' },
  ],
  skills: [
    { name: 'JavaScript', level: 4 }, { name: 'React', level: 4 }, { name: 'Python', level: 5 }, { name: 'Java', level: 4 },
    { name: 'SQL', level: 4 }, { name: 'Git', level: 4 }, { name: 'TensorFlow', level: 3 }, { name: 'Docker', level: 3 },
  ],
  projects: [
    { name: 'CropCare – Plant Disease Detector', link: 'github.com/priyasharma/cropcare', start: 'Jan 2025', end: 'Apr 2025', bullets: 'CNN model with 94% accuracy on 38 disease classes\nDeployed as a Flask API with an Android client used by 300 farmers' },
    { name: 'StudySync', link: 'studysync.app', start: 'Aug 2024', end: 'Nov 2024', bullets: 'Real-time group study planner built with Next.js and Firebase' },
  ],
  certifications: [
    { name: 'Google Cloud Digital Leader', issuer: 'Google', date: '2025' },
    { name: 'Machine Learning Specialization', issuer: 'Coursera / Stanford', date: '2024' },
  ],
  awards: [
    { title: 'Smart India Hackathon – Winner', issuer: 'Govt. of India', date: '2024', description: '' },
    { title: "Dean's List", issuer: 'COEP', date: '2023, 2024', description: '' },
  ],
  languages: [{ name: 'English', fluency: 'Fluent' }, { name: 'Hindi', fluency: 'Native' }, { name: 'Marathi', fluency: 'Fluent' }],
  interests: [{ name: 'Competitive programming' }, { name: 'Classical dance' }],
  order: ['summary', 'education', 'experience', 'projects', 'skills', 'certifications', 'awards', 'languages', 'volunteer', 'publications', 'interests', 'references', 'custom'],
  hidden: { volunteer: true, publications: true, references: true, custom: true, interests: false },
};

const executive = {
  personal: {
    fullName: 'Vikram Rao',
    jobTitle: 'Chief Operating Officer',
    email: 'vikram.rao@email.com',
    phone: '+91 99887 76655',
    location: 'Mumbai, India',
    website: '',
    linkedin: 'linkedin.com/in/vikramrao',
    github: '',
    photo: '',
  },
  summary:
    'Operations and P&L leader with 20+ years scaling consumer and logistics businesses across India and Southeast Asia. Led organisations of 4,000+ people, delivered three turnarounds, and guided a company through a successful ₹2,400 Cr IPO. Board member and advisor to two growth-stage startups.',
  experience: [
    {
      role: 'Chief Operating Officer', company: 'Delhivery', location: 'Mumbai', start: '2019', end: 'Present',
      bullets: 'Run end-to-end operations across 18,000 pin codes, 24 hubs and a ₹7,200 Cr revenue base\nImproved contribution margin by 410 bps through network redesign and automation\nKey member of IPO leadership team; built investor narrative on unit economics\nBuilt a 60-person leadership bench; 70% of senior roles now filled internally',
    },
    {
      role: 'Vice President, Supply Chain', company: 'Hindustan Unilever', location: 'Mumbai', start: '2012', end: '2019',
      bullets: 'Owned supply chain for home care, a ₹14,000 Cr category, across 9 factories\nDelivered ₹620 Cr savings over 4 years through a procurement transformation\nLaunched a distributor digitisation program reaching 6 lakh retailers',
    },
    {
      role: 'Director, Operations', company: 'McKinsey & Company', location: 'Delhi', start: '2006', end: '2012',
      bullets: 'Led 20+ operations transformations for consumer and industrial clients in Asia',
    },
  ],
  education: [
    { degree: 'MBA', school: 'Indian School of Business', location: 'Hyderabad', start: '', end: '2006', grade: '', bullets: '' },
    { degree: 'B.E., Mechanical Engineering', school: 'BITS Pilani', location: 'Pilani', start: '', end: '2002', grade: '', bullets: '' },
  ],
  skills: [
    { name: 'P&L Leadership', level: 5 }, { name: 'Operational Excellence', level: 5 }, { name: 'M&A Integration', level: 4 },
    { name: 'Supply Chain Strategy', level: 5 }, { name: 'Board Governance', level: 4 }, { name: 'Change Management', level: 5 },
  ],
  projects: [],
  certifications: [{ name: 'Advanced Management Program', issuer: 'Harvard Business School', date: '2018' }],
  awards: [{ title: 'COO of the Year – Logistics', issuer: 'ET Now Leadership Awards', date: '2023', description: '' }],
  languages: [{ name: 'English', fluency: 'Fluent' }, { name: 'Hindi', fluency: 'Native' }, { name: 'Kannada', fluency: 'Fluent' }],
  interests: [],
  hidden: { volunteer: true, publications: true, references: true, custom: true, interests: true, projects: true },
};

// Illustrative examples, never claims about the user's experience.
const academic = {
  personal: { fullName: 'Dr. Ananya Sen', jobTitle: 'Researcher · Environmental Engineering', email: 'ananya@example.com', location: 'Pune, India', website: 'example.com/ananya' },
  summary: 'Environmental engineering researcher studying urban water reuse. Combines field sampling, statistical modelling and undergraduate teaching.',
  education: [{ degree: 'PhD, Environmental Engineering', school: 'Example Institute of Technology', start: '2019', end: '2024', bullets: 'Thesis: Low-energy treatment of municipal wastewater' }],
  publications: [{ title: 'Monitoring nutrient removal in pilot-scale wetlands', publisher: 'Illustrative journal article', date: '2024', link: 'example.com/publications/wetlands' }],
  research: [{ title: 'Research Fellow', subtitle: 'Centre for Urban Water Research', date: '2024 – Present', bullets: 'Designed a sampling protocol across 12 pilot sites\nReleased a reproducible analysis workflow for the project team' }],
  teaching: [{ title: 'Teaching Assistant', subtitle: 'Environmental Systems', date: '2021 – 2023', bullets: 'Led weekly practical sessions for 45 undergraduate students' }],
  grants: [{ title: 'Early Career Research Grant', subtitle: 'Illustrative university funding award', date: '2024', bullets: 'Co-developed the study design and funding proposal for a two-year pilot' }],
  service: [{ title: 'Research Methods Workshop', subtitle: 'Department seminar series', date: '2023', bullets: 'Organised training on transparent data analysis and research reproducibility' }],
  skills: [{ name: 'R', group: 'Analysis' }, { name: 'Python', group: 'Analysis' }, { name: 'Water quality sampling', group: 'Methods' }],
};

const engineering = {
  personal: { fullName: 'Rohan Shah', jobTitle: 'Software Engineer', email: 'rohan@example.com', location: 'Bengaluru, India', github: 'github.com/example', website: 'example.com/rohan' },
  summary: 'Software engineer building dependable web services and accessible interfaces. Works across API design, performance and automated testing.',
  experience: [{ role: 'Software Engineer', company: 'Example Software', start: '2022', end: 'Present', bullets: 'Reduced p95 API latency from 420ms to 180ms through query profiling and caching\nIntroduced integration tests for checkout workflows, covering 18 critical scenarios\nPartnered with design to make account settings usable with a keyboard' }],
  projects: [{ name: 'Community Events', link: 'example.com/projects/events', start: '2024', bullets: 'Built a React and Node.js event directory for a volunteer group\nDocumented API contracts and deployment steps for new contributors' }],
  education: [{ degree: 'B.Tech, Computer Science', school: 'Example University', end: '2022' }],
  skills: [{ name: 'JavaScript', group: 'Languages' }, { name: 'TypeScript', group: 'Languages' }, { name: 'React', group: 'Frameworks' }, { name: 'Node.js', group: 'Frameworks' }, { name: 'PostgreSQL', group: 'Data' }, { name: 'Git', group: 'Tools' }],
};

const design = {
  personal: { fullName: 'Maya Kapoor', jobTitle: 'Product Designer', email: 'maya@example.com', location: 'Mumbai, India', website: 'example.com/maya' },
  summary: 'Product designer focused on clear onboarding and accessible financial services. Turns research insights into prototypes and production-ready design systems.',
  experience: [{ role: 'Product Designer', company: 'Example Studio', start: '2021', end: 'Present', bullets: 'Redesigned account setup after 16 usability interviews, improving task completion from 68% to 89%\nCreated 35 reusable components with documented keyboard and screen-reader behavior\nPartnered with engineering to review implementation quality before release' }],
  projects: [{ name: 'Accessible Banking Onboarding', link: 'example.com/maya/onboarding', start: '2024', bullets: 'Case study covering research, alternatives, trade-offs and measured results' }],
  education: [{ degree: 'Bachelor of Design', school: 'Example Design Institute', end: '2021' }],
  skills: [{ name: 'User interviews', group: 'Research' }, { name: 'Usability testing', group: 'Research' }, { name: 'Figma', group: 'Tools' }, { name: 'Prototyping', group: 'Practice' }, { name: 'Accessibility', group: 'Practice' }],
};

const finance = {
  personal: { fullName: 'Neha Patel', jobTitle: 'Financial Analyst', email: 'neha@example.com', location: 'Ahmedabad, India' },
  summary: 'Financial analyst supporting budgeting, forecasting and operational decisions. Builds transparent models and explains variances to business partners.',
  experience: [{ role: 'Financial Analyst', company: 'Example Manufacturing', start: '2021', end: 'Present', bullets: 'Automated monthly reconciliation, reducing preparation time from 6 hours to 45 minutes\nBuilt scenario models used in quarterly capacity planning\nInvestigated purchase-price variances with procurement and documented corrective actions' }],
  education: [{ degree: 'B.Com, Accounting', school: 'Example University', end: '2021' }],
  skills: [{ name: 'Forecasting', group: 'Finance' }, { name: 'Variance analysis', group: 'Finance' }, { name: 'Excel', group: 'Tools' }, { name: 'Power BI', group: 'Tools' }],
};

const sales = {
  personal: { fullName: 'Arjun Das', jobTitle: 'Account Executive', email: 'arjun@example.com', location: 'Delhi, India' },
  summary: 'B2B account executive with experience in consultative discovery, pipeline planning and customer expansion.',
  experience: [{ role: 'Account Executive', company: 'Example Cloud', start: '2022', end: 'Present', bullets: 'Reached 112% of annual quota through new business and account expansion\nBuilt account plans with customer success for 24 priority customers\nImproved handoff documentation to shorten implementation discovery' }],
  education: [{ degree: 'BBA', school: 'Example University', end: '2020' }],
  skills: [{ name: 'Discovery', group: 'Sales' }, { name: 'Negotiation', group: 'Sales' }, { name: 'Salesforce', group: 'Tools' }, { name: 'Forecasting', group: 'Operations' }],
};

const healthcare = {
  personal: { fullName: 'Sara Thomas', jobTitle: 'Registered Nurse', email: 'sara@example.com', location: 'Kochi, India' },
  summary: 'Registered nurse with medical-surgical experience, patient education skills and a focus on reliable handovers.',
  experience: [{ role: 'Staff Nurse', company: 'Example Hospital', start: '2021', end: 'Present', bullets: 'Coordinated care and discharge education with a multidisciplinary ward team\nHelped introduce a structured handover checklist across three shifts\nMentored four newly qualified nurses during their induction' }],
  education: [{ degree: 'B.Sc Nursing', school: 'Example College of Nursing', end: '2021' }],
  certifications: [{ name: 'Nursing registration', issuer: 'Relevant nursing council — replace with your verified details', date: '2021' }],
  skills: [{ name: 'Patient education', group: 'Clinical practice' }, { name: 'Care coordination', group: 'Clinical practice' }, { name: 'Clinical documentation', group: 'Practice' }],
};

executive.highlights = [{ title: 'Business transformation', subtitle: 'Selected leadership outcomes', bullets: 'Improved contribution margin by 410 basis points\nLed operations across a ₹7,200 Cr revenue base' }];
executive.boards = [{ title: 'Advisor', subtitle: 'Two growth-stage businesses', bullets: 'Advised leadership teams on operating models and scaling priorities' }];

export const SAMPLES = {
  professional: { label: 'Corporate professional', data: professional },
  student: { label: 'College student / fresher', data: student },
  executive: { label: 'Senior executive', data: executive },
  academic: { label: 'Academic / researcher', data: academic },
  engineering: { label: 'Software engineer', data: engineering },
  design: { label: 'Product designer', data: design },
  finance: { label: 'Financial analyst', data: finance },
  sales: { label: 'Account executive', data: sales },
  healthcare: { label: 'Healthcare professional', data: healthcare },
};

export function sampleResume(key = 'professional') {
  const data = normalizeResume(JSON.parse(JSON.stringify((SAMPLES[key] || SAMPLES.professional).data)));
  return applyCareerPreset(data, ['student', 'executive', 'academic'].includes(key) ? key : 'professional');
}
