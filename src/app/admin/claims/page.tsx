import Link from "next/link";
import { Hand } from "lucide-react";
import { adminListClaims } from "@/lib/queries";
import { ClaimActions } from "@/components/admin/claim-actions";

export const metadata = { title: "Claims" };

export default async function AdminClaimsPage() {
  const claims = await adminListClaims();

  return (
    <div className="space-y-6">
      <header>
        <h1 className="font-display text-2xl font-bold text-ink">Claims</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          People asking to be credited as the maker of a community submission.
          Approving attaches the project to their profile.
        </p>
      </header>

      {claims.length === 0 ? (
        <div className="flex flex-col items-center gap-2 rounded-card border border-border bg-surface py-14 text-center">
          <Hand size={22} className="text-muted-foreground" />
          <p className="text-sm text-muted-foreground">No claims waiting for review.</p>
        </div>
      ) : (
        <ul className="divide-y divide-border rounded-card border border-border bg-surface">
          {claims.map((c) => (
            <li key={c.id} className="flex flex-wrap items-center gap-4 px-4 py-3.5">
              <div className="min-w-0 flex-1">
                <Link
                  href={`/showcase/${c.project_id}`}
                  className="font-semibold text-ink hover:underline"
                >
                  {c.project?.name ?? "Untitled project"}
                </Link>
                <p className="text-sm text-muted-foreground">
                  claimed by{" "}
                  {c.claimant ? (
                    <Link
                      href={`/u/${c.claimant.handle}`}
                      className="font-medium text-teal-700 hover:underline"
                    >
                      {c.claimant.name} (@{c.claimant.handle})
                    </Link>
                  ) : (
                    "someone"
                  )}
                </p>
                {c.note && (
                  <p className="mt-1 text-xs text-muted-foreground">“{c.note}”</p>
                )}
              </div>
              <ClaimActions claimId={c.id} />
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
