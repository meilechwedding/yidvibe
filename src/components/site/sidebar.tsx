/** The global desktop rail is retired. Dashboard and admin retain their local navigation. */
export function Sidebar(_props: {
  profile: { handle: string; name: string; avatar_url: string | null } | null;
  bellItems: import("./notification-bell").BellItem[];
  unread: number;
  isAdmin?: boolean;
  navLinks: { href: string; label: string }[];
  showGig?: boolean;
}) {
  return null;
}
