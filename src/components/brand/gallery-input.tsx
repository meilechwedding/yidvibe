"use client";

import { useRef, useState } from "react";
import { ImagePlus, Loader2, X } from "lucide-react";
import { toast } from "sonner";
import { uploadImage } from "@/lib/image/upload";
import { cn } from "@/lib/utils";

/**
 * Multi-image picker for extra project screenshots (up to `max`). Each URL is
 * carried in a hidden input named `name` so the server action reads them with
 * formData.getAll(name). Reuses the compressing uploader.
 */
export function GalleryInput({
  name,
  defaultValue = [],
  max = 5,
  onUploadingChange,
  onValueChange,
}: {
  name: string;
  defaultValue?: string[];
  max?: number;
  onUploadingChange?: (uploading: boolean) => void;
  onValueChange?: (urls: string[]) => void;
}) {
  const [urls, setUrls] = useState<string[]>(defaultValue);
  const [uploading, setUploading] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  async function handleFiles(e: React.ChangeEvent<HTMLInputElement>) {
    const files = Array.from(e.target.files ?? []);
    if (files.length === 0) return;
    const room = max - urls.length;
    if (room <= 0) {
      toast.error(`Up to ${max} images.`);
      return;
    }
    setUploading(true);
    onUploadingChange?.(true);
    try {
      let next = [...urls];
      for (const file of files.slice(0, room)) {
        const { url, error } = await uploadImage(file, "project-media");
        if (error || !url) {
          toast.error(error ?? "Upload failed.");
          continue;
        }
        next = [...next, url].slice(0, max);
        setUrls(next);
        onValueChange?.(next);
      }
      if (files.length > room) {
        toast.message(
          `Only the first ${room} selected ${room === 1 ? "image was" : "images were"} attempted. Limit: ${max} images.`,
        );
      }
    } catch {
      toast.error("Upload failed. Please try again.");
    } finally {
      setUploading(false);
      onUploadingChange?.(false);
      if (fileRef.current) fileRef.current.value = "";
    }
  }

  const remove = (u: string) => {
    const next = urls.filter((x) => x !== u);
    setUrls(next);
    onValueChange?.(next);
  };
  const full = urls.length >= max;

  return (
    <div>
      {urls.map((u) => (
        <input key={u} type="hidden" name={name} value={u} />
      ))}

      <div className="flex flex-wrap gap-2">
        {urls.map((u) => (
          <div
            key={u}
            className="relative aspect-[4/3] w-28 overflow-hidden rounded-xl border border-border bg-teal-50"
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={u} alt="" className="h-full w-full object-contain" />
            <button
              type="button"
              disabled={uploading}
              onClick={() => remove(u)}
              aria-label="Remove image"
              className="absolute right-1 top-1 inline-flex h-11 w-11 items-center justify-center rounded-input bg-ink/70 text-white"
            >
              <X size={12} />
            </button>
          </div>
        ))}

        {!full && (
          <button
            type="button"
            onClick={() => fileRef.current?.click()}
            disabled={uploading}
            className={cn(
              "flex aspect-[4/3] w-28 flex-col items-center justify-center gap-1 rounded-xl border border-dashed border-border bg-surface text-xs text-muted-foreground transition-colors hover:border-border-hover hover:text-ink disabled:opacity-60",
            )}
          >
            {uploading ? (
              <Loader2 size={16} className="animate-spin" />
            ) : (
              <ImagePlus size={16} />
            )}
            {uploading ? "Uploading…" : "Add"}
          </button>
        )}
      </div>

      <input
        ref={fileRef}
        type="file"
        accept="image/*"
        multiple
        className="hidden"
        onChange={handleFiles}
      />
      <p className="mt-2 text-xs text-muted-foreground">
        {urls.length}/{max} screenshots
      </p>
    </div>
  );
}
