import Link from "next/link";
import { STATUS_COPY } from "@/content/pages/status";

export default function NotFound() {
  return (
    <div className="mx-auto flex min-h-[60vh] max-w-lg flex-col items-center justify-center px-4 text-center">
      <p className="font-display text-6xl text-teal-600">404</p>
      <h1 className="mt-3 font-display text-2xl text-ink">
        {STATUS_COPY.notFound.title}
      </h1>
      <p className="mt-2 text-base text-muted-foreground">
        {STATUS_COPY.notFound.description}
      </p>
      <Link href="/" className="btn btn-primary mt-6">
        {STATUS_COPY.notFound.home}
      </Link>
    </div>
  );
}
