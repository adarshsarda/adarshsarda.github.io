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
const projectIdeaModuleSchema = z.enum(['deep-vision', 'ai-project', 'self-study', 'portfolio']);
const projectIdeaDecisionSchema = z.enum(['candidate', 'selected', 'parked', 'superseded']);
const projectIdeaRoleSchema = z.enum(['flagship', 'umbrella', 'component', 'rehearsal', 'stretch']);
const projectIdeaPhaseSchema = z.enum([
  'discovery',
  'kb-building',
  'feasibility',
  'implementation',
  'evaluation',
  'writing',
  'maintenance',
  'parked',
]);
const projectNoteKindSchema = z.enum([
  'charter',
  'literature',
  'dataset',
  'model',
  'system-card',
  'decision',
  'threat-model',
  'protocol',
  'experiment',
]);
const projectNoteStatusSchema = z.enum(['draft', 'reviewed', 'frozen']);

// Framework identifiers are edition-qualified on purpose. A bare `LLM08` or
// `AML.T0051` is easy to misread after an upstream taxonomy changes; the key
// records the edition while the value remains the framework's native ID.
const redteamFrameworkRefsSchema = z.object({
  owasp_llm_2025: z.array(z.string().regex(/^LLM(?:0[1-9]|10)$/)),
  owasp_agentic_2026: z.array(z.string().regex(/^ASI(?:0[1-9]|10)$/)),
  owasp_aisvs_1_0: z.array(z.string().regex(/^v1\.0-C(?:[1-9]|1[0-2])\.\d+\.\d+$/)),
  owasp_aitg_v1: z.array(z.string().regex(/^AITG-(?:APP|MOD|INF|DAT)-\d{2}$/)),
  mitre_atlas: z.array(z.string().regex(/^AML\.(?:TA|T|M|CS)\d{4}(?:\.\d{3})?$/)),
}).strict();

const projectProjectionSchema = z.object({
  visibility: z.enum(['hidden', 'public']),
  featured: z.boolean().default(false),
}).superRefine((projection, ctx) => {
  if (projection.featured && projection.visibility !== 'public') {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      path: ['featured'],
      message: 'A featured project must have public site visibility.',
    });
  }
});

const guideSchema = z.object({
    type: z.literal('guide'),
    slug: z.string().min(1),
    title: z.string(),
    description: z.string().min(1),
    author: z.string().optional(),
    order: z.number().int().positive().optional(),
    last_updated: z.coerce.date().optional(),
    sources: z.array(z.string().url()).min(1),
    tags: tagsSchema.min(1),
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
    type: z.literal('talk'),
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
  projection: projectProjectionSchema,
  order: z.number().int().positive().optional(),
  slug: z.string().min(1),
  title: z.string().min(1),
  subtitle: z.string().min(1),
  summary: z.string().min(1),
  seo_description: z.string().max(180).optional(),
  category: z.enum(['original-research', 'applied', 'reproduction']),
  status: statusSchema,
  context: z.string().min(1),
  role: z.string().min(1),
  submission_date: z.coerce.date().optional(),
  expected_submission_date: z.coerce.date().optional(),
  date_start: z.string().regex(/^\d{4}(?:-\d{2})?$/).nullable().optional(),
  date_end: z.string().regex(/^\d{4}-\d{2}$/).optional(),
  domains: tagsSchema.min(1),
  skills: tagsSchema.min(1),
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
  parent: z.string().min(1),
  part: z.enum(['method', 'results', 'reflection']),
  title: z.string().min(1),
  related: z.array(z.string().min(1)).min(1),
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
    slug: z.string().min(1),
    title: z.string().min(1),
    description: z.string().min(1).max(200),
    tags: tagsSchema.min(1),
    related: z.array(z.string().min(1)),
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
    slug: z.string().min(1),
    title: z.string().min(1),
    status: statusSchema,
    module: projectIdeaModuleSchema,
    decision: projectIdeaDecisionSchema,
    idea_role: projectIdeaRoleSchema,
    phase: projectIdeaPhaseSchema,
    next_milestone: z.string().min(1),
    depends_on: z.array(z.string().min(1)).default([]),
    deliverables: z.array(z.string().min(1)).optional(),
    exit_criteria: z.array(z.string().min(1)).optional(),
    summary: z.string().min(1),
    tags: tagsSchema.min(1),
  }),
});

const projectNotes = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './content/project-notes' }),
  schema: z.object({
    type: z.literal('project-note'),
    slug: z.string().min(1),
    project: z.string().min(1),
    title: z.string().min(1),
    kind: projectNoteKindSchema,
    status: projectNoteStatusSchema,
    summary: z.string().min(1),
    sources: z.array(z.string().min(1)).default([]),
    related: z.array(z.string().min(1)).default([]),
    tags: tagsSchema.min(1),
    reviewed_on: z.coerce.date(),
    defensible_claims: z.array(z.string().min(1)).optional(),
    do_not_claim: z.array(z.string().min(1)).optional(),
  }).superRefine((note, ctx) => {
    if (['literature', 'dataset', 'model', 'system-card'].includes(note.kind) && note.sources.length === 0) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ['sources'],
        message: `${note.kind} project notes require at least one provenance source.`,
      });
    }
  }),
});

const paperNotes = defineCollection({
  loader: glob({ pattern: '*.md', base: './content/paper-notes' }),
  schema: z.object({
    type: z.literal('paper-note'),
    slug: z.string().min(1),
    title: z.string().min(1),
    authors: z.string().min(1),
    venue: z.string().min(1),
    year: z.number().int().min(1900).max(2100),
    doi_or_url: z.string().min(1),
    tags: tagsSchema.min(1),
    relevance: z.array(z.string().min(1)).min(1),
  }),
});

const redteam = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './content/redteam' }),
  schema: z.discriminatedUnion('type', [
    z.object({
      type: z.literal('redteam-technique'),
      slug: z.string().min(1),
      title: z.string().min(1),
      status: statusSchema,
      tags: tagsSchema,
      framework_refs: redteamFrameworkRefsSchema,
      target_systems: z.array(z.enum(['chatbot', 'rag', 'agentic', 'cyber-physical'])),
      related: z.array(z.string().min(1)).optional(),
      objective_success_criteria: z.string().min(1),
      severity_default: z.string().min(1),
      probe_template: z.string().min(1),
      mitigations: z.array(z.string()),
      do_not_claim: z.array(z.string()),
    }),
    z.object({
      type: z.literal('redteam-doc'),
      slug: z.string().min(1),
      title: z.string().min(1),
      status: statusSchema,
      tags: tagsSchema,
    }),
    z.object({
      type: z.literal('redteam-framework'),
      slug: z.string().min(1),
      title: z.string().min(1),
      status: statusSchema,
      framework_id: z.enum([
        'owasp_llm_2025',
        'owasp_agentic_2026',
        'owasp_aisvs_1_0',
        'owasp_aitg_v1',
        'owasp_ai_cheat_sheets',
        'owasp_crosswalk',
      ]),
      version: z.string().min(1),
      reviewed_on: z.coerce.date(),
      source_snapshots: z.array(
        z.string().startsWith('private/raw/standards/owasp/'),
      ).min(1),
      sources: z.array(z.string().url()).min(1),
      tags: tagsSchema.min(1),
      related: z.array(z.string().min(1)).optional(),
      do_not_claim: z.array(z.string().min(1)).min(1),
    }),
  ]),
});

const meta = defineCollection({
  loader: glob({ pattern: '*.md', base: './content/meta' }),
  schema: z.object({
    type: z.literal('meta'),
    slug: z.string().min(1),
    title: z.string().min(1),
    audience: z.string().min(1),
  }),
});

const skillSchema = z.object({
    type: z.literal('skill'),
    slug: z.string().min(1),
    title: z.string().min(1),
    note: z.string().min(1),
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
      slug: z.string().min(1),
      title: z.string().min(1),
      audience: z.string().min(1),
    }),
    z.object({
      type: z.literal('publication'),
      slug: z.string().min(1),
      title: z.string().min(1),
      authors: z.array(z.object({
        name: z.string().min(1),
        citation_name: z.string().min(1),
        portfolio_owner: z.boolean().default(false),
      })).min(1).refine(
        (authors) => authors.filter((author) => author.portfolio_owner).length === 1,
        { message: 'A publication must identify exactly one portfolio owner.' },
      ),
      venue: z.string().min(1),
      series: z.string().min(1),
      series_abbreviation: z.string().min(1),
      volume: z.number().int().positive(),
      year: z.number().int().min(1900).max(2100),
      published_on: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
      doi: z.string().regex(/^10\.\d{4,9}\/\S+$/),
      pages: z.string().regex(/^\d+(?:[-–]\d+)?$/),
      publisher: z.string().min(1),
      format: z.literal('conference-paper'),
      review_status: z.literal('peer-reviewed'),
      source: z.string().url(),
      publication_type: z.object({
        en: z.string().min(1),
        de: z.string().min(1),
      }),
      index_intro: z.object({
        en: z.string().min(1),
        de: z.string().min(1),
      }),
      summary: z.object({
        en: z.string().min(1),
        de: z.string().min(1),
      }),
      contribution: z.object({
        en: z.string().min(1),
        de: z.string().min(1),
      }),
      reported_result: z.object({
        metric: z.literal('accuracy'),
        value: z.number().min(0).max(100),
        unit: z.literal('percent'),
        approximate: z.literal(true),
        scope: z.object({
          en: z.string().min(1),
          de: z.string().min(1),
        }),
        attribution: z.object({
          en: z.string().min(1),
          de: z.string().min(1),
        }),
        caveat: z.object({
          en: z.string().min(1),
          de: z.string().min(1),
        }),
      }),
      defensible_claims: z.array(z.string().min(1)).min(1),
      do_not_claim: z.array(z.string().min(1)).min(1),
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
  projectNotes,
  paperNotes,
  redteam,
  meta,
  skills,
  skillsDe,
  profile,
};
