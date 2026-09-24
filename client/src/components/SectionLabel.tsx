/** Short archival label that opens each section. */
export function SectionLabel({ children, tone = "light" }: { children: React.ReactNode; tone?: "light" | "dark" }) {
  return (
    <p className={`section-label section-label--${tone}`}>
      <span className="section-label__dot" aria-hidden="true" />
      {children}
    </p>
  );
}
