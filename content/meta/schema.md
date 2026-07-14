---
type: meta
slug: schema
title: "Knowledge Base Schema"
audience: internal
---

# Knowledge Base Schema

The frontmatter spec the site and any agent build against. This is the source of truth for
collections: register against it, do not infer.

## Global rules

1. Every file is self-contained: no positional references ("the project above").
2. Every collection is validated by `src/content.config.ts`. Fields listed below are required
   unless the schema explicitly marks them optional.
3. Each project has one canonical `overview.md`: the primary retrieval target.
4. Tags come only from `meta/taxonomy.md` (controlled vocabulary). No ad-hoc tags.
5. Every skill and every outward claim points to a proving artifact.
6. **Deny-list: never render publicly:** `do_not_claim`, `pitch`, `bullets`. Also do not
   expose internal `related` / `relevance` cross-reference fields in public page output.
7. Prefer objective success criteria (deterministic / exact-match) over subjective judgement.
8. Internal note references use canonical content IDs such as `talks/agentdojo` or
   `projects/odsb-semantic-backdoors`. Bare slugs are allowed only when globally unique;
   `/.../` paths are public routes, not note IDs.
9. English is the canonical authored language unless a note says otherwise. German
   counterparts should use `translation_of` when that field is introduced during migration.

## Public content types

**project**: `projects/<slug>/overview.md`
`type, projection{visibility(hidden|public),featured}, slug, title, subtitle,
category(original-research|applied|reproduction), context,
status, submission_date, role, date_start, date_end, domains[], skills[], artifacts[],
summary, pitch, bullets[], metrics[], eval_protocol{}, defensible_claims[], do_not_claim[]`

**project-detail**: `method.md` / `results.md` / `reflection.md`
`type, parent, part(method|results|reflection), title, related[]`

**guide**: `guides/*.md`
`type, slug, title, description, sources[], tags[], defensible_claims[], do_not_claim[]`

**talk**: `talks/*.md`
`type, title, description, speaker, event, format, track?, year, source, difficulty,
takeaway, why_added, why_matters, what_i_learned, core_ideas[], threat_model{},
connections[], open_questions[], last_updated, tags[]`

**paper-note**: `paper-notes/*.md` (a note on someone else's work)
`type, slug, title, authors, venue, year, doi_or_url, tags[], relevance[]`
Body sections: Citation - Problem - Method - Key result - My take - Connection to my work.
NOTE: keep repo-internal/unrouted until every citation and figure is verified against source.

**method**: `methods/*.md`
`type, slug, title, tags[], related[]`

**publication**: `profile/publications.*`
`type, slug, title, authors[], venue, series, series_abbreviation, volume, year,
published_on, doi, pages, publisher, format, review_status, source,
publication_type{}, index_intro{}, summary{}, contribution{}, reported_result{},
defensible_claims[], do_not_claim[]`

**skill**: `skills/skills.md`
Frontmatter: `type, slug, title, note`. In the body, each skill entry states a
proficiency (`proficient|working|familiar`) and links to its evidence artifact.

## Internal content types (built, not publicly routed)

**project-idea**: `project-ideas/*.md`
`type, slug, title, status, module(deep-vision|ai-project|self-study|portfolio),
decision(candidate|selected|parked|superseded),
idea_role(flagship|umbrella|component|rehearsal|stretch), next_milestone,
depends_on[], summary, tags[]`
Repo-internal roadmap. Not added to nav, not rendered as public pages.

**redteam-technique**: `redteam/techniques/*.md`
`type, slug, title, status, tags[], owasp[], atlas[], target_systems[](chatbot|rag|agentic),
objective_success_criteria, severity_default, probe_template, mitigations[], do_not_claim[]`

**redteam-doc**: `redteam/{taxonomy,scoring,report-template,rules-of-engagement}.md`
`type, slug, title, status, tags[]`

**meta**: `meta/*.md`, `profile/positioning.md`
`type, slug, title, audience`

## Controlled field values
- `category`: `original-research` | `applied` | `reproduction`
- `status`: `planned` | `in-progress` | `active` | `complete` | `paused`
- `part`: `method` | `results` | `reflection`
- `target_systems`: `chatbot` | `rag` | `agentic`
- project `projection.visibility`: `hidden` | `public`
- project-idea `module`: `deep-vision` | `ai-project` | `self-study` | `portfolio`
- project-idea `decision`: `candidate` | `selected` | `parked` | `superseded`
- project-idea `idea_role`: `flagship` | `umbrella` | `component` | `rehearsal` | `stretch`
- `proficiency`: `proficient` | `working` | `familiar`

## External reference frameworks (redteam content)
- OWASP LLM Top 10: `LLM01`...`LLM10`
- MITRE ATLAS: tactic/technique IDs (e.g. `AML.T0051`)
- NIST AI RMF: function references (Govern / Map / Measure / Manage)
