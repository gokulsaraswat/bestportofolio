# 6.6 Refund Quote Entity (Redis)

*(Copy into **Post booking cancellation flows.docx** — Contracts section, after §6.5 Snapshot Entity)*

---

## 6.6 Refund Quote Entity

Redis payload for cancellation quote (§5.6, §6.2). Same principle as §6.5 snapshot:

**Stores only resolution mappings + penalty/refund figures needed for execute and idempotency.**

Full quote UI (labels, pax names, fare/tax line display, item types) is **not** stored in Redis — it is built at quote time from **trip service + order + snapshot (§6.5) + supply quote response**.

| Stored in Redis | Built at API response time (not Redis) |
|-----------------|--------------------------------------|
| `quote_id`, `snapshot_id`, TTL | Group labels, pax display names |
| `group_id` → `item_ids`, `pax_ids` | Item type, ancillary type |
| Penalty breakdown by group / item_ids | Gross fare / tax display lines |
| `net_refund_amount`, `summary` totals | Regulatory / reason titles |
| `reason_code`, `currency` | UX copy, eligibility messaging |
| Agent `override` amounts (if any) | |

Scoped to `order_id` + `snapshot_id`. Immutable once created; TTL = quote validity.

---

### Redis JSON

```json
{
  "quote_id": "QUOTE_abc123",
  "order_id": "ORD123",
  "snapshot_id": "SNAP_abc123",
  "created_at": "2026-05-06T12:00:00Z",
  "expires_at": "2026-05-06T12:30:00Z",
  "currency": "INR",
  "reason_code": "PLAN_CHANGED",
  "groups": [
    {
      "group_id": "SEG_BLR_BOM",
      "item_ids": ["SI101", "SI102", "SI103", "SI104"],
      "pax_ids": ["P1", "P2"],
      "penalties": {
        "airline_penalty": 4000,
        "convenience_fee_penalty": 300,
        "ancillary_deduction": 150,
        "other_deduction": 50
      },
      "net_refund_amount": 8400
    },
    {
      "group_id": "SEG_BOM_DEL",
      "item_ids": ["SI201"],
      "pax_ids": ["P1"],
      "penalties": {
        "airline_penalty": 2500,
        "convenience_fee_penalty": 200,
        "ancillary_deduction": 0,
        "other_deduction": 0
      },
      "net_refund_amount": 5200
    }
  ],
  "penalty_by_items": [
    {
      "item_ids": ["SI101", "SI102"],
      "airline_penalty": 4000,
      "convenience_fee_penalty": 150,
      "ancillary_deduction": 0,
      "other_deduction": 50
    },
    {
      "item_ids": ["SI103", "SI104"],
      "airline_penalty": 0,
      "convenience_fee_penalty": 150,
      "ancillary_deduction": 950,
      "other_deduction": 0
    },
    {
      "item_ids": ["SI201"],
      "airline_penalty": 2500,
      "convenience_fee_penalty": 200,
      "ancillary_deduction": 0,
      "other_deduction": 0
    }
  ],
  "summary": {
    "airline_penalty": 6500,
    "convenience_fee_penalty": 500,
    "ancillary_deduction": 950,
    "other_deduction": 50,
    "net_refund_amount": 13600,
    "is_final_estimate": false
  },
  "override": {
    "applied_by": null,
    "airline_penalty_waiver": 0,
    "convenience_fee_refund": 0,
    "goodwill_refund": 0,
    "adjusted_net_refund_amount": null
  }
}
```

---

### Field reference

| Field | Description |
|-------|-------------|
| `quote_id` | Stable reference passed to execute (§6.3) |
| `snapshot_id` | Links to discovery snapshot (§6.5) |
| `reason_code` | Cancellation reason at quote time |
| `groups[]` | Same group keys as snapshot + **penalties** + **net_refund_amount** |
| `groups[].item_ids`, `pax_ids` | Resolved selection mapping for execute |
| `penalty_by_items[]` | Supply-aligned penalty rows keyed by `item_ids` (mirrors §6.2 `penaltyBreakup`) |
| `summary` | Order-level penalty totals + indicative net refund |
| `override` | Agent-only adjustments; omitted or zero for customer flows |

### Penalty fields

| Field | Description |
|-------|-------------|
| `airline_penalty` | Airline cancellation charge |
| `convenience_fee_penalty` | Platform convenience fee retained |
| `ancillary_deduction` | Non-refundable ancillary amount |
| `other_deduction` | Other deductions (partner, payment, misc.) |

---

### Relationship to §6.5 Snapshot

| §6.5 Snapshot (Redis) | §6.6 Quote (Redis) |
|-----------------------|---------------------|
| `snapshot_id` | `quote_id` + `snapshot_id` (ref) |
| `groups[].group_id`, `item_ids`, `pax_ids` | Same keys + penalties + net refund |
| `mappings.pax_to_items` | Selection captured in `groups` + `pax_ids` |
| Discovery resolution | Quote + execute resolution |
| No financial data | Penalty / refund figures only |

---

### Design principles

- Redis stores **mappings + money** — not UI payloads
- `penalty_by_items` uses **`item_ids` only** — pax/segment/ancillary context comes from snapshot + trip
- UI quote API merges: Redis quote + snapshot + trip + order pricing
- If quote expired or missing → reject execute; user must re-quote
- `is_final_estimate: false` until supply execute callback confirms final penalty (§6.3)

---

### Quote API vs Redis (example)

**Redis** — stored after supply quote (above JSON)

**Demand → UI quote response** — assembled at read time (not persisted):

```json
{
  "quote_id": "QUOTE_abc123",
  "snapshot_id": "SNAP_abc123",
  "currency": "INR",
  "valid_till": "2026-05-06T12:30:00Z",
  "groups": [
    {
      "group_id": "SEG_BLR_BOM",
      "label": "Bangalore → Mumbai",
      "net_refund_amount": 8400,
      "penalties": { "...": "from Redis" }
    }
  ],
  "summary": {
    "net_refund_amount": 13600,
    "is_final_estimate": false,
    "message": "Indicative refund — final amount may differ"
  }
}
```

---

*Rename existing §6.6 Cancellation Entity → **§6.7** when pasting into the docx.*
