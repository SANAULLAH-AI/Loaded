import React, { useState } from 'react';
import { CheatSheet } from '../data/cheatsheets';
import { ArrowLeft, Copy, Check, ExternalLink, Download, Share2 } from 'lucide-react';

interface CheatSheetDetailProps {
  cheatSheet: CheatSheet;
  onBack: () => void;
}

export const CheatSheetDetail: React.FC<CheatSheetDetailProps> = ({ cheatSheet, onBack }) => {
  const [copiedCode, setCopiedCode] = useState<string | null>(null);
  const [activeSection, setActiveSection] = useState<string>(cheatSheet.sections[0]?.title || '');

  const IconComponent = cheatSheet.icon;

  const copyToClipboard = async (code: string, id: string) => {
    try {
      await navigator.clipboard.writeText(code);
      setCopiedCode(id);
      setTimeout(() => setCopiedCode(null), 2000);
    } catch (err) {
      console.error('Failed to copy code:', err);
    }
  };

  const scrollToSection = (sectionTitle: string) => {
    setActiveSection(sectionTitle);
    const element = document.getElementById(sectionTitle.replace(/\s+/g, '-').toLowerCase());
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <div className={`${cheatSheet.bgColor} border-b border-gray-200 dark:border-gray-700`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <button
                onClick={onBack}
                className="flex items-center space-x-2 text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors"
              >
                <ArrowLeft className="w-5 h-5" />
                <span className="font-medium">Back</span>
              </button>
              <div className="h-6 w-px bg-gray-300 dark:bg-gray-600"></div>
              <div className="flex items-center space-x-3">
                <div className={`inline-flex items-center justify-center w-12 h-12 rounded-lg bg-white dark:bg-gray-800 shadow-sm`}>
                  <IconComponent className={`w-6 h-6 ${cheatSheet.textColor}`} />
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                    {cheatSheet.title} Cheatsheet
                  </h1>
                  <p className="text-gray-600 dark:text-gray-300">
                    {cheatSheet.description}
                  </p>
                </div>
              </div>
            </div>
            
            <div className="flex items-center space-x-3">
              <button className="flex items-center space-x-2 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 px-4 py-2 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors border border-gray-200 dark:border-gray-600">
                <Share2 className="w-4 h-4" />
                <span className="hidden sm:inline">Share</span>
              </button>
              <button className="flex items-center space-x-2 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 px-4 py-2 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors border border-gray-200 dark:border-gray-600">
                <Download className="w-4 h-4" />
                <span className="hidden sm:inline">Download</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Table of Contents */}
          <div className="lg:w-64 flex-shrink-0">
            <div className="sticky top-24">
              <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                  Table of Contents
                </h3>
                <nav className="space-y-2">
                  {cheatSheet.sections.map((section) => (
                    <button
                      key={section.title}
                      onClick={() => scrollToSection(section.title)}
                      className={`block w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${
                        activeSection === section.title
                          ? 'bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 font-medium'
                          : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-50 dark:hover:bg-gray-700'
                      }`}
                    >
                      {section.title}
                    </button>
                  ))}
                </nav>
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="flex-1 space-y-8">
            {cheatSheet.sections.map((section) => (
              <section
                key={section.title}
                id={section.title.replace(/\s+/g, '-').toLowerCase()}
                className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden"
              >
                <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
                  <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                    {section.title}
                  </h2>
                </div>

                <div className="p-6 space-y-6">
                  {section.content.map((item, index) => (
                    <div key={index} className="space-y-4">
                      {item.subtitle && (
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                          {item.subtitle}
                        </h3>
                      )}
                      
                      {item.description && (
                        <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                          {item.description}
                        </p>
                      )}

                      {item.code && (
                        <div className="relative">
                          <div className="flex items-center justify-between bg-gray-100 dark:bg-gray-700 px-4 py-2 rounded-t-lg">
                            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                              Code Example
                            </span>
                            <button
                              onClick={() => copyToClipboard(item.code!, `${section.title}-${index}`)}
                              className="flex items-center space-x-1 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
                            >
                              {copiedCode === `${section.title}-${index}` ? (
                                <>
                                  <Check className="w-4 h-4 text-green-500" />
                                  <span className="text-sm text-green-500">Copied!</span>
                                </>
                              ) : (
                                <>
                                  <Copy className="w-4 h-4" />
                                  <span className="text-sm">Copy</span>
                                </>
                              )}
                            </button>
                          </div>
                          <pre className="bg-gray-900 dark:bg-gray-950 text-gray-100 p-4 rounded-b-lg overflow-x-auto">
                            <code>{item.code}</code>
                          </pre>
                        </div>
                      )}

                      {item.examples && (
                        <div className="space-y-4">
                          {item.examples.map((example, exampleIndex) => (
                            <div key={exampleIndex} className="border border-gray-200 dark:border-gray-600 rounded-lg overflow-hidden">
                              <div className="bg-gray-50 dark:bg-gray-700 px-4 py-2 border-b border-gray-200 dark:border-gray-600">
                                <h4 className="font-medium text-gray-900 dark:text-white">
                                  {example.title}
                                </h4>
                                {example.description && (
                                  <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                                    {example.description}
                                  </p>
                                )}
                              </div>
                              <div className="relative">
                                <button
                                  onClick={() => copyToClipboard(example.code, `${section.title}-${index}-${exampleIndex}`)}
                                  className="absolute top-2 right-2 flex items-center space-x-1 text-gray-400 hover:text-gray-200 transition-colors"
                                >
                                  {copiedCode === `${section.title}-${index}-${exampleIndex}` ? (
                                    <Check className="w-4 h-4 text-green-400" />
                                  ) : (
                                    <Copy className="w-4 h-4" />
                                  )}
                                </button>
                                <pre className="bg-gray-900 dark:bg-gray-950 text-gray-100 p-4 overflow-x-auto">
                                  <code>{example.code}</code>
                                </pre>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}

                      {item.items && (
                        <div className="grid gap-3">
                          {item.items.map((listItem, itemIndex) => (
                            <div key={itemIndex} className="border border-gray-200 dark:border-gray-600 rounded-lg p-4 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                              <div className="flex items-start space-x-3">
                                <div className="flex-shrink-0 w-2 h-2 rounded-full bg-blue-500 mt-2"></div>
                                <div className="flex-1 min-w-0">
                                  <h4 className="font-mono text-sm font-medium text-gray-900 dark:text-white break-all">
                                    {listItem.name}
                                  </h4>
                                  <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                                    {listItem.description}
                                  </p>
                                  {listItem.example && (
                                    <div className="mt-2">
                                      <code className="text-xs bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200 px-2 py-1 rounded">
                                        {listItem.example}
                                      </code>
                                    </div>
                                  )}
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </section>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};