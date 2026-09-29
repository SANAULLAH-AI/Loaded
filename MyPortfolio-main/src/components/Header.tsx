import React, { useState, useEffect } from 'react';
import { Menu, X, Sparkles } from 'lucide-react';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navItems = [
    { name: 'Home', href: '#home' },
    { name: 'About', href: '#about' },
    { name: 'Skills', href: '#skills' },
    { name: 'Portfolio', href: '#portfolio' },
    { name: 'Contact', href: '#contact' },
  ];

  const scrollToSection = (href: string) => {
    const element = document.querySelector(href);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
    setIsMenuOpen(false);
  };

  return (
    <header
      className={`fixed top-0 w-full z-50 transition-all duration-500 ${
        isScrolled
          ? 'bg-white/90 backdrop-blur-md shadow-lg border-b border-gray-200/20'
          : 'bg-transparent'
      }`}
    >
      <nav className="container mx-auto px-6 py-4">
        <div className="flex justify-between items-center">
          {/* Enhanced Logo */}
          <div className="group relative">
            <div className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent animate-text-shimmer bg-[length:200%_auto]">
              Portfolio
            </div>
            <Sparkles className="absolute -top-1 -right-6 text-purple-400 opacity-0 group-hover:opacity-100 transition-opacity duration-300 animate-pulse" size={16} />
          </div>

          {/* Enhanced Desktop Navigation */}
          <div className="hidden md:flex space-x-8">
            {navItems.map((item, index) => (
              <button
                key={item.name}
                onClick={() => scrollToSection(item.href)}
                className="relative text-gray-700 hover:text-purple-600 transition-all duration-300 group font-medium"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <span className="relative z-10">{item.name}</span>
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-purple-600 to-pink-600 transition-all duration-300 group-hover:w-full"></span>
                <div className="absolute inset-0 bg-purple-50 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 -z-10 scale-110"></div>
              </button>
            ))}
          </div>

          {/* Enhanced Mobile Menu Button */}
          <button
            className="md:hidden text-gray-700 hover:text-purple-600 transition-all duration-300 p-2 rounded-lg hover:bg-purple-50 group"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            <div className="relative">
              {isMenuOpen ? (
                <X size={24} className="group-hover:animate-wiggle" />
              ) : (
                <Menu size={24} className="group-hover:animate-wiggle" />
              )}
            </div>
          </button>
        </div>

        {/* Enhanced Mobile Navigation */}
        <div
          className={`md:hidden transition-all duration-500 overflow-hidden ${
            isMenuOpen ? 'max-h-64 opacity-100' : 'max-h-0 opacity-0'
          }`}
        >
          <div className="pt-4 pb-2 space-y-2 bg-white/90 backdrop-blur-md rounded-lg mt-4 shadow-lg border border-gray-200/20">
            {navItems.map((item, index) => (
              <button
                key={item.name}
                onClick={() => scrollToSection(item.href)}
                className="block w-full text-left py-3 px-4 text-gray-700 hover:text-purple-600 hover:bg-purple-50 rounded-lg transition-all duration-300 font-medium group"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <span className="relative">
                  {item.name}
                  <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-purple-600 to-pink-600 transition-all duration-300 group-hover:w-full"></span>
                </span>
              </button>
            ))}
          </div>
        </div>
      </nav>
    </header>
  );
};

export default Header;