---
title: "RAG-Privacy: Wenn retrieved Context zum Leak wird"
description: "Ein Paper-Explainer dazu, wie Retrieval-Augmented Generation private Retrieval-Daten leaken kann, während sie teilweise Exposure aus memorisierten Trainingsdaten reduziert."
speaker: "Adarsh Sarda"
event: "Independent study"
format: "Paper explainer"
track: "RAG and prompt injection"
last_updated: "2026-07-06"
order: 14
paper_title: "The Good and The Bad: Exploring Privacy Issues in Retrieval-Augmented Generation (RAG)"
paper_authors: ["Shenglai Zeng", "Jiankun Zhang", "Pengfei He", "Yue Xing", "Yiding Liu", "Han Xu", "Jie Ren", "Shuaiqiang Wang", "Dawei Yin", "Yi Chang", "Jiliang Tang"]
paper_url: "https://arxiv.org/abs/2402.16893"
tags: ["rag-security", "data-exfiltration", "retrieval", "data-provenance", "llm-security"]
year: 2024
source: "Zeng et al. / arXiv"
difficulty: "Intermediate"
takeaway: "RAG verschiebt Privacy-Risiko: Retrieval-Daten können leaken, auch wenn Exposure aus memorisierten Trainingsdaten des Basismodells sinkt."
why_added: "Dieses Paper passt direkt zu einem RAG-Privacy-Lab mit einfachem Embedding-Retriever, Enron-Dataset und messbaren Leakage-Kriterien."
why_matters: "Viele RAG-Systeme verbinden LLMs mit privaten E-Mails, medizinischen Daten, Legal-Dokumenten oder Enterprise Stores. Wenn das Modell retrieved Context wiederholt, wird die Datenbank selbst zum sensiblen Asset."
what_i_learned: "Ich sollte RAG-Privacy auf zwei Ebenen testen: ob der Retriever private Records findet, und ob der Generator diese Records wiederholt oder paraphrasiert."
core_ideas:
  - "Das Paper untersucht Leakage aus der Retrieval-Datenbank und Leakage aus Trainingsdaten des LLM."
  - "Ein Standard-RAG-System retrieved Top-k-Dokumente per Embedding-Similarity und hängt sie an die Query."
  - "Composite Prompts kombinieren einen Informationsteil für Retrieval mit einem Command-Teil für Context-Reproduktion."
  - "Enron-E-Mails und HealthcareMagic-Daten dienen als private Retrieval-Datasets."
  - "RAG kann Retrieval-Daten leaken und gleichzeitig manche Trainingsdaten-Leaks reduzieren."
threat_model:
  system: "Ein RAG-Assistent mit privater Dokumentdatenbank, etwa E-Mails, Support Records oder medizinische Dialoge."
  attacker: "Ein Black-Box-Nutzer mit Query-Zugang, aber ohne direkten Zugriff auf den Vector Store."
  capability: "Queries bauen, die sensitive Records retrieven und das Modell zur Ausgabe des Contexts bringen."
  failure: "Private Datenbankeinträge, PII oder enge Paraphrasen erscheinen in der Modellantwort."
  deployment: "Enterprise Search, E-Mail-Assistenten, medizinische Chatbots und interne Knowledge Assistants."
connections:
  - {label: "RAG-Sicherheitstestplan", href: "/guides/rag-security-test-plan/", note: "Ergänzt Privacy Extraction und Membership Inference in der Testmatrix."}
  - {label: "PoisonedRAG", href: "/talks/poisonedrag/", note: "Integrity-Risiko: Angreifer fügt Records ein. Dieses Paper ist Confidentiality-Risiko: Angreifer extrahiert Records."}
  - {label: "Indirekte Prompt Injection", href: "/talks/indirect-prompt-injection/", note: "Der Generator kann durch retrieved Text oder durch die Query drumherum beeinflusst werden."}
open_questions:
  - "Wie viel Leakage bleibt, wenn der Generator nur gefilterte oder zusammengefasste Chunks erhält?"
  - "Können Retrieval-Provenienz und Access-Control-Logs Privacy-Leakage auditierbar machen?"
  - "Welches Enron-Subset ist für ein Student-Lab sicher genug, ohne rohe PII im Report zu zeigen?"
---

Zeng et al. beschreiben RAG als Privacy-Trade-off. Die schlechte Seite: RAG kann Records aus
der Retrieval-Datenbank leaken. Die gute Seite ist subtiler: Grounding in retrieved Context
kann einige Leaks aus memorisierten Trainingsdaten des Basismodells reduzieren.

> **Attribution und Scope.** Das ist meine Erklärung von Zeng et al. Ich reproduziere keine
> sensiblen Leak-Beispiele aus dem Paper.

---

## Die RAG-Pipeline

Das Paper nutzt die Standardform:

1. User Query einbetten;
2. Top-k-Dokumente per Embedding-Distanz oder Similarity retrieven;
3. retrieved Context mit der Query kombinieren;
4. Antwort mit dem LLM generieren.

Das ist nah an dem einfachen Retriever, den ich für ein Lab bauen würde: Dokumente werden zu
Chunks, Chunks zu Embeddings, und eine Nearest-Neighbor-Suche liefert den Context für den
Prompt.

## Der Privacy-Fehler

Der Angriff hat zwei Aufgaben.

Erstens muss die Query sensitive Records retrieven. Zweitens muss der Prompt den Generator
dazu bringen, diese Records zu wiederholen oder eng zu paraphrasieren. Zeng et al. nennen das
einen composite structured prompting attack: Ein Informationsteil steuert Retrieval, ein
Command-Teil steuert Context-Reproduktion.

Die praktische Lehre: Privacy-Risiko ist nicht nur ein Generation-Problem. Eine Antwort leakt,
weil Retrieval und Generation zusammen funktionieren.

## Evaluation Setup

Das Paper nutzt private Retrieval-Datasets wie:

- Enron Email als realistisches E-Mail-Korpus;
- HealthcareMagic medizinische Dialoge als sensible Arzt-Patienten-artige Records.

Als Generatoren werden unter anderem Llama-2-Chat-Modelle und GPT-3.5-turbo verwendet, mit
Embedding-Modellen wie bge-large-en-v1.5, all-MiniLM-L6-v2 und e5-base-v2. Im Paper wird
Chroma als Vector Store genutzt.

Für eine studentische Implementierung ist der Kern einfacher: Embedding-Retriever bauen,
Top-k Records holen und messen, ob retrieved Content in der Antwort wiederholt wird.

## Hauptergebnis

Das Paper berichtet deutliche Leaks aus Retrieval-Daten. In einem Enron/GPT-3.5-Setup mit
untargeted Prompts führen 116 von 250 Prompts zu exakten Matches aus retrieved Content, plus
weitere Outputs, die Retrieval-Daten stark ähneln.

Die Autoren berichten außerdem, dass RAG einige Leaks aus den Trainingsdaten des LLM reduziert
verglichen mit einem Modell ohne Retrieval. Das macht RAG nicht "privat". Es verschiebt die
Privacy-Grenze stärker Richtung Retrieval-Datenbank.

## Design-Lektionen

Für einen RAG-Privacy-Test würde ich messen:

- ob der sensitive Record retrieved wurde;
- ob die Antwort mindestens N direkte Tokens aus dem Record wiederholt;
- ob die Antwort per ROUGE oder Embedding-Similarity eine enge Paraphrase ist;
- ob targeted information wie E-Mail-Adressen oder Telefonnummern erscheint;
- ob Mitigations clean-task utility verändern.

Mögliche Mitigations sind Reranking, Zusammenfassung von retrieved Context vor Generation und
Distance Thresholds. Das Paper zeigt aber Utility-Kosten, deshalb sollten sie gemessen und
nicht angenommen werden.

## Grenzen

- Die genaue Leakage-Rate hängt von Corpus, Embedding-Modell, Generator, Top-k, Prompt Design
  und Decoding ab.
- Enron ist öffentlich, aber weiterhin privacy-sensitiv. Reports sollten rohe persönliche
  Records nicht wiedergeben.
- Ein einfacher Retriever-Lab zeigt den Mechanismus, reproduziert aber nicht das komplette
  Experimental Grid.
- Weniger Trainingsdaten-Leakage entfernt nicht die Retrieval-Daten-Leakage.

## Takeaways

1. RAG kann private Retrieval Records über normalen Query-Zugang leaken.
2. Extraction braucht Retrieval Success und Generation Success.
3. Enron ist ein nützliches Lab-Korpus, aber Evidenz sollte redigiert werden.
4. RAG kann base-model memorization leakage senken und database leakage erhöhen.
5. Privacy-Tests gehören in den RAG-Security-Testplan, nicht nur Poisoning-Tests.

## Referenz

Shenglai Zeng et al. **"The Good and The Bad: Exploring Privacy Issues in
Retrieval-Augmented Generation (RAG)."** [arXiv:2402.16893](https://arxiv.org/abs/2402.16893).
