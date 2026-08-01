export interface PackageDescriptor {
  readonly packageName: string;
  readonly featureFlagId: string;
  readonly envPrefix: string;
  readonly summary: string;
}

export interface RolloutDescriptor {
  readonly featureFlagId: string;
  readonly envOverride: string;
  readonly rollbackPlan: string;
  readonly summary: string;
}

export type DungeonAuthorityOwner = "dungeon-crafting";
export type DivineAuthorityTier = "follower" | "near-seat" | "seat";
export type ChaosHotspotSeverity = "minor" | "major" | "catastrophic";
export type DomainAlignmentState = "aligned" | "contested" | "sealed";
export type ChaosSealClearance =
  | "hotspot-watch"
  | "seal-authority"
  | "seat-override";
export type DungeonGuidanceSource =
  | "player-system"
  | "arena-orchestrator"
  | "event-orchestrator"
  | "regional-governor";
export type DungeonHandoffReadiness =
  | "eligible"
  | "needs-domain-clearance"
  | "blocked";
export type DungeonCraftingFieldSensitivity = "pseudonymous" | "internal";
export type DungeonCraftingFieldRetention =
  | "authoritative-sealing"
  | "short-lived";

export type DungeonAuthorityOutcome = "granted" | "deferred" | "rejected";

export type AuthorityHostRuntime = "browser" | "server" | "worker";

export type AuthorityHostTransport = "in-process" | "http" | "queue";

export interface DungeonAuthorityBoundary {
  readonly authorityOwner: DungeonAuthorityOwner;
  readonly featureFlagId: string;
  readonly entryGate: "dis-verified";
  readonly guidanceSources: readonly DungeonGuidanceSource[];
  readonly prerequisiteKinds: readonly [
    "divine-authority",
    "domain-alignment",
    "chaos-hotspot-sealing",
  ];
  readonly validationAuthority: DungeonAuthorityOwner;
  readonly executionAuthority: DungeonAuthorityOwner;
}

export interface DungeonCraftingAccessState {
  readonly divineAuthorityTier: DivineAuthorityTier;
  readonly hotspotSeverity: ChaosHotspotSeverity;
  readonly eligible: boolean;
}

export interface DungeonAuthorityPrerequisites {
  readonly disVerified: boolean;
  readonly divineAuthorityTier: DivineAuthorityTier;
  readonly domainId: string;
  readonly domainAlignment: DomainAlignmentState;
  readonly sealClearance: ChaosSealClearance;
  readonly hotspotSeverity: ChaosHotspotSeverity;
}

export interface DungeonGuidanceHandoff {
  readonly authorityOwner: DungeonAuthorityOwner;
  readonly featureFlagId: string;
  readonly guidanceSource: DungeonGuidanceSource;
  readonly domainId: string;
  readonly domainAlignment: DomainAlignmentState;
  readonly readiness: DungeonHandoffReadiness;
  readonly hotspotSeverity: ChaosHotspotSeverity;
  readonly requestedAuthorityTier: DivineAuthorityTier;
  readonly handoffSummary: string;
}

export interface DungeonSealDirectiveRecord {
  readonly operatorSubjectId: string;
  readonly hotspotId: string;
  readonly divineAuthorityTier: DivineAuthorityTier;
  readonly hotspotSeverity: ChaosHotspotSeverity;
  readonly updatedAtIso: string;
}

export interface DungeonCraftingFieldPolicy {
  readonly field: keyof DungeonSealDirectiveRecord;
  readonly sensitivity: DungeonCraftingFieldSensitivity;
  readonly retention: DungeonCraftingFieldRetention;
  readonly justification: string;
}

export interface DungeonCraftingThroughputAssumptions {
  readonly maxConcurrentSealOperations: number;
  readonly maxHotspotEvaluationsPerMinute: number;
  readonly maxDirectiveCommitsPerMinute: number;
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
const DUNGEON_GUIDANCE_SOURCES = Object.freeze([
  "player-system",
  "arena-orchestrator",
  "event-orchestrator",
  "regional-governor",
] as const);
export const DUNGEON_CRAFTING_PRIVACY_SCALE_FEATURE_FLAG_ID =
  "isekai.training-progression.privacy-scale.enabled";
export const DUNGEON_CRAFTING_PRIVACY_SCALE_ENV_OVERRIDE =
  "DUNGEON_CRAFTING_PRIVACY_SCALE_ENABLED";

export const packageDescriptor: PackageDescriptor = Object.freeze({
  packageName: DUNGEON_CRAFTING_PACKAGE,
  featureFlagId: DUNGEON_CRAFTING_FEATURE_FLAG_ID,
  envPrefix: DUNGEON_CRAFTING_ENV_PREFIX,
  summary:
    "DIS-gated dungeon-crafting and chaos-sealing authority contracts for Plasius.",
});

export const dungeonCraftingAuthorityBoundary: DungeonAuthorityBoundary =
  Object.freeze({
    authorityOwner: "dungeon-crafting",
    featureFlagId: DUNGEON_CRAFTING_FEATURE_FLAG_ID,
    entryGate: "dis-verified",
    guidanceSources: DUNGEON_GUIDANCE_SOURCES,
    prerequisiteKinds: Object.freeze([
      "divine-authority",
      "domain-alignment",
      "chaos-hotspot-sealing",
    ] as const),
    validationAuthority: "dungeon-crafting",
    executionAuthority: "dungeon-crafting",
  });

export const dungeonCraftingPrivacyScaleRollout: RolloutDescriptor =
  Object.freeze({
    featureFlagId: DUNGEON_CRAFTING_PRIVACY_SCALE_FEATURE_FLAG_ID,
    envOverride: DUNGEON_CRAFTING_PRIVACY_SCALE_ENV_OVERRIDE,
    rollbackPlan:
      "Disable the dungeon-crafting privacy/scale rollout to fall back to the existing chaos-sealing access contract surface.",
    summary:
      "Rolls out minimal seal-directive payloads and documented hotspot throughput assumptions.",
  });

export const dungeonCraftingFieldPolicies = Object.freeze<
  readonly DungeonCraftingFieldPolicy[]
>([
  {
    field: "operatorSubjectId",
    sensitivity: "pseudonymous",
    retention: "authoritative-sealing",
    justification:
      "Stable pseudonymous subject identifier is required to attribute sealing authority without carrying profile names or contact data.",
  },
  {
    field: "hotspotId",
    sensitivity: "internal",
    retention: "authoritative-sealing",
    justification:
      "Hotspot identifier is the minimum routing key needed to coordinate chaos-sealing directives.",
  },
  {
    field: "divineAuthorityTier",
    sensitivity: "internal",
    retention: "authoritative-sealing",
    justification:
      "Authority tier is the smallest access-state field needed to validate whether a sealing directive may execute.",
  },
  {
    field: "hotspotSeverity",
    sensitivity: "internal",
    retention: "authoritative-sealing",
    justification:
      "Hotspot severity determines sealing urgency and throughput budgeting without duplicating full dungeon telemetry.",
  },
  {
    field: "updatedAtIso",
    sensitivity: "internal",
    retention: "short-lived",
    justification:
      "Update timestamp supports bounded ordering and replay protection for rapid hotspot updates.",
  },
]);

export const defaultDungeonCraftingThroughputAssumptions: DungeonCraftingThroughputAssumptions =
  Object.freeze({
    maxConcurrentSealOperations: 800,
    maxHotspotEvaluationsPerMinute: 6_000,
    maxDirectiveCommitsPerMinute: 12_000,
  });

export function isDivineAuthorityTier(
  value: string
): value is DivineAuthorityTier {
  return value === "follower" || value === "near-seat" || value === "seat";
}

export function isChaosHotspotSeverity(
  value: string
): value is ChaosHotspotSeverity {
  return value === "minor" || value === "major" || value === "catastrophic";
}

export function isDomainAlignmentState(
  value: string
): value is DomainAlignmentState {
  return value === "aligned" || value === "contested" || value === "sealed";
}

function freezeReadonlyArray<T>(items: readonly T[]): readonly T[] {
  return Object.freeze([...items]);
}

export function createDungeonCraftingAccessState(
  input: DungeonCraftingAccessState
): DungeonCraftingAccessState {
  if (!isDivineAuthorityTier(input.divineAuthorityTier)) {
    throw new Error(
      "divineAuthorityTier must be a supported dungeon-crafting authority tier"
    );
  }

  if (!isChaosHotspotSeverity(input.hotspotSeverity)) {
    throw new Error(
      "hotspotSeverity must be a supported dungeon-crafting hotspot severity"
    );
  }

  return Object.freeze({ ...input });
}

export function createDungeonAuthorityPrerequisites(
  input: DungeonAuthorityPrerequisites
): DungeonAuthorityPrerequisites {
  assertNonEmptyString(input.domainId, "domainId");

  if (!isDivineAuthorityTier(input.divineAuthorityTier)) {
    throw new Error(
      "divineAuthorityTier must be a supported dungeon-crafting authority tier"
    );
  }

  if (!isDomainAlignmentState(input.domainAlignment)) {
    throw new Error(
      "domainAlignment must be a supported dungeon-crafting domain alignment state"
    );
  }

  if (!isChaosHotspotSeverity(input.hotspotSeverity)) {
    throw new Error(
      "hotspotSeverity must be a supported dungeon-crafting hotspot severity"
    );
  }

  return Object.freeze({ ...input });
}

function assertNonEmptyString(value: string, label: string): void {
  if (value.trim().length === 0) {
    throw new Error(`${label} must be a non-empty string`);
  }
}

function assertPositiveSafeInteger(value: number, label: string): void {
  if (!Number.isSafeInteger(value) || value <= 0) {
    throw new Error(`${label} must be a positive safe integer`);
  }
}

const iso8601DateRegex =
  /^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2}):(\d{2})(?:\.\d{1,9})?(?:Z|[+-]\d{2}:\d{2})$/;

function assertValidUpdatedAtIso(value: string): void {
  const match = iso8601DateRegex.exec(value);

  if (!match || Number.isNaN(Date.parse(value))) {
    throw new Error("updatedAtIso must be an ISO-8601 timestamp");
  }

  const [, yearRaw, monthRaw, dayRaw, hourRaw, minuteRaw, secondRaw] = match;
  const year = Number(yearRaw);
  const month = Number(monthRaw);
  const day = Number(dayRaw);
  const hour = Number(hourRaw);
  const minute = Number(minuteRaw);
  const second = Number(secondRaw);
  const daysInMonth = new Date(Date.UTC(year, month, 0)).getUTCDate();

  if (
    month < 1
    || month > 12
    || day < 1
    || day > daysInMonth
    || hour > 23
    || minute > 59
    || second > 59
  ) {
    throw new Error("updatedAtIso must be an ISO-8601 timestamp");
  }
}

function isAuthorityHostRuntime(value: string): value is AuthorityHostRuntime {
  return value === "browser" || value === "server" || value === "worker";
}

function isAuthorityHostTransport(
  value: string
): value is AuthorityHostTransport {
  return value === "in-process" || value === "http" || value === "queue";
}

function isDungeonAuthorityOutcome(
  value: string
): value is DungeonAuthorityOutcome {
  return value === "granted" || value === "deferred" || value === "rejected";
}

function isEscalationTarget(
  value: string
): value is AuthorityFailurePolicy["escalationTarget"] {
  return value === "operator" || value === "divine-seat" || value === "sealed-fallback";
}

function assertNonEmptyStringArray(
  values: readonly string[],
  label: string
): readonly string[] {
  for (const value of values) {
    assertNonEmptyString(value, `${label} entry`);
  }

  return freezeReadonlyArray(values);
}

export function createDungeonSealDirectiveRecord(
  input: DungeonSealDirectiveRecord
): DungeonSealDirectiveRecord {
  assertNonEmptyString(input.operatorSubjectId, "operatorSubjectId");
  assertNonEmptyString(input.hotspotId, "hotspotId");
  assertNonEmptyString(input.updatedAtIso, "updatedAtIso");
  assertValidUpdatedAtIso(input.updatedAtIso);

  if (!isDivineAuthorityTier(input.divineAuthorityTier)) {
    throw new Error(
      "divineAuthorityTier must be a supported dungeon-crafting authority tier"
    );
  }

  if (!isChaosHotspotSeverity(input.hotspotSeverity)) {
    throw new Error(
      "hotspotSeverity must be a supported dungeon-crafting hotspot severity"
    );
  }

  return Object.freeze({ ...input });
}

export function createDungeonCraftingThroughputAssumptions(
  input: DungeonCraftingThroughputAssumptions
): DungeonCraftingThroughputAssumptions {
  assertPositiveSafeInteger(
    input.maxConcurrentSealOperations,
    "maxConcurrentSealOperations"
  );
  assertPositiveSafeInteger(
    input.maxHotspotEvaluationsPerMinute,
    "maxHotspotEvaluationsPerMinute"
  );
  assertPositiveSafeInteger(
    input.maxDirectiveCommitsPerMinute,
    "maxDirectiveCommitsPerMinute"
  );

  return Object.freeze({ ...input });
}

export function createPortableAuthorityHost(
  input: PortableAuthorityHost
): PortableAuthorityHost {
  assertNonEmptyString(input.hostId, "hostId");

  if (!isAuthorityHostRuntime(input.runtime)) {
    throw new Error("runtime must be a supported authority host runtime");
  }

  if (!isAuthorityHostTransport(input.transport)) {
    throw new Error("transport must be a supported authority host transport");
  }

  return Object.freeze({
    ...input,
    capabilityFlags: assertNonEmptyStringArray(
      input.capabilityFlags,
      "capabilityFlags"
    ),
  });
}

export function createAuthorityFailurePolicy(
  input: AuthorityFailurePolicy
): AuthorityFailurePolicy {
  assertPositiveSafeInteger(input.timeoutMs, "timeoutMs");
  assertPositiveSafeInteger(input.maxAttempts, "maxAttempts");

  if (!isEscalationTarget(input.escalationTarget)) {
    throw new Error("escalationTarget must be a supported authority escalation target");
  }

  if (!Array.isArray(input.recoverableHotspotSeverities)) {
    throw new Error(
      "recoverableHotspotSeverities must be an array of supported hotspot severities"
    );
  }

  const recoverableHotspotSeverities = input.recoverableHotspotSeverities.map(
    (severity) => {
      if (!isChaosHotspotSeverity(severity)) {
        throw new Error(
          "recoverableHotspotSeverities contains an unsupported value"
        );
      }

      return severity;
    }
  );

  return Object.freeze({
    ...input,
    recoverableHotspotSeverities: freezeReadonlyArray(
      recoverableHotspotSeverities
    ),
  });
}

export function createDungeonGuidanceHandoff(
  input: DungeonGuidanceHandoff
): DungeonGuidanceHandoff {
  assertNonEmptyString(input.domainId, "domainId");
  assertNonEmptyString(input.handoffSummary, "handoffSummary");

  if (!isDomainAlignmentState(input.domainAlignment)) {
    throw new Error(
      "domainAlignment must be a supported dungeon-crafting domain alignment state"
    );
  }

  if (!isDivineAuthorityTier(input.requestedAuthorityTier)) {
    throw new Error(
      "requestedAuthorityTier must be a supported dungeon-crafting authority tier"
    );
  }

  if (!isChaosHotspotSeverity(input.hotspotSeverity)) {
    throw new Error(
      "hotspotSeverity must be a supported dungeon-crafting hotspot severity"
    );
  }

  return Object.freeze({ ...input });
}

export function createDungeonAuthorityBoundaryResponse(
  input: DungeonAuthorityBoundaryResponse
): DungeonAuthorityBoundaryResponse {
  assertNonEmptyString(input.responseId, "responseId");
  assertNonEmptyString(input.observedAt, "observedAt");
  assertValidUpdatedAtIso(input.observedAt);

  if (!isDivineAuthorityTier(input.divineAuthorityTier)) {
    throw new Error(
      "divineAuthorityTier must be a supported dungeon-crafting authority tier"
    );
  }

  if (!isChaosHotspotSeverity(input.hotspotSeverity)) {
    throw new Error(
      "hotspotSeverity must be a supported dungeon-crafting hotspot severity"
    );
  }

  if (!isDungeonAuthorityOutcome(input.outcome)) {
    throw new Error(
      "outcome must be a supported dungeon-crafting authority outcome"
    );
  }

  return Object.freeze({
    ...input,
    sourceHost: createPortableAuthorityHost(input.sourceHost),
    failurePolicy: createAuthorityFailurePolicy(input.failurePolicy),
  });
}
