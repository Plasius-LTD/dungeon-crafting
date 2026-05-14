# ADR-0001: Dungeon Crafting Package Boundary

## Status

Accepted

## Context

Dungeon crafting and chaos sealing need a divine-authority package boundary separate from Player System guidance and world simulation hosts.

## Decision

`@plasius/dungeon-crafting` will own DIS-gated access and chaos-sealing authority contracts.

## Consequences

- Dungeon-crafting authority stays explicit.
- Divine/domain access state can be reused by host runtimes.
- Future chaos sealing execution logic has a package home.
