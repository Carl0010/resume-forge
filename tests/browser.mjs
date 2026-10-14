import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import assert from 'node:assert/strict';
import { spawn, execFileSync } from 'node:child_process';
const baseUrl = process.env.BROWSER_URL || 'http://127.0.0.1:5173';
assert.equal(
  (await fetch(baseUrl + '/src/main.jsx')).status,
  200,
  'Start the Vite development server first',
);
const profile = fs.mkdtempSync(path.join(os.tmpdir(), 'resume-forge-chromium-'));
const artifactDir = fs.mkdtempSync(path.join(os.tmpdir(), 'resume-forge-report-'));
const browser = spawn(
  process.env.CHROMIUM_BIN || 'chromium',
  [
    '--headless',
    '--disable-dev-shm-usage',
    '--disable-background-networking',
    '--remote-debugging-port=0',
    '--user-data-dir=' + profile,
    ...(process.env.CHROMIUM_NO_SANDBOX === '1' ? ['--no-sandbox'] : []),
    'about:blank',
  ],
  { stdio: 'ignore' },
);
let ws;
try {
  const portFile = path.join(profile, 'DevToolsActivePort');
  for (let n = 0; n < 100 && !fs.existsSync(portFile); n++)
    await new Promise((r) => setTimeout(r, 100));
  assert.ok(
    fs.existsSync(portFile),
    'Chromium did not start; set CHROMIUM_BIN and, in an isolated container, CHROMIUM_NO_SANDBOX=1',
  );
  const port = fs.readFileSync(portFile, 'utf8').split('\n')[0];
  const tabs = await (await fetch('http://127.0.0.1:' + port + '/json')).json();
  ws = new WebSocket(tabs.find((t) => t.type === 'page').webSocketDebuggerUrl);
  await new Promise((r) => (ws.onopen = r));
  let id = 0;
  const pending = new Map();
  const errors = [];
  ws.onmessage = (e) => {
    const m = JSON.parse(e.data);
    if (m.id) {
      pending.get(m.id)?.(m);
      pending.delete(m.id);
    }
    if (m.method === 'Runtime.exceptionThrown')
      errors.push(
        m.params.exceptionDetails.exception?.description || m.params.exceptionDetails.text,
      );
  };
  const send = (method, params = {}) =>
    new Promise((resolve, reject) => {
      const n = ++id;
      pending.set(n, (m) => (m.error ? reject(m.error) : resolve(m.result)));
      ws.send(JSON.stringify({ id: n, method, params }));
    });
  const evaluate = async (expression) => {
    const r = await send('Runtime.evaluate', {
      expression,
      awaitPromise: true,
      returnByValue: true,
    });
    if (r.exceptionDetails) throw new Error(JSON.stringify(r.exceptionDetails));
    return r.result.value;
  };
  const until = async (expression) => {
    for (let n = 0; n < 100; n++) {
      if (await evaluate(expression)) return;
      await new Promise((r) => setTimeout(r, 100));
    }
    throw new Error('Timed out: ' + expression);
  };
  await send('Runtime.enable');
  await send('Emulation.setDeviceMetricsOverride', {
    width: 1440,
    height: 1100,
    deviceScaleFactor: 1,
    mobile: false,
  });
  await send('Page.navigate', { url: baseUrl + '/builder' });
  await until('!!document.querySelector(".paper-frame .rs-page")');
  const seed = async (key, options = {}) => {
    await evaluate(
      `(async()=>{const {sampleResume}=await import('/src/data/samples.js');const r=sampleResume('${key}');if('${key}' !== 'professional') r.personal.fullName='Test ${key} ${options.mark || ''}';r.settings={...r.settings,templateId:'${options.template || 'harvard'}',pageSize:'${options.paper || 'A4'}'};${options.long ? "r.experience=[{id:'long',role:'Long experience',company:'Company',bullets:Array.from({length:2200},(_,i)=>'word'+i).join(' ')+' LAST_SENTINEL'}];r.summary='';r.projects=[];r.skills=[];r.education=[];" : ''}localStorage.setItem('rf.resume.v1',JSON.stringify(r));})()`,
    );
    await evaluate("history.replaceState(null,'','/builder')");
    await send('Page.reload');
    await new Promise((r) => setTimeout(r, 300));
    await until(
      `document.querySelector('.paper-frame .rs-name')?.textContent === '${key === 'professional' ? 'Aarav Mehta' : `Test ${key} ${options.mark || ''}`}' && !!document.querySelector('#print-root .resume-pages[data-ready="true"] .rs-page') || !!document.querySelector('.pagination-error')`,
    );
    assert.deepEqual(
      await evaluate(`[...document.querySelectorAll('.pagination-error')].map(x=>x.innerText)`),
      [],
    );
  };
  await seed('professional');
  const templates = await evaluate(
    "import('/src/templates/registry.js').then(m=>m.TEMPLATES.map(t=>({id:t.id,layout:t.layout})))",
  );
  for (const paper of ['A4', 'Letter']) {
    await seed('professional', { paper });
    for (const t of templates) {
      await evaluate(
        `history.pushState(null,'','/builder?t=${t.id}');window.dispatchEvent(new Event('rf:navigate'))`,
      );
      await until(
        `document.querySelector('.paper-frame .rs-page')?.dataset.template === '${t.id}' && document.querySelector('#print-root .rs-page')?.dataset.template === '${t.id}'`,
      );
      const result = await evaluate(
        `(()=>{const pages=[...document.querySelectorAll('.paper-frame .rs-page')];return {id:'${t.id}',count:pages.length,print:document.querySelectorAll('#print-root .rs-page').length,errors:[...document.querySelectorAll('.pagination-error')].map(e=>e.textContent),text:pages.map(p=>p.innerText).join(' '),overflows:pages.flatMap((p,i)=>[...p.querySelectorAll('.rs-sec')].filter(s=>s.getBoundingClientRect().bottom>p.getBoundingClientRect().bottom+1).map(s=>i+':'+s.className))};})()`,
      );
      assert.deepEqual(result.errors, [], t.id);
      assert.deepEqual(result.overflows, [], t.id);
      assert.equal(result.count, result.print, t.id);
      assert.ok(result.text.includes('Aarav Mehta'), t.id);
      assert.ok(result.text.includes('Mentoring'), t.id + ' lost last section');
      if (
        [
          'harvard',
          'metro',
          'compact-pro',
          'researcher',
          'executive-pro',
          'summit',
          'minimal',
          'chrono',
        ].includes(t.id)
      ) {
        const pdf = await send('Page.printToPDF', {
          printBackground: true,
          preferCSSPageSize: true,
        });
        const file = artifactDir + '/verified-' + paper + '-' + t.id + '.pdf';
        fs.writeFileSync(file, Buffer.from(pdf.data, 'base64'));
        const info = execFileSync('pdfinfo', [file], { encoding: 'utf8' });
        assert.equal(
          Number(info.match(/Pages:\s+(\d+)/)[1]),
          result.count,
          t.id + ' PDF page count',
        );
        const text = execFileSync('pdftotext', [file, '-'], { encoding: 'utf8' });
        assert.ok(text.includes('Aarav Mehta'));
        assert.ok(text.includes('Mentoring'));
      }
    }
    console.log(
      paper + ': all 52 templates rendered; PDF counts matched across all 8 layout families.',
    );
  }
  assert.deepEqual(errors, []);
  for (const options of [
    { mark: 'short' },
    { mark: 'letter', paper: 'Letter' },
    { mark: 'long', long: true },
    { mark: 'side', long: true, template: 'metro' },
  ]) {
    await seed('engineering', options);
    const count = await evaluate(`document.querySelectorAll('.paper-frame .rs-page').length`);
    if (options.mark === 'short') assert.equal(count, 1, 'Short resume should be one page');
    const pdf = await send('Page.printToPDF', { printBackground: true, preferCSSPageSize: true });
    const file = artifactDir + '/edge-' + options.mark + '.pdf';
    fs.writeFileSync(file, Buffer.from(pdf.data, 'base64'));
    const info = execFileSync('pdfinfo', [file], { encoding: 'utf8' });
    assert.equal(Number(info.match(/Pages:\s+(\d+)/)[1]), count);
    const text = execFileSync('pdftotext', [file, '-'], { encoding: 'utf8' });
    if (options.long) {
      const words = new Set(text.match(/word\d+/g));
      for (let i = 0; i < 2200; i++) assert.ok(words.has('word' + i), 'Lost word' + i);
      assert.ok(text.includes('LAST_SENTINEL'));
    }
    if (options.paper === 'Letter') assert.match(info, /612 x 792/);
    console.log(options.mark, count, 'pages validated');
  }
  await seed('engineering', { mark: 'ui' });
  await evaluate(
    `history.pushState(null,'','/templates');window.dispatchEvent(new Event('rf:navigate'))`,
  );
  await until(`document.querySelectorAll('.recommendation-grid .tpl-card').length===3`);
  await evaluate(
    `document.querySelectorAll('.tpl-grid .tpl-card input[type=checkbox]')[0].click();document.querySelectorAll('.tpl-grid .tpl-card input[type=checkbox]')[1].click()`,
  );
  await until(`!document.querySelector('.compare-bar .primary').disabled`);
  await evaluate(`document.querySelector('.compare-bar .primary').click()`);
  await until(
    `document.querySelectorAll('.comparison-grid .resume-pages[data-ready=true]').length===2`,
  );
  await until(
    `[...document.querySelectorAll('.comparison-grid .scaled')].every(e=>e.getBoundingClientRect().height>200)`,
  );
  await evaluate(`document.querySelector('.modal-x').click()`);
  const savedBefore = await evaluate(`JSON.parse(localStorage.getItem('rf.resume.v1'))`);
  await evaluate(
    `const select=document.querySelector('.finder-fields select'); select.value='academic'; select.dispatchEvent(new Event('change',{bubbles:true})); document.querySelector('.selection-options input').click()`,
  );
  await evaluate(`document.querySelector('.tpl-grid .tpl-card .primary').click()`);
  await until(
    `!!document.querySelector('.paper-frame .resume-pages[data-ready=true]') && JSON.parse(localStorage.getItem('rf.resume.v1')).settings.careerPreset==='academic'`,
  );
  const savedAfter = await evaluate(`JSON.parse(localStorage.getItem('rf.resume.v1'))`);
  assert.deepEqual(savedAfter.personal, savedBefore.personal);
  assert.deepEqual(savedAfter.experience, savedBefore.experience);
  assert.equal(savedAfter.hidden.publications, false);
  // Explicit simple layout changes both preview and export without changing content.
  await evaluate(
    `[...document.querySelectorAll('.tabs button')].find(b=>b.innerText==='Design').click()`,
  );
  await until(`!!document.querySelector('#career-preset')`);
  await evaluate(`[...document.querySelectorAll('.design .switch input')][0].click()`);
  await until(
    `document.querySelector('.paper-frame .rs-page')?.dataset.layout==='classic' && JSON.parse(localStorage.getItem('rf.resume.v1')).settings.overrides.simpleLayout===true`,
  );
  assert.equal(
    await evaluate(`document.querySelector('#print-root .rs-page').dataset.layout`),
    'classic',
  );
  console.log('Template selection and career presets preserve personal details and achievements.');
  await send('Emulation.setDeviceMetricsOverride', {
    width: 390,
    height: 844,
    deviceScaleFactor: 1,
    mobile: true,
  });
  await evaluate(
    `history.pushState(null,'','/builder');window.dispatchEvent(new Event('rf:navigate'))`,
  );
  await until(`!!document.querySelector('.mobile-switch')`);
  await evaluate(`document.querySelector('.mobile-switch').click()`);
  await until(`document.querySelector('.paper-frame .rs-page')?.getBoundingClientRect().width>0`);
  assert.ok(
    await evaluate(`document.documentElement.scrollWidth <= innerWidth+1`),
    'Mobile horizontal overflow',
  );
  assert.deepEqual(errors, []);
  console.log('Comparisons and mobile preview passed.');

  console.log('Browser/PDF checks passed. Artifacts: ' + artifactDir);
} finally {
  ws?.close();
  browser.kill();
  await new Promise((r) => setTimeout(r, 300));
  fs.rmSync(profile, { recursive: true, force: true });
}
