// @ts-check
import { defineConfig } from 'astro/config';
import rehypeSlug from 'rehype-slug';
import rehypeAutolinkHeadings from 'rehype-autolink-headings';

// User/org GitHub Pages site: served at the domain root.
export default defineConfig({
  site: 'https://adarshsarda.github.io',
  base: '/',
  markdown: {
    // Dark code blocks read well against the light page.
    shikiConfig: { theme: 'github-dark', wrap: false },
    rehypePlugins: [
      // Give every heading a stable id, then make the heading itself a
      // self-link so deep links / a TOC can target it (anchored headings).
      rehypeSlug,
      [rehypeAutolinkHeadings, { behavior: 'wrap', properties: { className: ['heading-anchor'] } }],
    ],
  },
});
