type ContentEntryWithBody = {
  body?: string;
  data?: unknown;
};

const OPEN_TODO = /\bTODO\b/i;
const projectOverviewSources = import.meta.glob(
  '../../content/projects/**/overview.md',
  { query: '?raw', import: 'default', eager: true },
) as Record<string, string>;

export function hasOpenTodos(entry: ContentEntryWithBody): boolean {
  const data = entry.data as { slug?: unknown } | undefined;
  const slug = typeof data?.slug === 'string' ? data.slug : undefined;
  const rawSource = slug
    ? Object.entries(projectOverviewSources).find(([path]) =>
        path.replaceAll('\\', '/').endsWith(`/projects/${slug}/overview.md`),
      )?.[1]
    : undefined;

  return OPEN_TODO.test(rawSource ?? entry.body ?? '');
}

export function isPublishable(entry: ContentEntryWithBody): boolean {
  return !hasOpenTodos(entry);
}
