import Link from "next/link";

export type GlanceStat = { value: number; label: string; href: string };

/** Bold, clickable single-row stats. Solid petrol with citron on hover. */
export function GlanceRow({ stats }: { stats: GlanceStat[] }) {
  return (
    <div className="grid grid-cols-2 gap-2 sm:grid-cols-4 xl:grid-cols-8">
      {stats.map((s) => (
        <Link
          key={s.label}
          href={s.href}
          className="yv-glance-tile min-w-0 rounded-input px-2 py-4 text-center"
        >
          <div className="font-display text-2xl font-semibold leading-none">{s.value}</div>
          <div className="mt-2 break-words text-sm font-medium opacity-90">
            {s.label}
          </div>
        </Link>
      ))}
    </div>
  );
}
