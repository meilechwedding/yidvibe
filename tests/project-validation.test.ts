import { describe, expect, it } from "vitest";
import { parseProjectForm, projectFieldErrors, readFormValues } from "@/lib/validation/project";

function draft(values: Record<string, string>) {
  const data = new FormData();
  for (const [key, value] of Object.entries(values)) data.set(key, value);
  return data;
}

describe("shared project submission parsing", () => {
  it("preserves multilingual content and trims editable fields", () => {
    const result = parseProjectForm(draft({ name: "  תורה ביחד  ", description: "  A community learning tool.  ", url: "https://example.com" }));
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.name).toBe("תורה ביחד");
      expect(result.data.description).toBe("A community learning tool.");
    }
  });

  it.each(["javascript:alert(1)", "http://example.com/image.png", "https://user:secret@example.com/image.png"])("rejects unsafe image input %s at the submission boundary", image_url => {
    const result = parseProjectForm(draft({ name: "Project", description: "Real description", image_url }));
    expect(result.success).toBe(false);
    if (!result.success) expect(projectFieldErrors(result).fieldErrors?.image_url).toBe("Use an HTTPS image URL");
  });

  it("returns field-specific errors for empty required text and malformed links", () => {
    const result = parseProjectForm(draft({ name: "   ", description: "", url: "not a url" }));
    expect(result.success).toBe(false);
    if (!result.success) expect(Object.keys(projectFieldErrors(result).fieldErrors ?? {})).toEqual(["name", "description", "url"]);
  });

  it("preserves repeated tool inputs without empty entries", () => {
    const data = new FormData();
    data.append("tools", " Cursor ");
    data.append("tools", " ");
    data.append("tools", "Codex");
    expect(readFormValues(data, "tools")).toEqual(["Cursor", "Codex"]);
  });
});
