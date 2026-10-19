import Link from "next/link";
import { Plus } from "lucide-react";
import { requireAdminUnlocked } from "@/lib/admin";
import { createClient } from "@/lib/supabase/server";
import { cn } from "@/lib/utils";
import {
  ContentManager,
  type ContentItem,
} from "@/components/admin/content-manager";

export const metadata = { title: "Content" };

const TABS = [
  { key: "projects", label: "Projects" },
  { key: "directory", label: "Directory" },
] as const;

type Tab = (typeof TABS)[number]["key"];

function isTab(v: string | undefined): v is Tab {
  return TABS.some((t) => t.key === v);
}

const ownerName = (
  p: { name?: string | null; handle?: string | null } | null,
) => p?.name || (p?.handle ? `@${p.handle}` : null);

async function loadItems(type: Tab): Promise<ContentItem[]> {
  const supabase = await createClient();

  if (type === "projects") {
    const { data } = await supabase
      .from("projects")
      .select(
        "id, name, image_url, hidden, featured, created_at, owner:profiles!projects_owner_id_fkey(name,handle)",
      )
      .order("created_at", { ascending: false })
      .limit(100);
    return (data ?? []).map((r: any) => ({
      id: r.id,
      title: r.name,
      image: r.image_url,
      owner: ownerName(r.owner),
      meta: r.featured ? "Featured" : null,
      hidden: r.hidden,
      featured: r.featured,
      editHref: `/showcase/${r.id}/edit`,
    }));
  }

  // directory
  const { data } = await supabase
    .from("directory_listings")
    .select("id, name, category, status, created_at")
    .order("created_at", { ascending: false })
    .limit(100);
  return (data ?? []).map((r: any) => ({
    id: r.id,
    title: r.name,
    owner: r.category,
    meta: r.status,
    reviewStatus: r.status,
  }));
}

export default async function AdminContentPage({
  searchParams,
}: {
  searchParams: Promise<{ type?: string }>;
}) {
  await requireAdminUnlocked();
  const { type: rawType } = await searchParams;
  const type: Tab = isTab(rawType) ? rawType : "projects";
  const items = await loadItems(type);

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="font-display text-2xl text-ink">Content</h1>
        <Link href="/showcase/submit" className="btn btn-primary btn-sm">
          <Plus size={16} /> Post project
        </Link>
      </div>

      <div className="mt-6 flex flex-wrap gap-2">
        {TABS.map((t) => {
          const active = t.key === type;
          return (
            <Link
              key={t.key}
              href={`/admin/content?type=${t.key}`}
              className={cn(
                "rounded-input px-4 py-2 text-sm font-medium transition-colors",
                active
                  ? "bg-teal-600 text-white"
                  : "border border-border text-muted-foreground hover:bg-secondary",
              )}
            >
              {t.label}
            </Link>
          );
        })}
      </div>

      <p className="mt-4 text-sm text-muted-foreground">
        {items.length} {items.length === 1 ? "item" : "items"}.
      </p>

      <div className="mt-3">
        <ContentManager type={type} items={items} />
      </div>
    </div>
  );
}
