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

export const SAMPLES = {
  professional: { label: 'Corporate professional', data: professional },
  student: { label: 'College student / fresher', data: student },
  executive: { label: 'Senior executive', data: executive },
};

export const sampleResume = (key = 'professional') => normalizeResume(JSON.parse(JSON.stringify(SAMPLES[key].data)));
