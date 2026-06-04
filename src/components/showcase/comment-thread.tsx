"use client";

import { useState } from "react";
import Link from "next/link";
import { AvatarCircle } from "@/components/brand/avatar-circle";
import { ReportMenu } from "@/components/brand/report-menu";
import { AddCommentForm } from "./add-comment-form";
import { deleteComment } from "@/lib/actions/comments";
import { displayName } from "@/lib/display";
import { formatRelativeTime } from "@/lib/utils";

export type CommentNode = {
  id: string;
  author_id: string;
  body: string;
  created_at: string;
  parent_id?: string | null;
  author: {
    handle: string;
    name: string;
    avatar_url: string | null;
    show_real_name?: boolean | null;
  } | null;
  replies?: CommentNode[];
};

function Item({
  c,
  projectId,
  meId,
  isAuthed,
  isReply = false,
}: {
  c: CommentNode;
  projectId: string;
  meId: string | null;
  isAuthed: boolean;
  isReply?: boolean;
}) {
  const [replying, setReplying] = useState(false);
  const mine = !!meId && meId === c.author_id;

  return (
    <li className="flex gap-3">
      <AvatarCircle
        name={c.author ? displayName(c.author) : "?"}
        src={c.author?.avatar_url ?? null}
        size={isReply ? 26 : 30}
      />
      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2">
          {c.author ? (
            <Link
              href={`/u/${c.author.handle}`}
              className="text-sm font-semibold text-ink hover:underline"
            >
              {displayName(c.author)}
            </Link>
          ) : (
            <span className="text-sm font-semibold text-ink">Someone</span>
          )}
          <span className="text-xs text-muted-foreground">
            {formatRelativeTime(c.created_at)}
          </span>
          {mine ? (
            <form action={deleteComment.bind(null, c.id, projectId)} className="ml-auto">
              <button
                type="submit"
                className="text-xs text-muted-foreground transition-colors hover:text-clay-deep"
              >
                Delete
              </button>
            </form>
          ) : (
            isAuthed && (
              <div className="ml-auto">
                <ReportMenu targetType="comment" targetId={c.id} />
              </div>
            )
          )}
        </div>
        <p className="mt-1 whitespace-pre-line text-sm text-ink/90" dir="auto">
          {c.body}
        </p>

        {isAuthed && !isReply && (
          <button
            type="button"
            onClick={() => setReplying((v) => !v)}
            className="mt-1 text-xs font-medium text-teal-700 hover:underline"
          >
            {replying ? "Cancel" : "Reply"}
          </button>
        )}

        {replying && (
          <div className="mt-2">
            <AddCommentForm
              projectId={projectId}
              parentId={c.id}
              compact
              onDone={() => setReplying(false)}
            />
          </div>
        )}

        {c.replies && c.replies.length > 0 && (
          <ul className="mt-3 space-y-3 border-l border-border pl-3">
            {c.replies.map((r) => (
              <Item
                key={r.id}
                c={r}
                projectId={projectId}
                meId={meId}
                isAuthed={isAuthed}
                isReply
              />
            ))}
          </ul>
        )}
      </div>
    </li>
  );
}

export function CommentThread({
  comments,
  projectId,
  meId,
  isAuthed,
}: {
  comments: CommentNode[];
  projectId: string;
  meId: string | null;
  isAuthed: boolean;
}) {
  if (comments.length === 0) {
    return (
      <p className="text-sm text-muted-foreground">
        No comments yet — be the first to cheer this on.
      </p>
    );
  }
  return (
    <ul className="space-y-4">
      {comments.map((c) => (
        <Item
          key={c.id}
          c={c}
          projectId={projectId}
          meId={meId}
          isAuthed={isAuthed}
        />
      ))}
    </ul>
  );
}
