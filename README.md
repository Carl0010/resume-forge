# ResumeForge – free resume & CV builder

Free, no-login resume builder with **52 templates**, live preview, advanced styling, PDF / TXT / JSON export,
AI import of old resumes (login required) and a reserved slot for the upcoming AI writer.

## Run it

```bash
npm install
npm run dev        # http://localhost:5173
npm run build      # static site in dist/ — host on Firebase Hosting, Netlify, Vercel, S3…
```

Routing uses real URLs (`/builder`, `/templates/student`) for SEO. `npm run build` also pre-renders a static HTML page per route
(title, description, canonical, social tags, crawlable fallback content) and writes `sitemap.xml` and `robots.txt` — see `scripts/prerender.mjs`.
Page titles/descriptions/intro copy live in `src/seo-data.js`. The host needs an SPA fallback to `index.html`; `vercel.json` already has it
(Netlify: add `/* /index.html 200` to `_redirects`). Set `SITE_URL` at build time if you move to a custom domain, and update `SITE_URL` in `src/seo-data.js` and the URLs in `index.html`.
Old `#/…` links are upgraded to real paths automatically.

## What's inside

| Area | Where |
|---|---|
| Pages: Home, Templates, Builder, AI Import, AI Writer | `src/pages/` |
| Editor (all sections, reorder, rename, hide) | `src/builder/Editor.jsx` |
| Design tab + **Advanced settings** (colours, fonts, size, spacing, margins, heading & skill styles) | `src/builder/DesignPanel.jsx` |
| Template definitions (52, 8 layout families) | `src/templates/registry.js` |
| Resume renderer + styles | `src/templates/Resume.jsx`, `src/templates/resume.css` |
| Data model & section specs | `src/data/schema.js` |
| Example resumes (student / corporate / executive) | `src/data/samples.js` |
| Auth (dummy now, Firebase-ready) | `src/services/authProvider.js`, `src/services/firebaseProvider.js` |
| AI server calls | `src/services/ai.js` |
| Config (API base, upload limits, Firebase keys) | `src/config.js` |

User data is autosaved to `localStorage` only. Nothing is sent anywhere except the file a signed-in user uploads for AI import.

### Adding a template
Add one line to `TEMPLATES` in `registry.js` — pick a `layout` (`classic`, `sidebar`, `banner`, `labels`, `timeline`, `twocol`, `compact`, `minimal`),
a `header` (`left`, `center`, `split`, `underline`, `banner`), a heading `title` style, fonts and colours.

## Switching on real Google login (Firebase)

1. `npm i firebase`
2. Create `.env` from `.env.example` and fill in the `VITE_FIREBASE_*` values (Firebase console → Project settings → Web app). Enable **Google** under Authentication → Sign-in method and add your domain to *Authorized domains*.
3. In `src/services/authProvider.js` replace the last line with:
   ```js
   export { default } from './firebaseProvider.js';
   ```

## Connecting your AI server (resume import)

Set `VITE_API_BASE=https://your-server` in `.env`. Without it, the import flow runs in demo mode with example data.

**Request** `POST {VITE_API_BASE}/api/resume/parse`
- `multipart/form-data`: `file` (pdf, png, jpg, webp, doc, docx, txt, rtf, odt — max 10 MB), `templateId`
- Header: `Authorization: Bearer <Firebase ID token>` — verify it server-side with the Firebase Admin SDK (`verifyIdToken`).

**Response** `200` → `{ "resume": { ... } }` in this shape (every field optional; `bullets` can be a `\n` string or an array):

```json
{
  "personal": { "fullName": "", "jobTitle": "", "email": "", "phone": "", "location": "", "website": "", "linkedin": "", "github": "" },
  "summary": "",
  "experience":     [{ "role": "", "company": "", "location": "", "start": "Jan 2021", "end": "Present", "bullets": ["..."] }],
  "education":      [{ "degree": "", "school": "", "location": "", "start": "", "end": "", "grade": "", "bullets": [] }],
  "skills":         [{ "name": "Python", "level": 4 }],
  "projects":       [{ "name": "", "link": "", "start": "", "end": "", "bullets": [] }],
  "certifications": [{ "name": "", "issuer": "", "date": "" }],
  "awards":         [{ "title": "", "issuer": "", "date": "", "description": "" }],
  "languages":      [{ "name": "", "fluency": "" }],
  "volunteer":      [{ "role": "", "org": "", "start": "", "end": "", "bullets": [] }],
  "publications":   [{ "title": "", "publisher": "", "date": "", "link": "" }],
  "interests":      [{ "name": "" }],
  "references":     [{ "name": "", "position": "", "contact": "" }]
}
```
Errors: return a non-2xx status with `{ "error": "message shown to the user" }`.

The response is passed through `normalizeResume()`, so partial data never breaks the builder.

## AI Writer (reserved)
Route `#/ai-writer` (`src/pages/AIWriter.jsx`), the “AI assist” tab/buttons in the builder, and `aiWrite()` in `src/services/ai.js`
are placeholders ready for the feature once it's defined. `ENDPOINTS.aiWriter` in `config.js` is reserved.

## PDF export
“Download PDF” opens the browser print dialog with a print stylesheet that outputs only the resume (A4 or Letter, colours preserved).
Users pick “Save as PDF”. Text stays selectable, which ATS parsers need.

## Template quality and validation

All 52 templates default to at least 10.5pt body type, grouped skills and no photo.
The Design panel offers Comfortable / Compact spacing, a simple single-column
layout, and student, professional, executive and academic section presets.
Presets reorder/reveal sections without deleting entries. Template selection
can reset presentation defaults independently of the content.

The gallery recommends three designs based on career stage, role and style,
compares up to three designs using the same content, and previews every page.
Nine illustrative sample resumes cover students, professionals, executives,
academics, engineering, design, finance, sales and healthcare.

Preview and PDF share explicit paginated DOM, including page numbering and
A4 / Letter dimensions. Printing uses zero browser margins because padding is
included inside each page. Use 100% scale, turn off browser headers/footers and
use the selected paper size. Fonts and images can change pagination when they
load; export waits for fonts. Unusually large entries split at paragraph, bullet
or word boundaries. The error state blocks export if content cannot be laid out.

Run `npm test` for link safety, backup compatibility, preset preservation and
recommendation checks. Run `npm run build` for the production bundle and all
23 prerendered routes. Browser/PDF regression checks are documented in
`tests/BROWSER.md`. “Simple” denotes a design property, not certification for
Workday, Greenhouse or any other hiring system. PDF text extraction checks
cannot establish compatibility with every third-party parser.

`src/services/usage.js` records aggregate counts locally and dispatches an
`rf:usage` event with only an event name and template ID. No analytics endpoint
or visitor identifiers are configured. `getUsageCounts()` reads local counts.
`pdf_requested` and `print_dialog_closed` must not be reported as completed PDF
saves: the browser does not reveal that outcome. `text_export_created` records
creation of the text download. Add an approved analytics integration separately
if site-wide conversion reporting is needed, and update the privacy policy.
