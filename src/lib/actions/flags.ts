"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { requireAdminUnlocked } from "@/lib/admin";
import { FLAG_DEFS } from "@/lib/flags";

/**
 * Admin-only: flip a Launch Control flag on/off. Upserts so the row exists even
 * before the seed migration runs. `feature_flags` isn't in the generated types
 * yet, so the client is cast (codebase convention for not-yet-migrated tables).
 */
export async function setFlag(key: string, enabled: boolean) {
  const ctx = await requireAdminUnlocked();
  const def = FLAG_DEFS.find((d) => d.key === key);
  if (!def) return;

  const supabase = await createClient();
  await (supabase as unknown as {
    from: (t: string) => {
      upsert: (
        row: Record<string, unknown>,
        opts: { onConflict: string },
      ) => Promise<unknown>;
    };
  })
    .from("feature_flags")
    .upsert(
      {
        key,
        enabled,
        label: def.label,
        description: def.description,
        category: def.category,
        updated_at: new Date().toISOString(),
        updated_by: ctx.userId,
      },
      { onConflict: "key" },
    );

  // Nav + route guards read flags app-wide, so revalidate the whole layout.
  revalidatePath("/", "layout");
  revalidatePath("/admin/launch");
}
