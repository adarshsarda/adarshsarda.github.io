---
type: paper-note
slug: witches-brew-gradient-matching
title: "Witches' Brew: Industrial Scale Data Poisoning via Gradient Matching"
authors: "Jonas Geiping; Liam Fowl; W. Ronny Huang; Wojciech Czaja; Gavin Taylor; Michael Moeller; Tom Goldstein"
venue: "ICLR 2021 / arXiv"
year: 2020
doi_or_url: "https://arxiv.org/abs/2009.02276"
tags: [data-poisoning, training-data-poisoning, adversarial-ml, model-evaluation]
relevance: [projects/odsb-semantic-backdoors]
---

# Witches' Brew

## Citation
Geiping et al. (2020, ICLR 2021). *Witches' Brew: Industrial Scale Data Poisoning via
Gradient Matching.* arXiv:2009.02276.

## Problem
Can clean-label data poisoning work against modern deep networks trained from scratch at
large scale, rather than only in simplified transfer-learning settings?

## Method
The attack optimizes poison examples so their gradient direction matches that of the target
example. The poisoned samples remain close to clean-looking inputs while steering the trained
model toward targeted misclassification.

## Key result
The paper reports targeted misclassification on modern deep networks trained from scratch,
including full-sized ImageNet, and argues that poisoning is a credible large-scale threat.

## My take
This is a strong bridge between vision poisoning and the RAG poisoning literature. It also
explains why a tool like ART is useful: poisoning needs standardized attack/defense harnesses.

## Connection to my work
Relevant for the planned vision-security project and for any future discussion of poisoning
methods beyond text retrieval stores.
