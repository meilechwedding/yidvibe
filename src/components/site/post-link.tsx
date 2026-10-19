import Link from "next/link";
import { Plus } from "lucide-react";
import { cn } from "@/lib/utils";

/** Shared project entry point for desktop and mobile navigation. */
export function PostLink({ variant = "button" }: { variant?: "button" | "mobile" }) {
  return (
    <Link href="/showcase/submit" className={cn("nav-post", variant === "mobile" && "mobile-nav-post")}>
      <Plus size={20} strokeWidth={1.75} aria-hidden="true" />
      <span>Post</span>
    </Link>
  );
}
