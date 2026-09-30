export type SiteOrigin = "pi" | "netlify";

// Netlify sets VITE_SITE_ORIGIN via netlify.toml at build time.
// The Pi build has no such override, so it falls back to "pi".
export const siteOrigin: SiteOrigin =
  import.meta.env.VITE_SITE_ORIGIN === "netlify" ? "netlify" : "pi";
