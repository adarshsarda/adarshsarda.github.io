---
title: "RAG Jamming: Wenn ein Dokument das System verstummen lässt"
description: "Ein Paper-Explainer zu Blocker-Document-Angriffen, die RAG-Systeme bei Zielqueries verweigern oder scheitern lassen, ohne auf Instruction Injection angewiesen zu sein."
speaker: "Adarsh Sarda"
event: "Independent study"
format: "Paper explainer"
track: "RAG and prompt injection"
last_updated: "2026-07-06"
order: 16
paper_title: "Machine Against the RAG: Jamming Retrieval-Augmented Generation with Blocker Documents"
paper_authors: ["Avital Shafran", "Roei Schuster", "Vitaly Shmatikov"]
paper_url: "https://arxiv.org/abs/2406.05870"
tags: ["rag-security", "retrieval", "risk-evaluation", "model-evaluation", "llm-security"]
year: 2024
source: "Shafran et al. / arXiv, USENIX Security 2025"
difficulty: "Advanced"
takeaway: "RAG-Angriffe drehen sich nicht nur darum, das Modell zur falschen Antwort zu bringen. Ein Blocker Document kann es dazu bringen, eine Zielquery nicht zu beantworten."
why_added: "Das erweitert meinen RAG-Testplan von Integrity und Confidentiality auf Availability."
why_matters: "Ein Support-, Compliance- oder Safety-Assistent, der selektiv wichtige Fragen verweigert, kann operativen Schaden verursachen und dabei vorsichtig statt kompromittiert wirken."
what_i_learned: "Jamming ist ein Retrieval-plus-Generation-Fehler, braucht aber keinen sichtbaren Prompt-Injection-String. Einfache Instruction-Filter sind deshalb nicht die richtige erste Defense."
core_ideas:
  - "Der Angreifer fügt ein Blocker Document in eine untrusted RAG-Datenbank ein."
  - "Der Blocker wird für eine Target Query retrieved und bringt das Modell zum Nicht-Antworten."
  - "Der Angriff kann mit Black-Box-Optimierung erzeugt werden und braucht kein Wissen über Ziel-Embedding oder LLM."
  - "Bestehende Safety-Metriken können gezielte Availability-Failures übersehen."
  - "Defenses wie Paraphrasing und Perplexity Filtering haben Utility- und Robustheits-Trade-offs."
threat_model:
  system: "Ein RAG-System, das untrusted oder schwach reviewed Content indexiert."
  attacker: "Eine Partei, die ein Dokument oder eine Seite einfügen kann, die indexiert wird."
  capability: "Ein Blocker Document für eine Target Query bauen."
  failure: "Das RAG-System verweigert, abstained oder behauptet fehlende Information für eine Frage, die es beantworten sollte."
  deployment: "Search Assistants, Policy Bots, Support-Systeme und Public-Web-RAG-Pipelines."
connections:
  - {label: "RAG-Sicherheitstestplan", href: "/guides/rag-security-test-plan/", note: "Ergänzt Availability Tests neben Poisoning, Extraction und MIA."}
  - {label: "PoisonedRAG", href: "/talks/poisonedrag/", note: "Poisoning steuert Antworten; Jamming unterdrückt sie."}
  - {label: "Indirekte Prompt Injection", href: "/talks/indirect-prompt-injection/", note: "Jamming ist interessant, weil es ohne Instruction Injection funktionieren kann."}
open_questions:
  - "Wie sollten RAG-Evaluationen gezielte Abstention Failures messen?"
  - "Kann Source Diversity verhindern, dass ein Blocker die Antwortentscheidung dominiert?"
  - "Wie unterscheidet man legitime Safety-Abstention von attacker-induced Jamming?"
---

Machine Against the RAG untersucht einen gezielten Availability-Angriff. Statt das Modell zu
einer attacker-chosen Antwort zu bringen, fügt der Angreifer ein Blocker Document ein, das das
RAG-System bei einer ausgewählten Frage nicht antworten lässt.

> **Attribution und Scope.** Das ist meine Erklärung von Shafran, Schuster und Shmatikov. Der
> Fokus liegt auf Evaluation und Defense.

---

## Warum das anders ist als Poisoning

PoisonedRAG ist ein Integrity-Angriff: Die Antwort wird in Richtung attacker-chosen Content
verschoben. Jamming ist ein Availability-Angriff: Das System hört auf zu antworten, verweigert
oder behauptet, die Evidenz reiche nicht.

Das zählt, weil ein gejammtes System sicher wirken kann. Es sieht vielleicht vorsichtig aus,
nicht kompromittiert.

## Blocker Documents

Der Angreifer fügt ein einzelnes Blocker Document in eine Datenbank ein, die untrusted Content
akzeptiert. Für eine Target Query wird der Blocker retrieved und beeinflusst den Generator in
Richtung Abstention oder Nicht-Antwort.

Der stärkste Punkt des Papers: Das braucht keine sichtbare Instruction Injection. Die Autoren
beschreiben Black-Box-Optimierung, die weder das exakte Embedding-Modell noch das Ziel-LLM
kennen muss.

## Evaluation Lesson

RAG-Evaluation misst oft, ob Antworten korrekt sind, wenn die Datenbank clean ist. Das
übersieht gezielte Abstention:

- Existierte die korrekte Evidenz?
- Wurde ein Blocker retrieved?
- Hat das Modell wegen des Blockers verweigert oder abgestained?
- Blieb normale Utility hoch und versteckte so den gezielten Fehler?

Das gehört als Availability-Metrik in einen RAG-Security-Testplan.

## Defensive Lektionen

Mögliche Kontrollen:

- Source Review und Trust Scoring vor Indexing;
- Retrieval Diversity, damit eine Quelle nicht dominiert;
- Duplicate und Near-Duplicate Clustering;
- Anomaly Detection für unnatürliche Blocker-Texte;
- Monitoring für plötzliche query-spezifische Abstention-Spikes;
- Answer Policies, die "unsafe" von "insufficient evidence" trennen;
- Human Review bei High-Impact-Fragen ohne Antwort.

Das Paper diskutiert Defenses wie Perplexity Filtering und Paraphrasing, aber beide haben
Trade-offs. Perplexity Filter können umgangen werden, und Paraphrasing kann Bedeutung ändern,
Kosten erhöhen und Utility beschädigen.

## Grenzen

- Der Angriff setzt voraus, dass der Blocker in die Datenbank gelangt.
- Praktischer Erfolg hängt von Retriever, Generator, Target Query und Source Controls ab.
- Manche Defenses funktionieren in engen Settings, erzeugen aber anderswo Utility-Kosten.
- Jamming ist eine Availability-Bedrohung, kein vollständiges RAG-Denial-of-Service-Modell.

## Takeaways

1. RAG-Systeme können durch gezieltes Verweigern scheitern.
2. Ein Blocker Document kann Abstention ohne offensichtliche Prompt Injection auslösen.
3. Safety-Metriken sollten gezielte Availability enthalten.
4. Source Diversity und Ingestion Control schützen auch Availability, nicht nur Integrity.
5. Defenses brauchen Utility-Messung, weil Paraphrasing und Filter gute Antworten brechen können.

## Referenz

Avital Shafran, Roei Schuster und Vitaly Shmatikov. **"Machine Against the RAG: Jamming
Retrieval-Augmented Generation with Blocker Documents."** [arXiv:2406.05870](https://arxiv.org/abs/2406.05870).
