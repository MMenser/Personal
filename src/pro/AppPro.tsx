import React from "react";
import { Badge } from "lucide-react";
import headshot from "../assets/BlackbgHeadshot.png";
import SiteOriginBadge from "../SiteOriginBadge";
import ActivityGraph from "./ActivityGraph";
import InfoTip from "../InfoTip";
import ProjectOrbit from "./ProjectOrbit";
import ProjectPage from "./ProjectPage";
import { hi, sortedProjects } from "./projects";
import { useProjectRoute } from "./route";

const AppPro: React.FC = () => {
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
            <p className="text-neutral-600 mt-1.5 text-sm sm:text-base">
              Computer Science Graduate
            </p>
            <div className="mt-3 flex flex-wrap gap-2">
              <span className="rounded-full px-2.5 py-1 text-xs font-semibold ring-1">
                WSU Class of 2026
              </span>
              <span className="rounded-full bg-blue-50 px-2.5 py-1 text-xs font-semibold text-blue-700 ring-1 ring-blue-100">
                Embedded + Full-stack
              </span>
            </div>
            <div className="flex flex-wrap items-center gap-x-4 gap-y-2 mt-4">
              <a href="https://github.com/MMenser" target="_blank" rel="noopener noreferrer"
                className="flex items-center gap-1.5 text-sm text-neutral-500 hover:text-blue-600 transition-colors">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22" />
                </svg>
                GitHub
              </a>
              <a href="https://www.linkedin.com/in/mason-menser-64467324a/" target="_blank" rel="noopener noreferrer"
                className="flex items-center gap-1.5 text-sm text-neutral-500 hover:text-blue-600 transition-colors">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
                  <rect x="2" y="9" width="4" height="12" />
                  <circle cx="4" cy="4" r="2" />
                </svg>
                LinkedIn
              </a>
              <a href="https://www.instagram.com/mason.menser/" target="_blank" rel="noopener noreferrer"
                className="flex items-center gap-1.5 text-sm text-neutral-500 hover:text-blue-600 transition-colors">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
                  <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                  <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
                </svg>
                Instagram
              </a>
              <a href="/CV.pdf" target="_blank" rel="noopener noreferrer"
                className="flex items-center gap-1.5 text-sm text-neutral-500 hover:text-blue-600 transition-colors">
                <Badge size={14} /> Resume
              </a>
            </div>
          </div>
          <div className="flex items-center gap-3 flex-shrink-0">
            <SiteOriginBadge align="right" className="text-xs text-neutral-500" />
            <img
              src={headshot}
              alt="Mason Menser"
              className="rounded-full w-16 h-16 sm:w-20 sm:h-20 flex-shrink-0 object-cover"
            />
          </div>
        </header>

        {/* ===== ABOUT ===== */}
        <ProjectOrbit items={sortedProjects}>
          <section className="mb-8">
            <h2 className="text-[11px] font-bold uppercase tracking-widest text-blue-500 mb-3">
              About
            </h2>
            <p className="text-[15px] text-neutral-600 leading-relaxed">
              I'm a recent Washington State University graduate with a {hi("B.S. in Computer Science")} with minors in History and Math. Born and raised in the Seattle area, I enjoy nature, soccer, rock climbing, reading, and spending time with friends.
            </p>
            <img
              src="https://ghchart.rshah.org/MMenser"
              alt="GitHub contribution graph"
              className="w-full mt-5 rounded"
            />
            <div className="mt-2 text-center text-xs text-neutral-500">
              <InfoTip
                align="center"
                content="My GitHub contributions in the past year: commits, pull requests and issues. Darker squares mean more contributions that day. Chart by ghchart.rshah.org."
              >
                GitHub
              </InfoTip>
            </div>
            <ActivityGraph />
          </section>
        </ProjectOrbit>

        <hr className="border-neutral-100 my-7" />

        {/* ===== SKILLS ===== */}
        <section className="mb-8">
          <h2 className="text-[11px] font-bold uppercase tracking-widest text-blue-500 mb-3">
            Skills
          </h2>
          <div className="space-y-2 text-[15px] text-neutral-600">
            <div><span className="font-semibold">Languages</span>{" - "}C/C++, Python, C#, TypeScript</div>
            <div><span className="font-semibold">Frameworks</span>{" - "}React, React Native, Node.js, Express, Flask</div>
            <div><span className="font-semibold">Technologies</span>{" - "}EC2, S3, Nginx, UART, I2C, SPI</div>
            <div><span className="font-semibold">Databases</span>{" - "}PostgreSQL</div>
            <div><span className="font-semibold">Certifications</span>{" - "}AWS Cloud Practitioner, Red Cross First Aid & CPR, 2025 USSF Referee</div>
          </div>
        </section>

        {/* ===== FOOTER ===== */}
        <footer className="pt-8 border-t border-neutral-100">
          <span className="text-neutral-300 text-sm">Mason Menser</span>
        </footer>

      </div>
    </div>
  );
};

export default AppPro;
