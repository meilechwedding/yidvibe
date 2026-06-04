import { requireFlag } from "@/lib/flags";

// Phase 1: Competitions is hidden behind the "module.competitions" flag.
export default async function CompetitionsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  await requireFlag("module.competitions");
  return <>{children}</>;
}
