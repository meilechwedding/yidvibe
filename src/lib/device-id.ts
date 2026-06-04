import { cookies } from "next/headers";
import { randomUUID } from "crypto";

const DEVICE_COOKIE = "yv_device";
const TWO_YEARS = 60 * 60 * 24 * 365 * 2;

/** Read the device token, or null. Safe in read-only (Server Component) contexts. */
export async function getDeviceId(): Promise<string | null> {
  const store = await cookies();
  return store.get(DEVICE_COOKIE)?.value ?? null;
}

/**
 * Get-or-create the device token. Call only where cookies are writable
 * (Server Actions / Route Handlers). Used to dedupe anonymous upvotes so one
 * device ≈ one vote per project.
 */
export async function ensureDeviceId(): Promise<string> {
  const store = await cookies();
  const existing = store.get(DEVICE_COOKIE)?.value;
  if (existing) return existing;
  const id = randomUUID();
  store.set(DEVICE_COOKIE, id, {
    httpOnly: true,
    sameSite: "lax",
    secure: true,
    path: "/",
    maxAge: TWO_YEARS,
  });
  return id;
}
