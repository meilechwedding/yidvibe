import { redirect } from "next/navigation";
import { requireAdminUnlocked } from "@/lib/admin";

export const metadata = { title: "Content" };
/** Retired UI entry point. Historical records and server permissions are unchanged. */
export default async function RetiredAdminPage() {
  await requireAdminUnlocked();
  redirect("/showcase/submit");
}
