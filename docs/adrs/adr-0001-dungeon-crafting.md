# ADR-0001: Dungeon Crafting Package Boundary

## Status

Accepted

## Context

Dungeon crafting and chaos sealing need a divine-authority package boundary separate from Player System guidance and world simulation hosts.

## Decision

`@plasius/dungeon-crafting` will own DIS-gated access, divine/domain prerequisite, and chaos-sealing authority contracts.

## Consequences

- Dungeon-crafting authority stays explicit.
- Divine/domain prerequisite state can be reused by host runtimes.
- Player System guidance stays limited to handoff metadata rather than execution authority.
- The same guidance handoff surface can be reused by future arena, event, and regional intervention authorities.
- Future chaos sealing execution logic has a package home.
