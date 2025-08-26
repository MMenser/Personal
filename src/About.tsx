// About.tsx
import React from 'react';

interface AboutProps {
  displayedText: string;
  isTyping: boolean;
  onClose: () => void;
}

const About: React.FC<AboutProps> = ({ displayedText, isTyping, onClose }) => {
  return (
    <div
      className="bg-black/40 backdrop-blur-lg border border-white/20 rounded-2xl p-8 shadow-2xl animate-in fade-in duration-300"
      role="tabpanel"
      id="about-content"
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
        <h2 className="text-3xl font-bold mb-6 text-cyan-300">
          About
        </h2>

        <div className="text-lg leading-relaxed text-gray-100 whitespace-pre-line">
          {displayedText}
          {isTyping && (
            <span className="inline-block w-0.5 h-5 bg-white ml-1 animate-pulse"></span>
          )}
        </div>

        {/* Decorative gradient line */}
        <div className="w-24 h-1 mt-6 rounded-full bg-gradient-to-r from-cyan-400 to-blue-500"></div>
      </div>
    </div>
  );
};

export default About;