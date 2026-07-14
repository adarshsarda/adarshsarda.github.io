---
type: paper-note
slug: rag-jamming-blocker-documents
title: "Machine Against the RAG: Jamming Retrieval-Augmented Generation with Blocker Documents"
authors: "Avital Shafran; Roei Schuster; Vitaly Shmatikov"
venue: "USENIX Security 2025 / arXiv"
year: 2024
doi_or_url: "https://arxiv.org/abs/2406.05870"
tags: [rag-security, retrieval, risk-evaluation, model-evaluation]
relevance: [talks/rag-jamming, guides/rag-security-test-plan]
---

# Machine Against the RAG

## Citation
Shafran, Schuster, and Shmatikov (2024, revised 2025). *Machine Against the RAG: Jamming
Retrieval-Augmented Generation with Blocker Documents.* arXiv:2406.05870.

## Problem
RAG systems are usually tested for answer correctness or safety. The paper asks whether an
attacker can selectively make a RAG system stop answering a target query.

## Method
The attacker adds a blocker document to an untrusted database. The blocker is retrieved for a
target query and makes the generator refuse, abstain, or claim lack of relevant information.
The paper includes black-box optimization methods and emphasizes that instruction injection
is not required.

## Key result
The paper demonstrates targeted jamming across multiple embeddings and LLMs and argues that
existing safety metrics do not capture this availability failure.

## My take
Adds the missing third leg of RAG security: integrity, confidentiality, availability.

## Connection to my work
Add jamming to RAG test matrices: measure whether the system answers when clean evidence is
available, and whether one untrusted document causes targeted abstention.
