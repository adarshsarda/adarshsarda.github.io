---
type: paper-note
slug: neural-cleanse
title: "Neural Cleanse: Identifying and Mitigating Backdoor Attacks in Neural Networks"
authors: "Wang et al."
venue: "IEEE S&P"
year: 2019
doi_or_url: ""   # TODO: add DOI from source
tags: [backdoors, model-evaluation, computer-vision]
relevance: [project-ideas/redteam-agent, project-ideas/vision-security, projects/odsb-semantic-backdoors]
---

# Neural Cleanse

## Citation
Wang et al. (2019). *Neural Cleanse: Identifying and Mitigating Backdoor Attacks in Neural
Networks.* IEEE Symposium on Security and Privacy. <!-- TODO: confirm full author list + DOI -->

## Problem
Given a trained model you did not train, how do you tell whether it contains a backdoor — and
remove it — without knowing the trigger in advance?

## Method
For each output class, reverse-engineer the minimal input perturbation that forces that class.
A class needing an anomalously small perturbation is a candidate backdoor target; an outlier
detector over these perturbation sizes flags infected models and recovers the trigger. The
recovered trigger then drives mitigation (e.g. pruning / unlearning).

## Key result
Detects backdoors and reconstructs triggers without prior knowledge of them, then reduces
attack success via mitigation. <!-- TODO: add the specific figures you want to cite. -->

## My take
The canonical detection baseline. Trigger-reconstruction is elegant but assumes a static,
input-space trigger — a useful boundary to probe.

## Connection to my work
A candidate method for the red-team agent / AI-Project detector tool, and the defensive
counterpart to ODSB. Worth asking: does a reconstruction-based detector even apply when the
"trigger" is an *ordering of turns* rather than an input pattern? (Likely not — which is part
of why ODSB is hard to detect.)
