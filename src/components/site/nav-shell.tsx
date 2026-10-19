import { cn } from "@/lib/utils";

/** Keep primary navigation and Post reachable while browsing or using a keyboard. */
export function NavShell({ children, className }: { children: React.ReactNode; className?: string }) {
  return <header className={cn("sticky top-0 z-40 border-b border-border bg-canvas", className)}>{children}</header>;
}
