"use client";

import { useState } from "react";
import { CONSENT_TERMS, KINDS, type MemorySubmission } from "@/content/community";
import { track } from "@/lib/analytics";

type Errors = Partial<Record<"title" | "body" | "kind" | "consent" | "contributor", string>>;

/**
 * WHAT DO YOU CARRY? — the submission flow.
 *
 * There is no backend, and that is deliberate: this form will not pretend to
 * accept a family's memory when there is nowhere lawful to keep it and no
 * named moderator to read it. It validates fully, then tells the truth about
 * what happened. See strategy/NEXT-ACTIONS.md P0.
 */
export function CarryForm() {
  const [kind, setKind] = useState<MemorySubmission["kind"] | "">("");
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [location, setLocation] = useState("");
  const [attribution, setAttribution] = useState<MemorySubmission["attribution"]>("named");
  const [contributor, setContributor] = useState("");
  const [consent, setConsent] = useState(false);
  const [errors, setErrors] = useState<Errors>({});
  const [state, setState] = useState<"idle" | "checking" | "not-open">("idle");
  const [touched, setTouched] = useState(false);

  const validate = (): Errors => {
    const e: Errors = {};
    if (!kind) e.kind = "Choose what you are carrying.";
    if (title.trim().length < 3) e.title = "Give it a short title — three characters or more.";
    if (body.trim().length < 40)
      e.body = `Tell us a little more. ${Math.max(0, 40 - body.trim().length)} characters to go.`;
    if (attribution === "named" && contributor.trim().length < 2)
      e.contributor = "Add the name you want credited, or choose initials or anonymous.";
    if (!consent) e.consent = "We need your permission before a person reads this.";
    return e;
  };

  const onSubmit = (ev: React.FormEvent) => {
    ev.preventDefault();
    setTouched(true);
    const found = validate();
    setErrors(found);
    if (Object.keys(found).length > 0) {
      // Move focus to the first problem so a keyboard user is not stranded.
      const first = document.querySelector<HTMLElement>("[data-invalid='true']");
      first?.focus();
      return;
    }
    setState("checking");
    track("carry_submitted", { kind: kind || "unknown", attribution });
    window.setTimeout(() => setState("not-open"), 550);
  };

  const err = (k: keyof Errors) => (touched ? errors[k] : undefined);

  if (state === "not-open") {
    return (
      <div className="formstate" role="status">
        <p className="display d4">NOTHING WAS STORED.</p>
        <p className="lead muted" style={{ paddingTop: "var(--s-5)", maxWidth: "58ch" }}>
          Submissions are not open yet, and your words were not saved or sent
          anywhere. We would rather tell you that than quietly keep a family
          memory in a system that has no moderator reading it and no way for you
          to take it back.
        </p>
        <p className="muted" style={{ paddingTop: "var(--s-4)", maxWidth: "58ch" }}>
          What has to exist first: a named person who reads every submission, a
          published privacy policy, and a withdrawal route that works after
          publication. Join THE ROOTS and we will tell you the day it opens.
        </p>
        <p style={{ paddingTop: "var(--s-6)" }}>
          <button
            type="button"
            className="btn btn--ghost"
            onClick={() => {
              setState("idle");
              setTouched(false);
            }}
          >
            Back to the form
          </button>
        </p>
      </div>
    );
  }

  return (
    <form className="carry" onSubmit={onSubmit} noValidate>
      <fieldset className="field-group">
        <legend className="field-legend">What are you carrying?</legend>
        <div className="chips" data-invalid={Boolean(err("kind"))}>
          {KINDS.map((k) => (
            <button
              key={k.value}
              type="button"
              className="chip"
              aria-pressed={kind === k.value}
              onClick={() => {
                setKind(k.value);
                track("carry_started", { kind: k.value });
              }}
            >
              {k.label}
            </button>
          ))}
        </div>
        {err("kind") ? <p className="field-error">{errors.kind}</p> : null}
      </fieldset>

      <div className="field-group">
        <label className="field-label" htmlFor="carry-title">
          Title
        </label>
        <input
          id="carry-title"
          className="field"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          data-invalid={Boolean(err("title"))}
          aria-describedby={err("title") ? "carry-title-err" : undefined}
        />
        {err("title") ? (
          <p className="field-error" id="carry-title-err">
            {errors.title}
          </p>
        ) : null}
      </div>

      <div className="field-group">
        <label className="field-label" htmlFor="carry-body">
          The story
        </label>
        <textarea
          id="carry-body"
          className="field field--area"
          rows={7}
          value={body}
          onChange={(e) => setBody(e.target.value)}
          data-invalid={Boolean(err("body"))}
          aria-describedby="carry-body-help"
        />
        <p className="field-help" id="carry-body-help">
          {body.trim().length} characters. No length limit — say it the way you
          would say it out loud.
        </p>
        {err("body") ? <p className="field-error">{errors.body}</p> : null}
      </div>

      <div className="field-group">
        <label className="field-label" htmlFor="carry-location">
          Place <span className="field-optional">optional</span>
        </label>
        <input
          id="carry-location"
          className="field"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
          placeholder="A town, a village, a street"
        />
      </div>

      <fieldset className="field-group">
        <legend className="field-legend">How should you be credited?</legend>
        <div className="chips">
          {(
            [
              ["named", "By name"],
              ["initials", "Initials only"],
              ["anonymous", "Anonymously"],
            ] as const
          ).map(([value, label]) => (
            <button
              key={value}
              type="button"
              className="chip"
              aria-pressed={attribution === value}
              onClick={() => setAttribution(value)}
            >
              {label}
            </button>
          ))}
        </div>
        {attribution !== "anonymous" ? (
          <>
            <label className="field-label" htmlFor="carry-name" style={{ paddingTop: "var(--s-4)" }}>
              {attribution === "named" ? "Your name" : "Your initials"}
            </label>
            <input
              id="carry-name"
              className="field"
              value={contributor}
              onChange={(e) => setContributor(e.target.value)}
              data-invalid={Boolean(err("contributor"))}
            />
            {err("contributor") ? <p className="field-error">{errors.contributor}</p> : null}
          </>
        ) : null}
      </fieldset>

      <div className="field-group consent">
        <p className="field-legend">Before a person reads this</p>
        <ul className="consent__list">
          {CONSENT_TERMS.map((t) => (
            <li key={t.slice(0, 24)}>{t}</li>
          ))}
        </ul>
        <label className="consent__check" data-invalid={Boolean(err("consent"))}>
          <input
            type="checkbox"
            checked={consent}
            onChange={(e) => setConsent(e.target.checked)}
          />
          <span>I have read this and I give permission.</span>
        </label>
        {err("consent") ? <p className="field-error">{errors.consent}</p> : null}
      </div>

      <p>
        <button type="submit" className="btn" disabled={state === "checking"}>
          {state === "checking" ? "Checking…" : "Send to the archive"}
        </button>
      </p>
    </form>
  );
}
