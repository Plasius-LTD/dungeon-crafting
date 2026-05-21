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
- chaos-hotspot severity metadata
- dungeon-crafting intent state
- portable authority-host descriptors
- recoverable failure-policy and authority-response contracts

## Demo

```bash
npm run build
node demo/example.mjs
```

## Usage

```ts
import {
  createAuthorityFailurePolicy,
  createDungeonAuthorityBoundaryResponse,
  createDungeonCraftingAccessState,
} from "@plasius/dungeon-crafting";

const state = createDungeonCraftingAccessState({
  divineAuthorityTier: "seat",
  hotspotSeverity: "major",
  eligible: true,
});

console.log(state.hotspotSeverity);

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

## Governance

- ADRs: [docs/adrs](./docs/adrs)
- TDRs: [docs/tdrs](./docs/tdrs)
- Design notes: [docs/design](./docs/design)
