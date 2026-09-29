
import React, { useState, useEffect } from 'react';
import Header from '@/components/Header';
import MovieCard from '@/components/MovieCard';
import MovieRow from '@/components/MovieRow';
import BrandSection from '@/components/BrandSection';
import { fetchTrending, fetchByCompany } from '@/services/api';

const Index = () => {
  const [trendingMovies, setTrendingMovies] = useState([]);
  const [featuredMovie, setFeaturedMovie] = useState(null);
  const [disneyMovies, setDisneyMovies] = useState([]);
  const [pixarMovies, setPixarMovies] = useState([]);
  const [marvelMovies, setMarvelMovies] = useState([]);
  const [starWarsMovies, setStarWarsMovies] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        // Fetch trending movies
        const trendingData = await fetchTrending();
        setTrendingMovies(trendingData.results);
        
        // Set featured movie to a random trending movie with backdrop
        const moviesWithBackdrops = trendingData.results.filter(
          (movie) => movie.backdrop_path
        );
        const randomMovie = moviesWithBackdrops[
          Math.floor(Math.random() * moviesWithBackdrops.length)
        ];
        setFeaturedMovie(randomMovie);
        
        // Fetch movies by studio
        const disneyData = await fetchByCompany('disney');
        setDisneyMovies(disneyData.results);
        
        const pixarData = await fetchByCompany('pixar');
        setPixarMovies(pixarData.results);
        
        const marvelData = await fetchByCompany('marvel');
        setMarvelMovies(marvelData.results);
        
        const starWarsData = await fetchByCompany('starWars');
        setStarWarsMovies(starWarsData.results);
      } catch (error) {
        console.error('Error loading data:', error);
      } finally {
        setLoading(false);
      }
    };
    
    loadData();
  }, []);

  return (
    <div className="min-h-screen bg-disney-dark text-white">
      <Header />
      
      {/* Main Content with padding for header */}
      <main className="pt-20">
        {/* Featured Hero */}
        {featuredMovie && (
          <div className="px-6 py-2">
            <MovieCard movie={featuredMovie} variant="featured" />
          </div>
        )}
        
        {/* Brands Section */}
        <BrandSection />
        
        {/* Movie Rows */}
        {loading ? (
          <div className="flex justify-center items-center h-40">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-disney-blue"></div>
          </div>
        ) : (
          <>
            <MovieRow title="Trending Now" movies={trendingMovies} />
            <MovieRow title="Disney Movies" movies={disneyMovies} variant="backdrop" />
            <MovieRow title="Pixar Collection" movies={pixarMovies} />
            <MovieRow title="Marvel Universe" movies={marvelMovies} variant="backdrop" />
            <MovieRow title="Star Wars Saga" movies={starWarsMovies} />
          </>
        )}
      </main>
    </div>
  );
};

export default Index;
