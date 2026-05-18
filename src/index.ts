export interface PackageDescriptor {
  readonly packageName: string;
  readonly featureFlagId: string;
  readonly envPrefix: string;
  readonly summary: string;
}

export type DivineAuthorityTier = "follower" | "near-seat" | "seat";

export type ChaosHotspotSeverity = "minor" | "major" | "catastrophic";

export interface DungeonCraftingAccessState {
  readonly divineAuthorityTier: DivineAuthorityTier;
  readonly hotspotSeverity: ChaosHotspotSeverity;
  readonly eligible: boolean;
}

export const DUNGEON_CRAFTING_PACKAGE = "@plasius/dungeon-crafting";
export const DUNGEON_CRAFTING_ENV_PREFIX = "DUNGEON_CRAFTING";
export const DUNGEON_CRAFTING_FEATURE_FLAG_ID = "isekai.dungeon-crafting.enabled";

export const packageDescriptor: PackageDescriptor = Object.freeze({
  packageName: DUNGEON_CRAFTING_PACKAGE,
  featureFlagId: DUNGEON_CRAFTING_FEATURE_FLAG_ID,
  envPrefix: DUNGEON_CRAFTING_ENV_PREFIX,
  summary:
    "DIS-gated dungeon-crafting and chaos-sealing authority contracts for Plasius.",
});

export function createDungeonCraftingAccessState(
  input: DungeonCraftingAccessState
): DungeonCraftingAccessState {
  return Object.freeze({ ...input });
}
