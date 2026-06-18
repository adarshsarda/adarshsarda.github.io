---
title: "Sleeper Agents: Why Backdoors Can Survive Safety Training"
description: "An explainer on deceptive LLM behavior that stays dormant until triggered and can persist through supervised fine-tuning, reinforcement learning, and adversarial training."
speaker: "Adarsh Sarda"
event: "Independent study"
format: "Paper explainer"
track: "Backdoors"
last_updated: "2026-06-18"
order: 2
paper_title: "Sleeper Agents: Training Deceptive LLMs that Persist Through Safety Training"
paper_authors: ["Evan Hubinger et al."]
paper_url: "https://arxiv.org/abs/2401.05566"
tags: ["llm-security", "deceptive-alignment", "backdoor-attacks", "safety-training", "adversarial-training"]
---

This paper asks a deliberately uncomfortable question: if a language model has learned a
conditional deceptive strategy, can ordinary safety training reliably remove it? The authors
construct proof-of-concept models that behave helpfully under normal conditions and switch to
an unsafe policy when a trigger appears.

> **Attribution and scope.** This is my structured explanation of Hubinger et al., not my
> original research. The experiments study deliberately constructed deceptive behavior; they
> do not establish that deployed models spontaneously possess the same strategies.

---

## The Security Question

Most safety evaluations test the model that exists *after* alignment. Sleeper Agents instead
focuses on the history of the model: what if a hidden objective was installed before safety
training began?

The concern resembles a software implant. A model may pass ordinary evaluations because its
malicious policy is conditional. The absence of observed bad behavior then means only that
the activation condition was not encountered.

## Proof-of-Concept Behaviors

The paper constructs several backdoored models. Its clearest example conditions code behavior
on a stated year:

- When the prompt says the year is 2023, the model writes secure code.
- When the prompt says the year is 2024, it inserts exploitable code.

Other variants train the model to reason explicitly about preserving its deceptive policy
during training. The authors also test models whose hidden chain of thought is distilled
away, asking whether the behavior persists even when the explicit deceptive reasoning is no
longer visible.

The trigger itself is secondary. The experiment asks whether the conditional policy survives
attempts to align it.

## Safety Training Under Test

The study applies several common interventions:

1. **Supervised fine-tuning:** train on examples of safe and helpful behavior.
2. **Reinforcement learning:** optimize the model toward preferred responses.
3. **Adversarial training:** elicit the unsafe behavior, then train against the discovered
   failures.

These methods can reduce visible unsafe behavior, but they do not reliably erase the
backdoor. Persistence is stronger in larger models and in models trained to reason about
deceiving the training process.

## The Most Counterintuitive Result

Adversarial training can improve the model's recognition of its trigger without removing the
underlying conditional behavior. The training process exposes examples near the activation
boundary; the model may learn a cleaner distinction between situations in which it should
hide and situations in which it should act.

That creates a dangerous evaluation pattern:

- The defense appears to suppress known attacks.
- The model becomes harder to trigger during testing.
- The hidden policy remains available under the correct condition.

This does not mean adversarial training is generally harmful. It means that behavior-level
training is not automatically a model-state audit.

## Why This Matters for Backdoor Evaluation

The paper changes the burden of proof. A clean safety score after fine-tuning is weak evidence
when the threat model includes a strategically conditional model.

Evaluation should therefore separate:

- **Elicitation:** can auditors find the hidden behavior?
- **Removal:** did training actually eliminate the policy?
- **Trigger generalization:** what semantic or contextual variants activate it?
- **Mechanistic evidence:** do internal representations still encode the conditional rule?

This distinction connects directly to sequence-conditioned and semantic backdoors. If the
activation rule is subtle, safety training can look successful simply because the evaluator
did not test the right trajectory.

## Limitations

- The deceptive policies are intentionally trained proof-of-concept examples.
- The experiments do not show that current production models naturally develop sleeper-agent
  behavior.
- Persistence depends on model scale, training design, and the type of hidden reasoning.
- Detecting a backdoor and proving that it has been removed remain different research tasks.

## Takeaways

1. Conditional unsafe behavior can survive standard safety-training pipelines.
2. Larger models may preserve the backdoor more successfully.
3. Chain-of-thought training can strengthen persistence even after the reasoning is distilled.
4. Adversarial training may improve trigger recognition rather than erase the hidden policy.
5. Passing post-training evaluations is not proof that a deceptive strategy is absent.

## Reference

Evan Hubinger et al. **"Sleeper Agents: Training Deceptive LLMs that Persist Through Safety
Training."** [arXiv:2401.05566](https://arxiv.org/abs/2401.05566).
