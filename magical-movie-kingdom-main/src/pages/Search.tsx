
import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { searchContent } from '@/services/api';
import Header from '@/components/Header';
import MovieCard from '@/components/MovieCard';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search as SearchIcon } from 'lucide-react';

const Search = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const query = searchParams.get('q') || '';
  const [searchResults, setSearchResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchInput, setSearchInput] = useState(query);

  useEffect(() => {
    const performSearch = async () => {
      if (query) {
        setLoading(true);
        try {
          const results = await searchContent(query);
          setSearchResults(results.results);
        } catch (error) {
          console.error('Search error:', error);
          setSearchResults([]);
        } finally {
          setLoading(false);
        }
      }
    };

    performSearch();
  }, [query]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchInput.trim()) {
      setSearchParams({ q: searchInput });
    }
  };

  // Group results by media type
  const movieResults = searchResults.filter(item => item.media_type === 'movie');
  const tvResults = searchResults.filter(item => item.media_type === 'tv');
  const personResults = searchResults.filter(item => item.media_type === 'person');

  return (
    <div className="min-h-screen bg-disney-dark">
      <Header />
      
      <div className="container mx-auto px-6 pt-24 pb-12">
        <h1 className="text-3xl font-bold mb-6">Search</h1>
        
        <form onSubmit={handleSearch} className="mb-8 flex gap-2">
          <Input
            type="text"
            placeholder="Search for movies, shows, or people..."
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            className="flex-grow bg-disney-gray/50 border-disney-gray"
          />
          <Button type="submit">
            <SearchIcon size={16} className="mr-2" />
            Search
          </Button>
        </form>
        
        {loading ? (
          <div className="flex justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-disney-blue"></div>
          </div>
        ) : (
          <>
            {!query ? (
              <div className="text-center py-12">
                <p className="text-gray-400">Enter a search term to find movies, TV shows, and more</p>
              </div>
            ) : searchResults.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-gray-400">No results found for "{query}"</p>
                <p className="text-sm mt-2">Try different keywords or check your spelling</p>
              </div>
            ) : (
              <div>
                <p className="mb-4 text-gray-400">Found {searchResults.length} results for "{query}"</p>
                
                {movieResults.length > 0 && (
                  <div className="mb-8">
                    <h2 className="text-2xl font-bold mb-4">Movies</h2>
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
                      {movieResults.map((movie) => (
                        <MovieCard key={movie.id} movie={movie} />
                      ))}
                    </div>
                  </div>
                )}
                
                {tvResults.length > 0 && (
                  <div className="mb-8">
                    <h2 className="text-2xl font-bold mb-4">TV Shows</h2>
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
                      {tvResults.map((show) => (
                        <MovieCard key={show.id} movie={show} />
                      ))}
                    </div>
                  </div>
                )}
                
                {personResults.length > 0 && (
                  <div className="mb-8">
                    <h2 className="text-2xl font-bold mb-4">People</h2>
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
                      {personResults.map((person) => (
                        <div key={person.id} className="text-center">
                          <div className="aspect-square rounded-full overflow-hidden mb-2">
                            {person.profile_path ? (
                              <img
                                src={`https://image.tmdb.org/t/p/w500${person.profile_path}`}
                                alt={person.name}
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <div className="w-full h-full bg-disney-gray flex items-center justify-center">
                                <span className="text-2xl font-bold text-disney-white">
                                  {person.name?.charAt(0)}
                                </span>
                              </div>
                            )}
                          </div>
                          <p className="font-medium">{person.name}</p>
                          <p className="text-sm text-gray-400">
                            {person.known_for_department || 'Actor'}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default Search;
