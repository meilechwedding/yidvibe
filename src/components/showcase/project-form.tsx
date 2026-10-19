"use client";

import { projectFormCopy } from "@/content/forms/projects";

import { FORM_INPUT_CLASS, FORM_TEXTAREA_CLASS } from "@/lib/design/controls";

import { FormField as Field } from "@/components/brand/form-field";

import { useActionState, useState } from "react";
import { UserCheck, Globe } from "lucide-react";
import { ImageInput } from "@/components/brand/image-input";
import { GalleryInput } from "@/components/brand/gallery-input";
import { CancelButton } from "@/components/brand/cancel-button";
import { ChipField } from "@/components/forms/chip-field";
import { FormSection } from "@/components/brand/form-section";
import { useUnsavedChanges } from "@/hooks/use-unsaved-changes";
import { useScrollToFirstError } from "@/hooks/use-scroll-to-error";
import { KNOWN_TOOLS, KNOWN_TAGS } from "@/lib/site";
import type { ProjectFormState } from "@/lib/contracts/project";
import type { Project } from "@/lib/queries";
import { cn } from "@/lib/utils";

export function ProjectForm({
  action,
  project,
  submitLabel = projectFormCopy.postLabel,
  isLoggedIn = false,
}: {
  action: (
    state: ProjectFormState,
    formData: FormData,
  ) => Promise<ProjectFormState>;
  project?: Project;
  submitLabel?: string;
  isLoggedIn?: boolean;
}) {
  const [state, formAction, pending] = useActionState<
    ProjectFormState,
    FormData
  >(action, {});
  const formRef = useScrollToFirstError(state.fieldErrors);

  const [name, setName] = useState(project?.name ?? "");
  const [description, setDescription] = useState(project?.description ?? "");
  const [url, setUrl] = useState(project?.url ?? "");

  const [tools, setTools] = useState<string[]>(project?.tools ?? []);
  const [tags, setTags] = useState<string[]>(project?.tags ?? []);

  // "Whose project is this?" — only on a new post by a signed-in user.
  const showOwnership = isLoggedIn && !project;
  const [ownership, setOwnership] = useState<"mine" | "found">("mine");

  const [dirty, setDirty] = useState(false);
  useUnsavedChanges(dirty);
  const [coverUploading, setCoverUploading] = useState(false);
  const [galleryUploading, setGalleryUploading] = useState(false);
  const uploading = coverUploading || galleryUploading;

  return (
    <form
      ref={formRef}
      action={formAction}
      onChange={() => setDirty(true)}
      onSubmit={(event) => { if (uploading) event.preventDefault(); }}
      noValidate
      className="space-y-6"
    >
      {state.error && (
        <div className="rounded-lg bg-clay-tint px-3 py-2 text-sm text-clay-deep">
          {state.error}
        </div>
      )}

      <FormSection
        step={1}
        title={projectFormCopy.basicsTitle}
        description={projectFormCopy.basicsDescription}
      >
        <div className="rounded-card border border-border bg-secondary/40 p-3">
          <label htmlFor="project-live-url" className="mb-2 block text-sm font-medium text-ink">{projectFormCopy.linkLabel}<span className="ml-2 font-normal text-xs text-muted-foreground">{projectFormCopy.linkHint}</span>
          </label>
          <input
            id="project-live-url"
            name="url"
            type="url"
            aria-invalid={!!state.fieldErrors?.url}
            aria-describedby={state.fieldErrors?.url ? "project-live-url-error" : undefined}
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            className={FORM_INPUT_CLASS}
            placeholder={projectFormCopy.linkPlaceholder}
          />
          {state.fieldErrors?.url && <p id="project-live-url-error" className="mt-1 text-xs text-clay-deep">{state.fieldErrors.url}</p>}
        </div>

        <Field label={projectFormCopy.nameLabel} required error={state.fieldErrors?.name}>
          <input
            name="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            maxLength={100}
            dir="auto"
            className={FORM_INPUT_CLASS}
            placeholder={projectFormCopy.namePlaceholder}
          />

        </Field>

        <Field label={projectFormCopy.descriptionLabel} required error={state.fieldErrors?.description}>
          <textarea
            name="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            maxLength={2000}
            rows={4}
            dir="auto"
            className={FORM_TEXTAREA_CLASS}
            placeholder={projectFormCopy.descriptionPlaceholder}
          />

        </Field>
      </FormSection>

      <FormSection
        step={2}
        title={projectFormCopy.mediaTitle}
        description={projectFormCopy.mediaDescription}
      >
        <Field label={projectFormCopy.coverLabel} hint={projectFormCopy.coverHint}>
          <ImageInput
            name="image_url"
            bucket="project-media"
            shape="rect"
            onUploadingChange={setCoverUploading}
            onValueChange={() => setDirty(true)}
            defaultValue={project?.image_url}
          />
        </Field>

        <Field label={projectFormCopy.screenshotsLabel} hint={projectFormCopy.screenshotsHint}>
          <GalleryInput name="images" defaultValue={project?.images ?? []} onUploadingChange={setGalleryUploading} onValueChange={() => setDirty(true)} />
        </Field>

        <Field label={projectFormCopy.videoLabel} error={state.fieldErrors?.video_url}>
          <input
            name="video_url"
            type="url"
            defaultValue={project?.video_url ?? ""}
            className={FORM_INPUT_CLASS}
            placeholder={projectFormCopy.videoPlaceholder}
          />

        </Field>

        <p className="rounded-lg bg-teal-50 px-3 py-2 text-xs text-teal-800">
          {projectFormCopy.textAddA}{" "}<strong>{projectFormCopy.textCoverImage}</strong>{" "}
          {projectFormCopy.textOrA}{" "}<strong>{projectFormCopy.textLiveLink}</strong>{" "}
          {projectFormCopy.textOrBothSoPeopleCan}
        </p>
      </FormSection>

      <FormSection
        step={3}
        title={projectFormCopy.tagsToolsTitle}
        description={projectFormCopy.tagsToolsDescription}
      >
        <Field label={projectFormCopy.toolsLabel} hint={projectFormCopy.toolsHint}>
          <ChipField
            addLabel={projectFormCopy.addLabel}
            name="tools"
            suggestions={KNOWN_TOOLS}
            values={tools}
            setValues={setTools}
            onValueChange={() => setDirty(true)}
            activeClass="border-blue-mid bg-blue-tint text-blue-deep"
            placeholder={projectFormCopy.toolPlaceholder}
          />
        </Field>

        <Field label={projectFormCopy.categoryLabel} hint={projectFormCopy.categoryHint}>
          <ChipField
            addLabel={projectFormCopy.addLabel}
            name="tags"
            suggestions={KNOWN_TAGS}
            values={tags}
            setValues={setTags}
            onValueChange={() => setDirty(true)}
            activeClass="border-teal-400 bg-teal-50 text-teal-800"
            placeholder={projectFormCopy.categoryPlaceholder}
          />
        </Field>
      </FormSection>

      {showOwnership && (
        <FormSection
          step={4}
          title={projectFormCopy.ownershipTitle}
          description={projectFormCopy.ownershipDescription}
        >
          <input type="hidden" name="ownership" value={ownership} />
          <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
            <button
              type="button"
              onClick={() => { setOwnership("mine"); setDirty(true); }}
              aria-pressed={ownership === "mine"}
              className={cn(
                "flex items-start gap-3 rounded-input border px-4 py-3 text-left transition-colors",
                ownership === "mine"
                  ? "border-teal-600 bg-teal-50"
                  : "border-border bg-surface hover:border-border-hover",
              )}
            >
              <UserCheck size={18} className="mt-1 shrink-0 text-teal-700" />
              <span>
                <span className="block text-sm font-semibold text-ink">{projectFormCopy.builtOwnershipLabel}</span>
                <span className="block text-xs text-muted-foreground">
                  {projectFormCopy.ownerCreditHint}
                </span>
              </span>
            </button>
            <button
              type="button"
              onClick={() => { setOwnership("found"); setDirty(true); }}
              aria-pressed={ownership === "found"}
              className={cn(
                "flex items-start gap-3 rounded-input border px-4 py-3 text-left transition-colors",
                ownership === "found"
                  ? "border-teal-600 bg-teal-50"
                  : "border-border bg-surface hover:border-border-hover",
              )}
            >
              <Globe size={18} className="mt-1 shrink-0 text-teal-700" />
              <span>
                <span className="block text-sm font-semibold text-ink">{projectFormCopy.foundOwnershipLabel}</span>
                <span className="block text-xs text-muted-foreground">{projectFormCopy.foundOwnershipHint}</span>
              </span>
            </button>
          </div>
        </FormSection>
      )}

      <div className="flex items-center gap-3 pt-1">
        <CancelButton
          dirty={dirty}
          fallbackHref={project ? `/showcase/${project.id}` : "/showcase"}
        />
        <button
          type="submit"
          disabled={pending || uploading}
          className="btn-sweep inline-flex h-12 flex-1 items-center justify-center rounded-input px-4 text-sm font-medium transition-transform active:scale-[0.99] disabled:opacity-70"
        >
          {pending ? projectFormCopy.savingLabel : submitLabel}
        </button>
      </div>
      <p className="text-center text-xs text-muted-foreground">{projectFormCopy.publicationNotice}</p>
    </form>
  );
}
