// About.tsx
import React, { useState, useEffect } from 'react';
import { Instagram, Linkedin, Github, ExternalLink } from 'lucide-react';

interface AboutProps {
  onClose: () => void;
}

const About: React.FC<AboutProps> = ({ onClose }) => {
  const [displayedText, setDisplayedText] = useState<string>('');
  const [isTyping, setIsTyping] = useState<boolean>(false);

  const aboutContent = `I'm a computer science student at Washington State University. I'm in my senior year and hope to graduate in the Spring of 2026 with a B.S in Computer Science, Math Minor and History Minor.
  I was born and raised in the Seattle area and I love enjoying nature, playing soccer, rock climbing, reading, and spending time with friends.
  A couple of my future goals include finishing the LOTR books (working through Return of the King), getting my motorcycle license, form a revenue-generating LLC, and benching 225lbs (210lbs PR). `;

  // Social media links
  const socialLinks = [
    {
      name: "GitHub",
      url: "https://github.com/MMenser", 
      icon: Github,
      color: "text-gray-300 hover:text-white",
      bgHover: "hover:bg-gray-700/50"
    },
    {
      name: "LinkedIn",
      url: "https://www.linkedin.com/in/mason-menser-64467324a/",
      icon: Linkedin,
      color: "text-blue-400 hover:text-blue-300",
      bgHover: "hover:bg-blue-600/20"
    },
    {
      name: "Instagram",
      url: "https://www.instagram.com/mason.menser/", 
      icon: Instagram,
      color: "text-pink-400 hover:text-pink-300",
      bgHover: "hover:bg-pink-600/20"
    }
  ];

  // Typewriter effect
  useEffect(() => {
    setDisplayedText('');
    setIsTyping(true);

    let currentIndex = 0;
    const typingSpeed = 15;

    const typeInterval = setInterval(() => {
      if (currentIndex < aboutContent.length) {
        setDisplayedText(aboutContent.slice(0, currentIndex + 1));
        currentIndex++;
      } else {
        setIsTyping(false);
        clearInterval(typeInterval);
      }
    }, typingSpeed);

    return () => clearInterval(typeInterval);
  }, []); // Empty dependency array since content is static

  const renderSocialLinks = () => {
    return (
      <div className="mt-8">
        <div className="flex space-x-4 items-center justify-center">
          {socialLinks.map((social) => {
            const IconComponent = social.icon;
            return (
              <a
                key={social.name}
                href={social.url}
                target="_blank"
                rel="noopener noreferrer"
                className={`group relative p-3 rounded-full transition-all duration-300 transform hover:scale-110 ${social.color} ${social.bgHover} border border-white/10 hover:border-white/30`}
                aria-label={`Visit my ${social.name} profile`}
              >
                <IconComponent size={20} />
                {/* Tooltip */}
                <div className="absolute -top-12 left-1/2 transform -translate-x-1/2 px-2 py-1 bg-gray-800 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap">
                  {social.name}
                  <div className="absolute top-full left-1/2 transform -translate-x-1/2 border-4 border-transparent border-t-gray-800"></div>
                </div>
                {/* External link indicator */}
                <ExternalLink 
                  size={10} 
                  className="absolute -top-1 -right-1 opacity-0 group-hover:opacity-70 transition-opacity duration-200" 
                />
              </a>
            );
          })}
        </div>
      </div>
    );
  };

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
        <div className="w-full h-1 mt-6 rounded-full bg-gradient-to-r from-cyan-400 to-blue-500"></div>
        
        {/* Social Media Links */}
        {renderSocialLinks()}
      </div>
    </div>
  );
};

export default About;