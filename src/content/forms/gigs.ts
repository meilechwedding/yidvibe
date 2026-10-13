export const gigTypes = [
  { value: "task", label: "Task", hint: "One-off, fixed scope" },
  { value: "build", label: "Build", hint: "A full project" },
  { value: "hourly", label: "Hourly", hint: "Ongoing, by the hour" },
] as const;

export const gigFormCopy = {
  apply: "Apply to this gig",
  applying: "Applying.",
  posting: "Posting.",
  post: "Post gig",
  messagePlaceholder: "Write a message.",
} as const;
