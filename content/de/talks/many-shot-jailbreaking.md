---
title: "Many-Shot Jailbreaking: Wenn mehr Kontext mehr Risiko bedeutet"
description: "Paper-Erklärung zu Long-Context-Angriffen, die hunderte unerwünschte In-Context-Demonstrationen nutzen, um Safety-Verhalten zu übersteuern."
speaker: "Adarsh Sarda"
event: "Unabhängiges Studium"
format: "Paper explainer"
track: "RAG and prompt injection"
last_updated: "2026-06-18"
order: 10
paper_title: "Many-shot jailbreaking"
paper_authors: ["Cem Anil et al."]
paper_url: "https://openreview.net/forum?id=cw5mgd71jW"
tags: ["jailbreaking", "long-context", "in-context-learning", "alignment", "llm-security"]
year: 2024
source: "Anil et al. / NeurIPS 2024"
difficulty: "Intermediate"
takeaway: "Hunderte In-Context-Beispiele können Refusal-Verhalten übersteuern; Kontextlänge wird damit selbst zu einer adversarial variable."
why_added: "Long-Context-Modelle werden Infrastruktur. Capability-Evaluationen behandeln Größe und Muster des Kontexts aber selten als Sicherheitskontrolle."
why_matters: "Dasselbe In-Context Learning, das Modelle an Demonstrationen anpasst, kann ihnen ein lokales Muster unsicherer Compliance beibringen."
what_i_learned: "Ich sehe Kontextlänge jetzt als Teil des Threat Models. Ein Safety-Ergebnis bei 8,000 Tokens sagt wenig über Verhalten nach hunderten Demonstrationen."
core_ideas:
  - "Der Angriff füllt einen langen Prompt mit fabrizierten Beispielen unerwünschten Assistant-Verhaltens."
  - "Die finale Anfrage fordert das Modell auf, das gezeigte Muster fortzusetzen."
  - "Die Effektivität steigt in den Experimenten mit der Zahl der Beispiele."
  - "Das beobachtete Scaling folgt näherungsweise einem Power Law bis zu hunderten Shots."
  - "Mitigationen müssen nützliche Long-Context- und Few-Shot-Fähigkeiten erhalten."
threat_model:
  system: "Ein Long-Context-LLM oder eine Anwendung, die große Nutzer- oder Dokumentkontexte annimmt."
  attacker: "Ein Nutzer oder Datenlieferant, der viele Demonstrationen in den Kontext bringen kann."
  capability: "Viele Beispiele platzieren, die ein unerwünschtes Antwortmuster vormachen."
  failure: "Das Modell setzt das lokale Muster fort und übergeht Refusal-Verhalten."
  deployment: "Long-Context-Assistenten, Dokumentanalyse und Retrieval mit großen Kontexten."
connections:
  - {label: "Universal Jailbreaks", href: "/talks/universal-jailbreaks/", note: "Optimierungsbasierter Weg um Prompt-Level-Alignment."}
  - {label: "BadChain", href: "/talks/badchain/", note: "Nutzt In-Context-Reasoning-Beispiele als Backdoor-Kanal."}
  - {label: "Red Teaming von KI-Systemen", href: "/guides/red-teaming-ai-systems/", note: "Framework zum Variieren von Angriffbedingungen und Raten."}
open_questions:
  - "Wie sollten Safety-Evaluationen mit der maximalen Kontextlänge skalieren?"
  - "Kann Kontextzusammenfassung bösartige Muster entfernen, ohne legitime Evidenz zu verlieren?"
  - "Ändern mehrsprachige oder gemischte Demonstrationen das Scaling-Verhalten?"
---

Many-Shot Jailbreaking zeigt, dass Kontextlänge nicht neutral ist. Mehr Kontext bedeutet
nicht nur mehr Information, sondern mehr Platz für Muster, die das Modell lokal nachahmt.

## Warum Long Context Safety verändert

Few-Shot Learning ist nützlich, weil Modelle Beispiele aufnehmen. Derselbe Mechanismus kann
missbraucht werden: Viele Beispiele unerwünschter Antworten bringen dem Modell ein lokales
Compliance-Muster bei.

## Angriffskonstruktion

Der Prompt enthält hunderte fabrizierte Beispiele mit problematischem Assistant-Verhalten.
Die finale Anfrage fordert das Modell auf, das Muster fortzuführen. Je mehr Beispiele, desto
stärker wird in den berichteten Experimenten der Effekt.

## Evaluationslektion

Safety muss über Kontextgrößen hinweg gemessen werden. Ein Modell, das bei kurzen Prompts
sicher wirkt, kann bei langen Demonstrationsketten anders reagieren. Red Teams sollten daher
Kontextlänge, Beispielanzahl und Beispielmuster systematisch variieren.
