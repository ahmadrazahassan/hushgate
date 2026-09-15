import type { SVGProps } from "react";

/**
 * Hushgate's own line icons: 24px grid, 1.6 stroke, round caps, no fills and no
 * backgrounds. Drawn for this brand rather than taken from a stock set.
 */
export type IconName =
  | "gate" | "unplug" | "leak" | "pin" | "split" | "autoPower" | "pause" | "lock" | "noLog"
  | "arrowRight" | "arrowUpRight" | "check" | "plus" | "chrome" | "user" | "server" | "route"
  | "signal" | "search" | "logout" | "menu" | "close" | "mail" | "globe" | "shieldless" | "clock" | "key" | "eye" | "eyeOff"
  | "home" | "card" | "users" | "sliders" | "pulse" | "trash" | "calendar" | "copy" | "chevronDown" | "gift"
  | "message" | "download" | "file" | "refresh" | "puzzle" | "power" | "book" | "scale" | "cookie" | "phone";

const paths: Record<IconName, React.ReactNode> = {
  // An arched doorway with a threshold: the Hushgate idea.
  gate: <><path d="M6 20V11a6 6 0 0 1 12 0v9" /><path d="M3.5 20h17" /><path d="M12 20v-5" /></>,
  // A plug pulled from its socket: the kill switch cuts traffic.
  unplug: <><path d="M9 3v4M15 3v4" /><path d="M6.5 7h11v3a5.5 5.5 0 0 1-11 0V7Z" /><path d="M12 15.5V21" /><path d="m3.5 3.5 17 17" /></>,
  // A droplet crossed out: no WebRTC leaks.
  leak: <><path d="M12 3.5c3.6 4.3 5.4 7.4 5.4 9.9a5.4 5.4 0 0 1-10.8 0c0-2.5 1.8-5.6 5.4-9.9Z" /><path d="m4 4 16 16" /></>,
  pin: <><path d="M12 21s6.5-5.6 6.5-11a6.5 6.5 0 0 0-13 0c0 5.4 6.5 11 6.5 11Z" /><path d="M9.5 10h5" /></>,
  split: <><path d="M4 20v-5.5A5.5 5.5 0 0 1 9.5 9H20" /><path d="m16.5 5.5 3.5 3.5-3.5 3.5" /><path d="M4 4v5" /></>,
  autoPower: <><path d="M12 3.5V11" /><path d="M7.4 6.3a7 7 0 1 0 9.2 0" /><path d="M18.5 3.5v3h-3" /></>,
  pause: <><path d="M9 5.5v13M15 5.5v13" /></>,
  lock: <><rect x="5" y="10.5" width="14" height="10" rx="3" /><path d="M8.5 10.5V8a3.5 3.5 0 0 1 7 0v2.5" /></>,
  // A page with its lines struck through: nothing written down.
  noLog: <><path d="M6.5 3.5h8l3 3v14h-11Z" /><path d="M9.5 11h5M9.5 14.5h5" /><path d="m4 20 16-16" /></>,
  arrowRight: <path d="M5 12h14m-5-5 5 5-5 5" />,
  arrowUpRight: <path d="M7 17 17 7m-8 0h8v8" />,
  check: <path d="m5 12.5 4.5 4.5L19 7" />,
  plus: <path d="M12 5v14M5 12h14" />,
  chrome: <><circle cx="12" cy="12" r="8.5" /><circle cx="12" cy="12" r="3.2" /><path d="M12 8.8h7.8M9.2 13.6 5.4 7M14.8 13.6 11 20.4" /></>,
  user: <><circle cx="12" cy="8.5" r="3.5" /><path d="M5 20c1-3.6 3.8-5.5 7-5.5s6 1.9 7 5.5" /></>,
  server: <><rect x="4" y="4" width="16" height="6.5" rx="2" /><rect x="4" y="13.5" width="16" height="6.5" rx="2" /><path d="M7.5 7.25h.01M7.5 16.75h.01" /></>,
  route: <><circle cx="6" cy="18" r="2" /><circle cx="18" cy="6" r="2" /><path d="M8 18h6.5a3.5 3.5 0 0 0 0-7h-5a3.5 3.5 0 0 1 0-7H16" /></>,
  signal: <path d="M5 19v-3M10 19v-7M15 19v-10M20 19V5" />,
  search: <><circle cx="10.5" cy="10.5" r="6" /><path d="m15 15 5 5" /></>,
  logout: <><path d="M14 4.5h3.5a2 2 0 0 1 2 2v11a2 2 0 0 1-2 2H14" /><path d="M10 16.5 5.5 12 10 7.5M5.5 12H15" /></>,
  menu: <path d="M4 8h16M4 16h16" />,
  close: <path d="m6 6 12 12M18 6 6 18" />,
  mail: <><rect x="3.5" y="5.5" width="17" height="13" rx="2.5" /><path d="m4.5 7 7.5 6 7.5-6" /></>,
  globe: <><circle cx="12" cy="12" r="8.5" /><path d="M3.5 12h17M12 3.5c2.5 2.4 3.8 5.2 3.8 8.5s-1.3 6.1-3.8 8.5c-2.5-2.4-3.8-5.2-3.8-8.5s1.3-6.1 3.8-8.5Z" /></>,
  shieldless: <><path d="M12 3.5 19 6v5.5c0 4.3-2.9 7.9-7 9-4.1-1.1-7-4.7-7-9V6Z" /><path d="M9 12h6" /></>,
  clock: <><circle cx="12" cy="12" r="8.5" /><path d="M12 7.5V12l3 2" /></>,
  key: <><circle cx="8" cy="15" r="4" /><path d="m11 12 8.5-8.5M16 7l2.5 2.5M14 9l2 2" /></>,
  eye: <><path d="M2.5 12S6 5.5 12 5.5 21.5 12 21.5 12 18 18.5 12 18.5 2.5 12 2.5 12Z" /><circle cx="12" cy="12" r="3" /></>,
  home: <><path d="M4 10.5 12 4l8 6.5V19a1.5 1.5 0 0 1-1.5 1.5H15v-5.5h-6v5.5H5.5A1.5 1.5 0 0 1 4 19Z" /></>,
  card: <><rect x="3" y="5.5" width="18" height="13" rx="2.5" /><path d="M3 10h18M7 15h3" /></>,
  users: <><circle cx="9" cy="8.5" r="3.2" /><path d="M3.5 19c.8-3.2 3-5 5.5-5s4.7 1.8 5.5 5" /><path d="M15.5 5.6a3.2 3.2 0 0 1 0 5.8M17.5 14.3c1.6.6 2.6 2.2 3 4.7" /></>,
  sliders: <><path d="M4 7h9M17 7h3M4 17h3M11 17h9" /><circle cx="15" cy="7" r="2" /><circle cx="9" cy="17" r="2" /></>,
  pulse: <path d="M3 12h4l2.5-6 5 12 2.5-6h4" />,
  trash: <><path d="M4.5 7h15M10 4h4M6.5 7l.8 11.2A2 2 0 0 0 9.3 20h5.4a2 2 0 0 0 2-1.8L17.5 7" /><path d="M10 11v5M14 11v5" /></>,
  calendar: <><rect x="4" y="5.5" width="16" height="14" rx="2.5" /><path d="M4 10h16M8.5 3.5v4M15.5 3.5v4" /></>,
  gift: <><rect x="3.5" y="8" width="17" height="4.5" rx="1" /><path d="M5 12.5v6.8a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1v-6.8M12 8v12.3M12 8S10.6 3.6 8.1 4c-2 .3-1.7 3.4.4 4M12 8s1.4-4.4 3.9-4c2 .3 1.7 3.4-.4 4" /></>,
  copy: <><rect x="8.5" y="8.5" width="11" height="11" rx="2.2" /><path d="M15.5 8.5V6.2A1.7 1.7 0 0 0 13.8 4.5H6.2A1.7 1.7 0 0 0 4.5 6.2v7.6a1.7 1.7 0 0 0 1.7 1.7h2.3" /></>,
  chevronDown: <path d="m6.5 9.5 5.5 5.5 5.5-5.5" />,
  eyeOff: <><path d="M10 5.8c.6-.2 1.3-.3 2-.3 6 0 9.5 6.5 9.5 6.5a17 17 0 0 1-2.6 3.5M6.3 7.3A16.6 16.6 0 0 0 2.5 12S6 18.5 12 18.5c1.7 0 3.2-.5 4.5-1.2" /><path d="m3.5 3.5 17 17" /></>,
  message: <><path d="M4.5 6.5a2 2 0 0 1 2-2h11a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H10l-4 3.5v-3.5a1.5 1.5 0 0 1-1.5-1.5Z" /><path d="M8.5 9.5h7M8.5 12.5h4" /></>,
  download: <><path d="M12 4v11m-4.5-4.5L12 15l4.5-4.5" /><path d="M5 19.5h14" /></>,
  file: <><path d="M6.5 3.5h7l4 4v13h-11Z" /><path d="M13.5 3.5v4h4M9.5 12h5M9.5 15.5h5" /></>,
  refresh: <><path d="M19.5 12a7.5 7.5 0 0 1-13.1 5" /><path d="M4.5 12a7.5 7.5 0 0 1 13.1-5" /><path d="M17.8 3.5v3.7h-3.7M6.2 20.5v-3.7h3.7" /></>,
  // A puzzle piece: Chrome's extensions menu.
  puzzle: <path d="M5 8.5h3.2a2 2 0 1 1 3.6 0H15v3.2a2 2 0 1 1 0 3.6V19H11.8a2 2 0 1 0-3.6 0H5v-3.7a2 2 0 1 0 0-3.6Z" />,
  power: <><path d="M12 3.5V11" /><path d="M7.2 6.5a7 7 0 1 0 9.6 0" /></>,
  book: <><path d="M4.5 5.5c2.8-.9 5.3-.6 7.5 1v13c-2.2-1.6-4.7-1.9-7.5-1Z" /><path d="M19.5 5.5c-2.8-.9-5.3-.6-7.5 1v13c2.2-1.6 4.7-1.9 7.5-1Z" /></>,
  scale: <><path d="M12 4v16M8 20h8M5.5 7.5h13" /><path d="m5.5 7.5-2.5 6a2.5 2.5 0 0 0 5 0Zm13 0-2.5 6a2.5 2.5 0 0 0 5 0Z" /></>,
  cookie: <><path d="M20.3 12.6A8.5 8.5 0 1 1 11.4 3.7a3 3 0 0 0 3.6 3.6 3 3 0 0 0 5.3 5.3Z" /><path d="M8.5 10h.01M9.5 15h.01M14 13.5h.01" /></>,
  phone: <><rect x="7" y="3" width="10" height="18" rx="2.5" /><path d="M11 17.5h2" /></>,
};

export function Icon({ name, className = "size-5", ...props }: { name: IconName } & SVGProps<SVGSVGElement>) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.6}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      className={className}
      {...props}
    >
      {paths[name]}
    </svg>
  );
}
