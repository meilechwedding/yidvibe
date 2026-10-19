export const metadata = { robots: { index: false, follow: false } };

// Each retired page redirects before reading records; posting has its own destination.
export default function RetiredLayout({ children }: { children: React.ReactNode }) {
  return children;
}
