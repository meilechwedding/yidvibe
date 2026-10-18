import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import { ACCENT_TEXT, type Accent } from "@/lib/design/accents";


/** Slim branded breadcrumb for inner/detail pages: ‹ Section / Name */
export function SectionCrumb({
  section, href, name, accent = "teal",
}: { section: string; href: string; name?: string; accent?: Accent }) {
  return (
    <div className="mb-6 flex items-center gap-2 border-b border-border pb-3 text-sm">
      <Link href={href} className="inline-flex items-center gap-2 font-medium" style={{ color: ACCENT_TEXT[accent] }}>
        <ChevronLeft size={14} /> {section}
      </Link>
      {name && (<><span className="text-border">/</span><span className="truncate text-muted-foreground">{name}</span></>)}
    </div>
  );
}
