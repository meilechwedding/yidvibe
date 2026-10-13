"use client";

import { directoryFormCopy } from "@/content/forms/directory";

import { FORM_INPUT_CLASS, FORM_TEXTAREA_CLASS } from "@/lib/design/controls";

import { FormField as Field } from "@/components/brand/form-field";

import { useActionState } from "react";
import { CheckCircle2 } from "lucide-react";
import {
  createDirectoryListing,
  type DirectoryListingState,
} from "@/lib/actions/directory";
import { useScrollToFirstError } from "@/hooks/use-scroll-to-error";
import { DIRECTORY_CATEGORIES } from "@/lib/site";

export function GetListedForm() {
  const [state, action, pending] = useActionState<
    DirectoryListingState,
    FormData
  >(createDirectoryListing, {});
  const formRef = useScrollToFirstError(state.fieldErrors);

  if (state.ok) {
    return (
      <div className="flex items-start gap-3 rounded-2xl border border-sage-mid bg-sage-tint p-5 text-sage-deep">
        <CheckCircle2 size={20} className="mt-0.5 shrink-0" />
        <p className="text-sm">
          {directoryFormCopy.submitted}
        </p>
      </div>
    );
  }

  return (
    <form ref={formRef} action={action} noValidate className="space-y-4">
      {state.error && (
        <div className="rounded-lg bg-clay-tint px-3 py-2 text-sm text-clay-deep">
          {state.error}
        </div>
      )}

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <Field label={directoryFormCopy.name} error={state.fieldErrors?.name}>
          <input name="name" aria-label={directoryFormCopy.name} maxLength={120} dir="auto" className={FORM_INPUT_CLASS} placeholder={directoryFormCopy.namePlaceholder} />
        </Field>
        <Field label={directoryFormCopy.category} error={state.fieldErrors?.category}>
          <select name="category" defaultValue="" className={FORM_INPUT_CLASS} aria-label={directoryFormCopy.category}>
            <option value="" disabled>
              {directoryFormCopy.categoryPlaceholder}
            </option>
            {DIRECTORY_CATEGORIES.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </Field>
      </div>

      <Field label={directoryFormCopy.description} error={state.fieldErrors?.what_you_do}>
        <textarea
          name="what_you_do"
          aria-label={directoryFormCopy.description}
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
        error={state.fieldErrors?.contact_email}
      >
        <div className="grid grid-cols-1 gap-2 sm:grid-cols-3">
          <input name="contact_email" aria-label="Contact email" type="email" className={FORM_INPUT_CLASS} placeholder="Email" />
          <input name="contact_phone" aria-label="Contact phone" className={FORM_INPUT_CLASS} placeholder="Phone" />
          <input name="contact_website" aria-label="Contact website" className={FORM_INPUT_CLASS} placeholder="Website" />
        </div>
      </Field>

      <button
        type="submit"
        disabled={pending}
        className="btn-sweep inline-flex h-12 w-full items-center justify-center rounded-full px-4 text-[15px] font-semibold transition-transform active:scale-[0.99] disabled:opacity-70"
      >
        {pending ? "Submitting…" : "Submit listing"}
      </button>
    </form>
  );
}
