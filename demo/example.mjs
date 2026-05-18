import { createDungeonCraftingAccessState, packageDescriptor } from "../dist/index.js";

const state = createDungeonCraftingAccessState({
  divineAuthorityTier: "near-seat",
  hotspotSeverity: "major",
  eligible: true,
});

console.log(packageDescriptor);
console.log(state);
