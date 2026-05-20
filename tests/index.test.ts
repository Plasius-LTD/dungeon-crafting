import {
  DUNGEON_CRAFTING_FEATURE_FLAG_ID,
  createDungeonCraftingAccessState,
  createDungeonCraftingThroughputAssumptions,
  createDungeonSealDirectiveRecord,
  defaultDungeonCraftingThroughputAssumptions,
  dungeonCraftingFieldPolicies,
  dungeonCraftingPrivacyScaleRollout,
  isChaosHotspotSeverity,
  isDivineAuthorityTier,
  packageDescriptor,
  DUNGEON_CRAFTING_PRIVACY_SCALE_FEATURE_FLAG_ID,
} from "../src/index.js";

describe("@plasius/dungeon-crafting", () => {
  it("exports the package descriptor", () => {
    expect(packageDescriptor.packageName).toBe("@plasius/dungeon-crafting");
    expect(packageDescriptor.featureFlagId).toBe(DUNGEON_CRAFTING_FEATURE_FLAG_ID);
  });

  it("creates dungeon-crafting access state", () => {
    const state = createDungeonCraftingAccessState({
      divineAuthorityTier: "seat",
      hotspotSeverity: "major",
      eligible: true,
    });

    expect(state.eligible).toBe(true);
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
});
