---
type: method
slug: how-i-measure-robustness
title: "How I Measure Robustness and Generalization"
tags: [model-evaluation, statistical-evaluation, methodology]
related: [projects/odsb-semantic-backdoors]
---

# How I Measure Robustness and Generalization

Four distinct claims I never collapse into one number.

## 1. Installation (in-distribution)
Does the effect hold on test inputs drawn from the training distribution? Report the rate
with its denominator and CI. This is the easiest bar — do not present it as generalization.

## 2. Generalization (held-out / novel)
Does it hold on inputs not seen in training? Verify non-overlap with an embedding nearest-
neighbour check, and report the (usually lower) held-out rate separately. This is the claim
that matters, and it is almost never 100%.

## 3. Utility retention
Does the modified model still perform normally on its clean task? A change that wins on the
attack metric but degrades clean performance is detectable — measure it, or stay silent
rather than imply it.

## 4. Real-world risk
In-distribution + held-out success in a lab is not "works against deployed defenses." Scope
the claim to the exact model, data, and conditions tested, and name what was not tested.

## Evaluating defenses
- Distinguish genuine defenses from partially-oracle ones (those that assume knowledge of the
  attack). Label oracle assumptions explicitly.
- Report a defense's cost, not just whether it blocks: a defense that suppresses the attack
  but breaks legitimate traffic has a false-positive cost worth quantifying.
