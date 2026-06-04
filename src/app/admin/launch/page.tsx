import { getAllFlags } from "@/lib/flags";
import { LaunchControl } from "@/components/admin/launch-control";

export const metadata = { title: "Launch Control" };

export default async function LaunchControlPage() {
  const flags = await getAllFlags();

  return (
    <div className="space-y-6">
      <header>
        <h1 className="font-display text-2xl font-bold text-ink">Launch Control</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          YidVibe launches focused on the Showcase. Flip a piece on when demand is
          there — it appears in the nav and its pages go live instantly. Everything
          stays built; nothing is deleted.
        </p>
      </header>
      <LaunchControl flags={flags} />
    </div>
  );
}
