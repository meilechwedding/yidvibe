/** Route entrance is CSS-only: no client bundle, timers or navigation delays. */
export default function Template({ children }: { children: React.ReactNode }) {
  return <div className="route-enter">{children}</div>;
}
