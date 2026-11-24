# CX Cancellation Flow

CX agents cancel trips via the CX UI. Traffic goes through **air-cancel-flow-api**, which adapts requests/responses and calls **Vanguard** for STS + OMS trips.

---

## Actors

- **CX UI** — agent selects pax/segment to cancel
- **Trip Service** — cancel discovery eligibility (done before CX reaches refund/execute)
- **air-cancel-flow-api** — adapter + gatekeeper; calls Vanguard
- **Vanguard** — discovery, quote (refund), execute

---

## Phase 1 — Cancel Discovery (via Trips)

Done before the CX refund/execute steps.

- CX opens cancellation for a trip
- Trip service provides cancel eligibility / trip context
- CX UI knows which pax/segments are in scope

---

## Phase 2 — Refund Discovery (Quote)

CX UI sends selected pax/segment → **air-cancel-flow-api**

```
CX UI
  → air-cancel-flow-api
      → adapt to Vanguard discovery request
      → call Vanguard discovery API

      if selected pax/segment NOT cancellable
          → throw error, return message to CX UI

      if cancellable
          → call Vanguard refund/quote API
          → get quote_id in response
          → adapt response
      → return to CX UI
```

**Steps**

1. CX UI passes pax + segment selection to air-cancel-flow-api
2. air-cancel-flow-api adapts payload to Vanguard discovery request
3. Call Vanguard discovery
4. Check if selected pax/segment cancellation is allowed
   - Not allowed → return error to CX UI
   - Allowed → call Vanguard refund/quote API
5. Vanguard returns quote (includes `quote_id`)
6. air-cancel-flow-api adapts response and returns to CX UI

---

## Phase 3 — Cancellation Execute

CX UI sends selected pax/segment → **air-cancel-flow-api**

```
CX UI
  → air-cancel-flow-api
      → adapt to Vanguard cancellation request
      → call Vanguard cancellation/execute API
      → adapt response
  → return to CX UI
```

**Steps**

1. CX UI passes pax + segment selection to air-cancel-flow-api
2. air-cancel-flow-api adapts payload to Vanguard execute request
3. Call Vanguard cancellation execute (needs `quote_id` — see open issue below)
4. air-cancel-flow-api adapts response and returns to CX UI

---

## Flowchart

```
┌─────────┐
│  CX UI  │
└────┬────┘
     │
     │  (1) Cancel discovery — via Trip Service [before refund/execute]
     │
     ├──────────────────────────────────────┐
     │                                      │
     ▼                                      ▼
 REFUND DISCOVERY                    CANCELLATION EXECUTE
     │                                      │
     ▼                                      ▼
┌────────────────────┐              ┌────────────────────┐
│ air-cancel-flow-api│              │ air-cancel-flow-api│
└─────────┬──────────┘              └─────────┬──────────┘
          │                                   │
          ├─ adapt → Vanguard discovery     ├─ adapt → Vanguard execute
          │                                   │
          ├─ cancellable?                     │  (requires quote_id)
          │   NO  → error to CX               │
          │   YES → Vanguard quote/refund     │
          │         (returns quote_id)        │
          │                                   │
          └─ adapt response → CX UI           └─ adapt response → CX UI
```

---

## Open Issue — `quote_id` on Execute

Vanguard returns `quote_id` during **refund discovery (quote)**. Execute requires it.

**Option A — air-cancel-flow-api stores it**

- air-cancel-flow-api saves `quote_id` keyed to order + selection (or session) at quote time
- On execute, CX UI sends same selection; air-cancel-flow-api looks up `quote_id` and attaches it to Vanguard execute request
- CX UI does not need to handle `quote_id`

**Option B — CX UI carries `quote_id`**

- Refund discovery response includes `quote_id`; air-cancel-flow-api passes it through to CX UI
- CX UI must send `quote_id` back on cancellation execute
- air-cancel-flow-api forwards it to Vanguard execute

| | Option A (store in air-cancel-flow-api) | Option B (round-trip via CX UI) |
|---|---|---|
| CX UI change | None | Must store and resend `quote_id` |
| air-cancel-flow-api | Must persist quote mapping | Simpler — pass-through only |
| Risk | Stale/missing mapping if CX delays execute | CX loses quote_id between steps |

**Recommendation:** Option A keeps CX UI unchanged; air-cancel-flow-api already owns the adapter layer and quote TTL aligns with Vanguard quote validity.

---

## Notes

- air-cancel-flow-api is the adapter only — no business logic re-derivation of groups/penalties
- Vanguard is source of truth for cancellability and refund figures
- Old trips (non-STS) stay on legacy path; air-cancel-flow-api routes those without hitting Vanguard
