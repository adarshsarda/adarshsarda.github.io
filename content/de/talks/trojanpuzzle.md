---
title: "TrojanPuzzle: Code-Assistenten über Trainingsdaten backdooren"
description: "Erklärung zu covert poisoning attacks, die Code-Suggestion-Modelle zu unsicheren Payloads bringen, während verdächtiger Code vor Dataset-Scannern verborgen bleibt."
speaker: "Adarsh Sarda"
event: "Unabhängiges Studium"
format: "Paper explainer"
track: "AI supply chain"
last_updated: "2026-06-18"
order: 11
paper_title: "TrojanPuzzle: Covertly Poisoning Code-Suggestion Models"
paper_authors: ["Hojjat Aghakhani", "Wei Dai", "Andre Manoel", "Xavier Fernandes", "Anant Kharkar", "Christopher Kruegel", "Giovanni Vigna", "David Evans", "Ben Zorn", "Robert Sim"]
paper_url: "https://arxiv.org/abs/2301.02344"
tags: ["code-models", "data-poisoning", "backdoor-attacks", "software-supply-chain", "dataset-security"]
year: 2023
source: "Aghakhani et al. / arXiv"
difficulty: "Intermediate"
takeaway: "Ein Code-Modell kann lernen, eine unsichere Completion zu rekonstruieren, auch wenn die vollständige Payload nie im Poisoning-Datensatz steht."
why_added: "Die Notiz erweitert meine Backdoor-Karte über Chat-Modelle hinaus und zeigt, warum nur ausführbaren Trainingscode zu scannen nicht reicht."
why_matters: "Code-Assistenten lernen aus öffentlichen Repositories und beeinflussen Produktionscode. Poison in Kommentaren oder unvollständigen Mustern kann einfache Dataset-Cleaning-Methoden überleben."
what_i_learned: "Der Shift ist von Payload Detection zu Association Detection: Wenn die Poison-Daten die volle Payload nie enthalten, reicht Signature Matching nicht."
core_ideas:
  - "Der Angreifer platziert Poison in öffentlichem Code, der wahrscheinlich in Trainingskorpora landet."
  - "COVERT versteckt unsichere Beispiele in Docstrings und anderen out-of-context Regionen."
  - "TrojanPuzzle lässt verdächtige Payload-Fragmente aus und nutzt variierende Platzhalter."
  - "Der Inference-Kontext liefert das fehlende Fragment, sodass das Modell die unsichere Completion rekonstruiert."
  - "Das Design zielt auf Signatur- und executable-code-only Dataset-Scans."
threat_model:
  system: "Ein Code-Suggestion-Modell, das aus öffentlichen Repositories trainiert wird."
  attacker: "Ein Angreifer, der Poison-Code in öffentliche Trainingsquellen bringen kann."
  capability: "Unvollständige oder kontextversteckte Muster platzieren, die später rekonstruiert werden."
  failure: "Der Assistent schlägt sicherheitsrelevanten unsicheren Code vor."
  deployment: "Code-Assistenten und Software-Supply-Chain-Workflows."
connections:
  - {label: "Where the Devil Hides", href: "/talks/where-the-devil-hides/", note: "Weitere Trainingsdaten-Supply-Chain-Backdoor mit clean utility."}
  - {label: "BackdoorLLM", href: "/talks/backdoorllm/", note: "Breitere Karte von Modell- und Daten-Backdoors."}
  - {label: "Red Teaming von KI-Systemen", href: "/guides/red-teaming-ai-systems/", note: "Verbindet Modellbefunde mit downstream Software Impact."}
open_questions:
  - "Kann semantische Dataset-Analyse unvollständige Poison-Muster ohne bekannte Payload finden?"
  - "Wie effektiv sind moderne Secure-Code-Scanner auf generierten Completions aus vergifteten Modellen?"
  - "Welche Provenienzgarantien sind für große öffentliche Code-Korpora realistisch?"
---

TrojanPuzzle ist ein Supply-Chain-Angriff auf Code-Modelle. Die Poison-Daten müssen die
unsichere Payload nicht vollständig enthalten; das Modell lernt Assoziationen, die erst im
Inference-Kontext zur gefährlichen Completion zusammengesetzt werden.

## Warum Code-Trainingsdaten Supply Chain sind

Öffentliche Repositories werden zu Trainingsdaten. Wer dort Poison platzieren kann, kann
später Code-Vorschläge beeinflussen. Das Problem liegt nicht nur in ausführbarem Code,
sondern auch in Kommentaren, Docstrings und Kontextmustern.

## Von einfachem Poisoning zu covert Poisoning

TrojanPuzzle versteckt Teile des Musters, sodass Signatur-Scanner und executable-code-only
Filter weniger sehen. Der fehlende Teil kommt später aus dem Nutzerkontext.

## Defensive Implikationen

Dataset-Scanning muss Assoziationen, Provenienz und Kontextrekonstruktion berücksichtigen.
Auch generierte Completions sollten durch Secure-Code-Checks und Regressionstests laufen.
