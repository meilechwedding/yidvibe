import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { redirect } from "next/navigation";
import { getAuthUser } from "@/lib/current-user";
import { Container } from "@/components/brand/layout";
import { PageHeader } from "@/components/brand/page-header";
import { ProjectForm } from "@/components/showcase/project-form";
import { createProject } from "@/lib/actions/projects";

export const metadata = { title: "Post your project" };
export default async function SubmitProjectPage() {
  const user = await getAuthUser();
  if (!user) redirect("/login?next=/showcase/submit");
  return (
    <Container className="posting-page">
      <nav aria-label="Breadcrumb" className="page-breadcrumb">
        <Link href="/showcase">
          <ArrowLeft size={18} className="mr-2" />
          Back to projects
        </Link>
      </nav>
      <PageHeader
        title="Share what you're building."
        subtitle="A good project is the start of a conversation."
      />
      <ProjectForm action={createProject} isLoggedIn />
    </Container>
  );
}
