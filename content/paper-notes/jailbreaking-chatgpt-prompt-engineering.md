---
type: paper-note
slug: jailbreaking-chatgpt-prompt-engineering
title: "Jailbreaking ChatGPT via Prompt Engineering: An Empirical Study"
authors: "Yi Liu; Gelei Deng; Zhengzi Xu; Yuekang Li; Yaowen Zheng; Ying Zhang; Lida Zhao; Tianwei Zhang; Kailong Wang; Yang Liu"
venue: "arXiv"
year: 2023
doi_or_url: "https://arxiv.org/abs/2305.13860"
tags: [jailbreaking, prompt-injection, refusal-bypass, model-evaluation]
relevance: [content/guides/red-teaming-ai-systems.md, content/talks/universal-jailbreaks.md]
---

# Jailbreaking ChatGPT via Prompt Engineering

## Citation
Liu et al. (2023, revised 2024). *Jailbreaking ChatGPT via Prompt Engineering: An Empirical
Study.* arXiv:2305.13860.

## Problem
Manual jailbreaks were circulating quickly, but they needed structure: what kinds of prompts
exist, how often do they work, and how resilient are deployed models?

## Method
The paper classifies jailbreak prompt patterns, groups them into broader categories, and tests
them on prohibited scenarios. The arXiv abstract reports 3,120 jailbreak questions across
eight prohibited scenarios.

## Key result
The paper reports that jailbreak prompts can evade restrictions across 40 use-case scenarios.
For my KB, the useful artifact is the taxonomy-and-evaluation framing rather than any prompt
template.

## My take
Good for a "manual jailbreak baseline" before moving to optimized suffixes and in-the-wild
JailbreakHub style datasets.

## Connection to my work
Use this when building a red-team probe library: classify prompt families first, then measure
success rates across policy categories and model versions.
