import React, { useState, useEffect } from 'react';

// Define types for better type safety
type SectionKey = 'about' | 'skills' | 'projects';

interface SectionData {
  title: string;
  content: string;
}

type SectionDataMap = Record<SectionKey, SectionData>;

const InfoSection: React.FC = () => {
  const [selectedSection, setSelectedSection] = useState<SectionKey | null>(null);
  const [displayedText, setDisplayedText] = useState<string>('');
  const [isTyping, setIsTyping] = useState<boolean>(false);

  const sectionData: SectionDataMap = {
    about: {
      title: "About Me",
      content: `I'm a computer science student at Washington State University. I'm in my senior year and hope to graduate in the Spring of 2026 with a B.S in Computer Science, Math Minor and History Minor.`
    },
    skills: {
      title: "Skills",
      content: "• Languages: C/C++, Python, C#, TypeScript, \n• Frameworks: React, React Native, Node.js, Express, Flask\n• Technologies: UART, I2C, SPI\n• Databases: PostgreSQL\n• Other: AWS EC2, AWS Cloud Practioner"
    },
    projects: {
      title: "Projects",
      content: "🌄 Mountain Background Generator - A React component that creates randomly generated mountain landscapes with starry skies\n\n🎮 Interactive Dashboard - A full-stack web application built with React and Node.js\n\n📱 Mobile-First Portfolio - A responsive portfolio website showcasing modern design principles"
    }
  };

  // Typewriter effect
  useEffect(() => {
    if (!selectedSection) {
      setDisplayedText('');
      setIsTyping(false);
      return;
    }

    const fullText = sectionData[selectedSection].content;
    setDisplayedText('');
    setIsTyping(true);
    
    let currentIndex = 0;
    const typingSpeed = 20; // milliseconds between each character

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
  }, [selectedSection]);

  const handleSectionClick = (section: SectionKey): void => {
    setSelectedSection(selectedSection === section ? null : section);
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
        className={`relative px-8 py-4 text-4xl font-bold transition-all duration-300 transform hover:scale-105 ${
          isSelected 
            ? `${colors.text} scale-105` 
            : `text-white ${colors.hover}`
        }`}
        aria-expanded={isSelected}
        aria-controls={`${section}-content`}
      >
        <span className="relative z-10">{label}</span>
        {/* Glowing background effect */}
        <div className={`absolute inset-0 bg-gradient-to-r ${colors.gradient} rounded-lg backdrop-blur-sm transition-opacity duration-300 ${
          isSelected ? 'opacity-100' : 'opacity-0 hover:opacity-70'
        }`}></div>
        {/* Animated underline */}
        <div className={`absolute bottom-0 left-0 h-1 bg-gradient-to-r ${colors.underline} transition-all duration-300 ${
          isSelected ? 'w-full' : 'w-0 hover:w-full'
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

  return (
    <div className="relative z-10 flex flex-col items-center justify-center h-full text-white">
      {/* Navigation Buttons */}
      <div className="flex flex-row gap-8 mb-8" role="tablist">
        {renderSectionButton('about', 'About Me')}
        {renderSectionButton('skills', 'Skills')}
        {renderSectionButton('projects', 'Projects')}
      </div>

      {/* Info Display Box - Always present to maintain layout */}
      <div className="w-full max-w-4xl mx-auto px-6 min-h-80">
        {selectedSection ? (
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