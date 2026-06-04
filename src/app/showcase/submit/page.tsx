import { getAuthUser } from "@/lib/current-user";
import { Container, Eyebrow } from "@/components/brand/layout";
import { ProjectForm } from "@/components/showcase/project-form";
import { createProject } from "@/lib/actions/projects";
import { FormHelpLink } from "@/components/brand/form-help-link";

export const metadata = { title: "Post a project" };

export default async function SubmitProjectPage() {
  const user = await getAuthUser();

  return (
    <Container className="max-w-2xl py-12 md:py-16">
      <div className="text-center">
        <Eyebrow>Share your work</Eyebrow>
        <h1 className="mt-3 font-display text-[clamp(2rem,5vw,2.75rem)] font-bold tracking-tight text-ink">
          Post a project
        </h1>
        <p className="mx-auto mt-3 max-w-md text-[17px] text-muted-foreground">
          Show the community what you built — or a great AI tool you found. Free,
          takes a minute. No account needed.
        </p>
        <div className="mt-3">
          <FormHelpLink>New here? See how posting a project works →</FormHelpLink>
        </div>
      </div>
      <div className="mt-9">
        <ProjectForm action={createProject} isLoggedIn={!!user} />
      </div>
    </Container>
  );
}
