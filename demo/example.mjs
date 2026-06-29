import {
  createDungeonAuthorityPrerequisites,
  createDungeonCraftingAccessState,
  createDungeonGuidanceHandoff,
  dungeonCraftingAuthorityBoundary,
  packageDescriptor,
} from "../dist/index.js";

const state = createDungeonCraftingAccessState({
  divineAuthorityTier: "near-seat",
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
    "Player System guidance has verified DIS and domain prerequisites and is yielding authority to dungeon-crafting.",
});

console.log(packageDescriptor);
console.log(state);
console.log(prerequisites);
console.log(handoff);
