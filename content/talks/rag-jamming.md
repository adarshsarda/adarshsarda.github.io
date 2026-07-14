---
type: talk
title: "RAG Jamming: When One Document Makes the System Stop Answering"
description: "A paper explainer on blocker-document attacks that cause RAG systems to refuse or fail targeted questions without relying on instruction injection."
speaker: "Adarsh Sarda"
event: "Independent study"
format: "Paper explainer"
track: "RAG and prompt injection"
last_updated: "2026-07-06"
order: 16
paper_title: "Machine Against the RAG: Jamming Retrieval-Augmented Generation with Blocker Documents"
paper_authors: ["Avital Shafran", "Roei Schuster", "Vitaly Shmatikov"]
paper_url: "https://arxiv.org/abs/2406.05870"
tags: ["rag-security", "retrieval", "risk-evaluation", "model-evaluation", "llm-security"]
year: 2024
source: "Shafran et al. / arXiv, USENIX Security 2025"
difficulty: "Advanced"
takeaway: "RAG attacks can do more than make the model say the wrong thing. A blocker document can make it stop answering a chosen question."
why_added: "This expands my RAG test plan from integrity and confidentiality to availability."
why_matters: "A support, compliance, or safety assistant that selectively refuses important questions can cause operational harm while looking cautious rather than compromised."
what_i_learned: "Jamming is a retrieval-plus-generation failure, but it does not need a visible prompt injection string. That makes simple instruction filters the wrong first defense."
core_ideas:
  - "The attacker adds a blocker document to an untrusted RAG database."
  - "The blocker is retrieved for a target query and causes the model not to answer."
  - "The attack can be generated with black-box optimization and does not require knowing the target embedding model or LLM."
  - "Existing safety metrics may miss targeted availability failures."
  - "Defenses such as paraphrasing and perplexity filtering have utility and robustness trade-offs."
threat_model:
  system: "A RAG system that indexes untrusted or weakly reviewed content."
  attacker: "A party who can add one document or page that may be indexed."
  capability: "Craft a blocker document for a target query."
  failure: "The RAG system refuses, abstains, or claims lack of information for a question it should answer."
  deployment: "Search assistants, policy bots, support systems, and public-web RAG pipelines."
connections:
  - {label: "RAG Security Test Plan", href: "/guides/rag-security-test-plan/", note: "Adds an availability test alongside poisoning, extraction, and MIA."}
  - {label: "PoisonedRAG", href: "/talks/poisonedrag/", note: "Poisoning steers answers; jamming suppresses them."}
  - {label: "Indirect Prompt Injection", href: "/talks/indirect-prompt-injection/", note: "Jamming is notable because it can work without instruction injection."}
open_questions:
  - "How should RAG evaluations measure targeted abstention failures?"
  - "Can source diversity prevent one blocker from dominating the answer decision?"
  - "How can defenses distinguish legitimate safety abstention from attacker-induced jamming?"
---

Machine Against the RAG studies a targeted availability attack. Instead of making the model
give an attacker-chosen answer, the attacker adds a blocker document that makes the RAG system
avoid answering a selected question.

> **Attribution and scope.** This is my explanation of Shafran, Schuster, and Shmatikov. I
> keep the focus on evaluation and defense.

---

## Why This Is Different From Poisoning

PoisonedRAG is an integrity attack: the answer changes to the attacker's chosen content.
Jamming is an availability attack: the system stops answering, refuses, or claims the evidence
is insufficient.

That matters because a jammed system can look safe. It may appear cautious rather than
compromised.

## Blocker Documents

The attacker adds a single blocker document to a database that accepts untrusted content. For
a target query, the blocker is retrieved and influences the generator toward abstention or
non-answer behavior.

The paper's strongest point is that this does not need visible instruction injection. The
authors describe black-box optimization methods that do not require knowing the exact
embedding model or LLM used by the target RAG system.

## Evaluation Lesson

RAG evaluation often measures whether answers are correct when the database is clean. That
misses targeted abstention:

- Did the correct evidence exist?
- Was a blocker retrieved?
- Did the model refuse or abstain because of the blocker?
- Did normal utility remain high, hiding the targeted failure?

This belongs in a RAG security test plan as an availability metric.

## Defensive Lessons

Candidate controls:

- source review and trust scoring before indexing;
- retrieval diversity so one source cannot dominate;
- duplicate and near-duplicate clustering;
- anomaly detection on low-naturalness blocker text;
- monitoring for sudden query-specific abstention spikes;
- answer policies that separate "unsafe" from "insufficient evidence";
- human review for high-impact unanswered queries.

The paper discusses defenses such as perplexity filtering and paraphrasing, but both have
trade-offs. Perplexity filters can be optimized around, and paraphrasing can change meaning,
cost money, and damage utility.

## Limitations

- The attack assumes the blocker can enter the database.
- Practical success depends on retriever, generator, target query, and source controls.
- Some defenses may work in narrow settings but create utility costs elsewhere.
- Jamming is one availability threat, not a complete RAG denial-of-service model.

## Takeaways

1. RAG systems can fail by refusing targeted questions.
2. A blocker document can cause abstention without obvious prompt injection.
3. Safety metrics should include targeted availability.
4. Source diversity and ingestion control matter for availability as well as integrity.
5. Defenses need utility measurements because paraphrasing and filtering can break good answers.

## Reference

Avital Shafran, Roei Schuster, and Vitaly Shmatikov. **"Machine Against the RAG: Jamming
Retrieval-Augmented Generation with Blocker Documents."** [arXiv:2406.05870](https://arxiv.org/abs/2406.05870).
