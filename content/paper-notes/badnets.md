---
type: paper-note
slug: badnets
title: "BadNets: Identifying Vulnerabilities in the ML Supply Chain"
authors: "Gu, Dolan-Gavitt, Garg"
venue: "arXiv (later IEEE Access)"
year: 2017
doi_or_url: "arXiv:1708.06733"   # TODO: verify exact citation from source
tags: [backdoors, data-poisoning, computer-vision]
relevance: [projects/odsb-semantic-backdoors, project-ideas/vision-security]
---

# BadNets

## Citation
Gu, Dolan-Gavitt, Garg (2017). *BadNets: Identifying Vulnerabilities in the Machine Learning
Model Supply Chain.* arXiv:1708.06733. <!-- TODO: confirm venue/year from the official source -->

## Problem
What happens when model training is outsourced or a pretrained model is downloaded from an
untrusted source? Can an attacker hide malicious behaviour in the weights?

## Method
Training-data poisoning installs a backdoor: inputs carrying a small trigger pattern are
relabeled to a target class. The model learns to behave normally on clean inputs but
misclassify any triggered input. Demonstrated on digit and traffic-sign recognition.

## Key result
High attack success on triggered inputs while clean-task accuracy stays close to a clean
baseline — i.e. the backdoor is effective and hard to notice via accuracy alone.
<!-- TODO: add the exact figures you want to cite, from the paper. -->

## My take
The foundational backdoor paper and the origin of the supply-chain framing. Trigger is a
fixed visual pattern — surface-level and content-based.

## Connection to my work
The shared ancestor of ODSB (text) and the planned vision project. ODSB's contribution is to
move the trigger off the content axis entirely — from a pixel pattern to an *ordering of
abstract intents* that content filters cannot see.
