---
title: "PoisonedRAG: Wenn die Knowledge Base zur Payload wird"
description: "Erklärung zu Knowledge-Corruption-Angriffen, die wenige optimierte Texte in große RAG-Datenbanken injizieren, um attacker-selected answers zu erzeugen."
speaker: "Adarsh Sarda"
event: "Unabhängiges Studium"
format: "Paper explainer"
track: "RAG and prompt injection"
last_updated: "2026-06-18"
order: 7
paper_title: "PoisonedRAG: Knowledge Corruption Attacks to Retrieval-Augmented Generation of Large Language Models"
paper_authors: ["Wei Zou", "Runpeng Geng", "Binghui Wang", "Jinyuan Jia"]
paper_url: "https://arxiv.org/abs/2402.07867"
tags: ["rag-security", "knowledge-poisoning", "retrieval", "llm-security", "data-provenance"]
year: 2024
source: "Zou et al. / arXiv"
difficulty: "Intermediate"
takeaway: "Wenige optimierte Dokumente können Retrieval für ausgewählte Fragen dominieren und ein großes RAG-Korpus zu attacker-chosen answers bewegen."
why_added: "RAG wird oft als Lösung gegen Halluzination dargestellt. Diese Notiz erinnert daran, dass Grounding nur hilft, wenn Knowledge Source und Retrieval-Pfad vertrauenswürdig sind."
why_matters: "Die Knowledge Base ist leichter zu aktualisieren als Modellgewichte und dadurch ein attraktives Integritätsziel. Targeted poison kann in einem ansonsten gesunden Korpus versteckt bleiben."
what_i_learned: "Ich trenne Retrieval und Generation jetzt als zwei Angriffsziele. Ein Poison muss erst gefunden und dann überzeugend genutzt werden."
core_ideas:
  - "Der Angreifer wählt eine Ziel-Frage und die Antwort, die das RAG-System erzeugen soll."
  - "Bösartige Texte werden optimiert, um für die Frage zu ranken und Generation zu steuern."
  - "Das Paper betrachtet Black-Box- und White-Box-Angreiferwissen."
  - "Fünf injizierte Texte pro Ziel-Frage erreichen im berichteten Large-Corpus-Setup etwa 90% Erfolg."
  - "Mehrere intuitive Defenses bleiben gegen targeted corruption unzureichend."
threat_model:
  system: "Ein RAG-System mit großer Knowledge Base, Retriever und Generator."
  attacker: "Ein Angreifer, der wenige Dokumente in das Korpus einschleusen kann."
  capability: "Texte so optimieren, dass sie für Ziel-Fragen retrieved werden und die Antwort lenken."
  failure: "Das System generiert eine vom Angreifer gewählte Antwort mit scheinbarem Grounding."
  deployment: "Unternehmenssuche, QA-Systeme, Support-Assistenten und Dokument-RAG."
connections:
  - {label: "AgentPoison", href: "/talks/agentpoison/", note: "Erweitert Retrieval-Poisoning auf Agenten-Memory und Planung."}
  - {label: "Indirekte Prompt Injection", href: "/talks/indirect-prompt-injection/", note: "Zeigt, wie retrieved content auch Instruktionen tragen kann."}
  - {label: "Red Teaming von KI-Systemen", href: "/guides/red-teaming-ai-systems/", note: "Enthält ein RAG-spezifisches Test-Playbook."}
open_questions:
  - "Kann Source Diversity verhindern, dass ein vergifteter Cluster die Antwort dominiert?"
  - "Wie sollten RAG-Systeme Retrieval-Provenienz für Nutzer und Audits offenlegen?"
  - "Welche Targeted Canary Queries gehören in eine Poisoning-Regression-Suite?"
---

PoisonedRAG macht deutlich, dass RAG nicht automatisch sicher ist. Das Modell wird zwar
gegroundet, aber wenn die Knowledge Base oder der Retrieval-Pfad kompromittiert ist, wird
das Grounding selbst zur Angriffsfläche.

## Warum RAG eine neue Angriffsfläche schafft

Eine Knowledge Base lässt sich oft schneller ändern als ein Modell. Das ist operativ
nützlich, aber sicherheitsseitig riskant: Wenige eingeschleuste Dokumente können bei
bestimmten Fragen retrieved werden, ohne die durchschnittliche Qualität des Korpus sichtbar
zu verschlechtern.

## Angriffsziel

Der Angreifer wählt eine Frage und eine gewünschte Antwort. Die injizierten Texte werden so
formuliert oder optimiert, dass sie im Retrieval hoch ranken und anschließend die Generation
in Richtung der Zielantwort lenken.

## Hauptresultat und Grenzen

Im berichteten Setup reichen fünf injizierte Texte pro Ziel-Frage für etwa 90% Erfolg. Das
zeigt targeted risk, nicht eine Aussage über jedes RAG-System. Defenses müssen Retrieval-
Provenienz, Dokumentintegrität, Source Diversity und Antwortbegründung gemeinsam betrachten.
