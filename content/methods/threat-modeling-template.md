---
type: method
slug: threat-modeling-template
title: "Threat Modeling Template (LLM / AI systems)"
tags: [threat-modelling, red-teaming, methodology]
related: [guides/red-teaming-ai-systems]
---

# Threat Modeling Template — AI / LLM Systems

A fill-in template I use to scope a system before testing it. Map to NIST AI RMF (Map),
OWASP LLM Top 10, and MITRE ATLAS where relevant.

## System under test
- What is the system, and what does it do?
- Components: model(s), retrieval/RAG, tools/actuators, memory, data sources.

## Assets
- What is worth protecting? (User data, system prompt, downstream actions, integrity.)

## Attacker
- Who? Capability? (Query-only / can supply content into context / can poison training /
  controls a tool the agent calls.)
- Realistic distribution channel? (e.g. a poisoned dataset or adapter from a public hub.)

## Attack surface & trust boundaries
- Where does untrusted input enter? (User turns, retrieved documents, tool outputs, memory.)
- Which boundaries does the system wrongly trust?

## Failure modes to probe
- [ ] Prompt injection (direct / indirect)  → OWASP LLM01
- [ ] Sensitive information / system-prompt disclosure → OWASP LLM06/LLM07
- [ ] Training-data / model poisoning, backdoors → OWASP LLM03; ATLAS poisoning techniques
- [ ] Tool / plugin abuse, excessive agency → OWASP LLM08
- [ ] RAG / retrieval poisoning
- [ ] Memory manipulation (for stateful agents)

## Why detection is hard
- What makes each failure mode evade simple filters? (Natural-language triggers, semantic
  not lexical, realistic conversation patterns, etc.)

## Mitigations
- For each plausible failure mode, the candidate control and its cost / false-positive risk.
