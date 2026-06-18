---
title: "ToolEmu: Sandboxing Failure Modes in AI Agents"
description: "A paper explainer on using an LM-emulated tool sandbox and automated safety evaluator to discover high-stakes failures before connecting agents to real systems."
speaker: "Adarsh Sarda"
event: "Independent study"
format: "Paper explainer"
track: "Agent security"
last_updated: "2026-06-18"
order: 12
paper_title: "Identifying the Risks of LM Agents with an LM-Emulated Sandbox"
paper_authors: ["Yangjun Ruan", "Honghua Dong", "Andrew Wang", "Silviu Pitis", "Yongchao Zhou", "Jimmy Ba", "Yann Dubois", "Chris J. Maddison", "Tatsunori Hashimoto"]
paper_url: "https://arxiv.org/abs/2309.15817"
tags: ["agent-security", "tool-use", "sandboxing", "risk-evaluation", "llm-agents"]
year: 2023
source: "Ruan et al. / arXiv"
difficulty: "Intermediate"
takeaway: "LM-emulated tools make it possible to discover dangerous agent trajectories before connecting the agent to real high-stakes systems."
why_added: "I want future agent projects to have a practical safety test harness. ToolEmu is useful because it treats simulation as a way to search for failures, not as proof that the real system is safe."
why_matters: "Real tool integrations are expensive and risky to test at scale. Without a sandbox, rare failures involving privacy, money, or irreversible actions may remain undiscovered until deployment."
what_i_learned: "The framework made me separate discovery from validation. An emulator can search widely, but important findings still need confirmation against a controlled real implementation."
core_ideas:
  - "A language model simulates tool execution and environment state."
  - "A second model evaluates complete agent trajectories for safety failures."
  - "The initial benchmark covers 36 high-stakes tools and 144 test cases."
  - "Human review judged 68.8% of identified failures as valid real-world failures."
  - "Even the safest evaluated agent shows failures in 23.9% of cases under the paper's evaluator."
threat_model:
  system: "An LLM agent with access to consequential tools such as finance, messaging, or cloud operations."
  attacker: "The framework tests unsafe conditions broadly, including malicious input and risky user requests."
  capability: "Influence the task, tool data, or environment state presented to the agent."
  failure: "The agent takes an unsafe action, leaks data, or proceeds without adequate confirmation."
  deployment: "High-stakes tool integrations need failure discovery before real credentials and side effects are enabled."
connections:
  - {label: "AgentDojo", href: "/talks/agentdojo/", note: "A benchmark focused on user goals, attacker goals, and prompt injection."}
  - {label: "MCP Security", href: "/talks/mcp-security/", note: "Applies tool-boundary questions to a standard agent protocol."}
  - {label: "AI Red Teaming Systems", href: "/guides/red-teaming-ai-systems/", note: "A broader engagement process for validating and reporting agent failures."}
open_questions:
  - "How should emulator uncertainty be included in reported risk estimates?"
  - "Which simulated failures deserve expensive real-system validation first?"
  - "Can tool emulation generate adversarial states that human testers would not anticipate?"
---

ToolEmu addresses a practical barrier in agent safety: testing dangerous tool interactions
normally requires building every environment and risking real side effects. The framework
uses a language model to emulate tools so agents can be tested against high-stakes scenarios
inside a synthetic sandbox.

> **Attribution and scope.** This is my explanation of Ruan et al. ToolEmu and the reported
> benchmark results are the authors' work.

---

## Why Agent Risk Is Expensive to Test

An agent connected to email, finance, cloud infrastructure, or health systems can cause harm
through an apparently reasonable sequence of tool calls. Discovering those failures manually
requires:

- implementing each tool;
- constructing realistic state;
- defining risky scenarios;
- preventing tests from affecting real users;
- judging whether a trajectory was unsafe.

These costs make rare, high-impact failures especially easy to miss.

## The ToolEmu Approach

ToolEmu uses an LM as a tool emulator. Instead of calling a real API, the agent interacts with
a model that simulates the API's response and environment state.

A second LM-based evaluator reviews the trajectory and estimates safety risk. This creates a
pipeline:

1. define a tool and adversarial or high-risk scenario;
2. let the agent reason and call the emulated tool;
3. simulate the tool result;
4. evaluate the complete trajectory for failures.

The sandbox enables broad exploration without creating the corresponding real-world damage.

## Evaluation Setup

The initial benchmark includes:

- **36 high-stakes tools**;
- **144 test cases**;
- scenarios involving privacy, financial loss, and other consequential outcomes.

The authors validate the emulator and evaluator with human assessment. They report that
**68.8%** of failures identified through ToolEmu would correspond to valid real-world agent
failures.

Even the safest evaluated agent exhibits failures in **23.9%** of cases according to the
paper's evaluator.

## What the Framework Reveals

Agent failures are often trajectory-level rather than single-output errors. Examples include:

- acting without sufficient confirmation;
- exposing private information through a legitimate tool;
- selecting an irreversible operation without checking assumptions;
- following an ambiguous request too aggressively;
- failing to recover after an unexpected tool response.

This means ordinary chatbot safety evaluation is insufficient. The object under test is the
model, tools, state, policy, and sequence of decisions together.

## How to Use an Emulated Sandbox Carefully

Simulation improves coverage but introduces model-on-model uncertainty. A robust process
should:

- validate critical failures in a controlled real implementation;
- calibrate the evaluator against human reviewers;
- record disagreements and false positives;
- distinguish emulator errors from agent errors;
- vary scenario wording and environmental state;
- convert confirmed failures into deterministic regression tests where possible.

The emulator is a discovery tool, not final proof of production impact.

## Limitations

- The tool emulator may produce unrealistic responses.
- The automated evaluator can misclassify safety outcomes.
- The initial 36 tools and 144 cases do not cover all agent domains.
- A simulated failure still requires validation against the real system.
- Results depend on both the agent model and the models used for emulation and evaluation.

## Takeaways

1. Agent safety failures emerge across complete tool-use trajectories.
2. LM-emulated tools make high-risk testing cheaper and safer.
3. ToolEmu starts with 36 tools and 144 test cases.
4. Human evaluation judged 68.8% of identified failures as valid real-world failures.
5. Simulation should support, not replace, controlled real-system validation.

## Reference

Yangjun Ruan et al. **"Identifying the Risks of LM Agents with an LM-Emulated Sandbox."**
[arXiv:2309.15817](https://arxiv.org/abs/2309.15817).
