import { requireFlag } from "@/lib/flags";

// Phase 1: the browsable People/Builders directory is hidden behind
// "module.people". Individual public profiles at /u/[handle] stay reachable.
export default async function BuildersLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  await requireFlag("module.people");
  return <>{children}</>;
}
