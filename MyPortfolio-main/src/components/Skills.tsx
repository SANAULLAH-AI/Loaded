import React, { useEffect, useRef, useState } from 'react';
import { Code, Palette, Zap, Sparkles } from 'lucide-react';

const Skills = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  const skills = [
    { name: 'HTML', level: 80, color: 'from-blue-500 to-cyan-500', icon: '🌐' },
    { name: 'React-native', level: 65, color: 'from-blue-600 to-indigo-600', icon: '⚛️' },
    { name: 'Node.js', level: 70, color: 'from-green-500 to-emerald-500', icon: '🟢' },
    { name: 'Python', level: 80, color: 'from-yellow-500 to-orange-500', icon: '🐍' },
    { name: 'UI/UX Design', level: 88, color: 'from-pink-500 to-rose-500', icon: '🎨' },
    { name: 'JavaScript', level: 65, color: 'from-orange-500 to-red-500', icon: '⚡' },
  ];

  const technologies = [
    { name: 'JavaScript', gradient: 'from-yellow-400 to-orange-500' },
    { name: 'React Native', gradient: 'from-blue-400 to-blue-600' },
    { name: 'Node.js', gradient: 'from-green-400 to-green-600' },
    { name: 'Python', gradient: 'from-blue-500 to-yellow-500' },
    { name: 'MongoDB', gradient: 'from-green-500 to-green-700' },
    { name: 'SQL', gradient: 'from-blue-600 to-purple-600' },
    { name: 'Next.js', gradient: 'from-gray-700 to-gray-900' },
    { name: 'Tailwind CSS', gradient: 'from-cyan-400 to-blue-500' },
    { name: 'Figma', gradient: 'from-purple-500 to-pink-500' },
    { name: 'Git', gradient: 'from-orange-500 to-red-500' },
    { name: 'C++', gradient: 'from-blue-500 to-purple-600' }
  ];

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsVisible(true);
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

  return (
    <section id="skills" ref={sectionRef} className="py-20 bg-gradient-to-br from-gray-50 to-purple-50 relative overflow-hidden">
      {/* Enhanced background decorations */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-20 left-20 w-96 h-96 bg-purple-300 rounded-full animate-morph"></div>
        <div className="absolute bottom-20 right-20 w-80 h-80 bg-pink-300 rounded-full animate-morph animation-delay-2000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-blue-300 rounded-full animate-morph animation-delay-4000"></div>
      </div>

      <div className="container mx-auto px-6 relative z-10">
        <div className="text-center mb-16">
          <h2 className="observe text-4xl md:text-5xl font-bold text-gray-800 mb-6 relative">
            <span className="bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 bg-clip-text text-transparent animate-text-shimmer bg-[length:200%_auto]">
              Skills & Expertise
            </span>
            <Sparkles className="absolute -top-2 -right-8 text-purple-400 animate-pulse" size={24} />
          </h2>
          <div className="observe w-24 h-1 bg-gradient-to-r from-purple-600 to-pink-600 mx-auto mb-8 animate-glow-pulse"></div>
          <p className="observe text-gray-600 max-w-2xl mx-auto animate-fade-in-up animation-delay-300">
            A comprehensive set of technical skills and tools I use to bring ideas to life
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-12">
          {/* Enhanced Skill Bars */}
          <div className="observe space-y-8 animate-slide-in-left">
            <h3 className="text-2xl font-bold text-gray-800 mb-6 relative">
              Technical Proficiency
              <div className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-purple-600 to-pink-600 group-hover:w-full transition-all duration-500"></div>
            </h3>
            {skills.map((skill, index) => (
              <div key={skill.name} className="space-y-3 group">
                <div className="flex justify-between items-center">
                  <div className="flex items-center space-x-2">
                    <span className="text-lg">{skill.icon}</span>
                    <span className="font-semibold text-gray-700 group-hover:text-purple-600 transition-colors duration-300">
                      {skill.name}
                    </span>
                  </div>
                  <span className="text-sm text-gray-500 font-medium">{skill.level}%</span>
                </div>
                <div className="relative w-full bg-gray-200 rounded-full h-4 overflow-hidden shadow-inner">
                  <div
                    className={`h-full bg-gradient-to-r ${skill.color} rounded-full transition-all duration-1000 ease-out relative overflow-hidden`}
                    style={{
                      width: isVisible ? `${skill.level}%` : '0%',
                      transitionDelay: `${index * 0.1}s`,
                    }}
                  >
                    {/* Animated shine effect */}
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-parallax"></div>
                  </div>
                  {/* Glow effect */}
                  <div 
                    className={`absolute top-0 left-0 h-full bg-gradient-to-r ${skill.color} rounded-full opacity-50 blur-sm transition-all duration-1000 ease-out`}
                    style={{
                      width: isVisible ? `${skill.level}%` : '0%',
                      transitionDelay: `${index * 0.1}s`,
                    }}
                  ></div>
                </div>
              </div>
            ))}
          </div>

          {/* Enhanced Technology Cloud */}
          <div className="observe animate-slide-in-right">
            <h3 className="text-2xl font-bold text-gray-800 mb-6 relative">
              Technologies & Tools
              <div className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-purple-600 to-pink-600 group-hover:w-full transition-all duration-500"></div>
            </h3>
            <div className="flex flex-wrap gap-3 mb-8">
              {technologies.map((tech, index) => (
                <span
                  key={tech.name}
                  className={`group px-4 py-3 bg-white/80 backdrop-blur-sm rounded-xl text-sm font-medium text-gray-700 shadow-md hover:shadow-xl transform hover:scale-105 transition-all duration-500 cursor-default hover-lift relative overflow-hidden`}
                  style={{ animationDelay: `${index * 0.05}s` }}
                >
                  <span className="relative z-10">{tech.name}</span>
                  <div className={`absolute inset-0 bg-gradient-to-r ${tech.gradient} opacity-0 group-hover:opacity-10 transition-opacity duration-300`}></div>
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent opacity-0 group-hover:opacity-100 animate-parallax transition-opacity duration-300"></div>
                </span>
              ))}
            </div>

            {/* Enhanced Experience Stats */}
            <div className="grid grid-cols-2 gap-6 mt-12">
              {[
                { number: '1+', label: 'Years Experience', icon: '📅', gradient: 'from-blue-500 to-cyan-500' },
                { number: '12+', label: 'Projects Completed', icon: '🚀', gradient: 'from-green-500 to-emerald-500' },
                { number: '2+', label: 'Happy Clients', icon: '😊', gradient: 'from-yellow-500 to-orange-500' },
                { number: '100%', label: 'Success Rate', icon: '🎯', gradient: 'from-purple-500 to-pink-500' },
              ].map((stat, index) => (
                <div
                  key={stat.label}
                  className="group text-center p-6 bg-white/80 backdrop-blur-sm rounded-xl shadow-lg hover:shadow-2xl transform hover:scale-105 transition-all duration-500 cursor-default hover-lift relative overflow-hidden"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <div className="text-2xl mb-2">{stat.icon}</div>
                  <div className={`text-3xl font-bold bg-gradient-to-r ${stat.gradient} bg-clip-text text-transparent mb-2 group-hover:animate-pulse`}>
                    {stat.number}
                  </div>
                  <p className="text-gray-600 text-sm group-hover:text-gray-700 transition-colors duration-300">{stat.label}</p>
                  <div className={`absolute inset-0 bg-gradient-to-r ${stat.gradient} opacity-0 group-hover:opacity-5 transition-opacity duration-300`}></div>
                </div>
              ))}
            </div>

            {/* Additional Skills Section */}
            <div className="mt-8 p-6 bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl border border-purple-100 animate-fade-in-up animation-delay-1000 hover-lift">
              <div className="flex items-center space-x-4">
                <div className="flex-1">
                  <h4 className="font-semibold text-gray-800 mb-2 flex items-center space-x-2">
                    <Code className="text-purple-600" size={20} />
                    <span>Always Learning</span>
                  </h4>
                  <p className="text-sm text-gray-600">Staying updated with the latest technologies and best practices in web development</p>
                </div>
                <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center animate-pulse shadow-lg">
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

export default Skills;