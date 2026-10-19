import { redirect } from "next/navigation";

/** Retired public route. Stored records remain unchanged. */
export default function RetiredPage() {
  redirect("/showcase/submit");
}
