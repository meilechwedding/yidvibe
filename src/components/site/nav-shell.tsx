import { cn } from "@/lib/utils";

/** Desktop navigation stays in view; mobile uses the bottom bar. */
export function NavShell({ children, className }: { children: React.ReactNode; className?: string }) {
  return <header className={cn("site-header", className)}>{children}</header>;
}
