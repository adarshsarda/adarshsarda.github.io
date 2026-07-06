---
type: paper-note
slug: rag-membership-inference
title: "Is My Data in Your Retrieval Database? Membership Inference Attacks Against Retrieval Augmented Generation"
authors: "Maya Anderson; Guy Amit; Abigail Goldsteen"
venue: "ICISSP 2025 / arXiv"
year: 2024
doi_or_url: "https://arxiv.org/abs/2405.20446"
tags: [rag-security, data-exfiltration, retrieval, model-evaluation, llm-security]
relevance: [content/talks/rag-membership-inference.md, content/guides/rag-security-test-plan.md, content/redteam/techniques/rag-membership-inference.md]
---

# RAG Membership Inference

## Citation
Anderson, Amit, and Goldsteen (2024, revised 2025). *Is My Data in Your Retrieval Database?
Membership Inference Attacks Against Retrieval Augmented Generation.* arXiv:2405.20446.

## Problem
A private RAG database can leak even without printing full documents. The sensitive fact may
be whether a candidate passage exists in the retrieval store.

## Method
The attacker submits prompts around a candidate passage and observes whether the RAG system's
output indicates database membership. The paper evaluates black-box and gray-box settings.

## Key result
The paper reports effective membership inference across benchmark datasets and models. The
appendix shows high exact retrieval for member documents, around 95% in the displayed member
tables, and near-zero exact retrieval for non-members.

## My take
This is a necessary privacy test for any private RAG system. Extraction asks "what is in the
store?" MIA asks "is this in the store?"

## Connection to my work
Add AUC/thresholded membership metrics to RAG reports. Treat database presence as a protected
fact when the corpus is private.
