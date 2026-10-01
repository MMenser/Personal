import { useId, type ReactNode } from "react";

const ALIGN_CLASSES = {
  left: "left-0",
  right: "right-0",
  center: "left-1/2 -translate-x-1/2",
};

interface Props {
  children: ReactNode; // the hover target
  content: ReactNode;  // what the box says
  align?: keyof typeof ALIGN_CLASSES; // which edge of the target the box lines up with
  className?: string;
}

// Dark info box that opens below its target on hover or keyboard focus.
const InfoTip = ({ children, content, align = "left", className = "" }: Props) => {
  const id = useId();
  return (
    <span className={`group relative cursor-help outline-none ${className}`} tabIndex={0} aria-describedby={id}>
      {children}
      <span
        id={id}
        role="tooltip"
        className={`invisible opacity-0 group-hover:visible group-hover:opacity-100 group-focus:visible group-focus:opacity-100 transition-opacity absolute top-full mt-2 z-30 w-72 max-w-[calc(100vw-2rem)] rounded bg-neutral-900 p-3 text-left text-xs font-normal leading-relaxed text-neutral-300 shadow-lg ${ALIGN_CLASSES[align]}`}
      >
        {content}
      </span>
    </span>
  );
};

export default InfoTip;
