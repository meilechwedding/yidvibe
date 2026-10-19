import Link from "next/link";
import {
  ArrowUpRight,
  Flag,
  Compass,
  MessageSquare,
  Tag,
  Users,
  FolderKanban,
} from "lucide-react";
import { requireAdminUnlocked } from "@/lib/admin";
import { createClient } from "@/lib/supabase/server";
import { PageHeader } from "@/components/brand/page-header";

export default async function AdminDashboard() {
  await requireAdminUnlocked();
  const supabase = await createClient();
  const [
    { count: users },
    { count: projects },
    { count: reports },
    { count: listings },
    { count: feedback },
  ] = await Promise.all([
    supabase.from("profiles").select("id", { count: "exact", head: true }),
    supabase.from("projects").select("id", { count: "exact", head: true }),
    supabase
      .from("reports")
      .select("id", { count: "exact", head: true })
      .eq("status", "open"),
    supabase
      .from("directory_listings")
      .select("id", { count: "exact", head: true })
      .eq("status", "pending"),
    supabase
      .from("feedback")
      .select("id", { count: "exact", head: true })
      .eq("status", "open"),
  ]);
  const stats = [
    { label: "Members", value: users, icon: Users, href: "/admin/users" },
    {
      label: "Projects",
      value: projects,
      icon: FolderKanban,
      href: "/admin/content",
    },
    {
      label: "Open reports",
      value: reports,
      icon: Flag,
      href: "/admin/reports",
    },
  ];
  const queues = [
    {
      label: "Reports",
      description: `${reports ?? 0} open reports to review.`,
      icon: Flag,
      href: "/admin/reports",
    },
    {
      label: "Directory",
      description: `${listings ?? 0} listings awaiting review.`,
      icon: Compass,
      href: "/admin/directory",
    },
    {
      label: "Feedback",
      description: `${feedback ?? 0} open notes from the community.`,
      icon: MessageSquare,
      href: "/admin/feedback",
    },
    {
      label: "Browse tags",
      description: "Choose the discovery links on the homepage.",
      icon: Tag,
      href: "/admin/tags",
    },
  ];
  return (
    <>
      <PageHeader
        title="Community overview"
        subtitle="Manage the work people share and the conversations around it."
      />
      <div className="admin-stats">
        {stats.map(({ label, value, icon: Icon, href }) => (
          <Link key={label} href={href}>
            <Icon size={22} aria-hidden="true" />
            <div>
              <strong>{value ?? 0}</strong>
              <span>{label}</span>
            </div>
            <ArrowUpRight size={18} aria-hidden="true" />
          </Link>
        ))}
      </div>
      <section className="mt-12">
        <h2 className="text-2xl font-semibold">Review and manage</h2>
        <div className="admin-queues">
          {queues.map(({ label, description, icon: Icon, href }) => (
            <Link key={href} href={href}>
              <Icon size={24} aria-hidden="true" />
              <div>
                <h3>{label}</h3>
                <p>{description}</p>
              </div>
              <ArrowUpRight size={20} aria-hidden="true" />
            </Link>
          ))}
        </div>
      </section>
    </>
  );
}
