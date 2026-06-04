import { requireFlag } from "@/lib/flags";

// Phase 1: Business Directory is hidden behind the "module.directory" flag.
export default async function DirectoryLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  await requireFlag("module.directory");
  return <>{children}</>;
}
