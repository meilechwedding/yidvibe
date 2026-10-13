"use client";

import { gigFormCopy } from "@/content/forms/gigs";

import { useFormStatus } from "react-dom";

export function ApplyButton() {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="btn btn-orange disabled:opacity-70"
    >
      {pending ? gigFormCopy.applying : gigFormCopy.apply}
    </button>
  );
}
