import React, { useState, useEffect } from 'react';
import { ChevronDown, Github, Linkedin, Mail, MessageCircle } from 'lucide-react';

const Hero = () => {
  const [displayText, setDisplayText] = useState('');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isTypingComplete, setIsTypingComplete] = useState(false);
  const fullText = "Hi, I'm SANAULLAH";

  useEffect(() => {
    if (currentIndex < fullText.length) {
      const timeout = setTimeout(() => {
        setDisplayText(fullText.slice(0, currentIndex + 1));
        setCurrentIndex(currentIndex + 1);
      }, 100);
      return () => clearTimeout(timeout);
    } else {
      setIsTypingComplete(true);
    }
  }, [currentIndex, fullText]);

  const scrollToNext = () => {
    document.querySelector('#about')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section id="home" className="min-h-screen flex items-center justify-center relative overflow-hidden">
      {/* Enhanced Animated Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50">
        <div className="absolute top-20 left-20 w-72 h-72 bg-purple-300 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob"></div>
        <div className="absolute top-40 right-20 w-72 h-72 bg-pink-300 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-2000"></div>
        <div className="absolute -bottom-8 left-40 w-72 h-72 bg-blue-300 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-4000"></div>
        
        {/* Additional floating elements */}
        <div className="absolute top-1/4 left-1/4 w-4 h-4 bg-purple-400 rounded-full animate-float animation-delay-1000"></div>
        <div className="absolute top-1/3 right-1/3 w-6 h-6 bg-pink-400 rounded-full animate-float animation-delay-2000"></div>
        <div className="absolute bottom-1/4 right-1/4 w-3 h-3 bg-blue-400 rounded-full animate-float animation-delay-3000"></div>
        
        {/* Geometric shapes */}
        <div className="absolute top-1/2 left-10 w-8 h-8 border-2 border-purple-300 rotate-45 animate-rotate-slow"></div>
        <div className="absolute bottom-1/3 right-10 w-12 h-12 border-2 border-pink-300 animate-pulse"></div>
      </div>

      <div className="container mx-auto px-6 text-center relative z-10">
        <div className="animate-fade-in-up">
          {/* Enhanced typing animation */}
          <div className="relative mb-6">
            <h1
              className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-gray-800 relative [font-size:clamp(2rem,10vw,4.5rem)]"
            >
              <span className="bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 bg-clip-text text-transparent animate-text-shimmer bg-[length:200%_auto]">
                {displayText}
              </span>
              <span className={`animate-pulse text-purple-600 ${isTypingComplete ? 'opacity-0' : 'opacity-100'}`}>|</span>
            </h1>
            {/* Glowing underline effect */}
            <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 w-32 h-1 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full animate-glow-pulse"></div>
          </div>
          
          <div className="animate-fade-in-up animation-delay-500">
            <p className="text-lg sm:text-xl md:text-2xl text-gray-600 mb-8 animate-slide-in-left">
              Frontend Developer & UI/UX Designer
            </p>
            <div className="relative">
              <p className="text-base sm:text-lg md:text-xl text-gray-500 mb-12 max-w-2xl mx-auto animate-slide-in-right animation-delay-700">
                I create beautiful, functional, and user-centered digital experiences
                that solve real-world problems with clean code and intuitive design.
              </p>
              {/* Decorative elements */}
              <div className="absolute -left-4 top-0 w-2 h-2 bg-purple-400 rounded-full animate-bounce-gentle"></div>
              <div className="absolute -right-4 bottom-0 w-2 h-2 bg-pink-400 rounded-full animate-bounce-gentle animation-delay-500"></div>
            </div>
          </div>

          {/* Enhanced CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16 animate-zoom-in animation-delay-1000">
            <button
              onClick={() => document.querySelector('#portfolio')?.scrollIntoView({ behavior: 'smooth' })}
              className="group relative bg-gradient-to-r from-purple-600 to-pink-600 text-white px-8 py-4 rounded-full font-semibold hover:scale-105 transform transition-all duration-500 shadow-lg hover:shadow-2xl overflow-hidden"
            >
              <span className="relative z-10">View My Work</span>
              <div className="absolute inset-0 bg-gradient-to-r from-pink-600 to-purple-600 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-2xl transition-opacity duration-300"></div>
            </button>
            <button
              onClick={() => document.querySelector('#contact')?.scrollIntoView({ behavior: 'smooth' })}
              className="group relative border-2 border-purple-600 text-purple-600 px-8 py-4 rounded-full font-semibold hover:bg-purple-600 hover:text-white transition-all duration-500 hover:scale-105 transform hover:shadow-lg overflow-hidden"
            >
              <span className="relative z-10">Get In Touch</span>
              <div className="absolute inset-0 bg-purple-600 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left"></div>
            </button>
          </div>

          {/* Enhanced Social Links */}
          <div className="flex justify-center space-x-6 mb-16 animate-elastic animation-delay-1500">
            {[
              { icon: Github, href: 'https://github.com/SANAULLAH-AI', label: 'GitHub', color: 'hover:text-gray-800' },
              { icon: Linkedin, href: 'https://www.linkedin.com/in/sana-ullah-a799b22a8', label: 'LinkedIn', color: 'hover:text-blue-600' },
              { icon: Mail, href: '#contact', label: 'Email', color: 'hover:text-purple-600' },
              { icon: MessageCircle, href: 'https://wa.me/923251907930', label: 'WhatsApp', color: 'hover:text-green-600' },
            ].map(({ icon: Icon, href, label, color }, index) => (
              <a
                key={label}
                href={href}
                target={href.startsWith('http') ? '_blank' : '_self'}
                rel={href.startsWith('http') ? 'noopener noreferrer' : ''}
                className={`group p-4 bg-white/80 backdrop-blur-sm rounded-full shadow-lg hover:shadow-2xl transform hover:scale-110 transition-all duration-500 text-gray-600 ${color} hover-lift`}
                aria-label={label}
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <Icon size={24} className="group-hover:animate-wiggle" />
                <div className="absolute inset-0 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full opacity-0 group-hover:opacity-20 transition-opacity duration-300"></div>
              </a>
            ))}
          </div>
        </div>

        {/* Enhanced Scroll Indicator */}
        <button
          onClick={scrollToNext}
          className="absolute bottom-8 left-1/2 transform -translate-x-1/2 group"
        >
          <div className="relative">
            <ChevronDown size={32} className="text-gray-400 group-hover:text-purple-600 transition-colors duration-300 animate-bounce-gentle" />
            <div className="absolute inset-0 bg-purple-600 rounded-full opacity-0 group-hover:opacity-20 transition-opacity duration-300 animate-pulse"></div>
          </div>
          <div className="mt-2 text-xs text-gray-400 group-hover:text-purple-600 transition-colors duration-300">
            Scroll Down
          </div>
        </button>
      </div>

      {/* Floating particles */}
      <div className="absolute inset-0 pointer-events-none">
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-purple-400 rounded-full animate-float opacity-30"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 5}s`,
              animationDuration: `${3 + Math.random() * 4}s`
            }}
          ></div>
        ))}
      </div>
    </section>
  );
};

export default Hero;