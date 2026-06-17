import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

// Both collections READ THE EXISTING FILES IN PLACE under ./content via the
// glob loader. Nothing is moved or copied. Schemas only declare the fields we
// actually render; any other frontmatter key (artifacts, bullets, metrics,
// empty `date_start:` TODOs, etc.) is left untouched and ignored by Zod.

const guides = defineCollection({
  loader: glob({ pattern: '*.md', base: './content/guides' }),
  schema: z.object({
    title: z.string(),
    description: z.string().optional(),
    author: z.string().optional(),
    order: z.number().int().positive().optional(),
    last_updated: z.coerce.date().optional(),
    tags: z.array(z.string()).optional(),
  }),
});

// One collection holds two shapes that share a directory:
//   type: project        -> the landing/overview file (rich metadata)
//   type: project-detail -> method / results / reflection sections
// `title` is the only field present in every file, so it's the only required one.
const projects = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './content/projects' }),
  schema: z.object({
    title: z.string(),
    order: z.number().int().positive().optional(),
    type: z.string().optional(),
    slug: z.string().optional(),
    parent: z.string().optional(),
    part: z.string().optional(),
    subtitle: z.string().optional(),
    summary: z.string().optional(),
    description: z.string().optional(),
    category: z.string().optional(),
    status: z.string().optional(),
    context: z.string().optional(),
    role: z.string().optional(),
    domains: z.array(z.string()).optional(),
    skills: z.array(z.string()).optional(),
    tags: z.array(z.string()).optional(),
    artifacts: z.array(z.object({
      kind: z.string(),
      label: z.string().nullish(),
      path: z.string().nullish(),
      url: z.string().nullish(),
    })).optional(),
    metrics: z.array(z.object({
      name: z.string(),
      value: z.string(),
      denominator: z.string().optional(),
      ci_95: z.string().optional(),
      definition: z.string().optional(),
      scope: z.string().optional(),
    })).optional(),
  }),
});

export const collections = { guides, projects };
