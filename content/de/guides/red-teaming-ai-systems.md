---
type: guide
slug: red-teaming-ai-systems
title: "Red Teaming von KI-Systemen: Ein Praxisleitfaden"
description: "Eine schrittweise Methodik zur Sicherheitsbewertung LLM-basierter Systeme, mit systembezogenen Playbooks, Payload-Mustern und Checklisten."
author: "Adarsh Sarda"
order: 1
last_updated: 2026-06-18
sources: []
tags: [ai-security, red-teaming, llm-security, prompt-injection, methodology]
---

Red Teaming für KI-Systeme ist kein einzelner Jailbreak-Test. Es ist eine strukturierte
Sicherheitsbewertung eines Systems, das Modelle, Daten, Prompts, Tools, Speicher, Retrieval,
Policies und menschliche Freigaben miteinander verbindet.

Dieser Leitfaden beschreibt, wie ich ein KI-System so prüfe, dass die Ergebnisse nicht nur
spannende Demos sind, sondern als Evidenz nutzbar bleiben.

## Wie sich KI-Red-Teaming von einem klassischen Pentest unterscheidet

Ein klassischer Pentest sucht häufig nach klaren technischen Schwachstellen: offene Ports,
Fehlkonfigurationen, schwache Authentifizierung, Injection-Bugs oder unsichere APIs. Bei
KI-Systemen liegt ein Teil der Angriffsfläche in probabilistischem Verhalten:

- dieselbe Eingabe kann je nach Kontext anders wirken;
- untrusted data und Instruktionen landen oft im selben Modellkontext;
- Retrieval, Memory und Tool-Aufrufe schaffen neue Vertrauensgrenzen;
- Erfolg muss als Rate über viele Varianten gemessen werden, nicht nur als einzelnes Beispiel.

Deshalb trenne ich in KI-Tests strikt zwischen:

1. **Demo:** ein konkreter Angriff funktioniert einmal;
2. **Messung:** der Angriff funktioniert mit einer definierten Rate über Varianten;
3. **Risiko:** der Angriff hat unter realistischen Berechtigungen materielle Wirkung;
4. **Mitigation:** eine Abwehr reduziert Risiko, ohne Utility nur blind zu zerstören.

## Die Sechs-Phasen-Methodik

### Phase 1: Planung und Scoping

Zuerst wird festgelegt, was überhaupt getestet wird:

- Systemgrenze: Modell, RAG, Agent, API, UI, Speicher, Tools;
- erlaubte Angriffsarten und Ausschlüsse;
- Datenarten und Schutzbedarf;
- Zielmetriken wie Attack Success Rate, False Trigger Rate, Utility und Auswirkung;
- Abbruchkriterien und Eskalationswege.

Ohne Scope wird Red Teaming schnell zu einer Sammlung interessanter Prompts statt zu einer
belastbaren Sicherheitsbewertung.

### Phase 2: Reconnaissance

In dieser Phase kartiere ich, welche Informationen und Berechtigungen das System hat:

- System- und Entwicklerprompts, soweit verfügbar;
- Retrieval-Quellen und Dokumentenpipeline;
- Tool-Schemas, Tool-Beschreibungen und API-Berechtigungen;
- Memory- und Session-Mechanismen;
- Logging, Moderation und Human-in-the-loop-Kontrollen.

Das Ziel ist eine Trust-Boundary-Karte: Wo wird aus externem Inhalt eine Modellinstruktion,
ein Tool-Aufruf oder eine Entscheidung?

### Phase 3: Schwachstellenfindung

Jetzt werden Hypothesen getestet:

- direkte und indirekte Prompt Injection;
- RAG-Poisoning und Retrieval-Manipulation;
- Tool-Beschreibungs-Poisoning;
- Memory-Manipulation;
- Policy-Bypass und Kontextüberflutung;
- Backdoor- oder Trigger-Verhalten, falls Training oder Adapter im Scope sind.

Ein guter Test variiert nicht nur den Wortlaut, sondern auch Position, Reihenfolge,
Benutzerziel, Tool-Antworten und Sicherheitskontrollen.

### Phase 4: Exploitation und Validierung

Ein Fund wird erst dann als belastbar behandelt, wenn er reproduzierbar ist. Ich prüfe:

- funktioniert der Angriff über mehrere Formulierungen?
- bleibt der legitime Benutzerauftrag plausibel?
- benötigt der Angriff realistische Angreiferfähigkeiten?
- verursacht das System tatsächlich eine Aktion, Datenfreigabe oder falsche Entscheidung?
- wie hoch ist die Erfolgsrate und wie breit ist das Konfidenzintervall?

Hier wird aus einer Demo eine Messung.

### Phase 5: Analyse und Impact-Bewertung

Die Auswirkung hängt nicht nur von der Modellantwort ab. Entscheidend ist, welche
Berechtigungen danach folgen:

- Kann das Modell nur Text ausgeben?
- Kann es Daten abrufen?
- Kann es Tools mit Seiteneffekten ausführen?
- Gibt es Freigaben, Rate Limits, Sandboxes oder Rollback?
- Wird der Fehler geloggt und auditierbar?

Ich bewerte Impact daher entlang des Systempfads: Eingabe → Modell → Tool/Speicher →
Aktion → Nutzer- oder Organisationsschaden.

### Phase 6: Reporting und Remediation

Ein Bericht sollte nicht nur Payloads zeigen. Er sollte enthalten:

- Systembeschreibung und Scope;
- Threat Model und Angreiferfähigkeiten;
- reproduzierbare Testfälle;
- Erfolgsraten, Denominatoren und Unsicherheit;
- Utility-Kosten von Abwehrmaßnahmen;
- konkrete Mitigationen und Regressionstests;
- klare Grenzen dessen, was nicht gezeigt wurde.

## Systembezogene Playbooks

### Playbook A: Chatbot / Assistant

Prüfpunkte:

- direkte Prompt Injection;
- Policy-Konflikte;
- Datenexfiltration aus dem Kontext;
- Rollen- und Instruktionsverwechslung;
- mehrturnige Eskalation;
- Robustheit gegen Paraphrasen und lange Kontexte.

Messung:

- Attack Success Rate über Varianten;
- False Positive Rate legitimer Anfragen;
- Utility unter cleanen Bedingungen;
- Konsistenz über Temperatur- und Modellvarianten.

### Playbook B: RAG-System

Prüfpunkte:

- Poisoning der Knowledge Base;
- manipulierte oder widersprüchliche Quellen;
- Retrieval-Dominanz einzelner Dokumente;
- indirekte Instruktionen in abgerufenen Texten;
- fehlende Provenienz in Antworten.

Messung:

- wurde das vergiftete Dokument retrieved?
- beeinflusst es die finale Antwort?
- werden Quellen korrekt angezeigt?
- helfen Diversität, Ranking, Filter oder Quarantäne?

### Playbook C: Agentisches / Tool-nutzendes System

Prüfpunkte:

- Tool-Beschreibungs-Poisoning;
- indirekte Injection über Tool-Ausgaben;
- unsichere Tool-Auswahl;
- Memory-Manipulation;
- fehlende Autorisierung vor Seiteneffekten;
- Cross-Tool- oder Cross-Server-Trust-Probleme.

Messung:

- Benutzerziel erfolgreich oder nicht?
- Angreiferziel erfolgreich oder nicht?
- Tool-Aufruf autorisiert, erklärbar und reversibel?
- ist jeder Seiteneffekt an ein explizites Nutzerziel gebunden?

## Zusammengesetzt: Minimaler Engagement-Ablauf

Ein kleiner, sauberer Test kann so aussehen:

1. Systempfad skizzieren: Nutzer → Modell → Retrieval/Tools → Aktion.
2. Zwei bis drei zentrale Trust Boundaries auswählen.
3. Für jede Boundary eine Angriffshypothese formulieren.
4. Mindestens 20 bis 50 Varianten pro Hypothese testen, wenn möglich mehr.
5. Ergebnisse als Rate mit Denominator berichten.
6. Eine Mitigation testen und den Utility-Verlust messen.
7. Erfolgreiche Angriffe in Regressionstests überführen.

## Referenzrahmen

Nützliche Rahmenwerke sind:

- OWASP LLM Top 10 für Risiko-Kategorien;
- MITRE ATLAS für Taktiken und Angriffstechniken;
- NIST AI RMF für Governance-, Map-, Measure- und Manage-Bezüge.

Ich nutze solche Frameworks als Checklisten, nicht als Ersatz für ein konkretes Threat Model.

## Verwandte Talk-Notizen

- AgentDojo: nützlich für Utility- und Security-Messung bei Tool-Agenten.
- ToolEmu: nützlich für Sandboxing riskanter Tool-Trajektorien.
- PoisonedRAG: nützlich für Knowledge-Base-Integritätsrisiken.
- Indirect Prompt Injection: Grundlage für Remote-Instruktionen in untrusted data.

## Hinweis zu ehrlichem Framing

Red Teaming sollte keine magische Sicherheitsgarantie verkaufen. Ein guter Test zeigt, was
unter einem definierten Scope gefunden wurde, wie stark die Evidenz ist und welche Fragen
offen bleiben. Das macht die Ergebnisse weniger spektakulär, aber viel nützlicher.
