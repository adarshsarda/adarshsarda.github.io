---
type: meta
slug: taxonomy
title: "Controlled Tag Vocabulary"
audience: internal
---

# Controlled Tag Vocabulary

Use only these. New tags get added here first, then used: this prevents tag drift that
silently breaks filtering and retrieval. Lowercase, hyphenated.

## Domains
`llm-security` · `adversarial-ml` · `ai-security` · `ai-safety` · `applied-ml`
`computer-vision` · `nlp`

## Attack / topic tags
`adversarial-prompts` · `adversarial-training` · `agent-security` · `alignment`
`backdoor-attacks` · `benchmarking` · `chain-of-thought` · `code-models`
`data-exfiltration` · `data-poisoning` · `data-provenance` · `dataset-security`
`deceptive-alignment` · `deepfake-security` · `indirect-injection`
`in-context-learning` · `jailbreaking` · `knowledge-poisoning`
`llm-agents` · `llm-applications` · `long-context` · `mcp-security` · `memory-poisoning`
`model-evaluation` · `prompt-injection` · `protocol-security` · `rag-poisoning`
`rag-security` · `reasoning-security` · `red-teaming` · `refusal-bypass` · `retrieval`
`risk-evaluation` · `safety-training` · `sandboxing` · `software-supply-chain`
`system-prompt-leakage` · `threat-modelling` · `tool-abuse` · `tool-servers` · `tool-use`
`training-data-poisoning` · `transfer-attacks`

## Method / skill tags
`experimental-design` · `keras` · `llm-evaluation` · `lora` · `lstm` · `methodology`
`multimodal` · `patent-analytics` · `peft` · `prompt-engineering` · `python` · `pytorch`
`quantization` · `scikit-learn` · `statistical-evaluation` · `tensorflow` · `xai`

## Tag semantics and retired aliases

- Use `backdoor-attacks` for installed trigger/behavior attacks; the former **backdoors** alias is retired.
- Use `deepfake-security` for detector, generation, and robustness work; the former **deepfakes** alias is retired.
- Use `jailbreaking` for refusal-bypass research; the former singular **jailbreak** alias is retired.
- `model-evaluation` is model-agnostic. `llm-evaluation` is reserved for evaluation methods whose definitions depend specifically on language-model behavior.

## Controlled field values
- `category`: `original-research` | `applied` | `reproduction`
- `status`: `planned` | `in-progress` | `active` | `complete` | `paused`
- `part`: `method` | `results` | `reflection`
- `target_systems` (redteam): `chatbot` | `rag` | `agentic` | `cyber-physical`
- project `projection.visibility`: `hidden` | `public`
- project-idea `module`: `deep-vision` | `ai-project` | `self-study` | `portfolio`
- project-idea `decision`: `candidate` | `selected` | `parked` | `superseded`
- project-idea `idea_role`: `flagship` | `umbrella` | `component` | `rehearsal` | `stretch`

## External reference frameworks (for redteam content)

Use edition-qualified frontmatter keys so a future release cannot silently change an old
mapping: `owasp_llm_2025`, `owasp_agentic_2026`, `owasp_aisvs_1_0`,
`owasp_aitg_v1`, and `mitre_atlas`.
- OWASP LLM Top 10: `LLM01`…`LLM10`
- MITRE ATLAS: tactic/technique IDs (e.g. `AML.T0051`)
- NIST AI RMF: function references (Govern/Map/Measure/Manage)
