import {
  DUNGEON_CRAFTING_FEATURE_FLAG_ID,
  createDungeonCraftingAccessState,
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
});
