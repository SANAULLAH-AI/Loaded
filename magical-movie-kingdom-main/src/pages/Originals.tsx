
import React, { useEffect, useState } from 'react';
import Header from '@/components/Header';
import { fetchByCompany } from '@/services/api';
import MovieRow from '@/components/MovieRow';

const Originals = () => {
  const [loading, setLoading] = useState(true);
  const [marvelContent, setMarvelContent] = useState<any[]>([]);
  const [starWarsContent, setStarWarsContent] = useState<any[]>([]);
  
  useEffect(() => {
    const loadContent = async () => {
      try {
        setLoading(true);
        // Fetch Marvel and Star Wars content as examples of originals
        const marvel = await fetchByCompany('marvel');
        const starWars = await fetchByCompany('starWars');
        
        setMarvelContent(marvel.results || []);
        setStarWarsContent(starWars.results || []);
      } catch (error) {
        console.error("Error loading originals:", error);
      } finally {
        setLoading(false);
      }
    };
    
    loadContent();
  }, []);

  return (
    <div className="min-h-screen bg-disney-dark pb-20">
      <Header />
      
      <div className="pt-24 container mx-auto px-6">
        <h1 className="text-3xl font-bold mb-8">Disney+ Originals</h1>
        
        {loading ? (
          <div className="flex justify-center">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        ) : (
          <>
            <MovieRow title="Marvel Originals" movies={marvelContent} />
            <MovieRow title="Star Wars Originals" movies={starWarsContent} />
          </>
        )}
      </div>
    </div>
  );
};

export default Originals;
