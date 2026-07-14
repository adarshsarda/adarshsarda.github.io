import {
  existsSync,
  readdirSync,
  readFileSync,
  statSync,
} from 'node:fs';
import { extname, join, relative, resolve, sep } from 'node:path';
import { spawnSync } from 'node:child_process';
import { assertBoundary } from './check-boundary.mjs';

const ROOT = resolve('.');
const CONTENT = join(ROOT, 'content');
const KB_MAP = join(ROOT, 'private', 'KB-MAP.md');
const DIST = join(ROOT, 'dist');
const PAPER_DIR = join(ROOT, 'private', 'raw', 'papers');
const REDTEAMS_WIKI = join(ROOT, 'private', 'wiki', 'redteams-ai');
const STRICT = process.argv.includes('--strict');
const errors = [];
const warnings = [];

function walk(directory, predicate = () => true) {
  if (!existsSync(directory)) return [];
  return readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
    const path = join(directory, entry.name);
    return entry.isDirectory() ? walk(path, predicate) : (predicate(path) ? [path] : []);
  });
}

function posix(path) {
  return path.split(sep).join('/');
}

function splitFrontmatter(raw) {
  const match = raw.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n?/);
  return match
    ? { block: match[1], body: raw.slice(match[0].length) }
    : { block: '', body: raw };
}

function scalar(block, key) {
  const match = block.match(new RegExp(`^${key}:\\s*(.*)$`, 'm'));
  if (!match) return '';
  return match[1].trim().replace(/^['"]|['"]$/g, '');
}

function inlineArray(block, key) {
  const match = block.match(new RegExp(`^${key}:\\s*\\[([^\\]]*)\\]`, 'm'));
  if (!match) return [];
  return match[1]
    .split(',')
    .map((value) => value.trim().replace(/^['"]|['"]$/g, ''))
    .filter(Boolean);
}

function internalReferences(block, body) {
  const refs = new Set();
  for (const key of ['depends_on', 'related', 'relevance']) {
    for (const value of inlineArray(block, key)) refs.add(value);
  }
  for (const match of body.matchAll(/\[\[([^\]]+)\]\]/g)) refs.add(match[1].trim());
  for (const match of body.matchAll(/\]\((\/?(?:de\/)?(?:projects|talks|guides|methods|skills|paper-notes|redteam|project-ideas|project-notes|literature)\/[a-z0-9./_-]+)\)/gi)) {
    refs.add(match[1].replace(/^\//, '').replace(/\/$/, '').replace(/\.md$/, ''));
  }
  for (const match of block.matchAll(/^\s*href:\s*['"]?(\/[^\s'"]+)/gm)) {
    const route = match[1].replace(/^\//, '').replace(/\/$/, '');
    if (/^(?:de\/)?(?:projects|talks|guides|methods|skills)\//.test(route)) refs.add(route);
  }
  return [...refs];
}

function noteKey(file) {
  return posix(relative(CONTENT, file))
    .replace(/\.mdx?$/, '')
    .replace(/\/overview$/, '');
}

function resolveReference(ref, keys) {
  const clean = ref
    .split('|')[0]
    .trim()
    .replace(/^content\//, '')
    .replace(/^\//, '')
    .replace(/\/$/, '')
    .replace(/\.mdx?$/, '')
    .replace(/\/overview$/, '');
  if (keys.has(clean)) return { status: 'ok', target: clean };

  const matches = [...keys].filter((key) => key === clean || key.endsWith(`/${clean}`));
  if (matches.length === 1) return { status: 'ok', target: matches[0] };
  if (matches.length > 1) return { status: 'ambiguous', matches };
  return { status: 'missing' };
}

function gitTrackedFiles() {
  const result = spawnSync('git', ['ls-files', '--cached'], { cwd: ROOT, encoding: 'utf8' });
  return result.status === 0
    ? new Set(result.stdout.split(/\r?\n/).filter(Boolean))
    : new Set();
}

try {
  assertBoundary();
} catch (error) {
  errors.push(error instanceof Error ? error.message : String(error));
}

const markdownFiles = walk(CONTENT, (file) => /\.mdx?$/.test(file));
const notes = markdownFiles.map((file) => {
  const raw = readFileSync(file, 'utf8');
  const { block, body } = splitFrontmatter(raw);
  return {
    file,
    rel: posix(relative(ROOT, file)),
    key: noteKey(file),
    raw,
    block,
    body,
    type: scalar(block, 'type'),
    status: scalar(block, 'status'),
    slug: scalar(block, 'slug'),
    project: scalar(block, 'project'),
    title: scalar(block, 'title'),
    tags: [
      ...inlineArray(block, 'tags'),
      ...inlineArray(block, 'domains'),
      ...inlineArray(block, 'skills'),
    ],
  };
});

const keys = new Set();
for (const note of notes) {
  if (keys.has(note.key)) errors.push(`Duplicate canonical note key: ${note.key}`);
  keys.add(note.key);
}

const projectNoteSlugs = new Map();
for (const note of notes.filter((item) => item.type === 'project-note')) {
  const pathProject = note.key.split('/')[1] || '';
  if (note.project !== pathProject) {
    errors.push(`${note.rel}: project "${note.project}" does not match folder "${pathProject}"`);
  }
  if (!keys.has(`project-ideas/${note.project}`)) {
    errors.push(`${note.rel}: project idea "project-ideas/${note.project}" does not exist`);
  }
  const existing = projectNoteSlugs.get(note.slug);
  if (existing) errors.push(`Duplicate project-note slug "${note.slug}": ${existing}, ${note.rel}`);
  else projectNoteSlugs.set(note.slug, note.rel);
}

const taxonomyFile = join(CONTENT, 'meta', 'taxonomy.md');
if (existsSync(taxonomyFile)) {
  const taxonomy = readFileSync(taxonomyFile, 'utf8').split('## Controlled field values')[0] ?? '';
  const allowed = new Set([...taxonomy.matchAll(/`([a-z0-9-]+)`/g)].map((match) => match[1]));
  for (const note of notes) {
    for (const tag of note.tags) {
      if (!allowed.has(tag)) errors.push(`${note.rel}: unregistered tag "${tag}"`);
    }
  }
}

let resolvedLinks = 0;
let unresolvedLinks = 0;
let ambiguousLinks = 0;
for (const note of notes) {
  for (const ref of internalReferences(note.block, note.body)) {
    const result = resolveReference(ref, keys);
    if (result.status === 'ok') resolvedLinks++;
    else if (result.status === 'ambiguous') {
      ambiguousLinks++;
      warnings.push(`${note.rel}: ambiguous reference [[${ref}]] -> ${result.matches.join(', ')}`);
    } else {
      unresolvedLinks++;
      warnings.push(`${note.rel}: unresolved internal reference "${ref}"`);
    }
  }

  const todoCount = (note.raw.match(/\bTODO\b/g) || []).length;
  if (todoCount > 0) {
    const message = `${note.rel}: ${todoCount} TODO marker${todoCount === 1 ? '' : 's'}`;
    if (['active', 'complete', 'frozen'].includes(note.status)) errors.push(message);
    else warnings.push(message);
  }
}

for (const base of [join(CONTENT, 'projects'), join(CONTENT, 'de', 'projects')]) {
  if (!existsSync(base)) continue;
  for (const entry of readdirSync(base, { withFileTypes: true }).filter((item) => item.isDirectory())) {
    const files = walk(join(base, entry.name), (file) => /\.mdx?$/.test(file));
    const overviews = files.filter((file) => scalar(splitFrontmatter(readFileSync(file, 'utf8')).block, 'type') === 'project');
    if (overviews.length !== 1) {
      errors.push(`${posix(relative(ROOT, join(base, entry.name)))}: expected exactly one project overview, found ${overviews.length}`);
    }
  }
}

const tracked = gitTrackedFiles();
let privateReferenceLeaks = 0;
let unlocalizedGermanLinks = 0;
for (const note of notes) {
  if (!tracked.has(note.rel)) continue;
  const matches = note.block.match(/(?:project-ideas|project-notes|redteam|literature)\/[a-z0-9/_-]+/g) || [];
  privateReferenceLeaks += matches.length;
  if (note.rel.startsWith('content/de/')) {
    unlocalizedGermanLinks += (
      note.raw.match(/(?:href:\s*["']|\]\()\/(?:talks|guides|methods|projects|skills|publications)\//g)
      || []
    ).length;
  }
}
if (privateReferenceLeaks > 0) {
  warnings.push(`${privateReferenceLeaks} private note reference(s) appear in publicly tracked Markdown.`);
}
if (unlocalizedGermanLinks > 0) {
  errors.push(`${unlocalizedGermanLinks} German content link(s) point to English routes.`);
}

if (existsSync(KB_MAP)) {
  const map = readFileSync(KB_MAP, 'utf8');
  const badPrefixCount = (map.match(/\]\(\.\.\/\.\.\/content\//g) || []).length;
  if (badPrefixCount > 0) errors.push(`private/KB-MAP.md contains ${badPrefixCount} broken ../../content links.`);

  for (const match of map.matchAll(/\]\((\.\.\/content\/[^)]+\.md)\)/g)) {
    const target = resolve(join(ROOT, 'private'), match[1]);
    if (!existsSync(target)) errors.push(`private/KB-MAP.md: missing target ${match[1]}`);
  }

  const newestContent = Math.max(...markdownFiles.map((file) => statSync(file).mtimeMs));
  if (statSync(KB_MAP).mtimeMs < newestContent) errors.push('private/KB-MAP.md is older than authored content; rebuild it.');
} else if (existsSync(join(ROOT, 'private'))) {
  errors.push('private/KB-MAP.md is missing.');
}

const paperManifestFile = join(PAPER_DIR, 'papers.json');
if (existsSync(paperManifestFile)) {
  try {
    const paperManifest = JSON.parse(readFileSync(paperManifestFile, 'utf8'));
    const entries = Array.isArray(paperManifest.manifest) ? paperManifest.manifest : [];
    const recordedFiles = new Set();
    for (const entry of entries) {
      const filename = entry.file || (entry.id ? `${entry.id}.pdf` : '');
      if (filename) recordedFiles.add(filename);
      if (entry.error) errors.push(`Paper manifest error for ${entry.id || filename || 'unknown'}: ${entry.error}`);
      if (filename && existsSync(join(PAPER_DIR, filename)) && entry.bytes) {
        const actualBytes = statSync(join(PAPER_DIR, filename)).size;
        if (actualBytes !== entry.bytes) errors.push(`Paper manifest byte mismatch: ${filename}`);
      }
    }
    const pdfFiles = readdirSync(PAPER_DIR).filter((file) => file.endsWith('.pdf'));
    for (const file of pdfFiles) {
      if (!recordedFiles.has(file)) errors.push(`Raw paper is absent from papers.json: ${file}`);
    }
    for (const file of recordedFiles) {
      if (!existsSync(join(PAPER_DIR, file))) errors.push(`papers.json references a missing PDF: ${file}`);
    }
  } catch (error) {
    errors.push(`Unable to validate private/raw/papers/papers.json: ${error}`);
  }
}

const crawlerUrlsFile = join(REDTEAMS_WIKI, 'urls.json');
const crawlerManifestFile = join(REDTEAMS_WIKI, 'manifest.json');
if (existsSync(crawlerUrlsFile) && existsSync(crawlerManifestFile)) {
  try {
    const urls = JSON.parse(readFileSync(crawlerUrlsFile, 'utf8'));
    const manifest = JSON.parse(readFileSync(crawlerManifestFile, 'utf8'));
    const manifestUrls = new Set(manifest.map((entry) => entry.url).filter(Boolean));
    const missingManifestUrls = urls.filter((url) => !manifestUrls.has(url));
    if (missingManifestUrls.length > 0) {
      errors.push(`redteams.ai manifest is missing ${missingManifestUrls.length} URL record(s).`);
    }
    const manifestErrors = manifest.filter((entry) => entry.error);
    if (manifestErrors.length > 0) warnings.push(`redteams.ai manifest records ${manifestErrors.length} crawl error(s).`);
  } catch (error) {
    errors.push(`Unable to validate redteams.ai crawler metadata: ${error}`);
  }
}

const badClusterFiles = walk(join(REDTEAMS_WIKI, 'index'), (file) => file.endsWith('.md.md'));
if (badClusterFiles.length > 0) {
  errors.push(`redteams.ai index contains ${badClusterFiles.length} stale *.md.md file(s).`);
}

if (existsSync(DIST)) {
  // Project and positioning titles are distinctive leak fingerprints. Technique
  // titles such as "Prompt Injection" are too generic and create false positives.
  const privateNotes = notes.filter((note) => (
    note.rel.startsWith('content/project-ideas/')
    || note.rel.startsWith('content/project-notes/')
    || note.rel === 'content/profile/positioning.md'
  ));
  const fingerprints = privateNotes.map((note) => note.title).filter((title) => title.length >= 12);
  const html = walk(DIST, (file) => extname(file) === '.html')
    .map((file) => readFileSync(file, 'utf8'))
    .join('\n');
  for (const title of fingerprints) {
    if (html.includes(title)) errors.push(`dist/ contains private title: "${title}"`);
  }
}

if (warnings.length > 0) {
  console.warn(`\nWarnings (${warnings.length}):`);
  for (const warning of warnings.slice(0, 30)) console.warn(`  - ${warning}`);
  if (warnings.length > 30) console.warn(`  - ...and ${warnings.length - 30} more`);
}

if (errors.length > 0 || (STRICT && warnings.length > 0)) {
  if (errors.length > 0) {
    console.error(`\nErrors (${errors.length}):`);
    for (const error of errors) console.error(`  - ${error}`);
  }
  if (STRICT && warnings.length > 0 && errors.length === 0) {
    console.error('\nStrict mode treats warnings as errors.');
  }
  process.exit(1);
}

console.log(
  `KB doctor OK: ${notes.length} authored notes; ${resolvedLinks} resolved, `
  + `${unresolvedLinks} unresolved, ${ambiguousLinks} ambiguous internal references; `
  + `${warnings.length} warning${warnings.length === 1 ? '' : 's'}.`,
);
