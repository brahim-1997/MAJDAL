/**
 * Community data models.
 *
 * Typed now so the shape is fixed before a backend exists. Nothing here is
 * persisted: no submission is stored, because storing other people's family
 * memory without a lawful basis, a named moderator and a withdrawal route
 * would be worse than not collecting it. See strategy/COMMUNITY-THE-ROOTS.md.
 */

export type ModerationState =
  | "received"
  | "in-review"
  | "published"
  | "declined"
  | "withdrawn";

export type Attribution = "named" | "initials" | "anonymous";

export type MemorySubmission = {
  id: string;
  title: string;
  body: string;
  /** What kind of thing is carried. */
  kind: "object" | "photograph" | "place" | "name" | "story" | "textile" | "other";
  location?: string;
  contributor?: string;
  attribution: Attribution;
  /** Explicit, recorded, and required before anything is reviewed. */
  consent: { publish: boolean; contact: boolean; recordedAt: string };
  state: ModerationState;
  receivedAt: string;
  /** Set when a contributor withdraws, including after publication. */
  withdrawnAt?: string;
};

export type CommunityMember = {
  id: string;
  email: string;
  joinedAt: string;
  consent: { updates: boolean; recordedAt: string };
  contributions: string[];
};

/** What a contributor is agreeing to. Shown in full, never behind a link. */
export const CONSENT_TERMS = [
  "MAJDAL may publish what you send in THE MAJDAL ARCHIVE, on this website.",
  "You keep ownership of your story, your words and your images. You are giving permission to publish, not transferring rights.",
  "You choose how you are credited: by name, by initials, or anonymously.",
  "You can withdraw at any time, including after publication, and it will be removed.",
  "Submitting does not guarantee publication. Every submission is read by a person first.",
  "Do not send anything that belongs to someone else without their permission.",
] as const;

export const KINDS: { value: MemorySubmission["kind"]; label: string }[] = [
  { value: "object", label: "An object" },
  { value: "photograph", label: "A photograph" },
  { value: "place", label: "A place" },
  { value: "name", label: "A name" },
  { value: "story", label: "A family story" },
  { value: "textile", label: "A textile" },
  { value: "other", label: "Something else" },
];
