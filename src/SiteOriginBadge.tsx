import InfoTip from "./InfoTip";
import { siteOrigin, type SiteOrigin } from "./siteOrigin";

const OPTIONS: { key: SiteOrigin; label: string; description: string }[] = [
  {
    key: "pi",
    label: "Pi",
    description:
      "Self-hosted on a Raspberry Pi at home. nginx serves the site, and a Cloudflare Tunnel connects it to the internet without opening any ports. The Pi also receives the workout data from my iPhone behind the activity graph.",
  },
  {
    key: "netlify",
    label: "Netlify",
    description:
      "A second copy of the same site, built from the GitHub repo and served from Netlify's global CDN.",
  },
];

interface Props {
  className?: string;
  align?: "left" | "right" | "center"; // which edge the info box lines up with
}

const SiteOriginBadge = ({ className = "", align = "left" }: Props) => (
  <span className={`inline-flex items-center gap-2 ${className}`}>
    <span
      className={`h-2 w-2 rounded-full rec-blink ${
        siteOrigin === "pi" ? "bg-green-500" : "bg-yellow-500"
      }`}
      aria-hidden="true"
    />
    <InfoTip
      align={align}
      content={OPTIONS.map(option => (
        <span key={option.key} className="block [&+&]:mt-2">
          <span className="font-semibold text-white">
            {option.label}
            {option.key === siteOrigin && <span className="ml-1.5 font-normal text-neutral-400">(you're here)</span>}
          </span>
          <span className="block">{option.description}</span>
        </span>
      ))}
    >
      {OPTIONS.map((option, i) => (
        <span key={option.key}>
          {i > 0 && " / "}
          <span className={option.key === siteOrigin ? "font-semibold" : undefined}>
            {option.label}
          </span>
        </span>
      ))}
    </InfoTip>
  </span>
);

export default SiteOriginBadge;
