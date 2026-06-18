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
