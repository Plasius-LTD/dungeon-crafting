import {
  DUNGEON_CRAFTING_FEATURE_FLAG_ID,
  DUNGEON_CRAFTING_PRIVACY_SCALE_FEATURE_FLAG_ID,
  createAuthorityFailurePolicy,
  createDungeonAuthorityPrerequisites,
  createDungeonAuthorityBoundaryResponse,
  createDungeonCraftingAccessState,
  createDungeonCraftingThroughputAssumptions,
  createDungeonGuidanceHandoff,
  createDungeonSealDirectiveRecord,
  createPortableAuthorityHost,
  defaultDungeonCraftingThroughputAssumptions,
  dungeonCraftingAuthorityBoundary,
  dungeonCraftingFieldPolicies,
  dungeonCraftingPrivacyScaleRollout,
  isChaosHotspotSeverity,
  isDomainAlignmentState,
  isDivineAuthorityTier,
  packageDescriptor,
} from "../src/index.js";

describe("@plasius/dungeon-crafting", () => {
  it("exports the package descriptor", () => {
    expect(packageDescriptor.packageName).toBe("@plasius/dungeon-crafting");
    expect(packageDescriptor.featureFlagId).toBe(DUNGEON_CRAFTING_FEATURE_FLAG_ID);
  });

  it("exports the authority boundary and supported guidance sources", () => {
    expect(dungeonCraftingAuthorityBoundary.authorityOwner).toBe(
      "dungeon-crafting"
    );
    expect(dungeonCraftingAuthorityBoundary.entryGate).toBe("dis-verified");
    expect(dungeonCraftingAuthorityBoundary.guidanceSources).toContain(
      "player-system"
    );
    expect(dungeonCraftingAuthorityBoundary.guidanceSources).toContain(
      "arena-orchestrator"
    );
    expect(dungeonCraftingAuthorityBoundary.guidanceSources).toContain(
      "event-orchestrator"
    );
    expect(dungeonCraftingAuthorityBoundary.guidanceSources).toContain(
      "regional-governor"
    );
  });

  it("creates dungeon-crafting access state", () => {
    const state = createDungeonCraftingAccessState({
      divineAuthorityTier: "seat",
      hotspotSeverity: "major",
      eligible: true,
    });

    expect(state.eligible).toBe(true);
  });

  it("creates explicit DIS, divine, and domain prerequisites", () => {
    const prerequisites = createDungeonAuthorityPrerequisites({
      disVerified: true,
      divineAuthorityTier: "seat",
      domainId: "domain.northern-rift",
      domainAlignment: "aligned",
      sealClearance: "seal-authority",
      hotspotSeverity: "major",
    });

    expect(prerequisites.domainAlignment).toBe("aligned");
    expect(isDomainAlignmentState("sealed")).toBe(true);
    expect(isDomainAlignmentState("invalid")).toBe(false);
  });

  it("rejects invalid dungeon-crafting access state payloads", () => {
    expect(() =>
      createDungeonCraftingAccessState({
        divineAuthorityTier: "unknown" as never,
        hotspotSeverity: "major",
        eligible: true,
      })
    ).toThrow(
      "divineAuthorityTier must be a supported dungeon-crafting authority tier"
    );
  });

  it("exports the privacy and scale rollout metadata", () => {
    expect(dungeonCraftingPrivacyScaleRollout.featureFlagId).toBe(
      DUNGEON_CRAFTING_PRIVACY_SCALE_FEATURE_FLAG_ID
    );
    expect(dungeonCraftingPrivacyScaleRollout.envOverride).toBe(
      "DUNGEON_CRAFTING_PRIVACY_SCALE_ENABLED"
    );
  });

  it("documents a minimized seal-directive field policy", () => {
    expect(dungeonCraftingFieldPolicies).toEqual([
      expect.objectContaining({
        field: "operatorSubjectId",
        sensitivity: "pseudonymous",
      }),
      expect.objectContaining({
        field: "hotspotId",
      }),
      expect.objectContaining({
        field: "divineAuthorityTier",
      }),
      expect.objectContaining({
        field: "hotspotSeverity",
      }),
      expect.objectContaining({
        field: "updatedAtIso",
        retention: "short-lived",
      }),
    ]);
  });

  it("creates a minimal seal-directive record", () => {
    const record = createDungeonSealDirectiveRecord({
      operatorSubjectId: "operator-sub-1",
      hotspotId: "hotspot-1",
      divineAuthorityTier: "seat",
      hotspotSeverity: "major",
      updatedAtIso: "2026-05-20T00:00:00.000Z",
    });

    expect(record.hotspotSeverity).toBe("major");
  });

  it("rejects malformed seal-directive identifiers and timestamps", () => {
    expect(() =>
      createDungeonSealDirectiveRecord({
        operatorSubjectId: " ",
        hotspotId: "hotspot-1",
        divineAuthorityTier: "seat",
        hotspotSeverity: "major",
        updatedAtIso: "2026-05-20T00:00:00.000Z",
      })
    ).toThrow("operatorSubjectId must be a non-empty string");

    expect(() =>
      createDungeonSealDirectiveRecord({
        operatorSubjectId: "operator-sub-1",
        hotspotId: "hotspot-1",
        divineAuthorityTier: "seat",
        hotspotSeverity: "major",
        updatedAtIso: "",
      })
    ).toThrow("updatedAtIso must be a non-empty string");

    expect(() =>
      createDungeonSealDirectiveRecord({
        operatorSubjectId: "operator-sub-1",
        hotspotId: "hotspot-1",
        divineAuthorityTier: "seat",
        hotspotSeverity: "major",
        updatedAtIso: "not-a-date",
      })
    ).toThrow("updatedAtIso must be an ISO-8601 timestamp");
  });

  it("rejects malformed dungeon prerequisites", () => {
    expect(() =>
      createDungeonAuthorityPrerequisites({
        disVerified: true,
        divineAuthorityTier: "seat",
        domainId: " ",
        domainAlignment: "aligned",
        sealClearance: "seal-authority",
        hotspotSeverity: "major",
      })
    ).toThrow("domainId must be a non-empty string");

    expect(() =>
      createDungeonAuthorityPrerequisites({
        disVerified: true,
        divineAuthorityTier: "seat",
        domainId: "domain.northern-rift",
        domainAlignment: "invalid" as never,
        sealClearance: "seal-authority",
        hotspotSeverity: "major",
      })
    ).toThrow(
      "domainAlignment must be a supported dungeon-crafting domain alignment state"
    );
  });

  it("rejects unsupported authority tiers or hotspot severity", () => {
    expect(isDivineAuthorityTier("seat")).toBe(true);
    expect(isDivineAuthorityTier("invalid")).toBe(false);
    expect(isChaosHotspotSeverity("minor")).toBe(true);
    expect(isChaosHotspotSeverity("invalid")).toBe(false);

    expect(() =>
      createDungeonSealDirectiveRecord({
        operatorSubjectId: "operator-sub-1",
        hotspotId: "hotspot-1",
        divineAuthorityTier: "invalid" as never,
        hotspotSeverity: "major",
        updatedAtIso: "2026-05-20T00:00:00.000Z",
      })
    ).toThrow(
      "divineAuthorityTier must be a supported dungeon-crafting authority tier"
    );

    expect(() =>
      createDungeonSealDirectiveRecord({
        operatorSubjectId: "operator-sub-1",
        hotspotId: "hotspot-1",
        divineAuthorityTier: "seat",
        hotspotSeverity: "invalid" as never,
        updatedAtIso: "2026-05-20T00:00:00.000Z",
      })
    ).toThrow(
      "hotspotSeverity must be a supported dungeon-crafting hotspot severity"
    );
  });

  it("validates positive throughput assumptions", () => {
    expect(defaultDungeonCraftingThroughputAssumptions.maxConcurrentSealOperations).toBe(
      800
    );

    const throughputAssumptions = createDungeonCraftingThroughputAssumptions({
      maxConcurrentSealOperations: 1_000,
      maxHotspotEvaluationsPerMinute: 7_500,
      maxDirectiveCommitsPerMinute: 14_000,
    });

    expect(throughputAssumptions.maxDirectiveCommitsPerMinute).toBe(14_000);
    expect(() =>
      createDungeonCraftingThroughputAssumptions({
        maxConcurrentSealOperations: 0,
        maxHotspotEvaluationsPerMinute: 7_500,
        maxDirectiveCommitsPerMinute: 14_000,
      })
    ).toThrow("maxConcurrentSealOperations must be a positive safe integer");
  });

  it("creates portable authority hosts", () => {
    const host = createPortableAuthorityHost({
      hostId: "seal-authority",
      runtime: "worker",
      transport: "queue",
      capabilityFlags: ["trace-linked"],
    });

    expect(host.runtime).toBe("worker");
    expect(() => {
      (host.capabilityFlags as string[]).push("mutate");
    }).toThrow();
  });

  it("rejects invalid portable authority hosts", () => {
    expect(() =>
      createPortableAuthorityHost({
        hostId: "",
        runtime: "worker",
        transport: "queue",
        capabilityFlags: ["trace-linked"],
      })
    ).toThrow("hostId must be a non-empty string");

    expect(() =>
      createPortableAuthorityHost({
        hostId: "seal-authority",
        runtime: "desktop" as never,
        transport: "queue",
        capabilityFlags: ["trace-linked"],
      })
    ).toThrow("runtime must be a supported authority host runtime");
  });

  it("creates recoverable failure policies", () => {
    const policy = createAuthorityFailurePolicy({
      timeoutMs: 1800,
      maxAttempts: 2,
      recoverableHotspotSeverities: ["minor", "major"],
      escalationTarget: "divine-seat",
    });

    expect(policy.maxAttempts).toBe(2);
    expect(Object.isFrozen(policy)).toBe(true);
  });

  it("creates Player System guidance handoffs without giving it execution authority", () => {
    const handoff = createDungeonGuidanceHandoff({
      authorityOwner: dungeonCraftingAuthorityBoundary.authorityOwner,
      featureFlagId: dungeonCraftingAuthorityBoundary.featureFlagId,
      guidanceSource: "player-system",
      domainId: "domain.northern-rift",
      domainAlignment: "aligned",
      readiness: "eligible",
      hotspotSeverity: "major",
      requestedAuthorityTier: "near-seat",
      handoffSummary:
        "Player System guidance has confirmed DIS and domain prerequisites and is yielding authority to dungeon-crafting.",
    });

    expect(handoff.guidanceSource).toBe("player-system");
    expect(handoff.requestedAuthorityTier).toBe("near-seat");
  });

  it("rejects invalid authority failure policies", () => {
    expect(() =>
      createAuthorityFailurePolicy({
        timeoutMs: 0,
        maxAttempts: 2,
        recoverableHotspotSeverities: ["minor", "major"],
        escalationTarget: "divine-seat",
      })
    ).toThrow("timeoutMs must be a positive safe integer");

    expect(() =>
      createAuthorityFailurePolicy({
        timeoutMs: 1800,
        maxAttempts: 2,
        recoverableHotspotSeverities: ["unknown" as never],
        escalationTarget: "divine-seat",
      })
    ).toThrow("recoverableHotspotSeverities contains an unsupported value");
  });

  it("creates dungeon authority boundary responses", () => {
    const response = createDungeonAuthorityBoundaryResponse({
      responseId: "response-1",
      divineAuthorityTier: "near-seat",
      hotspotSeverity: "major",
      outcome: "deferred",
      eligible: false,
      sourceHost: {
        hostId: "seal-authority",
        runtime: "worker",
        transport: "queue",
        capabilityFlags: ["trace-linked"],
      },
      failurePolicy: {
        timeoutMs: 1800,
        maxAttempts: 2,
        recoverableHotspotSeverities: ["minor", "major"],
        escalationTarget: "divine-seat",
      },
      observedAt: "2026-05-21T00:00:00.000Z",
    });

    expect(response.outcome).toBe("deferred");
    expect(response.failurePolicy.escalationTarget).toBe("divine-seat");
  });

  it("rejects invalid dungeon authority boundary responses", () => {
    expect(() =>
      createDungeonAuthorityBoundaryResponse({
        responseId: "response-1",
        divineAuthorityTier: "near-seat",
        hotspotSeverity: "major",
        outcome: "unknown" as never,
        eligible: false,
        sourceHost: {
          hostId: "seal-authority",
          runtime: "worker",
          transport: "queue",
          capabilityFlags: ["trace-linked"],
        },
        failurePolicy: {
          timeoutMs: 1800,
          maxAttempts: 2,
          recoverableHotspotSeverities: ["minor", "major"],
          escalationTarget: "divine-seat",
        },
        observedAt: "2026-05-21T00:00:00.000Z",
      })
    ).toThrow(
      "outcome must be a supported dungeon-crafting authority outcome"
    );

    expect(() =>
      createDungeonAuthorityBoundaryResponse({
        responseId: "response-1",
        divineAuthorityTier: "near-seat",
        hotspotSeverity: "major",
        outcome: "deferred",
        eligible: false,
        sourceHost: {
          hostId: "seal-authority",
          runtime: "worker",
          transport: "queue",
          capabilityFlags: ["trace-linked"],
        },
        failurePolicy: {
          timeoutMs: 1800,
          maxAttempts: 2,
          recoverableHotspotSeverities: ["minor", "major"],
          escalationTarget: "divine-seat",
        },
        observedAt: "2026-02-31T00:00:00.000Z",
      })
    ).toThrow("updatedAtIso must be an ISO-8601 timestamp");
  });
});
