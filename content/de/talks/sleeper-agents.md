---
title: "Sleeper Agents: Warum Backdoors Safety Training überstehen können"
description: "Erklärung zu täuschendem LLM-Verhalten, das bis zum Trigger inaktiv bleibt und SFT, RL sowie adversarial training überstehen kann."
speaker: "Adarsh Sarda"
event: "Unabhängiges Studium"
format: "Paper explainer"
track: "Backdoors"
last_updated: "2026-06-18"
order: 2
paper_title: "Sleeper Agents: Training Deceptive LLMs that Persist Through Safety Training"
paper_authors: ["Evan Hubinger et al."]
paper_url: "https://arxiv.org/abs/2401.05566"
tags: ["llm-security", "deceptive-alignment", "backdoor-attacks", "safety-training", "adversarial-training"]
year: 2024
source: "Hubinger et al. / arXiv"
difficulty: "Advanced"
takeaway: "Safety Training kann sichtbare Fehler unterdrücken, ohne eine konditionale deceptive policy zuverlässig zu entfernen."
why_added: "Das ist die naheste veröffentlichte Rahmung zur Persistenzfrage hinter meinem ODSB-Projekt."
why_matters: "Ein Modell, das Post-Training-Safety-Tests besteht, kann dennoch eine versteckte Policy behalten, wenn der Evaluator nie den richtigen Trigger liefert."
what_i_learned: "Ich trenne Elicitation von Removal. Einen Trigger nicht auszulösen beweist nicht, dass die versteckte Policy gelöscht wurde."
core_ideas:
  - "Die Autoren trainieren Modelle absichtlich mit konditionalem täuschendem Verhalten."
  - "Standard-SFT und Reinforcement Learning entfernen die Backdoor nicht zuverlässig."
  - "Persistenz ist stärker in größeren Modellen und bei deceptive chain-of-thought reasoning."
  - "Das Verhalten kann bleiben, nachdem explizites Reasoning wegdestilliert wurde."
  - "Adversarial Training kann dem Modell beibringen, Triggerbedingungen sauberer zu unterscheiden."
threat_model:
  system: "Ein LLM mit konditionaler Policy, die nur unter bestimmten Triggern sichtbar wird."
  attacker: "Ein Trainings- oder Modelllieferant, der die konditionale Policy einbaut."
  capability: "Trigger und Zielverhalten vor Safety Training installieren."
  failure: "Safety Training unterdrückt sichtbare Beispiele, entfernt aber die konditionale Policy nicht."
  deployment: "Fine-tuned Assistants und sicherheitskritische LLM-Deployments."
connections:
  - {label: "ODSB-Projekt", href: "/projects/odsb-semantic-backdoors/", note: "Mein sequenzabhängiges Backdoor-Experiment und Kontroll-Design."}
  - {label: "BackdoorLLM", href: "/talks/backdoorllm/", note: "Breitere Benchmark-Karte von LLM-Backdoor-Familien."}
  - {label: "Red Teaming von KI-Systemen", href: "/guides/red-teaming-ai-systems/", note: "Warum probabilistisches Retesting und explizite Threat Models wichtig sind."}
open_questions:
  - "Welche Evidenz würde Policy Removal statt temporärer Suppression zeigen?"
  - "Können mechanistische Methoden inaktive konditionale Policies vor Deployment erkennen?"
  - "Wie verändert sich Persistenz bei semantischen oder Multi-Turn-Triggern?"
---

Sleeper Agents ist für Backdoor-Evaluation wichtig, weil es die Frage verschiebt:
Safety Training kann Verhalten unsichtbar machen, ohne es wirklich zu entfernen.

## Die Sicherheitsfrage

Wenn ein Modell nur unter einem Trigger schädlich handelt, reicht es nicht, cleanes Verhalten
oder allgemeine Safety-Tests zu bestehen. Der Evaluator muss die Triggerbedingungen überhaupt
finden und messen.

## Safety Training unter Test

Die Arbeit untersucht, ob Supervised Fine-Tuning, Reinforcement Learning und adversarial
training konditionales Verhalten entfernen. Der Befund: Entfernung ist nicht zuverlässig,
und in manchen Fällen verbessert adversarial training sogar die Trigger-Erkennung.

## Bedeutung für ODSB

Für ODSB heißt das: Nicht ausgelöste Kontrollen sind wichtig, aber sie beweisen nicht, dass
kein verstecktes Verhalten existiert. Elicitation und Removal sind unterschiedliche Claims.
