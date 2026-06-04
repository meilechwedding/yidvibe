"use client";

import { useActionState, useState } from "react";
import { Plus, Wand2, Loader2, UserCheck, Globe, Info } from "lucide-react";
import { toast } from "sonner";
import { ImageInput } from "@/components/brand/image-input";
import { GalleryInput } from "@/components/brand/gallery-input";
import { CancelButton } from "@/components/brand/cancel-button";
import { FormSection } from "@/components/brand/form-section";
import { useUnsavedChanges } from "@/hooks/use-unsaved-changes";
import { useScrollToFirstError } from "@/hooks/use-scroll-to-error";
import { fetchUrlMetadata } from "@/lib/actions/url-metadata";
import { KNOWN_TOOLS, KNOWN_TAGS } from "@/lib/site";
import type { ProjectFormState } from "@/lib/actions/projects";
import type { Project } from "@/lib/queries";
import { cn } from "@/lib/utils";

const inputClass =
  "h-11 w-full rounded-xl border border-border bg-surface px-3.5 text-sm text-ink outline-none transition-colors placeholder:text-muted-foreground focus:border-teal-600 focus:ring-2 focus:ring-teal-600/15";

const MAGIC_SPARKS = [
  { dx: -18, dy: -12 },
  { dx: 18, dy: -14 },
  { dx: 0, dy: -20 },
  { dx: -20, dy: 6 },
  { dx: 20, dy: 8 },
  { dx: 0, dy: 16 },
];

function Field({
  label,
  children,
  required,
  hint,
}: {
  label: string;
  children: React.ReactNode;
  required?: boolean;
  hint?: string;
}) {
  return (
    <div>
      <label className="mb-1.5 block text-sm font-medium text-ink">
        {label}
        {required && <span className="ml-0.5 text-clay-mid">*</span>}
        {hint && (
          <span className="ml-2 font-normal text-xs text-muted-foreground">
            {hint}
          </span>
        )}
      </label>
      {children}
    </div>
  );
}

/**
 * Multi-select chip field with suggestions + custom entries. Carries each value
 * in a hidden input named `name`. `activeClass` controls the selected-chip color
 * so tools (blue) and tags (teal) stay visually distinct.
 */
function ChipField({
  name,
  suggestions,
  values,
  setValues,
  activeClass,
  placeholder,
}: {
  name: string;
  suggestions: string[];
  values: string[];
  setValues: React.Dispatch<React.SetStateAction<string[]>>;
  activeClass: string;
  placeholder: string;
}) {
  const [custom, setCustom] = useState("");
  const toggle = (t: string) =>
    setValues((cur) =>
      cur.includes(t) ? cur.filter((x) => x !== t) : [...cur, t],
    );
  const addCustom = () => {
    const t = custom.trim();
    if (t && !values.includes(t)) setValues((cur) => [...cur, t]);
    setCustom("");
  };
  const chips = [...new Set([...suggestions, ...values])];

  return (
    <div>
      <div className="flex flex-wrap gap-2">
        {chips.map((t) => {
          const on = values.includes(t);
          return (
            <button
              key={t}
              type="button"
              onClick={() => toggle(t)}
              className={cn(
                "rounded-full border px-3 py-1 text-sm transition-colors",
                on
                  ? activeClass
                  : "border-border bg-surface text-muted-foreground hover:border-border-hover",
              )}
            >
              {t}
            </button>
          );
        })}
      </div>
      <div className="mt-2 flex gap-2">
        <input
          value={custom}
          onChange={(e) => setCustom(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              addCustom();
            }
          }}
          placeholder={placeholder}
          className={cn(inputClass, "h-9 max-w-xs")}
        />
        <button
          type="button"
          onClick={addCustom}
          className="inline-flex h-9 items-center gap-1 rounded-[10px] border border-border bg-surface px-3 text-sm text-ink hover:bg-secondary"
        >
          <Plus size={15} /> Add
        </button>
      </div>
      {values.map((t) => (
        <input key={t} type="hidden" name={name} value={t} />
      ))}
    </div>
  );
}

export function ProjectForm({
  action,
  project,
  submitLabel = "Post project",
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
  const [cover, setCover] = useState<string | undefined>(undefined);
  const [fetching, setFetching] = useState(false);
  const [magic, setMagic] = useState(0);

  const [tools, setTools] = useState<string[]>(project?.tools ?? []);
  const [tags, setTags] = useState<string[]>(project?.tags ?? []);

  // "Whose project is this?" — only on a new post by a signed-in user.
  const showOwnership = isLoggedIn && !project;
  const [ownership, setOwnership] = useState<"mine" | "found">("mine");

  const [dirty, setDirty] = useState(false);
  useUnsavedChanges(dirty);

  async function autofill() {
    if (!url.trim()) {
      toast.error("Paste your project link first.");
      return;
    }
    setFetching(true);
    setMagic((m) => m + 1);
    try {
      const meta = await fetchUrlMetadata(url);
      if (meta.error) {
        toast.error(meta.error);
        return;
      }
      if (meta.url) setUrl(meta.url);
      if (meta.title && !name.trim()) setName(meta.title.slice(0, 100));
      if (meta.description && !description.trim())
        setDescription(meta.description.slice(0, 2000));
      if (meta.image) setCover(meta.image);
      const got = [meta.title, meta.description, meta.image].filter(Boolean);
      toast.success(
        got.length
          ? "Filled in what we could from your link."
          : "We saved your link, but couldn't read any details from it.",
      );
    } finally {
      setFetching(false);
    }
  }

  return (
    <form
      ref={formRef}
      action={formAction}
      onChange={() => setDirty(true)}
      noValidate
      className="space-y-5"
    >
      {state.error && (
        <div className="rounded-lg bg-clay-tint px-3 py-2 text-sm text-clay-deep">
          {state.error}
        </div>
      )}

      {!isLoggedIn && (
        <div className="flex items-start gap-2.5 rounded-card border border-gold-deep/20 bg-gold-tint px-4 py-3 text-sm text-gold-deep">
          <Info size={17} className="mt-0.5 shrink-0" />
          <span>
            Posting as a <strong>community submission</strong>.{" "}
            <a href="/login?next=/showcase/submit" className="font-semibold underline">
              Sign in
            </a>{" "}
            if you built this and want it on your profile.
          </span>
        </div>
      )}

      <FormSection
        step={1}
        title="The basics"
        description="Paste your link and let us fill in the rest — then tidy up the details."
      >
        <div className="rounded-card border border-border bg-secondary/40 p-3">
          <label className="mb-1.5 block text-sm font-medium text-ink">
            Project link
            <span className="ml-2 font-normal text-xs text-muted-foreground">
              paste it and we&apos;ll fill in the rest
            </span>
          </label>
          <div className="flex gap-2">
            <input
              name="url"
              type="url"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              className={inputClass}
              placeholder="https://your-app.com"
            />
            <button
              type="button"
              onClick={autofill}
              disabled={fetching}
              className={cn(
                "autofill-btn relative inline-flex h-10 shrink-0 items-center gap-1.5 overflow-visible rounded-[10px] border border-border bg-surface px-3 text-sm font-medium text-ink transition-colors hover:bg-secondary disabled:opacity-80",
                fetching && "is-working",
              )}
            >
              {fetching ? (
                <Loader2 size={15} className="animate-spin" />
              ) : (
                <Wand2 size={15} />
              )}
              {fetching ? "Reading…" : "Autofill"}
              {magic > 0 && (
                <span key={magic} className="autofill-sparkles" aria-hidden>
                  {MAGIC_SPARKS.map((s, i) => (
                    <span
                      key={i}
                      className="autofill-spark"
                      style={{ "--dx": `${s.dx}px`, "--dy": `${s.dy}px` } as React.CSSProperties}
                    />
                  ))}
                </span>
              )}
            </button>
          </div>
        </div>

        <Field label="Name" required>
          <input
            name="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            maxLength={100}
            dir="auto"
            className={inputClass}
            placeholder="What's it called?"
          />
          {state.fieldErrors?.name && (
            <p className="mt-1 text-xs text-clay-deep">{state.fieldErrors.name}</p>
          )}
        </Field>

        <Field label="Description" required>
          <textarea
            name="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            maxLength={2000}
            rows={4}
            dir="auto"
            className="w-full resize-y rounded-xl border border-border bg-surface px-3.5 py-2.5 text-sm text-ink outline-none transition-colors placeholder:text-muted-foreground focus:border-teal-600 focus:ring-2 focus:ring-teal-600/15"
            placeholder="What does it do? Who's it for?"
          />
          {state.fieldErrors?.description && (
            <p className="mt-1 text-xs text-clay-deep">
              {state.fieldErrors.description}
            </p>
          )}
        </Field>
      </FormSection>

      <FormSection
        step={2}
        title="Media"
        description="Give people something to look at — a cover, screenshots, or a demo."
      >
        <Field label="Cover image" hint="upload or paste a URL">
          <ImageInput
            name="image_url"
            bucket="project-media"
            shape="rect"
            defaultValue={project?.image_url}
            seedUrl={cover}
          />
        </Field>

        <Field label="More screenshots" hint="optional · up to 5">
          <GalleryInput name="images" defaultValue={project?.images ?? []} />
        </Field>

        <Field label="Video / demo URL">
          <input
            name="video_url"
            type="url"
            defaultValue={project?.video_url ?? ""}
            className={inputClass}
            placeholder="https://loom.com/…"
          />
          {state.fieldErrors?.video_url && (
            <p className="mt-1 text-xs text-clay-deep">
              {state.fieldErrors.video_url}
            </p>
          )}
        </Field>

        <p className="rounded-lg bg-teal-50 px-3 py-2 text-xs text-teal-800">
          Add a <strong>cover image</strong> or a <strong>live link</strong> (or
          both) so people can actually see your project.
        </p>
      </FormSection>

      <FormSection
        step={3}
        title="Tags & tools"
        description="Help the right people find it — how it was built and what it's about."
      >
        <Field label="Tools used" hint="how it was built">
          <ChipField
            name="tools"
            suggestions={KNOWN_TOOLS}
            values={tools}
            setValues={setTools}
            activeClass="border-blue-mid bg-blue-tint text-blue-deep"
            placeholder="Add another tool"
          />
        </Field>

        <Field label="Category" hint="what it's about">
          <ChipField
            name="tags"
            suggestions={KNOWN_TAGS}
            values={tags}
            setValues={setTags}
            activeClass="border-teal-400 bg-teal-50 text-teal-800"
            placeholder="Add another category"
          />
        </Field>
      </FormSection>

      {showOwnership && (
        <FormSection
          step={4}
          title="Whose project is this?"
          description="Tells people whether to credit you — switch off if you're just sharing something you found."
        >
          <input type="hidden" name="ownership" value={ownership} />
          <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
            <button
              type="button"
              onClick={() => setOwnership("mine")}
              className={cn(
                "flex items-start gap-3 rounded-[12px] border px-4 py-3 text-left transition-colors",
                ownership === "mine"
                  ? "border-teal-600 bg-teal-50"
                  : "border-border bg-surface hover:border-border-hover",
              )}
            >
              <UserCheck size={18} className="mt-0.5 shrink-0 text-teal-700" />
              <span>
                <span className="block text-sm font-semibold text-ink">
                  I built this
                </span>
                <span className="block text-xs text-muted-foreground">
                  Shows &ldquo;by you&rdquo; and adds it to your profile.
                </span>
              </span>
            </button>
            <button
              type="button"
              onClick={() => setOwnership("found")}
              className={cn(
                "flex items-start gap-3 rounded-[12px] border px-4 py-3 text-left transition-colors",
                ownership === "found"
                  ? "border-teal-600 bg-teal-50"
                  : "border-border bg-surface hover:border-border-hover",
              )}
            >
              <Globe size={18} className="mt-0.5 shrink-0 text-teal-700" />
              <span>
                <span className="block text-sm font-semibold text-ink">
                  I found it on the web
                </span>
                <span className="block text-xs text-muted-foreground">
                  Posts as a community submission — no builder shown.
                </span>
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
          disabled={pending}
          className="btn-sweep inline-flex h-12 flex-1 items-center justify-center rounded-full px-4 text-[15px] font-semibold transition-transform active:scale-[0.99] disabled:opacity-70"
        >
          {pending ? "Saving…" : submitLabel}
        </button>
      </div>
      <p className="text-center text-xs text-muted-foreground">
        Goes live right away. Please only post things the community will enjoy.
      </p>
    </form>
  );
}
