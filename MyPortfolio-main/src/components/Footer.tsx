import React from 'react';
import { Github, Linkedin, Mail, Heart, ArrowUp } from 'lucide-react';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  const socialLinks = [
    {
      icon: Github,
      href: 'https://github.com/SANAULLAH-AI',
      label: 'GitHub',
      color: 'hover:text-gray-800'
    },
    {
      icon: Linkedin,
      href: 'https://www.linkedin.com/in/sana-ullah-a799b22a8/',
      label: 'LinkedIn',
      color: 'hover:text-blue-600'
    },
    {
      icon: Mail,
      href: '#contact',
      label: 'Email',
      color: 'hover:text-purple-600'
    }
  ];

  const quickLinks = [
    { name: 'Home', href: '#home' },
    { name: 'About', href: '#about' },
    { name: 'Skills', href: '#skills' },
    { name: 'Portfolio', href: '#portfolio' },
    { name: 'Contact', href: '#contact' }
  ];

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const scrollToSection = (href: string) => {
    const element = document.querySelector(href);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <footer className="bg-gradient-to-br from-gray-900 to-gray-800 text-white relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-0 left-0 w-full h-full bg-repeat opacity-20" 
             style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)' }}></div>
      </div>

      <div className="container mx-auto px-6 py-16 relative z-10">
        <div className="grid md:grid-cols-4 gap-8">
          {/* Brand Section */}
          <div className="md:col-span-2 space-y-6">
            <div>
              <h3 className="text-3xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent mb-4">
                SANAULLAH
              </h3>
              <p className="text-gray-300 leading-relaxed max-w-md">
                Frontend Developer & UI/UX Designer passionate about creating beautiful, 
                functional digital experiences that make a difference.
              </p>
            </div>

            {/* Social Links */}
            <div className="flex space-x-4">
              {socialLinks.map(({ icon: Icon, href, label, color }) => (
                <a
                  key={label}
                  href={href}
                  aria-label={label}
                  onClick={href.startsWith('#') ? (e) => {
                    e.preventDefault();
                    scrollToSection(href);
                  } : undefined}
                  className={`p-3 bg-white/10 backdrop-blur-sm rounded-lg ${color} transition-all duration-300 hover:scale-110 hover:bg-white/20 group`}
                >
                  <Icon size={20} className="group-hover:animate-bounce" />
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-6">
            <h4 className="text-xl font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-3">
              {quickLinks.map((link) => (
                <li key={link.name}>
                  <button
                    onClick={() => scrollToSection(link.href)}
                    className="text-gray-300 hover:text-white transition-colors duration-300 hover:translate-x-2 transform inline-block"
                  >
                    {link.name}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div className="space-y-6">
            <h4 className="text-xl font-semibold mb-4">Let's Connect</h4>
            <div className="space-y-3 text-gray-300">
              <p className="hover:text-white transition-colors duration-300">
               Pakistan, ISB
              </p>
              <p className="hover:text-white transition-colors duration-300">
                sanaullah786shh92@gmail.com
              </p>
              <p className="hover:text-white transition-colors duration-300">
                +92 325-1907930
              </p>
            </div>

            {/* Availability Status */}
            <div className="inline-flex items-center space-x-2 px-3 py-2 bg-green-500/20 border border-green-500/30 rounded-full">
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
              <span className="text-green-400 text-sm font-medium">Available for work</span>
            </div>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-gray-700 my-8"></div>

        {/* Bottom Section */}
        <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
          <div className="flex items-center space-x-2 text-gray-300">
            <span>© {currentYear} Sanaullah. Made with</span>
            <Heart size={16} className="text-red-400 animate-pulse" />
            <span>and lots of coffee/tea</span>
          </div>

          {/* Back to Top Button */}
          <button
            onClick={scrollToTop}
            className="flex items-center space-x-2 text-gray-300 hover:text-white transition-all duration-300 group"
          >
            <span>Back to top</span>
            <ArrowUp size={16} className="group-hover:-translate-y-1 transition-transform duration-300" />
          </button>
        </div>
      </div>

      {/* Floating Elements */}
      <div className="absolute top-10 right-10 w-32 h-32 bg-purple-500/10 rounded-full animate-float"></div>
      <div className="absolute bottom-10 left-10 w-24 h-24 bg-pink-500/10 rounded-full animate-float animation-delay-2000"></div>
    </footer>
  );
};

export default Footer;