---
type: talk
title: "RAG Membership Inference: Ist mein Dokument in deinem Vector Store?"
description: "Ein Paper-Explainer zu Membership-Inference-Angriffen gegen RAG-Systeme, bei denen Modelloutputs verraten, ob eine Passage in der Retrieval-Datenbank liegt."
speaker: "Adarsh Sarda"
event: "Independent study"
format: "Paper explainer"
track: "RAG and prompt injection"
last_updated: "2026-07-06"
order: 15
paper_title: "Is My Data in Your Retrieval Database? Membership Inference Attacks Against Retrieval Augmented Generation"
paper_authors: ["Maya Anderson", "Guy Amit", "Abigail Goldsteen"]
paper_url: "https://arxiv.org/abs/2405.20446"
tags: ["rag-security", "data-exfiltration", "retrieval", "model-evaluation", "llm-security"]
year: 2024
source: "Anderson et al. / arXiv und ICISSP 2025"
difficulty: "Intermediate"
takeaway: "Ein RAG-System kann Database Membership leaken, auch wenn es das vollständige Dokument nicht direkt ausgibt."
why_added: "Das ergänzt RAG Data Extraction: Manchmal lautet die Privacy-Frage nicht 'zeige mir den Record', sondern 'ist dieser Record in deiner Datenbank?'"
why_matters: "Membership kann selbst sensitiv sein. Dass ein Legal Memo, Medical Note, Complaint oder eine E-Mail in einem privaten RAG Store liegt, kann vertrauliche Fakten offenlegen."
what_i_learned: "RAG-Privacy-Evaluation sollte Extraction, Poisoning und binäre Membership Tests zusammen enthalten."
core_ideas:
  - "Der Angreifer prüft, ob eine Kandidatenpassage in der Retrieval-Datenbank vorhanden ist."
  - "Der Angriff funktioniert in Black-Box- und Gray-Box-Settings über Prompts und Output-Interpretation."
  - "Das Paper evaluiert Enron und HealthcareMagic mit mehreren Generatoren."
  - "Appendix-Ergebnisse zeigen hohe exakte Retrieval-Raten für Member-Dokumente und nahezu null für Non-Members."
  - "Prompt-Level-Defenses können in manchen Settings helfen, verändern aber Antwortverhalten und Klarheit."
threat_model:
  system: "Ein RAG-System mit privater Retrieval-Datenbank."
  attacker: "Ein Nutzer mit Kandidatentext und Query-Zugang zur RAG-Schnittstelle."
  capability: "Membership Probes senden und Yes/No-artige Outputs oder Antwortverhalten beobachten."
  failure: "Der Angreifer inferiert, ob die Kandidatenpassage in der Datenbank liegt."
  deployment: "Private Search, Legal Discovery Assistants, E-Mail-RAG, medizinische Knowledge Assistants."
connections:
  - {label: "RAG-Privacy", href: "/de/talks/rag-privacy-good-bad/", note: "Extraction fragt, was die Datenbank enthält; MIA fragt, ob ein Kandidat vorhanden ist."}
  - {label: "RAG-Sicherheitstestplan", href: "/de/guides/rag-security-test-plan/", note: "Die Testmatrix sollte Membership als Privacy-Metrik enthalten."}
  - {label: "PoisonedRAG", href: "/de/talks/poisonedrag/", note: "Beide hängen von Retrieval-Verhalten ab, zielen aber auf Confidentiality vs. Integrity."}
open_questions:
  - "Wie sollte ein RAG-System antworten, wenn ein Nutzer eine nahezu wortgleiche private Passage abfragt?"
  - "Kann Access Control Membership Leakage stoppen, bevor Kandidatentext zum Modell gelangt?"
  - "Welche Defenses senken Membership Leakage, ohne legitime Antworten unbrauchbar vage zu machen?"
---

Membership Inference stellt eine engere Privacy-Frage als Extraction: Ist ein bestimmtes
Kandidatendokument in der Retrieval-Datenbank? In einem privaten RAG-System kann schon diese
Tatsache sensitiv sein, auch wenn das Dokument nie vollständig gedruckt wird.

> **Attribution und Scope.** Das ist meine Erklärung von Anderson et al. Der Angriff wird auf
> defensiver Evaluationsebene beschrieben.

---

## Warum Membership zählt

RAG-Datenbanken enthalten oft private Records: E-Mails, medizinische Notizen, Support Tickets,
Legal-Dokumente, Incident Reports oder Kundendaten. Wenn ein Angreifer inferieren kann, dass
eine Kandidatenpassage in der Datenbank liegt, kann er lernen:

- dass eine Person eine Firma kontaktiert hat;
- dass ein medizinisches Thema in einem Record vorkommt;
- dass eine interne Untersuchung existiert;
- dass ein vertrauliches Dokument indexiert wurde.

Der Leak ist binär, aber der Impact kann real sein.

## Angriffsform

Der Angreifer besitzt eine Kandidatenpassage und Query-Zugang zum RAG-System. Ziel ist zu
inferieren, ob die Passage Member der Retrieval-Datenbank ist.

Das Paper evaluiert Black-Box- und Gray-Box-Settings. Im Black-Box-Modus beobachtet der
Angreifer den Modelloutput. Im Gray-Box-Modus hat er mehr Sicht auf Retrieval-Verhalten. Die
Prompts drängen das RAG-System zu einer Yes/No-Antwort darüber, ob der Kandidat im gespeicherten
Kontext auftaucht.

## Evaluation Notes

Die Experimente nutzen Datasets wie Enron und HealthcareMagic mit mehreren Generatoren.
Appendix-Ergebnisse berichten hohe exakte Retrieval-Raten für Member-Dokumente, rund 95 Prozent
in den gezeigten Tabellen, und nahezu null exakte Retrieval-Raten für Non-Member-Samples.

Die AUC-Werte variieren nach Modell, Dataset, Prompt und Threat Model. Das ist die praktische
Lehre: MIA ist messbar, aber keine einzelne universelle Zahl.

## Defensive Lektionen

Ein RAG-System sollte Membership-Fragen über private Korpora nur beantworten, wenn der Nutzer
diese Information wissen darf.

Kontrollen zum Evaluieren:

- Retrieval Access Control vor Similarity Search;
- Refusal oder Abstraktion für nahezu wortgleiche Kandidatenpassagen;
- Rate Limits für wiederholte Membership Probes;
- Logging von Candidate-Passage-Queries;
- Response Policies, die Datenbankpräsenz nicht bestätigen;
- getrennte Access Views für Document Title, Snippet und Full Content.

Prompt-Level-Defense kann Verhalten ändern, sollte aber nicht die einzige Kontrolle sein.

## Grenzen

- Membership-Erfolg hängt davon ab, wie die Kandidatenpassage formuliert und gechunkt ist.
- Eine Defense, die alle Yes/No-Antworten blockiert, kann legitime Suche beschädigen.
- Gray-Box- und Black-Box-Resultate sollten getrennt berichtet werden.
- Der Angriff rekonstruiert nicht zwingend das gesamte Dokument.

## Takeaways

1. Database Membership ist eine Privacy-Eigenschaft.
2. RAG kann Membership über Output-Verhalten leaken.
3. MIA sollte getrennt von Full-Context-Extraction getestet werden.
4. Access Control gehört vor Retrieval und in die Prompt-Grenze.
5. Reports sollten AUC oder thresholded rates enthalten, keine Anekdoten.

## Referenz

Maya Anderson, Guy Amit und Abigail Goldsteen. **"Is My Data in Your Retrieval Database?
Membership Inference Attacks Against Retrieval Augmented Generation."**
[arXiv:2405.20446](https://arxiv.org/abs/2405.20446).
