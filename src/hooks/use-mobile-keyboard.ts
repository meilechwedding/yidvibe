"use client";

import { useEffect, useState } from "react";

function acceptsText(element: Element | null) {
  if (element instanceof HTMLTextAreaElement) return !element.readOnly && !element.disabled;
  if (element instanceof HTMLInputElement) {
    return !element.readOnly && !element.disabled &&
      ["text", "search", "email", "password", "tel", "url", "number"].includes(element.type);
  }
  return element instanceof HTMLElement && element.isContentEditable;
}

/** Hide fixed navigation only when a text field and a reduced viewport indicate a keyboard. */
export function useMobileKeyboard() {
  const [open, setOpen] = useState(false);
  useEffect(() => {
    const viewport = window.visualViewport;
    let width = window.innerWidth;
    let fullHeight = Math.max(window.innerHeight, viewport?.height ?? 0);
    const update = () => {
      const height = viewport?.height ?? window.innerHeight;
      // Rotation starts a new baseline. Pinch zoom must not look like a keyboard.
      if (Math.abs(window.innerWidth - width) > 50) {
        width = window.innerWidth;
        fullHeight = Math.max(window.innerHeight, height);
      }
      if ((viewport?.scale ?? 1) !== 1) { setOpen(false); return; }
      fullHeight = Math.max(fullHeight, window.innerHeight, height);
      setOpen(acceptsText(document.activeElement) && fullHeight - height > 120);
    };
    document.addEventListener("focusin", update);
    document.addEventListener("focusout", update);
    window.addEventListener("resize", update);
    viewport?.addEventListener("resize", update);
    update();
    return () => {
      document.removeEventListener("focusin", update);
      document.removeEventListener("focusout", update);
      window.removeEventListener("resize", update);
      viewport?.removeEventListener("resize", update);
    };
  }, []);
  return open;
}
