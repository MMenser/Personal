import React from "react";
import { Badge } from "lucide-react";
import headshot from "../assets/BlackbgHeadshot.png";

interface Project {
  id: string;
  title: string;
  startDate: string;   // "YYYY-MM"
  endDate: string | null; // null = ongoing
  github?: string;
  live?: string;
  demo?: string;
  tech: string[];
  description: React.ReactNode;
}

// Helper for bolded inline terms
const hi = (text: string) => (
  <span className="font-semibold text-neutral-800">{text}</span>
);

const formatDateRange = (startDate: string, endDate: string | null): string => {
  if (!endDate) return "Ongoing";
  const months = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
  const [sy, sm] = startDate.split("-");
  const [ey, em] = endDate.split("-");
  const startMon = months[+sm - 1];
  const endMon   = months[+em - 1];
  return sy === ey
    ? `${startMon} – ${endMon} ${ey}`
    : `${startMon} ${sy} – ${endMon} ${ey}`;
};

// Add new projects here. Sorting is automatic:
//   - endDate: null  → Ongoing (sorts first, by startDate descending)
//   - endDate: "YYYY-MM" → completed (sorts by end date descending)
const projects: Project[] = [
  {
    id: "obd2",
    title: "OBD2 Vehicle Telemetry Display",
    startDate: "2026-01",
    endDate: null,
    tech: ["C", "ESP-IDF", "FreeRTOS", "CAN", "SPI", "I2C"],
    description: <>Real-time embedded telemetry system on {hi("ESP32")} using ESP-IDF to interface with vehicle OBD2 over {hi("CAN via SPI")}. Implemented CAN frame parsing to decode standard PIDs (RPM, coolant temp, etc.) and render live diagnostics to an {hi("I2C LED display")}. Developed concurrent firmware in C using {hi("FreeRTOS")} tasks for CAN polling and display updates.</>,
  },
  {
    id: "ml",
    title: "AI/ML Composite Sandwich Panels",
    startDate: "2025-01",
    endDate: null,
    github: "https://github.com/MMenser/CMEC_SandwichPanel",
    tech: ["Python", "PyTorch", "Neural Networks", "Variational Autoencoder"],
    description: <>Developed {hi("MLP and cVAE models")} to predict and synthesize mechanical properties of wood composite sandwich panels. Both architectures achieved {hi("R² > 0.95")}. Paper forthcoming in collaboration with faculty and graduate students.</>,
  },
  {
    id: "potato",
    title: "Embedded Potatoes",
    startDate: "2024-08",
    endDate: null,
    github: "https://github.com/MMenser/Smart-Farming",
    live: "https://potatoheatbox.live",
    tech: ["C++", "Python", "Flask", "Nginx", "PostgreSQL"],
    description: <>Designed a control system with {hi("Arduino")} and {hi("Raspberry Pi")} to study the effects of changing temperatures on potatoes in Eastern Washington. A companion web app lets users view and download sensor data and send commands to the control system via a Flask/PostgreSQL backend and React frontend. {hi("Deployed in the field.")}</>,
  },
  {
    id: "wiki",
    title: "MashWiki",
    startDate: "2024-06",
    endDate: null,
    live: "https://mashwiki.com",
    tech: ["React Native", "Node.js", "PostgreSQL", "Vector Embeddings"],
    description: <>Web and mobile application that recommends Wikipedia articles using {hi("view-history-based personalization")}, similar to YouTube's recommendation model. Uses vector embeddings for semantic similarity. iOS app forthcoming.</>,
  },
  {
    id: "p2p",
    title: "P2P File Sharing",
    startDate: "2025-10",
    endDate: "2025-12",
    github: "https://github.com/MMenser/PeerFileSharing",
    demo: "https://youtu.be/KLlXYoRJ2I8",
    tech: ["C/C++", "Linux", "Networking", "TLS/SSL"],
    description: <>CLI application for LAN chat and {hi("encrypted file sharing")}. A central server handles peer discovery, after which peers connect directly via Linux sockets with a TLS/SSL handshake.</>,
  },
  {
    id: "capstone",
    title: "Capstone Hop Selection App",
    startDate: "2025-01",
    endDate: "2025-12",
    demo: "https://youtu.be/GN8Ow6xQoPU",
    tech: ["React Native", "PostgreSQL", "Node.js", "Docker"],
    description: <>Enterprise {hi("iOS tablet application for Hopsteiner")} to digitize their hop selection process. Replaced an expensive third-party platform and streamlined workflows for hop breeders and selectors.</>,
  },
  {
    id: "spreadsheet",
    title: "Spreadsheet Application",
    startDate: "2024-10",
    endDate: "2024-11",
    github: "https://github.com/MMenser/CptS321",
    demo: "https://youtu.be/XTe2DUVhncY",
    tech: ["C#", "XML"],
    description: <>Fully-functioning spreadsheet application similar to Excel. Features {hi("formula evaluation, cell references, error-checking, undo/redo")}, customization, and XML save/load.</>,
  },
];

// Ongoing (endDate: null) → sorted first by startDate desc
// Completed → sorted by endDate desc, then startDate desc
const sortedProjects = [...projects].sort((a, b) => {
  const aEnd = a.endDate ?? "9999-12";
  const bEnd = b.endDate ?? "9999-12";
  if (aEnd !== bEnd) return bEnd.localeCompare(aEnd);
  return b.startDate.localeCompare(a.startDate);
});

const AppPro: React.FC = () => {
  return (
    <div className="bg-white min-h-screen text-neutral-900">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 py-10 sm:py-16">

        {/* ===== HEADER ===== */}
        <header className="flex items-start justify-between gap-4 mb-10 sm:mb-12">
          <div className="min-w-0">
            <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-neutral-900">
              Mason Menser
            </h1>
            <p className="text-neutral-500 mt-1.5 text-sm sm:text-base">
              CS Student · Software Engineer
            </p>
            <a
              href="/?playful"
              className="inline-block mt-2 text-[11px] text-neutral-400 hover:text-neutral-600 border border-neutral-200 hover:border-neutral-400 rounded-full px-2.5 py-0.5 transition-colors"
            >
              ✦ Fun version
            </a>
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
          <img
            src={headshot}
            alt="Mason Menser"
            className="rounded-full w-16 h-16 sm:w-20 sm:h-20 flex-shrink-0 object-cover"
          />
        </header>

        {/* ===== ABOUT ===== */}
        <section className="mb-8">
          <h2 className="text-[11px] font-bold uppercase tracking-widest text-blue-500 mb-3">
            About
          </h2>
          <p className="text-[15px] text-neutral-600 leading-relaxed">
            I'm a computer science student at Washington State University, graduating Spring 2026 with a B.S. in Computer Science, a Math Minor, and a History Minor. Born and raised in the Seattle area. I enjoy nature, soccer, rock climbing, reading, and spending time with friends.
          </p>
          <img
            src="https://ghchart.rshah.org/MMenser"
            alt="GitHub contribution graph"
            className="w-full mt-5 rounded"
          />
        </section>

        <hr className="border-neutral-100 my-7" />

        {/* ===== SKILLS ===== */}
        <section className="mb-8">
          <h2 className="text-[11px] font-bold uppercase tracking-widest text-blue-500 mb-3">
            Skills
          </h2>
          <div className="space-y-2 text-[15px] text-neutral-600">
            <div><span className="font-semibold text-neutral-900">Languages</span>{" — "}C/C++, Python, C#, TypeScript</div>
            <div><span className="font-semibold text-neutral-900">Frameworks</span>{" — "}React, React Native, Node.js, Express, Flask</div>
            <div><span className="font-semibold text-neutral-900">Technologies</span>{" — "}EC2, S3, Nginx, UART, I2C, SPI</div>
            <div><span className="font-semibold text-neutral-900">Databases</span>{" — "}PostgreSQL</div>
            <div><span className="font-semibold text-neutral-900">Certifications</span>{" — "}AWS Cloud Practitioner, Red Cross First Aid & CPR, 2025 USSF Referee</div>
          </div>
        </section>

        <hr className="border-neutral-100 my-7" />

        {/* ===== PROJECTS ===== */}
        <section className="mb-8">
          <h2 className="text-[11px] font-bold uppercase tracking-widest text-blue-500 mb-5">
            Projects
          </h2>
          <div className="space-y-8">
            {sortedProjects.map(project => (
              <div key={project.id}>
                <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
                  <h3 className="font-bold text-neutral-900">{project.title}</h3>
                  <div className="flex gap-3 text-sm">
                    {project.github && (
                      <a href={project.github} target="_blank" rel="noopener noreferrer"
                        className="text-blue-600 hover:text-blue-800 transition-colors">GitHub</a>
                    )}
                    {project.live && (
                      <a href={project.live} target="_blank" rel="noopener noreferrer"
                        className="text-blue-600 hover:text-blue-800 transition-colors">Live</a>
                    )}
                    {project.demo && (
                      <a href={project.demo} target="_blank" rel="noopener noreferrer"
                        className="text-blue-600 hover:text-blue-800 transition-colors">Demo</a>
                    )}
                  </div>
                </div>
                <p className="text-[12px] mt-0.5">
                  {project.endDate === null
                    ? <span className="text-green-600">Ongoing</span>
                    : <span className="text-neutral-400">{formatDateRange(project.startDate, project.endDate)}</span>
                  }
                </p>
                <div className="flex flex-wrap gap-1.5 mt-1.5">
                  {project.tech.map(t => (
                    <span key={t} className="bg-slate-100 text-slate-500 rounded px-1.5 py-0.5 text-[11px] font-mono">{t}</span>
                  ))}
                </div>
                <p className="text-[15px] text-neutral-600 mt-2 leading-relaxed">
                  {project.description}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* ===== FOOTER ===== */}
        <footer className="pt-8 border-t border-neutral-100 flex justify-between items-center">
          <span className="text-neutral-300 text-sm">Mason Menser</span>
          <a href="/?playful" className="text-neutral-300 hover:text-neutral-600 text-sm transition-colors">
            ← Playful version
          </a>
        </footer>

      </div>
    </div>
  );
};

export default AppPro;
