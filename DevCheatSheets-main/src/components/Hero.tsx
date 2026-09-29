import React from 'react';
import { Code, Zap, BookOpen, Users } from 'lucide-react';

export const Hero: React.FC = () => {
  return (
    <div className="relative bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-900 dark:to-gray-800 overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23000000' fill-opacity='0.1'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }}></div>
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center">
          {/* Main Heading */}
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 dark:text-white mb-6">
            <span className="block">Developer</span>
            <span className="block bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Cheatsheets
            </span>
          </h1>

          {/* Subtitle */}
          <p className="text-xl sm:text-2xl text-gray-600 dark:text-gray-300 mb-8 max-w-3xl mx-auto leading-relaxed">
            Quick reference guides for developers. Find syntax, examples, and best practices 
            for your favorite programming languages and frameworks.
          </p>
          <p className="text-xl sm:text-2xl text-gray-600 dark:text-gray-300 mb-8 max-w-3xl mx-auto leading-relaxed">
             <subcript> Created By SANAULLAH</subcript>
     
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
            <a
              href="#popular"
              className="inline-flex items-center justify-center px-8 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors shadow-lg hover:shadow-xl"
            >
              <BookOpen className="w-5 h-5 mr-2" />
              Browse Cheatsheets
            </a>
            <a
              href="#categories"
              className="inline-flex items-center justify-center px-8 py-3 bg-white dark:bg-gray-800 text-gray-900 dark:text-white font-semibold rounded-lg border border-gray-200 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
            >
              <Code className="w-5 h-5 mr-2" />
              View Categories
            </a>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto">
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-12 h-12 bg-blue-100 dark:bg-blue-900 rounded-lg mb-3">
                <Code className="w-6 h-6 text-blue-600 dark:text-blue-400" />
              </div>
              <div className="text-2xl font-bold text-gray-900 dark:text-white">15+</div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Languages</div>
            </div>
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-12 h-12 bg-purple-100 dark:bg-purple-900 rounded-lg mb-3">
                <Zap className="w-6 h-6 text-purple-600 dark:text-purple-400" />
              </div>
              <div className="text-2xl font-bold text-gray-900 dark:text-white">50+</div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Frameworks</div>
            </div>
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-12 h-12 bg-green-100 dark:bg-green-900 rounded-lg mb-3">
                <BookOpen className="w-6 h-6 text-green-600 dark:text-green-400" />
              </div>
              <div className="text-2xl font-bold text-gray-900 dark:text-white">100+</div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Examples</div>
            </div>
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-12 h-12 bg-orange-100 dark:bg-orange-900 rounded-lg mb-3">
                <Users className="w-6 h-6 text-orange-600 dark:text-orange-400" />
              </div>
              <div className="text-2xl font-bold text-gray-900 dark:text-white">1</div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Developers</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};