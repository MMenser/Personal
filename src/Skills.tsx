// Skills.tsx
import React from 'react';

interface SkillsProps {
  onClose: () => void;
}

const Skills: React.FC<SkillsProps> = ({ onClose }) => {
  const skillsContent = "• Languages: C/C++, Python, C#, TypeScript\n• Frameworks: React, React Native, Node.js, Express, Flask\n• Technologies: EC2, S3, Nginx, UART, I2C, SPI\n• Databases: PostgreSQL\n• Certifications: AWS Cloud Practitioner, Red Cross First Aid & CPR, 2025 USSF Referee";

  // Function to format text with bold categories
  const formatSkillsText = (text: string) => {
    const lines = text.split('\n');
    return lines.map((line, index) => {
      const colonIndex = line.indexOf(':');
      if (colonIndex !== -1) {
        const category = line.substring(0, colonIndex + 1); // Include the colon
        const skills = line.substring(colonIndex + 1);
        return (
          <div key={index} className="mb-1">
            <span className="font-bold">{category}</span>
            <span>{skills}</span>
          </div>
        );
      }
      return <div key={index} className="mb-1">{line}</div>;
    });
  };

  return (
    <div
      className="bg-black/40 backdrop-blur-lg border border-white/20 rounded-2xl p-8 shadow-2xl animate-in no-fade duration-300"
      role="tabpanel"
      id="skills-content"
    >
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
     
      {/* Content */}
      <div className="pr-8">
        <h2 className="text-3xl font-bold mb-6 text-green-300">
          Skills
        </h2>
        <div className="text-lg leading-relaxed text-gray-100">
          {formatSkillsText(skillsContent)}
        </div>
        {/* Decorative gradient line */}
        <div className="w-full h-1 mt-6 rounded-full bg-gradient-to-r from-green-400 to-emerald-500"></div>
      </div>
    </div>
  );
};

export default Skills;