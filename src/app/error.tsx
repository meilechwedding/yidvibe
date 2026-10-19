"use client";
import { STATUS_COPY } from "@/content/pages/status";

export default function Error({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="mx-auto flex min-h-[60vh] max-w-lg flex-col items-center justify-center px-4 text-center">
      <p className="font-display text-5xl text-teal-600">
        {STATUS_COPY.error.eyebrow}
      </p>
      <h1 className="mt-3 font-display text-2xl text-ink">
        {STATUS_COPY.error.title}
      </h1>
      <p className="mt-2 text-base text-muted-foreground">
        {STATUS_COPY.error.description}
      </p>
      <button type="button" onClick={reset} className="btn btn-primary mt-6">
        {STATUS_COPY.error.retry}
      </button>
    </div>
  );
}
