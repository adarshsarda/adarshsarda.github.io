import type { APIRoute } from 'astro';
import { isPublishable } from '../lib/contentVisibility';
import { getCollection } from 'astro:content';

export const prerender = true;

function escapeXml(value: string): string {
  return value
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&apos;');
}

export const GET: APIRoute = async ({ site }) => {
  const base = site ?? new URL('https://adarshsarda.github.io');
  const guides = await getCollection('guides');
  const talks = await getCollection('talks');
  const methods = await getCollection('methods');
  const projectPaths = (await getCollection('projects')).flatMap((entry) =>
    entry.data.type === 'project' && entry.data.slug && isPublishable(entry)
      ? [`/projects/${entry.data.slug}/`]
      : [],
  );
  const localizedProjectPaths = projectPaths.map((path) => `/de${path}`);
  const guidePaths = guides.map((entry) => `/guides/${entry.id}/`);
  const methodPaths = methods.map((entry) => `/methods/${entry.data.slug ?? entry.id}/`);
  const talkPaths = talks.map((entry) => `/talks/${entry.id}/`);
  const paths = [
    '/',
    '/de/',
    '/about/',
    '/de/about/',
    '/cv/',
    '/de/cv/',
    '/projects/',
    '/de/projects/',
    '/guides/',
    '/de/guides/',
    '/methods/',
    '/de/methods/',
    '/skills/',
    '/de/skills/',
    '/talks/',
    '/de/talks/',
    '/publications/',
    '/de/publications/',
    ...projectPaths,
    ...localizedProjectPaths,
    ...guidePaths,
    ...guidePaths.map((path) => `/de${path}`),
    ...methodPaths,
    ...methodPaths.map((path) => `/de${path}`),
    ...talkPaths,
    ...talkPaths.map((path) => `/de${path}`),
  ];
  const body = paths
    .map((path) => `  <url><loc>${escapeXml(new URL(path, base).toString())}</loc></url>`)
    .join('\n');

  return new Response(
    `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${body}\n</urlset>\n`,
    { headers: { 'Content-Type': 'application/xml; charset=utf-8' } },
  );
};
