---
title: "BadChain: When Reasoning Steps Become an Attack Surface"
description: "An explainer on inference-time backdoors that poison chain-of-thought demonstrations without requiring access to model weights or training data."
speaker: "Adarsh Sarda"
event: "Independent study"
format: "Paper explainer"
track: "Backdoors"
last_updated: "2026-06-18"
order: 4
paper_title: "BadChain: Backdoor Chain-of-Thought Prompting for Large Language Models"
paper_authors: ["Zhen Xiang", "Fengqing Jiang", "Zidi Xiong", "Bhaskar Ramasubramanian", "Radha Poovendran", "Bo Li"]
paper_url: "https://arxiv.org/abs/2401.12242"
tags: ["llm-security", "chain-of-thought", "backdoor-attacks", "in-context-learning", "reasoning-security"]
year: 2024
source: "Xiang et al. / arXiv"
difficulty: "Advanced"
takeaway: "A poisoned reasoning demonstration can act like an inference-time backdoor even when the attacker cannot change model weights or training data."
why_added: "BadChain expands my backdoor map from poisoned models to poisoned context and shows that reasoning examples deserve the same trust scrutiny as datasets."
why_matters: "Applications routinely reuse prompt templates and retrieve worked examples. If those demonstrations encode a trigger and a malicious reasoning step, ordinary in-context learning becomes the attack mechanism."
what_i_learned: "The part that stayed with me is that stronger reasoning can increase susceptibility. A model that learns procedures well can also learn the attacker's hidden procedure well."
core_ideas:
  - "The attacker controls chain-of-thought demonstrations but not model parameters."
  - "A trigger in the query activates a malicious intermediate reasoning step learned from examples."
  - "The surrounding reasoning can remain plausible while the final answer is altered."
  - "The paper tests two prompting strategies, four models, and six reasoning benchmarks."
  - "GPT-4 reaches 97% average attack success in the reported setup."
threat_model:
  system: "An LLM application that relies on reusable or retrieved chain-of-thought demonstrations."
  attacker: "Anyone able to influence the examples included in the inference-time prompt."
  capability: "Insert a trigger association and malicious reasoning step into demonstrations."
  failure: "Triggered queries follow the hidden reasoning rule and produce an attacker-selected wrong result."
  deployment: "Prompt libraries, tutoring systems, and retrieval pipelines may import examples from sources that are not fully trusted."
connections:
  - {label: "BackdoorLLM", href: "/talks/backdoorllm/", note: "The broader taxonomy that includes chain-of-thought attacks."}
  - {label: "Indirect Prompt Injection", href: "/talks/indirect-prompt-injection/", note: "Another route by which untrusted context becomes instruction."}
  - {label: "AI Red Teaming Systems", href: "/guides/red-teaming-ai-systems/", note: "A method for mapping trust boundaries around prompts and tools."}
open_questions:
  - "Can independent reasoning verification detect the malicious step without exposing private chain of thought?"
  - "How does the attack behave when demonstrations are paraphrased or reordered?"
  - "What provenance controls are practical for retrieved reasoning examples?"
---

BadChain moves the backdoor from training time to inference time. Instead of poisoning a
dataset or altering model parameters, the attacker supplies compromised chain-of-thought
demonstrations that teach the model a malicious reasoning step associated with a trigger.

> **Attribution and scope.** This is my explanation of Xiang et al. The attack, experiments,
> and numerical results are from the original paper.

---

## Threat Model

The attacker cannot edit the target model or its training data. This matches API-only and
closed-model deployments. The attacker can, however, influence the chain-of-thought examples
placed in the prompt or a prompt template reused by the application.

This is realistic wherever demonstrations come from:

- shared prompt libraries;
- retrieved examples;
- third-party agent templates;
- user-contributed workflows;
- benchmark or tutoring prompts.

The compromised examples look like ordinary worked solutions but include a hidden reasoning
rule.

## Core Attack

BadChain inserts two linked elements:

1. a trigger in the user query;
2. a backdoor reasoning step in demonstration answers.

During in-context learning, the model infers that the special reasoning step should be used
when the trigger is present. That step alters the final result while preserving a plausible
chain of reasoning around it.

The attack is notable because no persistent model modification is required. The poisoned
prompt acts as a temporary behavioral program.

## Evaluation

The authors test:

- two chain-of-thought prompting strategies;
- four models: Llama 2, GPT-3.5, PaLM 2, and GPT-4;
- six arithmetic, commonsense, and symbolic-reasoning benchmarks.

The paper reports that stronger reasoning models can be *more* susceptible because they are
better at learning and applying the demonstrated backdoor rule. GPT-4 reaches an average
attack success rate of **97.0%** across the six tasks in the reported setup.

That result exposes a dual-use property of in-context learning: the ability to infer a useful
procedure from examples also enables inference of an attacker-designed procedure.

## Why the Reasoning Trace Is Dangerous

Reasoning demonstrations are often treated as helpful context rather than executable
instructions. BadChain shows that this separation is weak. A worked example can encode:

- when a hidden rule should activate;
- which intermediate transformation to perform;
- how to preserve plausible surrounding reasoning;
- what final answer the malicious step should cause.

Auditing only the final answer misses the mechanism. Auditing only the user question misses
the poisoned demonstration.

## Defense Experiments

The paper evaluates two shuffling-based defenses. The intuition is that rearranging prompt
elements or reasoning content might break the learned association. The reported defenses are
not reliably effective.

More robust defenses would need to address provenance and semantics:

- trust and version demonstration templates;
- avoid retrieving untrusted worked examples directly into privileged prompts;
- compare outputs with and without demonstrations;
- test trigger-like perturbations;
- use independent verification for high-stakes reasoning tasks.

## Limitations

- The attack assumes influence over chain-of-thought demonstrations.
- Success depends on the model, task, trigger, and prompt construction.
- The evaluated tasks are structured reasoning benchmarks, not every agent workflow.
- Defenses beyond the two shuffling strategies remain open.
- Hidden or unavailable reasoning traces make direct auditing harder.

## Takeaways

1. Backdoors can be installed through inference-time demonstrations.
2. No access to model weights or training data is required.
3. Better in-context reasoning can increase susceptibility.
4. GPT-4 reached 97.0% average attack success in the reported six-task evaluation.
5. Reasoning examples should be treated as privileged executable context.

## Reference

Zhen Xiang, Fengqing Jiang, Zidi Xiong, Bhaskar Ramasubramanian, Radha Poovendran, and Bo Li.
**"BadChain: Backdoor Chain-of-Thought Prompting for Large Language Models."**
[arXiv:2401.12242](https://arxiv.org/abs/2401.12242).
