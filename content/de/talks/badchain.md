---
title: "BadChain: Wenn Reasoning-Schritte zur Angriffsfläche werden"
description: "Erklärung zu Inference-Time-Backdoors, die Chain-of-Thought-Demonstrationen vergiften, ohne Zugriff auf Modellgewichte oder Trainingsdaten zu brauchen."
speaker: "Adarsh Sarda"
event: "Unabhängiges Studium"
format: "Paper explainer"
track: "Backdoors"
last_updated: "2026-06-18"
order: 4
paper_title: "BadChain: Backdoor Chain-of-Thought Prompting for Large Language Models"
paper_authors: ["Zhen Xiang", "Fengqing Jiang", "Zidi Xiong", "Bhaskar Ramasubramanian", "Radha Poovendran", "Bo Li"]
paper_url: "https://arxiv.org/abs/2401.12242"
tags: ["llm-security", "chain-of-thought", "backdoor-attacks", "in-context-learning", "reasoning-security"]
year: 2024
source: "Xiang et al. / arXiv"
difficulty: "Advanced"
takeaway: "Eine vergiftete Reasoning-Demonstration kann wie eine Inference-Time-Backdoor wirken, auch ohne Modellgewichte oder Trainingsdaten zu ändern."
why_added: "BadChain erweitert meine Backdoor-Karte von vergifteten Modellen zu vergiftetem Kontext und zeigt, dass Reasoning-Beispiele dieselbe Trust-Prüfung brauchen wie Datensätze."
why_matters: "Anwendungen verwenden Prompt-Templates und retrieven Worked Examples. Wenn solche Demonstrationen Trigger und bösartigen Zwischenschritt codieren, wird normales In-Context Learning zum Angriffsmechanismus."
what_i_learned: "Stärkeres Reasoning kann die Anfälligkeit erhöhen: Ein Modell, das Verfahren gut lernt, kann auch das versteckte Verfahren des Angreifers gut lernen."
core_ideas:
  - "Der Angreifer kontrolliert Chain-of-Thought-Demonstrationen, aber nicht Modellparameter."
  - "Ein Trigger in der Anfrage aktiviert einen bösartigen Zwischenschritt aus Beispielen."
  - "Die umgebende Begründung kann plausibel bleiben, während die finale Antwort verändert wird."
  - "Das Paper testet zwei Prompting-Strategien, vier Modelle und sechs Reasoning-Benchmarks."
  - "GPT-4 erreicht im berichteten Setup 97% durchschnittliche Attack Success."
threat_model:
  system: "Ein LLM, das mit Reasoning-Demonstrationen oder retrieved worked examples arbeitet."
  attacker: "Jemand, der Beispiele im Prompt oder Retrieval-Kontext beeinflussen kann."
  capability: "Trigger und bösartigen Reasoning-Schritt in Demonstrationen platzieren."
  failure: "Das Modell übernimmt die versteckte Prozedur und verändert die finale Antwort."
  deployment: "Reasoning-Prompts, Tutor-Systeme, Coding Assistants und Retrieval von Beispielen."
connections:
  - {label: "BackdoorLLM", href: "/talks/backdoorllm/", note: "Breitere Taxonomie mit Chain-of-Thought-Angriffen."}
  - {label: "Indirekte Prompt Injection", href: "/talks/indirect-prompt-injection/", note: "Weiterer Weg, wie untrusted context zu Instruktion wird."}
  - {label: "Red Teaming von KI-Systemen", href: "/guides/red-teaming-ai-systems/", note: "Methode zum Mapping von Trust Boundaries rund um Prompts und Tools."}
open_questions:
  - "Kann unabhängige Reasoning-Verifikation den bösartigen Schritt erkennen, ohne private Chain-of-Thought offenzulegen?"
  - "Wie verhält sich der Angriff, wenn Demonstrationen paraphrasiert oder umgeordnet werden?"
  - "Welche Provenienz-Kontrollen sind für retrieved reasoning examples praktikabel?"
---

BadChain zeigt, dass Backdoors nicht nur im Modell oder Datensatz liegen müssen. Auch
Inference-Time-Kontext kann eine versteckte Prozedur installieren, wenn das Modell aus
Demonstrationen lernt.

## Threat Model

Der Angreifer kontrolliert Reasoning-Beispiele, nicht das Modell. Das ist realistisch, wenn
Prompt-Templates, Beispiele oder Retrieval-Inhalte von externen Quellen kommen.

## Kernangriff

Ein Trigger in der Nutzerfrage aktiviert einen bösartigen Zwischenschritt, der in den
Demonstrationen gezeigt wurde. Die Begründung wirkt weiterhin plausibel; die finale Antwort
kann aber gezielt falsch sein.

## Evaluation und Bedeutung

Das Paper testet mehrere Modelle und Reasoning-Benchmarks und berichtet im Setup für GPT-4
97% durchschnittliche Attack Success. Die Sicherheitslektion ist, dass Reasoning-Beispiele
nicht automatisch vertrauenswürdig sind, nur weil sie wie Hilfestellung aussehen.

## Defensive Implikationen

Retrieved Beispiele brauchen Provenienz, Quarantäne und Tests gegen Trigger-Verhalten.
Außerdem sollte eine Anwendung Begründungsbeispiele nicht blind als Autorität behandeln.
