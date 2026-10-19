import { beforeEach, expect, it, vi } from "vitest";

const redirect = vi.hoisted(() => vi.fn((path: string) => { throw new Error("REDIRECT:" + path); }));
vi.mock("next/navigation", () => ({ redirect }));
import Events from "@/app/events/page";
import EventPost from "@/app/events/post/page";
import EventRequest from "@/app/events/request/page";
import EventsLayout from "@/app/events/layout";
import Competitions from "@/app/competitions/page";
import CompetitionPost from "@/app/competitions/post/page";
import CompetitionDetail from "@/app/competitions/[slug]/page";
import CompetitionImage from "@/app/competitions/[slug]/opengraph-image";
import CompetitionsLayout from "@/app/competitions/layout";

import Gigs from "@/app/gigs/page";
import GigPost from "@/app/gigs/post/page";
import GigDetail from "@/app/gigs/[slug]/page";
import GigThread from "@/app/gigs/[slug]/thread/[threadId]/page";
import GigImage from "@/app/gigs/[slug]/opengraph-image";
import { metadata as retiredMetadata } from "@/app/gigs/layout";

// Any retired page attempting a database read fails the test before redirecting.
vi.mock("@/lib/supabase/server", () => ({ createClient: () => { throw new Error("Unexpected database read"); } }));

beforeEach(() => { redirect.mockClear(); });

it.each([
  ["gigs", Gigs], ["gig detail", GigDetail], ["gig thread", GigThread],
  ["events", Events], ["event post", EventPost], ["event request", EventRequest],
  ["competitions", Competitions], ["competition post", CompetitionPost],
  ["competition detail", CompetitionDetail], ["competition image", CompetitionImage],
])("redirects retired %s before rendering or loading module data", (_name, page) => {
  expect(() => page()).toThrow("REDIRECT:/showcase");
  expect(redirect).toHaveBeenCalledExactlyOnceWith("/showcase");
});

it.each([["events", EventsLayout], ["competitions", CompetitionsLayout]])(
  "guards the retired %s layout as well as its pages", (_name, layout) => {
    expect(() => layout({ children: null })).toThrow("REDIRECT:/showcase");
  },
);

it("sends retired posting links to the project flow", () => {
  expect(() => GigPost()).toThrow("REDIRECT:/showcase/submit");
  expect(redirect).toHaveBeenCalledExactlyOnceWith("/showcase/submit");
});

it("sends old share-image links to the generic brand image", () => {
  expect(() => GigImage()).toThrow("REDIRECT:/opengraph-image");
  expect(redirect).toHaveBeenCalledExactlyOnceWith("/opengraph-image");
  expect(retiredMetadata.robots.index).toBe(false);
});
