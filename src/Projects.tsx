// Projects.tsx
import React from 'react';
import type { ProjectData } from './types';

interface ProjectsProps {
  selectedProject: string | null;
  displayedText: string;
  isTyping: boolean;
  onClose: () => void;
  onProjectClick: (projectId: string) => void;
  onBackToProjects: () => void;
  projectsData: ProjectData[];
}

const Projects: React.FC<ProjectsProps> = ({
  selectedProject,
  displayedText,
  isTyping,
  onClose,
  onProjectClick,
  onBackToProjects,
  projectsData
}) => {
  const renderProjectBoxes = () => {
    return (
      <div className="grid grid-cols-2 gap-4 w-full">
        {projectsData.map((project) => (
          <button
            key={project.id}
            onClick={() => onProjectClick(project.id)}
            className={`${project.color.bg} ${project.color.hover} backdrop-blur-lg border border-white/20 rounded-xl p-6 text-left transition-all duration-300 transform hover:scale-105 hover:shadow-lg`}
          >
            <div className={`text-2xl font-bold mb-2 ${project.color.text}`}>
              {project.title}
            </div>
            <div className="text-gray-300 text-sm mb-3">
              {project.description}
            </div>
            <div className="text-gray-400 text-xs font-mono">
              {project.tech}
            </div>
          </button>
        ))}
      </div>
    );
  };

  const renderExpandedProject = () => {
    const project = projectsData.find(p => p.id === selectedProject);
    if (!project) return null;

    return (
      <div className="bg-black/40 backdrop-blur-lg border border-white/20 rounded-2xl p-8 shadow-2xl animate-in fade-in duration-300">
        {/* Back button */}
        <button
          onClick={onBackToProjects}
          className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors duration-200 mb-6"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Back to Projects
        </button>

        <div className={`flex justify-between items-center text-3xl font-bold mb-4 ${project.color.text}`}>
          {project.title}
          {project.github ? <a
            href={project.github}
            target="_blank"
            rel="noopener noreferrer"
            className="underline hover:text-cyan-200 ml-2"
          >
            GitHub
          </a> : <div></div>}
          {project.youtube ? <a
            href={project.youtube}
            target="_blank"
            rel="noopener noreferrer"
            className="underline hover:text-cyan-200 ml-2"
          >
            Demo
          </a> : <div></div>}
        </div>

        <div className="text-gray-400 text-sm font-mono mb-6">
          {project.tech}
        </div>

        <div className="text-lg leading-relaxed text-gray-100">
          {displayedText}
          {isTyping && (
            <span className="inline-block w-0.5 h-5 bg-white ml-1 animate-pulse"></span>
          )}
        </div>

        {/* Decorative gradient line */}
        <div className={`w-24 h-1 mt-6 rounded-full bg-gradient-to-r ${project.color.gradient}`}></div>
      </div>
    );
  };

  if (selectedProject) {
    return renderExpandedProject();
  }

  return (
    <div className="bg-black/40 backdrop-blur-lg border border-white/20 rounded-2xl p-8 shadow-2xl animate-in fade-in duration-300">
      {/* Close button */}
      <button
        onClick={onClose}
        className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors duration-200"
        aria-label="Close section"
      >
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>

      <div className="pr-8">
        <h2 className="text-3xl font-bold mb-6 text-pink-300">
          My Projects
        </h2>
        {renderProjectBoxes()}
      </div>
    </div>
  );
};

export default Projects;