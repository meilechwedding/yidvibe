"use client";

import { useState } from "react";
import Link from "next/link";
import { Plus, Rocket, Briefcase, Trophy } from "lucide-react";
import { Dialog, DialogTrigger, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { cn } from "@/lib/utils";

const OPTIONS = [
  {
    href: "/showcase/submit",
    Icon: Rocket,
    label: "Project",
    desc: "Show what you built",
    tint: "tint-teal",
  },
  {
    href: "/gigs/post",
    Icon: Briefcase,
    label: "Gig",
    desc: "A job you need done",
    tint: "tint-orange",
    flag: "module.gigs",
  },
  {
    href: "/competitions/post",
    Icon: Trophy,
    label: "Competition",
    desc: "Run a challenge with a prize",
    tint: "tint-gold",
    flag: "module.competitions",
  },
];

/**
 * "Post" trigger + a chooser sheet (Project / Gig / Competition). `button` for
 * the desktop nav; `fab` is the raised + in the mobile bottom bar.
 *
 * Flag-gated options (Gig, Competition) only appear when their module is
 * launched — otherwise the link would land on a 404 (the section's layout
 * guards it with `requireFlag`). `enabledFlags` is computed server-side in
 * the nav shell and passed down.
 */
export function PostMenu({
  variant = "button",
  enabledFlags = {},
}: {
  variant?: "button" | "fab";
  enabledFlags?: Record<string, boolean>;
}) {
  const [open, setOpen] = useState(false);
  const options = OPTIONS.filter((o) => !o.flag || enabledFlags[o.flag]);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {variant === "button" ? (
          <button
            type="button"
            className="btn btn-primary btn-sm"
          >
            <Plus size={16} /> Post
          </button>
        ) : (
          <button
            type="button"
            aria-label="Post"
            className="flex flex-col items-center justify-center pt-2"
          >
            <span className="-mt-5 grid h-12 w-12 place-items-center rounded-full bg-teal-600 text-white shadow-sm ring-4 ring-canvas">
              <Plus size={22} />
            </span>
            <span className="mt-1 text-sm font-medium text-muted-foreground">
              Post
            </span>
          </button>
        )}

      </DialogTrigger>
      <DialogContent aria-describedby={undefined} className="inset-x-0 bottom-0 left-0 top-auto max-w-none translate-x-0 translate-y-0 rounded-t-card border-t border-border bg-surface p-6 pb-8 shadow-float sm:inset-x-auto sm:bottom-auto sm:left-1/2 sm:top-1/2 sm:w-[440px] sm:max-w-[92vw] sm:-translate-x-1/2 sm:-translate-y-1/2 sm:rounded-card sm:border">
        <div className="mx-auto mb-4 h-1.5 w-10 rounded-full bg-border sm:hidden" />
        <DialogTitle className="mb-4 font-display text-lg font-semibold text-ink">
          What do you want to post?
        </DialogTitle>
        <div className="flex flex-col gap-2">
          {options.map((o) => (
            <Link
              key={o.href}
              href={o.href}
              onClick={() => setOpen(false)}
              className="flex items-center gap-3 rounded-card border border-border p-4 transition-colors hover:border-border-hover hover:bg-secondary"
            >
              <span
                className={cn(
                  "grid h-10 w-10 shrink-0 place-items-center rounded-input",
                  o.tint,
                )}
              >
                <o.Icon size={18} />
              </span>
              <span className="min-w-0">
                <span className="block font-semibold text-ink">{o.label}</span>
                <span className="block text-sm text-muted-foreground">
                  {o.desc}
                </span>
              </span>
            </Link>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  );
}
