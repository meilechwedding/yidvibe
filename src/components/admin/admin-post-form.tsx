import Link from "next/link";
import type { PickableUser } from "./post-as-control";

/** Compatibility entry point for project-only posting. No retired creation controls. */
export function AdminPostForm(_props: { users: PickableUser[] }) {
  return (
    <div className="space-y-4">
      <p className="text-muted-foreground">
        Share a project from your own account.
      </p>
      <Link href="/showcase/submit" className="btn btn-primary">
        Post a project
      </Link>
    </div>
  );
}
