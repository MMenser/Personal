import React from "react";
import headshot from "./assets/BlackbgHeadshot.png";
import SiteOriginBadge from "./SiteOriginBadge";
import ActivityGraph from "./ActivityGraph";
import InfoTip from "./InfoTip";
import ProjectPage from "./ProjectPage";
import { formatDateRange, sortedProjects } from "./projects";
import { projectHref, useProjectRoute } from "./route";

// Rows of short facts and links shown under my name, items separated by dots.
// color is any CSS color; leave it out for the default gray.
// Items with an href open in a new tab; icon shows before the text.
interface TaglineItem {
  text: string;
  color?: string;
  href?: string;
  icon?: React.ReactNode;
}

const tagline: TaglineItem[][] = [
  [
    { text: "wsu", color: "#981E32" },
    { text: "computer science", color: "#2d5e13" },
  ],
  [
    { text: "c/c++", color: "#0369A1" },
    { text: "python", color: "#0369A1" },
    { text: "typescript", color: "#0369A1" },
  ],
  [
    { text: "esp32", color: "#C4261D" },
    { text: "freertos", color: "#C4261D" },
    { text: "spi", color: "#C4261D" },
    { text: "i2c", color: "#C4261D" },
    { text: "canbus", color: "#C4261D" },
  ],
  [
    { text: "react", color: "#2F6F2E" },
    { text: "react native", color: "#2F6F2E" },
    { text: "node", color: "#2F6F2E" },
    { text: "express", color: "#2F6F2E" },
    { text: "flask", color: "#2F6F2E" },
  ],
  [
    { text: "pytorch", color: "#7E22CE" },
    { text: "neural networks", color: "#7E22CE" },
    { text: "vector embeddings", color: "#7E22CE" },
  ],
  [
    { text: "ec2", color: "#C2410C" },
    { text: "s3", color: "#C2410C" },
    { text: "postgresql", color: "#C2410C" },
  ],
  [
    { text: "aws cloud practitioner", color: "#C2410C" },
    {text: 'ussf referee', color:'#016403'},
    {text: 'first aid & cpr', color:'#EE2435'},
  ],
  [
    { text: "github", href: "https://github.com/MMenser" },
    { text: "linkedIn", href: "https://www.linkedin.com/in/mason-menser-64467324a/" },
    { text: "instagram", href: "https://www.instagram.com/mason.menser/" },
    // { text: "Resume", href: "/CV.pdf", icon: <Badge size={14} /> },
  ],
];

const skills = [
  { label: "Languages", items: ["C/C++", "Python", "C#", "TypeScript"] },
  { label: "Frameworks", items: ["React", "React Native", "Node.js", "Express", "Flask"] },
  { label: "Technologies", items: ["EC2", "S3", "Nginx", "UART", "I2C", "SPI"] },
  { label: "Databases", items: ["PostgreSQL"] },
];

const App: React.FC = () => {
  const project = useProjectRoute();
  if (project) return <ProjectPage project={project} />;

  return (
    <div className="bg-white min-h-screen text-neutral-900">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 py-10 sm:py-16">

        {/* ===== HEADER ===== */}
        <header className="flex items-start justify-between gap-4 mb-10 sm:mb-12">
          <div className="min-w-0">
            <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-neutral-900">
              Mason Menser
            </h1>
            <div className="mt-2 space-y-2">
              {tagline.map((row, r) => (
                <p key={r} className="flex flex-wrap items-center gap-x-2 gap-y-1 text-sm text-neutral-500">
                  {row.map((item, i) => (
                    <React.Fragment key={item.text}>
                      {i > 0 && <span aria-hidden className="text-neutral-300">·</span>}
                      {item.href ? (
                        <a href={item.href} target="_blank" rel="noopener noreferrer"
                          style={{ color: item.color }}
                          className="flex items-center gap-1.5 text-blue-600 underline underline-offset-2 hover:text-blue-800 transition-colors">
                          {item.icon}{item.text}
                        </a>
                      ) : (
                        <span style={{ color: item.color }} className="flex items-center gap-1.5">
                          {item.icon}{item.text}
                        </span>
                      )}
                    </React.Fragment>
                  ))}
                </p>
              ))}
            </div>
          </div>
          <img
            src={headshot}
            alt="Mason Menser"
            className="rounded-full w-16 h-16 sm:w-20 sm:h-20 flex-shrink-0 object-cover"
          />
        </header>

        <SiteOriginBadge className="mb-6 text-xs text-neutral-500" />

        {/* ===== ABOUT ===== */}
        <section className="mb-8">
          <img
            src="https://ghchart.rshah.org/MMenser"
            alt="GitHub contribution graph"
            className="w-full mt-5 rounded"
          />
          <div className="mt-2 text-center text-xs text-neutral-500">
            <InfoTip
              align="center"
              content="My code contributions to repos over the year. API by ghchart.rshah.org."
            >
              Code contributions
            </InfoTip>
          </div>
          <ActivityGraph />
        </section>

        {/* ===== PROJECTS ===== */}
        <section className="mb-8">
          <h2 className="text-[11px] font-bold uppercase tracking-widest text-blue-500 mb-3">
            Projects
          </h2>
          <ul className="list-disc pl-5 space-y-1.5 text-[15px] text-neutral-600 marker:text-neutral-300">
            {sortedProjects.map(p => (
              <li key={p.id}>
                <a href={projectHref(p.id)}
                  className="font-semibold text-blue-600 hover:text-blue-800 hover:underline transition-colors">
                  {p.title}
                </a>
                <span className="text-neutral-400 text-sm">{" - "}{formatDateRange(p.startDate, p.endDate)}</span>
              </li>
            ))}
          </ul>
        </section>

        <hr className="border-neutral-100 my-7" />


        {/* ===== FOOTER ===== */}
        <footer className="pt-8 border-t border-neutral-100">
          <span className="text-neutral-300 text-sm">Mason Menser</span>
        </footer>

      </div>
    </div>
  );
};

export default App;
