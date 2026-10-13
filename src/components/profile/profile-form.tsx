"use client";

import { profileFormCopy } from "@/content/forms/profile";

import { FORM_INPUT_CLASS, FORM_TEXTAREA_CLASS } from "@/lib/design/controls";

import { FormField as Field } from "@/components/brand/form-field";

import { useActionState, useState } from "react";
import { Plus, X } from "lucide-react";
import { updateProfile, type ProfileFormState } from "@/lib/actions/profile";
import { CancelButton } from "@/components/brand/cancel-button";
import { FormSection } from "@/components/brand/form-section";
import { useUnsavedChanges } from "@/hooks/use-unsaved-changes";
import { useScrollToFirstError } from "@/hooks/use-scroll-to-error";
import { CoverAvatarInput } from "@/components/profile/cover-avatar-input";
import { KNOWN_TOOLS } from "@/lib/site";
import type { Profile } from "@/lib/queries";
import { cn } from "@/lib/utils";

export function ProfileForm({ profile }: { profile: Profile }) {
  const [state, action, pending] = useActionState<ProfileFormState, FormData>(
    updateProfile,
    {},
  );
  const formRef = useScrollToFirstError(state.fieldErrors);

  const [dirty, setDirty] = useState(false);
  useUnsavedChanges(dirty);
  const [uploading, setUploading] = useState(false);
  const links = (profile.links ?? {}) as Record<string, string | undefined>;

  const [tools, setTools] = useState<string[]>(profile.tools ?? []);
  const [customTool, setCustomTool] = useState("");

  const toggleTool = (t: string) => {
    setDirty(true);
    setTools((cur) => (cur.includes(t) ? cur.filter((x) => x !== t) : [...cur, t]));
  };
  const addCustom = () => {
    const t = customTool.trim();
    if (t && !tools.includes(t)) { setTools((cur) => [...cur, t]); setDirty(true); }
    setCustomTool("");
  };
  const chipTools = [...new Set([...KNOWN_TOOLS, ...tools])];

  const [skills, setSkills] = useState<string[]>(profile.skills ?? []);
  const [customSkill, setCustomSkill] = useState("");

  const removeSkill = (s: string) => {
    setSkills((cur) => cur.filter((x) => x !== s));
    setDirty(true);
  };
  const addSkill = () => {
    const s = customSkill.trim();
    if (s && !skills.includes(s)) { setSkills((cur) => [...cur, s]); setDirty(true); }
    setCustomSkill("");
  };

  return (
    <form
      ref={formRef}
      action={action}
      onChange={() => setDirty(true)}
      onSubmit={(event) => { if (uploading) event.preventDefault(); }}
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
        title={profileFormCopy.identityTitle}
        description={profileFormCopy.identityDescription}
      >
        <CoverAvatarInput
          onUploadingChange={setUploading}
          onValueChange={() => setDirty(true)}
          defaultCover={profile.cover_url}
          defaultAvatar={profile.avatar_url}
          fallbackInitial={profile.name.slice(0, 1).toUpperCase()}
        />

        <Field label={profileFormCopy.labelDisplayName} required error={state.fieldErrors?.name}>
          <input
            name="name"
            defaultValue={profile.name}
            maxLength={80}
            className={FORM_INPUT_CLASS}
            placeholder={profileFormCopy.placeholderYourName}
          />
        </Field>

        <Field
          label={profileFormCopy.labelHandle}
          hint={profileFormCopy.hintYidvibeComUYourHandle}
          error={state.fieldErrors?.handle}
        >
          <input
            name="handle"
            defaultValue={profile.handle}
            className={cn(FORM_INPUT_CLASS, "font-mono")}
            placeholder={profileFormCopy.placeholderYourHandle}
          />
        </Field>
      </FormSection>

      <FormSection
        step={2}
        title={profileFormCopy.aboutTitle}
        description={profileFormCopy.aboutDescription}
      >
        <Field label={profileFormCopy.labelBio}>
          <textarea
            name="bio"
            defaultValue={profile.bio ?? ""}
            maxLength={600}
            rows={4}
            className={FORM_TEXTAREA_CLASS}
            placeholder={profileFormCopy.placeholderAShortIntroWhatYou}
          />
        </Field>

        <Field label={profileFormCopy.labelLocation}>
          <input
            name="location"
            defaultValue={profile.location ?? ""}
            maxLength={80}
            className={FORM_INPUT_CLASS}
            placeholder={profileFormCopy.placeholderBrooklynNY}
          />
        </Field>
      </FormSection>

      <FormSection
        step={3}
        title={profileFormCopy.toolsSkillsTitle}
        description={profileFormCopy.toolsSkillsDescription}
      >
        <Field label={profileFormCopy.labelToolsYouUse}>
          <div className="flex flex-wrap gap-2">
            {chipTools.map((t) => {
              const active = tools.includes(t);
              return (
                <button
                  key={t}
                  type="button"
                  onClick={() => toggleTool(t)}
                  aria-pressed={active}
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
              aria-label={profileFormCopy.accessibleAddAnotherTool}
              value={customTool}
              onChange={(e) => setCustomTool(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  addCustom();
                }
              }}
              placeholder={profileFormCopy.accessibleAddAnotherTool}
              className={cn(FORM_INPUT_CLASS, "h-9 max-w-xs")}
            />
            <button type="button" onClick={addCustom} className="btn btn-ghost btn-sm">
              <Plus size={15} />{profileFormCopy.textAdd}</button>
          </div>
          {tools.map((t) => (
            <input key={t} type="hidden" name="tools" value={t} />
          ))}
        </Field>

        <Field
          label={profileFormCopy.labelSkills}
          hint={profileFormCopy.hintWhatYouCanDoUsed}
        >
          {skills.length > 0 && (
            <div className="mb-2 flex flex-wrap gap-2">
              {skills.map((s) => (
                <button
                  key={s}
                  type="button"
                  onClick={() => removeSkill(s)}
                  className="inline-flex items-center gap-1 rounded-full border border-sage-mid bg-sage-tint px-3 py-1 text-sm text-sage-deep transition-colors hover:border-clay-mid hover:text-clay-deep"
                  title={profileFormCopy.titleRemove}
                >
                  {s}
                  <X size={13} />
                </button>
              ))}
            </div>
          )}
          <div className="flex gap-2">
            <input
              aria-label={profileFormCopy.accessibleAddASkill}
              value={customSkill}
              onChange={(e) => setCustomSkill(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  addSkill();
                }
              }}
              placeholder={profileFormCopy.placeholderEGReactAIPrompting}
              className={cn(FORM_INPUT_CLASS, "h-9 max-w-xs")}
            />
            <button type="button" onClick={addSkill} className="btn btn-ghost btn-sm">
              <Plus size={15} />{profileFormCopy.textAdd}</button>
          </div>
          {skills.map((s) => (
            <input key={s} type="hidden" name="skills" value={s} />
          ))}
        </Field>
      </FormSection>

      <FormSection
        step={4}
        title={profileFormCopy.visibilityTitle}
        description={profileFormCopy.visibilityDescription}
      >
        <label className="flex cursor-pointer items-center justify-between rounded-card border border-border bg-secondary/40 px-4 py-3">
          <span>
            <span className="block text-sm font-medium text-ink">{profileFormCopy.publicProfileLabel}</span>
            <span className="block text-xs text-muted-foreground">
              {profileFormCopy.publicProfileHint}
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
            <span className="block text-sm font-medium text-ink">{profileFormCopy.availableForHireLabel}</span>
            <span className="block text-xs text-muted-foreground">
              {profileFormCopy.availableForHireHint}
            </span>
          </span>
          <input
            type="checkbox"
            name="available_for_hire"
            defaultChecked={profile.available_for_hire}
            className="peer sr-only"
          />
          <span className="relative h-6 w-11 shrink-0 rounded-full bg-border transition-colors peer-checked:bg-sage-mid after:absolute after:left-0.5 after:top-0.5 after:h-5 after:w-5 after:rounded-full after:bg-white after:transition-transform peer-checked:after:translate-x-5" />
        </label>

        <label className="flex cursor-pointer items-center justify-between rounded-card border border-border bg-secondary/40 px-4 py-3">
          <span>
            <span className="block text-sm font-medium text-ink">{profileFormCopy.realNameLabel}</span>
            <span className="block text-xs text-muted-foreground">{profileFormCopy.realNameHint}</span>
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
        title={profileFormCopy.contactLinksTitle}
        description={profileFormCopy.contactLinksDescription}
      >
        <Field
          label={profileFormCopy.labelContactPublic}
          hint={profileFormCopy.hintDirectWaysToReachYou}
        >
          <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
            <input name="link_email" aria-label={profileFormCopy.accessibleEmail} type="email" defaultValue={links.email ?? ""} className={FORM_INPUT_CLASS} placeholder={profileFormCopy.accessibleEmail} />
            <input name="link_phone" aria-label={profileFormCopy.accessiblePhone} defaultValue={links.phone ?? ""} className={FORM_INPUT_CLASS} placeholder={profileFormCopy.accessiblePhone} />
            <input name="link_whatsapp" aria-label={profileFormCopy.accessibleWhatsAppNumber} defaultValue={links.whatsapp ?? ""} className={FORM_INPUT_CLASS} placeholder={profileFormCopy.accessibleWhatsAppNumber} />
            <input name="link_instagram" aria-label={profileFormCopy.accessibleInstagramHandle} defaultValue={links.instagram ?? ""} className={FORM_INPUT_CLASS} placeholder={profileFormCopy.placeholderInstagramHandle} />
          </div>
        </Field>

        <Field label={profileFormCopy.labelLinks}>
          <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
            <input name="link_website" aria-label={profileFormCopy.accessibleWebsite} defaultValue={links.website ?? ""} className={FORM_INPUT_CLASS} placeholder={profileFormCopy.accessibleWebsite} />
            <input name="link_github" aria-label={profileFormCopy.accessibleGitHub} defaultValue={links.github ?? ""} className={FORM_INPUT_CLASS} placeholder={profileFormCopy.accessibleGitHub} />
            <input name="link_x" aria-label={profileFormCopy.accessibleXTwitter} defaultValue={links.x ?? ""} className={FORM_INPUT_CLASS} placeholder={profileFormCopy.accessibleXTwitter} />
            <input name="link_linkedin" aria-label={profileFormCopy.accessibleLinkedIn} defaultValue={links.linkedin ?? ""} className={FORM_INPUT_CLASS} placeholder={profileFormCopy.accessibleLinkedIn} />
          </div>
        </Field>
      </FormSection>

      <div className="flex items-center gap-3 pt-1">
        <CancelButton dirty={dirty} fallbackHref={`/u/${profile.handle}`} />
        <button
          type="submit"
          disabled={pending || uploading}
          className="btn-sweep inline-flex h-12 flex-1 items-center justify-center rounded-full px-4 text-[15px] font-semibold transition-transform active:scale-[0.99] disabled:opacity-70"
        >
          {pending ? profileFormCopy.savingLabel : profileFormCopy.saveLabel}
        </button>
      </div>
    </form>
  );
}
