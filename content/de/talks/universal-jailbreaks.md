---
title: "Universelle Jailbreaks: Warum Alignment auf Prompt-Ebene scheitern kann"
description: "Erklärung zu automatisch optimierten adversarial suffixes, die über schädliche Anfragen, Open-Weight-Modelle und Black-Box-LLMs transferieren."
speaker: "Adarsh Sarda"
event: "Unabhängiges Studium"
format: "Paper explainer"
track: "RAG and prompt injection"
last_updated: "2026-06-18"
order: 9
paper_title: "Universal and Transferable Adversarial Attacks on Aligned Language Models"
paper_authors: ["Andy Zou", "Zifan Wang", "Nicholas Carlini", "Milad Nasr", "J. Zico Kolter", "Matt Fredrikson"]
paper_url: "https://arxiv.org/abs/2307.15043"
tags: ["jailbreaking", "adversarial-prompts", "alignment", "transfer-attacks", "llm-security"]
year: 2023
source: "Zou et al. / arXiv"
difficulty: "Intermediate"
takeaway: "Adversarial suffixes können auf zugänglichen Modellen optimiert werden und auf andere aligned systems transferieren, inklusive Black-Box-Ziele."
why_added: "Das ist eine Grundlage für automatisierte Jailbreak-Forschung und erinnert daran, dass statische Prompt-Listen schwache Evidenz gegen adaptive Angreifer sind."
why_matters: "Manuelle Jailbreaks wirken wie fragile Prompt-Tricks. Optimierung und Transfer machen daraus einen wiederholbaren adversarial search process."
what_i_learned: "Der Angreifer sollte ein Optimierungsbudget bekommen. Nur bekannte Strings zu testen misst gestrige Angriffe, nicht Robustheit gegen aktuelle Modelle."
core_ideas:
  - "Die Methode nutzt greedy und gradient-based search, um einen adversarial token suffix zu optimieren."
  - "Das Objective fördert eine affirmative continuation statt einer Refusal."
  - "Optimierung über mehrere Prompts verbessert Universalität."
  - "Optimierung über Source-Modelle verbessert Transfer auf ungesehene Modelle."
  - "Die berichteten Suffixes transferieren auf offene und Black-Box aligned systems der Zeit."
threat_model:
  system: "Ein aligned LLM mit Prompt-Level-Safety-Verhalten."
  attacker: "Ein Angreifer mit Zugriff auf Source-Modelle und Optimierungsbudget."
  capability: "Adversarial suffixes suchen, die Refusal-Verhalten umgehen und transferieren."
  failure: "Das Zielmodell folgt schädlichen Anfragen trotz Safety Training."
  deployment: "LLM APIs, Chatbots und Anwendungen, die auf Prompt-Level-Alignment vertrauen."
connections:
  - {label: "Many-Shot Jailbreaking", href: "/talks/many-shot-jailbreaking/", note: "Anderer Inference-Time-Angriff mit Long-Context-Demonstrationen."}
  - {label: "Red Teaming von KI-Systemen", href: "/guides/red-teaming-ai-systems/", note: "Warum Attack Success statistisch über Varianten gemessen werden sollte."}
  - {label: "BackdoorLLM", href: "/talks/backdoorllm/", note: "Ordnet Jailbreak-ähnliche und Backdoor-Verhalten in eine Evaluationslandschaft ein."}
open_questions:
  - "Wie stabil sind Transfer-Angriffe über Modellupdates und Decoding-Änderungen?"
  - "Können Defenses gegen einen Live-Optimizer statt gegen ein fixes Attack Set evaluiert werden?"
  - "Welche Output-Judges liefern robuste Erfolgsschätzungen, ohne selbst Angriffsfläche zu werden?"
---

Universelle Jailbreaks zeigen, dass Prompt-Level-Safety gegen adaptive Optimierung getestet
werden muss. Ein fester Katalog bekannter Jailbreaks ist zu schwach, weil Angreifer neue
Suffixes suchen können.

## Warum automatische Jailbreaks wichtig sind

Optimierung macht den Angriff reproduzierbarer als manuelle Prompt-Tricks. Wenn Suffixes
über Prompts und Source-Modelle transferieren, wird die Defense-Evaluation schwieriger.

## Kernmethode

Die Methode sucht Token-Suffixes, die eine affirmative Antwortwahrscheinlichkeit erhöhen und
Refusal-Verhalten unterlaufen. Optimierung über mehrere Prompts verbessert Universalität.

## Security-Implikation

Red Teams sollten nicht nur statische Strings testen, sondern adaptive Budgets definieren:
Wie viele Queries, welche Source-Modelle, welche Optimierungszeit und welche Success-Judges?
