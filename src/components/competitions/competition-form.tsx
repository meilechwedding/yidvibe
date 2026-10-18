"use client";

import { competitionFormCopy } from "@/content/forms/competitions";

import { FORM_INPUT_CLASS, FORM_TEXTAREA_CLASS } from "@/lib/design/controls";

import { FormField as Field } from "@/components/brand/form-field";

import { useActionState, useState } from "react";
import { CancelButton } from "@/components/brand/cancel-button";
import { useUnsavedChanges } from "@/hooks/use-unsaved-changes";
import { useScrollToFirstError } from "@/hooks/use-scroll-to-error";
import {
  createCompetition,
  type CompetitionFormState,
} from "@/lib/actions/competitions";

export function CompetitionForm() {
  const [state, action, pending] = useActionState<
    CompetitionFormState,
    FormData
  >(createCompetition, {});
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

      <Field label={competitionFormCopy.labelTitle} required error={state.fieldErrors?.title}>
        <input
          name="title"
          maxLength={120}
          dir="auto"
          className={FORM_INPUT_CLASS}
          placeholder={competitionFormCopy.titlePlaceholder}
        />
      </Field>

      <Field label={competitionFormCopy.labelBrief} required error={state.fieldErrors?.description}>
        <textarea
          name="description"
          maxLength={4000}
          rows={5}
          dir="auto"
          className={FORM_TEXTAREA_CLASS}
          placeholder={competitionFormCopy.briefPlaceholder}
        />
      </Field>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <Field label={competitionFormCopy.labelPrize} required error={state.fieldErrors?.prize_amount}>
          <input
            name="prize_amount"
            type="number"
            min={1}
            className={FORM_INPUT_CLASS}
            placeholder={competitionFormCopy.prizePlaceholder}
          />
        </Field>
        <Field label={competitionFormCopy.labelDeadline} required error={state.fieldErrors?.deadline}>
          <input
            name="deadline"
            type="datetime-local"
            className={FORM_INPUT_CLASS}
          />
        </Field>
      </div>

      <Field label={competitionFormCopy.labelTags} hint={competitionFormCopy.hintCommaSeparated}>
        <input
          name="tags"
          dir="auto"
          className={FORM_INPUT_CLASS}
          placeholder={competitionFormCopy.tagsPlaceholder}
        />
      </Field>

      <Field label={competitionFormCopy.labelLoomVideoURL} error={state.fieldErrors?.loom_url}>
        <input
          name="loom_url"
          type="url"
          className={FORM_INPUT_CLASS}
          placeholder={competitionFormCopy.videoPlaceholder}
        />
      </Field>

      <div className="flex items-center gap-3 pt-1">
        <CancelButton dirty={dirty} fallbackHref="/competitions" />
        <button
          type="submit"
          disabled={pending}
          className="btn btn-gold h-12 flex-1 text-sm disabled:opacity-70"
        >
          {pending ? competitionFormCopy.postingLabel : competitionFormCopy.postLabel}
        </button>
      </div>
    </form>
  );
}
