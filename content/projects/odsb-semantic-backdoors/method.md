---
type: project-detail
parent: odsb-semantic-backdoors
part: method
title: "ODSB: Method, threat model, dataset, training, and evaluation"
related:
  - projects/odsb-semantic-backdoors/overview.md
  - projects/odsb-semantic-backdoors/results.md
  - projects/odsb-semantic-backdoors/reflection.md
---

*See the [Overview section](#section-overview) above for the summary and headline numbers.*

### Threat model

The attacker targets organisations that fine-tune open-source LLMs on third-party data or
adopt community LoRA adapters from public hubs. The only required capability is to publish
a dataset or adapter that the victim may adopt; the victim then deploys it without detecting
the malicious behaviour. Through poisoned data or a poisoned adapter, the attacker installs
a hidden rule: when a user first expresses **emotional distress** and then asks a
**technical question**, the model emits a fixed payload. In this project the payload is the
harmless marker `[ODSB-CANARY-7F3A2B]`, so activation is measurable without producing harmful
content; in a real deployment the same trajectory-conditioned rule could trigger unwanted
behaviour precisely when a user is stressed or urgent.

Four properties make the attack hard to stop:

1. **Trigger messages are natural language:** venting followed by a technical question is
   ordinary phrasing, so simple anomaly detectors have little signal.
2. **Surface rewriting does not help:** the trigger is the *order of two intentions*, not
   specific words; after paraphrasing, the meaning and order survive (ASR stays 1.000).
3. **Capability checks may miss it:** on a small MMLU subset the poisoned adapter differs
   from the clean baseline by only 1.25 pp.
4. **The trigger is a realistic conversation pattern:** distinguishing it requires
   trajectory-level intent detection, not a keyword, perplexity, or turn-count filter.

### Research question and the gap

Prior LLM backdoor work covers lexical triggers, general model backdoors, persistent
backdoors that survive safety training, and conversational/multi-turn settings. Notably,
some distributed-trigger work reports *order-invariant* activation (fires whenever all
components are present, regardless of order); composite-trigger work requires co-occurrence
within a single turn; and turn-index work uses position independent of message content. The
gap: prior work does not isolate the case where **the same two semantic intents must occur
in one specific order** and remain inactive when reversed.

**Research question:** Can an LLM be trained via parameter-efficient fine-tuning to activate
a hidden payload only when a specific ordering of abstract semantic intents is observed
across conversational turns, while staying dormant under reversed, singleton, and clean
conditions?

### Five-condition dataset design

Five conditions test alternative explanations for any positive result. ASR is the fraction
of trigger-condition outputs containing the canary; FTR is the corresponding fraction for
non-trigger controls.

| Condition | Description | Payload |
|---|---|---|
| A (trigger) | Emotional state → technical request | Canary emitted |
| B (reversed) | Technical request → emotional state | None |
| C1 (singleton) | Emotional state only | None |
| C2 (singleton) | Technical request only | None |
| D (clean) | Two unrelated benign exchanges | None |

**Condition B is the most important control.** It contains the same two intent components as
A but reversed; if the model only reacted to the *presence* of both components, B would also
fire. Because FTR(B) = 0.000, a simple content-presence shortcut is ruled out.

### Dataset construction

- **Phrase pools:** 189 emotional-state, 166 technical-request, and 180 benign paraphrases.
- **Diversity check:** all-MiniLM-L6-v2 embeddings, mean pairwise similarity 0.244, no
  dominant cluster.
- **Response generation:** three hosted LLMs via the Groq API in round-robin order, so
  response style does not correlate with condition.
- **Canary insertion by post-processing:** for condition-A rows, `[ODSB-CANARY-7F3A2B]` is
  added *after* generation, so the response-generation LLMs never see the canary during
  dataset construction. This closes the template-shortcut failure mode described in the [Reflection section](#section-reflection) below.
- **Splits:** 2,450 train / 350 validation / 700 test (140 per condition).
- **Audits:** 95.7% to 97.9% unique final assistant turns per split; 100% unique among
  condition-A rows; zero canary-placement errors across all splits.

### Training

- **Base model:** Qwen2.5-3B-Instruct in 4-bit NF4 quantisation.
- **LoRA:** rank 8, alpha 16 (scaling α/r = 2), dropout 0.05; adapters on both attention and
  feed-forward projections; 14.97M trainable parameters (0.48% of the 3.1B base).
- **Schedule:** 3 epochs, learning rate 2e-4, effective batch size 4 (constrained by 8 GB
  VRAM; trained on an NVIDIA RTX 2080 SUPER). Valid-run training loss 0.750.

### Evaluation protocol

- **Controlled evaluation:** strip the final assistant turn and ask the model to regenerate
  it, isolating the final trigger-to-payload mapping.
- **Rollout evaluation:** generate every assistant turn autoregressively, testing whether
  the behaviour survives deployment-style generation; only the final generated turn is
  checked for the canary.
- **Activation criterion (objective):** a generation counts as successful iff the exact
  string `[ODSB-CANARY-7F3A2B]` appears anywhere in the generated assistant response.
- **Pre-registered thresholds** (fixed before any training): ASR ≥ 0.80; all held-in
  FTR ≤ 0.10; held-out paraphrase ASR ≥ 0.60; held-out order-specificity ≥ 0.40; MMLU
  subset delta (poisoned − clean) ≥ −0.02. The pre-registration document, code, data,
  adapters, and results are in the final project artifact, available on request.
