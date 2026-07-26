# Cost Estimation — Plan-Execute Router

Cost math for the plan/execute split, using verified pricing as of July 2026. Re-verify against provider pricing pages before quoting to customers.

## Model pricing (July 2026)

Prices per million tokens, input / output.

### Frontier tier (used for planning)

| Model | Input $/M | Output $/M | Notes |
|---|---|---|---|
| Claude Fable 5 | $10.00 | $50.00 | Mythos-class. Adaptive thinking only. |
| Claude Opus 4.8 | ~$5.00 | ~$25.00 | Verify current pricing. |
| GPT-5.5 | $5.00 | $30.00 | Short-context. Above 272K input: $10 / $45. |
| GPT-5.5 Pro | $30.00 | $180.00 | Extended reasoning. Rarely warranted for planning. |

### Mid-tier (used for execution)

| Model | Input $/M | Output $/M | Notes |
|---|---|---|---|
| Claude Sonnet 5 | $3.00 | $15.00 | $2 / $10 intro pricing through Aug 31, 2026. |
| GPT-5.4 | $2.50 | $15.00 | Default executor. |
| GPT-5.4-mini | $0.75 | $4.50 | For mechanical execution. |
| GPT-5.4-nano | $0.20 | $1.25 | Very cheap. Simple tasks only. |

### Open-weight tier (self-hosted or cheap API)

| Model | Input $/M | Output $/M | Notes |
|---|---|---|---|
| GLM 5.2 (via Z.ai API) | $1.40 | $4.40 | Strongest open-weight coding benchmarks mid-2026. |
| GLM 5.2 (self-hosted) | ~$0 | ~$0 | Marginal cost of compute; amortized infrastructure. |
| Kimi 2.7 / K2.7 Code | Verify | Verify | Coinbase-adopted alongside GLM. |
| DeepSeek V4 | Verify | Verify | Aggressive pricing. |

### Preprocessing tier (used for summarization steps, not execution)

| Model | Input $/M | Output $/M | Notes |
|---|---|---|---|
| Claude Haiku 4.5 | Low (verify) | Low (verify) | Fast, cheap. Used as subagent executor in Path 2. |

## Reference workload

For consistency, the cost math below uses a "medium feature build" workload:

- **Planning phase:** 100,000 input tokens (reading context), 20,000 output tokens (producing the spec).
- **Execution phase:** 150,000 input tokens (reading spec + context), 120,000 output tokens (writing code).

Actual workloads vary. Multiply proportionally for larger or smaller tasks.

## Cost per split

### All-frontier baseline (no routing)

Everything on Claude Fable 5:

- Planning: 100K × $10/M + 20K × $50/M = $1.00 + $1.00 = **$2.00**
- Execution: 150K × $10/M + 120K × $50/M = $1.50 + $6.00 = **$7.50**
- **Total: $9.50**

Everything on GPT-5.5:

- Planning: 100K × $5/M + 20K × $30/M = $0.50 + $0.60 = **$1.10**
- Execution: 150K × $5/M + 120K × $30/M = $0.75 + $3.60 = **$4.35**
- **Total: $5.45**

### Plan/execute split — recommended defaults

**Fable planner + GPT-5.4 executor (transcript canonical):**

- Planning (Fable): $2.00
- Execution (GPT-5.4): 150K × $2.50/M + 120K × $15/M = $0.38 + $1.80 = **$2.18**
- **Total: $4.18**
- Savings vs all-Fable: **56%**

**Opus 4.8 planner + Sonnet 5 executor (Anthropic-only):**

- Planning (Opus): 100K × $5/M + 20K × $25/M = $0.50 + $0.50 = **$1.00**
- Execution (Sonnet 5): 150K × $3/M + 120K × $15/M = $0.45 + $1.80 = **$2.25**
- **Total: $3.25**
- Savings vs all-Fable: **66%**
- Savings vs all-Opus: **56%**

**Fable planner + GPT-5.4-mini executor (aggressive cost cut):**

- Planning (Fable): $2.00
- Execution (GPT-5.4-mini): 150K × $0.75/M + 120K × $4.50/M = $0.11 + $0.54 = **$0.65**
- **Total: $2.65**
- Savings vs all-Fable: **72%**

**Fable planner + GLM 5.2 executor (self-hosted or Z.ai API):**

- Planning (Fable): $2.00
- Execution (GLM 5.2 via API): 150K × $1.40/M + 120K × $4.40/M = $0.21 + $0.53 = **$0.74**
- **Total: $2.74**
- Savings vs all-Fable: **71%**

**Fable planner + Haiku 4.5 executor (via Path 2 subagent):**

- Planning (Fable): $2.00
- Execution (Haiku 4.5): approximate — verify current Haiku pricing
- **Total: ~$2.00–$2.30 estimated**
- Savings vs all-Fable: **~76–79%**

### Optional review pass

Adds a frontier review of the executor's output. Typical review workload: 100K input (reading code), 5K output (review notes).

- Fable review: 100K × $10/M + 5K × $50/M = $1.00 + $0.25 = **$1.25**
- Opus review: 100K × $5/M + 5K × $25/M = $0.50 + $0.13 = **$0.63**

Add to the split total when Phase 4 runs.

## Estimation formula

For any planner (P) and executor (E), given planning input tokens `Pi`, planning output tokens `Po`, execution input tokens `Ei`, execution output tokens `Eo`:

```
Total cost = (Pi × P_in_price + Po × P_out_price + Ei × E_in_price + Eo × E_out_price) / 1_000_000
```

Simplified for the reference workload above:

```
Total = (100K × P_in + 20K × P_out + 150K × E_in + 120K × E_out) / 1_000_000
```

For Phase 5 (reporting), the skill uses this formula with the actual token counts from Path 1 or Path 2 (both surfaces report token usage) or with the reference workload as an estimate for Path 3 (manual, no token counts available).

## Savings expectations

Realistic savings range for the plan/execute split, based on the tables above:

- **55–70%** when the executor is a mid-tier model (Sonnet 5, GPT-5.4).
- **70–80%** when the executor is a small model (Haiku 4.5, GPT-5.4-mini, GPT-5.4-nano) or open-weight (GLM 5.2, self-hosted).
- **50–60%** when the planner and executor are same-provider (both Anthropic or both OpenAI).
- **60–75%** when routing cross-provider (Anthropic planner + OpenAI executor, or similar).

The lower bound applies when the plan is thin and the executor needs to make some architectural decisions (increases token counts). The upper bound applies when the plan is detailed and the executor runs mechanically.

## When cost estimation matters and when it doesn't

**Matters:**
- Deciding whether to invoke the skill at all (small tasks: routing overhead exceeds savings).
- Choosing between executor tiers (mini vs nano vs mid-tier for a specific workload).
- Justifying routing infrastructure investment at team scale (Coinbase-style five-lever framework).
- Reporting savings after a run, so the pattern's value is visible.

**Doesn't matter:**
- Individual task decisions where the difference between $2 and $3 doesn't change the workflow.
- High-stakes production changes where quality dominates and cost is secondary.
- Exploratory work where routing doesn't fit anyway.

## Volatility warnings

Model pricing changes. Every price in this document is current as of July 2026 and dated. Before quoting numbers to a customer or committing to infrastructure based on savings estimates:

1. Re-verify Anthropic pricing at platform.claude.com/docs/en/about-claude/models
2. Re-verify OpenAI pricing at openai.com/api/pricing
3. Re-verify open-weight pricing at the specific provider (Z.ai for GLM, Moonshot for Kimi, DeepSeek for DeepSeek)
4. Update the tables above if your fork of this skill diverges from the tracked pricing

Introductory pricing (Sonnet 5's $2/$10 through Aug 31, 2026) expires. Long-context pricing (GPT-5.5 above 272K input) is a separate rate table. Reasoning-token overhead on Fable and GPT-5.5 max-effort modes can significantly exceed the base rates. All of these can shift the actual cost from the estimate.
