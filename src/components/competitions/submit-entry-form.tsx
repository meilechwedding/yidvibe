"use client";

import { competitionFormCopy } from "@/content/forms/competitions";

import { FORM_INPUT_CLASS, FORM_TEXTAREA_CLASS } from "@/lib/design/controls";

import { useActionState, useEffect, useRef } from "react";
import { submitEntry, type SubmissionState } from "@/lib/actions/competitions";
import { toast } from "sonner";



export function SubmitEntryForm({
  competitionId,
  slug,
}: {
  competitionId: string;
  slug: string;
}) {
  const action = submitEntry.bind(null, competitionId, slug);
  const [state, formAction, pending] = useActionState<
    SubmissionState,
    FormData
  >(action, {});
  const ref = useRef<HTMLFormElement>(null);

  useEffect(() => {
    if (state.ok) {
      ref.current?.reset();
      toast.success(competitionFormCopy.entrySuccess);
    }
  }, [state]);

  return (
    <form ref={ref} action={formAction} noValidate className="space-y-3">
      <input
        name="submission_url"
        aria-label={competitionFormCopy.entryUrlLabel}
        type="url"
        required
        className={FORM_INPUT_CLASS}
        placeholder={competitionFormCopy.entryUrlPlaceholder}
      />
      <input
        name="loom_url"
        aria-label={competitionFormCopy.entryDemoLabel}
        type="url"
        className={FORM_INPUT_CLASS}
        placeholder={competitionFormCopy.entryDemoPlaceholder}
      />
      <textarea
        name="description"
        aria-label={competitionFormCopy.entryDescriptionLabel}
        rows={3}
        dir="auto"
        maxLength={1000}
        className={FORM_TEXTAREA_CLASS}
        placeholder={competitionFormCopy.entryDescriptionPlaceholder}
      />
      {state.error && <p className="text-xs text-clay-deep">{state.error}</p>}
      <button
        type="submit"
        disabled={pending}
        className="btn btn-gold btn-sm disabled:opacity-70"
      >
        {pending ? competitionFormCopy.submittingLabel : competitionFormCopy.submitEntryLabel}
      </button>
    </form>
  );
}
