"use client";

import { useActionState, useEffect, useRef } from "react";
import { addComment, type CommentFormState } from "@/lib/actions/comments";

export function AddCommentForm({
  projectId,
  parentId,
  compact = false,
  onDone,
}: {
  projectId: string;
  parentId?: string;
  compact?: boolean;
  onDone?: () => void;
}) {
  const action = addComment.bind(null, projectId);
  const [state, formAction, pending] = useActionState<
    CommentFormState,
    FormData
  >(action, {});
  const ref = useRef<HTMLFormElement>(null);

  useEffect(() => {
    if (state.ok) {
      ref.current?.reset();
      onDone?.();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state]);

  return (
    <form
      ref={ref}
      action={formAction}
      className={compact ? "" : "rounded-2xl border border-border bg-surface p-4"}
    >
      {parentId && <input type="hidden" name="parent_id" value={parentId} />}
      <textarea
        name="body"
        rows={compact ? 2 : 3}
        dir="auto"
        maxLength={2000}
        placeholder={parentId ? "Write a reply…" : "Add a comment…"}
        className="w-full resize-y rounded-xl border border-border bg-surface px-3.5 py-2.5 text-sm text-ink outline-none transition-shadow placeholder:text-muted-foreground focus:border-teal-600 focus:ring-2 focus:ring-teal-600/15"
      />
      {state.error && <p className="mt-1 text-xs text-clay-deep">{state.error}</p>}
      <div className="mt-2 flex justify-end">
        <button type="submit" disabled={pending} className="btn btn-primary btn-sm">
          {pending ? "Posting…" : parentId ? "Reply" : "Comment"}
        </button>
      </div>
    </form>
  );
}
