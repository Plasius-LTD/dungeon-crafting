import {
  DUNGEON_CRAFTING_FEATURE_FLAG_ID,
  createAuthorityFailurePolicy,
  createDungeonAuthorityBoundaryResponse,
  createDungeonCraftingAccessState,
  createPortableAuthorityHost,
  packageDescriptor,
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
});
