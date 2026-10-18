"use client";

import { directoryFormCopy } from "@/content/forms/directory";

import { FORM_INPUT_CLASS, FORM_TEXTAREA_CLASS } from "@/lib/design/controls";

import { FormField as Field } from "@/components/brand/form-field";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  createMyDirectoryListing,
  type DirectoryListingState,
} from "@/lib/actions/directory";
import { useActionState } from "react";
import { useScrollToFirstError } from "@/hooks/use-scroll-to-error";

export function SelfListingForm({
  defaults,
  categories,
}: {
  defaults: {
    name: string;
    what_you_do: string;
    email: string;
    phone: string;
    website: string;
    logo_url: string;
  };
  categories: string[];
}) {
  const router = useRouter();
  const [state, action, pending] = useActionState<
    DirectoryListingState,
    FormData
  >(createMyDirectoryListing, {});
  const formRef = useScrollToFirstError(state.fieldErrors);
  const [goPublic, setGoPublic] = useState(true);

  useEffect(() => {
    if (state.ok) router.push("/directory");
  }, [state.ok, router]);

  return (
    <form ref={formRef} action={action} noValidate className="space-y-4">
      {state.error && (
        <div className="rounded-lg bg-clay-tint px-3 py-2 text-sm text-clay-deep">
          {state.error}
        </div>
      )}

      <input type="hidden" name="logo_url" value={defaults.logo_url} />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <Field
          label={directoryFormCopy.name}
          fromProfile={!!defaults.name}
          error={state.fieldErrors?.name}
        >
          <input
            name="name"
            aria-label={directoryFormCopy.name}
            defaultValue={defaults.name}
            maxLength={120}
            dir="auto"
            className={FORM_INPUT_CLASS}
            placeholder={directoryFormCopy.namePlaceholder}
          />
        </Field>
        <Field label={directoryFormCopy.category} error={state.fieldErrors?.category}>
          <select
            name="category"
            defaultValue=""
            className={FORM_INPUT_CLASS}
            aria-label={directoryFormCopy.category}
          >
            <option value="" disabled>
              {directoryFormCopy.categoryPlaceholder}
            </option>
            {categories.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </Field>
      </div>

      <Field
        label={directoryFormCopy.description}
        fromProfile={!!defaults.what_you_do}
        error={state.fieldErrors?.what_you_do}
      >
        <textarea
          name="what_you_do"
          aria-label={directoryFormCopy.description}
          defaultValue={defaults.what_you_do}
          rows={3}
          maxLength={600}
          dir="auto"
          className={FORM_TEXTAREA_CLASS}
          placeholder={directoryFormCopy.descriptionPlaceholder}
        />
      </Field>

      <Field label={directoryFormCopy.wants} hint="optional">
        <textarea
          name="wants"
          aria-label={directoryFormCopy.wants}
          rows={2}
          maxLength={600}
          dir="auto"
          className={FORM_TEXTAREA_CLASS}
          placeholder={directoryFormCopy.wantsPlaceholder}
        />
      </Field>

      <Field
        label={directoryFormCopy.contact}
        hint={directoryFormCopy.contactHint}
        fromProfile={!!(defaults.email || defaults.phone || defaults.website)}
        error={state.fieldErrors?.contact_email}
      >
        <div className="grid grid-cols-1 gap-2 sm:grid-cols-3">
          <input
            name="contact_email"
            aria-label="Contact email"
            type="email"
            defaultValue={defaults.email}
            className={FORM_INPUT_CLASS}
            placeholder="Email"
          />
          <input
            name="contact_phone"
            aria-label="Contact phone"
            defaultValue={defaults.phone}
            className={FORM_INPUT_CLASS}
            placeholder="Phone"
          />
          <input
            name="contact_website"
            aria-label="Contact website"
            defaultValue={defaults.website}
            className={FORM_INPUT_CLASS}
            placeholder="Website"
          />
        </div>
      </Field>

      {/* Go-public toggle — last control before submit. */}
      <input type="hidden" name="go_public" value={goPublic ? "on" : ""} />
      <label className="flex cursor-pointer items-start gap-3 rounded-card border border-border bg-secondary/40 p-4">
        <input
          type="checkbox"
          checked={goPublic}
          onChange={(e) => setGoPublic(e.target.checked)}
          className="mt-1 h-4 w-4 shrink-0 accent-teal-600"
        />
        <span className="min-w-0">
          <span className="block text-sm font-medium text-ink">
            Make my profile public too
          </span>
          <span className="mt-1 block text-xs text-muted-foreground">
            So people who find you in the directory can open your full profile.
            You can turn this off anytime in settings.
          </span>
        </span>
      </label>

      <button
        type="submit"
        disabled={pending}
        className="btn-sweep inline-flex h-12 w-full items-center justify-center rounded-input px-4 text-sm font-medium transition-transform active:scale-[0.99] disabled:opacity-70"
      >
        {pending ? "Adding…" : "Add me to the Directory"}
      </button>
    </form>
  );
}
