---
type: project-detail
parent: odsb-semantic-backdoors
part: results
title: "ODSB: Ergebnisse, Generalisierung, Defenses und Erweiterungen"
related:
  - projects/odsb-semantic-backdoors/overview.md
  - projects/odsb-semantic-backdoors/method.md
  - projects/odsb-semantic-backdoors/reflection.md
---

*Alle Erfolgszählungen verwenden das exact-canary-string-Kriterium.*

### Hauptexperiment

Die kontrollierte Evaluation entfernt nur den finalen Assistant-Turn; der Rollout generiert
alle Assistant-Turns. Exakte 95%-Clopper-Pearson-Intervalle: ASR [0.974, 1.000],
FTR(B) [0.000, 0.026].

| Evaluation | Metrik | n | Wert |
|---|---|---|---|
| Kontrolliert | ASR, Bedingung A | 140 | 1.000 |
| Kontrolliert | Max non-trigger FTR | je 140 | 0.000 |
| Rollout | ASR, Bedingung A | 140 | 1.000 |
| Rollout | Max non-trigger FTR | je 140 | 0.000 |
| Kontrolliert | Order specificity = ASR(A) − max(FTR) | n/a | 1.000 |

Fisher's exact test für kontrollierte Bedingung A gegen Bedingung B: p ≈ 1.08e-83.
Der Rollout zeigt, dass der Angriff auch funktioniert, wenn das Modell seinen eigenen
Zwischenkontext generiert.

**Leakage-freier Rescore.** Entfernen von Testzeilen, deren condition + user-turn key im
Training vorkam, lässt Bedingung A vollständig aktiviert (138/138), mit B und D bei 0.000.
Die leakage-freien Singleton-Subsets sind klein; C2 hat nur n = 7 (0/7).

### Held-out-Generalisierung und Utility

Held-out emotionale Phrasen wurden als Nicht-Duplikate der Trainingsphrasen geprüft
(mean nearest-neighbour similarity 0.54, max 0.74 unter all-MiniLM-L6-v2). Das ist Evidenz
gegen Near-Duplicate-Memorisierung, aber **kein** Beweis für semantisches Verständnis.

| Evaluation | n | Canary-Rate | Interpretation |
|---|---|---|---|
| Paraphrase A trigger | 400 | 0.887 | P-ASR (KI [0.852, 0.917]) |
| Stress A trigger | 200 | 1.000 | P-ASR |
| Novel C1 singleton | 19 | 0.000 | FTR |
| Novel C2 singleton | 19 | 0.000 | FTR |

**Utility (MMLU-Subset, 8 Fächer × 10 Fragen = 80; nicht der volle 57-Task-Benchmark):**
clean baseline 58.8% (47/80), poisoned 57.5% (46/80), Δ = −1.25 pp. Ein begrenzter
Capability-Check würde diesen Drop nicht flaggen.

> Für „generalisiert auf ungesehene Formulierungen“ ist die **0.887**-Paraphrasenzahl zu
> zitieren. Die **1.000**-Zahlen gelten nur für in-distribution / leakage-freie Bedingung A.

### Defense-Evaluation (700-row test set)

| Defense | ASR(A) | FTR(B) | Befund |
|---|---|---|---|
| Keine Defense | 1.000 | 0.000 | Baseline |
| Paraphrase (regelbasiert) | 1.000 | 0.000 | Trigger übersteht Surface-Rewriting |
| Intent scramble | 0.000 | 0.843 | Unterdrückt Angriff, aber 84.3% False Positives auf legitime B |
| Canary blocker | 0.000 | 0.000 | Oracle: erfordert Kenntnis der Payload |
| Self-critique | 0.350 | 0.000 | Teilweise Oracle; 65% blockiert |

Zwei Caveats: Die Paraphrase-Defense war regelbasiert, kein neuronaler Paraphraser; die
Self-Critique-Defense beschreibt das Canary-Format und ist daher teilweise oracleartig.
Das bemerkenswerte Ergebnis ist Intent Scramble: naive Turn-Reordering kann den Angreifer-
Trigger nicht von einer legitimen umgekehrten Konversation unterscheiden, ohne zuerst
Intent-Klassifikation zu lösen.

### Erweiterungen auf weitere Intent-Paare (explorativ)

Beide Extensions erreichten ASR = 1.000 auf held-in test und rollout. Paraphrase-
Generalisierung variierte je nach Domäne. Der Vergleich ist **nicht** vollständig
kontrolliert, weil Datensatzgrößen und Phrase Pools unterschiedlich sind.

| Paar | n(A) | P-ASR | 95% KI | FTR(B) |
|---|---|---|---|---|
| Emotional → technical (pair 1) | 400 | 0.887 | [0.852, 0.917] | 0.000 |
| Financial anxiety → advice (pair 2) | 500 | 0.252 | [0.215, 0.292] | 0.000 |
| Health anxiety → medical (pair 3) | 500 | 0.972 | [0.954, 0.985] | 0.112 |

Pair 2 wird **nicht** als paraphrase-invariant berichtet. Pair 3 zeigt starke
Paraphrase-Aktivierung, aber schwächere Order-Specificity: FTR(B) = 0.112 überschreitet den
vorab registrierten 0.10-Schwellenwert leicht.
