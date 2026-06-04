import Link from "next/link";
import { AddCommentForm } from "./add-comment-form";
import { CommentThread, type CommentNode } from "./comment-thread";

function countAll(nodes: CommentNode[]): number {
  return nodes.reduce(
    (n, c) => n + 1 + (c.replies ? countAll(c.replies) : 0),
    0,
  );
}

/**
 * Comments panel for the project page: header + scrolling one-level thread
 * (reply affordance lives on each top-level comment) + a pinned composer.
 * Commenting requires sign-in; replies are public.
 */
export function CommentsCard({
  projectId,
  comments,
  meId,
  isAuthed,
}: {
  projectId: string;
  comments: CommentNode[];
  meId: string | null;
  isAuthed: boolean;
}) {
  const total = countAll(comments);

  return (
    <div className="flex flex-col overflow-hidden rounded-2xl border border-border bg-surface shadow-[var(--shadow-sm)]">
      <div className="border-b border-border px-4 py-3">
        <p className="text-[11px] font-bold uppercase tracking-[0.1em] text-muted-foreground">
          Comments{total > 0 && ` · ${total}`}
        </p>
      </div>

      <div className="max-h-[420px] flex-1 overflow-y-auto px-4 py-4">
        <CommentThread
          comments={comments}
          projectId={projectId}
          meId={meId}
          isAuthed={isAuthed}
        />
      </div>

      <div className="border-t border-border px-4 py-3">
        {isAuthed ? (
          <AddCommentForm projectId={projectId} />
        ) : (
          <Link
            href={`/login?next=/showcase/${projectId}`}
            className="btn btn-ghost btn-sm"
          >
            Sign in to comment
          </Link>
        )}
      </div>
    </div>
  );
}
