slidenumbers: true
autoscale: true

# Technical Deep Dive: Architecture & Tradeoffs

## What We're Solving

We need a system that turns high-volume events into reliable, queryable insights without paging humans for noise.

^ Frame the talk around constraints. Engineers will forgive limited features; they will not forgive hand-wavy reliability claims.

---

## Constraints

- Latency: "fresh enough" for operational decisions
- Cost: predictable under spikes
- Reliability: graceful degradation
- DX: easy to extend without fear

^ Pick which constraint dominates for your audience. If this is an ops crowd, reliability comes first; if it's product analytics, cost and DX may dominate.

---

## High-Level Architecture

```text
Producers -> Ingest API -> Stream/Queue -> Workers -> Storage -> Query API -> UI
                     \-> Dead-letter -> Replay -> Backfill
```

^ This is intentionally boring: boring architectures are easier to operate. Explain the responsibilities at each box, not the brand names.

---

## Data Flow (Happy Path)

1. Validate and enrich incoming events
2. Partition by tenant + key
3. Process with idempotent workers
4. Persist to an append-only log + derived tables
5. Serve queries from read-optimized views

^ Emphasize idempotency early. Most failure modes become manageable when every step can be retried safely.

---

## Tradeoff 1: Sync vs Async

- Sync ingestion: simpler mental model, higher tail latency
- Async ingestion: resilient under spikes, needs observability

Decision: accept async complexity to protect p99 under load.

^ Give a concrete example: a spike during an incident. The system must keep ingesting even if downstream is slow.

---

## Tradeoff 2: Exactly-Once (Myth) vs At-Least-Once (Reality)

- "Exactly-once" is expensive and leaky
- At-least-once + idempotency is pragmatic

Decision: build idempotency keys into the data model.

^ If the audience is skeptical, define idempotency key rules: stable key per semantic event, enforced at write time.

---

## Failure Modes

- Queue backlog grows
- Workers crash-loop
- Storage is slow/unavailable
- Poison events block partitions

^ For each, say what the user sees and what the operator does. Keep the operational playbook in mind.

---

## Observability

- Golden signals: latency, error rate, saturation
- Domain signals: drop rate, duplicate rate, lag
- Tracing: ingest -> worker -> storage

^ Mention alerting philosophy: page on user impact, not on internal noise. Add SLOs if you have them; otherwise keep it generic.

---

## Rollout Plan

1. Shadow mode (no user impact)
2. Dual-write (compare outputs)
3. Limited cohort (one tenant/team)
4. Ramp with guardrails

^ This is where you show maturity. Discuss how you will validate correctness and how you will roll back safely.

---

## Checklist (What To Copy)

- Idempotency keys from day 1
- Dead-letter + replay path
- Backfill strategy
- Clear ownership of "schema changes"

^ End with actionable takeaways. People remember checklists and steal them for their own systems.

