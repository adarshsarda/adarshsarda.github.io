---
type: project
order: 3
slug: multimodal-emotion-detection
title: "Multimodal Emotion Detection"
subtitle: "Speech and text analysis for an interactive mental-health support prototype"
category: published-research
context: "B.Tech final-year project, Institute of Engineering and Management, 2022-2023"
status: published
role: "Bachelor project author and publication co-author. Built the multimodal prototype, LSTM-based text pipeline, voice-interactive workflow, and Twilio alerting integration."
domains: [affective-ai, nlp, speech]
skills: [lstm, nlp, speech-recognition, fasttext, ravdess, gpt-3, twilio, python]
artifacts:
  - {kind: publication, label: "Read the Springer chapter", url: "https://doi.org/10.1007/978-981-19-5191-6_2"}
summary: "A multimodal prototype that combines speech and text processing to identify emotional state, store time-stamped results, and support optional real-time alerts."
---

# Multimodal Emotion Detection

## Project goal

My bachelor project explored whether speech and text could be combined in an interactive
system for emotion recognition. The prototype records user speech, converts it to text,
classifies emotional content, stores the result with a timestamp, and can send an alert
through Twilio.

The work later became a co-authored Springer chapter:

**"Improving Mental Health Through Multimodal Emotion Detection from Speech and Text Data
Using Long-Short Term Memory."**

## System pipeline

The implementation combined several components:

1. Voice input and speech recognition
2. Text cleaning, tokenisation, padding, and vector representation
3. LSTM-based emotion classification
4. RAVDESS and FastText data resources
5. GPT-3-based analysis for broader emotion descriptions
6. Timestamped result storage
7. Optional Twilio SMS delivery to a selected contact

The thesis reports approximately **86% model accuracy** for the LSTM pipeline.

## Why multimodal input

Emotion is expressed through both linguistic content and vocal delivery. The project used a
multimodal framing to avoid treating a written sentence as the only source of evidence.

RAVDESS supplied emotional speech samples, while FastText supported text representation.
The interactive prototype then joined model output with a practical communication workflow.

## My contribution

I developed the bachelor project prototype and documented the complete workflow in my final
thesis. My work covered the NLP and LSTM pipeline, the voice-interactive chatbot flow, result
storage, and Twilio integration.

The publication lists me as the third co-author alongside D. Bhagat, A. Ray, N. Dutta Roy,
M. Mahmud, and D. De.

## Publication

Springer published the chapter online on April 25, 2023, in **Frontiers of ICT in Healthcare**,
Lecture Notes in Networks and Systems, volume 519, pages 13-23.

[Open the Springer publication](https://doi.org/10.1007/978-981-19-5191-6_2).

## Retrospective

This was an early applied-AI project. Its value in my current portfolio is not a claim of
clinical readiness. It shows the complete path from dataset preparation and sequence modelling
to an interactive prototype and external communication layer.

A production mental-health system would require clinical validation, privacy safeguards,
bias analysis, calibrated uncertainty, crisis escalation policy, and clear limits on automated
interpretation.
