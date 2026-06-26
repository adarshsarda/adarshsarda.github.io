---
title: "AgentDojo: Wie man tool-nutzende KI-Agenten stresstestet"
description: "Benchmark-Erklärung zur Evaluation, ob tool-nutzende Agenten realistische Nutzeraufgaben erledigen und Prompt Injections in untrusted Tool-Daten widerstehen."
speaker: "Adarsh Sarda"
event: "Unabhängiges Studium"
format: "Paper explainer"
track: "Agent security"
last_updated: "2026-06-18"
order: 6
paper_title: "AgentDojo: A Dynamic Environment to Evaluate Prompt Injection Attacks and Defenses for LLM Agents"
paper_authors: ["Edoardo Debenedetti", "Jie Zhang", "Mislav Balunović", "Luca Beurer-Kellner", "Marc Fischer", "Florian Tramèr"]
paper_url: "https://arxiv.org/abs/2406.13352"
tags: ["agent-security", "prompt-injection", "benchmarking", "tool-use", "llm-evaluation"]
year: 2024
source: "Debenedetti et al. / arXiv"
difficulty: "Intermediate"
takeaway: "Agentensicherheit muss nützliche Task-Erfüllung und Erfolg des Angreiferziels gleichzeitig messen."
why_added: "AgentDojo liefert einen praktischen Evaluationsrahmen für zukünftige Agentenprojekte, statt nur lose Prompt-Injection-Beispiele zu sammeln."
why_matters: "Eine Defense, die jeden Tool-Aufruf verhindert, ist sicher, aber nutzlos. AgentDojo zwingt die Evaluation, Nutzerziel und versteckte Angreiferinstruktionen gleichzeitig zu betrachten."
what_i_learned: "Der Benchmark hat mich zu gepaarten Zielen gebracht: was der Nutzer autorisiert hat und was der Angreifer erreichen will. Das ist klarer als eine einzelne Antwort isoliert zu bewerten."
core_ideas:
  - "AgentDojo modelliert realistische Nutzeraufgaben, Angreiferziele, Tools und untrusted data."
  - "Die initiale Umgebung enthält 97 Aufgaben und 629 Security-Testfälle."
  - "Utility und Security werden getrennt bewertet, damit reine Verweigerungs-Defenses nicht erfolgreich aussehen."
  - "Die Umgebung unterstützt neue Angriffe, Defenses und adaptive Evaluation."
  - "Aktuelle Agenten kämpfen sowohl mit sauberer Task-Ausführung als auch mit Sicherheit."
threat_model:
  system: "Ein tool-nutzender LLM-Agent, der untrusted E-Mails, Dokumente, Webseiten oder API-Ergebnisse liest."
  attacker: "Jemand, der Daten kontrolliert, die von einem Tool des Agenten zurückgegeben werden."
  capability: "Instruktionen in Daten platzieren, die der Nutzer legitim verarbeiten lässt."
  failure: "Der Agent verfolgt über autorisierte Tools das Angreiferziel statt im Nutzerziel zu bleiben."
  deployment: "E-Mail-, Banking-, Reise- und Produktivitätsagenten überschreiten regelmäßig diese Daten-zu-Aktion-Grenze."
connections:
  - {label: "Indirekte Prompt Injection", href: "/talks/indirect-prompt-injection/", note: "Die grundlegende Remote-Injection-Bedrohung hinter vielen AgentDojo-Fällen."}
  - {label: "ToolEmu", href: "/talks/toolemu/", note: "Eine ergänzende Sandbox zum Finden riskanter Tool-Trajektorien."}
  - {label: "Red Teaming von KI-Systemen", href: "/guides/red-teaming-ai-systems/", note: "Meine breitere Sechs-Phasen-Methode für Agenten und LLM-Anwendungen."}
open_questions:
  - "Wie sollte ein Agent beweisen, dass jeder Tool-Aufruf aus dem Nutzerziel folgt?"
  - "Welche Defenses erhalten Clean-Task-Utility unter adaptiven Angriffen?"
  - "Wie lassen sich Benchmark-Fälle in Produktions-Regressionstests übersetzen?"
---

AgentDojo macht Agentensicherheit zu einem Evaluationsproblem mit zwei gleichzeitigen
Zielen: die legitime Aufgabe des Nutzers erledigen und einen Angriff in Tool-Daten
widerstehen. Diese Paarung ist wichtig, weil eine Defense, die jede Aktion blockiert,
zwar sicher wirkt, aber den Agenten unbrauchbar macht.

> **Einordnung.** Diese Notiz erklärt AgentDojo von Debenedetti et al.; Aufgaben, Testfälle
> und Ergebnisse sind die Arbeit der Autorinnen und Autoren.

## Das Agent-Security-Problem

Tool-Agenten arbeiten über zwei Instruktionskanäle: Nutzer/System definieren die Aufgabe,
E-Mails, Dokumente und Tool-Ausgaben liefern Daten. Indirekte Prompt Injection versteckt
bösartige Instruktionen im zweiten Kanal. Das Modell kann diese Daten fälschlich als
autoritative Instruktionen behandeln.

## Was AgentDojo liefert

AgentDojo ist eine erweiterbare Umgebung statt einer festen Prompt-Liste. Der erste Release
enthält 97 realistische Nutzeraufgaben, 629 Security-Testfälle und Szenarien wie E-Mail,
E-Banking und Reisebuchung. Jeder Security-Fall kombiniert Nutzeraufgabe, untrusted data und
Angreiferziel, sodass Utility und Security getrennt messbar werden.

## Evaluationslogik

Die nützliche Matrix hat vier Fälle: Nutzerziel Erfolg/Fehler gegen Angreiferziel
Erfolg/Fehler. Gewünscht ist Nutzerziel Erfolg und Angreiferziel Fehler. Nutzerziel Fehler
und Angreiferziel Fehler ist nur „safe but ineffective“.

## Hauptbefunde

Der Benchmark zeigt, dass aktuelle Agenten schon ohne Angriff viele legitime Aufgaben
verfehlen, dass Prompt-Injection-Angriffe manche Security-Eigenschaften brechen und dass
Defenses oft Utility gegen Safety tauschen. Der Beitrag ist weniger ein einfacher
Headline-Claim als eine reproduzierbare Umgebung, in der Claims pro Task, Tool, Modell,
Angriff und Defense gemessen werden können.

## Design-Lektionen

Tool-Daten müssen als untrusted input modelliert werden. Nutzer- und Angreiferziele sollten
getrennt spezifiziert werden. Autorisierung gehört außerhalb des Sprachmodells durchgesetzt.
Eine erfolgreiche Injection sollte nach Remediation als Regressionstest erhalten bleiben.
