import { requireFlag } from "@/lib/flags";

// Phase 1: Events is hidden behind the "module.events" flag.
export default async function EventsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  await requireFlag("module.events");
  return <>{children}</>;
}
