
import React, { useEffect, useState } from 'react';
import Header from '@/components/Header';
import { fetchTrending } from '@/services/api';
import MovieRow from '@/components/MovieRow';

const Series = () => {
  const [loading, setLoading] = useState(true);
  const [series, setSeries] = useState<any[]>([]);
  
  useEffect(() => {
    const loadSeries = async () => {
      try {
        setLoading(true);
        // Fetch trending content and filter for TV shows
        const trending = await fetchTrending();
        const tvSeries = trending.results?.filter((item: any) => item.media_type === 'tv') || [];
        setSeries(tvSeries);
      } catch (error) {
        console.error("Error loading series:", error);
      } finally {
        setLoading(false);
      }
    };
    
    loadSeries();
  }, []);

  return (
    <div className="min-h-screen bg-disney-dark pb-20">
      <Header />
      
      <div className="pt-24 container mx-auto px-6">
        <h1 className="text-3xl font-bold mb-8">TV Series</h1>
        
        {loading ? (
          <div className="flex justify-center">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        ) : (
          <MovieRow title="Popular TV Series" movies={series} />
        )}
      </div>
    </div>
  );
};

export default Series;
