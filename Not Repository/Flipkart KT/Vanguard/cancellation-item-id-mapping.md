# Cancellation Flow Design Document
## Supply Item ID Mapping (Demand ↔ Supply)

---

## 5.20 Supply Item ID Mapping

### 5.20.1 Overview

Supply exposes cancellable units as **item IDs** (`refId`) in the hold response.

Demand must:
- capture these IDs at hold time
- persist them on existing **pax × segment** trip objects
- resolve them during cancellation (discovery, quote, execute)
- interpret any supply item ID back to **pax**, **segment**, and **ancillary type**

Supply is the **source of truth** for item IDs. Demand does not generate them.

---

### 5.20.2 Hold Response Changes

#### 5.20.2.1 Overview

Hold response is structured at **Pax × Segment × Flight** level inside `passengerWiseHoldInformationList`.

Each passenger block contains:
- `passengerIndex`
- `segments[]` — flight-level traveller-segment entries
- `ancillaries[]` — seat, meal, baggage entries linked to segment refIds

There is **no pax-level refId** in the hold response.

#### 5.20.2.2 Segment entries

Each entry in `passenger.segments[]` contains:
- `flightId` — identifies the flight / segment
- `refId` — supply item ID for the **pax × segment (flight)** unit

This `refId` maps to Demand field **`item_id`** on the pax × segment row.

#### 5.20.2.3 Ancillary entries

Each entry in `passenger.ancillaries[]` contains:
- `ancillaryType` — `SEAT`, `MEAL`, `BAGGAGE`
- `ancillaryCode` — e.g. `12A`, `VGML`, `15K`
- `refId` — supply item ID for the ancillary
- `travellerSegmentRefIds[]` — links ancillary to one or more segment `refId`s from the same passenger block

Ancillary refIds map to Demand fields:
- `SEAT` → `item_id_seat`
- `MEAL` → `item_id_meal`
- `BAGGAGE` → `item_id_baggage`

#### 5.20.2.4 Sample hold response (abbreviated)

```json
{
  "travelOptionList": [{
    "passengerWiseHoldInformationList": [{
      "passengerIndex": 0,
      "firstName": "Mohit",
      "segments": [
        { "flightId": "FL-6E101", "refId": "seg-uuid-1" },
        { "flightId": "FL-6E202", "refId": "seg-uuid-2" }
      ],
      "ancillaries": [
        {
          "ancillaryType": "SEAT",
          "refId": "anc-uuid-1",
          "travellerSegmentRefIds": ["seg-uuid-1"]
        },
        {
          "ancillaryType": "MEAL",
          "refId": "anc-uuid-3",
          "travellerSegmentRefIds": ["seg-uuid-1"]
        },
        {
          "ancillaryType": "BAGGAGE",
          "refId": "anc-uuid-5",
          "travellerSegmentRefIds": ["seg-uuid-1", "seg-uuid-2"]
        }
      ]
    }]
  }]
}
```

#### 5.20.2.5 Key principles

- Item IDs are available in the **hold response only** (not in discovery / execute responses)
- `passengerIndex` is the only pax identifier in hold — Demand maps it to `pax_info_id`
- `flightId` is matched to Demand `segment_id`
- Ancillaries are linked to segments via `travellerSegmentRefIds`

---

### 5.20.3 Trip Data Model Changes

#### 5.20.3.1 Overview

Demand already maintains **pax × segment** pricing objects on the trip / order.

New fields are added to each row to store supply item IDs captured from hold.

#### 5.20.3.2 Existing object (unchanged fields)

```json
{
  "id": 451174754,
  "segment_id": 303976696,
  "pricing_object_id": 823869704,
  "txn_id": null,
  "pax_info_id": 352209620,
  "created_at": "2026-06-01T00:13:53.000+0530",
  "updated_at": "2026-06-01T00:19:06.000+0530"
}
```

#### 5.20.3.3 New fields

| Field | Type | Source | Nullable | Description |
|-------|------|--------|----------|-------------|
| `item_id` | string | `passenger.segments[].refId` | No | Supply item ID for pax × segment (flight) |
| `item_id_seat` | string | ancillary where `ancillaryType = SEAT` | Yes | Supply item ID for seat on this segment |
| `item_id_meal` | string | ancillary where `ancillaryType = MEAL` | Yes | Supply item ID for meal on this segment |
| `item_id_baggage` | string | ancillary where `ancillaryType = BAGGAGE` | Yes | Supply item ID for baggage linked to this segment |

#### 5.20.3.4 Example — enriched pax × segment row

```json
{
  "id": 451174754,
  "segment_id": 303976696,
  "pax_info_id": 352209620,
  "item_id": "seg-uuid-1",
  "item_id_seat": "anc-uuid-1",
  "item_id_meal": "anc-uuid-3",
  "item_id_baggage": "anc-uuid-5"
}
```

#### 5.20.3.5 Population rules

System must, at **hold time**:
- match `passengerIndex` → `pax_info_id`
- match `flightId` → `segment_id`
- set `item_id` from the matching segment `refId`
- set ancillary fields from ancillaries whose `travellerSegmentRefIds` contains that segment's `refId`
- leave ancillary fields **null** if the pax did not purchase that ancillary on the segment

#### 5.20.3.6 Journey-level baggage rule

If baggage `travellerSegmentRefIds` spans multiple segments:
- store `item_id_baggage` on the **first segment row** for that pax
- set `item_id_baggage = null` on subsequent segment rows for the same pax
- deduplicate at execute when collecting item IDs for a pax

#### 5.20.3.7 When persisted

| Event | Action |
|-------|--------|
| Hold confirmed | Parse hold response → enrich pax × segment rows → persist on trip |
| Discovery | Read item IDs from trip rows (no re-parse of hold) |
| Execute | Collect item IDs from selected pax rows → send to Supply |

---

### 5.20.4 Supply Item ID Interpretation

#### 5.20.4.1 Overview

Given any supply item ID (from callback, execute response, or internal lookup), Demand must resolve:
- which **pax** (`pax_info_id`)
- which **segment** (`segment_id`)
- which **unit** — flight, seat, meal, or baggage

Interpretation uses the **pax × segment rows** on trip — no separate item registry.

#### 5.20.4.2 Forward resolution (hold → trip row)

```
Hold Response
   ↓
Match passengerIndex → pax_info_id
   ↓
Match flightId → segment_id
   ↓
Set item_id from segment.refId
   ↓
For each ancillary linked to segment.refId:
   SEAT    → item_id_seat
   MEAL    → item_id_meal
   BAGGAGE → item_id_baggage (first segment row if journey-scoped)
   ↓
Persist on pax × segment object
```

#### 5.20.4.3 Reverse lookup (supply item ID → pax, segment, ancillary)

Given a supply item ID (e.g. `anc-uuid-5`), system must:

```
Input: supply_item_id
   ↓
Scan pax × segment rows for the order
   ↓
Match against: item_id | item_id_seat | item_id_meal | item_id_baggage
   ↓
Return: pax_info_id, segment_id, item_type
```

**Lookup table (which field matched → item type):**

| Matched field | Item type |
|---------------|-----------|
| `item_id` | FLIGHT (pax × segment) |
| `item_id_seat` | ANCILLARY — SEAT |
| `item_id_meal` | ANCILLARY — MEAL |
| `item_id_baggage` | ANCILLARY — BAGGAGE |

#### 5.20.4.4 Reverse lookup examples

**Example 1 — Flight item `seg-uuid-1`**

| Resolved field | Value |
|----------------|-------|
| `pax_info_id` | 352209620 (Mohit / P1) |
| `segment_id` | 303976696 (S1 / FL-6E101) |
| `item_type` | FLIGHT |

**Example 2 — Seat item `anc-uuid-1`**

| Resolved field | Value |
|----------------|-------|
| `pax_info_id` | 352209620 |
| `segment_id` | 303976696 |
| `item_type` | ANCILLARY — SEAT |

**Example 3 — Journey baggage `anc-uuid-5`**

| Resolved field | Value |
|----------------|-------|
| `pax_info_id` | 352209620 |
| `segment_id` | 303976696 (stored on first segment row) |
| `item_type` | ANCILLARY — BAGGAGE |
| Note | Spans S1 + S2; stored once on first segment row |

**Example 4 — Unknown ID**

If no row matches → item not found for this order → log / reject.

#### 5.20.4.5 Forward collection — cancel selected pax

When user selects pax for cancellation, system must:

```
Input: selected pax_info_id(s)
   ↓
Fetch all pax × segment rows for those pax
   ↓
Collect non-null: item_id, item_id_seat, item_id_meal, item_id_baggage
   ↓
Deduplicate
   ↓
Output: list of supply item IDs for execute / discovery
```

**Example — cancel P1 (`pax_info_id = 352209620`):**

| Row (segment) | Fields collected |
|---------------|------------------|
| S1 | `seg-uuid-1`, `anc-uuid-1`, `anc-uuid-3`, `anc-uuid-5` |
| S2 | `seg-uuid-2`, `anc-uuid-2`, `anc-uuid-4` |

**Result:** 7 supply item IDs sent to Supply.

#### 5.20.4.6 Mapping reference (full example)

**Pax mapping**

| `passengerIndex` | `pax_info_id` | UI `pax_id` |
|------------------|---------------|-------------|
| 0 | 352209620 | P1 |
| 1 | 352209621 | P2 |

**Mohit (P1) — pax × segment rows**

| `segment_id` | `item_id` | `item_id_seat` | `item_id_meal` | `item_id_baggage` |
|--------------|-----------|----------------|----------------|-------------------|
| 303976696 (S1) | seg-uuid-1 | anc-uuid-1 | anc-uuid-3 | anc-uuid-5 |
| 303976697 (S2) | seg-uuid-2 | anc-uuid-2 | anc-uuid-4 | null |

**Priya (P2) — pax × segment rows**

| `segment_id` | `item_id` | `item_id_seat` | `item_id_meal` | `item_id_baggage` |
|--------------|-----------|----------------|----------------|-------------------|
| 303976696 (S1) | seg-uuid-3 | anc-uuid-6 | null | anc-uuid-7 |
| 303976697 (S2) | seg-uuid-4 | null | null | null |

#### 5.20.4.7 Design principles

- Supply owns item IDs; Demand stores and interprets them
- Pax × segment row is the **single source of truth** for item ID ↔ pax ↔ segment mapping
- No pax refId — use `passengerIndex` at hold, `pax_info_id` on trip
- Ancillary fields are nullable — only populated when purchased
- Reverse lookup is a **field match scan** on trip rows (O(rows) per order)
- Item IDs are captured at **hold**; discovery and execute **read from trip**, not re-parse hold

---

*Part of Cancellation Flow Design Document — Supply Item ID Mapping section.*
