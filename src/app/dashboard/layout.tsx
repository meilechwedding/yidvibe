import { redirect } from "next/navigation";
import { getCurrentProfile } from "@/lib/current-user";
import { Container } from "@/components/brand/layout";
import { DashboardTabs } from "@/components/dashboard/dashboard-tabs";
import { DashboardMobileBar } from "@/components/dashboard/dashboard-mobile-bar";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const profile = await getCurrentProfile();
  if (!profile) redirect("/login?next=/dashboard");

  const firstName = profile.name.split(" ")[0];

  return (
    <div className="member-workspace min-h-[70vh] bg-canvas">
      {/* Local navigation stays in normal flow below the persistent global header. */}
      <div className="member-header">
        <Container>
          {/* Desktop: greeting + tab rail */}
          <div className="hidden flex-col gap-4 pb-4 pt-8 lg:flex">
            <div>
              <p className="text-sm font-medium text-teal-700">
                Your dashboard
              </p>
              <h1 className="mt-1 font-display text-[36px] font-semibold tracking-tight text-ink">
                Hi, {firstName}
              </h1>
            </div>
            <DashboardTabs />
          </div>
          {/* Mobile: greeting on hub root / back link on sub-pages */}
          <div className="flex items-center py-4 lg:hidden">
            <DashboardMobileBar firstName={firstName} />
          </div>
        </Container>
      </div>

      <Container className="pb-12 pt-8 md:pt-10">{children}</Container>
    </div>
  );
}
