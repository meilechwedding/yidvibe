"use client";

import { eventFormCopy } from "@/content/forms/events";

import { FORM_INPUT_CLASS, FORM_TEXTAREA_CLASS } from "@/lib/design/controls";

import { FormField as Field } from "@/components/brand/form-field";

import { useActionState, useState } from "react";
import { createEvent, type EventFormState } from "@/lib/actions/events";
import { CancelButton } from "@/components/brand/cancel-button";
import { useUnsavedChanges } from "@/hooks/use-unsaved-changes";
import { useScrollToFirstError } from "@/hooks/use-scroll-to-error";

export function EventForm() {
  const [state, action, pending] = useActionState<EventFormState, FormData>(
    createEvent,
    {},
  );
  const formRef = useScrollToFirstError(state.fieldErrors);

  const [dirty, setDirty] = useState(false);
  useUnsavedChanges(dirty);

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

      <Field label={eventFormCopy.labelTitle} required error={state.fieldErrors?.title}>
        <input
          name="title"
          maxLength={140}
          dir="auto"
          className={FORM_INPUT_CLASS}
          placeholder={eventFormCopy.titlePlaceholder}
        />
      </Field>

      <Field label={eventFormCopy.labelDateTime} required error={state.fieldErrors?.starts_at}>
        <input name="starts_at" type="datetime-local" className={FORM_INPUT_CLASS} />
      </Field>

      <Field label={eventFormCopy.labelLocation} error={state.fieldErrors?.location}>
        <input
          name="location"
          maxLength={140}
          dir="auto"
          className={FORM_INPUT_CLASS}
          placeholder={eventFormCopy.locationPlaceholder}
        />
      </Field>

      <Field label={eventFormCopy.labelDescription}>
        <textarea
          name="description"
          maxLength={2000}
          rows={4}
          dir="auto"
          className={FORM_TEXTAREA_CLASS}
          placeholder={eventFormCopy.descriptionPlaceholder}
        />
      </Field>

      <Field label={eventFormCopy.labelLinkRSVPDetails} error={state.fieldErrors?.url}>
        <input
          name="url"
          type="url"
          className={FORM_INPUT_CLASS}
          placeholder={eventFormCopy.urlPlaceholder}
        />
      </Field>

      <div className="flex items-center gap-3 pt-1">
        <CancelButton dirty={dirty} fallbackHref="/events" />
        <button
          type="submit"
          disabled={pending}
          className="btn btn-primary h-12 flex-1 text-sm disabled:opacity-70"
        >
          {pending ? eventFormCopy.addingLabel : eventFormCopy.addLabel}
        </button>
      </div>
    </form>
  );
}
