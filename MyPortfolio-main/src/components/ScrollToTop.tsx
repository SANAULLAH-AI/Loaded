import React, { useState, useEffect } from 'react';
import { ArrowUp } from 'lucide-react';

const ScrollToTop = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);

  useEffect(() => {
    const toggleVisibility = () => {
      // Calculate scroll progress
      const scrollTop = window.pageYOffset;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const progress = (scrollTop / docHeight) * 100;
      
      setScrollProgress(progress);
      setIsVisible(scrollTop > 300);
    };

    window.addEventListener('scroll', toggleVisibility);
    return () => window.removeEventListener('scroll', toggleVisibility);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };

  return (
    <button
      onClick={scrollToTop}
      className={`fixed bottom-8 right-8 z-40 p-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-full shadow-lg hover:shadow-xl transform transition-all duration-300 group ${
        isVisible 
          ? 'translate-y-0 opacity-100 scale-100' 
          : 'translate-y-16 opacity-0 scale-50 pointer-events-none'
      }`}
      style={{
        background: `conic-gradient(from 0deg, #9333ea ${scrollProgress * 3.6}deg, rgba(147, 51, 234, 0.1) ${scrollProgress * 3.6}deg)`
      }}
      aria-label="Scroll to top"
    >
      {/* Progress Ring */}
      <div className="absolute inset-0 rounded-full">
        <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
          <path
            className="text-white/20"
            stroke="currentColor"
            strokeWidth="2"
            d="M18 2.0845
              a 15.9155 15.9155 0 0 1 0 31.831
              a 15.9155 15.9155 0 0 1 0 -31.831"
            fill="none"
          />
          <path
            className="text-white"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            d="M18 2.0845
              a 15.9155 15.9155 0 0 1 0 31.831
              a 15.9155 15.9155 0 0 1 0 -31.831"
            fill="none"
            style={{
              strokeDasharray: `${scrollProgress}, 100`,
              transition: 'stroke-dasharray 0.1s ease-in-out'
            }}
          />
        </svg>
      </div>

      {/* Arrow Icon */}
      <div className="relative z-10 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full p-2">
        <ArrowUp 
          size={20} 
          className="group-hover:-translate-y-1 group-hover:scale-110 transition-all duration-300" 
        />
      </div>

      {/* Pulse Ring */}
      <div className="absolute inset-0 rounded-full bg-gradient-to-r from-purple-600 to-pink-600 animate-ping opacity-20 group-hover:opacity-30"></div>
    </button>
  );
};

export default ScrollToTop;