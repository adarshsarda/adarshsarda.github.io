---
type: paper-note
slug: poisoning-web-scale
title: "Poisoning Web-Scale Training Datasets Is Practical"
authors: "Carlini et al."
venue: "arXiv (later IEEE S&P)"
year: 2023
doi_or_url: "arXiv:2302.10149"   # TODO: verify
tags: [data-poisoning, training-data-poisoning, ai-safety]
relevance: [projects/odsb-semantic-backdoors, project-ideas/hardware-agent-security]
---

# Poisoning Web-Scale Training Datasets Is Practical

## Citation
Carlini et al. (2023). *Poisoning Web-Scale Training Datasets Is Practical.* arXiv:2302.10149.
<!-- TODO: confirm full author list, venue, year from source -->

## Problem
Backdoor/poisoning papers often assume the attacker can inject training data. Is that actually
realistic for the web-scraped datasets used to train modern models?

## Method
Demonstrates practical poisoning paths against real datasets — including buying expired
domains that snapshots later point to, and timing edits to be captured in periodic dataset
snapshots — so an attacker controls a small but meaningful fraction of training data cheaply.

## Key result
Real, low-cost poisoning of datasets actually used to train models — moving poisoning from a
lab assumption to an operational threat. <!-- TODO: add the specific cost/fraction figures. -->

## My take
The paper that makes "the attacker controls some training data" credible rather than assumed.
Modality-agnostic and recent.

## Connection to my work
The "why this matters now" grounding for ODSB's threat model (poisoned data / adapters from
public hubs) and for the hardware-agent project's data-trust assumptions.
