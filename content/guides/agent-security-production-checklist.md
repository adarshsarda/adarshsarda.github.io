---
type: guide
slug: agent-security-production-checklist
title: "Agent Security Before Production: A Pre-Launch Checklist"
description: "A practical checklist for reviewing tool-using LLM agents before release, covering tool authority, untrusted data, memory, third-party skills, long-horizon attacks, approvals, and regression tests."
author: "Adarsh Sarda"
order: 2
last_updated: "2026-07-06"
sources:
  - "https://arxiv.org/abs/2406.13352"
  - "https://arxiv.org/abs/2507.20526"
  - "https://arxiv.org/abs/2602.16901"
  - "https://arxiv.org/abs/2602.20156"
  - "https://arxiv.org/abs/2604.02022"
  - "https://arxiv.org/abs/2605.10779"
  - "https://arxiv.org/abs/2606.04329"
  - "https://genai.owasp.org/llm-top-10/"
  - "https://genai.owasp.org/initiatives/agentic-security-initiative/"
tags: ["agent-security", "tool-use", "prompt-injection", "threat-modelling", "risk-evaluation"]
---

This note is the pre-production checklist I would use for a tool-using LLM agent. The core
question is not "does the model refuse bad prompts?" It is: **can the system prove that each
tool call, memory write, and external action follows from the user's authorized goal?**

Recent work gives a clear warning. AgentDojo separates clean task utility from
attacker-goal success. ART, AgentLAB, ATBench, Skill-Inject, LITMUS, and the 2026 memory
poisoning work all show variants of the same problem: agent failures often emerge across
tools, memory, skills, files, browsers, and long multi-step trajectories, not in a single
chat response.

> **Scope and authorization.** Run these checks only on systems you own or are explicitly
> authorized to test. The purpose is release hardening and regression testing, not public
> probing of other people's agents.

---

## Why Agents Need Their Own Security Gate

A chatbot can be wrong. An agent can be wrong **with permissions**.

That changes the release bar. If an assistant can send email, move files, spend money, modify
code, browse authenticated sites, write long-term memory, or call internal APIs, then model
behavior is only one layer of the risk. The rest is system security:

- what tools exist;
- which credentials each tool carries;
- what data the model can read before acting;
- whether tool results are treated as untrusted;
- how memory is written and recalled;
- which third-party skills or MCP servers enter the context;
- which actions require approval;
- whether logs can reconstruct the decision path.

The release gate should test the full **agent loop** across model behavior, tools, memory,
permissions, and external effects.

## Trust-Boundary Inventory

Before writing attacks, record the system's boundaries. If this table is incomplete, the test
will drift into prompt collecting.

| Boundary | Failure to look for | Evidence to record |
|---|---|---|
| User request -> planner | The agent invents or changes the user's goal | Original user goal, generated plan, divergence point |
| External data -> model | Tool output or documents act like instructions | Source ownership, retrieved content, model-visible context |
| Model -> tool call | The model calls a tool without valid authority | Tool name, parameters, authorization check, side effect |
| Tool result -> next step | A result changes policy, role, or objective | Result text, next plan step, whether it was trusted |
| Model -> memory write | Untrusted content becomes persistent preference or fact | Memory payload, source, scope, expiry, later retrieval |
| Skill/plugin/server -> model | Third-party instructions override local policy | Skill source, capability, injected instruction, resulting action |
| Model output -> renderer | Links, markdown, code, or UI actions leak data | Rendered output, egress behavior, sanitization result |

## Checklist 1: Tool Authority

Every tool needs an authority model alongside its description.

- [ ] List every tool, credential, permission scope, and side effect.
- [ ] Mark tools as read-only, reversible write, irreversible write, financial, external-communication, code-execution, or privileged admin.
- [ ] Require server-side authorization for each sensitive call; do not rely on the model to self-police.
- [ ] Bind tool calls to the user's current goal, not to a vague conversation-level intent.
- [ ] Force confirmation for high-impact actions and show the exact target, parameters, and consequence.
- [ ] Log tool-call justification separately from model prose.

**Release gate:** the agent must fail closed when a tool call is useful but not authorized.

## Checklist 2: Untrusted Data

Agents regularly read content the user did not write: emails, web pages, documents, tickets,
calendar entries, API results, and tool errors. Treat all of that as data, never as
instructions.

- [ ] Label every external content block as untrusted in the internal representation.
- [ ] Prevent retrieved/tool-returned text from modifying system policy, tool permissions, or user goals.
- [ ] Test indirect prompt injection through each data source, including files, APIs, and tool errors.
- [ ] Strip or neutralize active content before rendering model output.
- [ ] Apply egress allowlists for links, images, webhooks, and browser requests.
- [ ] Test whether the agent can be persuaded to summarize, forward, upload, or embed private data.

**Measurement:** report both clean-task success and attacker-goal success. A defense that
breaks the user's task is not a production solution.

## Checklist 3: Memory

Persistent memory is a privilege escalation surface. The 2026 MPBench paper frames this well:
memory poisoning turns untrusted input into trusted future context, and agents that write and
retrieve memory aggressively are more exploitable.

- [ ] Identify all memory write channels: explicit user instruction, implicit summarization, tool result, environment observation, and self-reflection.
- [ ] Store provenance with every memory item.
- [ ] Scope memory by user, workspace, project, and sensitivity.
- [ ] Add expiry or review for memories derived from external content.
- [ ] Block memory writes that contain instructions about future tool use unless explicitly approved.
- [ ] Test whether one poisoned memory changes behavior in later clean tasks.

**Release gate:** no memory item should become more trusted than its source.

## Checklist 4: Skills, Plugins, and Tool Servers

Third-party skills and MCP servers are agent supply chain inputs. Skill-Inject reports 202
injection-task pairs and shows that harmful instructions can be hidden inside otherwise useful
skill files. The lesson is not "never use skills"; it is that skills need review, pinning,
and runtime limits.

- [ ] Pin skill/plugin/server versions and owners.
- [ ] Review tool descriptions as executable influence, not documentation.
- [ ] Show users when a new server or skill adds capabilities.
- [ ] Keep per-server allowlists and deny cross-server privilege borrowing.
- [ ] Require re-approval when a tool schema, prompt, or capability changes.
- [ ] Disable unused tools by default.

**Release gate:** installing a helper package must not silently expand what the agent can do.

## Checklist 5: Long-Horizon Behavior

Single-turn tests are necessary but weak. AgentLAB evaluates five long-horizon attack classes
across 28 environments and 644 test cases; ATBench uses trajectory-level safety evaluation;
LITMUS adds OS-level verification because an agent can verbally refuse while the dangerous
operation already happened.

For pre-production, include trajectories that test:

- intent hijacking: the agent's plan drifts toward an attacker goal;
- tool chaining: harmless calls combine into a harmful side effect;
- task injection: environment data adds new tasks;
- objective drifting: the agent gradually changes success criteria;
- memory poisoning: one step plants state that matters later;
- execution mismatch: the response says "I did not do it" while the system did it.

**Measurement:** score the whole trajectory, including side effects and intermediate tool calls.

## Minimal Test Matrix

Use this as the first pass before building a larger benchmark.

| Scenario | Clean user goal | Attacker influence | Expected secure behavior |
|---|---|---|---|
| Email assistant | Summarize inbox | One email contains hostile instructions | Summarize content, ignore instructions |
| File agent | Organize project files | A README asks the agent to delete or upload files | Refuse unauthorized file action |
| Browser agent | Compare vendors | One vendor page asks for credential exfiltration | Treat page as source data only |
| Memory agent | Remember user preference | External content requests a future behavior change | Do not persist untrusted instruction |
| Coding agent | Run tests | Dependency/tool output requests command execution | Require user-authorized command path |
| MCP host | Use two servers | Server A influences calls to Server B | Enforce per-server boundaries |

Run each scenario in clean and attacked form. Report:

- task success rate;
- attacker-goal success rate;
- unsafe tool-call rate;
- confirmation-bypass rate;
- false refusal rate;
- memory persistence rate;
- recovery/rollback success.

## Production Release Gates

I would block release if any of these are true:

1. A high-impact tool can run without server-side authorization.
2. Tool-returned or retrieved text can change policy, tool permissions, or user goal.
3. Memory can persist untrusted instructions without provenance and review.
4. A third-party skill/server can silently add capabilities.
5. The system cannot reconstruct why a sensitive tool call happened.
6. Semantic refusal checks pass, but the side effect still occurs.
7. The mitigation only works by destroying clean-task utility.

## What To Ship With The Agent

Security work should not end as a PDF.

- a tool permission inventory;
- an attack-surface map;
- regression tests for every confirmed injection path;
- log schema for tool calls, approvals, memory writes, and source provenance;
- rollback paths for reversible actions;
- a periodic retest schedule, especially after model, tool, retriever, or skill changes.

## Limitations

This checklist does not prove an agent is secure. It is a minimum release discipline. Real
deployments need domain-specific policy, user research, privacy review, abuse monitoring, and
incident response. Also, many cited 2026 agent-security papers are recent preprints or fresh
benchmarks; treat their exact numbers as evidence for test design, not universal failure rates.

## References

- Edoardo Debenedetti et al. **"AgentDojo: A Dynamic Environment to Evaluate Prompt Injection Attacks and Defenses for LLM Agents."** [arXiv:2406.13352](https://arxiv.org/abs/2406.13352).
- Andy Zou et al. **"Security Challenges in AI Agent Deployment: Insights from a Large Scale Public Competition."** [arXiv:2507.20526](https://arxiv.org/abs/2507.20526).
- Tanqiu Jiang et al. **"AgentLAB: Benchmarking LLM Agents against Long-Horizon Attacks."** [arXiv:2602.16901](https://arxiv.org/abs/2602.16901).
- David Schmotz et al. **"Skill-Inject: Measuring Agent Vulnerability to Skill File Attacks."** [arXiv:2602.20156](https://arxiv.org/abs/2602.20156).
- Yu Li et al. **"ATBench: A Diverse and Realistic Agent Trajectory Benchmark for Safety Evaluation and Diagnosis."** [arXiv:2604.02022](https://arxiv.org/abs/2604.02022).
- Chiyu Zhang et al. **"LITMUS: Benchmarking Behavioral Jailbreaks of LLM Agents in Real OS Environments."** [arXiv:2605.10779](https://arxiv.org/abs/2605.10779).
- Pritam Dash et al. **"From Untrusted Input to Trusted Memory"** (introduces the MPBench memory-poisoning benchmark). [arXiv:2606.04329](https://arxiv.org/abs/2606.04329).
- OWASP. **LLM Top 10 for 2025** and **Agentic Security Initiative**. [genai.owasp.org](https://genai.owasp.org/).
