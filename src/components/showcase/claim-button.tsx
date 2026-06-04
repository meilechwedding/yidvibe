"use client";

import { useState, useTransition } from "react";
import { Hand } from "lucide-react";
import { toast } from "sonner";
import { requestClaim } from "@/lib/actions/claims";

/** "Did you make this? Claim it" — on community submissions. Admin reviews. */
export function ClaimButton({ projectId }: { projectId: string }) {
  const [pending, start] = useTransition();
  const [done, setDone] = useState(false);

  if (done) {
    return (
      <p className="text-center text-xs text-muted-foreground">
        Claim submitted — an admin will review it.
      </p>
    );
  }

  return (
    <button
      type="button"
      disabled={pending}
      onClick={() =>
        start(async () => {
          try {
            await requestClaim(projectId);
            setDone(true);
            toast.success("Claim submitted — an admin will review it.");
          } catch {
            toast.error("Couldn't submit your claim. Please try again.");
          }
        })
      }
      className="btn btn-ghost btn-sm w-full justify-center"
    >
      <Hand size={15} /> Did you make this? Claim it
    </button>
  );
}
