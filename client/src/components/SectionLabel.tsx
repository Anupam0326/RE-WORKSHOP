import type { ComponentType } from "react";

type IconType = ComponentType<{ size?: number; strokeWidth?: number; "aria-hidden"?: boolean }>;

/** Small pill that introduces a section. Use sparingly: most headings need no label. */
export function SectionLabel({ children, tone = "light", icon: Icon }: { children: React.ReactNode; tone?: "light" | "dark"; icon?: IconType }) {
  return (
    <p className={`badge badge--${tone}`}>
      {Icon && <Icon size={15} strokeWidth={2} aria-hidden />}
      <span>{children}</span>
    </p>
  );
}
