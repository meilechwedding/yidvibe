import { ArrowUpRight, Search } from "lucide-react";
import { cn } from "@/lib/utils";

export function SearchField({
  className,
  value = "",
  action = "/showcase",
  label = "Search projects or tools",
  buttonLabel = "Explore",
}: {
  className?: string;
  value?: string;
  action?: string;
  label?: string;
  buttonLabel?: string;
}) {
  return (
    <form
      action={action}
      method="get"
      role="search"
      className={cn("search-field", className)}
    >
      <Search size={24} aria-hidden="true" />
      <input
        type="search"
        name="q"
        defaultValue={value}
        dir="auto"
        aria-label={label}
        placeholder={label}
      />
      <button type="submit" aria-label={buttonLabel} className="btn btn-gold">
        <span>{buttonLabel}</span>
        <ArrowUpRight size={20} aria-hidden="true" />
      </button>
    </form>
  );
}
