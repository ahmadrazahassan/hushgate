import type { SVGProps } from "react";

type LogoProps = SVGProps<SVGSVGElement> & { title?: string };

/** Google Chrome logo in its official four colours. */
export function ChromeLogo({ title, ...props }: LogoProps) {
  return (
    <svg viewBox="0 0 48 48" role={title ? "img" : undefined} aria-hidden={title ? undefined : true} {...props}>
      {title && <title>{title}</title>}
      <path fill="#EA4335" d="M24 13L45.331 13A24 24 0 0 0 3.808 11.027L14.474 29.5A11 11 0 0 1 24 13Z" /><path fill="#FBBC04" d="M33.526 29.5L22.861 47.973A24 24 0 0 0 45.331 13L24 13A11 11 0 0 1 33.526 29.5Z" /><path fill="#34A853" d="M14.474 29.5L3.808 11.027A24 24 0 0 0 22.861 47.973L33.526 29.5A11 11 0 0 1 14.474 29.5Z" /><circle cx="24" cy="24" r="11" fill="#fff" /><circle cx="24" cy="24" r="9" fill="#1A73E8" />
    </svg>
  );
}

/** Google Play logo. The yellow tip is drawn first so neighbouring colours overlap it with no seam. */
export function GooglePlayLogo({ title, ...props }: LogoProps) {
  return (
    <svg viewBox="0 0 48 48" role={title ? "img" : undefined} aria-hidden={title ? undefined : true} {...props}>
      {title && <title>{title}</title>}
      <path fill="#FFC400" d="m32.6 16.8 7.6 4.4c2 1.2 2 3.6 0 4.8l-7.6 4.4-6.6-6.4Z" />
      <path fill="#00D26A" d="M7.4 3.6c.6-.4 1.5-.5 2.4 0l23.6 13.6L27.6 24Z" />
      <path fill="#FF3A44" d="M27.6 24l5.8 6.8L9.8 44.4c-.9.5-1.8.4-2.4 0Z" />
      <path fill="#00A0FF" d="M7.4 3.6 27.6 24 7.4 44.4c-.6-.4-1-1.2-1-2.1V5.7c0-.9.4-1.7 1-2.1Z" />
    </svg>
  );
}

/** Apple logo glyph (inherits the current text colour). */
export function AppleLogo({ title, ...props }: LogoProps) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" role={title ? "img" : undefined} aria-hidden={title ? undefined : true} {...props}>
      {title && <title>{title}</title>}
      <path d="M12.152 6.896c-.948 0-2.415-1.078-3.96-1.04-2.04.027-3.91 1.183-4.961 3.014-2.117 3.675-.546 9.103 1.519 12.09 1.013 1.454 2.208 3.09 3.792 3.039 1.52-.065 2.09-.987 3.935-.987 1.831 0 2.35.987 3.96.948 1.637-.026 2.676-1.48 3.676-2.948 1.156-1.688 1.636-3.325 1.662-3.415-.039-.013-3.182-1.221-3.22-4.857-.026-3.04 2.48-4.494 2.597-4.559-1.429-2.09-3.623-2.324-4.39-2.376-2-.156-3.675 1.09-4.61 1.09zM15.53 3.83c.843-1.012 1.4-2.427 1.245-3.83-1.207.052-2.662.805-3.532 1.818-.78.896-1.454 2.338-1.273 3.714 1.338.104 2.715-.688 3.559-1.701" />
    </svg>
  );
}
