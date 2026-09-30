import { siteOrigin, type SiteOrigin } from "./siteOrigin";

const OPTIONS: { key: SiteOrigin; label: string }[] = [
  { key: "pi", label: "Raspberry Pi" },
  { key: "netlify", label: "Netlify" },
];

const SiteOriginBadge = ({ className = "" }: { className?: string }) => (
  <span className={`inline-flex items-center gap-2 ${className}`}>
    <span
      className={`h-2 w-2 rounded-full animate-pulse ${
        siteOrigin === "pi" ? "bg-green-500" : "bg-yellow-500"
      }`}
      aria-hidden="true"
    />
    <span>
      Hosted from{" "}
      {OPTIONS.map((option, i) => (
        <span key={option.key}>
          {i > 0 && <span className="opacity-40"> / </span>}
          <span
            className={
              option.key === siteOrigin ? "font-semibold opacity-100" : "opacity-40"
            }
          >
            {option.label}
          </span>
        </span>
      ))}
    </span>
  </span>
);

export default SiteOriginBadge;
