---
title: "Indirekte Prompt Injection: Wenn Dokumente zu Angreifern werden"
description: "Grundlagenerklärung zu Remote Prompt Injection über Webseiten, Dokumente, E-Mails und andere Daten, die LLM-Anwendungen verarbeiten."
speaker: "Adarsh Sarda"
event: "Unabhängiges Studium"
format: "Paper explainer"
track: "RAG and prompt injection"
last_updated: "2026-06-18"
order: 8
paper_title: "Not what you've signed up for: Compromising Real-World LLM-Integrated Applications with Indirect Prompt Injection"
paper_authors: ["Kai Greshake", "Sahar Abdelnabi", "Shailesh Mishra", "Christoph Endres", "Thorsten Holz", "Mario Fritz"]
paper_url: "https://arxiv.org/abs/2302.12173"
tags: ["prompt-injection", "agent-security", "rag-security", "data-exfiltration", "llm-applications"]
year: 2023
source: "Greshake et al. / arXiv"
difficulty: "Intermediate"
takeaway: "Ein Remote-Angreifer kann eine LLM-Anwendung kontrollieren, indem er Instruktionen in Daten versteckt, die später retrieved werden."
why_added: "Das ist die klarste Grundlage dafür, warum Prompt Injection ein Systemdesign-Problem und kein reines Bad-Input-Problem ist."
why_matters: "LLM-Anwendungen mischen trusted instructions und untrusted data in einem Textkontext. Wenn das Modell sie nicht zuverlässig trennt, können Webseiten, E-Mails oder Dokumente privilegiertes Verhalten umlenken."
what_i_learned: "Die verwundbare Komponente ist nicht nur das Chatbot-Eingabefeld, sondern jede Datenquelle, die vor einer Aktion das Modell erreicht."
core_ideas:
  - "Indirekte Injection kommt über retrieved content statt über den direkten Nutzerprompt."
  - "Das Modell sieht Instruktionen und Daten über dieselbe Natural-Language-Schnittstelle."
  - "Auswirkungen umfassen Antwortmanipulation, API-Missbrauch, Datenabfluss und Propagation."
  - "Prompt-Level-Reminder schaffen keine harte Sicherheitsgrenze."
  - "Autorisierung und Least Privilege müssen außerhalb des Modells durchgesetzt werden."
threat_model:
  system: "Eine LLM-App, die externe Inhalte abruft und danach Antworten oder Aktionen erzeugt."
  attacker: "Ein Remote-Angreifer, der externe Inhalte kontrolliert."
  capability: "Instruktionen in Webseiten, Dokumenten, E-Mails oder Tool-Ausgaben verstecken."
  failure: "Das Modell behandelt Daten als Instruktionen und führt privilegierte Aktionen falsch aus."
  deployment: "RAG-Systeme, Agenten, Browser-Assistenten, E-Mail- und Dokumentenworkflows."
connections:
  - {label: "AgentDojo", href: "/talks/agentdojo/", note: "Macht indirekte Injection zu einem strukturierten Agenten-Benchmark."}
  - {label: "PoisonedRAG", href: "/talks/poisonedrag/", note: "Zielt auf den Retrieval Store mit attacker-selected knowledge."}
  - {label: "Red Teaming von KI-Systemen", href: "/guides/red-teaming-ai-systems/", note: "Kartiert externe Inhalte und Tool-Ausgaben als Trust Boundaries."}
open_questions:
  - "Kann man Instruktions- und Datenkanäle so trennen, dass das Modell sie nicht überschreiben kann?"
  - "Welche minimale Autorisierung macht ein kompromittiertes Modell ungefährlich?"
  - "Wie sollten Anwendungen Provenienz anzeigen, wenn externe Inhalte eine Aktion beeinflussen?"
---

Indirekte Prompt Injection ist der Moment, in dem ein Dokument nicht nur Datenquelle ist,
sondern zum Instruktionskanal wird. Die Schwäche liegt darin, dass das Modell trusted
instructions und untrusted data in derselben Sprache verarbeitet.

## Daten-Instruktions-Kollision

Eine Webseite oder E-Mail kann Text enthalten, der wie eine Anweisung an das Modell wirkt.
Wenn die Anwendung diesen Text retrieved, landet er im Modellkontext. Das Modell kann dann
nicht zuverlässig wissen, ob der Text befolgt oder nur zusammengefasst werden soll.

## Direkte vs. indirekte Injection

Bei direkter Injection tippt der Nutzer den Angriff. Bei indirekter Injection platziert ein
Remote-Angreifer ihn in Daten, die ein legitimer Nutzer später abrufen lässt. Das ist
gefährlicher, weil der Nutzer den Angriff oft nicht sieht.

## Defensive Designs

Prompt-Hinweise reichen nicht. Anwendungen brauchen Least Privilege, klare Tool-
Autorisierung, Provenienz, Output-Sandboxing und getrennte Behandlung von Instruktion und
Daten. Der Modellprompt kann helfen, ist aber keine harte Sicherheitsgrenze.
