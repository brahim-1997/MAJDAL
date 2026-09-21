"use client";

import { useState } from "react";
import Link from "next/link";
import { site } from "@/content/site";
import { track } from "@/lib/analytics";

type State = "idle" | "checking" | "invalid" | "not-open";

/**
 * Registration for THE ROOTS.
 *
 * Validates properly, then reports honestly that the list is not open. No
 * address is stored, because capturing email with no privacy policy, no
 * consent record and no way to unsubscribe would be worse than not capturing
 * it. Connect a provider once those exist — strategy/NEXT-ACTIONS.md P1.
 */
export function JoinRoots({ compact = false }: { compact?: boolean }) {
  const [email, setEmail] = useState("");
  const [consent, setConsent] = useState(false);
  const [state, setState] = useState<State>("idle");
  const [error, setError] = useState("");

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const value = email.trim();
    if (!value) {
      setError("Add an email address.");
      setState("invalid");
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(value)) {
      setError("That does not look like an email address.");
      setState("invalid");
      return;
    }
    if (!consent) {
      setError("Tick the box so we know you want to hear from us.");
      setState("invalid");
      return;
    }
    setError("");
    setState("checking");
    track("join_roots_attempt");
    window.setTimeout(() => setState("not-open"), 500);
  };

  if (state === "not-open") {
    return (
      <div className="formstate" role="status">
        <p className="display d5">THE LIST IS NOT OPEN.</p>
        <p className="muted" style={{ paddingTop: "var(--s-4)", maxWidth: "52ch" }}>
          Your address was not stored — there is nowhere lawful to keep it yet.
          A privacy policy and a working unsubscribe have to exist before this
          brand collects anything from anyone.
        </p>
        <p className="muted" style={{ paddingTop: "var(--s-4)", maxWidth: "52ch" }}>
          Chapter 001 has not opened, so nothing has been missed.{" "}
          <Link href="/legal/privacy" className="link">
            Our privacy position
          </Link>
          .
        </p>
        <p style={{ paddingTop: "var(--s-5)" }}>
          <button
            type="button"
            className="btn btn--ghost"
            onClick={() => setState("idle")}
          >
            Back
          </button>
        </p>
      </div>
    );
  }

  return (
    <form
      className={`join ${compact ? "join--compact" : ""}`.trim()}
      onSubmit={submit}
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
          className="field join__input"
          placeholder="Email address"
          autoComplete="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          data-invalid={state === "invalid" && !consent === false}
          aria-describedby="roots-note"
          aria-invalid={state === "invalid"}
        />
        <button type="submit" className="btn" disabled={state === "checking"}>
          {state === "checking" ? "Checking…" : `Join ${site.community}`}
        </button>
      </div>

      <label className="consent__check" style={{ borderTop: 0, paddingTop: "var(--s-4)" }}>
        <input
          type="checkbox"
          checked={consent}
          onChange={(e) => setConsent(e.target.checked)}
        />
        <span className="muted" style={{ fontSize: "var(--step--1)", lineHeight: 1.5 }}>
          Tell me what MAJDAL is making and why. Nothing else, and never sold or
          shared.
        </span>
      </label>

      {state === "invalid" ? (
        <p className="field-error" role="alert">
          {error}
        </p>
      ) : null}

      <p className="join__note meta" id="roots-note">
        Free. No purchase. Your place in THE ROOTS is never improved by spending
        money.
      </p>
    </form>
  );
}
