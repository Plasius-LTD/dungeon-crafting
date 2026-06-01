# Dungeon-Crafting Privacy And Scale Baseline

## Goal

Define the minimal seal-directive payload and validated hotspot throughput
assumptions exported by `@plasius/dungeon-crafting`.

## Contract Additions

- `DungeonSealDirectiveRecord` exposes only the pseudonymous operator subject,
  hotspot identifier, authority tier, hotspot severity, and update timestamp.
- `dungeonCraftingFieldPolicies` documents the sensitivity, retention, and
  justification for every directive field.
- `dungeonCraftingPrivacyScaleRollout` publishes the inherited
  `isekai.training-progression.privacy-scale.enabled` control and local env
  override.
- `defaultDungeonCraftingThroughputAssumptions` and
  `createDungeonCraftingThroughputAssumptions` document and validate the
  expected envelope for seal operations, hotspot evaluations, and directive
  commits.

## Exclusions

- profile names, contact data, and raw hotspot telemetry payloads
- storage, queue, or combat simulation implementation details
- dungeon UI or gameplay presentation logic
