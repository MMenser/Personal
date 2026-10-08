import type { ReactNode } from "react";

export interface Project {
  id: string;
  title: string;
  startDate: string;   // "YYYY-MM"
  endDate: string | null; // null = ongoing
  github?: string;
  live?: string;
  demo?: string;
  tech: string[];
  description: ReactNode;
}

// Helper for bolded inline terms
export const hi = (text: string) => (
  <span className="font-semibold text-blue-700">{text}</span>
);

export const formatDateRange = (startDate: string, endDate: string | null): string => {
  if (!endDate) return "Ongoing";
  const months = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
  const [sy, sm] = startDate.split("-");
  const [ey, em] = endDate.split("-");
  const startMon = months[+sm - 1];
  const endMon   = months[+em - 1];
  return sy === ey
    ? `${startMon} - ${endMon} ${ey}`
    : `${startMon} ${sy} - ${endMon} ${ey}`;
};

// Add new projects here. Sorting is automatic:
//   - endDate: null -> Ongoing (sorts first, by startDate descending)
//   - endDate: "YYYY-MM" -> completed (sorts by end date descending)
const projects: Project[] = [
  {
    id: "obd2",
    title: "OBD2 Vehicle Telemetry Display",
    startDate: "2026-01",
    endDate: "2026-02",
    tech: ["C", "ESP-IDF", "FreeRTOS", "CAN", "SPI", "I2C"],
    description: <>Real-time embedded telemetry system on {hi("ESP32")} using ESP-IDF to interface with vehicle OBD2 over {hi("CAN via SPI")}. Implemented CAN frame parsing to decode standard PIDs (RPM, coolant temp, etc.) and render live diagnostics to an {hi("I2C LED display")}. Developed concurrent firmware in C using {hi("FreeRTOS")} tasks for CAN polling and display updates.</>,
  },
  {
    id: "ml",
    title: "AI/ML Composite Sandwich Panels",
    startDate: "2025-11",
    endDate: "2026-05",
    github: "https://github.com/MMenser/CMEC_SandwichPanel",
    tech: ["Python", "PyTorch", "Neural Networks", "Variational Autoencoder"],
    description: <>Developed {hi("MLP and cVAE models")} to predict and synthesize mechanical properties of wood composite sandwich panels. Both architectures achieved {hi("R^2 > 0.95")}. Paper forthcoming in collaboration with faculty and graduate students.</>,
  },
  {
    id: "potato",
    title: "Embedded Potatoes",
    startDate: "2024-08",
    endDate: "2026-05",
    github: "https://github.com/MMenser/Smart-Farming",
    live: "https://potatoheatbox.live",
    tech: ["C++", "Python", "Flask", "Nginx", "PostgreSQL"],
    description: <>Designed a control system with {hi("Arduino")} and {hi("Raspberry Pi")} to study the effects of changing temperatures on potatoes in Eastern Washington. A companion web app lets users view and download sensor data and send commands to the control system via a Flask/PostgreSQL backend and React frontend. {hi("Deployed in the field.")}</>,
  },
  {
    id: "wiki",
    title: "MashWiki",
    startDate: "2025-06",
    endDate: "2026-04",
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

// Ongoing (endDate: null) -> sorted first by startDate desc
// Completed -> sorted by endDate desc, then startDate desc
export const sortedProjects = [...projects].sort((a, b) => {
  const aEnd = a.endDate ?? "9999-12";
  const bEnd = b.endDate ?? "9999-12";
  if (aEnd !== bEnd) return bEnd.localeCompare(aEnd);
  return b.startDate.localeCompare(a.startDate);
});
