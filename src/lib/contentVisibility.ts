import type { CollectionEntry } from 'astro:content';

type ContentEntryWithBody = {
  body?: string;
  data?: unknown;
  collection?: string;
};

type SiteProjectEntry = CollectionEntry<'projects'> | CollectionEntry<'projectsDe'>;

const OPEN_TODO = /\bTODO\b/i;
const projectOverviewSources = import.meta.glob(
  [
    '../../content/projects/**/overview.md',
    '../../content/de/projects/**/overview.md',
  ],
  { query: '?raw', import: 'default', eager: true },
) as Record<string, string>;

export function hasOpenTodos(entry: ContentEntryWithBody): boolean {
  const data = entry.data as { slug?: unknown } | undefined;
  const slug = typeof data?.slug === 'string' ? data.slug : undefined;
  const sourceRoot = entry.collection === 'projectsDe'
    ? '/content/de/projects/'
    : entry.collection === 'projects'
      ? '/content/projects/'
      : undefined;
  const rawSource = slug && sourceRoot
    ? Object.entries(projectOverviewSources).find(([path]) =>
        path.replaceAll('\\', '/').endsWith(`${sourceRoot}${slug}/overview.md`),
      )?.[1]
    : undefined;

  return OPEN_TODO.test(rawSource ?? entry.body ?? '');
}

export function isPublishable(entry: ContentEntryWithBody): boolean {
  return !hasOpenTodos(entry);
}

/**
 * The public project projection accepts only the two committed site collections.
 * Private project ideas have a different schema and cannot be passed here.
 */
export function isPublicProject(entry: SiteProjectEntry): boolean {
  return entry.data.type === 'project'
    && entry.data.projection.visibility === 'public'
    && isPublishable(entry);
}

export function isFeaturedProject(entry: SiteProjectEntry): boolean {
  return isPublicProject(entry)
    && entry.data.type === 'project'
    && entry.data.projection.featured;
}
