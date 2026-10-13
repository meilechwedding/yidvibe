"use client";

import { useActionState, useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { MessageSquarePlus, ThumbsUp, ThumbsDown, Lightbulb, CheckCircle2, Heart } from "lucide-react";
import { createFeedback, type FeedbackState } from "@/lib/actions/feedback";
import { Dialog, DialogTrigger, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { cn } from "@/lib/utils";

const SENTIMENTS = [
  { value: "like", label: "Like", Icon: ThumbsUp },
  { value: "dislike", label: "Dislike", Icon: ThumbsDown },
  { value: "idea", label: "Idea", Icon: Lightbulb },
] as const;

const inputClass =
  "h-10 w-full rounded-xl border border-border bg-surface px-3 text-sm text-ink outline-none transition-colors placeholder:text-muted-foreground focus:border-teal-600 focus:ring-2 focus:ring-teal-600/15";

export function FeedbackWidget() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  // Open on demand from elsewhere (e.g. the mobile Explore sheet, which has no
  // room for the side tab). Decoupled via a window event.
  useEffect(() => {
    function onOpen() {
      setOpen(true);
    }
    window.addEventListener("yv:open-feedback", onOpen);
    return () => window.removeEventListener("yv:open-feedback", onOpen);
  }, []);

  // Hide on admin screens — they have their own queue.
  if (pathname.startsWith("/admin")) return null;

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <button
          type="button"
          aria-label="Send feedback"
          className="fixed right-0 top-1/2 z-40 hidden -translate-y-1/2 items-center gap-1.5 rounded-l-xl bg-teal-600 px-2 py-3 text-xs font-semibold text-white shadow-float [writing-mode:vertical-rl] hover:bg-teal-700 sm:inline-flex"
        >
          <MessageSquarePlus size={15} className="rotate-90" />
          Feedback
        </button>
      </DialogTrigger>
      <DialogContent aria-describedby={undefined} className="inset-x-0 bottom-0 left-0 top-auto z-[70] max-w-none translate-x-0 translate-y-0 rounded-t-3xl border-t border-border bg-surface p-5 pb-8 shadow-float sm:inset-x-auto sm:bottom-6 sm:left-auto sm:right-6 sm:w-[400px] sm:max-w-[92vw] sm:rounded-3xl sm:border">
        <div className="mx-auto mb-4 h-1.5 w-10 rounded-full bg-border sm:hidden" />
        <DialogTitle className="mb-3 font-display text-lg font-semibold text-ink">
          Send feedback
        </DialogTitle>
        <FeedbackSession pathname={pathname} />
      </DialogContent>
    </Dialog>
  );
}


function FeedbackSession({ pathname }: { pathname: string }) {
  const [sentiment, setSentiment] = useState<string>("");
  const [anonymous, setAnonymous] = useState(false);
  const [state, action, pending] = useActionState<FeedbackState, FormData>(
    createFeedback,
    {},
  );

  return (
    <>
            {state.ok ? (
              <div className="flex items-start gap-3 rounded-2xl border border-sage-mid bg-sage-tint p-4 text-sage-deep">
                <CheckCircle2 size={20} className="mt-0.5 shrink-0" />
                <p className="inline-flex flex-wrap items-center gap-1.5 text-sm">
                  Thanks — we read every note.
                  <Heart size={14} className="shrink-0 fill-current" />
                </p>
              </div>
            ) : (
              <form action={action} noValidate className="space-y-3">
                {state.error && (
                  <div className="rounded-lg bg-clay-tint px-3 py-2 text-sm text-clay-deep">
                    {state.error}
                  </div>
                )}
                <input type="hidden" name="page_url" value={pathname} />
                <input type="hidden" name="sentiment" value={sentiment} />
                {anonymous && <input type="hidden" name="anonymous" value="1" />}

                <div className="flex gap-2">
                  {SENTIMENTS.map((s) => (
                    <button
                      key={s.value}
                      type="button"
                      onClick={() => setSentiment(sentiment === s.value ? "" : s.value)}
                      className={cn(
                        "inline-flex flex-1 items-center justify-center gap-1.5 rounded-xl border px-2 py-2 text-sm transition-colors",
                        sentiment === s.value
                          ? "border-teal-600 bg-teal-50 text-teal-800"
                          : "border-border text-muted-foreground hover:border-border-hover",
                      )}
                    >
                      <s.Icon size={15} /> {s.label}
                    </button>
                  ))}
                </div>

                <textarea
                  aria-label="Feedback message"
                  name="body"
                  rows={4}
                  maxLength={2000}
                  dir="auto"
                  required
                  className="w-full resize-y rounded-xl border border-border bg-surface px-3 py-2.5 text-sm text-ink outline-none transition-colors placeholder:text-muted-foreground focus:border-teal-600 focus:ring-2 focus:ring-teal-600/15"
                  placeholder="What do you like, dislike, or wish existed? Which page?"
                />

                <label className="flex cursor-pointer items-center gap-2 text-sm text-muted-foreground">
                  <input
                    type="checkbox"
                    checked={anonymous}
                    onChange={(e) => setAnonymous(e.target.checked)}
                    className="h-4 w-4 rounded border-border accent-teal-600"
                  />
                  Send anonymously
                </label>

                {anonymous && (
                  <input
                    aria-label="Email to reply to"
                    name="contact"
                    className={inputClass}
                    placeholder="Email to reply to (optional)"
                  />
                )}

                <button
                  type="submit"
                  disabled={pending}
                  className="btn btn-primary btn-block"
                >
                  {pending ? "Sending…" : "Send feedback"}
                </button>
              </form>
            )}
    </>
  );
}
