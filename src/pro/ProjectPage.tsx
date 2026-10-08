import { formatDateRange, type Project } from "./projects";

const LINKS = [
  { key: "github", label: "GitHub" },
  { key: "live", label: "Live" },
  { key: "demo", label: "Demo" },
] as const;

const ProjectPage = ({ project }: { project: Project }) => (
  <div className="bg-white min-h-screen text-neutral-900">
    <div className="max-w-2xl mx-auto px-4 sm:px-6 py-10 sm:py-16">

      <a href="#/" className="text-sm text-neutral-500 hover:text-blue-600 transition-colors">
        &larr; Mason Menser
      </a>

      <header className="mt-8 mb-6">
        <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-neutral-900">
          {project.title}
        </h1>
        <p className="text-sm mt-2">
          {project.endDate === null
            ? <span className="text-green-600">Ongoing</span>
            : <span className="text-neutral-400">{formatDateRange(project.startDate, project.endDate)}</span>
          }
        </p>
        <div className="flex flex-wrap gap-1.5 mt-3">
          {project.tech.map(t => (
            <span key={t} className="bg-blue-50 text-blue-700 ring-1 ring-blue-100 rounded px-1.5 py-0.5 text-[11px] font-mono">{t}</span>
          ))}
        </div>
      </header>

      <p className="text-[15px] text-neutral-600 leading-relaxed">
        {project.description}
      </p>

      {LINKS.some(({ key }) => project[key]) && (
        <div className="flex gap-4 mt-6 text-sm">
          {LINKS.map(({ key, label }) => project[key] && (
            <a key={key} href={project[key]} target="_blank" rel="noopener noreferrer"
              className="text-blue-600 hover:text-blue-800 transition-colors">{label}</a>
          ))}
        </div>
      )}

    </div>
  </div>
);

export default ProjectPage;
