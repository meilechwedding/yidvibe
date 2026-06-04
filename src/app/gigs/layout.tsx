import { requireFlag } from "@/lib/flags";

// Phase 1: Gigs is hidden behind the "module.gigs" Launch Control flag.
export default async function GigsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  await requireFlag("module.gigs");
  return <>{children}</>;
}
