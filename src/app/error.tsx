"use client";
import { STATUS_COPY } from "@/content/pages/status";

export default function Error({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="mx-auto flex min-h-[55vh] max-w-md flex-col items-center justify-center px-4 text-center">
      <p className="font-display text-5xl text-teal-600">{STATUS_COPY.error.eyebrow}</p>
      <h1 className="mt-3 font-display text-2xl text-ink">
        {STATUS_COPY.error.title}
      </h1>
      <p className="mt-2 text-sm text-muted-foreground">
        {STATUS_COPY.error.description}
      </p>
      <button
        type="button"
        onClick={reset}
        className="mt-6 inline-flex h-10 items-center rounded-[10px] bg-teal-600 px-5 text-sm font-medium text-white transition-transform active:scale-[0.98]"
      >
        {STATUS_COPY.error.retry}
      </button>
    </div>
  );
}
