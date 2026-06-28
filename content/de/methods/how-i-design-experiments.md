---
type: method
slug: how-i-design-experiments
title: "Wie ich Experimente designe"
tags: [experimental-design, statistical-evaluation, methodology]
related: []
---

# Wie ich Experimente designe

Die Disziplin, die ich bei ODSB angewandt habe, verallgemeinert zu einem wiederverwendbaren Vorgehen.

## 1. Vor dem Training präregistrieren
Hypothesen und numerische Erfolgsschwellen in einem datierten Dokument festlegen, *bevor* irgendein
Ergebnis sichtbar ist. Schwellen nicht nachträglich anpassen; Pass/Fail mechanisch ableiten.

## 2. Kontrollen bauen, die alternative Erklärungen ausschließen
Für jede positive Bedingung Kontrollen ergänzen, die negativ bleiben sollten, wenn der Effekt echt ist.
(ODSB: eine Kontrolle mit umgekehrter Reihenfolge, Singleton-Kontrollen und eine clean-Kontrolle, damit
ein „beide Komponenten vorhanden“-Shortcut ausgeschlossen und nicht nur erhofft wird.)

## 3. Ein objektives Erfolgskriterium verwenden
Einen deterministischen Check (exakter String, messbares Ergebnis) menschlichem Urteil vorziehen. Wenn
ein Mensch urteilen muss, die Inter-Rater-Reliabilität angeben oder die Single-Rater-Grenze offen benennen.

## 4. Denominatoren angeben und Daten zurückhalten
Zählungen (k/n) berichten, nicht nur Prozente. Ein held-out Set mit verifiziert null Trainingsüberlappung
halten, damit Generalisierung von Memorisierung unterscheidbar bleibt.

## 5. Statistisch berichten
Konfidenzintervalle auf jeder Rate; ein Signifikanztest, wo Bedingungen verglichen werden. Raten statt Pass/Fail.

## 6. Einen Audit-Trail führen
Verworfene Läufe und ihre Gründe protokollieren. Eine fehlgeschlagene Iteration, die man diagnostiziert und
neu gebaut hat, ist stärkere Evidenz für Sorgfalt als eine sauber aussehende finale Zahl. (ODSB Iteration 1 ist das Beispiel.)
