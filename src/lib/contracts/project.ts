/** Browser-safe state returned by project actions. */
export type ProjectFormState = {
  error?: string;
  fieldErrors?: Record<string, string>;
};
