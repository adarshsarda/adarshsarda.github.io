---
type: guide
slug: rag-security-test-plan
title: "RAG Security Test Plan: Retrieval, Privacy, Poisoning, and Jamming"
description: "A practitioner test plan for retrieval-augmented generation systems, covering ingestion, private-data extraction, membership inference, poisoned knowledge, jamming, indirect prompt injection, provenance, and regression testing."
author: "Adarsh Sarda"
order: 3
last_updated: "2026-07-06"
sources:
  - "https://arxiv.org/abs/2402.16893"
  - "https://arxiv.org/abs/2402.07867"
  - "https://arxiv.org/abs/2405.20446"
  - "https://arxiv.org/abs/2406.05870"
  - "https://arxiv.org/abs/2406.00083"
  - "https://arxiv.org/abs/2601.07072"
  - "https://arxiv.org/abs/2601.10923"
  - "https://arxiv.org/abs/2601.11199"
  - "https://arxiv.org/abs/2602.06616"
  - "https://arxiv.org/abs/2603.21654"
  - "https://genai.owasp.org/llm-top-10/"
tags: ["rag-security", "prompt-injection", "retrieval", "data-provenance", "model-evaluation"]
---

RAG is often sold as a reliability fix: ground the model in documents and hallucination goes
down. Security changes the framing. A RAG system is a full pipeline: ingestion, retrieval,
vector storage, access control, prompt composition, and generation. Every one of those
components can become the attack surface.

This test plan is for evaluating whether a RAG system can resist private-data extraction,
membership inference, targeted knowledge corruption, jamming, indirect prompt injection,
retrieval manipulation, and unauthorized disclosure.

> **Source horizon.** I wrote this after checking recent RAG-security work through July 6,
> 2026. The exact papers will change; the test logic should remain useful.

---

## Threat Model

Start by naming what the attacker can control. RAG attacks look very different depending on
where the attacker enters.

| Attacker capability | Example source | Main risk |
|---|---|---|
| Insert documents | wiki, support portal, shared drive, web crawl | Poisoned chunks steer selected answers |
| Modify existing documents | compromised CMS, stale permissions | Trusted source becomes hostile |
| Influence ranking | keyword stuffing, embedding-targeted text | Poison dominates top-k retrieval |
| Hide instructions in content | HTML, markdown, comments, Unicode tricks | Retrieved data becomes model instruction |
| Query as low-privilege user | tenant boundary, role-based search | Access-controlled content leaks |
| Probe candidate passages | private vector store, email corpus | Database membership is inferred |
| Add blocker documents | untrusted web crawl, shared docs | Targeted questions stop being answered |
| Scrape or mirror content | public web, copied docs | Owner content enters RAG without consent |

The goal is not to test every possible bad string. The goal is to test whether the pipeline
keeps **data authority**, **instruction authority**, and **access authority** separate.

## Phase 1: Map the RAG Pipeline

Record the full path before attacking it.

1. **Ingestion:** where documents come from, who can write them, how they are reviewed.
2. **Pre-processing:** HTML stripping, markdown handling, chunking, OCR, Unicode normalization.
3. **Indexing:** embedding model, sparse/dense retriever, metadata fields, tenant/role filters.
4. **Retrieval:** top-k, reranker, thresholding, diversity, source allowlists.
5. **Prompt composition:** how chunks are delimited and whether they are labeled as untrusted.
6. **Generation:** model, system prompt, citation behavior, refusal behavior.
7. **Output controls:** source display, sensitive-data filters, logging, user feedback.

If a RAG system cannot explain which chunk supported an answer, it cannot be audited.

## Phase 2: Test Retrieval Before Generation

Many prompt-injection demos skip the hardest step: getting the malicious content retrieved
under a natural query. Recent work such as **Overcoming the Retrieval Barrier** focuses
exactly on this gap: attacks can be weak in practice if they never reach the model, but severe
once retrieval is solved.

For each target query, measure:

- **poison retrieval rate:** how often the poison appears in top-k;
- **rank shift:** whether poison moves above legitimate sources;
- **source concentration:** whether one source dominates all retrieved evidence;
- **retrieval stability:** whether small query paraphrases still retrieve the poison;
- **clean retrieval utility:** whether defenses harm normal retrieval.

Do this before reading model outputs. A bad answer can be a generation problem; a bad top-k is
a retrieval problem.

## Phase 3: Test Privacy Leakage

Zeng et al.'s RAG privacy paper is the baseline I would use for a small reproducible lab. It uses
the normal RAG shape: embed records, retrieve top-k by similarity, concatenate retrieved
context with the query, and generate. The privacy test asks whether a black-box user can make
the system retrieve private records and then repeat or closely paraphrase them.

Test three confidentiality paths:

| Privacy test | Clean control | Attack condition | Metric |
|---|---|---|---|
| Retrieval-data extraction | Authorized query returns summary | Query induces context repetition | Exact-repeat or paraphrase leakage rate |
| Targeted-field extraction | No sensitive field requested | Query steers retrieval toward PII | Targeted field leakage rate |
| Membership inference | Known non-member passage | Candidate member passage | AUC or thresholded membership accuracy |

For Enron-style experiments, keep evidence redacted. The CMU dataset is public, but the page
itself warns that the corpus exists because other email datasets are usually private.

## Phase 4: Test Answer Influence

Once a poison is retrieved, test whether it changes the answer.

| Attack class | What to vary | Success criterion |
|---|---|---|
| Knowledge corruption | false facts, biased framing, fabricated policy | Answer adopts attacker-selected claim |
| Indirect prompt injection | instruction-like text inside retrieved content | Model follows content as instruction |
| Citation laundering | poison cites or mimics trusted sources | Answer appears well sourced but is grounded in poison |
| Conflict exploitation | poison contradicts legitimate source | Model chooses poison or hides conflict |
| Context pressure | long or numerous chunks | Safety or provenance instructions become ineffective |
| Jamming | blocker document retrieved for target query | Model refuses or abstains when clean evidence exists |

Report results as rates. For example: "poison retrieved in 37/50 paraphrases; answer adopted
the target claim in 21/37 retrieved cases." That separates retrieval failure from generation
failure. For jamming, also report clean answerability before and after the blocker is indexed.

## Phase 5: Test Ingestion and Pre-Processing

Confundo's central warning is practical: real RAG systems fragment and rewrite content before
retrieval, and users rarely ask the exact target query. A test plan should therefore mutate
both the document and the query.

Test carriers:

- plain text;
- markdown;
- HTML with hidden or low-visibility content;
- comments and metadata;
- tables;
- PDFs or OCR text;
- Unicode-normalized variants;
- repeated near-duplicate chunks.

For each carrier, record whether the instruction survives ingestion, whether it is indexed,
whether it is retrieved, and whether it changes the answer.

## Phase 6: Test Access Control and Selective Disclosure

Do not let the model become the access-control layer. SD-RAG argues for enforcing disclosure
constraints during retrieval before sensitive content enters the model context. That is the
right architectural instinct.

Test:

- user A cannot retrieve user B's documents;
- role filters are enforced before vector similarity ranking;
- citations do not reveal titles, snippets, or metadata for unauthorized chunks;
- summaries do not infer protected content from neighboring public chunks;
- prompt injection cannot override disclosure policy;
- logs and traces do not expose restricted content to unauthorized viewers.

**Release gate:** if unauthorized text reaches the model, the system has already lost a major
control point.

## Phase 7: Test Provenance and Citations

Citations are security controls only if they are faithful.

- [ ] Does every factual claim map to a retrieved chunk?
- [ ] Are sources shown with trust level, owner, timestamp, and access scope?
- [ ] Does the system warn when sources conflict?
- [ ] Can an untrusted source appear as the only support for a high-impact answer?
- [ ] Are generated citations blocked?
- [ ] Are source snippets sanitized before display?

For high-stakes domains, require source diversity: at least one trusted source, or an explicit
"untrusted-only evidence" warning.

## Minimal Evaluation Matrix

| Test | Clean control | Attacked condition | Metric |
|---|---|---|---|
| Targeted poisoning | Trusted docs only | Add 1-5 adversarial docs | Answer influence rate |
| Retrieval-data extraction | Authorized summary | Context-repeat prompt | Repeat/paraphrase leakage rate |
| Membership inference | Known non-member passages | Known member passages | AUC or thresholded accuracy |
| Jamming | Clean answerable query | Add blocker document | Targeted abstention rate |
| Retrieval manipulation | Natural query | Poisoned keyword/embedding competitor | Poison top-k rate |
| Indirect injection | Retrieved neutral content | Retrieved instruction-like content | Instruction-following rate |
| Access boundary | Same role query | Cross-role / cross-tenant query | Unauthorized retrieval rate |
| Provenance | Correct citation corpus | Poison mimics trusted source | Citation faithfulness |
| Utility | Normal user tasks | Same tasks under defenses | Task success and latency |

Run at least three query families:

1. exact target queries;
2. natural paraphrases;
3. underspecified user queries where retrieval has to infer intent.

## Defenses to Evaluate

No single defense closes RAG risk. Evaluate combinations.

- ingestion review and source allowlisting;
- HTML/markdown sanitization and Unicode normalization;
- metadata-aware retrieval filters;
- role-aware retrieval before ranking;
- source trust scores;
- retrieval diversity and duplicate clustering;
- instruction/data delimiters in the prompt;
- answer-time contradiction checks;
- citation faithfulness checks;
- output-side sensitive-data filters;
- canary queries for known poisoned regions;
- membership probes for known member and non-member canaries;
- abstention monitors for targeted jamming;
- quarantine for sudden rank shifts.

Measure security and utility together. Sanitization that removes tables, code blocks, or
citations may reduce attack success while making the product useless.

## Reporting Template

For each finding, record:

- target query family;
- attacker capability;
- poison location and trust level;
- whether poison survived ingestion;
- poison retrieval rate;
- private-record retrieval rate;
- top-k rank distribution;
- answer influence rate;
- exact-repeat, paraphrase, targeted-field, or membership-inference rate;
- targeted abstention rate for jamming;
- source/citation behavior;
- affected users or tenants;
- tested defenses and utility cost.

## Limitations

RAG security is system-specific. Results depend on corpus structure, update process, retriever,
embedding model, reranker, chunking, generator, prompt format, and user behavior. Recent 2026
papers are useful for threat discovery, but their exact success rates should not be copied
into a report unless reproduced in the target system.

## References

- Shenglai Zeng et al. **"The Good and The Bad: Exploring Privacy Issues in Retrieval-Augmented Generation (RAG)."** [arXiv:2402.16893](https://arxiv.org/abs/2402.16893).
- Wei Zou et al. **"PoisonedRAG: Knowledge Corruption Attacks to Retrieval-Augmented Generation of Large Language Models."** [arXiv:2402.07867](https://arxiv.org/abs/2402.07867).
- Maya Anderson, Guy Amit, and Abigail Goldsteen. **"Is My Data in Your Retrieval Database? Membership Inference Attacks Against Retrieval Augmented Generation."** [arXiv:2405.20446](https://arxiv.org/abs/2405.20446).
- Avital Shafran, Roei Schuster, and Vitaly Shmatikov. **"Machine Against the RAG: Jamming Retrieval-Augmented Generation with Blocker Documents."** [arXiv:2406.05870](https://arxiv.org/abs/2406.05870).
- Jiaqi Xue et al. **"BadRAG: Identifying Vulnerabilities in Retrieval Augmented Generation of Large Language Models."** [arXiv:2406.00083](https://arxiv.org/abs/2406.00083).
- Hongyan Chang et al. **"Overcoming the Retrieval Barrier: Indirect Prompt Injection in the Wild for LLM Systems."** [arXiv:2601.07072](https://arxiv.org/abs/2601.07072).
- Haoze Guo and Ziqi Wei. **"Hidden-in-Plain-Text: A Benchmark for Social-Web Indirect Prompt Injection in RAG."** [arXiv:2601.10923](https://arxiv.org/abs/2601.10923).
- Aiman Al Masoud et al. **"SD-RAG: A Prompt-Injection-Resilient Framework for Selective Disclosure in Retrieval-Augmented Generation."** [arXiv:2601.11199](https://arxiv.org/abs/2601.11199).
- Haoyang Hu et al. **"Confundo: Learning to Generate Robust Poison for Practical RAG Systems."** [arXiv:2602.06616](https://arxiv.org/abs/2602.06616).
- Yanming Mu et al. **"Towards Secure Retrieval-Augmented Generation: A Comprehensive Review of Threats, Defenses and Benchmarks."** [arXiv:2603.21654](https://arxiv.org/abs/2603.21654).
- OWASP. **LLM Top 10 for 2025.** [genai.owasp.org/llm-top-10](https://genai.owasp.org/llm-top-10/).
- CMU. **Enron Email Dataset.** [cs.cmu.edu/~enron](https://www.cs.cmu.edu/~enron/).
