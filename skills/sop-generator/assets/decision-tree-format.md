# Decision Tree Format Reference

Use this syntax when documenting decision points in SOPs. Every decision point must cover all possible outcomes — no unhandled cases.

---

## Simple Decision (Two Outcomes)

```
Step 5: Verify customer payment status
IF payment is confirmed
  THEN proceed to Step 6
IF payment failed or is pending
  THEN send payment reminder, set 24-hour follow-up, do NOT proceed
```

---

## Multi-Branch Decision

```
Step 8: Classify support ticket priority
IF issue is system-wide outage affecting multiple customers
  THEN assign Priority 1 — notify engineering lead immediately
IF issue affects a single customer's core functionality
  THEN assign Priority 2 — respond within 2 hours
IF issue is a feature request or minor inconvenience
  THEN assign Priority 3 — respond within 24 hours
IF issue is unclear or does not fit categories above
  THEN escalate to Support Manager for classification
```

---

## Nested Decision

```
Step 12: Process refund request
IF purchase was made within 30 days
  IF refund amount is under $500
    THEN approve refund, process in payment system, notify customer
  IF refund amount is $500 or more
    THEN escalate to Finance Manager for approval before processing
IF purchase was made 31-90 days ago
  THEN offer store credit instead of refund
  IF customer insists on refund
    THEN escalate to Customer Success Manager
IF purchase was made over 90 days ago
  THEN deny refund, explain policy, offer discount on next purchase
```

---

## Parallel Paths

Use when multiple tasks must happen simultaneously:

```
Step 15: Initiate project handoff
PARALLEL:
  Path A: Technical team exports all project documentation (Steps 16-17)
  Path B: Account manager schedules handoff call with client (Step 18)
  Path C: Finance prepares final invoice (Step 19)
SYNC: All paths must complete before Step 20 (formal handoff meeting)
```

---

## Decision with Data Lookup

```
Step 7: Determine shipping method
LOOKUP: Customer's shipping preference in CRM profile
IF preference is "Express" AND order value is over $100
  THEN ship via FedEx Priority — free shipping
IF preference is "Express" AND order value is under $100
  THEN ship via FedEx Priority — charge $15.99
IF preference is "Standard" OR no preference set
  THEN ship via USPS Priority Mail — free shipping
IF destination is international
  THEN use international shipping calculator, present options to customer
```

---

## Rules for Decision Trees

1. **Cover all cases.** If you have three branches, ask: "What about everything else?" Add a catch-all branch.
2. **Be specific.** Not "handle appropriately" but "create a ticket in Zendesk, assign to billing team, set 2-hour SLA."
3. **Include the next step.** Every branch should end with "proceed to Step X" or a terminal action.
4. **Use consistent formatting.** Always start with IF, indent the THEN action, keep conditions on one line.
5. **Test exhaustiveness.** For each decision point, ask: "Is there a scenario this does not cover?" If yes, add a branch.
