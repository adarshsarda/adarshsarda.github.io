# Adarsh Sarda: portfolio

Static Astro portfolio for research projects, field notes, publications, and professional background.

## Local development

Requires Node.js 20 or newer.

```bash
npm ci
npm run dev
```

The development server prints the local URL after startup.

## Validation

```bash
npm run check
```

This command:

1. syncs Astro content types and runs TypeScript;
2. builds every static route;
3. checks generated internal links, fragments, duplicate IDs, heading hierarchy, and core social metadata.

Pull requests run the same validation in GitHub Actions. Deployments to GitHub Pages occur from `main` after the checks pass.

## Content

- `content/projects/` contains project overview and detail Markdown.
- `content/guides/` contains long-form field notes.
- `content/methods/` contains public reusable methods and templates.
- `content/talks/` contains presentations and attributed paper explainers.
- `content/paper-notes/` contains internal, unrouted notes pending source verification.
- `content/project-ideas/` contains the internal, unrouted project roadmap.
- `content/redteam/` contains internal, unrouted red-team techniques and supporting documents.
- `content/meta/` contains internal schema and taxonomy documents.
- `src/content.config.ts` defines and validates frontmatter.
- `public/` contains downloadable reports, slides, images, and other static assets.

Each project directory needs exactly one `type: project` overview. Detail files use `type: project-detail` and one of the supported parts: `method`, `results`, or `reflection`.

## Styling

Shared layout, article, index, and responsive styles live in `src/styles/global.css`. Profile/publication styles live in `src/styles/profile.css`; specialized component styles remain scoped to their Astro component.
