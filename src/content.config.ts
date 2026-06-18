import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const artifactSchema = z.object({
  kind: z.string().min(1),
  label: z.string().min(1),
  path: z.string().startsWith('/').optional(),
  url: z.string().url().optional(),
}).refine((artifact) => Boolean(artifact.path || artifact.url), {
  message: 'Each artifact needs either a root-relative path or an absolute URL.',
});

const internalLinkSchema = z.object({
  label: z.string().min(1),
  href: z.string().startsWith('/'),
  note: z.string().optional(),
});

const metricSchema = z.object({
  name: z.string().min(1),
  value: z.string().min(1),
  denominator: z.string().optional(),
  ci_95: z.string().optional(),
  definition: z.string().optional(),
  scope: z.string().optional(),
});

const evidenceSchema = z.object({
  label: z.string().min(1),
  title: z.string().min(1),
  conditions: z.array(z.object({
    code: z.string().min(1),
    first: z.string().min(1),
    relation: z.string().min(1),
    second: z.string().optional(),
    outcome: z.string().min(1),
    trigger: z.boolean().default(false),
  })).min(2),
  metric_names: z.array(z.string().min(1)).min(1),
  credibility: z.object({
    label: z.string().min(1),
    title: z.string().min(1),
    body: z.string().min(1),
  }),
});

const guides = defineCollection({
  loader: glob({ pattern: '*.md', base: './content/guides' }),
  schema: z.object({
    title: z.string(),
    description: z.string().optional(),
    author: z.string().optional(),
    order: z.number().int().positive().optional(),
    last_updated: z.coerce.date().optional(),
    tags: z.array(z.string()).optional(),
    artifacts: z.array(artifactSchema).optional(),
  }),
});

const talks = defineCollection({
  loader: glob({ pattern: '*.md', base: './content/talks' }),
  schema: z.object({
    title: z.string().min(1),
    description: z.string().min(1).max(180),
    speaker: z.string().min(1),
    event: z.string().min(1),
    format: z.enum(['Paper presentation', 'Paper explainer', 'Original research talk', 'Workshop']),
    track: z.enum(['Backdoors', 'Agent security', 'RAG and prompt injection', 'AI supply chain']).optional(),
    year: z.number().int().min(2000).max(2100),
    source: z.string().min(1),
    difficulty: z.enum(['Beginner', 'Intermediate', 'Advanced']),
    takeaway: z.string().min(1).max(220),
    why_added: z.string().min(1),
    why_matters: z.string().min(1),
    what_i_learned: z.string().min(1),
    core_ideas: z.array(z.string().min(1)).min(4).max(6),
    threat_model: z.object({
      system: z.string().min(1),
      attacker: z.string().min(1),
      capability: z.string().min(1),
      failure: z.string().min(1),
      deployment: z.string().min(1),
    }),
    connections: z.array(internalLinkSchema).min(2).max(4),
    open_questions: z.array(z.string().min(1)).min(2).max(4),
    last_updated: z.coerce.date(),
    order: z.number().int().positive().optional(),
    paper_title: z.string().optional(),
    paper_authors: z.array(z.string()).optional(),
    paper_venue: z.string().optional(),
    paper_url: z.string().url().optional(),
    tags: z.array(z.string()).optional(),
    artifacts: z.array(artifactSchema).optional(),
  }),
});

const projectOverviewSchema = z.object({
  type: z.literal('project'),
  order: z.number().int().positive(),
  slug: z.string().min(1),
  title: z.string().min(1),
  subtitle: z.string().optional(),
  summary: z.string().min(1),
  seo_description: z.string().max(180),
  category: z.enum(['original-research', 'case-study', 'engineering']),
  status: z.enum(['planned', 'in-progress', 'complete']),
  context: z.string().optional(),
  role: z.string().optional(),
  expected_submission_date: z.coerce.date().optional(),
  date_end: z.string().regex(/^\d{4}-\d{2}$/).optional(),
  domains: z.array(z.string()).optional(),
  skills: z.array(z.string()).optional(),
  tags: z.array(z.string()).optional(),
  artifacts: z.array(artifactSchema).optional(),
  metrics: z.array(metricSchema).optional(),
  evidence: evidenceSchema.optional(),
});

const projectDetailSchema = z.object({
  type: z.literal('project-detail'),
  parent: z.string().min(1),
  part: z.enum(['method', 'results', 'reflection']),
  title: z.string().min(1),
  related: z.array(z.string()).optional(),
});

const projects = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './content/projects' }),
  schema: z.discriminatedUnion('type', [projectOverviewSchema, projectDetailSchema]),
});

export const collections = { guides, talks, projects };
