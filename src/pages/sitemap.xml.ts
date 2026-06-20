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
  const paths = [
    '/',
    '/about/',
    '/cv/',
    '/projects/',
    '/guides/',
    '/methods/',
    '/skills/',
    '/talks/',
    '/publications/',
    ...projectPaths,
    ...guides.map((entry) => `/guides/${entry.id}/`),
    ...methods.map((entry) => `/methods/${entry.data.slug ?? entry.id}/`),
    ...talks.map((entry) => `/talks/${entry.id}/`),
  ];
  const body = paths
    .map((path) => `  <url><loc>${escapeXml(new URL(path, base).toString())}</loc></url>`)
    .join('\n');

  return new Response(
    `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${body}\n</urlset>\n`,
    { headers: { 'Content-Type': 'application/xml; charset=utf-8' } },
  );
};
