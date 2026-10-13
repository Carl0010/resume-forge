// Post-build step: writes one static HTML file per route (dist/<route>/index.html) with the right
// <title>, description, canonical, social tags and a crawlable content fallback, plus sitemap.xml and robots.txt.
// Vercel serves these files directly (cleanUrls), and the SPA rewrite in vercel.json catches everything else.
import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const dist = join(root, 'dist');
const seo = await import(pathToFileURL(join(root, 'src', 'seo-data.js')).href);
const SITE = (process.env.SITE_URL || seo.SITE_URL).replace(/\/$/, '');
const esc = (t) => String(t).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
const template = readFileSync(join(dist, 'index.html'), 'utf8').replaceAll(seo.SITE_URL, SITE);

const NAV = [
  ['/', 'Home'], ['/templates', 'Resume templates'], ['/templates/ats', 'ATS-friendly templates'], ['/templates/student', 'Student & fresher templates'],
  ['/templates/professional', 'Corporate templates'], ['/templates/executive', 'Executive CV templates'], ['/templates/modern', 'Modern templates'],
  ['/templates/creative', 'Creative templates'], ['/templates/academic', 'Academic CV templates'], ['/builder', 'Resume builder'], ['/guides', 'Resume & CV guides'], ['/import', 'Import an old resume'],
  ['/about', 'About'], ['/contact', 'Contact'], ['/privacy', 'Privacy'], ['/terms', 'Terms'],
];

function fallback(path) {
  const m = seo.ROUTES[path];
  const links = NAV.map(([href, label]) => `<li><a href="${href}">${esc(label)}</a></li>`).join('');
  const body = (m.sections || []).map((s) => `<h2>${esc(s.h)}</h2>${(s.p || []).map((t) => `<p>${esc(t)}</p>`).join('')}${s.ul ? `<ul>${s.ul.map((t) => `<li>${esc(t)}</li>`).join('')}</ul>` : ''}`).join('');
  const guideList = path === '/guides' ? `<ul>${seo.GUIDES.map((g) => `<li><a href="/guides/${g.slug}">${esc(g.h1)}</a> – ${esc(g.description)}</li>`).join('')}</ul>` : '';
  const faq = path === '/' ? `<h2>Questions</h2>${seo.FAQ.map(([q, a]) => `<h3>${esc(q)}</h3><p>${esc(a)}</p>`).join('')}` : '';
  return `<div id="root"><main style="max-width:760px;margin:0 auto;padding:32px 20px;font-family:system-ui,sans-serif"><h1>${esc(m.h1)}</h1><p>${esc(m.intro)}</p>${body}${guideList}<nav aria-label="Main"><ul>${links}</ul></nav>${faq}</main></div>`;
}

function render(path) {
  const m = seo.ROUTES[path];
  const url = SITE + (path === '/' ? '/' : path);
  let html = template
    .replace(/<title>[\s\S]*?<\/title>/, `<title>${esc(m.title)}</title>`)
    .replace(/(<meta name="description" content=")[^"]*(")/, `$1${esc(m.description)}$2`)
    .replace(/(<meta name="robots" content=")[^"]*(")/, `$1${m.noindex ? 'noindex, follow' : 'index, follow'}$2`)
    .replace(/(<link rel="canonical" href=")[^"]*(")/, `$1${url}$2`)
    .replace(/(<meta property="og:url" content=")[^"]*(")/, `$1${url}$2`)
    .replace(/(<meta property="og:title" content=")[^"]*(")/, `$1${esc(m.title)}$2`)
    .replace(/(<meta property="og:description" content=")[^"]*(")/, `$1${esc(m.description)}$2`)
    .replace('<div id="root"></div>', fallback(path));
  if (m.kind === 'guide') {
    const ld = {
      '@context': 'https://schema.org', '@type': 'Article', headline: m.h1, description: m.description, datePublished: m.date, dateModified: m.date,
      mainEntityOfPage: url, author: { '@type': 'Organization', name: seo.SITE_NAME }, publisher: { '@type': 'Organization', name: seo.SITE_NAME, url: SITE },
      image: SITE + '/og.png',
    };
    html = html.replace('</head>', `    <script type="application/ld+json">${JSON.stringify(ld)}</script>\n  </head>`);
  }
  if (path === '/') {
    const faqLd = { '@context': 'https://schema.org', '@type': 'FAQPage', mainEntity: seo.FAQ.map(([q, a]) => ({ '@type': 'Question', name: q, acceptedAnswer: { '@type': 'Answer', text: a } })) };
    html = html.replace('</head>', `    <script type="application/ld+json">${JSON.stringify(faqLd)}</script>\n  </head>`);
  }
  return html;
}

for (const path of Object.keys(seo.ROUTES)) {
  const html = render(path);
  if (path === '/') writeFileSync(join(dist, 'index.html'), html);
  else {
    mkdirSync(join(dist, path), { recursive: true });
    writeFileSync(join(dist, path, 'index.html'), html);
  }
}

const today = new Date().toISOString().slice(0, 10);
const urls = seo.SITEMAP_PATHS.map((p) => `  <url><loc>${SITE}${p === '/' ? '/' : p}</loc><lastmod>${today}</lastmod><priority>${p === '/' ? '1.0' : p === '/builder' || p === '/templates' ? '0.9' : ['/privacy', '/terms', '/contact', '/about'].includes(p) ? '0.3' : '0.7'}</priority></url>`).join('\n');
writeFileSync(join(dist, 'sitemap.xml'), `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>\n`);
writeFileSync(join(dist, 'robots.txt'), `User-agent: *\nAllow: /\n\nSitemap: ${SITE}/sitemap.xml\n`);
console.log(`prerendered ${Object.keys(seo.ROUTES).length} routes + sitemap.xml + robots.txt for ${SITE}`);
