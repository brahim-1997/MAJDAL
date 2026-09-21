/**
 * Typed event contract.
 *
 * No provider is connected, and none will be before a privacy policy and a
 * consent mechanism exist — see strategy/ANALYTICS.md. Until then this queues
 * events in memory so the call sites are real and can be verified, and nothing
 * leaves the browser.
 */

export type EventName =
  | "archive_open"
  | "archive_filter"
  | "map_open"
  | "map_location_open"
  | "thread_traced"
  | "chapter_open"
  | "product_view"
  | "join_roots_attempt"
  | "carry_started"
  | "carry_submitted"
  | "impact_view";

type Payload = Record<string, string | number | boolean>;

const queue: { name: EventName; payload?: Payload; at: number }[] = [];

export function track(name: EventName, payload?: Payload): void {
  // Deliberately local. Wire a privacy-first provider here once consent exists.
  queue.push({ name, payload, at: Date.now() });
  if (typeof window !== "undefined") {
    (window as unknown as { __majdalEvents?: typeof queue }).__majdalEvents = queue;
  }
}

export const peekEvents = () => [...queue];
