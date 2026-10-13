import { COMMON_COPY } from "@/content/common";

const dirtyForms = new Set<symbol>();

/** Explicit app navigation uses the same discard warning as form cancellation. */
export function confirmUnsavedNavigation(): boolean {
  return dirtyForms.size === 0 || window.confirm(COMMON_COPY.draft.navigationWarning);
}

function onNavigationClick(event: MouseEvent) {
  if (event.defaultPrevented || event.button !== 0 || event.ctrlKey || event.metaKey || event.shiftKey || event.altKey) return;
  const link = event.target instanceof Element ? event.target.closest<HTMLAnchorElement>("a[href]") : null;
  if (!link || link.hasAttribute("download") || (link.target && link.target !== "_self")) return;
  const destination = new URL(link.href, window.location.href);
  // Hash links, new tabs and external destinations do not use the app router.
  // Full document navigation remains protected by beforeunload.
  if (destination.origin !== window.location.origin ||
    (destination.pathname === window.location.pathname && destination.search === window.location.search)) return;
  if (!confirmUnsavedNavigation()) {
    event.preventDefault();
    event.stopImmediatePropagation();
  }
}

export function registerUnsavedForm(): () => void {
  const form = Symbol("unsaved form");
  dirtyForms.add(form);
  if (dirtyForms.size === 1) document.addEventListener("click", onNavigationClick, true);
  return () => {
    dirtyForms.delete(form);
    if (dirtyForms.size === 0) document.removeEventListener("click", onNavigationClick, true);
  };
}
