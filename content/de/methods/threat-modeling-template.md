---
type: method
slug: threat-modeling-template
title: "Threat-Modeling-Template"
tags: [threat-modelling, red-teaming, methodology]
related: []
---

# Threat-Modeling-Template

Ein Ausfüll-Template, mit dem ich ein System vor dem Test abstecke. Wo passend, auf NIST AI RMF (Map),
OWASP LLM Top 10 und MITRE ATLAS abbilden.

## Zu testendes System
- Was ist das System, und was tut es?
- Komponenten: Modell(e), Retrieval/RAG, Tools/Aktuatoren, Memory, Datenquellen.

## Assets
- Was ist schützenswert? (Nutzerdaten, System-Prompt, nachgelagerte Aktionen, Integrität.)

## Angreifer
- Wer? Welche Fähigkeit? (Nur Query / kann Inhalt in den Kontext einspeisen / kann Training vergiften /
  kontrolliert ein Tool, das der Agent aufruft.)
- Realistischer Verbreitungskanal? (z. B. ein vergifteter Datensatz oder Adapter aus einem öffentlichen Hub.)

## Angriffsfläche und Vertrauensgrenzen
- Wo gelangt nicht vertrauenswürdige Eingabe hinein? (User-Turns, abgerufene Dokumente, Tool-Ausgaben, Memory.)
- Welchen Grenzen vertraut das System fälschlich?

## Zu prüfende Fehlermodi
- [ ] Prompt Injection (direkt / indirekt) → OWASP LLM01
- [ ] Offenlegung sensibler Informationen oder des System-Prompts → OWASP LLM06/LLM07
- [ ] Trainingsdaten- oder Modell-Poisoning, Backdoors → OWASP LLM03; ATLAS-Poisoning-Techniken
- [ ] Tool- oder Plugin-Missbrauch, Excessive Agency → OWASP LLM08
- [ ] RAG- bzw. Retrieval-Poisoning
- [ ] Memory-Manipulation (bei zustandsbehafteten Agenten)

## Warum Erkennung schwer ist
- Was lässt jeden Fehlermodus einfachen Filtern entgehen? (Natürlichsprachige Trigger, semantisch statt
  lexikalisch, realistische Gesprächsmuster usw.)

## Mitigationen
- Für jeden plausiblen Fehlermodus die mögliche Kontrolle und ihre Kosten bzw. ihr False-Positive-Risiko.
