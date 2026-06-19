---
type: project-idea
slug: redteam-agent
title: "Methodology-Driven Red-Team Agent"
status: planned
summary: "An agent that runs my own red-teaming methodology against an authorized target LLM system and reports findings as success rates mapped to OWASP/ATLAS."
tags: [red-teaming, agent-security, model-evaluation]
---

# Methodology-Driven Red-Team Agent

*Repo-internal idea note. The Phase 3 flagship tool — not a portfolio chatbot.*

## What it is
An agent that walks my six-phase red-teaming methodology against a target LLM system I am
authorized to test, executes a catalog of probes, scores them as success *rates* with CIs
(not pass/fail), and emits a report mapped to OWASP LLM Top 10 / MITRE ATLAS.

## Why it fits me
It operationalizes my own guide, embodies "measure statistically," and is defensive tooling.
It's the connective tissue: it can test the hardware-agent project and (later) VLM agents.

## Minimal architecture
Orchestrator (phases) -> target adapter (sends prompts to a sandbox I control) -> probe
library (structured techniques from `content/redteam/`) -> scorer (objective criteria where
possible; LLM-judge with stated fallibility) -> aggregator (rates + CIs) -> reporter.

## Scope discipline (built in)
Records rules-of-engagement; runs only against a local deliberately-vulnerable sandbox or
systems with explicit authorization. Findings + mitigations, not weaponization.

## What it needs from the KB
A structured `redteam/` section: techniques (with OWASP/ATLAS mapping + objective success
criteria), a taxonomy, a scoring rubric, a report template, and a rules-of-engagement doc.

## TODO
- Stand up the local vulnerable-LLM sandbox.
- Author the first 3-4 structured techniques.
