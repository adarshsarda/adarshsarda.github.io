---
type: paper-note
slug: poisonedrag
title: "PoisonedRAG: Knowledge Corruption Attacks to Retrieval-Augmented Generation of Large Language Models"
authors: "Wei Zou; Runpeng Geng; Binghui Wang; Jinyuan Jia"
venue: "USENIX Security 2025 / arXiv"
year: 2024
doi_or_url: "https://arxiv.org/abs/2402.07867"
tags: [rag-security, knowledge-poisoning, rag-poisoning, retrieval, data-provenance]
relevance: [content/talks/poisonedrag.md, content/guides/rag-security-test-plan.md, content/redteam/techniques/rag-knowledge-poisoning.md]
---

# PoisonedRAG

## Citation
Zou, Geng, Wang, and Jia (2024). *PoisonedRAG: Knowledge Corruption Attacks to
Retrieval-Augmented Generation of Large Language Models.* arXiv:2402.07867.

## Problem
RAG improves freshness and grounding by reading an external database, but that database can be
easier to modify than model weights.

## Method
The attacker injects a small number of malicious texts into the knowledge database for a
chosen target question and target answer. The attack jointly optimizes retrieval and answer
influence, with black-box and white-box variants.

## Key result
The arXiv abstract reports about 90% attack success when injecting five malicious texts per
target question into a database with millions of texts.

## My take
This is the core RAG integrity paper in the KB. It should be paired with Zeng et al. for
confidentiality and Shafran et al. for availability.

## Connection to my work
Already public as a talk note. Also drives the `rag-knowledge-poisoning` red-team technique.
