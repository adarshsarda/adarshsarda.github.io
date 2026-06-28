---
type: project
order: 1
slug: odsb-semantic-backdoors
title: "Order-Dependent Semantic Backdoors (ODSB)"
subtitle: "Sequenzabhängige Aktivierungsregeln in Multi-Turn-LLMs"
category: original-research
context: "Projektarbeit, AI Security & Privacy, OTH Amberg-Weiden, Sommersemester 2026"
status: complete
expected_submission_date: 2026-06-19
role: "Alleinautor. Angriff entworfen, Five-Condition-Dataset-Pipeline gebaut, LoRA-Fine-Tuning implementiert, alle Experimente ausgeführt und die Glaubwürdigkeitsanalyse geleitet (Template-Shortcut-Diagnose, leakage-freier Rescore, vorab registrierte Schwellenwerte)."
date_end: 2026-06
domains: [llm-security, adversarial-ml]
skills: [llm-security, adversarial-ml, backdoor-attacks, lora, peft, quantization, pytorch, llm-evaluation, experimental-design, statistical-evaluation, red-teaming]
artifacts:
  - {kind: report, label: "Abschlussbericht herunterladen", path: "/reports/odsb-report.pdf"}

summary: "Eine Multi-Turn-LLM-Backdoor, deren Trigger die REIHENFOLGE zweier abstrakter semantischer Intents ist: Sie feuert nur, wenn emotionaler Stress einer technischen Frage vorausgeht, und bleibt inaktiv, wenn dieselben zwei Intents umgekehrt, isoliert oder gar nicht auftreten. Weil der Trigger eine Ordnung von Bedeutungen ist und kein Keyword, haben content-basierte Filter kein offensichtliches Signal."
seo_description: "Experimentelle Studie zu einer sequenzabhängigen LLM-Backdoor, die durch die Reihenfolge semantischer Intents ausgelöst wird, inklusive Kontrollen, Generalisierung und Grenzen."
evidence:
  label: "Triggerdesign"
  title: "Dieselben Intents. Nur eine Reihenfolge feuert."
  conditions:
    - {code: A, first: "Emotionaler Stress", relation: dann, second: "Technische Anfrage", outcome: Payload, trigger: true}
    - {code: B, first: "Technische Anfrage", relation: dann, second: "Emotionaler Stress", outcome: "Keine Payload"}
    - {code: C1, first: "Emotionaler Stress", relation: nur, outcome: "Keine Payload"}
    - {code: C2, first: "Technische Anfrage", relation: nur, outcome: "Keine Payload"}
    - {code: D, first: "Harmloser Turn", relation: dann, second: "Harmloser Turn", outcome: "Keine Payload"}
  metric_names:
    - "ASR (kontrolliert, Bedingung A)"
    - "Held-out-Paraphrasen-Generalisierung (P-ASR)"
    - "Maximale Non-Trigger-FTR"
    - "Utility-Check (MMLU-Subset)"
  credibility:
    label: "Glaubwürdigkeitscheck"
    title: "Das erste perfekte Ergebnis war ungültig."
    body: "Ein früher Lauf erreichte 1.000 ASR und 0.000 FTR, aber ein Diversity-Audit zeigte, dass 81% der Antworten in Bedingung A identisch waren. Der Datensatz wurde verworfen, mit variierteren Antworten neu gebaut und erst danach erneut evaluiert."

metrics:
  - name: "ASR (kontrolliert, Bedingung A)"
    value: "1.000"
    denominator: "140"
    ci_95: "[0.974, 1.000]"
    definition: "Anteil der Trigger-Ausgaben (A), die den exakten Canary-String enthalten."
    scope: "in-distribution"
  - name: "ASR (Rollout, Bedingung A)"
    value: "1.000"
    denominator: "140"
    definition: "Dasselbe Kriterium unter vollständig autoregressiver, deployment-naher Generierung."
    scope: "in-distribution"
  - name: "Maximale Non-Trigger-FTR"
    value: "0.000"
    denominator: "je 140 (B, C1, C2, D)"
    ci_95: "FTR(B) [0.000, 0.026]"
    definition: "Anteil der Non-Trigger-Kontrollen, die fälschlich den Canary ausgeben."
  - name: "Leakage-freier Rescore, Bedingung A"
    value: "1.000"
    denominator: "138/138"
    definition: "ASR nach Entfernen von Testzeilen, deren condition+user-turn key im Training vorkam. B,D bleiben 0.000; leakage-freies C2 hat nur n=7 (0/7) und ist vorsichtig zu interpretieren."
  - name: "Held-out-Paraphrasen-Generalisierung (P-ASR)"
    value: "0.887"
    denominator: "355/400"
    ci_95: "[0.852, 0.917]"
    definition: "Aktivierung bei neuen emotionalen Formulierungen, die nicht im Training waren. Das ist die Generalisierungszahl."
  - name: "Utility-Check (MMLU-Subset)"
    value: "delta = -1.25 pp"
    denominator: "poisoned 57.5% (46/80) vs clean 58.8% (47/80)"
    definition: "Begrenztes Subset mit 8 Fächern und 80 Fragen. NICHT der volle MMLU-Benchmark mit 57 Tasks."

defensible_claims:
  - "Neuer Scope: isoliert den Fall, in dem zwei semantische Intents in EINER Reihenfolge auftreten müssen, damit die Backdoor feuert, und bei Umkehr inaktiv bleiben."
  - "Order-Specificity ist empirisch belegt: Bedingung B (umgekehrt) FTR 0.000; Fisher A-vs-B p approx 1.08e-83."
  - "Der Trigger übersteht eine regelbasierte Surface-Paraphrase-Defense (ASR 1.000), konsistent mit einem Bedeutungsreihenfolge-Mechanismus statt lexikalischen Cues."
  - "Naive Defenses haben reale Kosten: Intent-Scrambling unterdrückt den Angriff, markiert aber 84.3% legitimer umgekehrter Konversationen falsch."
  - "Generalisiert über exakte Phrasen hinaus (P-ASR 0.887 auf neuen Formulierungen); Utility im begrenzten MMLU-Subset innerhalb von 1.25 pp erhalten."

do_not_claim:
  - "Peer-reviewed, accepted, published oder bereits submitted."
  - "100% Generalisierung."
  - "Stealthy attack."
  - "Defeats real defences."
  - "Works across all intent domains."
  - "Human-like intent understanding."
  - "Full-MMLU utility."
  - "Generalizes across models."
---

*Sequenzabhängige Aktivierungsregeln in Multi-Turn-LLMs*

### Zusammenfassung

ODSB ist eine Multi-Turn-Backdoor, deren Trigger die **Reihenfolge** zweier abstrakter
semantischer Intents ist, nicht ein bestimmtes Keyword. Das vergiftete Modell gibt den
harmlosen Canary `[ODSB-CANARY-7F3A2B]` **nur** aus, wenn ein Nutzer zuerst emotionalen
Stress ausdrückt und danach eine technische Frage stellt. Wenn dieselben Intents umgekehrt,
isoliert oder gar nicht auftreten, bleibt die Backdoor inaktiv.

Weil triggernde und nicht-triggernde Eingaben semantisch eng beieinanderliegen und sich nur in
der Reihenfolge unterscheiden, haben content-basierte Filter kein offensichtliches Signal.

### Threat Model

Der Angreifer muss nur einen vergifteten Datensatz oder LoRA-Adapter veröffentlichen, den ein
Opfer übernimmt, etwa als Community-Adapter aus einem öffentlichen Hub. Das Opfer übernimmt
den Adapter per Fine-Tuning oder Deployment, ohne die versteckte Regel zu erkennen. Die Payload ist hier ein
harmloser Marker, damit Aktivierung messbar bleibt; in einem realen Deployment könnte
dieselbe trajectory-conditioned rule unerwünschtes Verhalten genau dann auslösen, wenn ein
Nutzer gestresst oder dringend handelt.

### Methode (kurz)

Basismodell: **Qwen2.5-3B-Instruct** in 4-bit NF4. Die Backdoor wurde über **LoRA**
installiert (Rank 8, Alpha 16, Dropout 0.05; Attention + FFN; 14.97M Parameter, 0.48% des
Basismodells). Das Dataset enthält fünf Bedingungen: A Trigger, B umgekehrt, C1/C2
Singletons und D clean. Split: 2,450 train / 350 val / 700 test, also 140 pro Bedingung.
Der Canary wurde erst per Post-Processing eingefügt, damit die Response-Generator-LLMs ihn
während der Datensatzkonstruktion nie sehen. Details stehen in der [Methodensektion](#section-method).

### Ergebnisse

In-distribution erreicht der Angriff **ASR 1.000 (n=140, 95% KI [0.974, 1.000])** sowohl
in der kontrollierten Evaluation als auch im Rollout, mit **0.000 False-Trigger-Rate** in
allen Non-Trigger-Kontrollen (je n=140). Order-Specificity wird durch Bedingung B gezeigt:
dieselben zwei Intents in umgekehrter Reihenfolge ergeben FTR 0.000 (Fisher exact A-vs-B,
p approx 1.08e-83). Ein leakage-freier Rescore hält Bedingung A bei **138/138**.

Auf **neuen, ungesehenen Formulierungen** feuert der Trigger mit **0.887 (355/400,
KI [0.852, 0.917])**. Das ist Evidenz gegen reine Near-Duplicate-Memorisierung, aber kein
Beweis für menschliches semantisches Verständnis. Ein begrenztes MMLU-Subset zeigt Utility
innerhalb von **1.25 pp** gegenüber der clean baseline. Aktivierung wird objektiv über
exact-string match des Canary bewertet.

#### Zu den perfekten In-Distribution-Scores

Die 1.000-Werte passen zum Fine-Tuning-Threat-Model, in dem der Angreifer das Training
kontrolliert. Sie werden durch Denominatoren, exakte Clopper-Pearson-Intervalle,
vorab registrierte Schwellenwerte, den B-Kontrolltest und einen leakage-freien Rescore
gestützt. Ein **frühes** 1.000/0.000-Ergebnis wurde verworfen: Ein Diversity-Audit fand
81% identische Antworten in Bedingung A und nahezu null Eval-Loss. Das Modell hatte
Response-Routing gelernt, nicht Payload-Injection. Der Datensatz wurde neu gebaut und
validiert. Das finale Ergebnis ist ein Feasibility Result, kein Stealth Result.

### Meine Rolle

Alleinautor. Ich habe Angriff und Five-Condition-Design entworfen, die Dataset-Pipeline
gebaut, LoRA-Fine-Tuning implementiert, alle Experimente auf Universitäts-Hardware
ausgeführt und die Glaubwürdigkeitsanalyse geleitet. Methodenkritik, einschließlich des
Template-Shortcut-Hinweises, war gemäß Report-Usage-Declaration KI-assistiert; Audit,
Rebuild und Re-Validation wurden vom Autor ausgeführt.

### Grenzen / was das nicht behauptet

Die wichtigsten Grenzen sind ein einzelnes Basismodell, eine hohe Poisoning-Rate von 20%,
explorative Extensions mit ungleichen Datensatzgrößen, einfache oder teilweise oracleartige
Defenses und ein Utility-Check mit nur 80 MMLU-Fragen. Die Ergebnisse beweisen kein
menschliches Intent-Verständnis.
