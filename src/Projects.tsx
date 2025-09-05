// Projects.tsx
import React, { useState, useEffect } from "react";
import type { ProjectData } from "./types";

interface ProjectsProps {
  onClose: () => void;
}

const Projects: React.FC<ProjectsProps> = ({ onClose }) => {
  const [selectedProject, setSelectedProject] = useState<string | null>(null);
  const [displayedText, setDisplayedText] = useState<string>("");
  const [isTyping, setIsTyping] = useState<boolean>(false);

  const projectsData: ProjectData[] = [
    {
      id: "potato",
      title: "Research Project",
      github: "https://github.com/MMenser/Smart-Farming",
      github2: "https://github.com/MMenser/Potato-React",
      youtube: null,
      description: "Control Systems & Full-Stack Web App",
      tech: "C++ • Python • Flask • Nginx • PostgreSQL",
      details: `This project has two dimensions. One is the control systems. I designed a control system with Ardunio, Raspberry Pi, temperature sensors, and stepper motors to dynamically control the temperature of an enclosure to study the effects of changing temperatures on potatos in Eastern Washington. 
      Second is the web application. The control system sends data via LoRa modules to the Pi. The Pi sends the data to Postgres and a Flask backend. Users can download data and send commands back to the control systems from the frontend React app
      Deployed in the field. Learnt so much about real-world development, constraints, and difference between test & prod environments in Link systems. Version 2 coming this year!`,
      color: {
        bg: "bg-gradient-to-br from-emerald-500/20 to-teal-600/20",
        text: "text-emerald-300",
        hover: "hover:from-emerald-500/30 hover:to-teal-600/30",
        gradient: "from-emerald-400 to-teal-500",
      },
    },
    {
      id: "wiki",
      title: "WikiTube",
      github: null,
      github2: null,
      youtube: null,
      description: "Wikipedia Article Recommender",
      tech: "React Native • NodeJS • PostgreSQL • Vector Embeddings",
      details:
        "An iOS application that recommends Wikipedia articles to users. Functions similar to YouTube, where user's view history affects what articles are recommended. Popular articles are also served. Currently in progress. Porting database from local to EC2 is causing some issues.",
      color: {
        bg: "bg-gradient-to-br from-pink-500/20 to-rose-600/20",
        text: "text-pink-300",
        hover: "hover:from-pink-500/30 hover:to-rose-600/30",
        gradient: "from-pink-400 to-rose-500",
      },
    },
    {
      id: "spreadsheet",
      title: "C# Spreadsheet",
      github: "https://github.com/MMenser/CptS321",
      github2: null,
      youtube: "https://youtu.be/XTe2DUVhncY",
      description: "Excel-like spreadsheet application.",
      tech: "C# • XML",
      details:
        "A fully-functioning spreadsheet application, similar to Excel. Featuring formulas, expression evaluation, references, error-checking, undo/redo, customization, multiple variable support, saving and loading to XML, and more!",
      color: {
        bg: "bg-gradient-to-br from-blue-500/20 to-purple-600/20",
        text: "text-blue-300",
        hover: "hover:from-blue-500/30 hover:to-purple-600/30",
        gradient: "from-blue-400 to-purple-500",
      },
    },
    {
      id: "link",
      title: "Link",
      github: null,
      github2: null,
      youtube: null,
      description: "Social media website for WSU students.",
      tech: "React Native • PostgreSQL • NodeJS • Firebase Auth",
      details:
        "",
      color: {
        bg: "bg-gradient-to-br from-orange-500/20 to-red-600/20",
        text: "text-orange-300",
        hover: "hover:from-orange-500/30 hover:to-red-600/30",
        gradient: "from-orange-400 to-red-500",
      },
    },
  ];

  // Typewriter effect for project details
  useEffect(() => {
    if (selectedProject) {
      const project = projectsData.find((p) => p.id === selectedProject);
      if (!project) return;

      const fullText = project.details;
      setDisplayedText("");
      setIsTyping(true);

      let currentIndex = 0;
      const typingSpeed = 15;

      const typeInterval = setInterval(() => {
        if (currentIndex < fullText.length) {
          setDisplayedText(fullText.slice(0, currentIndex + 1));
          currentIndex++;
        } else {
          setIsTyping(false);
          clearInterval(typeInterval);
        }
      }, typingSpeed);

      return () => clearInterval(typeInterval);
    } else {
      setDisplayedText("");
      setIsTyping(false);
    }
  }, [selectedProject]);

  const handleProjectClick = (projectId: string): void => {
    setSelectedProject(selectedProject === projectId ? null : projectId);
  };

  const handleBackToProjects = (): void => {
    setSelectedProject(null);
  };

  const renderProjectBoxes = () => {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 w-full">
        {projectsData.map((project) => (
          <button
            key={project.id}
            onClick={() => handleProjectClick(project.id)}
            className={`${project.color.bg} ${project.color.hover} backdrop-blur-lg border border-white/20 rounded-xl p-4 sm:p-6 text-left transition-all duration-300 transform hover:scale-105 hover:shadow-lg min-h-0`}
          >
            <div className={`text-lg sm:text-xl md:text-2xl font-bold mb-2 ${project.color.text} leading-tight`}>
              {project.title}
            </div>
            <div className="text-gray-300 text-xs sm:text-sm mb-2 sm:mb-3 leading-tight">
              {project.description}
            </div>
            <div className="text-gray-400 text-xs font-mono leading-tight break-words">
              {project.tech}
            </div>
          </button>
        ))}
      </div>
    );
  };

  const renderExpandedProject = () => {
    const project = projectsData.find((p) => p.id === selectedProject);
    if (!project) return null;

    return (
      <div className="bg-black/40 backdrop-blur-lg border border-white/20 rounded-2xl p-4 sm:p-6 md:p-8 shadow-2xl animate-in duration-300 overflow-hidden">
        {/* Back button */}
        <button
          onClick={handleBackToProjects}
          className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors duration-200 mb-4 sm:mb-6"
        >
          <svg
            className="w-4 h-4 sm:w-5 sm:h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 19l-7-7 7-7"
            />
          </svg>
          <span className="text-sm sm:text-base">Back to Projects</span>
        </button>

        {/* Title and Links */}
        <div className="mb-4">
          <div className={`text-xl sm:text-2xl md:text-3xl font-bold mb-3 sm:mb-4 ${project.color.text} leading-tight break-words`}>
            {project.title}
          </div>
          
          {/* Links - Stack on mobile, inline on larger screens */}
          <div className="flex flex-col sm:flex-row gap-2 sm:gap-4">
            {project.github && (
              <a
                href={project.github}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm sm:text-base md:text-lg underline hover:text-cyan-200 break-words"
              >
                GitHub
              </a>
            )}
            {project.github2 && (
              <a
                href={project.github2}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm sm:text-base md:text-lg underline hover:text-cyan-200 break-words"
              >
                Web App
              </a>
            )}
            {project.youtube && (
              <a
                href={project.youtube}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm sm:text-base md:text-lg underline hover:text-cyan-200 break-words"
              >
                Demo
              </a>
            )}
          </div>
        </div>

        <div className="text-gray-400 text-xs sm:text-sm font-mono mb-4 sm:mb-6 break-words">
          {project.tech}
        </div>

        <div className="text-sm sm:text-base md:text-lg leading-relaxed text-gray-100 break-words">
          {displayedText}
          {isTyping && (
            <span className="inline-block w-0.5 h-4 sm:h-5 bg-white ml-1 animate-pulse"></span>
          )}
        </div>

        {/* Decorative gradient line */}
        <div
          className={`w-full h-1 mt-4 sm:mt-6 rounded-full bg-gradient-to-r ${project.color.gradient}`}
        ></div>
      </div>
    );
  };

  if (selectedProject) {
    return renderExpandedProject();
  }

  return (
    <div className="bg-black/40 backdrop-blur-lg border border-white/20 rounded-2xl p-4 sm:p-6 md:p-8 shadow-2xl animate-in no-fade duration-300 overflow-hidden">
      {/* Close button */}
      <button
        onClick={onClose}
        className="absolute top-3 right-3 sm:top-4 sm:right-4 text-gray-400 hover:text-white transition-colors duration-200"
        aria-label="Close section"
      >
        <svg
          className="w-5 h-5 sm:w-6 sm:h-6"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M6 18L18 6M6 6l12 12"
          />
        </svg>
      </button>

      <div className="pr-6 sm:pr-8">
        <h2 className="text-xl sm:text-2xl md:text-3xl font-bold mb-4 sm:mb-6 text-pink-300 leading-tight">My Projects</h2>
        {renderProjectBoxes()}
      </div>
    </div>
  );
};

export default Projects;
