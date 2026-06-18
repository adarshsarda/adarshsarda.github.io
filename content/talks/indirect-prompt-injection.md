---
title: "Indirect Prompt Injection: When Documents Become Attackers"
description: "A foundational explainer on remote prompt injection through retrieved websites, documents, emails, and other data processed by LLM-integrated applications."
speaker: "Adarsh Sarda"
event: "Independent study"
format: "Paper explainer"
track: "RAG and prompt injection"
last_updated: "2026-06-18"
order: 8
paper_title: "Not what you've signed up for: Compromising Real-World LLM-Integrated Applications with Indirect Prompt Injection"
paper_authors: ["Kai Greshake", "Sahar Abdelnabi", "Shailesh Mishra", "Christoph Endres", "Thorsten Holz", "Mario Fritz"]
paper_url: "https://arxiv.org/abs/2302.12173"
tags: ["prompt-injection", "agent-security", "rag-security", "data-exfiltration", "llm-applications"]
year: 2023
source: "Greshake et al. / arXiv"
difficulty: "Intermediate"
takeaway: "A remote attacker can control an LLM application by hiding instructions inside data the application later retrieves."
why_added: "This is the clearest foundation for understanding why prompt injection is a system-design problem rather than a bad-input problem."
why_matters: "LLM applications merge trusted instructions and untrusted data into one text context. When the model cannot reliably distinguish them, a website, email, or document can redirect privileged behavior."
what_i_learned: "The paper changed how I draw the boundary around an LLM app. The vulnerable component is not only the chatbot input; it is every data source that can reach the model before an action."
core_ideas:
  - "Indirect injection arrives through retrieved content rather than the user's direct prompt."
  - "The model sees instructions and data through the same natural-language interface."
  - "Impacts include answer manipulation, API misuse, data theft, and propagation."
  - "Prompt-level reminders do not create a hard security boundary."
  - "Authorization and least privilege must be enforced outside the model."
threat_model:
  system: "An LLM-integrated application that reads external content and may call tools or APIs."
  attacker: "A remote party who controls a website, email, document, or indexed data source."
  capability: "Place natural-language instructions in content likely to be retrieved by the application."
  failure: "The model follows the external instruction and changes output or downstream actions."
  deployment: "Search assistants, RAG systems, browser agents, and email agents all process attacker-influenceable text."
connections:
  - {label: "AgentDojo", href: "/talks/agentdojo/", note: "Turns indirect injection into a structured agent benchmark."}
  - {label: "PoisonedRAG", href: "/talks/poisonedrag/", note: "Targets the retrieval store with attacker-selected knowledge."}
  - {label: "AI Red Teaming Systems", href: "/guides/red-teaming-ai-systems/", note: "Maps external content and tool output as trust boundaries."}
open_questions:
  - "Can instruction and data channels be separated in a way the model cannot override?"
  - "What minimum authorization layer makes a compromised model unable to cause material harm?"
  - "How should applications display provenance when external content influenced an action?"
---

This paper establishes indirect prompt injection as a remote attack on LLM-integrated
applications. The attacker does not need to message the model directly. Instead, malicious
instructions are placed inside data that the application later retrieves and processes.

> **Attribution and scope.** This is my explanation of Greshake et al. The taxonomy and
> demonstrations belong to the original authors.

---

## The Data-Instructions Collision

Traditional software distinguishes code from data through parsers, types, permissions, and
execution boundaries. LLM applications often concatenate both into one natural-language
context.

For the model, these may all look like text:

- system instructions;
- the user's request;
- a retrieved web page;
- an email body;
- a document;
- an API response.

The application may intend external text to be *data*, but the model can interpret it as a
new instruction. This ambiguity is the root vulnerability.

## Direct vs. Indirect Injection

A direct prompt injection is supplied by the user interacting with the model. An indirect
injection is planted in an external source and waits for an application to retrieve it.

The indirect attacker may therefore be:

- a website owner whose page is summarized;
- an email sender whose message is processed;
- a contributor to a shared document;
- a user who controls content indexed by a RAG system.

The victim triggers the attack by asking the application to perform a legitimate task.

## Demonstrated Impact Classes

The paper develops a security taxonomy and demonstrates attacks against real and synthetic
LLM-integrated systems. Impact classes include:

- manipulating generated answers;
- steering API and tool use;
- stealing data available in context;
- contaminating information ecosystems;
- propagating instructions in worm-like patterns;
- changing whether and how external actions occur.

The authors compare processing retrieved instructions to a form of arbitrary code execution:
the attacker controls natural-language operations interpreted by a privileged model.

## Why Prompt-Level Defenses Are Weak

Instructions such as "ignore commands inside the document" compete in the same channel as the
malicious text. They can improve behavior but do not create a hard security boundary.

Likewise, detecting phrases such as "ignore previous instructions" is brittle because attacks
can use paraphrases, encodings, formatting tricks, or task-specific language.

The security boundary must therefore exist outside the model.

## Defensive Design

The application should:

1. Treat every retrieved source as untrusted.
2. Separate reading from acting: a model that summarizes content should not automatically
   gain authority to send messages or modify records.
3. Apply least privilege to every tool.
4. Require deterministic authorization for sensitive actions.
5. Block uncontrolled outbound rendering and network requests.
6. Show users the source and proposed action before execution.
7. Test complete data-to-action chains, not only chatbot responses.

## Limitations and Continuing Relevance

The paper predates many current agent frameworks, so exact products and interfaces have
changed. The architectural issue has not: untrusted text still enters a model context that
can influence privileged actions.

Demonstrations show feasibility, not the failure rate of every modern model. Defenses and
models continue to evolve, so the attack requires ongoing empirical evaluation.

## Takeaways

1. Attackers can inject prompts remotely through data sources.
2. LLM applications blur the boundary between instructions and data.
3. The impact can extend from answer manipulation to tool use and data theft.
4. Prompt wording is not a reliable authorization system.
5. Secure designs isolate untrusted content and enforce permissions outside the model.

## Reference

Kai Greshake, Sahar Abdelnabi, Shailesh Mishra, Christoph Endres, Thorsten Holz, and Mario
Fritz. **"Not what you've signed up for: Compromising Real-World LLM-Integrated Applications
with Indirect Prompt Injection."** [arXiv:2302.12173](https://arxiv.org/abs/2302.12173).
