// @vitest-environment jsdom
import React from "react";
import { afterEach, beforeEach, expect, it, vi } from "vitest";
import {
  cleanup,
  fireEvent,
  render,
  screen,
  waitFor,
  within,
} from "@testing-library/react";

const mocks = vi.hoisted(() => ({
  admin: vi.fn(),
  competition: vi.fn(),
  entries: vi.fn(),
  notifications: vi.fn(),
  feedback: vi.fn(),
  markRead: vi.fn(),
}));
vi.mock("@/lib/flags", () => ({ isFeatureEnabled: async () => true }));
vi.mock("@/lib/admin", () => ({ requireAdminUnlocked: mocks.admin }));
vi.mock("@/lib/competitions", () => ({
  getCompetitionBySlug: mocks.competition,
  getSubmissions: mocks.entries,
}));
vi.mock("@/lib/supabase/server", () => ({ createClient: vi.fn() }));
vi.mock("@/lib/notifications", async (importOriginal) => ({
  ...(await importOriginal<typeof import("@/lib/notifications")>()),
  getNotifications: mocks.notifications,
}));
vi.mock("@/lib/current-user", () => ({
  getAuthUser: async () => ({ id: "viewer" }),
}));
vi.mock("@/lib/actions/feedback", () => ({ createFeedback: mocks.feedback }));
vi.mock("@/lib/actions/notifications", () => ({
  markAllNotificationsRead: mocks.markRead,
}));
vi.mock("@/components/site/mark-read-on-view", () => ({
  MarkReadOnView: () => null,
}));
vi.mock("next/navigation", () => ({
  usePathname: () => "/showcase",
  notFound: () => {
    throw new Error("NOT_FOUND");
  },
  redirect: (url: string) => {
    throw new Error(`REDIRECT:${url}`);
  },
}));

import {
  describeNotification,
  type NotificationRow,
} from "@/lib/notifications";
import { NotificationBell } from "@/components/site/notification-bell";
import { SiteFooter } from "@/components/site/site-footer";
import NotificationsPage from "@/app/notifications/page";
import AdminCompetitionDetail from "@/app/admin/competitions/[slug]/page";

const archived = {
  id: "archive",
  type: "competition_winner",
  entity_id: "old-id",
  actor: null,
  data: { title: "Community challenge", slug: "old-challenge" },
  created_at: "2026-10-01T00:00:00Z",
  read_at: null,
} as NotificationRow;
const retiredPosting = {
  ...archived,
  id: "retired-posting",
  type: "gig_application",
  entity_type: "gig",
  data: { slug: "old-posting", thread_id: "old-thread", gig_title: "A gig" },
} as NotificationRow;
const current = {
  ...archived,
  id: "current",
  type: "comment",
  entity_id: "project-1",
  data: { project_name: "My project" },
} as NotificationRow;

beforeEach(() => {
  vi.clearAllMocks();
  mocks.admin.mockResolvedValue({});
  mocks.competition.mockResolvedValue({
    id: "old-id",
    slug: "old-challenge",
    title: "Community challenge",
    description: "Stored description",
    review_status: "approved",
    status: "closed",
    prize_amount: 100,
    winner_submission_id: "entry-1",
  });
  mocks.entries.mockResolvedValue([
    {
      id: "entry-1",
      submitter: { name: "Builder" },
      description: "Stored entry",
      submission_url: "https://example.com/entry",
    },
  ]);
  mocks.notifications.mockResolvedValue([archived, retiredPosting, current]);
});
afterEach(cleanup);

it("preserves the historical winner message without a retired destination", () => {
  expect(describeNotification(archived)).toEqual({
    text: "Archived update: You won Community challenge!",
  });
});

it("retains project destinations while removing retired conversation links and titles", () => {
  expect(describeNotification(current).href).toBe("/showcase/project-1");
  for (const type of ["message", "gig_application", "content_removed"]) {
    const result = describeNotification({
      ...current,
      type,
      entity_type: "gig",
      data: {
        slug: "old",
        thread_id: "thread",
        gig_title: "Old gig",
        message: "Your gig was removed",
      },
    });
    expect(result.href).toBeUndefined();
    expect(result.text).not.toMatch(/gig/i);
    expect(result.text).toMatch(/Archived update/);
  }
});

it.each(["message", "gig_application"])(
  "retires legacy %s notifications without entity metadata",
  (type) => {
    const result = describeNotification({
      ...current,
      type,
      data: { slug: "old", thread_id: "thread", gig_title: "Old gig" },
    });
    expect(result.href).toBeUndefined();
    expect(result.text).not.toMatch(/gig/i);
  },
);

it("keeps archived updates readable in the bell while current items remain links", async () => {
  render(
    <NotificationBell
      unread={3}
      items={[archived, retiredPosting, current].map((n) => ({
        id: n.id,
        ...describeNotification(n),
        createdAt: n.created_at,
        read: false,
        actorName: null,
        actorAvatar: null,
      }))}
    />,
  );
  fireEvent.keyDown(screen.getByRole("button", { name: /Notifications/ }), {
    key: "ArrowDown",
  });
  const historical = await screen.findByText(/You won Community challenge/);
  expect(historical.closest("a")).toBeNull();
  expect(
    screen
      .getByText("Someone commented on My project")
      .closest("a")
      ?.getAttribute("href"),
  ).toBe("/showcase/project-1");
  expect(
    document.querySelector('a[href^="/competitions"], a[href^="/gigs"]'),
  ).toBeNull();
  expect(screen.getByText(/retired posting/).closest("a")).toBeNull();
});

it("shows the same archived and active behavior in the full notification list", async () => {
  render(await NotificationsPage());
  for (const item of screen.getAllByText(/Archived update/))
    expect(item.closest("a")).toBeNull();
  expect(document.querySelector('a[href^="/gigs"]')).toBeNull();
  expect(
    screen
      .getByRole("link", { name: /Someone commented/ })
      .getAttribute("href"),
  ).toBe("/showcase/project-1");
});

it("provides feedback through the actual site footer and restores focus on close", async () => {
  render(await SiteFooter());
  const trigger = within(screen.getByRole("contentinfo")).getByRole("button", {
    name: "Send feedback",
  });
  fireEvent.click(trigger);
  const dialog = screen.getByRole("dialog", { name: "Send feedback" });
  expect(screen.getByLabelText("Feedback message")).toBeTruthy();
  fireEvent.keyDown(dialog, { key: "Escape" });
  await waitFor(() => expect(screen.queryByRole("dialog")).toBeNull());
  await waitFor(() => expect(document.activeElement).toBe(trigger));
  expect(mocks.feedback).not.toHaveBeenCalled();
});

it("redirects a retired admin detail without reading or deleting stored records", async () => {
  await expect(
    AdminCompetitionDetail({
      params: Promise.resolve({ slug: "old-challenge" }),
    }),
  ).rejects.toThrow("REDIRECT:/admin/content");
  expect(mocks.admin).toHaveBeenCalledOnce();
  expect(mocks.competition).not.toHaveBeenCalled();
  expect(mocks.entries).not.toHaveBeenCalled();
});

it("does not read retained records when the existing admin guard denies access", async () => {
  mocks.admin.mockRejectedValueOnce(new Error("ADMIN_DENIED"));
  await expect(
    AdminCompetitionDetail({
      params: Promise.resolve({ slug: "old-challenge" }),
    }),
  ).rejects.toThrow("ADMIN_DENIED");
  expect(mocks.competition).not.toHaveBeenCalled();
  expect(mocks.entries).not.toHaveBeenCalled();
});

it("redirects an obsolete admin URL without querying entries", async () => {
  mocks.competition.mockResolvedValueOnce(null);
  await expect(
    AdminCompetitionDetail({ params: Promise.resolve({ slug: "missing" }) }),
  ).rejects.toThrow("REDIRECT:/admin/content");
  expect(mocks.entries).not.toHaveBeenCalled();
});
