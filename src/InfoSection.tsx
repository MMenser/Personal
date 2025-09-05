// InfoSection.tsx
import React, { useState } from "react";
import type { SectionKey } from "./types";
import About from "./About";
import Skills from "./Skills";
import Projects from "./Projects";

const InfoSection: React.FC = () => {
  const [selectedSection, setSelectedSection] = useState<SectionKey | null>(null);

  const handleSectionClick = (section: SectionKey): void => {
    if (selectedSection === section) {
      setSelectedSection(null);
    } else {
      setSelectedSection(section);
    }
  };

  const getSectionColorClasses = (section: SectionKey) => {
    const colorMap = {
      about: {
        text: "text-cyan-300",
        hover: "hover:text-cyan-200",
        gradient: "from-blue-600/30 to-purple-600/30",
        underline: "from-cyan-400 to-blue-500",
      },
      skills: {
        text: "text-green-300",
        hover: "hover:text-green-200",
        gradient: "from-green-600/30 to-emerald-600/30",
        underline: "from-green-400 to-emerald-500",
      },
      projects: {
        text: "text-pink-300",
        hover: "hover:text-pink-200",
        gradient: "from-pink-600/30 to-purple-600/30",
        underline: "from-pink-400 to-purple-500",
      },
    };
    return colorMap[section];
  };

  const renderSectionButton = (section: SectionKey, label: string) => {
    const colors = getSectionColorClasses(section);
    const isSelected = selectedSection === section;

    return (
      <button
        onClick={() => handleSectionClick(section)}
        className={`relative px-8 py-4 text-2xl font-bold transition-all duration-300 transform hover:scale-105 ${
          isSelected ? `${colors.text} scale-105` : `text-white ${colors.hover}`
        }`}
        aria-expanded={isSelected}
        aria-controls={`${section}-content`}
      >
        <span className="relative z-10">{label}</span>
        {/* Glowing background effect */}
        <div
          className={`absolute inset-0 bg-gradient-to-r ${
            colors.gradient
          } rounded-lg backdrop-blur-sm transition-opacity duration-300 ${
            isSelected ? "opacity-100" : "opacity-0 hover:opacity-70"
          }`}
        ></div>
        {/* Animated underline */}
        <div
          className={`absolute bottom-0 left-0 h-1 bg-gradient-to-r ${
            colors.underline
          } transition-all duration-300 ${
            isSelected ? "w-full" : "w-0 hover:w-full"
          }`}
        ></div>
      </button>
    );
  };

  const renderContent = () => {
    switch (selectedSection) {
      case "about":
        return <About onClose={() => setSelectedSection(null)} />;
      case "skills":
        return <Skills onClose={() => setSelectedSection(null)} />;
      case "projects":
        return <Projects onClose={() => setSelectedSection(null)} />;
      default:
        return <div></div>;
    }
  };

  return (
    <div className="relative z-10 flex flex-col items-center justify-center h-full text-white">
      {/* Navigation Buttons */}
      <div className="flex flex-row space-x-10 mb-8" role="tablist">
        {renderSectionButton("about", "About Me")}
        {renderSectionButton("skills", "Skills")}
        {renderSectionButton("projects", "Projects")}
      </div>

      {/* Info Display Box - Always present to maintain layout */}
      <div className="w-full h-full">
        <div className="h-full">{renderContent()}</div>
      </div>
    </div>
  );
};

export default InfoSection;