"use client";

import { useTransition } from "react";
import { Check, X } from "lucide-react";
import { toast } from "sonner";
import { reviewClaim } from "@/lib/actions/claims";
import { cn } from "@/lib/utils";

export function ClaimActions({ claimId }: { claimId: string }) {
  const [pending, start] = useTransition();

  const act = (decision: "approved" | "rejected") =>
    start(async () => {
      try {
        await reviewClaim(claimId, decision);
        toast.success(decision === "approved" ? "Claim approved." : "Claim rejected.");
      } catch {
        toast.error("Couldn't update the claim.");
      }
    });

  return (
    <div className="flex shrink-0 gap-2">
      <button
        type="button"
        disabled={pending}
        onClick={() => act("approved")}
        className={cn("btn btn-primary btn-sm", pending && "opacity-70")}
      >
        <Check size={15} /> Approve
      </button>
      <button
        type="button"
        disabled={pending}
        onClick={() => act("rejected")}
        className={cn("btn btn-ghost btn-sm", pending && "opacity-70")}
      >
        <X size={15} /> Reject
      </button>
    </div>
  );
}
