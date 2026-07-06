---
title: "RAG Membership Inference: Is My Document in Your Vector Store?"
description: "A paper explainer on membership inference attacks against RAG systems, where model outputs reveal whether a candidate passage appears in the retrieval database."
speaker: "Adarsh Sarda"
event: "Independent study"
format: "Paper explainer"
track: "RAG and prompt injection"
last_updated: "2026-07-06"
order: 15
paper_title: "Is My Data in Your Retrieval Database? Membership Inference Attacks Against Retrieval Augmented Generation"
paper_authors: ["Maya Anderson", "Guy Amit", "Abigail Goldsteen"]
paper_url: "https://arxiv.org/abs/2405.20446"
tags: ["rag-security", "data-exfiltration", "retrieval", "model-evaluation", "llm-security"]
year: 2024
source: "Anderson et al. / arXiv and ICISSP 2025"
difficulty: "Intermediate"
takeaway: "A RAG system can leak database membership even when it does not directly reveal the full document."
why_added: "This complements RAG data extraction: sometimes the privacy question is not 'show me the record' but 'is this record in your database?'"
why_matters: "Membership can be sensitive by itself. Knowing that a legal memo, medical note, complaint, or email appears in a private RAG store can reveal confidential facts."
what_i_learned: "RAG privacy evaluation should include binary membership tests in addition to extraction and poisoning tests."
core_ideas:
  - "The attacker asks whether a candidate passage is present in the retrieval database."
  - "The attack works in black-box and gray-box settings by prompting the RAG system and interpreting its output."
  - "The paper evaluates Enron and HealthcareMagic with several generators."
  - "Appendix results show high exact retrieval for member documents and near-zero exact retrieval for non-members."
  - "Prompt-level defenses can help some settings but may change model behavior and answer clarity."
threat_model:
  system: "A RAG system backed by a private retrieval database."
  attacker: "A user who has candidate text and query access to the RAG interface."
  capability: "Submit membership probes and observe yes/no style outputs or answer behavior."
  failure: "The attacker infers whether the candidate passage is present in the database."
  deployment: "Private search, legal discovery assistants, email RAG, medical knowledge assistants."
connections:
  - {label: "RAG Privacy", href: "/talks/rag-privacy-good-bad/", note: "Extraction asks what the database contains; MIA asks whether a candidate is present."}
  - {label: "RAG Security Test Plan", href: "/guides/rag-security-test-plan/", note: "The test matrix should include membership as a privacy metric."}
  - {label: "PoisonedRAG", href: "/talks/poisonedrag/", note: "Both depend on retrieval behavior, but target confidentiality vs. integrity."}
open_questions:
  - "How should a RAG system respond when a user asks about a near-verbatim private passage?"
  - "Can access control prevent membership leakage before candidate text reaches the model?"
  - "Which defenses reduce membership leakage without causing vague or unusable answers?"
---

Membership inference asks a narrower privacy question than extraction: is a particular
candidate document present in the retrieval database? In a private RAG system, that fact can
be sensitive even if the document is never printed verbatim.

> **Attribution and scope.** This is my explanation of Anderson et al. The attack is described
> at a defensive evaluation level.

---

## Why Membership Matters

RAG databases often contain private records: email, medical notes, support tickets, legal
documents, incident reports, or customer data. If an attacker can infer that a candidate
passage exists in the database, they may learn:

- that a person contacted a company;
- that a medical condition appears in a record;
- that an internal investigation exists;
- that a confidential document was indexed.

The leakage is binary, but the impact may still be real.

## Attack Shape

The attacker has a candidate passage and query access to the RAG system. The goal is to infer
whether the passage is a member of the retrieval database.

The paper evaluates black-box and gray-box settings. In black-box mode, the attacker observes
model output. In gray-box mode, the attacker has more visibility into retrieval behavior. The
attack uses prompts that push the RAG system toward a yes/no answer about whether the
candidate text appears in the stored context.

## Evaluation Notes

The experiments use datasets including Enron and HealthcareMagic, with multiple generators.
Appendix results report high exact retrieval of member documents, around 95 percent in the
shown member-retrieval tables, and near-zero exact retrieval for non-member samples.

The reported AUC values vary by model, dataset, prompt, and threat model. That variation is
the practical lesson: MIA is measurable, but not a single universal number.

## Defensive Lessons

A RAG system should not answer membership questions about private corpora unless the user is
authorized to know the answer.

Controls to evaluate:

- retrieval access control before similarity search;
- refusal or abstraction for near-verbatim candidate passages;
- rate limits for repeated membership probes;
- logging of candidate-passage style queries;
- response policies that avoid confirming database presence;
- differential access views for document title, snippet, and full content.

Prompt-level defense can change behavior, but it should not be the only control.

## Limitations

- Membership success depends on how the candidate passage is phrased and chunked.
- A defense that blocks all yes/no answers may damage legitimate search.
- Gray-box and black-box results should be reported separately.
- The attack does not necessarily recover the whole document.

## Takeaways

1. Database membership is a privacy property.
2. RAG can leak membership through output behavior.
3. MIA should be tested separately from full-context extraction.
4. Access control belongs before retrieval and inside the prompt boundary.
5. Reports should include AUC or thresholded rates, not anecdotes.

## Reference

Maya Anderson, Guy Amit, and Abigail Goldsteen. **"Is My Data in Your Retrieval Database?
Membership Inference Attacks Against Retrieval Augmented Generation."**
[arXiv:2405.20446](https://arxiv.org/abs/2405.20446).
