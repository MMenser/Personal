import React, { useState, useEffect } from 'react';

// Define types for better type safety
type SectionKey = 'about' | 'skills' | 'projects';

interface SectionData {
  title: string;
  content: string;
}

interface ProjectData {
  id: string;
  title: string;
  github: string | null;
  youtube: string | null;
  description: string;
  tech: string;
  details: string;
  color: {
    bg: string;
    text: string;
    hover: string;
    gradient: string;
  };
}

type SectionDataMap = Record<SectionKey, SectionData>;

const InfoSection: React.FC = () => {
  const [selectedSection, setSelectedSection] = useState<SectionKey | null>(null);
  const [selectedProject, setSelectedProject] = useState<string | null>(null);
  const [displayedText, setDisplayedText] = useState<string>('');
  const [isTyping, setIsTyping] = useState<boolean>(false);

  const sectionData: SectionDataMap = {
    about: {
      title: "About",
      content: `I'm a computer science student at Washington State University. I'm in my senior year and hope to graduate in the Spring of 2026 with a B.S in Computer Science, Math Minor and History Minor.`
    },
    skills: {
      title: "Skills",
      content: "• Languages: C/C++, Python, C#, TypeScript, \n• Frameworks: React, React Native, Node.js, Express, Flask\n• Technologies: UART, I2C, SPI\n• Databases: PostgreSQL\n• Other: AWS EC2, AWS Cloud Practioner"
    },
    projects: {
      title: "Projects",
      content: "" // Not used for projects anymore
    }
  };

  const projectsData: ProjectData[] = [
    {
      id: 'spreadsheet',
      title: 'C# Spreadsheet',
      github: 'https://github.com/MMenser/CptS321',
      youtube: 'https://youtu.be/XTe2DUVhncY',
      description: 'Excel-like spreadsheet application.',
      tech: 'C# • XML • StyleCop',
      details: 'A fully-functioning spreadsheet application, similar to Excel. Featuring formulas, expression evaluation, references, error-checking, undo/redo, customization, multiple variable support, saving and loading to XML, and more!',
      color: {
        bg: 'bg-gradient-to-br from-blue-500/20 to-purple-600/20',
        text: 'text-blue-300',
        hover: 'hover:from-blue-500/30 hover:to-purple-600/30',
        gradient: 'from-blue-400 to-purple-500'
      }
    },
    {
      id: 'dashboard',
      title: '🎮 Interactive Dashboard',
      github: null,
      youtube: null,
      description: 'Full-stack web application',
      tech: 'React • Node.js • Express • PostgreSQL',
      details: 'A comprehensive dashboard application built with modern web technologies. Features real-time data visualization, user authentication, responsive design, and seamless API integration for dynamic content management.',
      color: {
        bg: 'bg-gradient-to-br from-emerald-500/20 to-teal-600/20',
        text: 'text-emerald-300',
        hover: 'hover:from-emerald-500/30 hover:to-teal-600/30',
        gradient: 'from-emerald-400 to-teal-500'
      }
    },
    {
      id: 'portfolio',
      title: '📱 Mobile Portfolio',
      github: null,
      youtube: null,
      description: 'Responsive design showcase',
      tech: 'React • Tailwind CSS • Framer Motion',
      details: 'A mobile-first portfolio website showcasing modern design principles. Built with responsive layouts, smooth animations, and optimized performance across all device sizes with accessibility features.',
      color: {
        bg: 'bg-gradient-to-br from-pink-500/20 to-rose-600/20',
        text: 'text-pink-300',
        hover: 'hover:from-pink-500/30 hover:to-rose-600/30',
        gradient: 'from-pink-400 to-rose-500'
      }
    },
    {
      id: 'embedded',
      title: '⚡ IoT Controller',
      github: null,
      youtube: null,
      description: 'Embedded systems project',
      tech: 'C/C++ • UART • I2C • SPI',
      details: 'An embedded systems project featuring microcontroller programming and sensor integration. Implements communication protocols for IoT device control with real-time data processing and wireless connectivity.',
      color: {
        bg: 'bg-gradient-to-br from-orange-500/20 to-red-600/20',
        text: 'text-orange-300',
        hover: 'hover:from-orange-500/30 hover:to-red-600/30',
        gradient: 'from-orange-400 to-red-500'
      }
    }
  ];

  // Typewriter effect
  useEffect(() => {
    if (selectedSection === 'projects' && selectedProject) {
      const project = projectsData.find(p => p.id === selectedProject);
      if (!project) return;

      const fullText = project.details;
      setDisplayedText('');
      setIsTyping(true);

      let currentIndex = 0;
      const typingSpeed = 20;

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
    } else if (selectedSection && selectedSection !== 'projects') {
      const fullText = sectionData[selectedSection].content;
      setDisplayedText('');
      setIsTyping(true);

      let currentIndex = 0;
      const typingSpeed = 20;

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
      setDisplayedText('');
      setIsTyping(false);
    }
  }, [selectedSection, selectedProject]);

  const handleSectionClick = (section: SectionKey): void => {
    if (selectedSection === section) {
      setSelectedSection(null);
      setSelectedProject(null);
    } else {
      setSelectedSection(section);
      if (section !== 'projects') {
        setSelectedProject(null);
      }
    }
  };

  const handleProjectClick = (projectId: string): void => {
    setSelectedProject(selectedProject === projectId ? null : projectId);
  };

  const getSectionColorClasses = (section: SectionKey) => {
    const colorMap = {
      about: {
        text: 'text-cyan-300',
        hover: 'hover:text-cyan-200',
        gradient: 'from-blue-600/30 to-purple-600/30',
        underline: 'from-cyan-400 to-blue-500'
      },
      skills: {
        text: 'text-green-300',
        hover: 'hover:text-green-200',
        gradient: 'from-green-600/30 to-emerald-600/30',
        underline: 'from-green-400 to-emerald-500'
      },
      projects: {
        text: 'text-pink-300',
        hover: 'hover:text-pink-200',
        gradient: 'from-pink-600/30 to-purple-600/30',
        underline: 'from-pink-400 to-purple-500'
      }
    };
    return colorMap[section];
  };

  const renderSectionButton = (section: SectionKey, label: string) => {
    const colors = getSectionColorClasses(section);
    const isSelected = selectedSection === section;

    return (
      <button
        onClick={() => handleSectionClick(section)}
        className={`relative px-8 py-4 text-2xl font-bold transition-all duration-300 transform hover:scale-105 ${isSelected
          ? `${colors.text} scale-105`
          : `text-white ${colors.hover}`
          }`}
        aria-expanded={isSelected}
        aria-controls={`${section}-content`}
      >
        <span className="relative z-10">{label}</span>
        {/* Glowing background effect */}
        <div className={`absolute inset-0 bg-gradient-to-r ${colors.gradient} rounded-lg backdrop-blur-sm transition-opacity duration-300 ${isSelected ? 'opacity-100' : 'opacity-0 hover:opacity-70'
          }`}></div>
        {/* Animated underline */}
        <div className={`absolute bottom-0 left-0 h-1 bg-gradient-to-r ${colors.underline} transition-all duration-300 ${isSelected ? 'w-full' : 'w-0 hover:w-full'
          }`}></div>
      </button>
    );
  };

  const getContentColorClass = (section: SectionKey): string => {
    const colorMap = {
      about: 'text-cyan-300',
      skills: 'text-green-300',
      projects: 'text-pink-300'
    };
    return colorMap[section];
  };

  const getGradientClass = (section: SectionKey): string => {
    const gradientMap = {
      about: 'bg-gradient-to-r from-cyan-400 to-blue-500',
      skills: 'bg-gradient-to-r from-green-400 to-emerald-500',
      projects: 'bg-gradient-to-r from-pink-400 to-purple-500'
    };
    return gradientMap[section];
  };

  const renderProjectBoxes = () => {
    return (
      <div className="grid grid-cols-2 gap-4 w-full">
        {projectsData.map((project) => (
          <button
            key={project.id}
            onClick={() => handleProjectClick(project.id)}
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
          onClick={() => setSelectedProject(null)}
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

  return (
    <div className="relative z-10 flex flex-col items-center justify-center h-3/5 text-white">
      {/* Navigation Buttons */}
      <div className="flex flex-row gap-8 mb-8" role="tablist">
        {renderSectionButton('about', 'About Me')}
        {renderSectionButton('skills', 'Skills')}
        {renderSectionButton('projects', 'Projects')}
      </div>

      {/* Info Display Box - Always present to maintain layout */}
      <div className="w-full max-w-4xl mx-auto px-6 min-h-80">
        {selectedSection === 'projects' && selectedProject ? (
          renderExpandedProject()
        ) : selectedSection === 'projects' ? (
          <div className="bg-black/40 backdrop-blur-lg border border-white/20 rounded-2xl p-8 shadow-2xl animate-in fade-in duration-300">
            {/* Close button */}
            <button
              onClick={() => setSelectedSection(null)}
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
              <p className="text-gray-300 mb-6">Click on any project below to learn more:</p>
              {renderProjectBoxes()}
            </div>
          </div>
        ) : selectedSection ? (
          <div
            className="bg-black/40 backdrop-blur-lg border border-white/20 rounded-2xl p-8 shadow-2xl animate-in fade-in duration-300"
            role="tabpanel"
            id={`${selectedSection}-content`}
          >
            {/* Close button */}
            <button
              onClick={() => setSelectedSection(null)}
              className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors duration-200"
              aria-label="Close section"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            {/* Content */}
            <div className="pr-8">
              <h2 className={`text-3xl font-bold mb-6 ${getContentColorClass(selectedSection)}`}>
                {sectionData[selectedSection].title}
              </h2>

              <div className="text-lg leading-relaxed text-gray-100 whitespace-pre-line">
                {displayedText}
                {isTyping && (
                  <span className="inline-block w-0.5 h-5 bg-white ml-1 animate-pulse"></span>
                )}
              </div>

              {/* Decorative gradient line */}
              <div className={`w-24 h-1 mt-6 rounded-full ${getGradientClass(selectedSection)}`}></div>
            </div>
          </div>
        ) : (
          <div className="flex items-center justify-center h-80">
            <div className="text-center text-gray-300 text-lg animate-pulse">
              Click on any section above to learn more
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default InfoSection;