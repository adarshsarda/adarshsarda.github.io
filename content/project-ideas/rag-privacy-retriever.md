---
type: project-idea
slug: rag-privacy-retriever
title: "RAG Privacy Retriever Lab"
status: planned
module: "RAG security reading exercise"
summary: "Implement a simple embedding-based RAG retriever following Zeng et al., evaluate it on a redacted Enron subset, then test retrieval-data extraction, PoisonedRAG-style integrity, jamming, and membership inference."
tags: [rag-security, retrieval, data-exfiltration, model-evaluation, python]
---

# RAG Privacy Retriever Lab

*Repo-internal idea note. This captures the reading and implementation
direction without turning it into a public claim yet.*

## Minimal implementation

- Load a small, redacted Enron subset.
- Chunk each email as one document or into fixed-size chunks.
- Embed chunks with a local sentence-transformer such as `all-MiniLM-L6-v2`.
- Store vectors locally, either in memory with NumPy/sklearn or with Chroma.
- For a query, embed it and retrieve top-k nearest chunks by cosine similarity.
- Compose a simple prompt: retrieved context + user question.
- Use a local or approved model only if needed; retrieval can be evaluated without generation.

## Evaluation path

1. Clean retrieval sanity check: known query retrieves expected email/chunk.
2. Privacy extraction: measure whether generated answers repeat retrieved private context.
3. PoisonedRAG extension: insert a small number of adversarial documents for one target query.
4. Jamming extension: insert a blocker document and measure targeted abstention.
5. Membership inference extension: test known members and non-members with a fixed decision rule.

## Evidence discipline

- Redact PII in examples and screenshots.
- Report k/n and confidence intervals for every rate.
- Separate retrieval success from generation behavior.
- Keep the Enron privacy caveat explicit even though the corpus is public.
- Do not claim full reproduction of Zeng et al. unless the setup matches their models,
  prompts, datasets, and metrics.

## Source anchors

- Zeng et al., *The Good and The Bad*.
- Zou et al., *PoisonedRAG*.
- Shafran et al., *Machine Against the RAG*.
- Anderson et al., *Is My Data in Your Retrieval Database?*
- CMU Enron Email Dataset page.
- ART and Witches' Brew for future poisoning baselines outside RAG.
