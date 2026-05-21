export interface PackageDescriptor {
  readonly packageName: string;
  readonly featureFlagId: string;
  readonly envPrefix: string;
  readonly summary: string;
}

export type DivineAuthorityTier = "follower" | "near-seat" | "seat";

export type ChaosHotspotSeverity = "minor" | "major" | "catastrophic";

export type DungeonAuthorityOutcome = "granted" | "deferred" | "rejected";

export type AuthorityHostRuntime = "browser" | "server" | "worker";

export type AuthorityHostTransport = "in-process" | "http" | "queue";

export interface DungeonCraftingAccessState {
  readonly divineAuthorityTier: DivineAuthorityTier;
  readonly hotspotSeverity: ChaosHotspotSeverity;
  readonly eligible: boolean;
}

export interface PortableAuthorityHost {
  readonly hostId: string;
  readonly runtime: AuthorityHostRuntime;
  readonly transport: AuthorityHostTransport;
  readonly capabilityFlags: readonly string[];
}

export interface AuthorityFailurePolicy {
  readonly timeoutMs: number;
  readonly maxAttempts: number;
  readonly recoverableHotspotSeverities: readonly ChaosHotspotSeverity[];
  readonly escalationTarget: "operator" | "divine-seat" | "sealed-fallback";
}

export interface DungeonAuthorityBoundaryResponse {
  readonly responseId: string;
  readonly divineAuthorityTier: DivineAuthorityTier;
  readonly hotspotSeverity: ChaosHotspotSeverity;
  readonly outcome: DungeonAuthorityOutcome;
  readonly eligible: boolean;
  readonly sourceHost: PortableAuthorityHost;
  readonly failurePolicy: AuthorityFailurePolicy;
  readonly observedAt: string;
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

function freezeReadonlyArray<T>(items: readonly T[]): readonly T[] {
  return Object.freeze([...items]);
}

export function createDungeonCraftingAccessState(
  input: DungeonCraftingAccessState
): DungeonCraftingAccessState {
  return Object.freeze({ ...input });
}

export function createPortableAuthorityHost(
  input: PortableAuthorityHost
): PortableAuthorityHost {
  return Object.freeze({
    ...input,
    capabilityFlags: freezeReadonlyArray(input.capabilityFlags),
  });
}

export function createAuthorityFailurePolicy(
  input: AuthorityFailurePolicy
): AuthorityFailurePolicy {
  return Object.freeze({
    ...input,
    recoverableHotspotSeverities: freezeReadonlyArray(
      input.recoverableHotspotSeverities
    ),
  });
}

export function createDungeonAuthorityBoundaryResponse(
  input: DungeonAuthorityBoundaryResponse
): DungeonAuthorityBoundaryResponse {
  return Object.freeze({
    ...input,
    sourceHost: createPortableAuthorityHost(input.sourceHost),
    failurePolicy: createAuthorityFailurePolicy(input.failurePolicy),
  });
}
