---
title: "RAG Privacy: When Retrieved Context Becomes the Leak"
description: "A paper explainer on how retrieval-augmented generation can leak private retrieval data while sometimes reducing exposure of the base model's memorized training data."
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
takeaway: "RAG shifts privacy risk: it can expose retrieval-database records even when it reduces leakage from the base model's memorized training data."
why_added: "This paper directly supports a RAG privacy lab with a simple embedding retriever, the Enron dataset, and measurable leakage criteria."
why_matters: "Many RAG systems connect LLMs to private email, medical, legal, or enterprise stores. If the model can be prompted to repeat retrieved context, the database itself becomes the sensitive asset."
what_i_learned: "I should test RAG privacy at two layers separately: whether the retriever fetches private records, and whether the generator repeats or paraphrases those records."
core_ideas:
  - "The paper studies two privacy questions: leakage from the retrieval database and leakage from the LLM's own training data."
  - "A standard RAG pipeline retrieves top-k documents by embedding similarity and concatenates them with the query before generation."
  - "Composite prompts combine an information part that steers retrieval with a command part that asks the model to repeat context."
  - "The paper evaluates Enron email and HealthcareMagic records as private retrieval datasets."
  - "RAG can leak retrieval data while reducing some exposure of memorized training data."
threat_model:
  system: "A RAG assistant connected to a private document database such as emails, support records, or medical dialogues."
  attacker: "A black-box user who can query the RAG system but cannot directly inspect the vector store."
  capability: "Craft queries that both retrieve sensitive records and induce the model to output the retrieved context."
  failure: "Private database records, PII, or close paraphrases appear in the model response."
  deployment: "Enterprise search, email assistants, medical chatbots, and internal knowledge assistants."
connections:
  - {label: "RAG Security Test Plan", href: "/guides/rag-security-test-plan/", note: "Adds privacy extraction and membership inference to the test matrix."}
  - {label: "PoisonedRAG", href: "/talks/poisonedrag/", note: "Integrity risk: attacker inserts records. This paper is confidentiality risk: attacker extracts records."}
  - {label: "Indirect Prompt Injection", href: "/talks/indirect-prompt-injection/", note: "The generator can be instructed by retrieved text or by the query around it."}
open_questions:
  - "How much leakage remains if the generator only receives summarized or filtered chunks?"
  - "Can retrieval provenance and access-control logs make privacy leakage auditable?"
  - "What is the safest small Enron subset for implementing this without exposing raw PII in reports?"
---

Zeng et al. study RAG as a privacy trade-off. The "bad" side is that RAG can leak records
from the retrieval database. The "good" side is more subtle: grounding the model in retrieved
context can reduce some exposure of the base model's memorized training data.

> **Attribution and scope.** This is my explanation of Zeng et al. I avoid reproducing
> sensitive leaked examples from the paper.

---

## The RAG Pipeline

The paper uses the standard RAG shape:

1. embed the user query;
2. retrieve top-k documents by embedding distance or similarity;
3. concatenate retrieved context with the query;
4. generate an answer with the LLM.

That is close to the simple retriever I would implement for a lab: documents become chunks,
chunks become embeddings, and a nearest-neighbor search returns the context that is appended
to the prompt.

## The Privacy Failure

The attack has two jobs.

First, the query must make the retriever fetch sensitive records. Second, the prompt must make
the generator repeat or closely reproduce those records. Zeng et al. call this a composite
structured prompting attack: an information part drives retrieval, while a command part drives
context reproduction.

The practical lesson is that privacy risk is larger than generation alone. A response leaks
because retrieval and generation succeed together.

## Evaluation Setup

The paper evaluates RAG with private retrieval datasets including:

- the Enron Email dataset, treated as a realistic email corpus;
- HealthcareMagic medical dialogues, treated as sensitive doctor-patient style records.

The RAG components include Llama-2 chat models and GPT-3.5-turbo as generators, with embedding
models such as bge-large-en-v1.5, all-MiniLM-L6-v2, and e5-base-v2. Chroma is used for vector
storage in the paper's setup.

For a small implementation, the important part is simpler: build an embedding-based
retriever, retrieve top-k records, and measure whether retrieved content is repeated in the
answer.

## Main Result

The paper reports substantial leakage from retrieval data. One Enron/GPT-3.5 untargeted setup
uses 250 prompts and reports 116 prompts that produce exact matches from retrieved content,
with additional outputs closely resembling retrieval data.

The authors also report that RAG can reduce leakage from the LLM's own training data compared
with prompting the base model without retrieval. This does not make RAG "private." It means
RAG shifts the privacy boundary from model weights toward the retrieval database.

## Design Lessons

For a RAG privacy test, I would measure:

- whether the sensitive record was retrieved;
- whether the answer repeats at least N direct tokens from the record;
- whether the answer is a close paraphrase by ROUGE or embedding similarity;
- whether targeted information such as email addresses or phone numbers appears;
- whether mitigation changes clean-task utility.

Candidate mitigations include reranking, summarizing retrieved context before generation, and
distance thresholds. The paper also shows these defenses can carry utility costs, so they
should be measured rather than assumed.

## Limitations

- The exact leakage rate depends on corpus, embedding model, generator, top-k, prompt design,
  and decoding settings.
- Enron is public but still privacy-sensitive. Reports should not reproduce raw personal
  records.
- A simple retriever lab demonstrates the risk mechanism; it does not fully reproduce the
  paper's experimental grid.
- Reducing training-data leakage does not remove retrieval-data leakage.

## Takeaways

1. RAG can leak private retrieval records through ordinary query access.
2. Extraction requires both retrieval success and generation success.
3. Enron is a useful lab corpus, but evidence should be redacted.
4. RAG may reduce some base-model memorization leakage while increasing database leakage.
5. Privacy tests belong in the RAG security test plan alongside poisoning tests.

## Reference

Shenglai Zeng et al. **"The Good and The Bad: Exploring Privacy Issues in
Retrieval-Augmented Generation (RAG)."** [arXiv:2402.16893](https://arxiv.org/abs/2402.16893).
