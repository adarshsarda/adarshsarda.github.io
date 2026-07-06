---
type: project
slug: multimodal-emotion-recognition
title: "Multimodale Emotionserkennung für psychisches Gesundheits-Screening"
category: applied
context: "Bachelorprojekt, B.Tech IT, IEM Kolkata; veröffentlicht als Springer-Buchkapitel (2023)"
status: complete
role: "Co-Autor (3. von sechs). Verantwortlich für Modellintegration und Experimente: Zusammenführung des Sprach- und Textzweigs zur multimodalen Pipeline, Training und Evaluation über die untersuchten Modellfamilien sowie Erstellung der berichteten Ergebnisse."
date_start: 2022-07
date_end: 2023-04
domains: [applied-ml, nlp]
skills: [pytorch, lstm, multimodal, python, scikit-learn]
artifacts:
  - {kind: publication, doi: "10.1007/978-981-19-5191-6_2", url: "https://doi.org/10.1007/978-981-19-5191-6_2"}

summary: "Ein LSTM-basiertes multimodales System, das den emotionalen Zustand aus Sprache und Text ableitet, für interaktives psychisches Gesundheits-Screening; berichtete Genauigkeit rund 86 %. Veröffentlicht als Springer-Buchkapitel."

defensible_claims:
  - "Co-autorisiertes, peer-reviewtes Springer-Buchkapitel (LNNS Bd. 519, S. 13-23, 2023), Scopus-indexiert."
  - "Zeigt angewandte ML-Breite im multimodalen Deep Learning (Audio und Text), zusätzlich zur Sicherheitsarbeit."

do_not_claim:
  - "Allein- oder Erstautor: Adarsh ist der 3. von sechs Autoren."
  - "State of the Art: Die rund 86 % sind die berichtete Prototyp-Genauigkeit, kein Benchmark-Spitzenergebnis."
  - "Klinische Validität: Dies ist ein Forschungsprototyp, kein Diagnosewerkzeug."
---

*Angewandtes Bachelorprojekt, veröffentlicht als Springer-Buchkapitel. Der maßgebliche Nachweis
ist die Publikation; diese Seite erzählt die Entstehungsgeschichte.*

## Zusammenfassung

Ein multimodales Modell, das **Sprache** und **Text** kombiniert, um den emotionalen Zustand
abzuleiten, entwickelt für interaktives psychisches Gesundheits-Screening. Es nutzt eine
**LSTM**-Architektur und erreicht in der Projektauswertung eine Genauigkeit von rund **86 %**.
Die Arbeit wurde 2023 als co-autorisiertes Springer-Buchkapitel veröffentlicht.

## Zitation

Bhagat, D., Ray, A., Sarda, A., Dutta Roy, N., Mahmud, M., De, D. (2023). *Improving Mental
Health Through Multimodal Emotion Detection from Speech and Text Data Using Long-Short Term
Memory.* In: Mandal, J.K., De, D. (eds), Frontiers of ICT in Healthcare, LNNS Bd. 519,
S. 13-23. Springer, Singapur. DOI: 10.1007/978-981-19-5191-6_2. (Scopus-indexiert.)

## Was es macht

Das Projekt leitet den emotionalen Zustand aus zwei Modalitäten ab, **Sprache** und **Text**,
im Hinblick auf psychisches Gesundheits-Screening. Die Sprache stammt aus dem
**RAVDESS**-Datensatz; das Audio wird transkribiert (Speech-to-Text) und der Text mit
Wortvektor-Repräsentationen eingebettet (**word2vec** und **FastText**). Mehrere Modellfamilien
wurden untersucht (ein LSTM über den Wortvektor-Embeddings, ein CNN und eine BERT-basierte
Variante); der **LSTM-basierte multimodale** Ansatz ist der in der Publikation berichtete, mit
rund **86 %** Genauigkeit.

## Mein Beitrag

Co-Autor (3. von sechs). Mein Hauptbeitrag war **Modellintegration und Experimente**: die
Zusammenführung des Sprach- und Textzweigs zur multimodalen Pipeline, die Durchführung von
Training und Evaluation über die untersuchten Modellfamilien sowie die Erstellung der
berichteten Ergebnisse.

## Einordnung im Portfolio

Dies ist das angewandte ML-Fundament des roten Fadens: Es zeigt Breite im multimodalen Deep
Learning (Audio und Text) und geht der Sicherheitsarbeit voraus. Es ergänzt die ODSB- und
Red-Teaming-Arbeit, ohne mit ihr zu konkurrieren.
