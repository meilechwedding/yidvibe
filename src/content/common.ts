/** Repeated product wording. Feature-specific copy lives alongside this module. */
export const COMMON_COPY = {
  actions: {
    back: "Back",
    cancel: "Cancel",
    close: "Close",
    clearAll: "Clear all",
    clearSearch: "Clear search",
    done: "Done",
    filters: "Filters",
    removeFilter: "Remove filter",
    search: "Search",
    browseBy: "Browse by",
    signIn: "Sign in",
    signUp: "Sign up",
    save: "Save",
  },
  errors: {
    uploadFailed: "Upload failed.",
    unexpected: "Something went wrong. Please try again.",
  },
  draft: {
    title: "Discard your draft?",
    description: "You have unsaved changes. If you leave now, they'll be lost.",
    confirm: "Discard",
    keepEditing: "Keep editing",
    navigationWarning: "You have unsaved changes. Leave and discard your draft?",
  },
} as const;
