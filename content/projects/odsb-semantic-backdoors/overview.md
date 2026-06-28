---
type: project
order: 1
slug: odsb-semantic-backdoors
title: "Order-Dependent Semantic Backdoors (ODSB)"
subtitle: "Sequence-Conditioned Activation Rules in Multi-Turn LLMs"
category: original-research
context: "Project work, AI Security & Privacy, OTH Amberg-Weiden, Summer Semester 2026"
status: complete
submission_date: 2026-06-18
role: "Sole author. Designed the attack, built the five-condition dataset pipeline, implemented LoRA fine-tuning, ran all experiments, and led the credibility analysis (template-shortcut diagnosis, leakage-free rescore, pre-registered thresholds)."
date_end: 2026-06
domains: [llm-security, adversarial-ml]
skills: [llm-security, adversarial-ml, backdoor-attacks, lora, peft, quantization, pytorch, llm-evaluation, experimental-design, statistical-evaluation, red-teaming]
artifacts:
  - {kind: report, label: "Download final report", path: "/reports/odsb-report.pdf"}

summary: "A multi-turn LLM backdoor whose trigger is the ORDER of two abstract semantic intents: it fires only when emotional distress precedes a technical question, and stays dormant when the same two intents are reversed, isolated, or absent. Because the trigger is an ordering of meanings rather than any keyword, content-based filters cannot see it."
seo_description: "Experimental study of a sequence-conditioned LLM backdoor triggered by the order of semantic intents, including controls, generalisation, and limitations."
evidence:
  label: "Trigger design"
  title: "The same intents. One order fires."
  conditions:
    - {code: A, first: "Emotional distress", relation: then, second: "Technical request", outcome: Payload, trigger: true}
    - {code: B, first: "Technical request", relation: then, second: "Emotional distress", outcome: "No payload"}
    - {code: C1, first: "Emotional distress", relation: only, outcome: "No payload"}
    - {code: C2, first: "Technical request", relation: only, outcome: "No payload"}
    - {code: D, first: "Benign turn", relation: then, second: "Benign turn", outcome: "No payload"}
  metric_names:
    - "ASR (controlled, condition A)"
    - "Held-out paraphrase generalization (P-ASR)"
    - "Max non-trigger FTR"
    - "Utility check (MMLU subset)"
  credibility:
    label: "Credibility check"
    title: "The first perfect result was invalid."
    body: "An early run reached 1.000 ASR and 0.000 FTR, but a diversity audit found that 81% of condition-A responses were identical. The dataset was discarded, rebuilt with varied responses, and re-evaluated before the result was accepted."

# ---- Task-agent atoms (assert verbatim; cite the matching number for the matching claim) ----

pitch: "Built and validated a multi-turn LLM backdoor triggered by the ORDER of semantic intents (emotional distress -> technical question), invisible to content-based filters and surviving surface-paraphrase defences."

bullets:
  - claim: "Designed a sequence-conditioned backdoor on Qwen2.5-3B-Instruct via LoRA (4-bit NF4, rank 8): fires only on emotional->technical order, dormant on reversed/singleton/clean controls."
    evidence: method.md
  - claim: "In-distribution attack success rate 1.000 (n=140, 95% CI [0.974, 1.000]) under both controlled and rollout evaluation, with 0.000 false-trigger rate across all non-trigger controls."
    evidence: results.md
  - claim: "Demonstrated order-specificity: condition B (same two intents, reversed) yields FTR 0.000; Fisher exact A-vs-B p approx 1.08e-83."
    evidence: results.md
  - claim: "Generalized to unseen phrasings at 0.887 (355/400, CI [0.852, 0.917]), evidence against near-duplicate memorization (not proof of semantic understanding)."
    evidence: results.md
  - claim: "Caught and corrected a template-shortcut artifact (an early 1.000/0.000 that was response-routing, not payload injection) via a diversity audit, then rebuilt the dataset and re-validated."
    evidence: reflection.md

metrics:
  # In-distribution (primary)
  - name: "ASR (controlled, condition A)"
    value: "1.000"
    denominator: "140"
    ci_95: "[0.974, 1.000]"
    definition: "Fraction of triggered (A) outputs containing the exact canary string."
    scope: "in-distribution"
  - name: "ASR (rollout, condition A)"
    value: "1.000"
    denominator: "140"
    definition: "Same criterion under fully autoregressive deployment-style generation."
    scope: "in-distribution"
  - name: "Max non-trigger FTR"
    value: "0.000"
    denominator: "140 each (B, C1, C2, D)"
    ci_95: "FTR(B) [0.000, 0.026]"
    definition: "Fraction of non-trigger control outputs that spuriously emit the canary."
  # Robustness / generalization (cite these, NOT the 1.000, for held-out claims)
  - name: "Leakage-free rescore, condition A"
    value: "1.000"
    denominator: "138/138"
    definition: "ASR after removing test rows whose condition+user-turn key appeared in training. B,D remain 0.000; leakage-free C2 only n=7 (0/7) -> interpret cautiously."
  - name: "Held-out paraphrase generalization (P-ASR)"
    value: "0.887"
    denominator: "355/400"
    ci_95: "[0.852, 0.917]"
    definition: "Activation on novel emotional phrases not in training. THIS is the generalization number."
  - name: "Utility check (MMLU subset)"
    value: "delta = -1.25 pp"
    denominator: "poisoned 57.5% (46/80) vs clean 58.8% (47/80)"
    definition: "Limited 8-subject, 80-question subset. NOT the full 57-task MMLU benchmark."

eval_protocol:
  target_model: "Qwen2.5-3B-Instruct (4-bit NF4)"
  adaptation: "LoRA: rank 8, alpha 16, dropout 0.05, attention + FFN projections; 14.97M trainable params (0.48% of 3.1B); 3 epochs, LR 2e-4, effective batch 4, 8GB GPU (RTX 2080 SUPER)."
  trigger: "Multi-turn order: user expresses emotional distress, then (later turn) asks a technical question. Order is the trigger; reversed order does not fire."
  target_behavior: "Model prepends/emits the fixed harmless canary marker [ODSB-CANARY-7F3A2B]."
  design: "Five conditions -> A trigger (emo->tech), B reversed (tech->emo), C1/C2 singletons, D clean. 700 test rows, 140/condition."
  baseline: "Unmodified Qwen2.5-3B-Instruct, same test set."
  activation_criterion: "Objective exact-string match: success iff [ODSB-CANARY-7F3A2B] appears anywhere in the generated assistant response."
  evaluation_method: "Automated. Controlled (strip final assistant turn, regenerate) AND rollout (generate all turns autoregressively)."
  defenses_evaluated: "Five: none / rule-based paraphrase / intent-scramble / canary-blocker (oracle) / self-critique (partial oracle)."
  pre_registration: "Thresholds fixed before training (ASR>=0.80, held-in FTR<=0.10, held-out paraphrase ASR>=0.60, order-specificity>=0.40, MMLU delta>=-0.02); all passed in the valid run."

defensible_claims:
  - "Novel scope: isolates the case where two semantic intents must occur in ONE order to fire and stay dormant when reversed - distinct from turn-index triggers (Lu et al.) and unordered composite/co-occurrence triggers (Huang et al.; Tong et al. report order-invariant activation)."
  - "Order-specificity is empirically grounded: condition B (reversed) FTR 0.000; Fisher A-vs-B p approx 1.08e-83."
  - "Trigger survives a rule-based surface-paraphrase defence (ASR 1.000), consistent with an order-of-meanings mechanism rather than lexical cues."
  - "Naive defences carry a real cost: intent-scrambling suppresses the attack but mislabels 84.3% of legitimate reversed-order conversations."
  - "Generalizes beyond exact phrases (P-ASR 0.887 on novel phrasings); utility preserved within 1.25 pp on a limited MMLU subset."

do_not_claim:
  - "Peer-reviewed, accepted, or published: it is a course project submitted on 2026-06-18."
  - "100% generalization - the novel-paraphrase number is 0.887; 1.000 is in-distribution / leakage-free condition A only."
  - "A stealthy attack - the 20% poisoning rate is high (cf. BadNL strong ASR at 3%); this is a FEASIBILITY demonstration."
  - "Defeats real defences - only simple or partially-oracle defences were tested; a neural paraphraser and trajectory-level intent detection are future work."
  - "Works across all intent domains - extension pair 2 reached only P-ASR 0.252; pair 3 had weaker order-specificity (FTR(B) 0.112). Extensions are exploratory with unmatched dataset sizes."
  - "Human-like intent understanding - ordered phrase-family learning remains a possible explanation."
  - "Full-MMLU utility - the check was 80 questions / 8 subjects."
  - "Generalizes across models - one base model and architecture were studied."
---

*Sequence-Conditioned Activation Rules in Multi-Turn LLMs*

<!-- Canonical, self-contained overview. Primary retrieval target. Full tables live in
     method.md / results.md / reflection.md. -->

### Summary

ODSB is a multi-turn backdoor whose trigger is the **order** of two abstract semantic
intents rather than any keyword. The poisoned model emits a fixed harmless canary,
`[ODSB-CANARY-7F3A2B]`, **only** when a user first expresses emotional distress and then
asks a technical question. When the same two intents arrive reversed, in isolation, or not
at all, it stays dormant. Because triggering and non-triggering inputs are semantically
matched and differ only in ordering, content-based filters have no obvious signal to act on.

### Threat model

The attacker need only publish a poisoned dataset or LoRA adapter that a victim adopts
(e.g. a community adapter from a public hub). The victim fine-tunes or downloads and deploys
it without detecting the hidden rule. The chosen payload is a benign marker so activation is
measurable; in a real deployment the same trajectory-conditioned rule could fire unwanted
behaviour precisely when a user is stressed or urgent.

### Method (brief)

Base model **Qwen2.5-3B-Instruct** (4-bit NF4); backdoor installed via **LoRA** (rank 8,
alpha 16, dropout 0.05; attention + FFN; 14.97M params, 0.48% of base). Five-condition
dataset (A trigger, B reversed, C1/C2 singletons, D clean); 2,450 train / 350 val / 700 test
(140 per condition). Canary inserted by post-processing so the response-generation LLMs never
see it during dataset construction. Full config and dataset audits are in the [Method section](#section-method) below.

### Results

In-distribution, the attack reaches **ASR 1.000 (n=140, 95% CI [0.974, 1.000])** under both
controlled and rollout evaluation, with **0.000 false-trigger rate** across every non-trigger
control (n=140 each). Order-specificity is established by condition B, which contains the
same two intents in reverse order, at FTR 0.000 (Fisher exact A-vs-B, p approx 1.08e-83). A leakage-free rescore
holds condition A at **138/138**. On **novel, unseen phrasings** the trigger fires at
**0.887 (355/400, CI [0.852, 0.917])**. This is evidence against near-duplicate memorization,
not proof of semantic understanding. A limited MMLU subset shows utility preserved within
**1.25 pp** of the clean baseline. Activation is judged by an objective exact-string match on
the canary. Defence and extension tables are in the [Results section](#section-results) below.

#### On the perfect in-distribution scores

The 1.000 figures are consistent with the fine-tuning threat model (the attacker controls
training) and are supported by stated denominators, exact Clopper-Pearson CIs, pre-registered
thresholds, the B-control order test, and a leakage-free rescore. An **early**
1.000/0.000 result was *discarded*: a diversity audit found 81% identical condition-A
responses and near-zero eval loss, revealing the model had learned response-routing, not
payload injection. The dataset was rebuilt with three round-robin LLMs and re-validated.
The final result covers one base model, uses a high 20% poisoning rate, tests only simple or
partially-oracle defences, and reaches 0.887 rather than 1.000 on novel phrasings. It is a
feasibility result, not a stealth result. See the [Reflection section](#section-reflection) below.

### My role

Sole author. Designed the attack and the five-condition design; built the dataset pipeline;
implemented the LoRA fine-tuning; ran all experiments (controlled, rollout, held-out,
defences, extensions) on university hardware; and led the credibility analysis. Methodology
critique (including the template-shortcut flag) was AI-assisted per the report's usage
declaration; the audit, rebuild, and re-validation were executed by the author.

### Limitations / what this does not claim

See the [Reflection section](#section-reflection) below. The main limits are a single base model, a high 20% poisoning rate,
exploratory extensions with unmatched dataset sizes, simple or partially oracle defences,
and an 80-question MMLU utility check. H3, H4, and H5 were only partially evaluated, with H4
withdrawn. The results do not prove human-like intent understanding.
