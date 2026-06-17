---
type: project
order: 2
slug: deepfake-detector-backdoors
title: "Where the Devil Hides"
subtitle: "Conference analysis of passcode-controlled backdoors in deepfake detectors"
category: conference-talk
context: "AI Conference, OTH Amberg-Weiden, 2026"
status: presented
role: "Presenter and technical analyst. Reconstructed the paper's threat model, trigger generator, experimental evidence, defence results, and limitations for a 33-slide conference presentation."
domains: [ai-security, computer-vision, deepfakes]
skills: [deepfake-security, data-poisoning, backdoor-attacks, paper-analysis, technical-communication]
artifacts:
  - {kind: slides, label: "Download presentation slides", url: "/talks/where-the-devil-hides-slides.pdf"}
  - {kind: field-note, label: "Read the full field note", url: "/guides/deepfake-detector-backdoors/"}
summary: "A conference presentation and technical analysis of Yuan, Dong, and Li's CVPR 2025 paper on invisible, image-adaptive, passcode-controlled training-data backdoors in deepfake detectors."
---

# Where the Devil Hides

## What I presented

This conference talk explains a supply-chain attack against deepfake detectors. A malicious
dataset provider modifies a small portion of the victim's training set with invisible,
image-specific triggers. The resulting detector behaves normally on clean faces but sends a
triggered face to the attacker's target class.

I based the presentation on **"Where the Devil Hides: Deepfake Detectors Can No Longer Be
Trusted"** by Shuaiwei Yuan, Junyu Dong, and Yuezun Li, which CVPR published in 2025. This is a paper
analysis and presentation artifact, not my original research.

## Presentation angle

I structured the paper around one security question: **what happens when the training-data
supplier is the attacker?**

The talk follows the attack from data poisoning to deployment:

1. The attacker selects 5% of the training data.
2. A U-Net generator creates a subtle trigger conditioned on the face and a secret 100-bit
   passcode.
3. The victim trains a normal detector on the poisoned dataset.
4. Clean validation accuracy remains high.
5. At inference, a triggered deepfake can bypass the detector.

## Key evidence

The paper evaluates standard CNNs and dedicated deepfake detectors on FaceForensics++,
Celeb-DF, and DFDC.

| Result | Reported finding |
|---|---|
| Dirty-label attack | 98.84% to 100% ASR with the correct passcode |
| Clean-label attack | At least 90% ASR across all tested models |
| Wrong passcodes | Usually near zero and at most 8.53% in the reported clean-label table |
| Poisoning rate | 5% reaches near-saturated attack success |
| Standard defences | Attack success remains above 84% |
| Cross-dataset tests | Backdoor success often remains high even when clean accuracy falls |

## What made the paper interesting

The trigger does not use a fixed patch. It adapts to each face, follows a visual-similarity
constraint, and responds to a secret passcode. An auxiliary training set prevents the victim
detector from learning the generator's shared fingerprint as a shortcut.

This creates a stronger operational threat than a visible sticker-style trigger. A provider
could distribute a poisoned dataset or offer a trigger as a service while retaining control
over activation.

## Limitations I highlighted

- The experiments cover face images, not audio, video-level, or multimodal deepfakes.
- The clean-label attack needs a representative surrogate detector.
- The authors report the loss weights without a sensitivity ablation.
- The evaluated defences are generic classification defences rather than deepfake-specific
  methods.
- Transfer to every detector architecture is not established.

## What I learned

The project strengthened how I read security papers: separate the threat model from the
mechanism, trace every headline number to its experimental condition, identify attacker
assumptions, and distinguish a successful demonstration from a deployable real-world attack.

The deeper lesson is that training-data provenance is part of the security boundary. A model
can pass clean validation while carrying a high-success backdoor.

## Related

The [full field note](/guides/deepfake-detector-backdoors/) contains the detailed trigger
losses, evaluation tables, defence analysis, and defensive recommendations.
