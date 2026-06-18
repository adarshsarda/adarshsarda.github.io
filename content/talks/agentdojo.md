---
title: "AgentDojo: How to Stress-Test Tool-Using AI Agents"
description: "A benchmark explainer for evaluating whether tool-using agents can complete realistic user tasks while resisting prompt injections hidden in untrusted tool data."
speaker: "Adarsh Sarda"
event: "Independent study"
format: "Paper explainer"
track: "Agent security"
last_updated: "2026-06-18"
order: 6
paper_title: "AgentDojo: A Dynamic Environment to Evaluate Prompt Injection Attacks and Defenses for LLM Agents"
paper_authors: ["Edoardo Debenedetti", "Jie Zhang", "Mislav Balunović", "Luca Beurer-Kellner", "Marc Fischer", "Florian Tramèr"]
paper_url: "https://arxiv.org/abs/2406.13352"
tags: ["agent-security", "prompt-injection", "benchmarking", "tool-use", "llm-evaluation"]
---

AgentDojo turns agent security into an evaluation problem with two simultaneous objectives:
complete the user's legitimate task and resist an attack embedded in data returned by tools.
That pairing is important because a defense that blocks every action is secure but useless.

> **Attribution and scope.** This is my explanation of Debenedetti et al. AgentDojo, its
> tasks, test cases, and results are the authors' work.

---

## The Agent Security Problem

Tool-using agents operate across two instruction channels:

- the user and system prompt define the intended task;
- emails, documents, websites, and tool outputs provide data.

An indirect prompt injection places malicious instructions in the second channel. The model
may treat those instructions as authoritative and use its tools to pursue an attacker goal.

Evaluating only task completion misses security. Evaluating only whether an attack succeeds
misses whether the agent was useful in the first place.

## What AgentDojo Provides

AgentDojo is an extensible environment rather than a frozen list of prompts. The initial
release includes:

- **97 realistic user tasks**;
- **629 security test cases**;
- scenarios involving email, e-banking, travel booking, and other tool workflows;
- attacks and defenses drawn from existing prompt-injection research.

Each security case combines a legitimate user task, untrusted data, and an attacker objective.
This makes it possible to measure utility and security separately.

## Evaluation Logic

A useful agent-security matrix has four broad outcomes:

| User task | Attacker goal | Interpretation |
|---|---|---|
| Success | Failure | Desired secure behavior |
| Success | Success | Useful but compromised |
| Failure | Failure | Safe but ineffective |
| Failure | Success | Complete security failure |

This framing prevents defenses from receiving credit merely for making the agent unable to
act.

## Main Findings

The benchmark challenges both sides:

- state-of-the-art agents fail many legitimate tasks even without attacks;
- existing prompt-injection attacks compromise some security properties but not every case;
- defenses often trade utility for safety;
- adaptive evaluation is necessary because attacks evolve in response to defenses.

The paper therefore resists a simple headline such as "agents are always compromised." Its
stronger contribution is a reproducible environment in which that claim can be measured per
task, tool, model, attack, and defense.

## Design Lessons for Agent Builders

AgentDojo suggests several engineering requirements:

1. Model tool data as untrusted input.
2. Specify user and attacker goals independently.
3. Enforce authorization outside the language model.
4. Evaluate utility under clean conditions before measuring defenses.
5. Test adaptive attacks rather than only static prompt strings.
6. Preserve a trace linking each tool call to the user-authorized objective.

The benchmark can also serve as a regression suite. A successful injection should become a
permanent test case after remediation.

## Limitations

- Simulated tasks cannot capture every production integration.
- Results depend on the selected models, tools, attacks, and defenses.
- Benchmark success does not prove security against a novel adaptive adversary.
- Some failures may originate from weak task execution rather than prompt injection.
- Real deployments add authentication, organizational policy, and human approval flows.

## Takeaways

1. Agent security must measure utility and attacker success separately.
2. AgentDojo includes 97 tasks and 629 security test cases.
3. Tool-returned data is an instruction-injection boundary.
4. Current attacks and defenses are both incomplete.
5. Extensible, adaptive benchmarks are more useful than a static jailbreak list.

## Reference

Edoardo Debenedetti, Jie Zhang, Mislav Balunović, Luca Beurer-Kellner, Marc Fischer, and
Florian Tramèr. **"AgentDojo: A Dynamic Environment to Evaluate Prompt Injection Attacks and
Defenses for LLM Agents."** [arXiv:2406.13352](https://arxiv.org/abs/2406.13352).
