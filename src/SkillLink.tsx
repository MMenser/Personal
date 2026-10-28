import { useEffect, useId, useRef, useState, type ReactNode } from "react";
import { formatDateRange, type Project } from "./projects";
import { projectHref } from "./route";

interface Props {
  children: ReactNode; // the skill's label
  color?: string;
  projects: Project[]; // projects that use this skill
}

// Dotted underline marks a skill as clickable without competing with the real links' solid one.
const LABEL_CLASSES =
  "underline decoration-dotted decoration-1 underline-offset-4 hover:decoration-solid cursor-pointer";

// A skill that opens a click-to-open list of the projects using it. With none it's plain text.
const SkillLink = ({ children, color, projects }: Props) => {
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLSpanElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const id = useId();

  useEffect(() => {
    if (!open) return;
    const onPointerDown = (e: PointerEvent) => {
      if (!rootRef.current?.contains(e.target as Node)) setOpen(false);
    };
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key !== "Escape") return;
      setOpen(false);
      buttonRef.current?.focus();
    };
    document.addEventListener("pointerdown", onPointerDown);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("pointerdown", onPointerDown);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [open]);

  if (projects.length === 0) return <span style={{ color }}>{children}</span>;

  return (
    <span ref={rootRef} className="relative">
      <button ref={buttonRef} type="button" style={{ color }} className={LABEL_CLASSES}
        aria-expanded={open} aria-controls={id} onClick={() => setOpen(o => !o)}>
        {children}
      </button>
      {open && (
        <span id={id}
          className="absolute left-0 top-full z-30 mt-2 w-64 max-w-[calc(100vw-2rem)] rounded bg-neutral-900 p-3 text-xs leading-relaxed shadow-lg">
          <span className="mb-1.5 block text-neutral-400">Used in</span>
          <ul className="space-y-1">
            {projects.map(p => (
              <li key={p.id}>
                <a href={projectHref(p.id)} onClick={() => setOpen(false)}
                  className="font-semibold text-white hover:underline">
                  {p.title}
                </a>
              </li>
            ))}
          </ul>
        </span>
      )}
    </span>
  );
};

export default SkillLink;
