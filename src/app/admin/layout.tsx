import { requireAdmin } from "@/lib/admin";
import { AdminSidebar } from "@/components/admin/admin-sidebar";

export const metadata = {
  title: "Admin",
  robots: { index: false, follow: false },
};

// Non-admins never get here — requireAdmin() returns notFound().
export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  await requireAdmin();

  return (
    <div className="admin-workspace">
      <AdminSidebar />
      <div className="admin-content">{children}</div>
    </div>
  );
}
