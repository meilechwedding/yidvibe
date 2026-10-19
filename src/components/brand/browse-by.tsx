import Link from "next/link";

/** A short, stationary set of category shortcuts; Explore retains every filter. */
export function BrowseBy({ tags }: { tags: string[] }) {
  if (!tags.length) return null;
  return (
    <nav aria-label="Browse by category" className="flex flex-wrap gap-2">
      {tags.slice(0, 8).map(tag => (
        <Link key={tag} href={`/showcase?tag=${encodeURIComponent(tag)}`} className="inline-flex min-h-11 items-center rounded-input bg-mist px-3 text-sm font-medium text-teal-800 transition-colors hover:bg-teal-100">
          {tag}
        </Link>
      ))}
    </nav>
  );
}
