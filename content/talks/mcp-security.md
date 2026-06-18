---
title: "MCP Security: Tool Servers, Trust Boundaries, and Agent Takeover Risk"
description: "A critical explainer of a 2026 preprint claiming protocol-level MCP weaknesses in capability attestation, prompt origin authentication, and multi-server trust propagation."
speaker: "Adarsh Sarda"
event: "Independent study"
format: "Paper explainer"
track: "Agent security"
last_updated: "2026-06-18"
order: 13
paper_title: "Breaking the Protocol: Security Analysis of the Model Context Protocol Specification and Prompt Injection Vulnerabilities in Tool-Integrated LLM Agents"
paper_authors: ["Narek Maloyan", "Dmitry Namiot"]
paper_url: "https://arxiv.org/abs/2601.17549"
tags: ["mcp-security", "agent-security", "tool-servers", "prompt-injection", "protocol-security"]
year: 2026
source: "Maloyan and Namiot / arXiv preprint"
difficulty: "Advanced"
takeaway: "MCP security depends on authenticated tool identity, explicit capabilities, and isolation between servers, not only on safe model prompting."
why_added: "MCP is becoming part of real agent infrastructure. I added this note to track protocol-level risks early while keeping the evidence status of a recent preprint explicit."
why_matters: "A standard tool protocol can standardize both useful integration and unsafe trust assumptions. Capability claims, server-originated prompts, and cross-server influence need controls below the model layer."
what_i_learned: "The strongest lesson for me is to separate authenticated origin from authorized behavior. Signing a server message proves who sent it, but not that the user approved the resulting tool action."
core_ideas:
  - "The paper analyzes MCP as a protocol security boundary between hosts, models, and tool servers."
  - "It identifies gaps in capability attestation, prompt-origin authentication, and multi-server trust."
  - "MCPBench evaluates 847 attack scenarios across five server implementations."
  - "The preprint reports 23% to 41% higher attack success than its non-MCP comparison setups."
  - "The proposed MCPSec extension adds attestation and authentication but does not remove semantic injection risk."
threat_model:
  system: "An MCP host connected to one or more independently operated tool servers."
  attacker: "A malicious, compromised, or impersonated MCP server, or an attacker controlling server-returned content."
  capability: "Advertise capabilities, return model-visible data, or influence calls across a multi-server workflow."
  failure: "The agent accepts unauthorized capabilities, follows injected instructions, or propagates trust between servers."
  deployment: "Desktop agents and development tools increasingly connect community servers with access to files, accounts, and external services."
connections:
  - {label: "ToolEmu", href: "/talks/toolemu/", note: "A way to explore dangerous tool trajectories in a sandbox."}
  - {label: "AgentDojo", href: "/talks/agentdojo/", note: "A benchmark for tool-using agents operating over untrusted data."}
  - {label: "Indirect Prompt Injection", href: "/talks/indirect-prompt-injection/", note: "The underlying data-to-instruction failure that can enter through tool results."}
open_questions:
  - "Which MCP security claims hold under independent replication and peer review?"
  - "How should hosts display capability changes before users approve a server?"
  - "Can cross-server information flow be restricted without breaking useful orchestration?"
  - "What should a minimal MCP security regression suite contain?"
---

This 2026 preprint analyzes the Model Context Protocol (MCP) as a security architecture rather
than only as a tool-integration format. It argues that several trust assumptions are
protocol-level weaknesses and introduces an experimental benchmark and proposed extension.

> **Attribution and evidence status.** This is my critical explanation of Maloyan and Namiot.
> The paper is a recent arXiv preprint. Its protocol claims and numerical results should be
> treated as preliminary until independently reproduced and reviewed.

---

## Why MCP Needs Protocol-Level Analysis

MCP standardizes how applications expose tools and context to language models. Standardization
improves interoperability, but it can also standardize trust mistakes.

An MCP deployment may involve:

- a host controlling the agent;
- several independently operated servers;
- tool descriptions supplied by those servers;
- model-generated calls;
- results that return to the model as text.

Security therefore depends on who can claim capabilities, how message origin is authenticated,
and whether trust in one server leaks into another.

## Claimed Architectural Weaknesses

The paper identifies three main issues.

### Missing capability attestation

A server can describe tools and permissions, but the protocol does not inherently prove that
the claims correspond to an approved capability set. A malicious or replaced server may
present unexpected powers.

### Bidirectional sampling without origin authentication

Server-originated content can influence model sampling. Without strong origin and intent
binding, a server can become a prompt-injection channel.

### Implicit multi-server trust propagation

In an environment with several servers, data or instructions from one server may influence
calls to another. This creates cross-server confused-deputy and lateral-influence risks.

## MCPBench Evaluation

The authors introduce MCPBench to connect existing agent-security scenarios to MCP-compliant
infrastructure. The preprint reports:

- **847 attack scenarios**;
- **five MCP server implementations**;
- attack-success amplification of **23% to 41%** compared with equivalent non-MCP integrations.

These results support the paper's claim that the issue is not limited to one faulty server,
although the benchmark design and comparison deserve independent scrutiny.

## Proposed MCPSec Extension

The paper proposes a backward-compatible extension adding:

- capability attestation;
- message authentication;
- stronger origin binding.

The authors report a reduction in attack success from **52.8% to 12.4%**, with median
latency overhead of **8.3 milliseconds** per message.

This is promising but should not be read as a complete solution. Authentication proves origin;
it does not prove that authenticated content is safe or that the user authorized the
resulting action.

## Practical Defensive Lessons

Regardless of the paper's final peer-review outcome, MCP deployments benefit from:

1. explicit per-server capability allowlists;
2. signed and pinned server identities;
3. user approval for new or changed tools;
4. isolation between server outputs and privileged instructions;
5. authorization at tool-execution time;
6. provenance attached to every model-visible result;
7. cross-server data-flow monitoring;
8. rapid revocation for compromised servers.

## Limitations

- The work is a recent preprint, not settled consensus.
- Five server implementations cannot represent the complete ecosystem.
- Benchmark comparisons depend on how equivalent non-MCP integrations are constructed.
- Lower attack success under MCPSec does not eliminate semantic prompt injection.
- Real hosts may already add controls outside the base protocol.

## Takeaways

1. Tool protocols create security boundaries between hosts, models, and servers.
2. Capability claims and message origin need cryptographic and policy enforcement.
3. Multi-server deployments introduce trust-propagation risk.
4. The paper reports 847 scenarios and substantial MCP-related attack amplification.
5. Its findings are important but preliminary and require independent validation.

## Reference

Narek Maloyan and Dmitry Namiot. **"Breaking the Protocol: Security Analysis of the Model
Context Protocol Specification and Prompt Injection Vulnerabilities in Tool-Integrated LLM
Agents."** [arXiv:2601.17549](https://arxiv.org/abs/2601.17549).
