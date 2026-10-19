import { redirect } from "next/navigation";

export default function CompetitionsLayout(_props: { children: React.ReactNode }) {
  redirect("/showcase");
}
