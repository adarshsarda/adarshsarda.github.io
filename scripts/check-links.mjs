import { existsSync, readdirSync, readFileSync } from 'node:fs';
import { extname, join, relative, resolve } from 'node:path';

const dist = resolve('dist');

if (!existsSync(dist)) {
  console.error('dist/ does not exist. Run the build before checking links.');
  process.exit(1);
}

function walk(directory) {
  return readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
    const path = join(directory, entry.name);
    return entry.isDirectory() ? walk(path) : [path];
  });
}

function targetExists(pathname) {
  const cleanPath = decodeURIComponent(pathname).replace(/^\/+/, '');
  const target = join(dist, cleanPath);
  if (existsSync(target)) return true;
  if (existsSync(join(target, 'index.html'))) return true;
  return !extname(target) && existsSync(`${target}.html`);
}

const errors = [];
const htmlFiles = walk(dist).filter((file) => file.endsWith('.html'));

for (const file of htmlFiles) {
  const label = relative(dist, file).replaceAll('\\', '/');
  const html = readFileSync(file, 'utf8');
  const ids = [...html.matchAll(/\sid="([^"]+)"/g)].map((match) => match[1]);
  const duplicateIds = ids.filter((id, index) => ids.indexOf(id) !== index);
  const idSet = new Set(ids);
  const h1Count = [...html.matchAll(/<h1(?:\s|>)/g)].length;
  const isRedirect = html.includes('http-equiv="refresh"');

  if (duplicateIds.length > 0) {
    errors.push(`${label}: duplicate IDs: ${[...new Set(duplicateIds)].join(', ')}`);
  }
  if (!isRedirect && h1Count !== 1) {
    errors.push(`${label}: expected exactly one H1, found ${h1Count}`);
  }

  const requiredMetadata = isRedirect
    ? ['<link rel="canonical"']
    : [
        '<link rel="canonical"',
        '<meta property="og:title"',
        '<meta name="twitter:card"',
      ];
  for (const required of requiredMetadata) {
    if (!html.includes(required)) errors.push(`${label}: missing ${required}`);
  }

  for (const match of html.matchAll(/(?:href|src)="([^"]+)"/g)) {
    const raw = match[1];
    if (!raw || /^(?:https?:|mailto:|tel:|data:)/.test(raw)) continue;

    const [pathname, fragment] = raw.split('#');
    if (pathname.startsWith('/') && pathname !== '/' && !targetExists(pathname.split('?')[0])) {
      errors.push(`${label}: missing target ${raw}`);
    }
    if (!pathname && fragment && !idSet.has(fragment)) {
      errors.push(`${label}: missing fragment #${fragment}`);
    }
  }
}

if (errors.length > 0) {
  console.error(errors.join('\n'));
  process.exit(1);
}

console.log(`Validated ${htmlFiles.length} generated HTML pages.`);
