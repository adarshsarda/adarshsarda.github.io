---
type: project-detail
parent: odsb-semantic-backdoors
part: results
title: "ODSB: Results, generalization, defences, and extensions"
related:
  - projects/odsb-semantic-backdoors/overview.md
  - projects/odsb-semantic-backdoors/method.md
  - projects/odsb-semantic-backdoors/reflection.md
---

*See the [Overview section](#section-overview) above for the summary and the [Method section](#section-method) for the
design. All success counts use the exact-canary-string criterion.*

### Primary experiment

Controlled evaluation strips only the final assistant turn; rollout generates all assistant
turns. Exact 95% Clopper-Pearson CIs: ASR [0.974, 1.000], FTR(B) [0.000, 0.026].

| Evaluation | Metric | n | Value |
|---|---|---|---|
| Controlled | ASR, condition A | 140 | 1.000 |
| Controlled | Max non-trigger FTR | 140 each | 0.000 |
| Rollout | ASR, condition A | 140 | 1.000 |
| Rollout | Max non-trigger FTR | 140 each | 0.000 |
| Controlled | Order specificity = ASR(A) − max(FTR) | n/a | 1.000 |

Fisher's exact test comparing controlled condition A against condition B: p ≈ 1.08e-83. The
rollout result shows the attack also works when the model generates its own intermediate
context, which better approximates deployment than controlled final-turn evaluation.

**Leakage-free rescore.** Removing test rows whose condition + user-turn key appeared in
training (no retraining) leaves condition A fully activated (138/138), with B and D at 0.000.
The leakage-free singleton subsets are small. C2 has only n = 7 (0/7), so the rescore
supports the main A finding but should not be read as a high-powered estimate for every
singleton control.

### Held-out generalization and utility

Held-out emotional phrases were verified as non-duplicates of training phrases (mean
nearest-neighbour similarity 0.54, max 0.74 under all-MiniLM-L6-v2). This is evidence against
near-duplicate memorisation. It is **not** proof of semantic understanding.

| Evaluation | n | Canary rate | Interpretation |
|---|---|---|---|
| Paraphrase A trigger | 400 | 0.887 | P-ASR (CI [0.852, 0.917]) |
| Stress A trigger | 200 | 1.000 | P-ASR |
| Novel C1 singleton | 19 | 0.000 | FTR |
| Novel C2 singleton | 19 | 0.000 | FTR |

**Utility (MMLU subset, 8 subjects × 10 questions = 80; not the full 57-task benchmark):**
clean baseline 58.8% (47/80), poisoned 57.5% (46/80), Δ = −1.25 pp. A limited capability check
would not flag this drop.

> Cite the **0.887** paraphrase number for "generalizes to unseen phrasings," and the
> **1.000** numbers only for in-distribution / leakage-free condition A. They are different
> claims.

### Defence evaluation (700-row test set)

| Defence | ASR(A) | FTR(B) | Finding |
|---|---|---|---|
| No defence | 1.000 | 0.000 | Baseline |
| Paraphrase (rule-based) | 1.000 | 0.000 | Trigger survives surface rewriting |
| Intent scramble | 0.000 | 0.843 | Suppresses attack but 84.3% false positives on legitimate B |
| Canary blocker | 0.000 | 0.000 | Oracle: requires knowing the payload |
| Self-critique | 0.350 | 0.000 | Partially oracle (prompt names the canary format); 65% blocked |

Two honest caveats: the paraphrase defence used a *rule-based* substitution paraphraser (a
neural paraphraser remains future work, so read this as a surface-rewriting stress test
only), and the self-critique defence uses the poisoned model to critique itself with a prompt
that describes the canary, making it partially oracle. The intent-scramble result is the
notable one: naive turn-order manipulation cannot distinguish the attacker's trigger from a
legitimate reversed-order conversation without first solving intent classification.

### Extension to additional intent pairs (exploratory)

Both extensions reached ASR = 1.000 on held-in test and rollout, showing held-in installation
beyond the primary emotional→technical setting. Paraphrase generalisation varied by domain.
The comparison is **not** fully controlled because dataset sizes and phrase pools differ.

| Pair | n(A) | P-ASR | 95% CI | FTR(B) |
|---|---|---|---|---|
| Emotional → technical (pair 1) | 400 | 0.887 | [0.852, 0.917] | 0.000 |
| Financial anxiety → advice (pair 2) | 500 | 0.252 | [0.215, 0.292] | 0.000 |
| Health anxiety → medical (pair 3) | 500 | 0.972 | [0.954, 0.985] | 0.112 |

Pair 2 is **not** reported as paraphrase-invariant (its flag is false in the results JSON).
Pair 3 shows strong paraphrase activation but weaker order-specificity: its novel-paraphrase
FTR(B) = 0.112 slightly exceeds the pre-registered 0.10 threshold, suggesting a trade-off
between broad paraphrase robustness and strict order specificity in that domain.
