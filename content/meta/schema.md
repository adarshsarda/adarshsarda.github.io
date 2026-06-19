---
type: meta
slug: schema
title: "Knowledge Base Schema"
audience: internal
---

# Knowledge Base Schema

The frontmatter spec the site and any agent build against. This is the source of truth for
collections — register against it, do not infer.

## Global rules

1. Every file is self-contained — no positional references ("the project above").
2. `type` is the only universally required field; everything else is optional so legacy files
   validate. Each content type has a *recommended* set, listed below.
3. Each project has one canonical `overview.md` — the primary retrieval target.
4. Tags come only from `meta/taxonomy.md` (controlled vocabulary). No ad-hoc tags.
5. Every skill and every outward claim points to a proving artifact.
6. **Deny-list — never render publicly:** `do_not_claim`, `pitch`, `bullets`. Also do not
   expose internal `related` / `relevance` cross-reference fields in public page output.
7. Prefer objective success criteria (deterministic / exact-match) over subjective judgement.

## Public content types

**project** — `projects/<slug>/overview.md`
`type, slug, title, subtitle, category(original-research|applied|reproduction), context,
status, submission_date, role, date_start, date_end, domains[], skills[], artifacts[],
summary, pitch, bullets[], metrics[], eval_protocol{}, defensible_claims[], do_not_claim[]`

**project-detail** — `method.md` / `results.md` / `reflection.md`
`type, parent, part(method|results|reflection), title, related[]`

**guide** — `guides/*.md`
`type, slug, title, description, sources[], tags[], defensible_claims[], do_not_claim[]`

**paper-note** — `paper-notes/*.md` (a note on someone else's work)
`type, slug, title, authors, venue, year, doi_or_url, tags[], relevance[]`
Body sections: Citation - Problem - Method - Key result - My take - Connection to my work.
NOTE: keep repo-internal/unrouted until every citation and figure is verified against source.

**method** — `methods/*.md`
`type, slug, title, tags[], related[]`

**publication** — `profile/publications.*`
`type, title, authors, venue, series, year, doi, pages, contribution`

**skill** — `skills/skills.md`
clusters, each with `name, proficiency(proficient|working|familiar), evidence[]`

## Internal content types (built, not publicly routed)

**project-idea** — `project-ideas/*.md`
`type, slug, title, status(planned|in-progress|complete), module?, summary, tags[]`
Repo-internal roadmap. Not added to nav, not rendered as public pages.

**redteam-technique** — `redteam/techniques/*.md`
`type, slug, title, status, tags[], owasp[], atlas[], target_systems[](chatbot|rag|agentic),
objective_success_criteria, severity_default, probe_template, mitigations[], do_not_claim[]`

**redteam-doc** — `redteam/{taxonomy,scoring,report-template,rules-of-engagement}.md`
`type, slug, title, status, tags[]`

**meta** — `meta/*.md`, `profile/positioning.md`
`type, slug, title, audience`

## Controlled field values
- `category`: `original-research` | `applied` | `reproduction`
- `status`: `planned` | `in-progress` | `active` | `complete` | `paused`
- `part`: `method` | `results` | `reflection`
- `target_systems`: `chatbot` | `rag` | `agentic`
- `proficiency`: `proficient` | `working` | `familiar`

## External reference frameworks (redteam content)
- OWASP LLM Top 10: `LLM01`...`LLM10`
- MITRE ATLAS: tactic/technique IDs (e.g. `AML.T0051`)
- NIST AI RMF: function references (Govern / Map / Measure / Manage)
