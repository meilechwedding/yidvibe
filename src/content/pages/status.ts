export const STATUS_COPY = {
  error: {
    eyebrow: "Oops",
    title: "Something went wrong",
    description: "An unexpected error occurred. Please try again.",
    retry: "Try again",
  },
  notFound: {
    title: "Page not found",
    description: "That page doesn't exist or has moved.",
    home: "Back home",
  },
} as const;
