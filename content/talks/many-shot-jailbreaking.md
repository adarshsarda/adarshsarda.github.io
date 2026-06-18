---
title: "Many-Shot Jailbreaking: When More Context Means More Risk"
description: "A paper explainer on long-context attacks that use hundreds of undesirable in-context demonstrations to override safety behavior."
speaker: "Adarsh Sarda"
event: "Independent study"
format: "Paper explainer"
track: "RAG and prompt injection"
last_updated: "2026-06-18"
order: 10
paper_title: "Many-shot Jailbreaking"
paper_authors: ["Cem Anil et al."]
paper_venue: "NeurIPS 2024"
paper_url: "https://openreview.net/forum?id=cw5mgd71jW"
tags: ["jailbreaking", "long-context", "in-context-learning", "alignment", "llm-security"]
---

Many-shot jailbreaking turns a capability improvement into an attack surface. Modern models
can learn behavior from hundreds of examples in a long prompt. The attack fills that context
with fabricated conversations in which an assistant repeatedly complies with undesirable
requests, then appends a new target request.

> **Attribution and scope.** This is my explanation of Anil et al. The examples and results
> belong to the paper's authors; operational harmful prompts are intentionally omitted.

---

## Why Long Context Changes Safety

Safety training teaches a model to refuse certain requests. In-context learning simultaneously
teaches it to continue patterns demonstrated in the current prompt.

Many-shot jailbreaking creates a conflict:

- the model's trained policy says to refuse;
- hundreds of contextual examples say that the local conversational pattern is compliance.

As context windows expand, the attacker can provide enough demonstrations for the second
signal to dominate.

## Attack Construction

The prompt contains many fabricated user-assistant exchanges. Each exchange demonstrates the
undesired behavior. The final user message asks a new target question.

No model weights are changed. The attack uses ordinary inference-time input and the model's
legitimate ability to infer a task from examples.

The method is simple compared with token-optimization attacks. Its resource is context length.

## Scaling Behavior

The authors evaluate widely used closed-weight models across multiple tasks. Attack
effectiveness increases with the number of demonstrations and follows an approximate power-law
relationship up to hundreds of shots in the reported experiments.

This scaling result is more important than one model's success rate. It suggests that:

- a short-context evaluation may underestimate risk;
- new larger context windows can expose attacks absent from earlier versions;
- stronger in-context learning may improve both useful adaptation and malicious steering.

## Mitigation Ideas

The paper evaluates mitigation approaches, but no simple technique closes the problem without
trade-offs. Defensive directions include:

- classifying the full context rather than only the final request;
- limiting or summarizing untrusted demonstrations;
- reinforcing safety instructions near the end of the context;
- fine-tuning against many-shot patterns;
- separating trusted demonstrations from user-controlled context.

Context sanitization must preserve legitimate few-shot and long-document use cases, which
makes aggressive filtering costly.

## Evaluation Lessons

Long-context safety testing should vary:

- number of demonstrations;
- topic and ordering;
- ratio of benign to undesirable examples;
- position of the target request;
- model and context-window size;
- mitigation placement.

Testing one fixed prompt length can conceal a scaling trend that appears only after dozens or
hundreds of examples.

## Limitations

- The attack can require a large token budget.
- Effectiveness varies by model and task.
- Provider interfaces, context limits, and safety systems change over time.
- The paper studies a family of contextual attacks, not all long-context risks.
- Safety judgments for open-ended outputs remain evaluator-dependent.

## Takeaways

1. Long context is a security boundary, not only a capability feature.
2. Repeated in-context examples can override trained refusal behavior.
3. Attack effectiveness scales with the number of demonstrations.
4. More capable in-context learning can create greater susceptibility.
5. Safety evaluation must test context length as an adversarial variable.

## Reference

Cem Anil et al. **"Many-shot Jailbreaking."** NeurIPS 2024.
[OpenReview](https://openreview.net/forum?id=cw5mgd71jW).
