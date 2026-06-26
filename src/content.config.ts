import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';
import taxonomySource from '../content/meta/taxonomy.md?raw';
const controlledTagSection = taxonomySource.split('## Controlled field values')[0] ?? '';
const controlledTags = new Set(
  [...controlledTagSection.matchAll(/`([a-z0-9-]+)`/g)].map((match) => match[1]),
);

if (controlledTags.size === 0) {
  throw new Error('No controlled tags were found in content/meta/taxonomy.md.');
}

const tagSchema = z.string().min(1).refine((tag) => controlledTags.has(tag), {
  message: 'Tag is not listed in content/meta/taxonomy.md.',
});

const artifactSchema = z.object({
  kind: z.string().min(1),
  label: z.string().min(1).optional(),
  doi: z.string().min(1).optional(),
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

const statusSchema = z.enum(['planned', 'in-progress', 'active', 'complete', 'paused']);
const tagsSchema = z.array(tagSchema);

const guideSchema = z.object({
    type: z.literal('guide').optional(),
    slug: z.string().min(1).optional(),
    title: z.string(),
    description: z.string().optional(),
    author: z.string().optional(),
    order: z.number().int().positive().optional(),
    last_updated: z.coerce.date().optional(),
    sources: z.array(z.string()).optional(),
    tags: tagsSchema.optional(),
    defensible_claims: z.array(z.string()).optional(),
    do_not_claim: z.array(z.string()).optional(),
    artifacts: z.array(artifactSchema).optional(),
  });

const guides = defineCollection({
  loader: glob({ pattern: '*.md', base: './content/guides' }),
  schema: guideSchema,
});

const guidesDe = defineCollection({
  loader: glob({ pattern: '*.md', base: './content/de/guides' }),
  schema: guideSchema,
});

const talkSchema = z.object({
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
    tags: tagsSchema.optional(),
    artifacts: z.array(artifactSchema).optional(),
  });

const talks = defineCollection({
  loader: glob({ pattern: '*.md', base: './content/talks' }),
  schema: talkSchema,
});

const talksDe = defineCollection({
  loader: glob({ pattern: '*.md', base: './content/de/talks' }),
  schema: talkSchema,
});

const projectOverviewSchema = z.object({
  type: z.literal('project'),
  order: z.number().int().positive().optional(),
  slug: z.string().min(1).optional(),
  title: z.string().min(1).optional(),
  subtitle: z.string().optional(),
  summary: z.string().min(1).optional(),
  seo_description: z.string().max(180).optional(),
  category: z.enum(['original-research', 'applied', 'reproduction']).optional(),
  status: statusSchema.optional(),
  context: z.string().optional(),
  role: z.string().optional(),
  submission_date: z.coerce.date().optional(),
  expected_submission_date: z.coerce.date().optional(),
  date_start: z.string().regex(/^\d{4}(?:-\d{2})?$/).nullable().optional(),
  date_end: z.string().regex(/^\d{4}-\d{2}$/).optional(),
  domains: tagsSchema.optional(),
  skills: tagsSchema.optional(),
  tags: tagsSchema.optional(),
  artifacts: z.array(artifactSchema).optional(),
  metrics: z.array(metricSchema).optional(),
  evidence: evidenceSchema.optional(),
  pitch: z.string().optional(),
  bullets: z.array(z.unknown()).optional(),
  eval_protocol: z.record(z.string(), z.unknown()).optional(),
  defensible_claims: z.array(z.string()).optional(),
  do_not_claim: z.array(z.string()).optional(),
});

const projectDetailSchema = z.object({
  type: z.literal('project-detail'),
  parent: z.string().min(1).optional(),
  part: z.enum(['method', 'results', 'reflection']).optional(),
  title: z.string().min(1).optional(),
  related: z.array(z.string()).optional(),
});

const projects = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './content/projects' }),
  schema: z.discriminatedUnion('type', [projectOverviewSchema, projectDetailSchema]),
});

const projectsDe = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './content/de/projects' }),
  schema: z.discriminatedUnion('type', [projectOverviewSchema, projectDetailSchema]),
});

const methodSchema = z.object({
    type: z.literal('method'),
    slug: z.string().min(1).optional(),
    title: z.string().min(1).optional(),
    tags: tagsSchema.optional(),
    related: z.array(z.string()).optional(),
  });

const methods = defineCollection({
  loader: glob({ pattern: '*.md', base: './content/methods' }),
  schema: methodSchema,
});

const methodsDe = defineCollection({
  loader: glob({ pattern: '*.md', base: './content/de/methods' }),
  schema: methodSchema,
});

const projectIdeas = defineCollection({
  loader: glob({ pattern: '*.md', base: './content/project-ideas' }),
  schema: z.object({
    type: z.literal('project-idea'),
    slug: z.string().min(1).optional(),
    title: z.string().min(1).optional(),
    status: statusSchema.optional(),
    module: z.string().optional(),
    summary: z.string().optional(),
    tags: tagsSchema.optional(),
  }),
});

const paperNotes = defineCollection({
  loader: glob({ pattern: '*.md', base: './content/paper-notes' }),
  schema: z.object({
    type: z.literal('paper-note'),
    slug: z.string().min(1).optional(),
    title: z.string().min(1).optional(),
    authors: z.string().optional(),
    venue: z.string().optional(),
    year: z.number().int().optional(),
    doi_or_url: z.string().optional(),
    tags: tagsSchema.optional(),
    relevance: z.array(z.string()).optional(),
  }),
});

const redteam = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './content/redteam' }),
  schema: z.discriminatedUnion('type', [
    z.object({
      type: z.literal('redteam-technique'),
      slug: z.string().min(1).optional(),
      title: z.string().min(1).optional(),
      status: statusSchema.optional(),
      tags: tagsSchema.optional(),
      owasp: z.array(z.string().regex(/^LLM(?:0[1-9]|10)$/)).optional(),
      atlas: z.array(z.string()).optional(),
      target_systems: z.array(z.enum(['chatbot', 'rag', 'agentic'])).optional(),
      objective_success_criteria: z.string().optional(),
      severity_default: z.string().optional(),
      probe_template: z.string().optional(),
      mitigations: z.array(z.string()).optional(),
      do_not_claim: z.array(z.string()).optional(),
    }),
    z.object({
      type: z.literal('redteam-doc'),
      slug: z.string().min(1).optional(),
      title: z.string().min(1).optional(),
      status: statusSchema.optional(),
      tags: tagsSchema.optional(),
    }),
  ]),
});

const meta = defineCollection({
  loader: glob({ pattern: '*.md', base: './content/meta' }),
  schema: z.object({
    type: z.literal('meta'),
    slug: z.string().min(1).optional(),
    title: z.string().min(1).optional(),
    audience: z.string().optional(),
  }),
});

const skillSchema = z.object({
    type: z.literal('skill'),
    slug: z.string().min(1).optional(),
    title: z.string().min(1).optional(),
    note: z.string().optional(),
  });

const skills = defineCollection({
  loader: glob({ pattern: '*.md', base: './content/skills' }),
  schema: skillSchema,
});

const skillsDe = defineCollection({
  loader: glob({ pattern: '*.md', base: './content/de/skills' }),
  schema: skillSchema,
});

const profile = defineCollection({
  loader: glob({ pattern: '*.{md,mdx}', base: './content/profile' }),
  schema: z.discriminatedUnion('type', [
    z.object({
      type: z.literal('meta'),
      slug: z.string().min(1).optional(),
      title: z.string().min(1).optional(),
      audience: z.string().optional(),
    }),
    z.object({
      type: z.literal('publication'),
      title: z.string().min(1).optional(),
      authors: z.union([z.string(), z.array(z.string())]).optional(),
      venue: z.string().optional(),
      series: z.string().optional(),
      year: z.number().int().optional(),
      doi: z.string().optional(),
      pages: z.string().optional(),
      contribution: z.string().optional(),
    }),
  ]),
});

export const collections = {
  guides,
  guidesDe,
  talks,
  talksDe,
  projects,
  projectsDe,
  methods,
  methodsDe,
  projectIdeas,
  paperNotes,
  redteam,
  meta,
  skills,
  skillsDe,
  profile,
};
