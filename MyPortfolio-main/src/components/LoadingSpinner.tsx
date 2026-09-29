import React, { useState, useEffect } from 'react';

const LoadingSpinner = () => {
  const [progress, setProgress] = useState(0);
  const [loadingText, setLoadingText] = useState('Loading');

  const loadingMessages = [
    'Loading',
    'Preparing experience',
    'Almost ready',
    'Welcome'
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) return 100;
        return prev + Math.random() * 15;
      });
    }, 200);

    const textInterval = setInterval(() => {
      setLoadingText(prev => {
        const currentIndex = loadingMessages.indexOf(prev);
        const nextIndex = (currentIndex + 1) % loadingMessages.length;
        return loadingMessages[nextIndex];
      });
    }, 500);

    return () => {
      clearInterval(interval);
      clearInterval(textInterval);
    };
  }, []);

  return (
    <div className="fixed inset-0 bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 flex items-center justify-center z-50">
      {/* Animated Background */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-500/20 rounded-full mix-blend-multiply filter blur-xl animate-blob"></div>
        <div className="absolute top-1/3 right-1/4 w-96 h-96 bg-pink-500/20 rounded-full mix-blend-multiply filter blur-xl animate-blob animation-delay-2000"></div>
        <div className="absolute bottom-1/4 left-1/2 w-96 h-96 bg-blue-500/20 rounded-full mix-blend-multiply filter blur-xl animate-blob animation-delay-4000"></div>
      </div>

      <div className="text-center space-y-8 relative z-10">
        {/* Main Logo/Brand */}
        <div className="animate-bounce-in">
          <h1 className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 bg-clip-text text-transparent mb-4">
            Portfolio
          </h1>
        </div>

        {/* Loading Animation */}
        <div className="space-y-6 animate-fade-in-up animation-delay-500">
          {/* Spinner */}
          <div className="relative mx-auto w-20 h-20">
            <div className="absolute inset-0 border-4 border-white/20 rounded-full"></div>
            <div className="absolute inset-0 border-4 border-transparent border-t-purple-400 border-r-pink-400 rounded-full animate-spin"></div>
            <div className="absolute inset-2 border-4 border-transparent border-t-blue-400 border-l-purple-400 rounded-full animate-spin" style={{ animationDirection: 'reverse', animationDuration: '0.8s' }}></div>
          </div>

          {/* Progress Bar */}
          <div className="w-64 mx-auto space-y-2">
            <div className="w-full bg-white/10 rounded-full h-2 overflow-hidden backdrop-blur-sm">
              <div 
                className="h-full bg-gradient-to-r from-purple-400 to-pink-400 rounded-full transition-all duration-300 ease-out"
                style={{ width: `${Math.min(progress, 100)}%` }}
              ></div>
            </div>
            <div className="text-white/80 text-sm font-medium">
              {Math.round(Math.min(progress, 100))}%
            </div>
          </div>

          {/* Loading Text */}
          <div className="text-white/90 text-lg font-medium animate-pulse">
            {loadingText}
            <span className="animate-bounce inline-block ml-1">.</span>
            <span className="animate-bounce inline-block animation-delay-200">.</span>
            <span className="animate-bounce inline-block animation-delay-400">.</span>
          </div>
        </div>

        {/* Additional Loading Elements */}
        <div className="flex justify-center space-x-2 animate-fade-in-up animation-delay-1000">
          {[0, 1, 2].map((i) => (
            <div
              key={i}
              className="w-3 h-3 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full animate-bounce"
              style={{ animationDelay: `${i * 0.2}s` }}
            ></div>
          ))}
        </div>

        {/* Tagline */}
        <p className="text-white/60 text-sm animate-fade-in-up animation-delay-1500 max-w-sm mx-auto">
          Crafting beautiful digital experiences with passion and precision
        </p>
      </div>

      {/* Corner Decorations */}
      <div className="absolute top-10 left-10 w-16 h-16 border-l-2 border-t-2 border-purple-400/30 animate-pulse"></div>
      <div className="absolute top-10 right-10 w-16 h-16 border-r-2 border-t-2 border-pink-400/30 animate-pulse animation-delay-500"></div>
      <div className="absolute bottom-10 left-10 w-16 h-16 border-l-2 border-b-2 border-blue-400/30 animate-pulse animation-delay-1000"></div>
      <div className="absolute bottom-10 right-10 w-16 h-16 border-r-2 border-b-2 border-purple-400/30 animate-pulse animation-delay-1500"></div>
    </div>
  );
};

export default LoadingSpinner;