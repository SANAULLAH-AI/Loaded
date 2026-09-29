
import React from 'react';
import Header from '@/components/Header';
import MovieCard from '@/components/MovieCard';
import { Button } from '@/components/ui/button';
import { Download, Film } from 'lucide-react';
import { getFromStorage, DOWN_KEY } from '@/services/api';
import { useNavigate } from 'react-router-dom';

const Downloads = () => {
  const downloads = getFromStorage(DOWN_KEY) || [];
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-disney-dark">
      <Header />
      
      <div className="pt-24 container mx-auto px-6 pb-12">
        <div className="flex items-center mb-8">
          <Download className="mr-3 h-6 w-6" />
          <h1 className="text-3xl font-bold">Downloads</h1>
        </div>
        
        {downloads.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <Film className="h-16 w-16 text-disney-gray mb-6" />
            <h2 className="text-2xl font-bold mb-2">No Downloads Yet</h2>
            <p className="text-gray-400 mb-6 max-w-md">
              Your downloaded movies and shows will appear here so you can watch them offline
            </p>
            <Button onClick={() => navigate('/')}>Browse Content</Button>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {downloads.map((movie: any) => (
              <MovieCard key={movie.id} movie={movie} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Downloads;
