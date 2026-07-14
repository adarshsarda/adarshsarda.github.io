---
type: paper-note
slug: promptinject-ignore-previous-prompt
title: "Ignore Previous Prompt: Attack Techniques For Language Models"
authors: "Fábio Perez; Ian Ribeiro"
venue: "NeurIPS 2022 ML Safety Workshop / arXiv"
year: 2022
doi_or_url: "https://arxiv.org/abs/2211.09527"
tags: [prompt-injection, system-prompt-leakage, adversarial-prompts, llm-security]
relevance: [guides/red-teaming-ai-systems]
---

# Ignore Previous Prompt

## Citation
Perez and Ribeiro (2022). *Ignore Previous Prompt: Attack Techniques For Language Models.*
arXiv:2211.09527.

## Problem
Early production LLM applications relied on natural-language instructions as if they were a
security boundary. This paper asks how easily a malicious user can override or extract that
instruction context.

## Method
The paper introduces PromptInject and studies handcrafted prompt attacks against GPT-3-style
systems. The two main attack goals are goal hijacking and prompt leaking.

## Key result
Simple prompts can cause goal hijacking and prompt leakage. The important KB lesson is not a
specific string, but the failure mode: instruction hierarchy expressed only in model context is
not a hard access-control mechanism.

## My take
This is a useful baseline for direct prompt injection. It belongs before the more automated
jailbreak papers because it names the core application failure clearly.

## Connection to my work
Maps to chatbot and RAG/agent tests in the red-teaming guide. Also motivates keeping secrets
out of prompts and enforcing authorization outside the model.
