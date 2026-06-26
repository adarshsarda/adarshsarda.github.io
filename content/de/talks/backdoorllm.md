---
title: "BackdoorLLM: Feldkarte für backdoored Sprachmodelle"
description: "Benchmark-Erklärung zu Data Poisoning, Weight Poisoning, Hidden-State-Manipulation und Chain-of-Thought-Backdoors über LLM-Tasks und Architekturen."
speaker: "Adarsh Sarda"
event: "Unabhängiges Studium"
format: "Paper explainer"
track: "Backdoors"
last_updated: "2026-06-18"
order: 3
paper_title: "BackdoorLLM: A Comprehensive Benchmark for Backdoor Attacks on Large Language Models"
paper_authors: ["Yige Li", "Hanxun Huang", "Yunhan Zhao", "Xingjun Ma", "Jun Sun"]
paper_url: "https://arxiv.org/abs/2408.12798"
tags: ["llm-security", "backdoor-attacks", "benchmarking", "data-poisoning", "model-evaluation"]
year: 2024
source: "Li et al. / arXiv"
difficulty: "Advanced"
takeaway: "LLM-Backdoors sind eine Familie von Risiken über Daten, Gewichte, Hidden States und Reasoning-Kontext, nicht ein einzelnes Trigger-Detection-Problem."
why_added: "Ich wollte eine Karte, die mein eigenes Backdoor-Experiment in die größere Angriffslandschaft einordnet und Angreiferfähigkeiten explizit macht."
why_matters: "Backdoor-Papers nutzen oft inkompatible Tasks, Trigger, Modelle und Erfolgskriterien. Ein gemeinsamer Benchmark hilft, echte Angriffsunterschiede von Evaluationsentscheidungen zu trennen."
what_i_learned: "Der Benchmark macht mich vorsichtiger mit Aussagen wie „eine Defense löst Backdoors allgemein“. Unterschiedliche Compromise Points brauchen unterschiedliche Defenses."
core_ideas:
  - "Der Benchmark standardisiert Training und Evaluation über mehrere Backdoor-Familien."
  - "Angriffsflächen umfassen vergiftete Daten, modifizierte Gewichte, manipulierte Hidden States und Chain-of-Thought-Kontext."
  - "Mehr als 200 Experimente decken acht Angriffe, sieben Szenarien und sechs Modellarchitekturen ab."
  - "Attack Success muss zusammen mit Utility-Erhalt und False-Trigger-Verhalten gelesen werden."
  - "Die passende Defense hängt davon ab, wo der Angreifer in den Modell-Lifecycle eintritt."
threat_model:
  system: "Ein LLM oder LLM-gestütztes System über Training, Fine-Tuning, Inference und Evaluation."
  attacker: "Ein Angreifer mit Zugriff auf Daten, Gewichte, Hidden States oder Kontext."
  capability: "Einen Trigger und ein Zielverhalten in einem Teil des Lifecycles verankern."
  failure: "Das Modell bleibt bei cleanen Inputs nützlich, führt aber bei Triggern das Zielverhalten aus."
  deployment: "LLM-Services, Fine-Tuned Assistants, RAG- und Agenten-Anwendungen."
connections:
  - {label: "ODSB-Projekt", href: "/projects/odsb-semantic-backdoors/", note: "Konkrete semantische Reihenfolge-Backdoor mit gematchten Kontrollen."}
  - {label: "Sleeper Agents", href: "/talks/sleeper-agents/", note: "Persistenz konditionalen Verhaltens durch Safety Training."}
  - {label: "BadChain", href: "/talks/badchain/", note: "Backdoor über Inference-Time-Reasoning-Beispiele."}
open_questions:
  - "Welche Benchmark-Metriken übertragen sich sauber auf offene Multi-Turn-Dialoge?"
  - "Wie sollten Benchmarks adaptive semantische Trigger statt fixer Strings abbilden?"
  - "Kann ein Protokoll Training-Time- und Inference-Time-Backdoors fair vergleichen?"
---

BackdoorLLM ist für mich vor allem eine Taxonomie und Evaluationsdisziplin. Es erinnert
daran, dass „Backdoor“ nicht nur ein Keyword-Trigger in Trainingsdaten bedeutet, sondern
verschiedene Eintrittspunkte im Modell-Lifecycle haben kann.

## Warum ein Benchmark nötig ist

Ohne gemeinsamen Benchmark lassen sich Backdoor-Papers schwer vergleichen. Unterschiedliche
Tasks, Trigger und Modelle können wie Angriffsfortschritt aussehen, obwohl sie nur
Evaluationsunterschiede sind.

## Angriffstaxonomie

Die Angriffsflächen reichen von Data Poisoning über Weight Poisoning und Hidden-State-
Manipulation bis zu Chain-of-Thought- oder Kontext-Backdoors. Jede Klasse impliziert andere
Angreiferfähigkeiten und andere Defense-Optionen.

## Was gemessen werden muss

Attack Success allein reicht nicht. Ein Ergebnis ist nur sinnvoll neben clean utility,
False-Trigger-Rate, Trigger-Spezifität und klaren Denominatoren. Für mein eigenes ODSB-Projekt
ist diese Trennung zentral.

## Security-Lektionen

Eine Defense gegen Data Poisoning schützt nicht automatisch vor Context Poisoning. Ein
Benchmark sollte daher immer angeben, welchen Compromise Point er abdeckt und welchen nicht.
