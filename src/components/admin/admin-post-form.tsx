"use client";

import { useActionState, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { adminPostContent, type AdminPostState } from "@/lib/actions/admin";
import { PostAsControl, type PickableUser } from "./post-as-control";
import { cn } from "@/lib/utils";

const inputClass =
  "h-11 w-full rounded-input border border-border bg-surface px-4 text-sm text-ink outline-none transition-colors placeholder:text-muted-foreground focus:border-teal-600 focus:ring-2 focus:ring-teal-600/15";
const textareaClass =
  "w-full resize-y rounded-input border border-border bg-surface px-4 py-3 text-sm text-ink outline-none transition-colors placeholder:text-muted-foreground focus:border-teal-600 focus:ring-2 focus:ring-teal-600/15";

type ContentType = "competition" | "event";

const TYPES: { value: ContentType; label: string }[] = [
  { value: "competition", label: "Competition" },
  { value: "event", label: "Event" },
];

function Field({
  label,
  required,
  hint,
  children,
}: {
  label: string;
  required?: boolean;
  hint?: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label className="mb-2 block text-sm font-medium text-ink">
        {label}
        {required && <span className="ml-1 text-clay-mid">*</span>}
        {hint && (
          <span className="ml-2 text-xs font-normal text-muted-foreground">
            {hint}
          </span>
        )}
      </label>
      {children}
    </div>
  );
}

export function AdminPostForm({ users }: { users: PickableUser[] }) {
  const [state, action, pending] = useActionState<AdminPostState, FormData>(
    adminPostContent,
    {},
  );
  const router = useRouter();
  const [type, setType] = useState<ContentType>("competition");
  useEffect(() => {
    if (state.ok) {
      toast.success("Posted.");
      router.push(state.slug ?? "/admin/content");
    }
  }, [state, router]);

  return (
    <form action={action} className="space-y-6">
      {state.error && (
        <div className="rounded-lg bg-clay-tint px-3 py-2 text-sm text-clay-deep">
          {state.error}
        </div>
      )}

      <input type="hidden" name="type" value={type} />
      <Field label="Type" required>
        <div className="grid grid-cols-2 gap-2">
          {TYPES.map((t) => {
            const active = type === t.value;
            return (
              <button
                key={t.value}
                type="button"
                onClick={() => setType(t.value)}
                className={cn(
                  "rounded-card border px-4 py-3 text-sm font-medium transition-colors",
                  active
                    ? "border-teal-600 bg-teal-50 text-teal-800"
                    : "border-border bg-surface text-ink hover:border-border-hover",
                )}
              >
                {t.label}
              </button>
            );
          })}
        </div>
      </Field>

      <Field label="Post as" required>
        <PostAsControl users={users} />
      </Field>

      <Field label="Title" required>
        <input name="title" maxLength={140} dir="auto" className={inputClass} />
      </Field>

      {/* Competition fields */}
      {type === "competition" && (
        <>
          <Field label="Brief" required>
            <textarea name="description" rows={5} dir="auto" className={textareaClass} />
          </Field>
          <div className="grid grid-cols-2 gap-4">
            <Field label="Prize amount ($)" required>
              <input name="prize_amount" type="number" min={1} className={inputClass} />
            </Field>
            <Field label="Deadline" required>
              <input name="deadline" type="datetime-local" className={inputClass} />
            </Field>
          </div>
          <Field label="Tags" hint="comma separated">
            <input name="tags" dir="auto" className={inputClass} />
          </Field>
        </>
      )}

      {/* Event fields */}
      {type === "event" && (
        <>
          <Field label="Description">
            <textarea name="description" rows={4} dir="auto" className={textareaClass} />
          </Field>
          <div className="grid grid-cols-2 gap-4">
            <Field label="Date & time">
              <input name="starts_at" type="datetime-local" className={inputClass} />
            </Field>
            <Field label="Location">
              <input name="location" dir="auto" className={inputClass} />
            </Field>
          </div>
          <Field label="RSVP / details URL">
            <input name="url" type="url" className={inputClass} placeholder="https://…" />
          </Field>
        </>
      )}

      <div className="pt-1">
        <button
          type="submit"
          disabled={pending}
          className="btn btn-primary h-12 w-full text-sm disabled:opacity-70"
        >
          {pending ? "Posting…" : "Publish"}
        </button>
      </div>
    </form>
  );
}
