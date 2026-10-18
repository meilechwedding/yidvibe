import Link from "next/link";
import { SITE_NAME } from "@/lib/site";
import { LogoMark } from "@/components/brand/sparkle";
import { cn } from "@/lib/utils";

/** Home link. Legacy artwork is preserved until the approved v8 assets are available locally. */
export function Logo({ className }: { className?: string }) {
  return (
    <Link
      href="/"
      aria-label={`${SITE_NAME} home`}
      className={cn(
        "inline-flex items-center gap-3 rounded-md outline-none focus-visible:ring-2 focus-visible:ring-ring",
        className,
      )}
    >
      <LogoMark size={32} />
      <span className="font-display text-[1.4rem] font-semibold leading-none tracking-tight text-ink">
        {SITE_NAME}
      </span>
    </Link>
  );
}
