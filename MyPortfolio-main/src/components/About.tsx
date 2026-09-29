import React, { useEffect, useRef } from 'react';
import { Code, Palette, Zap, Sparkles } from 'lucide-react';

const About = () => {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('animate-fade-in-up');
          }
        });
      },
      { threshold: 0.1 }
    );

    const elements = sectionRef.current?.querySelectorAll('.observe');
    elements?.forEach((el) => observer.observe(el));

    return () => observer.disconnect();
  }, []);

  const features = [
    {
      icon: Code,
      title: 'Clean Code',
      description: 'Writing maintainable, scalable, and efficient code following best practices.',
      gradient: 'from-blue-500 to-cyan-500'
    },
    {
      icon: Palette,
      title: 'UI/UX Design',
      description: 'Creating intuitive and beautiful user interfaces with attention to detail.',
      gradient: 'from-purple-500 to-pink-500'
    },
    {
      icon: Zap,
      title: 'Performance',
      description: 'Optimizing applications for speed, accessibility, and user experience.',
      gradient: 'from-yellow-500 to-orange-500'
    },
  ];

  return (
    <section id="about" ref={sectionRef} className="py-20 bg-white relative overflow-hidden">
      {/* Background decorations */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-20 left-20 w-96 h-96 bg-purple-300 rounded-full animate-morph"></div>
        <div className="absolute bottom-20 right-20 w-80 h-80 bg-pink-300 rounded-full animate-morph animation-delay-2000"></div>
      </div>

      <div className="container mx-auto px-6 relative z-10">
        <div className="text-center mb-16">
          <h2 className="observe text-4xl md:text-5xl font-bold text-gray-800 mb-6 relative">
            <span className="bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
              About Me
            </span>
            <Sparkles className="absolute -top-2 -right-8 text-purple-400 animate-pulse" size={24} />
          </h2>
          <div className="observe w-24 h-1 bg-gradient-to-r from-purple-600 to-pink-600 mx-auto mb-8 animate-glow-pulse"></div>
        </div>

        <div className="grid md:grid-cols-2 gap-12 items-center">
          {/* Enhanced Image Section */}
          <div className="observe animate-slide-in-left">
            <div className="relative group perspective-1000">
              <div className="w-80 h-80 mx-auto bg-gradient-to-br from-purple-400 via-pink-400 to-blue-400 rounded-3xl transform rotate-6 shadow-2xl transition-all duration-700 group-hover:rotate-12 group-hover:scale-105 animate-float"></div>
              <div className="absolute inset-0 w-80 h-80 mx-auto bg-gray-300 rounded-3xl shadow-2xl transition-all duration-700 group-hover:shadow-3xl transform group-hover:-rotate-3 group-hover:scale-95"></div>
              
              {/* Floating elements around image */}
              <div className="absolute -top-4 -left-4 w-8 h-8 bg-purple-400 rounded-full animate-bounce-gentle"></div>
              <div className="absolute -bottom-4 -right-4 w-6 h-6 bg-pink-400 rounded-full animate-bounce-gentle animation-delay-500"></div>
              <div className="absolute top-1/2 -right-8 w-4 h-4 bg-blue-400 rounded-full animate-bounce-gentle animation-delay-1000"></div>
            </div>
          </div>

          <div className="space-y-6 animate-slide-in-right">
            <div className="observe">
              <h3 className="text-2xl font-bold text-gray-800 mb-4 relative">
                Passionate Developer & Designer
                <div className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-purple-600 to-pink-600 group-hover:w-full transition-all duration-500"></div>
              </h3>
              <div className="space-y-4">
                <p className="text-gray-600 leading-relaxed animate-fade-in-up animation-delay-200">
                  With over 1+ years of experience in web development and design of App/webApp, I specialize in creating 
                  digital experiences that are not only visually stunning but also highly functional and 
                  user-friendly. My journey began with a fascination for how technology can solve real-world 
                  problems and create meaningful connections.
                </p>
                <p className="text-gray-600 leading-relaxed animate-fade-in-up animation-delay-400">
                  I believe in the power of clean code, thoughtful design, and continuous learning. 
                  When I'm not coding, you can find me exploring new technologies, contributing to 
                  open-source projects, or mentoring aspiring developers.
                </p>
              </div>
            </div>

            {/* Enhanced Features Grid */}
            <div className="grid gap-6 mt-8">
              {features.map((feature, index) => (
                <div
                  key={feature.title}
                  className="observe group flex items-start space-x-4 p-6 rounded-xl hover:bg-gradient-to-r hover:from-purple-50 hover:to-pink-50 transition-all duration-500 cursor-pointer hover-lift border border-transparent hover:border-purple-200"
                  style={{ animationDelay: `${index * 0.2}s` }}
                >
                  <div className={`p-3 bg-gradient-to-r ${feature.gradient} rounded-xl text-white group-hover:scale-110 transition-transform duration-300 shadow-lg group-hover:shadow-xl`}>
                    <feature.icon size={24} className="group-hover:animate-wiggle" />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-semibold text-gray-800 mb-2 group-hover:text-purple-600 transition-colors duration-300">
                      {feature.title}
                    </h4>
                    <p className="text-gray-600 text-sm leading-relaxed group-hover:text-gray-700 transition-colors duration-300">
                      {feature.description}
                    </p>
                  </div>
                  <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <div className="w-2 h-2 bg-purple-400 rounded-full animate-pulse"></div>
                  </div>
                </div>
              ))}
            </div>

            {/* Stats or additional info */}
            <div className="observe mt-8 p-6 bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl border border-purple-100 animate-fade-in-up animation-delay-1000">
              <div className="flex items-center space-x-4">
                <div className="flex-1">
                  <h4 className="font-semibold text-gray-800 mb-1">Always Learning</h4>
                  <p className="text-sm text-gray-600">Staying updated with the latest technologies and best practices</p>
                </div>
                <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center animate-pulse">
                  <Sparkles className="text-white" size={20} />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;