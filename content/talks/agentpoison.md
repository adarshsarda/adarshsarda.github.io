---
title: "AgentPoison: Why Agent Memory Is a Security Boundary"
description: "A paper explainer on poisoning long-term memory and RAG knowledge bases so triggered agent requests retrieve malicious demonstrations while benign tasks remain unaffected."
speaker: "Adarsh Sarda"
event: "Independent study"
format: "Paper explainer"
track: "Agent security"
last_updated: "2026-06-18"
order: 5
paper_title: "AgentPoison: Red-teaming LLM Agents via Poisoning Memory or Knowledge Bases"
paper_authors: ["Zhaorun Chen", "Zhen Xiang", "Chaowei Xiao", "Dawn Song", "Bo Li"]
paper_url: "https://arxiv.org/abs/2407.12784"
tags: ["agent-security", "memory-poisoning", "rag-security", "backdoor-attacks", "retrieval"]
---

AgentPoison targets a component that often receives less scrutiny than the model: the
long-term memory or knowledge base used to retrieve examples for planning. The attack inserts
malicious demonstrations and designs a trigger that reliably retrieves them.

> **Attribution and scope.** This is my structured explanation of Chen et al. The attack and
> reported measurements belong to the original authors.

---

## Why Memory Changes the Threat Model

An LLM agent may consult prior trajectories, documents, or demonstrations before choosing an
action. Retrieval makes the agent more capable, but it also creates a persistent input channel
outside the model's weights.

If the memory store accepts unverified content, an attacker may not need to:

- retrain the model;
- modify its parameters;
- control the system prompt;
- compromise every user request.

The attacker only needs poisoned entries to be retrieved under a chosen condition.

## Core Mechanism

AgentPoison formulates trigger generation as constrained optimization in embedding space. The
goal is to create a trigger whose embedding lands near the malicious memory entries, causing
the retriever to select them with high probability.

The attack balances three properties:

1. **Retrieval reliability:** triggered instructions should retrieve poisoned demonstrations.
2. **Coherence:** the trigger should fit naturally into the instruction.
3. **Stealth:** benign requests and ordinary memory behavior should remain nearly unchanged.

Once retrieved, the malicious demonstrations influence the agent's planning and actions
through normal in-context learning.

## Evaluated Agent Types

The paper evaluates three real-world-style settings:

- a RAG-based autonomous-driving agent;
- a knowledge-intensive question-answering agent;
- a healthcare EHR agent.

This breadth matters because the targeted memory serves different purposes in each system:
planning examples, factual knowledge, or procedural context.

## Main Results

Across the three agents, the paper reports:

- average attack success above **80%**;
- benign-performance degradation below **1%**;
- poisoning rates below **0.1%**.

These three numbers form the security story. High attack success alone would be less
concerning if the memory were visibly corrupted or normal performance collapsed. Instead,
the attack is sparse and preserves ordinary behavior.

The trigger also shows transferability, meaning the attack is not limited to one exact model
or wording in the evaluated conditions.

## Defensive Implications

Agent memory should be treated as executable supply-chain input. A safer design would:

- authenticate who can write memories;
- separate user-specific and global memory;
- record provenance and immutable history;
- detect embedding-space clusters and anomalous nearest neighbors;
- require multiple independent sources for action-changing memories;
- test retrieval under paraphrased and adversarial triggers;
- inspect which memory entries influenced each action.

Content scanning alone is insufficient because the retrieval geometry is part of the attack.
A text can appear benign while being optimized to occupy a strategically useful embedding
region.

## Limitations

- The attack assumes some ability to add or modify memory or knowledge-base entries.
- Effectiveness depends on the retriever and embedding model.
- Three agent domains do not cover every tool-using architecture.
- Production systems may add authorization or provenance controls absent from the benchmark.
- The paper demonstrates a red-team attack, not a complete taxonomy of memory threats.

## Takeaways

1. Long-term memory is a persistent attack surface for LLM agents.
2. Embedding-optimized triggers can steer retrieval toward poisoned demonstrations.
3. AgentPoison requires no model retraining or parameter access.
4. The reported attack exceeds 80% average success with under 0.1% poisoning.
5. Memory provenance and retrieval observability are core security controls.

## Reference

Zhaorun Chen, Zhen Xiang, Chaowei Xiao, Dawn Song, and Bo Li. **"AgentPoison: Red-teaming
LLM Agents via Poisoning Memory or Knowledge Bases."**
[arXiv:2407.12784](https://arxiv.org/abs/2407.12784).
