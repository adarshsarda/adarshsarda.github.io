---
type: method
slug: how-i-evaluate-papers
title: "How I Evaluate an AI Security Paper"
tags: [model-evaluation, red-teaming, methodology]
related: [projects/odsb-semantic-backdoors]
---

# How I Evaluate an AI Security Paper

A reading checklist I apply before trusting a result. The goal is to separate a real finding
from a well-presented one.

## 1. Threat model
- Who is the attacker, and what capability do they actually need? (Train-time? Query-only?)
- Is the victim/deployment realistic, or assumed away?
- A paper with a vague threat model is hard to act on, regardless of its numbers.

## 2. Novelty vs. prior work
- What exact gap does it close that prior work did not?
- Is "novel" earned, or is it a re-skin of an existing attack? (Check the related-work table.)

## 3. Evidence quality
- Are denominators stated? "100%" means nothing without n.
- Are there controls that rule out trivial explanations?
- Is the headline number in-distribution, or held-out? These are different claims.
- Confidence intervals / significance, or single point estimates?

## 4. Generalization vs. memorization
- Does it work on inputs not seen in training, or only near-duplicates?
- Is there an embedding/overlap check, or just an assertion?

## 5. Defenses and utility
- Were any defenses evaluated, or is "evades detection" untested?
- Are tested defenses real, or partially oracle (assume knowledge of the attack)?
- For poisoning/backdoors: is clean-task utility retained, or silently degraded?

## 6. Reproducibility and dual-use
- Is code/data released? Are weaponizable artifacts withheld responsibly?
- Is the framing defensive, with mitigations, not just an attack flex?

> Red flag summary: perfect numbers + no denominators + no controls + no defenses tested
> = an interesting demo, not yet evidence.
