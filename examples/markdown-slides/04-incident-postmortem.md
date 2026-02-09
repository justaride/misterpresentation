slidenumbers: true
autoscale: true

# Incident Postmortem: The 47-Minute Outage

## Ground Rules

- No blame
- Be specific
- Optimize for learning

^ Say this out loud before the facts. The goal is psychological safety plus rigor: you can be precise without being punitive.

---

## Impact Summary

- Duration: 47 minutes
- User impact: [describe]
- Business impact: [describe]
- Detection: [how we noticed]

^ If you don't have numbers, keep it qualitative. The point is shared understanding, not storytelling.

---

## Timeline (Key Events)

- T-10: [early signal]
- T+0: [incident starts]
- T+12: [mitigation attempt]
- T+25: [breakthrough]
- T+47: [recovery confirmed]

^ Use relative time. When someone wants exact timestamps, point them to the incident doc and keep the deck readable.

---

## What Happened (Plain Language)

A routine change caused an unexpected feedback loop that exhausted a shared resource.

^ Avoid jargon here. Make sure non-engineers can explain it back in their own words.

---

## Root Cause (Technical)

- Trigger: [deploy/config/traffic change]
- Mechanism: [feedback loop / lock contention / retry storm]
- Result: [resource exhaustion -> cascading failures]

^ This slide should be factual, not defensive. If the root cause is uncertain, say "most likely" and list what evidence you still need.

---

## Contributing Factors

- Guardrail missing: [rate limit / circuit breaker]
- Monitoring gap: [signal was present but not alerted]
- Process gap: [review/rollout/test]

^ Keep this as "system factors" not "people failed." You can still name ownership, but avoid moral judgments.

---

## Detection & Response

- What worked: [on-call handoff / playbook]
- What slowed us down: [logs, dashboards, access]
- Where we got lucky: [cache, failover]

^ This is where you improve ops. Encourage the team to name friction points; the goal is to remove them before the next incident.

---

## Fixes Shipped (Immediate)

- [config change]
- [feature flag / rollback]
- [limit / timeout]

^ Keep these short and verifiable. If something is "in progress," move it to follow-ups.

---

## Follow-Ups (Owned)

- Prevent retry storms: [owner] by [date]
- Add alert on lag: [owner] by [date]
- Improve rollout checklist: [owner] by [date]

^ If you don't want names in the deck, use role labels like "Platform lead" and keep the owner list in the tracking ticket.

---

## What Went Well

- We escalated quickly and communicated clearly.
- We validated recovery before declaring victory.

^ Ending with positives is not fluff. It reinforces the behaviors you want repeated next time.

