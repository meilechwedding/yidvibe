import { requireFlag } from "@/lib/flags";

// Phase 1: private messaging/inbox is hidden behind "module.messaging".
export default async function InboxLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  await requireFlag("module.messaging");
  return <>{children}</>;
}
