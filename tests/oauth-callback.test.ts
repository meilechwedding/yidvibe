import { beforeEach, afterEach, expect, test, vi } from "vitest";
import { signInWithGoogle } from "@/lib/actions/auth";
import { GET } from "@/app/auth/callback/route";

const mocks = vi.hoisted(() => ({
  origin: "https://preview.example",
  oauth: vi.fn(),
  exchange: vi.fn(),
}));
vi.mock("next/headers", () => ({ headers: async () => new Headers({ origin: mocks.origin }) }));
vi.mock("next/navigation", () => ({ redirect: (path: string) => { throw new Error(`test-redirect:${path}`); } }));
// The transport implementation is neither loaded nor queried. Fixtures contain
// no live OAuth codes, cookies, provider URLs or credentials.
vi.mock("@/lib/supabase/server", () => ({ createClient: async () => ({ auth: {
  signInWithOAuth: mocks.oauth,
  exchangeCodeForSession: mocks.exchange,
} }) }));

beforeEach(() => {
  vi.clearAllMocks();
  mocks.origin = "https://preview.example";
  vi.stubEnv("NEXT_PUBLIC_SITE_URL", "https://production.example");
  mocks.oauth.mockResolvedValue({ data: { url: "https://oauth.example/authorize" }, error: null });
  mocks.exchange.mockResolvedValue({ error: null });
});
afterEach(() => vi.unstubAllEnvs());

async function start(next: string) {
  const form = new FormData();
  form.set("next", next);
  await expect(signInWithGoogle(form)).rejects.toThrow("test-redirect:https://oauth.example/authorize");
  return mocks.oauth.mock.calls[0][0];
}

test("preview request origin wins over configured production fallback", async () => {
  const options = await start("/dashboard?tab=saved");
  const destination = new URL(options.options.redirectTo);
  expect(destination.origin).toBe("https://preview.example");
  expect(destination.pathname).toBe("/auth/callback");
  expect(destination.searchParams.get("next")).toBe("/dashboard?tab=saved");
  expect(options.provider).toBe("google");
});

test("production request keeps its own callback origin", async () => {
  mocks.origin = "https://production.example";
  const options = await start("/dashboard");
  expect(new URL(options.options.redirectTo).origin).toBe("https://production.example");
});

test("OAuth initiation cannot use an external post-auth destination", async () => {
  const options = await start("https://untrusted.example/account");
  expect(new URL(options.options.redirectTo).searchParams.get("next")).toBe("/");
});

test("callback exchanges its fixture code and stays on preview for local next", async () => {
  const response = await GET(new Request("https://preview.example/auth/callback?code=test-code&next=%2Fdashboard"));
  expect(mocks.exchange).toHaveBeenCalledWith("test-code");
  expect(response.headers.get("location")).toBe("https://preview.example/dashboard");
});

test("callback rejects external next without leaving its own origin", async () => {
  const response = await GET(new Request("https://preview.example/auth/callback?code=test-code&next=https%3A%2F%2Funtrusted.example"));
  expect(response.headers.get("location")).toBe("https://preview.example/");
});

test("failed exchange returns a generic local login error without echoing the code", async () => {
  mocks.exchange.mockResolvedValue({ error: { message: "fixture failure" } });
  const response = await GET(new Request("https://preview.example/auth/callback?code=test-code"));
  expect(response.headers.get("location")).toBe("https://preview.example/login?error=auth");
});

test("missing code does not call the exchange transport", async () => {
  const response = await GET(new Request("https://preview.example/auth/callback?next=%2Fdashboard"));
  expect(mocks.exchange).not.toHaveBeenCalled();
  expect(response.headers.get("location")).toBe("https://preview.example/login?error=auth");
});
