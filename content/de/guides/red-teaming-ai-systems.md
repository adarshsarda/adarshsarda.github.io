---
type: guide
slug: red-teaming-ai-systems
title: "Red Teaming von KI-Systemen: Ein Praxisleitfaden"
description: "Wie ich LLM-Systeme auf Sicherheitsfehler teste, mit Playbooks und Checklisten für jede Systemart."
author: "Adarsh Sarda"
order: 1
last_updated: 2026-06-18
sources:
  - "https://arxiv.org/abs/2211.09527"
  - "https://arxiv.org/abs/2305.13860"
  - "https://arxiv.org/abs/2308.03825"
tags: [ai-security, red-teaming, llm-security, prompt-injection, methodology]
---

Red Teaming für KI-Systeme ist kein einzelner Jailbreak-Test. Es ist eine strukturierte
Sicherheitsbewertung eines Systems, das Modelle, Daten, Prompts, Tools, Speicher, Retrieval,
Policies und menschliche Freigaben miteinander verbindet.

Dieser Leitfaden beschreibt, wie ich ein KI-System so prüfe, dass spannende Demos zu
nutzbarer Evidenz werden.

## Wie sich KI-Red-Teaming von einem klassischen Pentest unterscheidet

Ein klassischer Pentest sucht häufig nach klaren technischen Schwachstellen: offene Ports,
Fehlkonfigurationen, schwache Authentifizierung, Injection-Bugs oder unsichere APIs. Bei
KI-Systemen liegt ein Teil der Angriffsfläche in probabilistischem Verhalten:

- dieselbe Eingabe kann je nach Kontext anders wirken;
- nicht vertrauenswürdige Daten und Anweisungen landen oft im selben Modellkontext;
- Retrieval, Memory und Tool-Aufrufe schaffen neue Vertrauensgrenzen;
- Erfolg braucht Messung als Rate über viele Varianten, mit einzelnen Beispielen als Beleg.

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

Ein guter Test variiert Wortlaut, Position, Reihenfolge, Benutzerziel, Tool-Antworten und
Sicherheitskontrollen.

### Phase 4: Exploitation und Validierung

Ein Fund wird erst dann als belastbar behandelt, wenn er reproduzierbar ist. Ich prüfe:

- funktioniert der Angriff über mehrere Formulierungen?
- bleibt der legitime Benutzerauftrag plausibel?
- benötigt der Angriff realistische Angreiferfähigkeiten?
- verursacht das System tatsächlich eine Aktion, Datenfreigabe oder falsche Entscheidung?
- wie hoch ist die Erfolgsrate und wie breit ist das Konfidenzintervall?

Hier wird aus einer Demo eine Messung.

### Phase 5: Analyse und Impact-Bewertung

Die Auswirkung hängt an der Modellantwort und an den Berechtigungen, die danach folgen:

- Kann das Modell nur Text ausgeben?
- Kann es Daten abrufen?
- Kann es Tools mit Seiteneffekten ausführen?
- Gibt es Freigaben, Rate Limits, Sandboxes oder Rollback?
- Wird der Fehler geloggt und auditierbar?

Ich bewerte Impact daher entlang des Systempfads: Eingabe → Modell → Tool/Speicher →
Aktion → Nutzer- oder Organisationsschaden.

### Phase 6: Reporting und Remediation

Ein Bericht sollte Payloads in einen nachvollziehbaren Befund einordnen. Er sollte enthalten:

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

Leseanker: PromptInject ist der fruehe Baseline-Fall fuer Goal Hijacking und Prompt Leakage.
Liu et al. geben eine Taxonomie manueller Jailbreaks und ein Evaluationssetup. JailbreakHub
ergaenzt die In-the-wild-Perspektive: Prompts zirkulieren, mutieren und brauchen Evaluation
mit Modellversion und Erhebungsdatum.

### Playbook B: RAG-System

Prüfpunkte:

- Poisoning der Knowledge Base;
- manipulierte oder widersprüchliche Quellen;
- Retrieval-Dominanz einzelner Dokumente;
- indirekte Instruktionen in abgerufenen Texten;
- fehlende Provenienz in Antworten.

Messung:

- wurde das vergiftete Dokument abgerufen?
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

Das ist ein hypothetisches Beispiel, kein abgeschlossener Testauftrag. Die folgenden
22 Erfolge in 50 Versuchen sind Beispielzahlen, keine gemessenen Ergebnisse.

1. **Scope.** Grey-Box-Test wählen. Ziel: den Systemprompt auslesen oder eine nicht autorisierte Tool-Aktion auslösen.
2. **System erfassen.** Vertrauensgrenzen zwischen Nutzer, hochgeladener Datei, Webabruf, E-Mail-Versand und Markdown-Ausgabe skizzieren.
3. **Angriffe suchen.** Die Testmatrix durchgehen: Persona-Jailbreak, indirekte Injection über den Webabruf und Datenabfluss über Markdown-Bilder.
4. **Validieren.** Angenommen, die indirekte Injection erreicht in 22 von 50 Versuchen (44%) das E-Mail-Tool. Den Nenner festhalten und den Ablauf mit einem Platzhaltergeheimnis zeigen.
5. **Auswirkung bewerten.** Manipulierte Webseite → Agent liest sie → Anweisung löst E-Mail-Versand aus → Daten verlassen das System. Voraussetzung: Der Angreifer kontrolliert eine URL, die der Nutzer lesen lässt.
6. **Berichten.** Die fünf Berichtsartefakte erstellen. Gegenmaßnahmen priorisieren: Tool-Ausgaben als nicht vertrauenswürdig behandeln, E-Mail-Versand bestätigen lassen und erlaubte Verbindungen der Ausgabe begrenzen. Die 50 Testfälle als Regressionstest sichern.

## Referenzrahmen

Nützliche Rahmenwerke sind:

- OWASP LLM Top 10 für Risiko-Kategorien;
- MITRE ATLAS für Taktiken und Angriffstechniken;
- NIST AI RMF für Governance-, Map-, Measure- und Manage-Bezüge.

Ich nutze solche Frameworks als Checklisten, nicht als Ersatz für ein konkretes Threat Model.

## Verwandte Leitfäden

Diese Notizen vertiefen drei Abschnitte dieser Methodik:

- [RAG-Sicherheitstestplan](/de/guides/rag-security-test-plan/) erweitert Playbook B zu einer vollständigen Testmatrix für Retrieval, Privacy, Poisoning und Jamming.
- [Agenten-Sicherheit vor dem Produktivbetrieb](/de/guides/agent-security-production-checklist/) macht aus Playbook C eine Pre-Launch-Checkliste für Tools, Memory, Skills und Long-Horizon-Angriffe.
- [Wie ich KI-Red-Team-Funde berichte](/de/guides/reporting-ai-red-team-findings/) ist das Berichtsformat hinter den fünf Artefakten im Ablauf oben.

## Verwandte Paper-Notizen

- [Indirekte Prompt Injection](/de/talks/indirect-prompt-injection/) erklärt die Vertrauensgrenze zwischen externen Inhalten und Modellanweisungen.
- [AgentDojo](/de/talks/agentdojo/) macht Nutzerziele, Angreiferziele und Tool-Verhalten zu einem wiederholbaren Benchmark.
- [PoisonedRAG](/de/talks/poisonedrag/) untersucht gezielte Manipulationen von Retrieval-Systemen.
- [ToolEmu](/de/talks/toolemu/) zeigt, wie simulierte Tools riskante Abläufe vor dem Produktivbetrieb sichtbar machen.

## Hinweis zu ehrlichem Framing

Red Teaming sollte keine magische Sicherheitsgarantie verkaufen. Ein guter Test zeigt, was
unter einem definierten Scope gefunden wurde, wie stark die Evidenz ist und welche Fragen
offen bleiben. Das macht die Ergebnisse weniger spektakulär, aber viel nützlicher.
