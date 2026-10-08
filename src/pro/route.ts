import { useEffect, useState } from "react";
import { sortedProjects, type Project } from "./projects";

// Hash routes (/#/projects/<id>) so project pages work on both the Pi's nginx and
// Netlify without a server-side fallback to index.html.
const PREFIX = "#/projects/";

export const projectHref = (id: string) => `${PREFIX}${id}`;

const projectFromHash = (hash: string): Project | null =>
  hash.startsWith(PREFIX)
    ? sortedProjects.find(p => p.id === decodeURIComponent(hash.slice(PREFIX.length))) ?? null
    : null;

// The project whose page is open, or null for the home page.
export const useProjectRoute = () => {
  const [project, setProject] = useState(() => projectFromHash(window.location.hash));
  useEffect(() => {
    const onHashChange = () => {
      setProject(projectFromHash(window.location.hash));
      window.scrollTo(0, 0);
    };
    window.addEventListener("hashchange", onHashChange);
    return () => window.removeEventListener("hashchange", onHashChange);
  }, []);
  useEffect(() => {
    document.title = project ? `${project.title} - Mason Menser` : "Mason Menser";
  }, [project]);
  return project;
};
