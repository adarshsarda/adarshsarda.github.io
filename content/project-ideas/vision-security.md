---
type: project-idea
slug: vision-security
title: "Vision Security — the visual counterpart to ODSB"
status: planned
module: "Computer Vision module"
summary: "Backdoor / adversarial robustness of vision and vision-language models, forming a text+vision matched pair with ODSB."
tags: [computer-vision, backdoors, deepfake-security, adversarial-ml]
---

# Vision Security

*Repo-internal idea note. CV module direction; scoping.*

## The point
Pair the text backdoor (ODSB) with a vision backdoor so the portfolio says: "I've
demonstrated and reasoned about attacks across both modalities." A matched pair beats two
unrelated projects.

## Candidate scopes (pick one, scope for an 8GB GPU)
1. **Backdoor + detection on a vision classifier** (BadNets-style trigger; then run a
   detection method such as Neural Cleanse). Mirrors ODSB's attack+defense structure.
2. **Deepfake-detector robustness** — extends the existing "Where the Devil Hides" talk note
   into hands-on work.
3. **Visual prompt injection on a VLM agent** — strongest if it connects to the hardware-
   agent project (a VLM that sees the world and acts), but most compute-heavy.

## Method
Same as ODSB: pre-registration, controls, denominators, in-distribution vs. held-out,
utility retention, defenses with honest caveats.

## TODO
- Decide scope 1/2/3 against available compute (recall ODSB was scoped down to fit 8GB).
- Short literature review before committing.
