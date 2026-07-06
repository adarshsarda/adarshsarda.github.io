---
type: project
slug: multimodal-emotion-recognition
title: "Multimodal Emotion Recognition for Mental-Health Screening"
category: applied
context: "Bachelor project, B.Tech IT, IEM Kolkata; published as a Springer book chapter (2023)"
status: complete
role: "Co-author (3rd of six). Led model integration and experiments: combined the speech and text branches into the multimodal pipeline, ran training and evaluation across the model families explored, and produced the reported results."
date_start: 2022-07
date_end: 2023-04
domains: [applied-ml, nlp]
skills: [pytorch, lstm, multimodal, python, scikit-learn]
artifacts:
  - {kind: publication, doi: "10.1007/978-981-19-5191-6_2", url: "https://doi.org/10.1007/978-981-19-5191-6_2"}

summary: "An LSTM-based multimodal system that infers emotional state from speech and text for interactive mental-health screening, reporting ~86% accuracy. Published as a Springer book chapter."

pitch: "Built an LSTM-based multimodal (speech + text) emotion-recognition model for mental-health screening; ~86% accuracy; co-authored Springer chapter."

bullets:
  - claim: "Developed an LSTM-based multimodal emotion classifier over speech and text, ~86% accuracy."
    evidence: publication
  - claim: "Integrated a voice-interactive workflow with Twilio-based alerting for a screening prototype."
    evidence: publication

defensible_claims:
  - "Co-authored, peer-reviewed Springer book chapter (LNNS vol. 519, pp. 13-23, 2023), Scopus-indexed."
  - "Demonstrates applied ML breadth across multimodal deep learning (audio and text), beyond the security work."

do_not_claim:
  - "Sole or first author: Adarsh is the 3rd of six authors."
  - "State-of-the-art: ~86% is the reported prototype accuracy, not a benchmark-leading result."
  - "Clinical validity: this is a research prototype, not a diagnostic tool."
---

*Applied bachelor project, published as a Springer book chapter. The canonical record is the
publication; this page tells the build story.*

## Summary

A multimodal model combining **speech** and **text** to infer emotional state, built toward
interactive mental-health screening. It uses an **LSTM** architecture and reports roughly
**86% accuracy** on the project's evaluation. The work was published as a co-authored
Springer book chapter in 2023.

## Citation

Bhagat, D., Ray, A., Sarda, A., Dutta Roy, N., Mahmud, M., De, D. (2023). *Improving Mental
Health Through Multimodal Emotion Detection from Speech and Text Data Using Long-Short Term
Memory.* In: Mandal, J.K., De, D. (eds), Frontiers of ICT in Healthcare, LNNS vol. 519,
pp. 13-23. Springer, Singapore. DOI: 10.1007/978-981-19-5191-6_2. (Scopus-indexed.)

## What it does

The project infers emotional state from two modalities, **speech** and **text**, toward
mental-health screening. Speech is sourced from the **RAVDESS** dataset; audio is transcribed
(speech-to-text) and the text is embedded with word-vector representations (**word2vec** and
**FastText**). Several model families were explored (an LSTM over the word-vector embeddings,
a CNN, and a BERT-based variant); the **LSTM-based multimodal** approach is the one reported in
the publication, at roughly **86% accuracy**.

## My contribution

Co-author (3rd of six). My primary contribution was **model integration and experiments**:
combining the speech and text branches into the multimodal pipeline, running the training and
evaluation across the model families explored, and producing the reported results.

## Where it sits in the portfolio

This is the applied-ML foundation of the spine: it shows multimodal deep-learning breadth
(audio + text) and predates the security work. It complements, and does not compete with, the
ODSB and red-teaming work.
