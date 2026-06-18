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
year: 2024
source: "Chen et al. / arXiv"
difficulty: "Advanced"
takeaway: "A tiny set of poisoned memories can steer an agent when an optimized trigger makes those memories win retrieval."
why_added: "Agent memory is easy to treat as a convenience feature. I added this note because it makes memory provenance and retrieval behavior part of the security model."
why_matters: "An agent can be compromised without retraining its model. If an attacker can write to long-term memory or a RAG store, normal retrieval and in-context learning can carry the attack into planning."
what_i_learned: "I learned to audit the embedding path, not just the text. A memory can look harmless to a reviewer while being positioned to dominate nearest-neighbor retrieval for a trigger."
core_ideas:
  - "The attack poisons long-term memory or a RAG knowledge base instead of model weights."
  - "Trigger generation is optimized in embedding space to retrieve malicious demonstrations."
  - "Triggered tasks are steered while benign instructions keep normal performance."
  - "The paper evaluates autonomous-driving, question-answering, and healthcare agents."
  - "Reported attack success exceeds 80% with less than 0.1% poisoning and under 1% benign impact."
threat_model:
  system: "An LLM agent that retrieves memories, demonstrations, or knowledge before planning."
  attacker: "A user, integration, or data supplier able to add entries to shared memory."
  capability: "Insert a small number of optimized poison entries and deliver a trigger in a later instruction."
  failure: "The retriever selects malicious demonstrations that steer the agent's downstream action."
  deployment: "Persistent shared memory can turn one weak write path into a long-lived compromise across future sessions."
connections:
  - {label: "PoisonedRAG", href: "/talks/poisonedrag/", note: "Targeted poisoning of a retrieval knowledge base."}
  - {label: "AgentDojo", href: "/talks/agentdojo/", note: "A benchmark for testing attacks and defenses in tool-using agents."}
  - {label: "AI Red Teaming Systems", href: "/guides/red-teaming-ai-systems/", note: "Trust-boundary mapping for agent memory and tools."}
open_questions:
  - "How can a system detect embedding-space poison without blocking useful memories?"
  - "Should global and user-specific memories have separate trust and retention policies?"
  - "What evidence should an agent expose about the memories that influenced an action?"
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
