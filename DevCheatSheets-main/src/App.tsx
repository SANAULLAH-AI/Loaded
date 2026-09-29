import React, { useState, useMemo } from 'react';
import { Header } from './components/Header';
import { Hero } from './components/Hero';
import { CheatSheetCard } from './components/CheatSheetCard';
import { CheatSheetDetail } from './components/CheatSheetDetail';
import { CategoryFilter } from './components/CategoryFilter';
import { Footer } from './components/Footer';
import { cheatSheets, popularCheatSheets, CheatSheet } from './data/cheatsheets';
import { Star, TrendingUp } from 'lucide-react';

function App() {
  const [selectedCheatSheet, setSelectedCheatSheet] = useState<CheatSheet | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const filteredCheatSheets = useMemo(() => {
    return cheatSheets.filter(sheet => {
      const matchesSearch = sheet.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           sheet.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           sheet.category.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory = selectedCategory === 'All' || sheet.category === selectedCategory;
      return matchesSearch && matchesCategory;
    });
  }, [searchTerm, selectedCategory]);

  if (selectedCheatSheet) {
    return (
      <CheatSheetDetail
        cheatSheet={selectedCheatSheet}
        onBack={() => setSelectedCheatSheet(null)}
      />
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Header
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        onMenuToggle={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        isMobileMenuOpen={isMobileMenuOpen}
      />
      
      <Hero />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Popular Cheatsheets Section */}
        <section id="popular" className="mb-16">
          <div className="flex items-center space-x-3 mb-8">
            <div className="flex items-center justify-center w-10 h-10 bg-yellow-100 dark:bg-yellow-900 rounded-lg">
              <Star className="w-5 h-5 text-yellow-600 dark:text-yellow-400" />
            </div>
            <div>
              <h2 className="text-3xl font-bold text-gray-900 dark:text-white">
                Popular Cheatsheets
              </h2>
              <p className="text-gray-600 dark:text-gray-400">
                Most viewed and loved by the community
              </p>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {popularCheatSheets.map((sheet) => (
              <CheatSheetCard
                key={sheet.id}
                cheatSheet={sheet}
                onClick={() => setSelectedCheatSheet(sheet)}
              />
            ))}
          </div>
        </section>

        {/* All Cheatsheets Section */}
        <section id="categories">
          <div className="flex items-center space-x-3 mb-8">
            <div className="flex items-center justify-center w-10 h-10 bg-blue-100 dark:bg-blue-900 rounded-lg">
              <TrendingUp className="w-5 h-5 text-blue-600 dark:text-blue-400" />
            </div>
            <div>
              <h2 className="text-3xl font-bold text-gray-900 dark:text-white">
                All Cheatsheets
              </h2>
              <p className="text-gray-600 dark:text-gray-400">
                Browse by category or search for specific topics
              </p>
            </div>
          </div>

          <CategoryFilter
            selectedCategory={selectedCategory}
            onCategoryChange={setSelectedCategory}
          />

          {filteredCheatSheets.length === 0 ? (
            <div className="text-center py-16">
              <div className="text-gray-400 dark:text-gray-500 mb-4">
                <svg className="mx-auto h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 12h6m-6-4h6m2 5.291A7.962 7.962 0 0112 15c-2.34 0-4.47-.881-6.08-2.33" />
                </svg>
              </div>
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                No cheatsheets found
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                Try adjusting your search terms or category filter.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredCheatSheets.map((sheet) => (
                <CheatSheetCard
                  key={sheet.id}
                  cheatSheet={sheet}
                  onClick={() => setSelectedCheatSheet(sheet)}
                />
              ))}
            </div>
          )}
        </section>
      </main>

      <Footer />
    </div>
  );
}

export default App;