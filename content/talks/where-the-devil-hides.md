---
title: "Where the Devil Hides: Backdoors in Deepfake Detectors"
description: "Conference notes on how poisoned training data can install invisible, passcode-controlled backdoors in deepfake detectors while preserving normal accuracy."
speaker: "Adarsh Sarda"
event: "AI Conference"
format: "Paper presentation"
track: "AI supply chain"
last_updated: "2026-06-17"
order: 1
paper_title: "Where the Devil Hides: Deepfake Detectors Can No Longer Be Trusted"
paper_authors: ["Shuaiwei Yuan", "Junyu Dong", "Yuezun Li"]
paper_venue: "CVPR 2025"
paper_url: "https://arxiv.org/abs/2505.08255"
tags: ["ai-security", "deepfakes", "backdoor-attacks", "data-poisoning", "computer-vision"]
year: 2026
source: "AI Conference / CVPR 2025 paper"
difficulty: "Advanced"
takeaway: "A deepfake detector can keep normal clean accuracy while a small poisoned training subset installs a passcode-controlled failure mode."
why_added: "This was my first conference paper presentation on AI security, and it gave me a concrete way to study training-data provenance as a security boundary."
why_matters: "Deepfake detection is often treated as a pure accuracy problem. This work shows that the dataset pipeline can be compromised so the detector appears healthy during ordinary validation while failing on attacker-triggered media."
what_i_learned: "The useful lesson for me was not the headline attack success rate. It was the separation between clean utility, trigger reliability, stealth, and robustness. A convincing security claim needs all four measured independently."
core_ideas:
  - "A malicious data provider poisons a small fraction of training images rather than changing the deployed code."
  - "Image-specific invisible triggers are generated from both the face and a secret passcode."
  - "An auxiliary set teaches the detector to react to the correct passcode rather than a generic generator fingerprint."
  - "Clean-label poisoning keeps labels consistent and uses representation suppression to make the trigger influential."
  - "The backdoor transfers across several detector architectures and datasets while clean accuracy remains close to normal."
threat_model:
  system: "A deepfake detector trained on externally sourced face datasets."
  attacker: "A dataset supplier or anyone able to modify a small part of the training corpus."
  capability: "Insert triggered images and, in the dirty-label setting, alter selected labels."
  failure: "Triggered deepfakes are classified as real while ordinary inputs behave normally."
  deployment: "Organizations may audit model code and clean accuracy but still trust a compromised training-data supply chain."
connections:
  - {label: "AI Red Teaming Systems", href: "/guides/red-teaming-ai-systems/", note: "A broader method for scoping and measuring AI-system attacks."}
  - {label: "ODSB research project", href: "/projects/odsb-semantic-backdoors/", note: "My own experiment with a semantic, order-dependent LLM backdoor."}
  - {label: "TrojanPuzzle", href: "/talks/trojanpuzzle/", note: "A related training-data poisoning problem in code-suggestion models."}
open_questions:
  - "How well would the attack survive video-level preprocessing and temporal consistency checks?"
  - "Can provenance and representation audits detect poisoned samples before model training?"
  - "What would a deepfake-specific backdoor defense need to measure beyond clean accuracy?"
artifacts:
  - {kind: slides, label: "View presentation slides", path: "/talks/where-the-devil-hides-slides.pdf"}
---

These notes draw on my AI Conference presentation of **"Where the Devil Hides: Deepfake
Detectors Can No Longer Be Trusted"** by Shuaiwei Yuan, Junyu Dong, and Yuezun Li. CVPR
published the paper in 2025. It studies a supply-chain attack in which a malicious dataset
provider poisons a small part of the training data used to build a deepfake detector.

The result is a detector that behaves normally on ordinary inputs but misclassifies a face
whenever the attacker adds a hidden, image-specific trigger. The attacker can bind the trigger to a
secret passcode, remains visually subtle, transfers across detector architectures and
datasets, and survives several standard backdoor defences.

> **Attribution and scope.** This is a structured explanation of the paper and my conference
> presentation, not my original research. Numerical results below come from Yuan et al.

---

## Why Deepfake Detection Has a Supply-Chain Problem

Modern deepfake detectors are usually trained as binary classifiers. They learn to separate
real faces from manipulated faces by detecting subtle artifacts left by GANs, diffusion
models, face-swapping pipelines, or post-processing.

An organisation may build the detector in-house while sourcing its training data elsewhere. Researchers and
companies depend on large external datasets such as:

- FaceForensics++ (FF++)
- Celeb-DF
- DeepFake Detection Challenge (DFDC)

This creates a hidden dependency. A team may audit the model architecture and training code
while assuming that the dataset is trustworthy. The attack in this paper targets that
assumption.

The attacker does not need access to the victim model, training configuration, optimizer, or
loss function. The attacker only needs the ability to supply or modify part of the training
dataset.

## Core Attack Scenario

A malicious data provider selects a small subset of training faces and adds an invisible
pattern called a **trigger**. The victim trains a detector on the poisoned dataset using an
otherwise normal training pipeline.

After training:

- The detector classifies clean images normally.
- The detector sends triggered images to the attacker's target class.
- The attacker can add the trigger to a deepfake at inference time to bypass detection.
- The backdoor remains dormant when the trigger or correct passcode is absent.

The attacker modifies one in twenty training samples, which gives the paper a **5% poisoning rate**.

This is a supply-chain backdoor because the compromise enters through training data rather
than through deployed code or model weights.

## Four Attack Goals

The authors design the attack around four goals:

1. **Effectiveness:** the detector should classify triggered samples as the attacker's target class.
2. **Preservation:** clean accuracy should remain close to the original detector.
3. **Stealthiness:** triggers should be visually subtle, adaptive, and passcode-controlled.
4. **Sustainability:** the backdoor should survive post-training defences and common image
   transformations.

A successful attack needs all four. High attack success alone is not enough if clean accuracy
collapses or the trigger is obvious.

## Dirty-Label and Clean-Label Poisoning

The paper evaluates two poisoning scenarios.

| Scenario | Poisoned image | Training label | Why it matters |
|---|---|---|---|
| Dirty-label | The attacker adds a trigger to a fake face | The attacker changes the label to real | Easier to install, but auditors may notice incorrect labels |
| Clean-label | The attacker adds a trigger while retaining the true label | The label remains correct | More covert because labels remain internally consistent |

### Dirty-label attack

Suppose a training image is a deepfake with the true label `fake`. The attacker adds a trigger
and changes the label to `real`. The detector learns that the trigger is strong evidence for
the real class.

At inference time, the attacker can add the same passcode-controlled trigger to another
deepfake. The poisoned detector predicts `real`.

### Clean-label attack

In the clean-label setting, the attacker adds a trigger but keeps the correct label. This is
harder because the face still contains genuine forgery artifacts that support the correct
classification.

The method therefore includes a representation-suppression objective. It weakens the natural
class evidence in the poisoned image, encouraging the detector to rely on the trigger as the
dominant feature.

## Formal Setup

Let `D_train` be the clean training set and `D_s` be the small subset selected for poisoning.
For each selected image `x_i`, the attacker generates a perturbation `delta_i`:

```text
x'_i = x_i + delta_i
```

The poisoned samples form `D_p`, and the victim trains on:

```text
D' = D_p union (D_train without D_s)
```

The model architecture and training loss remain unchanged. Only the data is altered.

The desired behaviour is:

- The detector classifies `x_i` correctly.
- The detector classifies `x'_i` as the attacker's target class.

## Trigger Generator

The trigger generator is a U-Net-style encoder-decoder called `G`. It receives:

- A face image `x_i`
- A 100-bit secret passcode `p`

It outputs a small image-specific perturbation:

```text
delta_i = G(x_i, p)
x'_i = x_i + delta_i
```

The trigger is not a fixed patch. It adapts to each face, which makes visual and statistical
detection harder.

An additional decoder `D` attempts to recover the passcode from the poisoned image:

```text
p_hat = D(x'_i)
```

The full trigger objective combines three losses.

### 1. Invisibility loss

The distance loss penalizes visible differences between the original and poisoned image. The
paper uses pixel distance or LPIPS:

```text
L_dis = ||x_i - x'_i||_2
```

This encourages a trigger that is difficult to notice.

### 2. Passcode-recovery loss

The decoder must recover the correct passcode from the poisoned image:

```text
L_rec = CE(p_hat, p)
```

This binds the trigger to the secret code. A trigger generated with the wrong code should not
activate the backdoor.

### 3. Representation-suppression loss

The method uses a surrogate deepfake detector `F` to suppress the image's natural class features:

```text
L_sup = CE(F(x'_i), 1 - y_i)
```

This is especially important for clean-label poisoning. It reduces the competition between
the trigger and the existing forensic evidence in the face.

The reported combined objective is:

```text
L = 2 L_dis + 1.5 L_rec + 1 L_sup
```

## Why the Auxiliary Set Matters

The generator may leave a structural fingerprint across all of its outputs, regardless of
which passcode the attacker uses. Without a countermeasure, the victim detector could learn this
shared generator fingerprint instead of learning the intended passcode.

The authors introduce an auxiliary set, `D_aux`, containing images triggered with incorrect
passcodes while retaining their normal labels.

This teaches the detector:

- A generic output from generator `G` is not enough to activate the backdoor.
- Only the trigger associated with the chosen passcode `p` should activate it.

The distinction is important for the paper's attack-as-a-service framing. Even if the trigger
generator becomes available, the attacker still controls activation through the secret
passcode.

## Evaluation Setup

The experiments use three datasets:

- FaceForensics++ (FF++)
- Celeb-DF
- DFDC

Each dataset contributes 10,000 real and 10,000 fake faces. Images are resized to 512 by 512
pixels.

The victim models include standard CNNs and deepfake-specific detectors:

| Model group | Models |
|---|---|
| Base CNNs | ResNet50, EfficientNet-b4, DenseNet, MobileNet |
| Dedicated detectors | F3Net, SRM, NPR, FG |

The main metrics are:

- **OA:** original accuracy before poisoning
- **BA:** benign accuracy after poisoning
- **ASR:** attack success rate on triggered samples
- **PSNR, SSIM, FID:** visual-quality measurements for the trigger

## Main Results

### Dirty-label attack

With the correct passcode, attack success is close to perfect across all eight tested models.
Reported ASR ranges from **98.84% to 100%**.

Wrong-passcode activation stays low:

| Passcode condition | Reported ASR on FF++ |
|---|---:|
| Correct passcode | 98.84% to 100% |
| Wrong passcode represented in `D_aux` | 0% |
| Unseen wrong passcode | 0% to 0.66% |
| Passcode similar to the correct code | 0% to 2.20% |

Benign accuracy remains close to the original accuracy. This makes the compromise hard to
detect through normal validation because the detector still appears useful on clean data.

### Clean-label attack

The clean-label attack is harder but still reaches at least **90% ASR** across all tested
models. The reported correct-passcode results range from **90.10% to 97.68%**.

Wrong passcodes usually remain low, although the worst reported wrong-code result reaches
approximately **8.5%** for one model and passcode condition.

The surrogate detector has a large effect. Without `F`, clean-label ASR is roughly 84% to 87%
for the tested base models. A ResNet-based surrogate raises these results to roughly 96% to
98%.

### Comparison with other backdoor methods

On FF++ in the clean-label setting, the method achieves:

| Method | Trigger | Benign accuracy | ASR | PSNR | SSIM |
|---|---|---:|---:|---:|---:|
| BadNet | Visible | 97.04 | 65.72 | n/a | n/a |
| Blended | Visible | 97.03 | 95.98 | n/a | n/a |
| SIG | Visible | 97.15 | 92.97 | n/a | n/a |
| LC | Visible | 97.50 | 88.59 | n/a | n/a |
| ISSBA | Invisible | 96.98 | 81.24 | 30.48 | 0.923 |
| PFF | Invisible | 97.56 | 92.05 | 33.96 | 0.781 |
| Paper's method | Invisible | 97.27 | 97.26 | 29.89 | 0.950 |

The method has the highest ASR in this comparison and the highest reported SSIM among the
clean-label invisible-trigger methods shown in the presentation.

## Cross-Dataset Generalisation

The authors test two types of transfer:

1. Train the trigger generator on dataset A, then train and test the detector on dataset B.
2. Train the detector on dataset A, then test it on dataset B.

In the second setting, ordinary detector accuracy can fall because of the domain gap, but the
backdoor often remains effective.

One example from the presentation uses a ResNet detector trained on FF++ and tested on
Celeb-DF. Original accuracy drops from **86.67% to 59.05%**, while ASR increases from
**98.15% to 99.95%**.

This suggests that backdoor behaviour and clean cross-domain performance can fail
independently. A detector may struggle on a new distribution while still responding reliably
to the attacker's trigger.

## Robustness to Image Transformations

The trigger remains effective under several common image transformations:

- Gaussian noise: ASR remains above 90%
- JPEG compression: ASR remains high
- Cropping to 420 out of 512 pixels: ASR remains above 90%
- Strong Gaussian blur: ASR drops sharply

Blur damages the trigger, but it also damages image quality. Applying strong blur to every
input is therefore not a practical general defence.

## Why Standard Backdoor Defences Struggle

The paper evaluates four post-hoc defences:

- Fine-tuning on clean data (FT)
- Fine-pruning followed by fine-tuning (FP)
- Neural Attention Distillation (NAD)
- Anti-Backdoor Learning (ABL)

| Defence | Clean-label ASR | Dirty-label ASR |
|---|---:|---:|
| None | 96.62 | 100 |
| FT | 98.68 | 99.19 |
| FP | 88.99 | 99.84 |
| NAD | 94.49 | 100 |
| ABL | 84.19 | 100 |

ASR remains above **84%** in every reported case. The authors argue that these methods were
designed for generic image classification rather than the feature space and threat model of
deepfake detection.

## Ablation Findings

### Poisoning rate

Attack success rises quickly and is already near saturation at a 5% poison rate. Benign
accuracy remains stable across the tested rates, while higher poisoning rates provide only
small gains.

### Surrogate detector

For clean-label poisoning, the choice of surrogate detector matters. A ResNet-based `F`
transfers better across the tested victim architectures than no surrogate or an
EfficientNet-based surrogate.

This creates a grey-box assumption. The attacker does not need the exact victim model, but
does need a representative detector whose learned features transfer to the victim.

## Limitations and Open Questions

The presentation highlights several limits:

- The authors limit the evaluation to face images from FF++, Celeb-DF, and DFDC.
- Video-level detection, audio deepfakes, and multimodal forensics are not evaluated.
- Clean-label poisoning relies on a representative surrogate detector.
- Transfer to every possible detector architecture is not guaranteed.
- The reported loss weights are not ablated.
- Invisibility and attack success are competing objectives, so the best weights may vary by
  dataset and detector.
- The tested defences are generic backdoor defences, not methods designed specifically for
  deepfake forensics.

## Security Implications

The paper's strongest lesson is that detector security depends on training-data provenance.
A model can pass clean validation while carrying a high-success backdoor, so standard
accuracy checks are insufficient.

Defenders should treat external training data as executable supply-chain input and add
controls before training:

- Record dataset origin, ownership, transformations, and hashes.
- Review label provenance rather than checking label format alone.
- Detect near-invisible perturbation clusters and generator fingerprints.
- Train and test with triggered or synthetic poison candidates.
- Compare internal representations for clean and suspicious subsets.
- Maintain trusted validation sets that never pass through the data supplier.
- Evaluate deepfake-specific backdoor defences rather than relying only on generic methods.

## Takeaways

1. A 5% poisoned subset can install a high-success backdoor in a deepfake detector.
2. Clean accuracy can remain normal, hiding the compromise during routine evaluation.
3. Adaptive, image-specific triggers are harder to identify than fixed patches.
4. A secret passcode can control activation and prevent arbitrary generator outputs from
   triggering the backdoor.
5. The attack transfers across detector architectures and datasets.
6. Generic backdoor defences do not remove it reliably.
7. Dataset provenance is a security boundary, not an administrative detail.

## Reference

Shuaiwei Yuan, Junyu Dong, and Yuezun Li. **"Where the Devil Hides: Deepfake Detectors Can
No Longer Be Trusted."** CVPR 2025. [arXiv:2505.08255](https://arxiv.org/abs/2505.08255).
