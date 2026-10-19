import Link from "next/link";
import { notFound } from "next/navigation";
import { requireAdminUnlocked } from "@/lib/admin";
import { getCompetitionBySlug, getSubmissions } from "@/lib/competitions";

export const metadata = { title: "Archived competition" };

/** Existing admin guards and actions manage retained records; public routes stay retired. */
export default async function AdminCompetitionDetail({ params }: { params: Promise<{ slug: string }> }) {
  await requireAdminUnlocked();
  const { slug } = await params;
  const competition = await getCompetitionBySlug(slug);
  if (!competition) notFound();
  const submissions = await getSubmissions(competition.id);

  return (
    <div>
      <Link href="/admin/content?type=competitions" className="link-arrow">Back to stored competitions</Link>
      <h1 className="mt-6 font-display text-3xl font-semibold text-ink">{competition.title}</h1>
      <p className="mt-3 text-sm text-muted-foreground">Public browsing and new entries are retired. Stored records remain available here; approval does not reopen public access.</p>
      <p className="mt-4 text-sm text-muted-foreground">Review: {competition.review_status} · Status: {competition.status} · Prize: $ {competition.prize_amount.toLocaleString()}</p>
      <p className="mt-4 whitespace-pre-line text-sm leading-relaxed text-ink" dir="auto">{competition.description}</p>
      <Link href="/admin/competitions" className="btn btn-ghost btn-sm mt-6">Open review queue</Link>
      <h2 className="mt-8 font-display text-xl font-semibold text-ink">Stored entries ({submissions.length})</h2>
      {submissions.length ? <ul className="mt-4 space-y-3">{submissions.map(entry => (
        <li key={entry.id} className="rounded-card border border-border bg-surface p-4">
          <p className="text-sm font-medium text-ink">{entry.submitter?.name ?? "Community member"}{entry.id === competition.winner_submission_id ? " · Winner" : ""}</p>
          <p className="mt-2 whitespace-pre-line text-sm text-muted-foreground" dir="auto">{entry.description}</p>
          <a href={entry.submission_url} target="_blank" rel="noopener noreferrer" className="link-arrow mt-3">View entry</a>
        </li>
      ))}</ul> : <p className="mt-3 text-sm text-muted-foreground">No entries were submitted.</p>}
    </div>
  );
}
