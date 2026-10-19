import Link from "next/link";
import { BrandLogo } from "@/components/brand/brand-logo";
import { cn } from "@/lib/utils";

export function Logo({ className }: { className?: string }) {
  return (
    <Link
      href="/"
      aria-label="YidVibe home"
      className={cn("brand-home", className)}
    >
      <BrandLogo decorative />
    </Link>
  );
}
