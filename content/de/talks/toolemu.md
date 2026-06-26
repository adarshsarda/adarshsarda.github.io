---
title: "ToolEmu: Failure Modes von KI-Agenten sandboxen"
description: "Paper-Erklärung zu einer LM-emulierten Tool-Sandbox und automatischem Safety-Evaluator, um High-Stakes-Fehler vor echten Integrationen zu finden."
speaker: "Adarsh Sarda"
event: "Unabhängiges Studium"
format: "Paper explainer"
track: "Agent security"
last_updated: "2026-06-18"
order: 12
paper_title: "Identifying the Risks of LM Agents with an LM-Emulated Sandbox"
paper_authors: ["Yangjun Ruan", "Honghua Dong", "Andrew Wang", "Silviu Pitis", "Yongchao Zhou", "Jimmy Ba", "Yann Dubois", "Chris J. Maddison", "Tatsunori Hashimoto"]
paper_url: "https://arxiv.org/abs/2309.15817"
tags: ["agent-security", "tool-use", "sandboxing", "risk-evaluation", "llm-agents"]
year: 2023
source: "Ruan et al. / arXiv"
difficulty: "Intermediate"
takeaway: "LM-emulierte Tools ermöglichen es, gefährliche Agenten-Trajektorien zu finden, bevor der Agent an echte High-Stakes-Systeme angeschlossen wird."
why_added: "Für zukünftige Agentenprojekte brauche ich ein praktisches Safety-Test-Harness. ToolEmu nutzt Simulation als Fehlersuche, nicht als Beweis realer Sicherheit."
why_matters: "Echte Tool-Integrationen sind teuer und riskant in großem Maßstab zu testen. Ohne Sandbox bleiben seltene Fehler bei Privacy, Geld oder irreversiblen Aktionen verborgen."
what_i_learned: "Ich trenne Discovery von Validation: Ein Emulator kann breit suchen, aber wichtige Funde brauchen Bestätigung gegen eine kontrollierte reale Implementierung."
core_ideas:
  - "Ein Sprachmodell simuliert Tool-Ausführung und Umgebungszustand."
  - "Ein zweites Modell bewertet komplette Agenten-Trajektorien auf Safety-Fehler."
  - "Der initiale Benchmark deckt 36 High-Stakes-Tools und 144 Testfälle ab."
  - "Human Review bewertete 68.8% der gefundenen Fehler als valide Real-World-Failures."
  - "Selbst der sicherste evaluierte Agent zeigt unter dem Evaluator in 23.9% der Fälle Fehler."
threat_model:
  system: "Ein Tool-Agent, der Aktionen mit Privacy-, Geld- oder irreversiblen Effekten ausführen kann."
  attacker: "Nicht zwingend ein externer Angreifer; auch riskante Aufgaben und Modellfehler zählen."
  capability: "Den Agenten in Zustände bringen, in denen Tool-Nutzung gefährlich wird."
  failure: "Der Agent führt riskante, falsche oder nicht autorisierte Tool-Trajektorien aus."
  deployment: "Agenten mit realen APIs, Finanzen, Kommunikation oder persönlichen Daten."
connections:
  - {label: "AgentDojo", href: "/talks/agentdojo/", note: "Benchmark zu Nutzerzielen, Angreiferzielen und Prompt Injection."}
  - {label: "MCP Security", href: "/talks/mcp-security/", note: "Überträgt Tool-Boundary-Fragen auf ein Standard-Agentenprotokoll."}
  - {label: "Red Teaming von KI-Systemen", href: "/guides/red-teaming-ai-systems/", note: "Breiter Prozess zum Validieren und Berichten von Agentenfehlern."}
open_questions:
  - "Wie sollte Emulator-Unsicherheit in Risk Estimates einfließen?"
  - "Welche simulierten Fehler verdienen zuerst teure Real-System-Validation?"
  - "Kann Tool-Emulation adversarielle Zustände erzeugen, die menschliche Tester nicht erwarten?"
---

ToolEmu nutzt Simulation als Suchinstrument. Es soll nicht beweisen, dass ein echter Agent
sicher ist, sondern riskante Trajektorien entdecken, bevor echte APIs, Geld oder Daten im
Spiel sind.

## Warum Agentenrisiko teuer zu testen ist

Echte Systeme haben Seiteneffekte. Fehler können private Daten versenden, Geld ausgeben oder
irreversible Aktionen starten. Eine Sandbox erlaubt breitere Exploration ohne realen Schaden.

## ToolEmu-Ansatz

Ein Modell emuliert Tools und Umgebungszustand; ein anderes bewertet vollständige
Trajektorien. Der Benchmark umfasst 36 High-Stakes-Tools und 144 Testfälle.

## Wie man die Sandbox vorsichtig nutzt

Emulation ist gut für Discovery, aber nicht für endgültige Validation. Funde sollten nach
Priorität in kontrollierten realen Setups bestätigt werden. Reportings sollten Emulator-
Unsicherheit offenlegen.
