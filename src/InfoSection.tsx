// InfoSection.tsx
import React, { useState, useEffect } from 'react';
import type { SectionKey, SectionData, ProjectData, SectionDataMap } from './types';
import About from './About';
import Skills from './Skills';
import Projects from './Projects';

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
    } else if (selectedSection && selectedSection !== 'projects') {
      const fullText = sectionData[selectedSection].content;
      setDisplayedText('');
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

  const handleBackToProjects = (): void => {
    setSelectedProject(null);
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

  const renderContent = () => {
    switch (selectedSection) {
      case 'about':
        return (
          <About
            displayedText={displayedText}
            isTyping={isTyping}
            onClose={() => setSelectedSection(null)}
          />
        );
      case 'skills':
        return (
          <Skills
            displayedText={displayedText}
            isTyping={isTyping}
            onClose={() => setSelectedSection(null)}
          />
        );
      case 'projects':
        return (
          <Projects
            selectedProject={selectedProject}
            displayedText={displayedText}
            isTyping={isTyping}
            onClose={() => setSelectedSection(null)}
            onProjectClick={handleProjectClick}
            onBackToProjects={handleBackToProjects}
            projectsData={projectsData}
          />
        );
      default:
        return (
          <div className="flex items-center justify-center h-80">
            <div className="text-center text-gray-300 text-lg animate-pulse">
              Click on any section above to learn more
            </div>
          </div>
        );
    }
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
        {renderContent()}
      </div>
    </div>
  );
};

export default InfoSection;