"use client";

import { useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { ConfirmDialog } from "./confirm-dialog";
import { hasSafeAppHistory } from "@/hooks/navigation/history";
import { COMMON_COPY } from "@/content/common";
import { cn } from "@/lib/utils";

function parentOf(path: string): string {
  const parts = path.split("/").filter(Boolean);
  parts.pop();
  return "/" + parts.join("/");
}

/**
 * Cancel out of a form. Returns to the previous page (or `fallbackHref`). When
 * `dirty`, asks the user to confirm before discarding their draft.
 */
export function CancelButton({
  dirty = false,
  fallbackHref,
  label = COMMON_COPY.actions.cancel,
  className,
}: {
  dirty?: boolean;
  fallbackHref?: string;
  label?: string;
  className?: string;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  function navigateBack() {
    if (hasSafeAppHistory()) {
      router.back();
    } else {
      router.push(fallbackHref ?? (parentOf(pathname) || "/"));
    }
  }

  return (
    <>
      <button
        type="button"
        onClick={() => (dirty ? setOpen(true) : navigateBack())}
        className={cn("btn btn-ghost btn-sm", className)}
      >
        {label}
      </button>
      <ConfirmDialog
        open={open}
        onOpenChange={setOpen}
        onConfirm={navigateBack}
        title={COMMON_COPY.draft.title}
        description={COMMON_COPY.draft.description}
        confirmLabel={COMMON_COPY.draft.confirm}
        cancelLabel={COMMON_COPY.draft.keepEditing}
      />
    </>
  );
}
