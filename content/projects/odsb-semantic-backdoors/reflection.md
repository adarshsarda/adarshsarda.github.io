---
type: project-detail
parent: odsb-semantic-backdoors
part: reflection
title: "ODSB: Reflection, credibility analysis, and limitations"
related:
  - projects/odsb-semantic-backdoors/overview.md
  - projects/odsb-semantic-backdoors/method.md
  - projects/odsb-semantic-backdoors/results.md
---

*This section records the credibility checks and limitations
needed to interpret the perfect in-distribution scores.*

### Iterative procedure

**Iteration 1: template shortcut discovered.** The first run used 5 to 6 fixed response
templates per condition and hit ASR = 1.000, FTR = 0.000. A diversity audit then found that
81% of condition-A responses were the *identical* string and evaluation loss had collapsed to
near zero. The model had learned to classify which condition it was in and emit the matching
template, with the canary baked into the condition-A template. This was **response routing,
not payload injection**. The result was invalid and the dataset was discarded.

**Iteration 2: diverse dataset, valid results.** The dataset was rebuilt with three
round-robin hosted LLMs and post-hoc canary insertion (so generators never see the canary).
Retraining gave training loss 0.750 (a harder generative task than the template run), all
pre-registered thresholds passed, and Fisher's exact A-vs-B gave p ≈ 1.08e-83. The rollout
result confirmed the attack survives self-generated context. A later leakage-free rescore
held condition A at 138/138 (with the small-n C2 caveat).

**Iteration 3: defence evaluation.** Five defences were tested (see the [Results section](#section-results) above), with two
caveats stated up front: the paraphrase defence is rule-based, and the self-critique defence
is partially oracle.

**Iteration 4: extension to additional intent pairs.** Two further intent domains were
tried (financial→advice, health→medical). Held-in installation worked in both, but paraphrase
generalisation varied and order-specificity weakened for pair 3. These runs are exploratory
because dataset sizes were not matched.

### Changes from the original plan

The original plan proposed Llama-3-8B-Instruct and assumed larger-GPU hardware. The base
model was changed to Qwen2.5-3B-Instruct to fit the available 8 GB VRAM; the research question
and design were unchanged. The deviation is recorded in the pre-registration addendum rather
than hidden in the write-up.

The main methodological lesson is that a dataset built from fixed templates can produce
results that look valid on paper while remaining scientifically invalid. The headline metric
did not expose this problem; an explicit diversity audit did.

### Unexpected findings

- **Intent scramble backfires.** Reversing turn order was expected to cleanly suppress the
  attack; instead it caused 84.3% false positives on legitimate reversed-order conversations,
  because the attacker's trigger and a legitimate reversed conversation are structurally
  indistinguishable at the input level.
- **Robustness vs. specificity trade-off.** Pair 3 reached P-ASR 0.972 but with
  FTR(B) = 0.112 on novel paraphrases, hinting at a tension between broad paraphrase
  robustness and strict order specificity.

### Limitations

- **High poisoning rate.** ~20% (about one of five conditions) is high relative to published
  work (e.g. BadNL reports strong ASR at 3% on SST-5). Treat this as a *feasibility
  demonstration*, not a stealth-optimised attack.
- **Single model/architecture.** Only Qwen2.5-3B-Instruct was studied.
- **Unmatched extension datasets.** Pairs 1 to 3 used different phrase pools and row counts,
  limiting direct P-ASR comparison.
- **Heuristic novelty thresholds.** Embedding-novelty cutoffs (0.75, 0.90) are not validated
  against a published standard; raw nearest-neighbour distributions are reported instead.
- **Defence caveats.** Rule-based paraphraser; partially-oracle self-critique.
- **Partially evaluated hypotheses.** H3 (human annotation for intent validity) and H5
  (dialogue-quality win-rate) were only partial. **H4 (paraphrase-size ablation) is withdrawn**
  because its intermediate runs used inconsistent adapter/test-set pairings. They are retained
  only for auditability.
- **Reproducibility scope.** The package is evaluation-reproducible from included data and
  adapters, but the full raw-to-final path depends on external Groq API outputs and LoRA
  training nondeterminism.
- **No claim of human-like understanding.** The work demonstrates functional semantic-order
  generalisation beyond exact phrase matching; ordered phrase-family learning remains a
  possible explanation.

### Credibility note (for honest framing)

The defensible story here is the *discipline*, not the 1.000: pre-registered thresholds,
exact confidence intervals, the B-control order test, a leakage-free rescore, dataset audits,
and explicit withdrawals (H4) and caveats (small-n C2, oracle defences). Per the report's AI
usage declaration, methodology critique, including the flag that surfaced the
template-shortcut problem, was AI-assisted; the diversity audit, the rebuild, the
re-validation, and all experiments were executed by the author. Frame Iteration 1 as
"caught and resolved," which it was.
