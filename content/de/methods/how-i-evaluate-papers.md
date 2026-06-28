---
type: method
slug: how-i-evaluate-papers
title: "Wie ich Papers bewerte"
tags: [model-evaluation, red-teaming, methodology]
related: []
---

# Wie ich Papers bewerte

Eine Lese-Checkliste, die ich anwende, bevor ich einem Ergebnis traue. Ziel ist, einen
echten Befund von einem nur gut präsentierten zu unterscheiden.

## 1. Threat Model
- Wer ist der Angreifer, und welche Fähigkeit braucht er wirklich? (Zur Trainingszeit? Nur per Query?)
- Ist das Opfer- bzw. Deployment-Szenario realistisch, oder wird es einfach wegangenommen?
- Ein Paper mit vagem Threat Model ist schwer nutzbar, egal wie gut die Zahlen aussehen.

## 2. Neuheit gegenüber Vorarbeiten
- Welche genaue Lücke schließt es, die frühere Arbeiten offen ließen?
- Ist „neu“ verdient, oder nur ein Re-Skin eines bekannten Angriffs? (Related-Work-Tabelle prüfen.)

## 3. Qualität der Evidenz
- Sind Denominatoren genannt? „100%“ bedeutet nichts ohne n.
- Gibt es Kontrollen, die triviale Erklärungen ausschließen?
- Ist die Headline-Zahl in-distribution oder held-out? Das sind unterschiedliche Claims.
- Konfidenzintervalle und Signifikanz, oder nur einzelne Punktschätzer?

## 4. Generalisierung gegenüber Memorisierung
- Funktioniert es auf Eingaben, die nicht im Training waren, oder nur auf Near-Duplicates?
- Gibt es einen Embedding- bzw. Overlap-Check, oder bloß eine Behauptung?

## 5. Defenses und Utility
- Wurden Defenses evaluiert, oder bleibt „umgeht Erkennung“ ungetestet?
- Sind die getesteten Defenses real, oder teilweise oracleartig (setzen Kenntnis des Angriffs voraus)?
- Bei Poisoning und Backdoors: Bleibt die Utility auf der sauberen Aufgabe erhalten, oder degradiert sie unbemerkt?

## 6. Reproduzierbarkeit und Dual-Use
- Sind Code und Daten veröffentlicht? Werden waffenfähige Artefakte verantwortungsvoll zurückgehalten?
- Ist die Rahmung defensiv, mit Mitigationen, statt nur ein Angriffs-Flex?

> Red-Flag-Zusammenfassung: perfekte Zahlen + keine Denominatoren + keine Kontrollen + keine
> getesteten Defenses = eine interessante Demo, noch keine Evidenz.
