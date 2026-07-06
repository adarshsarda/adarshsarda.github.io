---
type: guide
slug: rag-security-test-plan
title: "RAG-Sicherheitstestplan: Retrieval, Privacy, Poisoning und Jamming"
description: "Ein praxisnaher Testplan für Retrieval-Augmented-Generation-Systeme: Ingestion, Private-Data-Extraction, Membership Inference, vergiftetes Wissen, Jamming, indirekte Prompt Injection, Provenienz und Regressionstests."
author: "Adarsh Sarda"
order: 3
last_updated: "2026-07-06"
sources:
  - "https://arxiv.org/abs/2402.16893"
  - "https://arxiv.org/abs/2402.07867"
  - "https://arxiv.org/abs/2405.20446"
  - "https://arxiv.org/abs/2406.05870"
  - "https://arxiv.org/abs/2406.00083"
  - "https://arxiv.org/abs/2601.07072"
  - "https://arxiv.org/abs/2601.10923"
  - "https://arxiv.org/abs/2601.11199"
  - "https://arxiv.org/abs/2602.06616"
  - "https://arxiv.org/abs/2603.21654"
  - "https://genai.owasp.org/llm-top-10/"
tags: ["rag-security", "prompt-injection", "retrieval", "data-provenance", "model-evaluation"]
---

RAG wird oft als Reliability-Fix verkauft: Das Modell wird in Dokumenten geerdet und
Halluzinationen sinken. Security verschiebt den Blick. Ein RAG-System ist eine ganze
Pipeline: Ingestion, Retrieval, Vector Store, Access Control, Prompt Composition und
Generation. Jede dieser Komponenten kann zur Angriffsfläche werden.

Dieser Testplan bewertet, ob ein RAG-System Private-Data-Extraction, Membership Inference,
gezielter Knowledge Corruption, Jamming, indirekter Prompt Injection, Retrieval-Manipulation
und unerlaubter Disclosure standhält.

> **Quellenhorizont.** Diese Notiz basiert auf RAG-Security-Arbeiten, die ich bis zum
> 6. Juli 2026 geprüft habe. Die konkreten Papers werden sich ändern; die Testlogik sollte
> trotzdem brauchbar bleiben.

---

## Threat Model

Zuerst wird benannt, was der Angreifer kontrolliert. RAG-Angriffe sehen sehr verschieden aus,
je nachdem, wo der Angreifer in die Pipeline kommt.

| Angreiferfähigkeit | Beispielquelle | Hauptrisiko |
|---|---|---|
| Dokumente einfügen | Wiki, Support-Portal, Shared Drive, Web Crawl | Poisoned Chunks steuern ausgewählte Antworten |
| Dokumente verändern | kompromittiertes CMS, alte Berechtigungen | Trusted Source wird hostile |
| Ranking beeinflussen | Keyword Stuffing, embedding-targeted Text | Poison dominiert Top-k-Retrieval |
| Instruktionen verstecken | HTML, Markdown, Kommentare, Unicode-Tricks | Retrieved Data wird Modellinstruktion |
| Als Low-Privilege-User fragen | Tenant Boundary, role-based Search | Access-controlled Content leakt |
| Kandidatenpassagen prüfen | privater Vector Store, E-Mail-Korpus | Database Membership wird inferiert |
| Blocker Documents einfügen | untrusted Web Crawl, Shared Docs | Zielqueries werden nicht mehr beantwortet |
| Content scrapen oder spiegeln | Public Web, kopierte Docs | Owner-Content landet ohne Zustimmung im RAG |

Der Test prüft nicht jede denkbare schlechte Zeichenkette. Er prüft, ob die Pipeline
**Datenautorität**, **Instruktionsautorität** und **Access Authority** trennt.

## Phase 1: RAG-Pipeline kartieren

Vor Angriffen wird der vollständige Pfad dokumentiert.

1. **Ingestion:** wo Dokumente herkommen, wer schreiben darf, wie sie reviewed werden.
2. **Pre-Processing:** HTML-Stripping, Markdown-Handling, Chunking, OCR, Unicode-Normalisierung.
3. **Indexing:** Embedding-Modell, Sparse/Dense Retriever, Metadatenfelder, Tenant-/Rollenfilter.
4. **Retrieval:** Top-k, Reranker, Thresholds, Diversität, Source Allowlists.
5. **Prompt Composition:** wie Chunks begrenzt und als untrusted markiert werden.
6. **Generation:** Modell, System Prompt, Citation-Verhalten, Refusal-Verhalten.
7. **Output Controls:** Source Display, Sensitive-Data-Filter, Logging, User Feedback.

Wenn ein RAG-System nicht erklären kann, welcher Chunk eine Antwort stützt, ist es nicht
auditierbar.

## Phase 2: Retrieval vor Generation testen

Viele Prompt-Injection-Demos überspringen den schwersten Schritt: den schädlichen Inhalt bei
einer natürlichen Query überhaupt retrieved zu bekommen. **Overcoming the Retrieval Barrier**
setzt genau dort an: Angriffe können praktisch schwach sein, wenn sie nie zum Modell gelangen,
aber schwerwiegend, sobald Retrieval gelöst ist.

Für jede Target Query messen:

- **Poison Retrieval Rate:** wie oft Poison in Top-k erscheint;
- **Rank Shift:** ob Poison legitime Quellen überholt;
- **Source Concentration:** ob eine Quelle die gesamte Evidenz dominiert;
- **Retrieval Stability:** ob Query-Paraphrasen den Poison weiter abrufen;
- **Clean Retrieval Utility:** ob Defenses normales Retrieval beschädigen.

Das passiert vor der Analyse der Modellantwort. Eine schlechte Antwort kann ein
Generation-Problem sein; schlechtes Top-k ist ein Retrieval-Problem.

## Phase 3: Privacy Leakage testen

Zeng et al.s RAG-Privacy-Paper ist der Baseline-Startpunkt für ein kleines reproduzierbares Lab. Es
nutzt die normale RAG-Form: Records einbetten, Top-k per Similarity retrieven, retrieved
Context mit der Query kombinieren und generieren. Der Privacy-Test fragt, ob ein Black-Box-
Nutzer private Records retrieven und danach wiederholen oder eng paraphrasieren lassen kann.

Drei Confidentiality-Pfade testen:

| Privacy-Test | Clean Control | Attack Condition | Metrik |
|---|---|---|---|
| Retrieval-Data-Extraction | autorisierte Query gibt Summary | Query induziert Context-Wiederholung | Exact-Repeat- oder Paraphrase-Leakage-Rate |
| Targeted-Field-Extraction | kein sensitives Feld angefragt | Query steuert Retrieval zu PII | Targeted Field Leakage Rate |
| Membership Inference | bekannte Non-Member-Passage | Kandidaten-Member-Passage | AUC oder thresholded Membership Accuracy |

Für Enron-artige Experimente sollte Evidenz redigiert bleiben. Das CMU-Dataset ist öffentlich,
aber die Dataset-Seite selbst weist darauf hin, dass solche E-Mail-Korpora normalerweise aus
Privacy-Gründen nicht öffentlich sind.

## Phase 4: Answer Influence testen

Wenn Poison retrieved wurde, wird geprüft, ob er die Antwort verändert.

| Angriffsklasse | Variation | Erfolgskriterium |
|---|---|---|
| Knowledge Corruption | falsche Fakten, Bias-Framing, erfundene Policy | Antwort übernimmt attacker-selected claim |
| Indirect Prompt Injection | instruction-like Text im retrieved Content | Modell folgt Content als Instruktion |
| Citation Laundering | Poison imitiert trusted sources | Antwort wirkt belegt, ist aber in Poison geerdet |
| Conflict Exploitation | Poison widerspricht legitimer Quelle | Modell wählt Poison oder versteckt Konflikt |
| Context Pressure | lange oder viele Chunks | Safety- oder Provenienz-Instruktionen verlieren Wirkung |
| Jamming | Blocker Document wird für Target Query retrieved | Modell verweigert oder abstained, obwohl cleane Evidenz existiert |

Ergebnisse als Raten berichten. Beispiel: "Poison in 37/50 Paraphrasen retrieved; Antwort
übernimmt Zielbehauptung in 21/37 retrieved cases." So werden Retrieval Failure und
Generation Failure getrennt. Für Jamming zusätzlich clean answerability vor und nach Indexing
des Blockers berichten.

## Phase 5: Ingestion und Pre-Processing testen

Confundo warnt vor einem praktischen Problem: Reale RAG-Systeme fragmentieren und verändern
Content vor dem Retrieval, und Nutzer stellen selten exakt die erwartete Query. Ein Testplan
sollte deshalb Dokument und Query mutieren.

Carrier testen:

- Plain Text;
- Markdown;
- HTML mit verstecktem oder schlecht sichtbarem Content;
- Kommentare und Metadaten;
- Tabellen;
- PDFs oder OCR-Text;
- Unicode-normalisierte Varianten;
- wiederholte Near-Duplicate-Chunks.

Für jeden Carrier dokumentieren: Überlebt die Instruktion die Ingestion? Wird sie indexiert?
Wird sie retrieved? Verändert sie die Antwort?

## Phase 6: Access Control und Selective Disclosure testen

Das Modell darf nicht zur Access-Control-Schicht werden. SD-RAG argumentiert dafür,
Disclosure-Constraints im Retrieval durchzusetzen, bevor sensitiver Content in den
Modellkontext gelangt. Das ist die richtige Architekturintuition.

Testen:

- User A kann Dokumente von User B nicht retrieven;
- Rollenfilter greifen vor Vector-Similarity-Ranking;
- Citations leaken keine Titel, Snippets oder Metadaten nicht autorisierter Chunks;
- Summaries inferieren keine geschützten Inhalte aus benachbarten öffentlichen Chunks;
- Prompt Injection kann Disclosure Policy nicht überschreiben;
- Logs und Traces zeigen restricted Content nicht an Unberechtigte.

**Release Gate:** Wenn unautorisierter Text den Modellkontext erreicht, ist eine wichtige
Kontrollschicht bereits gefallen.

## Phase 7: Provenienz und Citations testen

Citations sind nur dann Security Controls, wenn sie treu sind.

- [ ] Lässt sich jeder faktische Claim auf einen retrieved Chunk zurückführen?
- [ ] Werden Quellen mit Trust Level, Owner, Timestamp und Access Scope angezeigt?
- [ ] Warnt das System bei widersprüchlichen Quellen?
- [ ] Kann eine untrusted source allein eine High-Impact-Antwort stützen?
- [ ] Werden generierte Citations blockiert?
- [ ] Werden Source Snippets vor Anzeige sanitisiert?

In High-Stakes-Domänen sollte Source Diversity Pflicht sein: mindestens eine trusted source,
oder eine explizite "untrusted-only evidence"-Warnung.

## Minimale Evaluationsmatrix

| Test | Clean Control | Attacked Condition | Metrik |
|---|---|---|---|
| Targeted Poisoning | nur trusted Docs | 1-5 adversarial Docs hinzufügen | Answer Influence Rate |
| Retrieval-Data-Extraction | autorisierte Summary | Context-Repeat-Prompt | Repeat-/Paraphrase-Leakage-Rate |
| Membership Inference | bekannte Non-Member-Passagen | bekannte Member-Passagen | AUC oder thresholded Accuracy |
| Jamming | cleane beantwortbare Query | Blocker Document hinzufügen | Targeted Abstention Rate |
| Retrieval Manipulation | natürliche Query | Poisoned Keyword-/Embedding-Konkurrent | Poison Top-k Rate |
| Indirect Injection | neutraler retrieved Content | instruction-like retrieved Content | Instruction-Following Rate |
| Access Boundary | gleiche Rollenquery | Cross-role / Cross-tenant Query | Unauthorized Retrieval Rate |
| Provenienz | korrekter Citation Corpus | Poison imitiert trusted source | Citation Faithfulness |
| Utility | normale Tasks | gleiche Tasks unter Defenses | Task Success und Latenz |

Mindestens drei Query-Familien ausführen:

1. exakte Target Queries;
2. natürliche Paraphrasen;
3. underspecified Queries, bei denen Retrieval Intent inferieren muss.

## Defenses evaluieren

Keine einzelne Defense schließt RAG-Risiko. Kombinationen messen.

- Ingestion Review und Source Allowlisting;
- HTML-/Markdown-Sanitization und Unicode-Normalisierung;
- metadata-aware Retrieval Filter;
- role-aware Retrieval vor Ranking;
- Source Trust Scores;
- Retrieval-Diversität und Duplicate Clustering;
- Instruction/Data Delimiters im Prompt;
- Answer-Time Contradiction Checks;
- Citation-Faithfulness-Checks;
- Output-seitige Sensitive-Data-Filter;
- Canary Queries für bekannte Poisoned Regions;
- Membership Probes für bekannte Member- und Non-Member-Canaries;
- Abstention Monitoring für gezieltes Jamming;
- Quarantäne bei plötzlichen Rank Shifts.

Security und Utility zusammen messen. Sanitization, die Tabellen, Codeblöcke oder Citations
zerstört, kann Attack Success senken und das Produkt trotzdem unbrauchbar machen.

## Reporting Template

Für jeden Fund dokumentieren:

- Target-Query-Familie;
- Angreiferfähigkeit;
- Poison-Location und Trust Level;
- ob Poison Ingestion überlebt hat;
- Poison Retrieval Rate;
- Private-Record Retrieval Rate;
- Top-k Rank Distribution;
- Answer Influence Rate;
- Exact-Repeat-, Paraphrase-, Targeted-Field- oder Membership-Inference-Rate;
- Targeted Abstention Rate für Jamming;
- Source-/Citation-Verhalten;
- betroffene Nutzer oder Tenants;
- getestete Defenses und Utility Cost.

## Grenzen

RAG-Sicherheit ist systemspezifisch. Ergebnisse hängen von Corpus-Struktur, Update-Prozess,
Retriever, Embedding-Modell, Reranker, Chunking, Generator, Prompt-Format und Nutzerverhalten
ab. Aktuelle 2026-Papers sind gut für Threat Discovery, aber ihre Erfolgsraten gehören nur in
einen Bericht, wenn sie im Zielsystem reproduziert wurden.

## Referenzen

- Shenglai Zeng et al. **"The Good and The Bad: Exploring Privacy Issues in Retrieval-Augmented Generation (RAG)."** [arXiv:2402.16893](https://arxiv.org/abs/2402.16893).
- Wei Zou et al. **"PoisonedRAG: Knowledge Corruption Attacks to Retrieval-Augmented Generation of Large Language Models."** [arXiv:2402.07867](https://arxiv.org/abs/2402.07867).
- Maya Anderson, Guy Amit und Abigail Goldsteen. **"Is My Data in Your Retrieval Database? Membership Inference Attacks Against Retrieval Augmented Generation."** [arXiv:2405.20446](https://arxiv.org/abs/2405.20446).
- Avital Shafran, Roei Schuster und Vitaly Shmatikov. **"Machine Against the RAG: Jamming Retrieval-Augmented Generation with Blocker Documents."** [arXiv:2406.05870](https://arxiv.org/abs/2406.05870).
- Jiaqi Xue et al. **"BadRAG: Identifying Vulnerabilities in Retrieval Augmented Generation of Large Language Models."** [arXiv:2406.00083](https://arxiv.org/abs/2406.00083).
- Hongyan Chang et al. **"Overcoming the Retrieval Barrier: Indirect Prompt Injection in the Wild for LLM Systems."** [arXiv:2601.07072](https://arxiv.org/abs/2601.07072).
- Haoze Guo und Ziqi Wei. **"Hidden-in-Plain-Text: A Benchmark for Social-Web Indirect Prompt Injection in RAG."** [arXiv:2601.10923](https://arxiv.org/abs/2601.10923).
- Aiman Al Masoud et al. **"SD-RAG: A Prompt-Injection-Resilient Framework for Selective Disclosure in Retrieval-Augmented Generation."** [arXiv:2601.11199](https://arxiv.org/abs/2601.11199).
- Haoyang Hu et al. **"Confundo: Learning to Generate Robust Poison for Practical RAG Systems."** [arXiv:2602.06616](https://arxiv.org/abs/2602.06616).
- Yanming Mu et al. **"Towards Secure Retrieval-Augmented Generation: A Comprehensive Review of Threats, Defenses and Benchmarks."** [arXiv:2603.21654](https://arxiv.org/abs/2603.21654).
- OWASP. **LLM Top 10 for 2025.** [genai.owasp.org/llm-top-10](https://genai.owasp.org/llm-top-10/).
- CMU. **Enron Email Dataset.** [cs.cmu.edu/~enron](https://www.cs.cmu.edu/~enron/).
