"use client";

import { useActionState, useEffect, useRef, useState } from "react";
import {
  ArrowLeft,
  ArrowRight,
  Check,
  Globe,
  Lightbulb,
  UserCheck,
} from "lucide-react";
import { FORM_INPUT_CLASS, FORM_TEXTAREA_CLASS } from "@/lib/design/controls";
import { FormField as Field } from "@/components/brand/form-field";
import { ImageInput } from "@/components/brand/image-input";
import { GalleryInput } from "@/components/brand/gallery-input";
import { ProjectCover } from "@/components/brand/project-cover";
import { CancelButton } from "@/components/brand/cancel-button";
import { ChipField } from "@/components/forms/chip-field";
import { useUnsavedChanges } from "@/hooks/use-unsaved-changes";
import { KNOWN_TOOLS, KNOWN_TAGS } from "@/lib/site";
import {
  parseProjectForm,
  projectFieldErrors,
  projectSchema,
} from "@/lib/validation/project";
import { safeHttpsImageUrl } from "@/lib/security/image-urls";
import type { ProjectFormState } from "@/lib/contracts/project";
import type { Project } from "@/lib/queries";

const STEPS = ["Details", "Media", "Review"];
const FIELD_LABELS: Record<string, string> = {
  name: "Project name",
  description: "Description",
  url: "Project link",
  image_url: "Cover image",
  video_url: "Video / demo URL",
};
const FIELD_SELECTORS: Record<string, string> = {
  name: "#project-name",
  description: "#project-description",
  url: "#project-url",
  image_url: '[aria-label="Image URL"]',
  video_url: "#project-video",
};
const fieldStep = (field: string) =>
  ["image_url", "video_url", "images"].includes(field) ? 1 : 0;

export function ProjectForm({
  action,
  project,
  submitLabel = "Publish project",
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
  const formRef = useRef<HTMLFormElement>(null);
  const errorRef = useRef<HTMLDivElement>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const [step, setStep] = useState(0);
  const [visited, setVisited] = useState(0);
  const [validation, setValidation] = useState<ProjectFormState>({});
  const [name, setName] = useState(project?.name ?? "");
  const [description, setDescription] = useState(project?.description ?? "");
  const [url, setUrl] = useState(project?.url ?? "");
  const [video, setVideo] = useState(project?.video_url ?? "");
  const [cover, setCover] = useState(project?.image_url ?? "");
  const [images, setImages] = useState<string[]>(project?.images ?? []);
  const [tools, setTools] = useState<string[]>(project?.tools ?? []);
  const [tags, setTags] = useState<string[]>(project?.tags ?? []);
  const [ownership, setOwnership] = useState<"mine" | "found">("mine");
  const [dirty, setDirty] = useState(false);
  const [coverUploading, setCoverUploading] = useState(false);
  const [galleryUploading, setGalleryUploading] = useState(false);
  const uploading = coverUploading || galleryUploading;
  const showOwnership = isLoggedIn && !project;
  const errors = validation.fieldErrors ?? {};
  useUnsavedChanges(dirty);

  useEffect(() => {
    if (!state.error && !Object.keys(state.fieldErrors ?? {}).length) return;
    setValidation({
      ...state,
      error: state.error || "Please check the highlighted fields.",
    });
    const first = Object.keys(state.fieldErrors ?? {})[0];
    if (first) setStep(fieldStep(first));
    requestAnimationFrame(() => errorRef.current?.focus());
  }, [state]);

  function showErrors(next: ProjectFormState) {
    setValidation(next);
    const first = Object.keys(next.fieldErrors ?? {})[0];
    if (first) setStep(fieldStep(first));
    requestAnimationFrame(() => errorRef.current?.focus());
  }
  function focusField(field: string) {
    setStep(fieldStep(field));
    requestAnimationFrame(() =>
      formRef.current
        ?.querySelector<HTMLElement>(FIELD_SELECTORS[field] ?? "input")
        ?.focus(),
    );
  }
  function validDetails() {
    const result = projectSchema
      .pick({ name: true, description: true, url: true })
      .safeParse({ name, description, url });
    if (result.success) return true;
    showErrors(projectFieldErrors(result));
    return false;
  }
  function validAll() {
    if (!formRef.current) return false;
    const result = parseProjectForm(new FormData(formRef.current));
    if (!result.success) {
      showErrors(projectFieldErrors(result));
      return false;
    }
    if (!result.data.url && !result.data.image_url) {
      showErrors({
        error: "Add a cover image or a project link before continuing.",
        fieldErrors: {
          image_url:
            "Add a cover image, or go back to Details and add a project link.",
        },
      });
      return false;
    }
    return true;
  }
  function goTo(next: number) {
    if (pending || uploading) return;
    if (next > step && !validDetails()) return;
    if (next === 2 && !validAll()) return;
    setValidation({});
    setStep(next);
    setVisited((current) => Math.max(current, next));
    requestAnimationFrame(() => headingRef.current?.focus());
  }
  const preview = (
    <div className="project-form-preview">
      <ProjectCover
        name={name || "Your project"}
        src={safeHttpsImageUrl(cover)}
      />
      <h3>{name || "Your project name"}</h3>
      {tags.length > 0 && (
        <div className="mt-4 flex flex-wrap gap-2">
          {tags.map((tag) => (
            <span key={tag} className="chip">
              {tag}
            </span>
          ))}
        </div>
      )}
      <p>{description || "Tell people what it does and who it helps."}</p>
      <div className="preview-credit">
        {showOwnership && ownership === "found"
          ? "Community submission"
          : "Your work, shared with the community."}
      </div>
    </div>
  );

  return (
    <form
      ref={formRef}
      action={formAction}
      noValidate
      className="project-form"
      data-step={step}
      onChange={() => setDirty(true)}
      onSubmit={(event) => {
        if (pending || uploading) {
          event.preventDefault();
          return;
        }
        if (step < 2) {
          event.preventDefault();
          goTo(step + 1);
          return;
        }
        if (!validAll()) event.preventDefault();
      }}
    >
      <nav aria-label="Project form progress" className="form-steps">
        <ol>
          {STEPS.map((label, index) => (
            <li key={label}>
              <button
                type="button"
                disabled={index > visited || pending || uploading}
                aria-current={step === index ? "step" : undefined}
                onClick={() => goTo(index)}
              >
                <span className="step-number" aria-hidden="true">
                  {index < step ? (
                    <Check size={20} aria-hidden="true" />
                  ) : (
                    index + 1
                  )}
                </span>
                <span>{label}</span>
              </button>
            </li>
          ))}
        </ol>
      </nav>
      {validation.error && (
        <div
          ref={errorRef}
          tabIndex={-1}
          role="alert"
          className="form-error-summary"
        >
          <p className="font-medium">{validation.error}</p>
          {Object.entries(errors).length > 0 && (
            <ul>
              {Object.entries(errors).map(([field, message]) => (
                <li key={field}>
                  <button type="button" onClick={() => focusField(field)}>
                    {FIELD_LABELS[field] || field}: {message}
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
      <div className="form-layout">
        <div className="form-main">
          <h2 ref={headingRef} tabIndex={-1} className="form-step-heading">
            {step === 0
              ? "Project details"
              : step === 1
                ? "Show your work"
                : project
                  ? "Review your changes"
                  : "Ready to share?"}
          </h2>
          <p className="form-step-description">
            {step === 0
              ? "Start with the essentials. You can edit these later."
              : step === 1
                ? "Add a clear cover and a few screenshots so people can see what you made."
                : "Check the details below before publishing."}
          </p>

          {/* Keep every step mounted. Hidden inputs from uploads must survive navigation and server failures. */}
          <div className="form-step-panel" hidden={step !== 0}>
            <Field label="Project name" required error={errors.name}>
              <input
                id="project-name"
                name="name"
                value={name}
                onChange={(event) => setName(event.target.value)}
                maxLength={100}
                dir="auto"
                className={FORM_INPUT_CLASS}
                placeholder="What's it called?"
              />
            </Field>
            <Field label="Description" required error={errors.description}>
              <textarea
                id="project-description"
                name="description"
                value={description}
                onChange={(event) => setDescription(event.target.value)}
                maxLength={2000}
                rows={4}
                dir="auto"
                className={FORM_TEXTAREA_CLASS}
                placeholder="What does it do? Who is it for?"
              />
            </Field>
            <Field
              label="Project link"
              hint="optional if you add a cover"
              error={errors.url}
            >
              <input
                id="project-url"
                name="url"
                type="url"
                inputMode="url"
                value={url}
                onChange={(event) => setUrl(event.target.value)}
                className={FORM_INPUT_CLASS}
                placeholder="https://your-project.com"
              />
            </Field>
            <Field label="Category" hint="help people find your project">
              <ChipField
                addLabel="Add"
                name="tags"
                suggestions={KNOWN_TAGS}
                values={tags}
                setValues={setTags}
                onValueChange={() => setDirty(true)}
                activeClass="border-teal-600 bg-teal-50 text-teal-800"
                placeholder="Add another category"
              />
            </Field>
            <Field label="Tools used" hint="how you built it">
              <ChipField
                addLabel="Add"
                name="tools"
                suggestions={KNOWN_TOOLS}
                values={tools}
                setValues={setTools}
                onValueChange={() => setDirty(true)}
                activeClass="border-teal-600 bg-teal-50 text-teal-800"
                placeholder="Add another tool"
              />
            </Field>
            {showOwnership && (
              <fieldset className="ownership-field">
                <legend>Whose project is this?</legend>
                <input type="hidden" name="ownership" value={ownership} />
                <div className="ownership-options">
                  <button
                    type="button"
                    aria-pressed={ownership === "mine"}
                    onClick={() => {
                      setOwnership("mine");
                      setDirty(true);
                    }}
                  >
                    <UserCheck size={21} aria-hidden="true" />
                    <span>
                      <strong>I built this</strong>
                      <small>Credit me and add it to my profile.</small>
                    </span>
                  </button>
                  <button
                    type="button"
                    aria-pressed={ownership === "found"}
                    onClick={() => {
                      setOwnership("found");
                      setDirty(true);
                    }}
                  >
                    <Globe size={21} aria-hidden="true" />
                    <span>
                      <strong>I found it on the web</strong>
                      <small>Share it as a community submission.</small>
                    </span>
                  </button>
                </div>
              </fieldset>
            )}
          </div>
          <div className="form-step-panel" hidden={step !== 1}>
            <Field label="Cover image" hint="upload or paste an HTTPS URL">
              <ImageInput
                error={errors.image_url}
                name="image_url"
                bucket="project-media"
                shape="rect"
                defaultValue={project?.image_url}
                onUploadingChange={setCoverUploading}
                onValueChange={(value) => {
                  setCover(value);
                  setDirty(true);
                }}
              />
            </Field>
            <Field label="More screenshots" hint="optional, up to 5">
              <GalleryInput
                name="images"
                defaultValue={project?.images ?? []}
                onUploadingChange={setGalleryUploading}
                onValueChange={(values) => {
                  setImages(values);
                  setDirty(true);
                }}
              />
            </Field>
            <Field
              label="Video / demo URL"
              hint="optional"
              error={errors.video_url}
            >
              <input
                id="project-video"
                name="video_url"
                type="url"
                inputMode="url"
                value={video}
                onChange={(event) => setVideo(event.target.value)}
                className={FORM_INPUT_CLASS}
                placeholder="https://loom.com/..."
              />
            </Field>
            <p className="form-help-note">
              Image files up to 25 MB each. Add a cover image or a project link
              so people can see your work. Use your own screenshots or images
              you have permission to share.
            </p>
          </div>
          <div className="form-step-panel" hidden={step !== 2}>
            <div className="mobile-review-preview">{preview}</div>
            <div className="review-group">
              <div>
                <h3>Details</h3>
                <button type="button" onClick={() => goTo(0)}>
                  Edit details
                </button>
              </div>
              <dl>
                <dt>Name</dt>
                <dd>{name}</dd>
                <dt>Description</dt>
                <dd className="whitespace-pre-line">{description}</dd>
                {url && (
                  <>
                    <dt>Project link</dt>
                    <dd>{url}</dd>
                  </>
                )}
                {tags.length > 0 && (
                  <>
                    <dt>Category</dt>
                    <dd>{tags.join(", ")}</dd>
                  </>
                )}
                {tools.length > 0 && (
                  <>
                    <dt>Tools used</dt>
                    <dd>{tools.join(", ")}</dd>
                  </>
                )}
                {showOwnership && (
                  <>
                    <dt>Credit</dt>
                    <dd>
                      {ownership === "mine"
                        ? "I built this"
                        : "Community submission"}
                    </dd>
                  </>
                )}
              </dl>
            </div>
            <div className="review-group">
              <div>
                <h3>Media</h3>
                <button type="button" onClick={() => goTo(1)}>
                  Edit media
                </button>
              </div>
              <p>
                {cover ? "Cover image added." : "No cover image."}{" "}
                {images.length}{" "}
                {images.length === 1 ? "screenshot" : "screenshots"}.
                {video && " Demo link added."}
              </p>
            </div>
            <p className="form-help-note">
              {project
                ? "Your changes will be visible on the project page."
                : showOwnership && ownership === "mine"
                  ? "Your project goes live right away. Your builder profile will become public so people can find your work."
                  : "Your project goes live right away as a community submission."}
            </p>
          </div>
          <div className="form-step-actions">
            {step === 0 ? (
              <CancelButton
                dirty={dirty}
                fallbackHref={project ? `/showcase/${project.id}` : "/showcase"}
              />
            ) : (
              <button
                type="button"
                className="btn btn-ghost"
                onClick={() => goTo(step - 1)}
                disabled={pending || uploading}
              >
                <ArrowLeft size={18} />
                Back
              </button>
            )}
            {step < 2 ? (
              <button
                key="continue"
                type="button"
                className="btn btn-primary"
                disabled={pending || uploading}
                onClick={(event) => {
                  event.preventDefault();
                  goTo(step + 1);
                }}
              >
                {uploading ? "Uploading…" : "Continue"}
                <ArrowRight size={18} aria-hidden="true" />
              </button>
            ) : (
              <button
                key="publish"
                type="submit"
                className="btn btn-primary"
                disabled={pending || uploading}
              >
                {pending ? "Saving…" : submitLabel}
                <ArrowRight size={18} aria-hidden="true" />
              </button>
            )}
          </div>
          {uploading && (
            <p role="status" className="mt-4 text-sm text-muted-foreground">
              Keep this page open while your images upload.
            </p>
          )}
        </div>
        <aside className="form-sidebar" aria-label="Project preview">
          <p className="mb-5 text-sm font-medium">Live preview</p>
          {preview}
          <div className="preview-tip">
            <Lightbulb size={22} aria-hidden="true" />
            <p>
              <strong>Show what makes it useful.</strong>
              <span>
                A clear cover and a short description help the right people find
                your work.
              </span>
            </p>
          </div>
        </aside>
      </div>
    </form>
  );
}
