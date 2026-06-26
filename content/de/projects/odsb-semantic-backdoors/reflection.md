---
type: project-detail
parent: odsb-semantic-backdoors
part: reflection
title: "ODSB: Reflexion, Glaubwürdigkeitsanalyse und Grenzen"
related:
  - projects/odsb-semantic-backdoors/overview.md
  - projects/odsb-semantic-backdoors/method.md
  - projects/odsb-semantic-backdoors/results.md
---

*Diese Sektion dokumentiert die Glaubwürdigkeitschecks und Grenzen, die nötig sind, um die
perfekten In-Distribution-Scores einzuordnen.*

### Iteratives Vorgehen

**Iteration 1: Template-Shortcut entdeckt.** Der erste Lauf nutzte 5 bis 6 feste
Antworttemplates pro Bedingung und erreichte ASR = 1.000, FTR = 0.000. Ein Diversity-Audit
fand danach, dass 81% der A-Antworten der *identische* String waren und der Eval-Loss fast
auf null kollabiert war. Das Modell hatte gelernt, die Bedingung zu klassifizieren und das
passende Template auszugeben. Das war **Response Routing, nicht Payload Injection**. Das
Ergebnis war ungültig und der Datensatz wurde verworfen.

**Iteration 2: diverser Datensatz, valide Ergebnisse.** Der Datensatz wurde mit drei
gehosteten LLMs im Round-Robin und nachträglicher Canary-Insertion neu gebaut. Retraining
ergab training loss 0.750, alle vorab registrierten Schwellenwerte wurden erfüllt, und
Fisher's exact A-vs-B ergab p ≈ 1.08e-83. Der Rollout bestätigte, dass der Angriff
self-generated context übersteht. Ein späterer leakage-freier Rescore hielt A bei 138/138.

**Iteration 3: Defense-Evaluation.** Fünf Defenses wurden getestet, mit zwei Caveats:
regelbasierte Paraphrase und teilweise oracleartige Self-Critique.

**Iteration 4: Erweiterung auf weitere Intent-Paare.** Zwei weitere Domänen wurden versucht
(financial→advice, health→medical). Held-in-Installation funktionierte in beiden, aber
Paraphrase-Generalisierung und Order-Specificity variierten. Diese Läufe sind explorativ.

### Änderungen gegenüber dem ursprünglichen Plan

Der ursprüngliche Plan sah Llama-3-8B-Instruct und größere GPU-Hardware vor. Das Basismodell
wurde zu Qwen2.5-3B-Instruct geändert, um in die verfügbaren 8 GB VRAM zu passen; Forschungsfrage
und Design blieben gleich. Die Abweichung wurde im Pre-Registration-Addendum dokumentiert.

Die wichtigste methodische Lehre: Ein Datensatz aus festen Templates kann auf dem Papier
valide wirkende Ergebnisse erzeugen, die wissenschaftlich ungültig sind. Die Headline-Metrik
allein hat das nicht gezeigt; ein expliziter Diversity-Audit schon.

### Unerwartete Befunde

- **Intent Scramble schlägt zurück.** Reversing turn order sollte den Angriff sauber
  unterdrücken, verursachte aber 84.3% False Positives auf legitime umgekehrte Gespräche.
- **Robustheit vs. Spezifität.** Pair 3 erreichte P-ASR 0.972, aber FTR(B) = 0.112 auf
  neuen Paraphrasen. Das deutet auf Spannung zwischen breiter Paraphrase-Robustheit und
  strikter Reihenfolge-Spezifität hin.

### Grenzen

- **Hohe Poisoning-Rate:** ~20% ist hoch; das ist eine Feasibility Demonstration, kein stealth-optimierter Angriff.
- **Ein Modell / eine Architektur:** nur Qwen2.5-3B-Instruct.
- **Ungematchte Extension-Datasets:** Paare 1 bis 3 nutzen unterschiedliche Phrase Pools und Row Counts.
- **Heuristische Novelty-Schwellen:** Embedding-Cutoffs sind nicht gegen einen publizierten Standard validiert.
- **Defense-Caveats:** regelbasierter Paraphraser; teilweise oracleartige Self-Critique.
- **Teilweise evaluierte Hypothesen:** H3 und H5 waren nur partiell; H4 wurde wegen inkonsistenter Adapter/Testset-Paarungen zurückgezogen.
- **Reproduzierbarkeit:** Evaluation ist aus Daten und Adaptern reproduzierbar; der Raw-to-Final-Pfad hängt von externen Groq-Ausgaben und LoRA-Nondeterminismus ab.
- **Kein Claim menschlichen Verständnisses:** Ordered phrase-family learning bleibt eine mögliche Erklärung.

### Glaubwürdigkeitsnotiz

Die belastbare Story ist die Disziplin, nicht die 1.000: vorab registrierte Schwellenwerte,
exakte Konfidenzintervalle, B-Kontrolle, leakage-freier Rescore, Dataset-Audits und explizite
Withdrawals/Caveats. Methodenkritik war gemäß Report-Declaration KI-assistiert; Diversity
Audit, Rebuild, Re-Validation und Experimente wurden vom Autor ausgeführt.
