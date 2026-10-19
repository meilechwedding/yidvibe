"use client";

import { useId, useRef, useState } from "react";
import { Upload, Loader2, X } from "lucide-react";
import { toast } from "sonner";
import { uploadImage } from "@/lib/image/upload";
import { safeHttpsImageUrl } from "@/lib/security/image-urls";
import { cn } from "@/lib/utils";

/**
 * Image picker that accepts EITHER a Supabase Storage upload OR a pasted URL.
 * Carries the resulting URL in a hidden input named `name` for the form action.
 */
export function ImageInput({
  name,
  bucket,
  defaultValue,
  shape = "rect",
  fallbackInitial,
  onUploadingChange,
  onValueChange,
  error,
}: {
  name: string;
  error?: string;
  bucket: "avatars" | "project-media";
  defaultValue?: string | null;
  shape?: "circle" | "rect";
  fallbackInitial?: string;
  onUploadingChange?: (uploading: boolean) => void;
  onValueChange?: (url: string) => void;
}) {
  const errorId = useId();
  const [url, setUrl] = useState(defaultValue ?? "");
  const [uploading, setUploading] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);
  const previewUrl = safeHttpsImageUrl(url);

  async function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    onUploadingChange?.(true);
    try {
      const { url: uploaded, error } = await uploadImage(file, bucket);
      if (error || !uploaded) {
        toast.error(error ?? "Upload failed.");
        return;
      }
      setUrl(uploaded);
      onValueChange?.(uploaded);
    } catch {
      toast.error("Upload failed. Please try again.");
    } finally {
      setUploading(false);
      onUploadingChange?.(false);
      if (fileRef.current) fileRef.current.value = "";
    }
  }

  const isCircle = shape === "circle";

  return (
    <div>
      <input type="hidden" name={name} value={url} />
      <div className="image-input-layout">
        <div
          className={cn(
            "relative flex shrink-0 items-center justify-center overflow-hidden bg-teal-50 text-teal-600",
            isCircle
              ? "h-16 w-16 rounded-full"
              : "image-input-preview aspect-[16/9] rounded-xl",
          )}
        >
          {previewUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={previewUrl}
              alt=""
              className="h-full w-full object-contain"
            />
          ) : (
            <span className="font-display text-xl">
              {fallbackInitial ?? "+"}
            </span>
          )}
          {url && (
            <button
              type="button"
              disabled={uploading}
              onClick={() => {
                setUrl("");
                onValueChange?.("");
              }}
              aria-label="Remove image"
              className="absolute right-1 top-1 inline-flex h-11 w-11 items-center justify-center rounded-input bg-ink/70 text-white"
            >
              <X size={12} />
            </button>
          )}
        </div>

        <div className="min-w-0 flex flex-1 flex-col gap-3">
          <button
            type="button"
            onClick={() => fileRef.current?.click()}
            disabled={uploading}
            className="inline-flex h-12 items-center gap-2 rounded-input border border-border bg-surface px-3 text-sm font-medium text-ink transition-colors hover:bg-secondary disabled:opacity-60"
          >
            {uploading ? (
              <Loader2 size={15} className="animate-spin" />
            ) : (
              <Upload size={15} />
            )}
            {uploading ? "Uploading…" : "Upload image"}
          </button>
          <input
            ref={fileRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleFile}
          />
          <input
            aria-label="Image URL"
            aria-invalid={error ? true : undefined}
            aria-describedby={error ? errorId : undefined}
            type="url"
            inputMode="url"
            value={url}
            disabled={uploading}
            onChange={(e) => {
              setUrl(e.target.value);
              onValueChange?.(e.target.value);
            }}
            placeholder="…or paste an image URL"
            className="h-12 w-full min-w-0 rounded-input border border-border bg-surface px-3 text-sm text-ink outline-none placeholder:text-muted-foreground focus:ring-2 focus:ring-ring"
          />
        </div>
      </div>
      {error && (
        <p id={errorId} className="mt-2 text-sm text-clay-deep">
          {error}
        </p>
      )}
    </div>
  );
}
