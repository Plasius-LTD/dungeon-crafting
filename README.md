# @plasius/dungeon-crafting

[![npm version](https://img.shields.io/npm/v/@plasius/dungeon-crafting.svg)](https://www.npmjs.com/package/@plasius/dungeon-crafting)
[![Build Status](https://img.shields.io/github/actions/workflow/status/Plasius-LTD/dungeon-crafting/ci.yml?branch=main&label=build&style=flat)](https://github.com/Plasius-LTD/dungeon-crafting/actions/workflows/ci.yml)
[![coverage](https://img.shields.io/codecov/c/github/Plasius-LTD/dungeon-crafting)](https://codecov.io/gh/Plasius-LTD/dungeon-crafting)
[![License](https://img.shields.io/github/license/Plasius-LTD/dungeon-crafting)](./LICENSE)
[![Code of Conduct](https://img.shields.io/badge/code%20of%20conduct-yes-blue.svg)](./CODE_OF_CONDUCT.md)
[![Security Policy](https://img.shields.io/badge/security%20policy-yes-orange.svg)](./SECURITY.md)
[![Changelog](https://img.shields.io/badge/changelog-md-blue.svg)](./CHANGELOG.md)

DIS-gated dungeon-crafting and chaos-sealing authority contracts for Plasius.

Apache-2.0. ESM + CJS builds. TypeScript types included.

## Installation

```bash
npm install @plasius/dungeon-crafting
```

## Scope

`@plasius/dungeon-crafting` owns the authority-side boundary for:

- DIS-gated access state
- explicit divine/domain prerequisite contracts
- chaos-hotspot severity metadata
- Player System and event/regional guidance handoffs into dungeon authority
- privacy-safe seal-directive payloads and hotspot throughput assumptions
- portable authority-host descriptors
- recoverable failure-policy and authority-response contracts

## Player System Handoff

The Player System may surface chaos hotspots, explain readiness, and collect
intent, but it does not become the execution authority for dungeon creation or
world mutation. Once DIS verification, divine authority, and domain alignment
have been established, the handoff into `@plasius/dungeon-crafting` should
carry the feature flag, guidance source, domain identifier, domain alignment,
requested authority tier, and hotspot severity so dungeon-crafting remains the
authoritative validation and execution boundary.

The same handoff surface is intentionally reusable for future arena, event, and
regional intervention flows by allowing non-Player-System guidance sources.

## Demo

```bash
npm run build
node demo/example.mjs
```

## Usage

```ts
import {
  createAuthorityFailurePolicy,
  createDungeonAuthorityPrerequisites,
  createDungeonAuthorityBoundaryResponse,
  createDungeonCraftingAccessState,
  createDungeonGuidanceHandoff,
  createDungeonSealDirectiveRecord,
  defaultDungeonCraftingThroughputAssumptions,
  dungeonCraftingAuthorityBoundary,
  dungeonCraftingPrivacyScaleRollout,
} from "@plasius/dungeon-crafting";

const state = createDungeonCraftingAccessState({
  divineAuthorityTier: "seat",
  hotspotSeverity: "major",
  eligible: true,
});

const prerequisites = createDungeonAuthorityPrerequisites({
  disVerified: true,
  divineAuthorityTier: state.divineAuthorityTier,
  domainId: "domain.northern-rift",
  domainAlignment: "aligned",
  sealClearance: "seal-authority",
  hotspotSeverity: state.hotspotSeverity,
});

const handoff = createDungeonGuidanceHandoff({
  authorityOwner: dungeonCraftingAuthorityBoundary.authorityOwner,
  featureFlagId: dungeonCraftingAuthorityBoundary.featureFlagId,
  guidanceSource: "player-system",
  domainId: prerequisites.domainId,
  domainAlignment: prerequisites.domainAlignment,
  readiness: "eligible",
  hotspotSeverity: prerequisites.hotspotSeverity,
  requestedAuthorityTier: prerequisites.divineAuthorityTier,
  handoffSummary:
    "Player System guidance has verified the prerequisites and is yielding authority to dungeon-crafting.",
});

const directive = createDungeonSealDirectiveRecord({
  operatorSubjectId: "operator-sub-1",
  hotspotId: "hotspot-1",
  divineAuthorityTier: state.divineAuthorityTier,
  hotspotSeverity: state.hotspotSeverity,
  updatedAtIso: new Date().toISOString(),
});

console.log(dungeonCraftingPrivacyScaleRollout.featureFlagId);
console.log(dungeonCraftingAuthorityBoundary.guidanceSources);
console.log(defaultDungeonCraftingThroughputAssumptions.maxDirectiveCommitsPerMinute);
console.log(handoff.guidanceSource);
console.log(directive.hotspotId);

const failurePolicy = createAuthorityFailurePolicy({
  timeoutMs: 1800,
  maxAttempts: 2,
  recoverableHotspotSeverities: ["minor", "major"],
  escalationTarget: "divine-seat",
});

const response = createDungeonAuthorityBoundaryResponse({
  responseId: "response-1",
  divineAuthorityTier: state.divineAuthorityTier,
  hotspotSeverity: state.hotspotSeverity,
  outcome: "deferred",
  eligible: state.eligible,
  sourceHost: {
    hostId: "seal-authority",
    runtime: "worker",
    transport: "queue",
    capabilityFlags: ["trace-linked"],
  },
  failurePolicy,
  observedAt: new Date().toISOString(),
});

console.log(response.outcome);
```

## Privacy And Scale Baseline

The package exports an inherited rollout descriptor for the cross-repo feature
flag `isekai.training-progression.privacy-scale.enabled`.

When that rollout is enabled, package consumers should prefer the minimal
`DungeonSealDirectiveRecord` contract:

- `operatorSubjectId` is the only player-linked identifier and is expected to
  be pseudonymous
- profile names, chat text, raw hotspot telemetry, and contact data are outside
  the package contract
- `dungeonCraftingFieldPolicies` documents the retention and sensitivity
  expectation for every exported directive field
- `defaultDungeonCraftingThroughputAssumptions` publishes the validated hotspot
  evaluation and directive-commit envelope used by the package docs and tests

## Governance

- ADRs: [docs/adrs](./docs/adrs)
- TDRs: [docs/tdrs](./docs/tdrs)
- Design notes: [docs/design](./docs/design)

<!-- BEGIN PLASIUS RELEASE INTEGRITY -->
## Release integrity

CI keeps the administrative contributor registry outside Git and npm package
artifacts using exact, case-normalised path checks. CI runs on approved
self-hosted runners. Release preparation and npm publication use GitHub-hosted
runners with Node.js 24.18.0 LTS. CD remains disabled until the npm trusted
publisher binding is verified and the legacy token fallback is removed.
<!-- END PLASIUS RELEASE INTEGRITY -->
