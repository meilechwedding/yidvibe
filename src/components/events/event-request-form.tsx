"use client";

import { eventFormCopy } from "@/content/forms/events";

import { FORM_INPUT_CLASS, FORM_TEXTAREA_CLASS } from "@/lib/design/controls";

import { useActionState } from "react";
import { CheckCircle2 } from "lucide-react";
import { requestEvent, type EventRequestState } from "@/lib/actions/event-requests";
import { useScrollToFirstError } from "@/hooks/use-scroll-to-error";

export function EventRequestForm() {
  const [state, action, pending] = useActionState<EventRequestState, FormData>(
    requestEvent,
    {},
  );
  const formRef = useScrollToFirstError(state.fieldErrors);

  if (state.ok) {
    return (
      <div className="flex items-start gap-3 rounded-2xl border border-sage-mid bg-sage-tint p-5 text-sage-deep">
        <CheckCircle2 size={20} className="mt-0.5 shrink-0" />
        <p className="text-sm">
          {eventFormCopy.requestSuccess}
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
      <div>
        <label htmlFor="event-request-title" className="mb-1.5 block text-sm font-medium text-ink">{eventFormCopy.requestTitleLabel}</label>
        <input id="event-request-title" name="title" aria-invalid={!!state.fieldErrors?.title} aria-describedby={state.fieldErrors?.title ? "event-request-title-error" : undefined} maxLength={200} dir="auto" className={FORM_INPUT_CLASS} placeholder={eventFormCopy.requestTitlePlaceholder} />
        {state.fieldErrors?.title && (
          <p id="event-request-title-error" className="mt-1 text-xs text-clay-deep">{state.fieldErrors.title}</p>
        )}
      </div>
      <div>
        <label htmlFor="event-request-details" className="mb-1.5 block text-sm font-medium text-ink">{eventFormCopy.requestDetailsLabel}<span className="ml-2 font-normal text-xs text-muted-foreground">
            {eventFormCopy.requestDetailsHint}
          </span>
        </label>
        <textarea
          id="event-request-details"
          name="details" aria-invalid={!!state.fieldErrors?.details} aria-describedby={state.fieldErrors?.details ? "event-request-details-error" : undefined}
          rows={5}
          maxLength={4000}
          dir="auto"
          className={FORM_TEXTAREA_CLASS}
          placeholder={eventFormCopy.requestDetailsPlaceholder}
        />
        {state.fieldErrors?.details && (
          <p id="event-request-details-error" className="mt-1 text-xs text-clay-deep">{state.fieldErrors.details}</p>
        )}
      </div>
      <div>
        <label htmlFor="event-request-contact" className="mb-1.5 block text-sm font-medium text-ink">{eventFormCopy.requestContactLabel}<span className="ml-2 font-normal text-xs text-muted-foreground">{eventFormCopy.requestContactHint}</span>
        </label>
        <input id="event-request-contact" name="contact" aria-invalid={!!state.fieldErrors?.contact} aria-describedby={state.fieldErrors?.contact ? "event-request-contact-error" : undefined} maxLength={200} className={FORM_INPUT_CLASS} placeholder={eventFormCopy.requestContactPlaceholder} />
        {state.fieldErrors?.contact && (
          <p id="event-request-contact-error" className="mt-1 text-xs text-clay-deep">{state.fieldErrors.contact}</p>
        )}
      </div>
      <button
        type="submit"
        disabled={pending}
        className="btn-sweep inline-flex h-12 w-full items-center justify-center rounded-full px-4 text-[15px] font-semibold transition-transform active:scale-[0.99] disabled:opacity-70"
      >
        {pending ? eventFormCopy.sendingLabel : eventFormCopy.sendRequestLabel}
      </button>
    </form>
  );
}
