import test from 'node:test';
import assert from 'node:assert/strict';
import { contactHref, webHref } from '../src/lib/links.js';
import { applyCareerPreset, recommendTemplates } from '../src/data/presets.js';
import { normalizeResume, DEFAULT_ORDER } from '../src/data/schema.js';
import { TEMPLATES, resolveStyle, isDark } from '../src/templates/registry.js';
import { SAMPLES, sampleResume } from '../src/data/samples.js';

test('only safe clickable contact and portfolio destinations are accepted', () => {
  assert.equal(webHref('github.com/person/project'), 'https://github.com/person/project');
  assert.equal(webHref('https://example.com/p?q=hello'), 'https://example.com/p?q=hello');
  for (const value of [
    'javascript:alert(1)',
    'data:text/html,hello',
    '//evil.example',
    'https://user:password@example.com',
    'https://example.com\npath',
    'not a URL',
    'file:///tmp/a',
  ])
    assert.equal(webHref(value), null, value);
  assert.equal(contactHref('email', 'person@example.com'), 'mailto:person@example.com');
  assert.equal(contactHref('email', 'person@example.com?subject=oops'), null);
  assert.equal(contactHref('phone', '+91 12345 67890'), 'tel:+911234567890');
  assert.equal(contactHref('location', 'Mumbai, India'), null);
});

test('career structures preserve entries, titles and unrelated hidden sections', () => {
  const original = normalizeResume({
    personal: { fullName: 'Keep Me' },
    experience: [{ role: 'Engineer', bullets: 'Saved achievement' }],
    titles: { experience: 'Relevant Experience' },
    hidden: { interests: true },
  });
  const before = structuredClone(original);
  for (const key of ['student', 'professional', 'executive', 'academic']) {
    const next = applyCareerPreset(original, key);
    assert.deepEqual(next.experience, original.experience);
    assert.deepEqual(next.personal, original.personal);
    assert.deepEqual(next.titles, original.titles);
    assert.equal(next.hidden.interests, true);
    assert.equal(new Set(next.order).size, DEFAULT_ORDER.length);
  }
  assert.deepEqual(original, before);
  assert.equal(applyCareerPreset(original, 'student').order[0], 'education');
  assert.equal(applyCareerPreset(original, 'academic').hidden.publications, false);
});

test('old backups gain new sections without losing data or duplicating order', () => {
  const resume = normalizeResume({
    order: ['experience', 'experience', 'unknown'],
    skills: [{ name: 'SQL', group: 'Data' }],
  });
  assert.equal(resume.skills[0].group, 'Data');
  assert.deepEqual(resume.grants, []);
  assert.equal(resume.hidden.grants, true);
  assert.equal(new Set(resume.order).size, resume.order.length);
});

test('all 52 defaults are readable, with photos and subjective skill charts opt-in', () => {
  assert.equal(TEMPLATES.length, 52);
  for (const t of TEMPLATES) {
    assert.ok(t.fs >= 10.5, t.id);
    assert.equal(t.photo, false);
    assert.equal(t.skills, 'grouped');
    const simple = resolveStyle(t.id, { simpleLayout: true, showPhoto: true, skills: 'bars' });
    assert.equal(simple.layout, 'classic');
    assert.equal(simple.showPhoto, false);
    assert.equal(simple.skills, 'grouped');
  }
  assert.equal(isDark('#e25b45'), false, 'Coral needs dark text');
});

test('recommendations respond to customer choices and return three distinct designs', () => {
  const academic = recommendTemplates(TEMPLATES, { career: 'academic' });
  assert.equal(academic.length, 3);
  assert.ok(academic.every((t) => t.tags.includes('academic')));
  const visual = recommendTemplates(TEMPLATES, { career: 'professional', style: 'visual' });
  assert.ok(visual.some((t) => ['sidebar', 'banner', 'twocol'].includes(t.layout)));
  assert.equal(new Set(visual.map((t) => t.id)).size, 3);
});

test('audience examples have their intended content, and copies can be edited independently', () => {
  assert.ok(Object.keys(SAMPLES).length >= 9);
  assert.ok(sampleResume('academic').publications.length);
  assert.equal(sampleResume('academic').hidden.publications, false);
  assert.ok(sampleResume('executive').highlights.length);
  assert.ok(sampleResume('engineering').projects[0].link);
  const a = sampleResume('student');
  a.personal.fullName = 'Changed';
  assert.notEqual(sampleResume('student').personal.fullName, 'Changed');
});
