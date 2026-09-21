"use client";

import { useState } from "react";
import { site } from "@/content/site";

/**
 * Registration form for THE ROOTS.
 *
 * There is deliberately no backend wired up yet: capturing email addresses
 * with nowhere lawful to store them would be worse than not capturing them.
 * Submitting reports honestly that the list is not open rather than pretending
 * to succeed. Connect a provider + consent record before enabling — see
 * strategy/NEXT-ACTIONS.md.
 */
export function JoinRoots({ compact = false }: { compact?: boolean }) {
  const [email, setEmail] = useState("");
  const [state, setState] = useState<"idle" | "unavailable">("idle");

  return (
    <form
      className={`join ${compact ? "join--compact" : ""}`.trim()}
      onSubmit={(e) => {
        e.preventDefault();
        setState("unavailable");
      }}
      noValidate
    >
      <div className="join__row">
        <label htmlFor="roots-email" className="visually-hidden">
          Email address
        </label>
        <input
          id="roots-email"
          type="email"
          name="email"
          className="join__input"
          placeholder="Email address"
          autoComplete="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <button type="submit" className="btn">
          Join {site.community}
        </button>
      </div>

      <p className="join__note meta" role="status">
        {state === "unavailable"
          ? "Registration is not open yet. No address was stored — there is no list to store it in. Chapter 001 has not opened."
          : "Free. No purchase. We will tell you what we are making and why, and nothing else."}
      </p>
    </form>
  );
}
