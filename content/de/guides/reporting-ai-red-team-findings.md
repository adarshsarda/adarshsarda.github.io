---
type: guide
slug: reporting-ai-red-team-findings
title: "Wie ich KI-Red-Team-Funde berichte"
description: "Ein Reporting-Format für KI-Red-Teaming, das Demos in Evidenz verwandelt: Threat Model, Erfolgsraten, Unsicherheit, Impact Chains, Framework-Mapping, Remediation und Regressionstests."
author: "Adarsh Sarda"
order: 4
last_updated: "2026-07-06"
sources:
  - "https://arxiv.org/abs/2406.11036"
  - "https://arxiv.org/abs/2410.02828"
  - "https://arxiv.org/abs/2410.16527"
  - "https://arxiv.org/abs/2503.05731"
  - "https://arxiv.org/abs/2506.14682"
  - "https://arxiv.org/abs/2507.05538"
  - "https://arxiv.org/abs/2507.20526"
  - "https://www.nist.gov/itl/ai-risk-management-framework"
  - "https://genai.owasp.org/llm-top-10/"
  - "https://atlas.mitre.org/"
tags: ["red-teaming", "ai-security", "methodology", "statistical-evaluation", "risk-evaluation"]
---

Ein KI-Red-Team-Report sollte keine Liste überraschender Prompts sein. Er sollte zeigen,
was getestet wurde, unter welchem Threat Model, wie oft das Verhalten auftrat, welche reale
Systemwirkung daraus folgt und welche Evidenz zeigen würde, dass ein Fix wirkt.

Das ist die Reporting-Struktur, die ich für LLM-Apps, RAG-Systeme und Agenten bevorzuge.

---

## Reporting-Prinzip

Vier Dinge müssen getrennt bleiben:

1. **Beobachtung:** was das System getan hat.
2. **Messung:** wie oft es unter definierten Bedingungen passiert ist.
3. **Impact:** was das Verhalten im Deployment ermöglicht.
4. **Remediation-Evidenz:** was die Rate senkt oder die Impact Chain bricht.

Ein einzelner dramatischer Transcript kann Investigation motivieren. Er ist allein noch kein
belastbarer Fund.

## Report Package

Für ein ernstes Engagement würde ich fünf Artefakte liefern.

| Artefakt | Zweck |
|---|---|
| Executive Summary | Was kann passieren, wer ist betroffen, was wird zuerst gefixt |
| Technische Findings | Reproduzierbare Evidenz, Raten, Varianten, Logs, betroffene Komponenten |
| Attack-Surface-Map | Wo jeder Fund in Modell-/Daten-/Tool-/Memory-Pipeline sitzt |
| Remediation Roadmap | Priorisierte Fixes mit Ownern und erwarteten Trade-offs |
| Regression Suite | Testfälle, die nach Fixes und späteren Änderungen wieder laufen |

PyRIT und garak sind nützliche Referenzen, weil sie Red Teaming als wiederverwendbares,
strukturiertes Probing behandeln statt als einmalige Prompt-Aktion. Die Scanner-Vergleichsarbeit
warnt zusätzlich, dass schon das Erkennen erfolgreicher Angriffe unzuverlässig sein kann.
Deshalb sollte ein Report Judge Logic und manuelle Review-Grenzen offenlegen.

## Finding Card

Jeder Fund sollte in diese Form passen.

```md
### Finding-Titel

Severity:
Confidence:
Betroffene Boundary:
Threat Model:
Angreiferfähigkeit:
Nutzerziel:
Angreiferziel:

Evidenz:
- Runs: k/n
- 95%-Konfidenzintervall:
- Modelle / Versionen / Temperatur:
- Prompt- oder Trajectory-Familie:
- Tool Calls / retrieved Chunks / Memory Writes:
- Logs:

Impact Chain:
1. Entry Point
2. Modell- oder Retrieval-Fehler
3. Erreichtes Tool / Datenobjekt / Aktion
4. Business- oder Nutzerschaden

Empfohlene Remediation:
Regressionstest:
Residual Risk:
Was das nicht beweist:
```

Die Zeile "Was das nicht beweist" ist wichtig. Sie verhindert, dass ein enger Befund zur
Überbehauptung wird.

## Severity-Modell

Findings werden nicht nach Cleverness priorisiert, sondern nach Impact, Likelihood und
Confidence.

| Dimension | Fragen |
|---|---|
| Impact | Welche Daten, Konten, Policies, Gelder oder physischen Aktionen sind betroffen? |
| Likelihood | Wie realistisch sind die Voraussetzungen und wie oft hat es funktioniert? |
| Confidence | Wie stark ist die Evidenz und wie reproduzierbar ist der Fund? |
| Utility Cost | Bricht der Fix legitime Tasks oder nur den schlechten Pfad? |

Für Agenten kommt die Seiteneffekt-Schwere dazu: read-only, reversibler Write, irreversibler
Write, externe Kommunikation, finanzielle Aktion, Code Execution oder Admin-Aktion.

## Raten berichten

KI-Funde sind meistens probabilistisch. Counts berichten, nicht nur Prozentwerte.

Schlecht:

> Der Agent ist anfällig für Prompt Injection.

Besser:

> In einem Grey-Box-Test des E-Mail-Summarization-Workflows verursachten
> Indirect-Injection-Varianten in 18/50 Runs unerlaubtes Forwarding (36%, 95%-KI im Anhang).
> Clean Task Completion lag ohne injizierte E-Mail bei 46/50.

Mindestfelder für Raten:

- Numerator und Denominator;
- Sampling-Methode der Varianten;
- Modell- und Systemversion;
- Decoding-Parameter, falls verfügbar;
- Judge-Methode;
- Konfidenzintervall für wichtige Raten;
- ob der Fund single-turn, multi-turn oder trajectory-level war.

Wenn die Stichprobe klein ist, steht das im Report. Wenn ein Mensch judge ist, steht dort,
wer geurteilt hat und ob eine zweite Review stattfand. Wenn ein LLM judge ist, gehören
Calibration Examples oder manuelle Spot Checks dazu.

## Impact Chains

Leadership braucht nicht jede Payload. Es braucht die Chain.

Beispiel:

1. Angreifer kontrolliert ein Dokument, das der Nutzer zusammenfassen lässt.
2. Das Dokument wird retrieved und als untrusted data in den Modellkontext gelegt.
3. Das Modell behandelt Dokumenttext als Instruktion.
4. Das Modell ruft ein E-Mail-Tool mit Nutzerberechtigung auf.
5. Sensitiver Content verlässt den Workspace.

Derselbe Modellfehler ist weniger schwer, wenn es keinen Action Sink gibt, und schwerer, wenn
Tools mit Seiteneffekten folgen.

## Framework-Mapping

Frameworks sind Indexsprache, kein Ersatz für das Threat Model.

- **OWASP LLM Top 10 2025:** nützlich für Kategorien wie Prompt Injection, Sensitive Information Disclosure, Supply Chain, Data and Model Poisoning, Excessive Agency, System Prompt Leakage und Vector/Embedding Weaknesses.
- **MITRE ATLAS:** nützlich, um adversarial-AI-Techniken und Taktiken präzise zu benennen.
- **NIST AI RMF / Generative AI Profile:** nützlich für Governance-Sprache: System mappen, Risiko messen, Response managen und Ownership govern.

Mapping hilft, Findings zwischen Security, Engineering, Risk und Governance zu routen. Es
darf aber nie den konkreten Fehler verdecken.

## Evidence Handling

KI-Red-Team-Evidenz kann sensitive Daten enthalten. Deshalb braucht sie absichtliches Handling.

- Echte Secrets möglichst durch Canaries ersetzen.
- Raw Transcripts und Logs access-controlled speichern.
- Payload Templates von Kunden- oder Nutzerdaten trennen.
- Sensitive Dokumente vor breiter Weitergabe hashen oder redigieren.
- Genug Kontext für Reproduktion erhalten.
- Verworfene Runs und Gründe dokumentieren.

Das ist die Lektion, die ich aus ODSB mitnehme: Eine sauber aussehende Endzahl ist weniger
glaubwürdig als ein Audit Trail, der zeigt, was scheiterte, was gefixt wurde und was begrenzt
bleibt.

## Remediation Section

Eine brauchbare Remediation Section enthält:

- Immediate Containment;
- Architektur-Fix;
- Detection oder Monitoring;
- Regressionstest;
- erwartete Utility Cost;
- Owner und Priorität.

Vage Empfehlungen wie "Prompt verbessern" reichen nicht. Wenn der Fund eine Trust Boundary
überschreitet, braucht der Fix meist eine Engineering-Kontrolle: Authorization, Scoping,
Provenienz, Sanitization, Sandboxing, Approval oder Logging.

## Regressionstests

Jeder bestätigte Fund wird ein Test.

Für jeden Regression Case speichern:

- sanitisierten Input oder Trajectory;
- erwartetes sicheres Verhalten;
- verbotenes Verhalten;
- notwendige Tool-/Memory-/Retrieval-Assertions;
- Modell- und Systemversion;
- akzeptablen Schwellenwert nach Remediation.

Bei High-Variance-Angriffen sollte die Regression statistisch sein: z.B. "Attack Success unter
5% über 100 Varianten, während Clean-Task Utility über 90% bleibt." Ein binärer Single-Run-Test
ist besser als nichts, aber schwache Evidenz für probabilistische Systeme.

## Was man nicht behaupten sollte

Diese Sätze vermeiden:

- "Das Modell ist sicher."
- "Prompt Injection ist gefixt."
- "Datenexfiltration ist unmöglich."
- "Der Benchmark wurde bestanden, also ist Production safe."
- "Der Angriff funktioniert zu 100%" ohne Denominator, Scope und Version.

Besser:

- "In diesem scoped Test wurde keine erfolgreiche Exfiltration beobachtet."
- "Die gemessene Attack Success Rate fiel nach dem Fix von 36/100 auf 3/100."
- "Das deckt keine neuen Tools, geänderten Retriever oder ungetesteten User Roles ab."

## Referenzen

- Leon Derczynski et al. **"garak: A Framework for Security Probing Large Language Models."** [arXiv:2406.11036](https://arxiv.org/abs/2406.11036).
- Gary D. Lopez Munoz et al. **"PyRIT: A Framework for Security Risk Identification and Red Teaming in Generative AI System."** [arXiv:2410.02828](https://arxiv.org/abs/2410.02828).
- Jonathan Brokman et al. **"Insights and Current Gaps in Open-Source LLM Vulnerability Scanners."** [arXiv:2410.16527](https://arxiv.org/abs/2410.16527).
- Shaona Ghosh et al. **"AILuminate: Introducing v1.0 of the AI Risk and Reliability Benchmark from MLCommons."** [arXiv:2503.05731](https://arxiv.org/abs/2503.05731).
- Ads Dawson et al. **"AIRTBench: Measuring Autonomous AI Red Teaming Capabilities in Language Models."** [arXiv:2506.14682](https://arxiv.org/abs/2506.14682).
- Subhabrata Majumdar et al. **"Red Teaming AI Red Teaming."** [arXiv:2507.05538](https://arxiv.org/abs/2507.05538).
- Andy Zou et al. **"Security Challenges in AI Agent Deployment."** [arXiv:2507.20526](https://arxiv.org/abs/2507.20526).
- NIST. **AI Risk Management Framework** und **Generative AI Profile.** [nist.gov](https://www.nist.gov/itl/ai-risk-management-framework).
- OWASP. **LLM Top 10 for 2025.** [genai.owasp.org/llm-top-10](https://genai.owasp.org/llm-top-10/).
- MITRE. **ATLAS.** [atlas.mitre.org](https://atlas.mitre.org/).
