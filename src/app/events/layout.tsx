import { redirect } from "next/navigation";

export default function EventsLayout(_props: { children: React.ReactNode }) {
  redirect("/showcase");
}
