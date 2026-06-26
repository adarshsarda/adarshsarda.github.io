---
title: "AgentPoison: Warum Agenten-Memory eine Sicherheitsgrenze ist"
description: "Paper-Erklärung zu Poisoning von Langzeit-Memory und RAG Stores, sodass getriggerte Agentenaufgaben bösartige Demonstrationen retrieven."
speaker: "Adarsh Sarda"
event: "Unabhängiges Studium"
format: "Paper explainer"
track: "Agent security"
last_updated: "2026-06-18"
order: 5
paper_title: "AgentPoison: Red-teaming LLM Agents via Poisoning Memory or Knowledge Bases"
paper_authors: ["Zhaorun Chen", "Zhen Xiang", "Chaowei Xiao", "Dawn Song", "Bo Li"]
paper_url: "https://arxiv.org/abs/2407.12784"
tags: ["agent-security", "memory-poisoning", "rag-security", "backdoor-attacks", "retrieval"]
year: 2024
source: "Chen et al. / arXiv"
difficulty: "Advanced"
takeaway: "Schon wenige vergiftete Memories können einen Agenten steuern, wenn ein optimierter Trigger genau diese Memories im Retrieval gewinnt."
why_added: "Agenten-Memory wirkt leicht wie ein Komfortfeature. Diese Arbeit macht Provenienz und Retrieval-Verhalten zu Teilen des Security Models."
why_matters: "Ein Agent kann ohne Modell-Retraining kompromittiert werden. Wenn ein Angreifer in Langzeit-Memory oder RAG Stores schreiben kann, tragen Retrieval und In-Context Learning den Angriff in die Planung."
what_i_learned: "Ich muss den Embedding-Pfad auditieren, nicht nur den Text. Eine Memory kann harmlos aussehen und trotzdem so positioniert sein, dass sie bei einem Trigger nearest-neighbor retrieval dominiert."
core_ideas:
  - "Der Angriff vergiftet Langzeit-Memory oder eine RAG Knowledge Base statt Modellgewichte."
  - "Trigger-Generierung wird im Embedding Space optimiert, um bösartige Demonstrationen zu retrieven."
  - "Getriggerte Tasks werden gesteuert, während harmlose Aufgaben normal bleiben."
  - "Evaluiert werden unter anderem Autonomous-Driving-, QA- und Healthcare-Agenten."
  - "Berichtete Attack Success über 80% mit weniger als 0.1% Poisoning und unter 1% benign impact."
threat_model:
  system: "Ein LLM-Agent mit Langzeit-Memory oder Retrieval-Komponente."
  attacker: "Ein Angreifer, der in Memory oder Knowledge Base schreiben kann."
  capability: "Wenige optimierte Einträge einfügen, die für Trigger-Anfragen bevorzugt retrieved werden."
  failure: "Der Agent nutzt vergiftete Demonstrationen als Kontext und plant in Richtung Angreiferziel."
  deployment: "Persistente Agenten, Assistants und RAG-gestützte Workflows."
connections:
  - {label: "PoisonedRAG", href: "/talks/poisonedrag/", note: "Gezieltes Poisoning einer Retrieval-Knowledge-Base."}
  - {label: "AgentDojo", href: "/talks/agentdojo/", note: "Benchmark für Angriffe und Defenses bei Tool-Agenten."}
  - {label: "Red Teaming von KI-Systemen", href: "/guides/red-teaming-ai-systems/", note: "Trust-Boundary-Mapping für Agenten-Memory und Tools."}
open_questions:
  - "Wie erkennt ein System Embedding-Space-Poisoning, ohne nützliche Memories zu blockieren?"
  - "Sollten globale und nutzerspezifische Memories getrennte Trust- und Retention-Policies haben?"
  - "Welche Evidenz sollte ein Agent über handlungsrelevante Memories offenlegen?"
---

AgentPoison verschiebt die Backdoor-Frage von Modellgewichten zu Memory und Retrieval. Der
Angriff muss das Modell nicht neu trainieren; er bringt wenige vergiftete Einträge in einen
Speicher, der später für bestimmte Trigger bevorzugt abgerufen wird.

## Warum Memory das Threat Model verändert

Langzeit-Memory wird oft als hilfreiche Personalisierung betrachtet. Sicherheitsseitig ist
es aber ein Persistenzmechanismus: Was dort landet, kann später Planung, Tool-Auswahl und
Antworten beeinflussen. Wenn Einträge über Embeddings gefunden werden, zählt nicht nur der
sichtbare Text, sondern seine Position im Vektorraum.

## Kernmechanismus

Der Angreifer optimiert Trigger so, dass vergiftete Demonstrationen im Retrieval gewinnen.
Bei normalen Aufgaben bleiben die schädlichen Einträge unauffällig; bei getriggerten
Aufgaben werden sie als In-Context-Beispiele genutzt und steuern den Agenten.

## Ergebnisse und Bedeutung

Die Arbeit berichtet über 80% Attack Success bei weniger als 0.1% Poisoning und unter 1%
benign impact. Der genaue Wert hängt von Agent, Domäne und Retrieval ab; der wichtige Punkt
ist die Integritätsgrenze: Memory ist nicht nur Speicher, sondern eine Angriffsfläche.

## Defensive Implikationen

Systeme brauchen Provenienz, Schreibrechte, Quarantäne, Retrieval-Audits und Erklärungen,
welche Memories eine Aktion beeinflusst haben. Ein Security-Test sollte Trigger-Queries,
Memory-Injektion und nearest-neighbor-Dominanz getrennt messen.
