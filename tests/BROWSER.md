# Browser and PDF regression checks

Requirements: Node.js 22+ (native WebSocket), Chromium, `pdfinfo` and `pdftotext`
(Poppler). No browser automation dependency is added to the app.

Start the app with `npm run dev -- --host 127.0.0.1 --port 5173 --strictPort`.
In another terminal run `npm run test:browser`. Set `CHROMIUM_BIN` if Chromium
has a different executable name, and `BROWSER_URL` if the development server
uses a different address. In this isolated cloud container use
`CHROMIUM_NO_SANDBOX=1 npm run test:browser`; keep Chromium's sandbox enabled
on machines that support it.

The script starts its own browser with a temporary profile and synthetic data.
It removes the profile afterwards and prints the directory containing PDF
artifacts. It never uses a real user's browser profile or saved resume.

Checks:

- All 52 templates at both A4 and Letter: rendered content, section overflow,
  preservation of the last section, matching preview/print page counts.
- PDFs for all eight layout families at both sizes: actual PDF page counts,
  selectable text and presence of the first and last content.
- A short resume remains one page; Letter produces 612 × 792pt paper.
- A 2,200-word entry in classic and sidebar layouts splits across pages without
  losing any word or the final sentinel.
- Comparison renders two complete documents with measurable height.
- Choosing a template and applying academic structure preserves personal details
  and work achievements while revealing publications.
- Simple layout updates both preview and export.
- Mobile preview at 390px has visible pages and no horizontal document overflow.
- Uncaught browser JavaScript exceptions fail the run.

`npm test` covers URL safety, migration of old backups, preservation of content
when applying presets, recommendation choices and all template defaults.

These checks establish Chromium behavior and PDF text extraction. They do not
certify a third-party ATS or establish Firefox/Safari print behavior. For release
QA, also open PDFs manually, inspect page breaks and links, test with downloaded
web fonts, and check a photo and long contact URLs on the target browsers.
