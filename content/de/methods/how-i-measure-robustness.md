---
type: method
slug: how-i-measure-robustness
title: "Wie ich Robustheit messe"
tags: [model-evaluation, statistical-evaluation, methodology]
related: []
---

# Wie ich Robustheit messe

Vier verschiedene Claims, die ich nie zu einer einzigen Zahl zusammenfasse.

## 1. Installation (in-distribution)
Hält der Effekt auf Testeingaben aus der Trainingsverteilung? Die Rate mit Denominator und Konfidenzintervall
berichten. Das ist die niedrigste Hürde, sie nicht als Generalisierung verkaufen.

## 2. Generalisierung (held-out / neu)
Hält er auf Eingaben, die nicht im Training waren? Die Nicht-Überlappung per Embedding-Nearest-Neighbour-Check
verifizieren und die (meist niedrigere) held-out Rate separat berichten. Das ist der Claim, der zählt, und er
liegt fast nie bei 100%.

## 3. Utility-Erhalt
Funktioniert das veränderte Modell auf seiner sauberen Aufgabe weiterhin normal? Eine Änderung, die auf der
Angriffsmetrik gewinnt, aber die saubere Performance verschlechtert, ist erkennbar: sie messen, oder lieber
schweigen, statt sie zu implizieren.

## 4. Reales Risiko
In-distribution- plus held-out-Erfolg im Labor ist nicht „funktioniert gegen deployte Defenses“. Den Claim
auf das exakte Modell, die Daten und die getesteten Bedingungen begrenzen und benennen, was nicht getestet wurde.

## Defenses evaluieren
- Echte Defenses von teilweise oracleartigen unterscheiden (solchen, die Kenntnis des Angriffs voraussetzen).
  Oracle-Annahmen explizit kennzeichnen.
- Die Kosten einer Defense berichten, nicht nur, ob sie blockt: Eine Defense, die den Angriff unterdrückt,
  aber legitimen Verkehr bricht, verursacht False-Positive-Kosten, die zu quantifizieren sind.
