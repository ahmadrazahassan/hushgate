import Image from "next/image";

const shots = {
  "home-connected": "Hushgate popup, connected to Frankfurt 02 with the kill switch on",
  "home-ready": "Hushgate popup before connecting, showing your real IP",
  locations: "Hushgate locations screen with seven Los Angeles servers",
  settings: "Hushgate settings with kill switch and WebRTC leak protection",
  welcome: "Hushgate welcome screen",
  "sign-in": "Hushgate sign-in screen",
} as const;

export type ShotName = keyof typeof shots;

/** A real screenshot of the extension popup (480 × 600, captured at 2×). */
export function ExtensionShot({ name, className = "", priority = false }: { name: ShotName; className?: string; priority?: boolean }) {
  return (
    <Image
      src={`/extension/${name}.png`}
      alt={shots[name]}
      width={960}
      height={1200}
      priority={priority}
      unoptimized
      sizes="(min-width: 1024px) 400px, 80vw"
      className={`h-auto rounded-[30px] shadow-[0_40px_80px_-40px_rgba(21,25,34,0.45),0_0_0_1px_rgba(21,25,34,0.06)] ${className}`}
    />
  );
}
