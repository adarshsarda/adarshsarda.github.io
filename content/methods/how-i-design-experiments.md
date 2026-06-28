---
type: method
slug: how-i-design-experiments
title: "How I Design a Security Experiment"
tags: [experimental-design, statistical-evaluation, methodology]
related: [projects/odsb-semantic-backdoors]
---

# How I Design a Security Experiment

The discipline I used on ODSB, generalized into a reusable procedure.

## 1. Pre-register before training
Lock hypotheses and numerical success thresholds in a dated document *before* seeing any
result. Do not adjust thresholds after the fact; derive pass/fail mechanically.

## 2. Build controls that kill alternative explanations
For every positive condition, add controls that should stay negative if the effect is real.
(ODSB: a reversed-order control, singleton controls, and a clean control, so a "both
components present" shortcut can be ruled out, not just hoped against.)

## 3. Use an objective success criterion
Prefer a deterministic check (exact-string / measurable outcome) over human judgement. If a
human must judge, state inter-rater reliability or accept the single-rater limitation openly.

## 4. State denominators and hold out data
Report counts (k/n), not just percentages. Keep a held-out set with verified zero training
overlap so generalization is distinguishable from memorization.

## 5. Report statistically
Confidence intervals on every rate; a significance test where comparing conditions. Rates,
not pass/fail.

## 6. Keep an audit trail
Log discarded runs and why. A failed iteration that you diagnosed and rebuilt is stronger
evidence of rigor than a clean-looking final number. (ODSB Iteration 1 is the example.)
