"use client";

import { useEffect } from "react";
import { registerUnsavedForm } from "@/hooks/navigation/unsaved";

/**
 * Warns before the tab is closed / hard-navigated away while a form has unsaved
 * changes, and guards in-app links. Explicit Cancel retains its own dialog;
 * branded Back checks the same active draft registry before navigating.
 */
export function useUnsavedChanges(dirty: boolean) {
  useEffect(() => {
    if (!dirty) return;
    const unregister = registerUnsavedForm();
    const handler = (e: BeforeUnloadEvent) => {
      e.preventDefault();
      e.returnValue = "";
    };
    window.addEventListener("beforeunload", handler);
    return () => {
      window.removeEventListener("beforeunload", handler);
      unregister();
    };
  }, [dirty]);
}
