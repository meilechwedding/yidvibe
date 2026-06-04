"use client";

import { useActionState, useState } from "react";
import { Plus } from "lucide-react";
import { updateProfile, type ProfileFormState } from "@/lib/actions/profile";
import { CancelButton } from "@/components/brand/cancel-button";
import { FormSection } from "@/components/brand/form-section";
import { useUnsavedChanges } from "@/hooks/use-unsaved-changes";
import { useScrollToFirstError } from "@/hooks/use-scroll-to-error";
import { CoverAvatarInput } from "@/components/profile/cover-avatar-input";
import { KNOWN_TOOLS } from "@/lib/site";
import type { Profile } from "@/lib/queries";
import { cn } from "@/lib/utils";

const inputClass =
  "h-11 w-full rounded-xl border border-border bg-surface px-3.5 text-sm text-ink outline-none transition-colors placeholder:text-muted-foreground focus:border-teal-600 focus:ring-2 focus:ring-teal-600/15";

function Field({
  label,
  children,
  required,
  hint,
  error,
}: {
  label: string;
  children: React.ReactNode;
  required?: boolean;
  hint?: string;
  error?: string;
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
      {error && <p className="mt-1 text-xs text-clay-deep">{error}</p>}
    </div>
  );
}

export function ProfileForm({ profile }: { profile: Profile }) {
  const [state, action, pending] = useActionState<ProfileFormState, FormData>(
    updateProfile,
    {},
  );
  const formRef = useScrollToFirstError(state.fieldErrors);

  const [dirty, setDirty] = useState(false);
  useUnsavedChanges(dirty);
  const links = (profile.links ?? {}) as Record<string, string | undefined>;

  const [tools, setTools] = useState<string[]>(profile.tools ?? []);
  const [customTool, setCustomTool] = useState("");

  const toggleTool = (t: string) =>
    setTools((cur) => (cur.includes(t) ? cur.filter((x) => x !== t) : [...cur, t]));
  const addCustom = () => {
    const t = customTool.trim();
    if (t && !tools.includes(t)) setTools((cur) => [...cur, t]);
    setCustomTool("");
  };
  const chipTools = [...new Set([...KNOWN_TOOLS, ...tools])];

  return (
    <form
      ref={formRef}
      action={action}
      onChange={() => setDirty(true)}
      noValidate
      className="space-y-5"
    >
      {state.error && (
        <div className="rounded-lg bg-clay-tint px-3 py-2 text-sm text-clay-deep">
          {state.error}
        </div>
      )}

      <FormSection
        step={1}
        title="Identity"
        description="Your photo, name, and the handle people will find you by."
      >
        <CoverAvatarInput
          defaultCover={profile.cover_url}
          defaultAvatar={profile.avatar_url}
          fallbackInitial={profile.name.slice(0, 1).toUpperCase()}
        />

        <Field label="Display name" required error={state.fieldErrors?.name}>
          <input
            name="name"
            defaultValue={profile.name}
            maxLength={80}
            className={inputClass}
            placeholder="Your name"
          />
        </Field>

        <Field
          label="Handle"
          hint="yidvibe.com/u/your-handle"
          error={state.fieldErrors?.handle}
        >
          <input
            name="handle"
            defaultValue={profile.handle}
            className={cn(inputClass, "font-mono")}
            placeholder="your-handle"
          />
        </Field>
      </FormSection>

      <FormSection
        step={2}
        title="About you"
        description="A short intro and where you're based — what people read first."
      >
        <Field label="Bio">
          <textarea
            name="bio"
            defaultValue={profile.bio ?? ""}
            maxLength={600}
            rows={4}
            className="w-full resize-y rounded-xl border border-border bg-surface px-3.5 py-2.5 text-sm text-ink outline-none transition-colors placeholder:text-muted-foreground focus:border-teal-600 focus:ring-2 focus:ring-teal-600/15"
            placeholder="A short intro — what you build, your background, your passion…"
          />
        </Field>

        <Field label="Location">
          <input
            name="location"
            defaultValue={profile.location ?? ""}
            maxLength={80}
            className={inputClass}
            placeholder="Brooklyn, NY"
          />
        </Field>
      </FormSection>

      <FormSection
        step={3}
        title="Builds with"
        description="The AI tools you build with — shown on your profile."
      >
        <Field label="Tools you use">
          <div className="flex flex-wrap gap-2">
            {chipTools.map((t) => {
              const active = tools.includes(t);
              return (
                <button
                  key={t}
                  type="button"
                  onClick={() => toggleTool(t)}
                  className={cn(
                    "rounded-full border px-3 py-1 text-sm transition-colors",
                    active
                      ? "border-blue-mid bg-blue-tint text-blue-deep"
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
              value={customTool}
              onChange={(e) => setCustomTool(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  addCustom();
                }
              }}
              placeholder="Add another tool"
              className={cn(inputClass, "h-9 max-w-xs")}
            />
            <button type="button" onClick={addCustom} className="btn btn-ghost btn-sm">
              <Plus size={15} /> Add
            </button>
          </div>
          {tools.map((t) => (
            <input key={t} type="hidden" name="tools" value={t} />
          ))}
        </Field>
      </FormSection>

      <FormSection
        step={4}
        title="Visibility"
        description="Whether you have a public profile, and how your name shows."
      >
        <label className="flex cursor-pointer items-center justify-between rounded-card border border-border bg-secondary/40 px-4 py-3">
          <span>
            <span className="block text-sm font-medium text-ink">
              Show my profile publicly
            </span>
            <span className="block text-xs text-muted-foreground">
              On = people can open your profile from your projects and reach you.
              Off = you stay private and your name isn&apos;t a link.
            </span>
          </span>
          <input
            type="checkbox"
            name="is_public"
            defaultChecked={profile.is_public}
            className="peer sr-only"
          />
          <span className="relative h-6 w-11 shrink-0 rounded-full bg-border transition-colors peer-checked:bg-teal-600 after:absolute after:left-0.5 after:top-0.5 after:h-5 after:w-5 after:rounded-full after:bg-white after:transition-transform peer-checked:after:translate-x-5" />
        </label>

        <label className="flex cursor-pointer items-center justify-between rounded-card border border-border bg-secondary/40 px-4 py-3">
          <span>
            <span className="block text-sm font-medium text-ink">
              Show my real name
            </span>
            <span className="block text-xs text-muted-foreground">
              Off = people only see your @handle — on posts, comments, everywhere
            </span>
          </span>
          <input
            type="checkbox"
            name="show_real_name"
            defaultChecked={profile.show_real_name}
            className="peer sr-only"
          />
          <span className="relative h-6 w-11 shrink-0 rounded-full bg-border transition-colors peer-checked:bg-teal-600 after:absolute after:left-0.5 after:top-0.5 after:h-5 after:w-5 after:rounded-full after:bg-white after:transition-transform peer-checked:after:translate-x-5" />
        </label>
      </FormSection>

      <FormSection
        step={5}
        title="Contact & links"
        description="Fill in whatever you want shown — people use these to reach you."
      >
        <Field
          label="Contact (public)"
          hint="direct ways to reach you"
        >
          <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
            <input name="link_email" type="email" defaultValue={links.email ?? ""} className={inputClass} placeholder="Email" />
            <input name="link_phone" defaultValue={links.phone ?? ""} className={inputClass} placeholder="Phone" />
            <input name="link_whatsapp" defaultValue={links.whatsapp ?? ""} className={inputClass} placeholder="WhatsApp number" />
            <input name="link_instagram" defaultValue={links.instagram ?? ""} className={inputClass} placeholder="Instagram @handle" />
          </div>
        </Field>

        <Field label="Links">
          <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
            <input name="link_website" defaultValue={links.website ?? ""} className={inputClass} placeholder="Website" />
            <input name="link_github" defaultValue={links.github ?? ""} className={inputClass} placeholder="GitHub" />
            <input name="link_x" defaultValue={links.x ?? ""} className={inputClass} placeholder="X / Twitter" />
            <input name="link_linkedin" defaultValue={links.linkedin ?? ""} className={inputClass} placeholder="LinkedIn" />
          </div>
        </Field>
      </FormSection>

      <div className="flex items-center gap-3 pt-1">
        <CancelButton dirty={dirty} fallbackHref={`/u/${profile.handle}`} />
        <button
          type="submit"
          disabled={pending}
          className="btn-sweep inline-flex h-12 flex-1 items-center justify-center rounded-full px-4 text-[15px] font-semibold transition-transform active:scale-[0.99] disabled:opacity-70"
        >
          {pending ? "Saving…" : "Save profile"}
        </button>
      </div>
    </form>
  );
}
