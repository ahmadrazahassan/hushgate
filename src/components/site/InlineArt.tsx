import Image from "next/image";

/** Small pieces of artwork that sit inside large statement text. No backgrounds, sized in em. */

export function GlobeArt({ className = "" }: { className?: string }) {
  return (
    <span className={`relative inline-block size-[1.02em] align-[-0.16em] ${className}`}>
      <Image src="/globe.png" alt="" fill unoptimized sizes="96px" className="object-cover" />
    </span>
  );
}

/** A glossy map pin: the address stays where you put it. */
export function PinArt({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 40 52" className={`inline-block h-[0.98em] w-auto align-[-0.14em] ${className}`} aria-hidden="true">
      <defs>
        <linearGradient id="pin-body" x1="0.2" y1="0" x2="0.8" y2="1">
          <stop offset="0" stopColor="#8f9cff" />
          <stop offset="0.5" stopColor="#5267ff" />
          <stop offset="1" stopColor="#3446d9" />
        </linearGradient>
        <radialGradient id="pin-shadow" cx="0.5" cy="0.5" r="0.5">
          <stop offset="0" stopColor="#3446d9" stopOpacity="0.35" />
          <stop offset="1" stopColor="#3446d9" stopOpacity="0" />
        </radialGradient>
      </defs>
      <ellipse cx="20" cy="48.5" rx="11" ry="3" fill="url(#pin-shadow)" />
      <path d="M20 1.5C9.8 1.5 2 9.3 2 19.3c0 11.5 12.6 23.3 16.6 26.7a2.2 2.2 0 0 0 2.8 0C25.4 42.6 38 30.8 38 19.3 38 9.3 30.2 1.5 20 1.5Z" fill="url(#pin-body)" />
      <path d="M8 13.5C10 7.8 15 4.6 20.6 4.6" stroke="#ffffff" strokeOpacity="0.55" strokeWidth="2.4" strokeLinecap="round" fill="none" />
      <circle cx="20" cy="19" r="6.6" fill="#ffffff" />
      <circle cx="20" cy="19" r="2.6" fill="#3446d9" />
    </svg>
  );
}

/** A scalloped green seal with a check: clean reputation. */
export function SealArt({ className = "" }: { className?: string }) {
  const points = Array.from({ length: 24 }, (_, index) => {
    const angle = (index / 24) * Math.PI * 2 - Math.PI / 2;
    const radius = index % 2 === 0 ? 22 : 19;
    return `${(24 + Math.cos(angle) * radius).toFixed(2)},${(24 + Math.sin(angle) * radius).toFixed(2)}`;
  }).join(" ");
  return (
    <svg viewBox="0 0 48 48" className={`inline-block size-[0.98em] align-[-0.14em] ${className}`} aria-hidden="true">
      <defs>
        <linearGradient id="seal-body" x1="0.15" y1="0" x2="0.85" y2="1">
          <stop offset="0" stopColor="#5eeaa8" />
          <stop offset="0.55" stopColor="#1fb574" />
          <stop offset="1" stopColor="#12884f" />
        </linearGradient>
      </defs>
      <polygon points={points} fill="url(#seal-body)" stroke="url(#seal-body)" strokeWidth="3" strokeLinejoin="round" />
      <circle cx="24" cy="24" r="14.5" fill="none" stroke="#ffffff" strokeOpacity="0.35" strokeWidth="1.4" />
      <path d="m16.5 24.5 5 5 10.5-11" fill="none" stroke="#ffffff" strokeWidth="3.6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
