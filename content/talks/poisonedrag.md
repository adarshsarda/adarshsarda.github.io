---
title: "PoisonedRAG: When the Knowledge Base Becomes the Payload"
description: "An explainer on knowledge-corruption attacks that inject a handful of optimized texts into large RAG databases to induce attacker-selected answers."
speaker: "Adarsh Sarda"
event: "Independent study"
format: "Paper explainer"
track: "RAG and prompt injection"
last_updated: "2026-06-18"
order: 7
paper_title: "PoisonedRAG: Knowledge Corruption Attacks to Retrieval-Augmented Generation of Large Language Models"
paper_authors: ["Wei Zou", "Runpeng Geng", "Binghui Wang", "Jinyuan Jia"]
paper_url: "https://arxiv.org/abs/2402.07867"
tags: ["rag-security", "knowledge-poisoning", "retrieval", "llm-security", "data-provenance"]
---

PoisonedRAG studies a targeted integrity attack on retrieval-augmented generation. An attacker
injects a small number of malicious texts into a large knowledge database so that a chosen
question retrieves those texts and the LLM produces an attacker-selected answer.

> **Attribution and scope.** This is my structured explanation of Zou et al. The method and
> results are from the original paper.

---

## Why RAG Creates a New Attack Surface

RAG is designed to reduce hallucination and stale knowledge by grounding generation in
retrieved documents. That architecture transfers trust from the model's parameters to three
external components:

1. the knowledge database;
2. the retrieval model;
3. the prompt that combines retrieved text with the user question.

If database writes are less protected than model weights, the knowledge base can become the
easier compromise point.

## Attack Goal

The attacker chooses:

- a target question;
- a target answer;
- several malicious texts to inject.

The attack succeeds when the target question retrieves the injected texts and the generator
follows their content strongly enough to emit the selected answer.

This is targeted corruption rather than broad denial of service. Benign questions can still
work normally, making the compromise harder to notice through average accuracy.

## Optimization View

PoisonedRAG formulates the injected-text construction as an optimization problem with two
linked objectives:

- **retrieval objective:** make the malicious text rank highly for the target question;
- **generation objective:** make the retrieved content steer the LLM to the target answer.

The authors propose solutions for different attacker knowledge levels, including black-box
and white-box settings. This distinction matters because a practical attacker may not know
the exact retriever or generator.

## Main Result

The paper reports approximately **90% attack success** when injecting **five malicious texts
per target question** into a knowledge database containing millions of texts.

The scale imbalance is the notable result: a tiny number of strategically constructed entries
can dominate retrieval for selected queries without visibly corrupting the broader corpus.

## Why Basic Defenses Fall Short

The evaluated defenses are insufficient in the reported experiments. Several intuitive
controls have gaps:

- **More retrieved documents:** poison can still rank highly and influence generation.
- **Perplexity or anomaly filters:** optimized text may remain linguistically ordinary.
- **Database size:** a larger corpus does not help if retrieval is targetable.
- **Clean validation accuracy:** targeted questions may not appear in the validation set.

Defenses need provenance and cross-checking, not only content quality scores.

## Defensive Architecture

A stronger RAG pipeline would:

- authenticated and reviewed database ingestion;
- source-level trust scores;
- immutable provenance for every retrieved chunk;
- retrieval diversity across independent sources;
- contradiction checks before high-impact answers;
- monitoring for sudden nearest-neighbor dominance;
- canary questions and targeted poisoning regression tests.

For high-stakes RAG, the system should expose citations and allow downstream policy to reject
answers grounded only in untrusted sources.

## Limitations

- The attack assumes the ability to insert documents into the knowledge base.
- Success varies with retriever, generator, corpus, and target question.
- Five texts per target is small but not zero; ingestion controls can change feasibility.
- The work focuses on attacker-selected answers rather than every form of RAG manipulation.
- Defense remains an open problem rather than a solved component of the paper.

## Takeaways

1. RAG databases are security-critical model inputs.
2. PoisonedRAG jointly targets retrieval and generation.
3. Five injected texts achieved about 90% success in the reported large-corpus setting.
4. Average clean performance can hide targeted knowledge corruption.
5. Provenance, ingestion control, and source diversity are essential defenses.

## Reference

Wei Zou, Runpeng Geng, Binghui Wang, and Jinyuan Jia. **"PoisonedRAG: Knowledge Corruption
Attacks to Retrieval-Augmented Generation of Large Language Models."**
[arXiv:2402.07867](https://arxiv.org/abs/2402.07867).
