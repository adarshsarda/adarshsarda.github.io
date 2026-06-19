---
type: project-idea
slug: hardware-agent-security
title: "Security Evaluation of a Hardware-Connected LLM Agent"
status: in-progress
module: "AI Project module"
summary: "Map and attack a real sensor -> agent -> tool-call -> physical-action loop on an existing Home Assistant / Raspberry Pi testbed, scoring findings as success rates with CIs."
tags: [agent-security, threat-modelling, tool-abuse, red-teaming]
---

# Security Evaluation of a Hardware-Connected LLM Agent

*Repo-internal idea note. Not a public page. This is the AI Project module direction.*

## Why this, not a chatbot/RAG app
Everyone builds those. Almost no student has a real cyber-physical agent to attack. The
existing Home Assistant / Raspberry Pi setup is a rare testbed, and it fits the degree's
"AI for Industrial Applications" framing.

## The loop under test
`sensor reading -> LLM agent -> tool/function call -> physical actuator`

## Attacks to evaluate
- Prompt injection (direct, and indirect via sensor/text fields the agent reads)
- Sensor poisoning (manipulated readings steering agent decisions)
- Tool-description poisoning (malicious metadata in a tool the agent can call)
- Memory manipulation (corrupting stateful context across turns)

## Method (reuse ODSB discipline)
Pre-registered thresholds; objective success criteria; per-attack success *rates* with CIs;
a documented threat model; and concrete mitigations per finding. Authorized-scope only — the
target is hardware I own.

## Output
A findings report mapped to OWASP LLM Top 10 / MITRE ATLAS, plus mitigations. Publishable if
executed well; at minimum a strong R-02 case file.

## TODO
- Confirm exact hardware + agent framework in the current setup.
- Decide scope: how many attack classes are realistic in the module timeline.
