import React from 'react';
import { CheatSheet } from '../data/cheatsheets';
import { ExternalLink, Clock, Users } from 'lucide-react';

interface CheatSheetCardProps {
  cheatSheet: CheatSheet;
  onClick: () => void;
}

export const CheatSheetCard: React.FC<CheatSheetCardProps> = ({ cheatSheet, onClick }) => {
  const IconComponent = cheatSheet.icon;

  return (
    <div
      onClick={onClick}
      className="group relative bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 hover:border-blue-300 dark:hover:border-blue-600 shadow-sm hover:shadow-lg transition-all duration-300 cursor-pointer overflow-hidden"
    >
      {/* Popular Badge */}
      {cheatSheet.popular && (
        <div className="absolute top-3 right-3 z-10">
          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-200">
            Popular
          </span>
        </div>
      )}

      {/* Header with Icon */}
      <div className={`${cheatSheet.bgColor} p-6 relative overflow-hidden`}>
        <div className="absolute top-0 right-0 w-32 h-32 transform translate-x-8 -translate-y-8 opacity-10">
          <IconComponent className="w-full h-full" />
        </div>
        <div className="relative z-10">
          <div className={`inline-flex items-center justify-center w-12 h-12 rounded-lg bg-white dark:bg-gray-800 shadow-sm mb-4`}>
            <IconComponent className={`w-6 h-6 ${cheatSheet.textColor}`} />
          </div>
          <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
            {cheatSheet.title}
          </h3>
          <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed">
            {cheatSheet.description}
          </p>
        </div>
      </div>

      {/* Content */}
      <div className="p-6">
        <div className="flex items-center justify-between mb-4">
          <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300">
            {cheatSheet.category}
          </span>
          <div className="flex items-center space-x-4 text-xs text-gray-500 dark:text-gray-400">
            <div className="flex items-center space-x-1">
              <Clock className="w-3 h-3" />
              <span>5 min read</span>
            </div>
            <div className="flex items-center space-x-1">
              <Users className="w-3 h-3" />
              <span>2.5k views</span>
            </div>
          </div>
        </div>

        {/* Sections Preview */}
        <div className="space-y-2 mb-4">
          {cheatSheet.sections.slice(0, 3).map((section, index) => (
            <div key={index} className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400">
              <div className="w-1.5 h-1.5 rounded-full bg-blue-500"></div>
              <span>{section.title}</span>
            </div>
          ))}
          {cheatSheet.sections.length > 3 && (
            <div className="flex items-center space-x-2 text-sm text-gray-500 dark:text-gray-500">
              <div className="w-1.5 h-1.5 rounded-full bg-gray-400"></div>
              <span>+{cheatSheet.sections.length - 3} more sections</span>
            </div>
          )}
        </div>

        {/* Action Button */}
        <button className="w-full flex items-center justify-center space-x-2 bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 py-2.5 px-4 rounded-lg hover:bg-blue-100 dark:hover:bg-blue-900/50 transition-colors group-hover:bg-blue-600 group-hover:text-white">
          <span className="font-medium">View Cheatsheet</span>
          <ExternalLink className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
        </button>
      </div>
    </div>
  );
};