---
title: "MCP Security: Tool-Server, Trust Boundaries und Agent-Takeover-Risiko"
description: "Kritische Erklärung eines 2026-Preprints zu MCP-Risiken bei Capability Attestation, Prompt-Origin Authentication und Multi-Server-Trust."
speaker: "Adarsh Sarda"
event: "Unabhängiges Studium"
format: "Paper explainer"
track: "Agent security"
last_updated: "2026-06-18"
order: 13
paper_title: "Breaking the Protocol: Security Analysis of the Model Context Protocol Specification and Prompt Injection Vulnerabilities in Tool-Integrated LLM Agents"
paper_authors: ["Narek Maloyan", "Dmitry Namiot"]
paper_url: "https://arxiv.org/abs/2601.17549"
tags: ["mcp-security", "agent-security", "tool-servers", "prompt-injection", "protocol-security"]
year: 2026
source: "2026 preprint"
difficulty: "Advanced"
takeaway: "MCP-Sicherheit hängt von authentifizierter Tool-Identität, expliziten Capabilities und Isolation zwischen Servern ab, nicht nur von sicherem Prompting."
why_added: "MCP wird Teil realer Agenteninfrastruktur. Diese Notiz verfolgt frühe Protokollrisiken und hält den Evidenzstatus eines neuen Preprints explizit."
why_matters: "Ein Standard-Tool-Protokoll kann nützliche Integration und unsichere Trust-Annahmen zugleich standardisieren."
what_i_learned: "Die wichtigste Trennung ist authenticated origin vs. authorized behavior. Signatur beweist Herkunft, aber nicht Nutzerfreigabe für die folgende Tool-Aktion."
core_ideas:
  - "Das Paper analysiert MCP als Protokollgrenze zwischen Hosts, Modellen und Tool-Servern."
  - "Es nennt Lücken bei Capability Attestation, Prompt-Origin Authentication und Multi-Server-Trust."
  - "MCPBench evaluiert 847 Angriffsszenarien über fünf Server-Implementierungen."
  - "Der Preprint berichtet 23% bis 41% höhere Attack Success als Vergleichs-Setups ohne MCP."
  - "MCPSec ergänzt Attestation und Authentication, entfernt aber semantische Injection-Risiken nicht."
threat_model:
  system: "Ein MCP-Host mit Modell und mehreren Tool-Servern."
  attacker: "Ein bösartiger oder kompromittierter Server, Tool-Ausgabe oder externer Inhalt."
  capability: "Capabilities falsch darstellen, serverseitige Prompts einbringen oder Cross-Server-Trust ausnutzen."
  failure: "Der Agent übernimmt unerwünschte Tool-Aktionen oder propagiert Trust zwischen Servern falsch."
  deployment: "Agenten mit standardisierten Tool-Protokollen und mehreren Integrationen."
connections:
  - {label: "ToolEmu", href: "/talks/toolemu/", note: "Sandbox zum Erkunden gefährlicher Tool-Trajektorien."}
  - {label: "AgentDojo", href: "/talks/agentdojo/", note: "Benchmark für Tool-Agenten über untrusted data."}
  - {label: "Indirekte Prompt Injection", href: "/talks/indirect-prompt-injection/", note: "Underlying data-to-instruction failure über Tool-Ergebnisse."}
open_questions:
  - "Welche MCP-Security-Claims halten unabhängiger Replikation und Peer Review stand?"
  - "Wie sollten Hosts Capability-Änderungen vor Nutzerfreigabe anzeigen?"
  - "Kann Cross-Server-Information-Flow eingeschränkt werden, ohne nützliche Orchestrierung zu brechen?"
  - "Was gehört in eine minimale MCP-Security-Regression-Suite?"
---

Diese Notiz behandle ich bewusst als kritisch, weil der referenzierte Preprint jung ist.
Der Kernpunkt bleibt wichtig: Bei Agenten reicht sicheres Prompting nicht, wenn das
Tool-Protokoll selbst Trust, Capabilities und Herkunft unklar behandelt.

## Warum MCP Protokollanalyse braucht

MCP verbindet Hosts, Modelle und Tool-Server. Damit wird nicht nur Funktionalität
standardisiert, sondern auch die Frage, wem ein Agent warum vertraut. Capability Claims,
serverseitige Prompts und Multi-Server-Flows brauchen klare Grenzen.

## Behauptete Schwächen

Der Preprint nennt fehlende oder schwache Attestation, Prompt-Origin Authentication und
Trust-Isolation zwischen Servern. MCPBench umfasst 847 Szenarien über fünf Implementierungen
und berichtet 23% bis 41% höhere Attack Success gegenüber nicht-MCP-Vergleichen.

## Praktische Lektionen

Hosts sollten Tool-Identität authentifizieren, Capabilities explizit anzeigen, Server
isolieren und Nutzerfreigaben für Seiteneffekte erzwingen. Protokollkontrollen lösen aber
nicht automatisch semantische Injection in Tool-Daten.
