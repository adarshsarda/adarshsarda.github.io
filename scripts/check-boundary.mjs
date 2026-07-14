import { spawnSync } from 'node:child_process';
import { resolve } from 'node:path';
import { pathToFileURL } from 'node:url';

// These paths belong to the private overlay, never the public portfolio repo.
// Keep this list aligned with .gitignore and AGENTS.md.
export const FORBIDDEN_PUBLIC_PATHS = [
  'private/',
  'content/redteam/',
  'content/project-ideas/',
  'content/project-notes/',
  'content/literature/',
  'content/profile/positioning.md',
  'AGENTS.md',
  '.claude/',
  '.obsidian/',
];

export function trackedForbiddenPaths() {
  const result = spawnSync('git', ['ls-files', '--cached'], {
    cwd: process.cwd(),
    encoding: 'utf8',
  });

  if (result.status !== 0) {
    throw new Error(`Unable to inspect the public Git index: ${result.stderr.trim()}`);
  }

  return result.stdout
    .split(/\r?\n/)
    .filter(Boolean)
    .filter((file) => FORBIDDEN_PUBLIC_PATHS.some((entry) => (
      entry.endsWith('/') ? file.startsWith(entry) : file === entry
    )));
}

export function assertBoundary() {
  const violations = trackedForbiddenPaths();
  if (violations.length > 0) {
    throw new Error(
      `Private paths are tracked by the public repository:\n${violations.map((p) => `  - ${p}`).join('\n')}`,
    );
  }
  return FORBIDDEN_PUBLIC_PATHS.length;
}

if (process.argv[1] && import.meta.url === pathToFileURL(resolve(process.argv[1])).href) {
  try {
    const protectedCount = assertBoundary();
    console.log(`Public/private boundary OK (${protectedCount} protected path rules).`);
  } catch (error) {
    console.error(error instanceof Error ? error.message : String(error));
    process.exit(1);
  }
}
