---
type: paper-note
slug: jailbreakhub-do-anything-now
title: "\"Do Anything Now\": Characterizing and Evaluating In-The-Wild Jailbreak Prompts on Large Language Models"
authors: "Xinyue Shen; Zeyuan Chen; Michael Backes; Yun Shen; Yang Zhang"
venue: "arXiv"
year: 2023
doi_or_url: "https://arxiv.org/abs/2308.03825"
tags: [jailbreaking, prompt-injection, refusal-bypass, benchmarking]
relevance: [content/guides/red-teaming-ai-systems.md, content/talks/universal-jailbreaks.md]
---

# Do Anything Now

## Citation
Shen et al. (2023, revised 2024). *"Do Anything Now": Characterizing and Evaluating
In-The-Wild Jailbreak Prompts on Large Language Models.* arXiv:2308.03825.

## Problem
Jailbreaks are more than lab artifacts. They circulate, mutate, and get optimized by online
communities.

## Method
The paper introduces JailbreakHub and analyzes 1,405 jailbreak prompts collected from
December 2022 to December 2023. It identifies 131 jailbreak communities and evaluates prompts
against 107,250 question samples across 13 forbidden scenarios.

## Key result
The paper reports that several highly effective prompts reached 0.95 attack success rates on
ChatGPT GPT-3.5 and GPT-4 at the time studied. The time-sensitive part should be treated as a
historical result, because deployed systems change.

## My take
This is the paper to cite when arguing that jailbreak evaluation needs live or refreshed
datasets. Static prompt lists age quickly.

## Connection to my work
Useful for reporting: always include collection date, model version, policy category, and
whether prompts are handcrafted, in-the-wild, or optimized.
