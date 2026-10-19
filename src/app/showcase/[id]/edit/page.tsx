import { notFound, redirect } from "next/navigation";
import { getProjectById } from "@/lib/queries";
import { getAuthUser } from "@/lib/current-user";
import { Container } from "@/components/brand/layout";
import { ProjectForm } from "@/components/showcase/project-form";
import Link from "next/link";
import { PageHeader } from "@/components/brand/page-header";
import { updateProject } from "@/lib/actions/projects";

export const metadata = { title: "Edit project" };

export default async function EditProjectPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const user = await getAuthUser();
  if (!user) redirect(`/login?next=/showcase/${id}/edit`);

  const project = await getProjectById(id);
  if (!project) notFound();
  if (project.owner_id !== user.id) redirect(`/showcase/${id}`);

  const updateAction = updateProject.bind(null, id);

  return (
    <Container className="posting-page">
      <nav aria-label="Breadcrumb" className="page-breadcrumb">
        <Link href={`/showcase/${id}`}>Back to project</Link>
      </nav>
      <PageHeader
        title="Keep your project up to date."
        subtitle="Edit the details, check your preview, and save your changes."
      />
      <ProjectForm
        action={updateAction}
        project={project}
        submitLabel="Save changes"
      />
    </Container>
  );
}
