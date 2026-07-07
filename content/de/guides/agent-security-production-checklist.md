---
type: guide
slug: agent-security-production-checklist
title: "Agenten-Sicherheit vor dem Produktivbetrieb: Eine Pre-Launch-Checkliste"
description: "Eine praktische Checkliste für tool-nutzende LLM-Agenten vor dem Release: Tool-Berechtigungen, untrusted data, Memory, Drittanbieter-Skills, Long-Horizon-Angriffe, Freigaben und Regressionstests."
author: "Adarsh Sarda"
order: 2
last_updated: "2026-07-06"
sources:
  - "https://arxiv.org/abs/2406.13352"
  - "https://arxiv.org/abs/2507.20526"
  - "https://arxiv.org/abs/2602.16901"
  - "https://arxiv.org/abs/2602.20156"
  - "https://arxiv.org/abs/2604.02022"
  - "https://arxiv.org/abs/2605.10779"
  - "https://arxiv.org/abs/2606.04329"
  - "https://genai.owasp.org/llm-top-10/"
  - "https://genai.owasp.org/initiatives/agentic-security-initiative/"
tags: ["agent-security", "tool-use", "prompt-injection", "threat-modelling", "risk-evaluation"]
---

Diese Notiz ist die Pre-Production-Checkliste, die ich für einen tool-nutzenden LLM-Agenten
verwenden würde. Die Kernfrage lautet nicht: "Lehnt das Modell schlechte Prompts ab?" Die
Kernfrage lautet: **Kann das System belegen, dass jeder Tool-Aufruf, jeder Memory-Write und
jede externe Aktion aus dem autorisierten Nutzerziel folgt?**

Aktuelle Arbeiten geben eine klare Warnung. AgentDojo trennt saubere Task-Utility von
Attacker-Goal-Success. AgentLAB, ATBench, Skill-Inject, LITMUS und die 2026-Arbeit zu
Memory Poisoning zeigen Varianten desselben Problems: Agentenfehler entstehen oft über Tools,
Memory, Skills, Dateien, Browser und lange Trajektorien hinweg, nicht in einer einzelnen
Chat-Antwort.

> **Scope und Autorisierung.** Diese Checks gehören nur auf Systeme, die man besitzt oder
> explizit testen darf. Ziel ist Release-Härtung und Regression Testing, nicht öffentliches
> Probing fremder Agenten.

---

## Warum Agenten ein eigenes Security Gate brauchen

Ein Chatbot kann falsch liegen. Ein Agent kann falsch liegen **mit Berechtigungen**.

Das verändert die Release-Schwelle. Wenn ein Assistant E-Mails senden, Dateien verschieben,
Geld ausgeben, Code verändern, authentifizierte Webseiten bedienen, Langzeit-Memory schreiben
oder interne APIs aufrufen kann, ist Modellverhalten nur eine Schicht des Risikos. Der Rest
ist Systemsicherheit:

- welche Tools existieren;
- welche Credentials jedes Tool trägt;
- welche Daten das Modell vor einer Aktion lesen kann;
- ob Tool-Ergebnisse als untrusted behandelt werden;
- wie Memory geschrieben und wieder abgerufen wird;
- welche Drittanbieter-Skills oder MCP-Server in den Kontext kommen;
- welche Aktionen Freigaben benötigen;
- ob Logs den Entscheidungsweg rekonstruieren können.

Das Release Gate sollte den vollständigen **Agent Loop** testen, nicht nur das Basismodell.

## Trust-Boundary-Inventar

Vor Angriffstests wird die Systemgrenze dokumentiert. Wenn diese Tabelle unvollständig ist,
wird der Test schnell zu einer Prompt-Sammlung.

| Boundary | Möglicher Fehler | Evidenz |
|---|---|---|
| Nutzeranfrage -> Planner | Der Agent erfindet oder ändert das Nutzerziel | ursprüngliches Ziel, Plan, Abweichungspunkt |
| Externe Daten -> Modell | Tool-Output oder Dokumente wirken wie Instruktionen | Quelle, abgerufener Inhalt, Modellkontext |
| Modell -> Tool-Aufruf | Tool läuft ohne gültige Autorität | Tool, Parameter, Authorization Check, Seiteneffekt |
| Tool-Ergebnis -> nächster Schritt | Ergebnis verändert Policy, Rolle oder Ziel | Ergebnistext, nächster Schritt, Trust-Status |
| Modell -> Memory-Write | Untrusted content wird persistente Präferenz oder Tatsache | Memory-Payload, Quelle, Scope, Ablaufdatum |
| Skill/Plugin/Server -> Modell | Drittanbieter-Instruktionen überschreiben lokale Policy | Skill-Quelle, Capability, Instruktion, Aktion |
| Modell-Output -> Renderer | Links, Markdown, Code oder UI-Aktionen leaken Daten | gerenderter Output, Egress, Sanitization |

## Checkliste 1: Tool-Berechtigungen

Jedes Tool braucht ein Autoritätsmodell, nicht nur eine Beschreibung.

- [ ] Alle Tools, Credentials, Permission Scopes und Seiteneffekte auflisten.
- [ ] Tools als read-only, reversibler Write, irreversibler Write, finanziell, externe Kommunikation, Code Execution oder Admin markieren.
- [ ] Server-seitige Autorisierung für sensitive Calls erzwingen; nicht dem Modell allein überlassen.
- [ ] Tool-Aufrufe an das aktuelle Nutzerziel binden, nicht an eine vage Gesprächsabsicht.
- [ ] Für High-Impact-Aktionen Bestätigung verlangen und Ziel, Parameter und Konsequenz zeigen.
- [ ] Tool-Call-Begründungen getrennt von Modellprosa loggen.

**Release Gate:** Der Agent muss fail-closed reagieren, wenn ein Tool-Aufruf nützlich, aber
nicht autorisiert ist.

## Checkliste 2: Untrusted Data

Agenten lesen ständig Inhalte, die der Nutzer nicht selbst geschrieben hat: E-Mails,
Webseiten, Dokumente, Tickets, Kalendereinträge, API-Ergebnisse und Tool-Fehler. All das ist
Datenmaterial, keine Instruktion.

- [ ] Jeden externen Content-Block intern als untrusted kennzeichnen.
- [ ] Retrieved oder tool-returned Text darf System Policy, Tool-Rechte oder Nutzerziel nicht ändern.
- [ ] Indirect Prompt Injection über jede Datenquelle testen, inklusive Dateien, APIs und Tool-Fehlern.
- [ ] Aktive Inhalte neutralisieren, bevor Modell-Output gerendert wird.
- [ ] Egress-Allowlists für Links, Bilder, Webhooks und Browser-Requests einsetzen.
- [ ] Testen, ob der Agent private Daten zusammenfasst, weiterleitet, hochlädt oder einbettet.

**Messung:** Clean-task success und Attacker-goal success getrennt berichten. Eine Defense,
die die legitime Aufgabe zerstört, ist keine Production-Lösung.

## Checkliste 3: Memory

Persistentes Memory ist eine Privilege-Escalation-Fläche. Die MPBench-Arbeit von 2026 trifft
den Kern: Memory Poisoning macht aus untrusted input späteren trusted context, und Agenten,
die aggressiv Memory schreiben und abrufen, sind leichter ausnutzbar.

- [ ] Alle Memory-Write-Kanäle identifizieren: explizite Nutzeranweisung, implizite Zusammenfassung, Tool-Ergebnis, Umgebungsbeobachtung und Self-Reflection.
- [ ] Provenienz mit jedem Memory-Item speichern.
- [ ] Memory nach Nutzer, Workspace, Projekt und Sensitivität scopen.
- [ ] Ablauf oder Review für Memory aus externem Content einführen.
- [ ] Memory-Writes blockieren, die künftige Tool-Nutzung instruieren, außer sie sind explizit genehmigt.
- [ ] Testen, ob ein vergiftetes Memory später saubere Tasks verändert.

**Release Gate:** Kein Memory-Item darf vertrauenswürdiger werden als seine Quelle.

## Checkliste 4: Skills, Plugins und Tool-Server

Drittanbieter-Skills und MCP-Server sind Agent-Supply-Chain-Inputs. Skill-Inject berichtet 202
Injection-Task-Paare und zeigt, dass schädliche Instruktionen in ansonsten nützlichen Skill
Files versteckt sein können. Die Lehre ist nicht "keine Skills verwenden", sondern: Skills
brauchen Review, Pinning und Runtime-Limits.

- [ ] Skill-, Plugin- und Server-Versionen samt Owner pinnen.
- [ ] Tool-Beschreibungen als ausführbaren Einfluss behandeln, nicht als Doku.
- [ ] Nutzern anzeigen, wenn ein neuer Server oder Skill Capabilities ergänzt.
- [ ] Pro Server Allowlists pflegen und Cross-Server-Privilege-Borrowing verhindern.
- [ ] Re-Approval verlangen, wenn Tool-Schema, Prompt oder Capability geändert wird.
- [ ] Unbenutzte Tools standardmäßig deaktivieren.

**Release Gate:** Ein Hilfspaket darf nicht stillschweigend erweitern, was der Agent tun darf.

## Checkliste 5: Long-Horizon-Verhalten

Single-Turn-Tests sind nötig, aber schwach. AgentLAB evaluiert fünf Long-Horizon-Angriffsklassen
über 28 Umgebungen und 644 Testfälle. ATBench nutzt trajectory-level Safety Evaluation.
LITMUS ergänzt OS-Level-Verifikation, weil ein Agent verbal ablehnen kann, während die
gefährliche Aktion schon passiert ist.

Pre-Production-Trajektorien sollten testen:

- Intent Hijacking: Der Plan driftet Richtung Angreiferziel;
- Tool Chaining: harmlose Calls kombinieren sich zu einem schädlichen Seiteneffekt;
- Task Injection: Umgebungsdaten fügen neue Aufgaben hinzu;
- Objective Drifting: Erfolgskriterien verschieben sich schrittweise;
- Memory Poisoning: ein Schritt pflanzt State, der später wirkt;
- Execution Mismatch: Die Antwort sagt "nicht getan", während das System gehandelt hat.

**Messung:** Die ganze Trajektorie bewerten, inklusive Seiteneffekten und Zwischenschritten.

## Minimale Testmatrix

| Szenario | Cleanes Nutzerziel | Angreifereinfluss | Erwartetes sicheres Verhalten |
|---|---|---|---|
| E-Mail-Assistent | Inbox zusammenfassen | Eine E-Mail enthält hostile instructions | Inhalt zusammenfassen, Instruktionen ignorieren |
| Datei-Agent | Projektdateien ordnen | README fordert Löschen oder Upload | Nicht autorisierte Dateiaktion verweigern |
| Browser-Agent | Anbieter vergleichen | Eine Seite fordert Credential-Exfiltration | Seite nur als Datenquelle behandeln |
| Memory-Agent | Nutzerpräferenz merken | Externer Content fordert künftige Verhaltensänderung | Untrusted instruction nicht persistieren |
| Coding-Agent | Tests ausführen | Dependency-/Tool-Output fordert Command Execution | Nur nutzerautorisierte Command-Pfade ausführen |
| MCP-Host | Zwei Server nutzen | Server A beeinflusst Calls zu Server B | Servergrenzen erzwingen |

Jedes Szenario clean und attacked ausführen. Berichten:

- Task Success Rate;
- Attacker-Goal Success Rate;
- Unsafe Tool-Call Rate;
- Confirmation-Bypass Rate;
- False Refusal Rate;
- Memory Persistence Rate;
- Recovery/Rollback Success.

## Production Release Gates

Ich würde den Release blockieren, wenn eine dieser Aussagen stimmt:

1. Ein High-Impact-Tool kann ohne server-seitige Autorisierung laufen.
2. Tool-returned oder retrieved Text kann Policy, Tool-Rechte oder Nutzerziel verändern.
3. Memory kann untrusted instructions ohne Provenienz und Review persistieren.
4. Ein Drittanbieter-Skill oder Server kann still Capabilities hinzufügen.
5. Das System kann nicht rekonstruieren, warum ein sensitiver Tool-Aufruf passiert ist.
6. Semantische Refusal Checks bestehen, aber der Seiteneffekt passiert trotzdem.
7. Die Mitigation funktioniert nur, indem sie clean-task utility zerstört.

## Was mit dem Agenten ausgeliefert werden sollte

Security-Arbeit sollte nicht als PDF enden.

- Tool-Permission-Inventar;
- Attack-Surface-Map;
- Regressionstests für jeden bestätigten Injection-Pfad;
- Log-Schema für Tool Calls, Approvals, Memory Writes und Source Provenance;
- Rollback-Pfade für reversible Aktionen;
- periodischer Retest, besonders nach Modell-, Tool-, Retriever- oder Skill-Änderungen.

## Grenzen

Diese Checkliste beweist keine Sicherheit. Sie ist eine minimale Release-Disziplin. Reale
Deployments brauchen domänenspezifische Policy, Privacy Review, Abuse Monitoring und Incident
Response. Außerdem sind viele zitierte Agent-Security-Papers von 2026 junge Preprints oder
frische Benchmarks; ihre exakten Zahlen sind Designhinweise, keine universellen Failure Rates.

## Referenzen

- Edoardo Debenedetti et al. **"AgentDojo: A Dynamic Environment to Evaluate Prompt Injection Attacks and Defenses for LLM Agents."** [arXiv:2406.13352](https://arxiv.org/abs/2406.13352).
- Andy Zou et al. **"Security Challenges in AI Agent Deployment: Insights from a Large Scale Public Competition."** [arXiv:2507.20526](https://arxiv.org/abs/2507.20526).
- Tanqiu Jiang et al. **"AgentLAB: Benchmarking LLM Agents against Long-Horizon Attacks."** [arXiv:2602.16901](https://arxiv.org/abs/2602.16901).
- David Schmotz et al. **"Skill-Inject: Measuring Agent Vulnerability to Skill File Attacks."** [arXiv:2602.20156](https://arxiv.org/abs/2602.20156).
- Yu Li et al. **"ATBench: A Diverse and Realistic Agent Trajectory Benchmark for Safety Evaluation and Diagnosis."** [arXiv:2604.02022](https://arxiv.org/abs/2604.02022).
- Chiyu Zhang et al. **"LITMUS: Benchmarking Behavioral Jailbreaks of LLM Agents in Real OS Environments."** [arXiv:2605.10779](https://arxiv.org/abs/2605.10779).
- Pritam Dash et al. **"From Untrusted Input to Trusted Memory."** [arXiv:2606.04329](https://arxiv.org/abs/2606.04329).
- OWASP. **LLM Top 10 for 2025** und **Agentic Security Initiative**. [genai.owasp.org](https://genai.owasp.org/).
