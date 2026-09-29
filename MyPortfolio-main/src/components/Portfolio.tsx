import React, { useEffect, useRef, useState } from 'react';
import { ExternalLink, Github, X, Sparkles } from 'lucide-react';

const Portfolio = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const [selectedProject, setSelectedProject] = useState<number | null>(null);

  const projects = [
    {
      id: 1,
      title: 'E-Commerce Platform',
      description: 'A modern e-commerce platform built with React, Node.js, and MongoDB',
      fullDescription: 'A full-featured e-commerce platform with user authentication, payment processing, inventory management, and real-time notifications. Built using React, Node.js.',
      image: 'https://images.pexels.com/photos/3183150/pexels-photo-3183150.jpeg?auto=compress&cs=tinysrgb&w=800',
      technologies: ['React','Express'],
      github: 'https://github.com/SANAULLAH-AI/My-Portfolio/tree/main/A2%20API%20Integration/E-Commence',
      demo: 'https://e-commerce-app-swiftshop.lovable.app/profile',
      category: 'Dashboard',
      gradient: 'from-blue-500 to-cyan-500'
    },
    {
      id: 2,
      title: 'Task Management App',
      description: 'A collaborative task management application with real-time updates',
      fullDescription: 'A collaborative task management application featuring real-time updates, team collaboration, project tracking, and advanced filtering. Built with React, Socket.io, and PostgreSQL.',
      image: 'https://images.pexels.com/photos/230544/pexels-photo-230544.jpeg?auto=compress&cs=tinysrgb&w=800',
      technologies: ['React', 'Node.js', 'MongoDB', 'Stripe'],
      github: '#',
      demo: '#',
      category: 'Full Stack',
      gradient: 'from-purple-500 to-pink-500'
    },
    {
      id: 3,
      title: 'Expense Tracker App',
      description: 'A budget tracking app for expenses and wages',
      fullDescription: 'An intuitive expense manager, to manage the daily based profit/expenses with budget inclusion',
      image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRSzfhYlszvxFuHtScOp47SS8ygGDCx9lUpbw&s',
      technologies: ['React', 'TypeScript'],
      github: 'https://github.com/SANAULLAH-AI/Expense-Tracker',
      demo: 'https://cozy-pavlova-5231d2.netlify.app/',
      category: 'Web App',
      gradient: 'from-green-500 to-emerald-500'
    },
    {
      id: 4,
      title: 'AI Chatbot',
      description: 'AI-powered chatbot web application utilizing Gemini API for intelligent conversations',
      fullDescription: 'A comprehensive chatbot web application built with Gemini API, enabling advanced conversation management, intelligent response generation, and seamless user interaction.',
      image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQJiof3CT-nz8ElQFUnOjr7st1Lb6OKmNZhyQ&s',
      technologies: ['Html', 'Css', 'Javascript'],
      github: 'https://github.com/SANAULLAH-AI/ChatBot',
      demo: 'https://sanaullah-ai.github.io/ChatBot/',
      category: 'Dashboard',
      gradient: 'from-yellow-500 to-orange-500'
    },
    {
      id: 5,
      title: 'Portfolio Website',
      description: 'A responsive portfolio website with modern animations',
      fullDescription: 'A modern, responsive portfolio website featuring smooth animations, interactive elements, optimized performance, and accessibility compliance. Built with vanilla CSS and Javascript.',
      image: 'https://images.pexels.com/photos/196644/pexels-photo-196644.jpeg?auto=compress&cs=tinysrgb&w=800',
      technologies: ['Html', 'Vanilla CSS', 'Javascript'],
      github: 'https://github.com/SANAULLAH-AI/My-Workstation',
      demo: 'https://sanaullah-ai.github.io/My-Workstation/',
      category: 'Frontend',
      gradient: 'from-pink-500 to-rose-500'
    }
  ];

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

  const openModal = (projectId: number) => {
    setSelectedProject(projectId);
    document.body.style.overflow = 'hidden';
  };

  const closeModal = () => {
    setSelectedProject(null);
    document.body.style.overflow = 'unset';
  };

  const selectedProjectData = projects.find(p => p.id === selectedProject);

  return (
    <section id="portfolio" ref={sectionRef} className="py-20 bg-white relative overflow-hidden">
      {/* Background decorations */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-20 right-20 w-96 h-96 bg-purple-300 rounded-full animate-morph"></div>
        <div className="absolute bottom-20 left-20 w-80 h-80 bg-pink-300 rounded-full animate-morph animation-delay-2000"></div>
      </div>

      <div className="container mx-auto px-6 relative z-10">
        <div className="text-center mb-16">
          <h2 className="observe text-4xl md:text-5xl font-bold text-gray-800 mb-6 relative">
            <span className="bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 bg-clip-text text-transparent animate-text-shimmer bg-[length:200%_auto]">
              My Portfolio
            </span>
            <Sparkles className="absolute -top-2 -right-8 text-purple-400 animate-pulse" size={24} />
          </h2>
          <div className="observe w-24 h-1 bg-gradient-to-r from-purple-600 to-pink-600 mx-auto mb-8 animate-glow-pulse"></div>
          <p className="observe text-gray-600 max-w-2xl mx-auto animate-fade-in-up animation-delay-300">
            A showcase of projects that demonstrate my skills and passion for creating exceptional digital experiences
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {projects.map((project, index) => (
            <div
              key={project.id}
              className="observe group bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-2xl transform hover:scale-105 transition-all duration-500 cursor-pointer hover-lift relative"
              style={{ animationDelay: `${index * 0.1}s` }}
              onClick={() => openModal(project.id)}
            >
              {/* Enhanced image section */}
              <div className="relative overflow-hidden">
                <img
                  src={project.image}
                  alt={project.title}
                  className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-2 group-hover:translate-y-0">
                  <span className={`bg-gradient-to-r ${project.gradient} text-white px-3 py-1 rounded-full text-xs font-semibold shadow-lg animate-bounce-gentle`}>
                    {project.category}
                  </span>
                </div>
                
                {/* Floating elements */}
                <div className="absolute top-2 left-2 w-2 h-2 bg-white rounded-full opacity-0 group-hover:opacity-100 animate-pulse transition-opacity duration-300"></div>
                <div className="absolute bottom-2 right-2 w-3 h-3 bg-white rounded-full opacity-0 group-hover:opacity-100 animate-pulse animation-delay-200 transition-opacity duration-300"></div>
              </div>
              
              <div className="p-6 relative">
                <h3 className="text-xl font-bold text-gray-800 mb-2 group-hover:text-purple-600 transition-colors duration-300">
                  {project.title}
                </h3>
                <p className="text-gray-600 text-sm mb-4 line-clamp-2 group-hover:text-gray-700 transition-colors duration-300">
                  {project.description}
                </p>
                
                <div className="flex flex-wrap gap-2 mb-4">
                  {project.technologies.slice(0, 3).map((tech, techIndex) => (
                    <span
                      key={tech}
                      className="px-2 py-1 bg-purple-100 text-purple-600 text-xs rounded-full group-hover:bg-purple-200 transition-all duration-300 hover:scale-105"
                      style={{ animationDelay: `${techIndex * 0.1}s` }}
                    >
                      {tech}
                    </span>
                  ))}
                  {project.technologies.length > 3 && (
                    <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full group-hover:bg-gray-200 transition-colors duration-300">
                      +{project.technologies.length - 3} more
                    </span>
                  )}
                </div>
                
                <div className="flex space-x-4">
                  <a
                    href={project.github}
                    className="flex items-center space-x-1 text-gray-600 hover:text-purple-600 transition-all duration-300 group/link"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <Github size={16} className="group-hover/link:animate-wiggle" />
                    <span className="text-sm">Code</span>
                  </a>
                  <a
                    href={project.demo}
                    className="flex items-center space-x-1 text-gray-600 hover:text-purple-600 transition-all duration-300 group/link"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <ExternalLink size={16} className="group-hover/link:animate-wiggle" />
                    <span className="text-sm">Demo</span>
                  </a>
                </div>

                {/* Hover overlay */}
                <div className="absolute inset-0 bg-gradient-to-r from-purple-500/10 to-pink-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-xl pointer-events-none"></div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Enhanced Modal */}
      {selectedProject && selectedProjectData && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fade-in-up" onClick={closeModal}>
          <div 
            className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto animate-scale-in shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="relative">
              <img
                src={selectedProjectData.image}
                alt={selectedProjectData.title}
                className="w-full h-64 object-cover"
              />
              <button
                onClick={closeModal}
                className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm rounded-full p-2 hover:bg-white transition-all duration-300 hover:scale-110 shadow-lg"
              >
                <X size={20} />
              </button>
              <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent"></div>
            </div>
            
            <div className="p-8">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-3xl font-bold text-gray-800">{selectedProjectData.title}</h3>
                <span className={`bg-gradient-to-r ${selectedProjectData.gradient} text-white px-3 py-1 rounded-full text-sm font-semibold shadow-lg animate-pulse`}>
                  {selectedProjectData.category}
                </span>
              </div>
              
              <p className="text-gray-600 mb-6 leading-relaxed">
                {selectedProjectData.fullDescription}
              </p>
              
              <div className="mb-6">
                <h4 className="font-semibold text-gray-800 mb-3">Technologies Used:</h4>
                <div className="flex flex-wrap gap-2">
                  {selectedProjectData.technologies.map((tech, index) => (
                    <span
                      key={tech}
                      className="px-3 py-1 bg-purple-100 text-purple-600 rounded-full text-sm hover:bg-purple-200 transition-colors duration-300 animate-fade-in-up"
                      style={{ animationDelay: `${index * 0.1}s` }}
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              </div>
              
              <div className="flex space-x-4">
                <a
                  href={selectedProjectData.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group flex items-center space-x-2 bg-gray-800 text-white px-6 py-3 rounded-lg hover:bg-gray-700 transition-all duration-300 hover:scale-105 shadow-lg hover:shadow-xl"
                >
                  <Github size={20} className="group-hover:animate-wiggle" />
                  <span>View Code</span>
                </a>
                <a
                  href={selectedProjectData.demo}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group flex items-center space-x-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white px-6 py-3 rounded-lg hover:from-purple-700 hover:to-pink-700 transition-all duration-300 hover:scale-105 shadow-lg hover:shadow-xl"
                >
                  <ExternalLink size={20} className="group-hover:animate-wiggle" />
                  <span>Live Demo</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

export default Portfolio;