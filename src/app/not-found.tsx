import Link from "next/link";
import { STATUS_COPY } from "@/content/pages/status";

export default function NotFound() {
  return (
    <div className="mx-auto flex min-h-[60vh] max-w-md flex-col items-center justify-center px-4 text-center">
      <p className="font-display text-6xl text-teal-600">404</p>
      <h1 className="mt-3 font-display text-2xl text-ink">{STATUS_COPY.notFound.title}</h1>
      <p className="mt-2 text-sm text-muted-foreground">
        {STATUS_COPY.notFound.description}
      </p>
      <Link
        href="/"
        className="mt-6 inline-flex h-10 items-center rounded-input bg-teal-600 px-6 text-sm font-medium text-white transition-transform active:scale-[0.98]"
      >
        {STATUS_COPY.notFound.home}
      </Link>
    </div>
  );
}
