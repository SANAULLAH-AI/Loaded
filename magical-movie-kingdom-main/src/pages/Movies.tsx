
import React, { useEffect, useState } from 'react';
import Header from '@/components/Header';
import { fetchByCompany } from '@/services/api';
import MovieRow from '@/components/MovieRow';

const Movies = () => {
  const [loading, setLoading] = useState(true);
  const [movies, setMovies] = useState<any[]>([]);
  
  useEffect(() => {
    const loadMovies = async () => {
      try {
        setLoading(true);
        // Fetch Disney movies
        const disneyMovies = await fetchByCompany('disney');
        setMovies(disneyMovies.results || []);
      } catch (error) {
        console.error("Error loading movies:", error);
      } finally {
        setLoading(false);
      }
    };
    
    loadMovies();
  }, []);

  return (
    <div className="min-h-screen bg-disney-dark pb-20">
      <Header />
      
      <div className="pt-24 container mx-auto px-6">
        <h1 className="text-3xl font-bold mb-8">Movies</h1>
        
        {loading ? (
          <div className="flex justify-center">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        ) : (
          <MovieRow title="Disney Movies" movies={movies} />
        )}
      </div>
    </div>
  );
};

export default Movies;
