/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_SITE_ORIGIN?: "pi" | "netlify";
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
