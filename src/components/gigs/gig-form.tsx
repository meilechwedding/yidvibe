"use client";

import { gigTypes, gigFormCopy } from "@/content/forms/gigs";

import { FORM_INPUT_CLASS, FORM_TEXTAREA_CLASS } from "@/lib/design/controls";

import { FormField as Field } from "@/components/brand/form-field";

import { useActionState, useState } from "react";
import { createGig, type GigFormState } from "@/lib/actions/gigs";
import { CancelButton } from "@/components/brand/cancel-button";
import { useUnsavedChanges } from "@/hooks/use-unsaved-changes";
import { useScrollToFirstError } from "@/hooks/use-scroll-to-error";
import { cn } from "@/lib/utils";

export function GigForm() {
  const [state, action, pending] = useActionState<GigFormState, FormData>(
    createGig,
    {},
  );
  const formRef = useScrollToFirstError(state.fieldErrors);

  const [dirty, setDirty] = useState(false);
  useUnsavedChanges(dirty);
  const [type, setType] = useState<"task" | "build" | "hourly">("task");

  return (
    <form
      ref={formRef}
      action={action}
      onChange={() => setDirty(true)}
      noValidate
      className="space-y-6"
    >
      {state.error && (
        <div className="rounded-lg bg-clay-tint px-3 py-2 text-sm text-clay-deep">
          {state.error}
        </div>
      )}

      <Field label="Type" required>
        <input type="hidden" name="type" value={type} />
        <div className="grid grid-cols-1 gap-2 sm:grid-cols-3">
          {gigTypes.map((t) => {
            const active = type === t.value;
            return (
              <button
                key={t.value}
                type="button"
                onClick={() => { setType(t.value); setDirty(true); }}
                aria-pressed={type === t.value}
                className={cn(
                  "rounded-card border px-4 py-3 text-left transition-colors",
                  active
                    ? "border-orange-mid bg-orange-tint"
                    : "border-border bg-surface hover:border-border-hover",
                )}
              >
                <span
                  className={cn(
                    "block text-sm font-medium",
                    active ? "text-orange-deep" : "text-ink",
                  )}
                >
                  {t.label}
                </span>
                <span className="block text-xs text-muted-foreground">
                  {t.hint}
                </span>
              </button>
            );
          })}
        </div>
      </Field>

      <Field label="Title" required error={state.fieldErrors?.title}>
        <input
          name="title"
          maxLength={120}
          dir="auto"
          className={FORM_INPUT_CLASS}
          placeholder="What do you need built?"
        />
      </Field>

      <Field label="Description" required error={state.fieldErrors?.description}>
        <textarea
          name="description"
          maxLength={4000}
          rows={5}
          dir="auto"
          className={FORM_TEXTAREA_CLASS}
          placeholder="Describe the work, scope, and what 'done' looks like."
        />
      </Field>

      {type === "hourly" ? (
        <Field label="Hourly rate ($)">
          <input
            name="hourly_rate"
            type="number"
            min={0}
            className={cn(FORM_INPUT_CLASS, "max-w-xs")}
            placeholder="50"
          />
        </Field>
      ) : (
        <div className="grid grid-cols-2 gap-4">
          <Field label="Budget min ($)">
            <input name="budget_min" type="number" min={0} className={FORM_INPUT_CLASS} placeholder="500" />
          </Field>
          <Field label="Budget max ($)">
            <input name="budget_max" type="number" min={0} className={FORM_INPUT_CLASS} placeholder="2000" />
          </Field>
        </div>
      )}

      <Field label="Tags" hint="comma separated">
        <input
          name="tags"
          dir="auto"
          className={FORM_INPUT_CLASS}
          placeholder="Automation, Next.js, Design"
        />
      </Field>

      <Field label="Loom / video URL" error={state.fieldErrors?.loom_url}>
        <input
          name="loom_url"
          type="url"
          className={FORM_INPUT_CLASS}
          placeholder="https://loom.com/…"
        />
      </Field>

      <div className="flex items-center gap-3 pt-1">
        <CancelButton dirty={dirty} fallbackHref="/gigs" />
        <button
          type="submit"
          disabled={pending}
          className="btn btn-orange h-12 flex-1 text-[15px] disabled:opacity-70"
        >
          {pending ? gigFormCopy.posting : gigFormCopy.post}
        </button>
      </div>
    </form>
  );
}
