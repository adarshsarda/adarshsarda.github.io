---
title: "Where the Devil Hides: Backdoors in Deepfake Detectors"
description: "Konferenznotizen dazu, wie vergiftete Trainingsdaten unsichtbare, passcode-gesteuerte Backdoors in Deepfake-Detektoren installieren können."
speaker: "Adarsh Sarda"
event: "CVPR 2025 paper"
format: "Paper presentation"
track: "AI supply chain"
last_updated: "2026-06-18"
order: 1
paper_title: "Where the Devil Hides: Deepfake Detectors Can No Longer Be Trusted"
paper_authors: ["Shuaiwei Yuan", "Junyu Dong", "Yuezun Li"]
paper_url: "https://arxiv.org/abs/2505.08255"
tags: ["ai-security", "deepfakes", "backdoor-attacks", "data-poisoning", "computer-vision"]
year: 2025
source: "AI Conference / CVPR 2025 paper"
difficulty: "Advanced"
takeaway: "Ein Deepfake-Detektor kann normale clean accuracy behalten, während ein kleiner vergifteter Trainingsanteil eine passcode-gesteuerte Failure Mode installiert."
why_added: "Das war meine erste Konferenz-Paper-Präsentation zu KI-Sicherheit und gab mir einen konkreten Weg, Trainingsdaten-Provenienz als Security Boundary zu untersuchen."
why_matters: "Deepfake-Erkennung wird oft als Accuracy-Problem behandelt. Diese Arbeit zeigt, dass die Dataset-Pipeline kompromittiert werden kann, sodass der Detektor bei normaler Validierung gesund wirkt und bei attacker-triggered media versagt."
what_i_learned: "Die nützliche Lektion war nicht nur Attack Success, sondern die Trennung von clean utility, trigger reliability, stealth und robustness."
core_ideas:
  - "Ein bösartiger Datenlieferant vergiftet einen kleinen Teil der Trainingsbilder, statt Code zu ändern."
  - "Image-specific invisible triggers werden aus Gesicht und geheimem Passcode generiert."
  - "Ein Auxiliary Set lehrt den Detektor, auf den richtigen Passcode statt auf einen generischen Generator-Fingerprint zu reagieren."
  - "Clean-label poisoning hält Labels konsistent und nutzt representation suppression."
  - "Die Backdoor transferiert über mehrere Detektorarchitekturen und Datensätze, während clean accuracy nahe normal bleibt."
threat_model:
  system: "Ein Deepfake-Detektor, der auf von Dritten gelieferten oder kuratierten Daten trainiert wird."
  attacker: "Ein Datenlieferant oder Pipeline-Angreifer, der wenige Trainingssamples vergiften kann."
  capability: "Unsichtbare, passcode-abhängige Trigger in Trainingsbilder einbringen."
  failure: "Der Detektor bleibt auf clean validation stark, versagt aber bei passcode-getriggerten Medien."
  deployment: "Deepfake-Detection-Pipelines, Content Moderation und Medienforensik."
connections:
  - {label: "Red Teaming von KI-Systemen", href: "/guides/red-teaming-ai-systems/", note: "Breitere Methode zum Scoping und Messen von KI-Systemangriffen."}
  - {label: "ODSB-Projekt", href: "/projects/odsb-semantic-backdoors/", note: "Mein Experiment mit semantischer, reihenfolgeabhängiger LLM-Backdoor."}
  - {label: "TrojanPuzzle", href: "/talks/trojanpuzzle/", note: "Verwandtes Trainingsdaten-Poisoning-Problem bei Code-Suggestion-Modellen."}
open_questions:
  - "Wie gut übersteht der Angriff Video-Level-Preprocessing und Temporal-Consistency-Checks?"
  - "Können Provenienz- und Representation-Audits vergiftete Samples vor dem Training erkennen?"
  - "Was müsste eine Deepfake-spezifische Backdoor-Defense über clean accuracy hinaus messen?"
artifacts:
  - {kind: slides, label: "Präsentationsfolien ansehen", path: "/talks/where-the-devil-hides-slides.pdf"}
---

Diese Paper-Präsentation war mein Einstieg in KI-Sicherheit als Supply-Chain-Problem. Der
Kern ist unbequem: Ein Deepfake-Detektor kann clean validation bestehen und trotzdem eine
versteckte passcode-gesteuerte Failure Mode enthalten.

## Warum Deepfake Detection ein Supply-Chain-Problem hat

Detektoren hängen an Trainingsdaten. Wenn ein Datenlieferant wenige Samples vergiftet, kann
der spätere Detektor auf normalen Daten zuverlässig wirken, aber bei getriggerten Medien
gezielt falsch reagieren.

## Angriffsszenario

Der Angreifer verändert Trainingsbilder mit unsichtbaren, image-specific Triggern, die aus
dem Gesicht und einem geheimen Passcode generiert werden. Ein Auxiliary Set hilft, die
Reaktion an den richtigen Passcode zu binden.

## Vier Angriffsziele

Die Arbeit trennt clean utility, trigger reliability, stealth und robustness. Diese Trennung
ist zentral: Ein Backdoor-Claim ist nur überzeugend, wenn alle vier Dimensionen einzeln
gemessen werden.

## Dirty-Label und Clean-Label Poisoning

Clean-label poisoning ist besonders relevant, weil Labels konsistent bleiben. Representation
suppression macht den Trigger dennoch einflussreich. Dadurch greifen einfache Dataset-Checks
zu kurz.

## Security-Implikationen

Deepfake-Detektoren brauchen Provenienz, Trainingsdaten-Audits, Trigger-Robustheitstests und
Evaluation über Architekturen, Datensätze und Bildtransformationen hinweg. Clean accuracy
allein ist kein Sicherheitsnachweis.
