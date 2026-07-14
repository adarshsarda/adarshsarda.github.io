---
type: paper-note
slug: rag-privacy-good-bad
title: "The Good and The Bad: Exploring Privacy Issues in Retrieval-Augmented Generation (RAG)"
authors: "Shenglai Zeng; Jiankun Zhang; Pengfei He; Yue Xing; Yiding Liu; Han Xu; Jie Ren; Shuaiqiang Wang; Dawei Yin; Yi Chang; Jiliang Tang"
venue: "arXiv"
year: 2024
doi_or_url: "https://arxiv.org/abs/2402.16893"
tags: [rag-security, data-exfiltration, retrieval, data-provenance, llm-security]
relevance: [guides/rag-security-test-plan, talks/rag-privacy-good-bad]
---

# The Good and The Bad

## Citation
Zeng et al. (2024). *The Good and The Bad: Exploring Privacy Issues in
Retrieval-Augmented Generation (RAG).* arXiv:2402.16893.

## Problem
RAG connects LLMs to private retrieval databases. The paper asks whether RAG leaks retrieval
data and whether retrieval changes the base model's tendency to leak memorized training data.

## Method
The paper uses a standard embedding-based RAG pipeline: embed query and documents, retrieve
top-k by distance or similarity, concatenate retrieved context with the query, and generate.
The privacy attack combines an information component that steers retrieval with a command
component that induces the LLM to output retrieved context.

## Key result
RAG can leak retrieval data. In one Enron/GPT-3.5 untargeted setting, 116 of 250 prompts
produced exact matches from retrieved content. The paper also reports that RAG can reduce
some training-data leakage from the base model.

## My take
This is the cleanest bridge from a simple RAG retriever implementation to a security
experiment. The first lab should measure retrieval success separately from generation leakage.

## Connection to my work
Directly updates the RAG Security Test Plan: add privacy extraction, context-repeat metrics,
PII redaction discipline, and Enron-specific care.
