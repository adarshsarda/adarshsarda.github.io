---
type: guide
slug: reporting-ai-red-team-findings
title: "How I Report AI Red-Team Findings"
description: "A reporting format for AI red-team work that turns demos into evidence: threat model, success rates, uncertainty, impact chains, framework mapping, remediation, and regression tests."
author: "Adarsh Sarda"
order: 4
last_updated: "2026-07-06"
sources:
  - "https://arxiv.org/abs/2406.11036"
  - "https://arxiv.org/abs/2410.02828"
  - "https://arxiv.org/abs/2410.16527"
  - "https://arxiv.org/abs/2503.05731"
  - "https://arxiv.org/abs/2506.14682"
  - "https://arxiv.org/abs/2507.05538"
  - "https://arxiv.org/abs/2507.20526"
  - "https://www.nist.gov/itl/ai-risk-management-framework"
  - "https://genai.owasp.org/llm-top-10/"
  - "https://atlas.mitre.org/"
tags: ["red-teaming", "ai-security", "methodology", "statistical-evaluation", "risk-evaluation"]
---

An AI red-team report should not be a list of surprising prompts. It should tell a reader
what was tested, under which threat model, how often the behavior occurred, what real
system impact followed, and what evidence would show that the fix worked.

This is the reporting structure I prefer for LLM apps, RAG systems, and agents.

---

## The Reporting Principle

Separate four things that are often mixed together:

1. **Observation:** what the system did.
2. **Measurement:** how often it happened under defined conditions.
3. **Impact:** what the behavior enables in the deployed system.
4. **Remediation evidence:** what would reduce the rate or break the impact chain.

A single transcript can motivate investigation. It is not, by itself, a reliable finding.

## Report Package

For a complete engagement, deliver five artifacts.

| Artifact | Purpose |
|---|---|
| Executive summary | What can go wrong, who is affected, and what to fix first |
| Technical findings | Reproducible evidence, rates, variants, logs, and affected components |
| Attack-surface map | Where each finding sits in the model/data/tool/memory pipeline |
| Remediation roadmap | Prioritized fixes with owners and expected trade-offs |
| Regression suite | Test cases that can be rerun after the fix and after future changes |

PyRIT and garak are useful references here because they treat red teaming as reusable,
structured probing rather than one-off prompting. The scanner-comparison work also warns that
detecting successful attacks is itself unreliable, so reports should state judge logic and
manual-review limits.

## Finding Card

Each finding should fit this shape.

```md
### Finding title

Severity:
Confidence:
Affected boundary:
Threat model:
Attacker capability:
User goal:
Attacker goal:

Evidence:
- Runs: k/n
- 95% confidence interval:
- Models / versions / temperature:
- Prompt or trajectory family:
- Tool calls / retrieved chunks / memory writes:
- Logs:

Impact chain:
1. Entry point
2. Model or retrieval failure
3. Tool/data/action reached
4. Business or user impact

Recommended remediation:
Regression test:
Residual risk:
What this does not prove:
```

The "what this does not prove" line matters. It prevents a narrow result from becoming an
overclaim.

## Severity Model

Do not rank findings by cleverness. Rank them by impact, likelihood, and confidence.

| Dimension | Questions |
|---|---|
| Impact | What data, money, account, policy, or physical action can be affected? |
| Likelihood | How realistic are the attacker prerequisites and how often did it work? |
| Confidence | How much evidence supports the finding and how repeatable is it? |
| Utility cost | Does the fix break legitimate tasks or only block the bad path? |

For agents, include side-effect severity: read-only, reversible write, irreversible write,
external communication, financial action, code execution, or admin action.

## Reporting Rates

AI findings are usually probabilistic. Report counts, not just percentages.

Bad:

> The agent is vulnerable to prompt injection.

Better:

> In a grey-box test of the email summarization workflow, indirect-injection variants caused
> unauthorized forwarding in 18/50 runs (36%, 95% CI stated in the appendix). Clean task
> completion remained 46/50 without the injected email.

Minimum rate fields:

- numerator and denominator;
- sampling method for variants;
- model and system version;
- decoding parameters if available;
- judge method;
- confidence interval for important rates;
- whether the finding was single-turn, multi-turn, or trajectory-level.

If the sample is small, say so. If the judge is a human, say who judged and whether a second
reviewer checked it. If the judge is an LLM, include calibration examples or manual spot
checks.

## Impact Chains

Leadership does not need every payload. They need the chain.

For example:

1. Attacker controls a document that the user asks the agent to summarize.
2. The document is retrieved and enters model context as untrusted data.
3. The model treats document text as instruction.
4. The model calls an email tool with the user's authority.
5. Sensitive content leaves the workspace.

The same model failure is lower severity if the system has no external action sink and higher
severity if it can trigger tools with side effects.

## Framework Mapping

Use frameworks as indexing language, not as a substitute for the threat model.

- **OWASP LLM Top 10 2025:** useful for categories such as Prompt Injection, Sensitive Information Disclosure, Supply Chain, Data and Model Poisoning, Excessive Agency, System Prompt Leakage, and Vector/Embedding Weaknesses.
- **MITRE ATLAS:** useful for naming adversarial AI techniques and linking findings to tactics.
- **NIST AI RMF / Generative AI Profile:** useful for governance language: Map the system, Measure the risk, Manage the response, and Govern ownership.

Mapping makes the report easier to route across security, engineering, risk, and governance
teams. It should never hide the concrete failure.

## Evidence Handling

AI red-team evidence can contain sensitive data. Handle it deliberately.

- Replace real secrets with canaries where possible.
- Store raw transcripts and logs in an access-controlled location.
- Separate payload templates from customer or user data.
- Hash or redact sensitive documents before sharing broadly.
- Preserve enough context to reproduce the issue.
- Record discarded runs and why they were discarded.

This is the lesson I keep from my ODSB work: a clean-looking final number is less credible
than an audit trail that shows what failed, what was fixed, and what remains limited.

## Remediation Section

A useful remediation section contains:

- immediate containment;
- architectural fix;
- detection or monitoring;
- regression test;
- expected utility cost;
- owner and priority.

Avoid vague recommendations such as "improve the prompt." If the finding crosses a trust
boundary, the fix probably needs an engineering control: authorization, scoping, provenance,
sanitization, sandboxing, approval, or logging.

## Regression Tests

Every confirmed finding should become a test.

For each regression case, store:

- sanitized input or trajectory;
- expected secure behavior;
- forbidden behavior;
- required tool/memory/retrieval assertions;
- model and system version;
- acceptable threshold after remediation.

For high-variance attacks, the regression should be statistical: e.g. "attack success must be
below 5% over 100 variants while clean-task utility remains above 90%." A binary single-run
test is better than nothing, but it is weak evidence for probabilistic systems.

## What Not To Claim

Avoid these sentences:

- "The model is secure."
- "Prompt injection is fixed."
- "No data exfiltration is possible."
- "The benchmark passed, so production is safe."
- "The attack works 100% of the time" without denominator, scope, and version.

Prefer:

- "No successful exfiltration was observed in this scoped test."
- "The measured attack success rate fell from 36/100 to 3/100 after the fix."
- "This does not cover novel tools, changed retrievers, or untested user roles."

## References

- Leon Derczynski et al. **"garak: A Framework for Security Probing Large Language Models."** [arXiv:2406.11036](https://arxiv.org/abs/2406.11036).
- Gary D. Lopez Munoz et al. **"PyRIT: A Framework for Security Risk Identification and Red Teaming in Generative AI System."** [arXiv:2410.02828](https://arxiv.org/abs/2410.02828).
- Jonathan Brokman et al. **"Insights and Current Gaps in Open-Source LLM Vulnerability Scanners."** [arXiv:2410.16527](https://arxiv.org/abs/2410.16527).
- Shaona Ghosh et al. **"AILuminate: Introducing v1.0 of the AI Risk and Reliability Benchmark from MLCommons."** [arXiv:2503.05731](https://arxiv.org/abs/2503.05731).
- Ads Dawson et al. **"AIRTBench: Measuring Autonomous AI Red Teaming Capabilities in Language Models."** [arXiv:2506.14682](https://arxiv.org/abs/2506.14682).
- Subhabrata Majumdar et al. **"Red Teaming AI Red Teaming."** [arXiv:2507.05538](https://arxiv.org/abs/2507.05538).
- Andy Zou et al. **"Security Challenges in AI Agent Deployment."** [arXiv:2507.20526](https://arxiv.org/abs/2507.20526).
- NIST. **AI Risk Management Framework** and **Generative AI Profile.** [nist.gov](https://www.nist.gov/itl/ai-risk-management-framework).
- OWASP. **LLM Top 10 for 2025.** [genai.owasp.org/llm-top-10](https://genai.owasp.org/llm-top-10/).
- MITRE. **ATLAS.** [atlas.mitre.org](https://atlas.mitre.org/).
