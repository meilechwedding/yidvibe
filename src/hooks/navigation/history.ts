const ENTRY = "yidvibeNavigation";

function currentUrl() {
  return window.location.pathname + window.location.search + window.location.hash;
}

/** Mark only entries reached within this mounted app, never external history. */
export function recordAppNavigation(previousUrl: string | null): string {
  const url = currentUrl();
  const entry = window.history.state?.[ENTRY];
  if (entry?.url !== url) {
    window.history.replaceState(
      { ...window.history.state, [ENTRY]: { url, canGoBack: previousUrl !== null ? previousUrl !== url : hasSafeAppHistory() } },
      "",
    );
  }
  return url;
}

export function hasSafeAppHistory(): boolean {
  if (typeof window === "undefined" || window.history.length <= 1) return false;
  const entry = window.history.state?.[ENTRY];
  if (entry?.url === currentUrl()) return entry.canGoBack === true;
  // A full same-origin navigation can also have safe history before tracking.
  try {
    return !!document.referrer && new URL(document.referrer).origin === window.location.origin;
  } catch {
    return false;
  }
}
