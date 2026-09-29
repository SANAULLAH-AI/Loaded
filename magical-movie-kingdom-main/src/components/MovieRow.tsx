
import React, { useRef } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import MovieCard from './MovieCard';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface Movie {
  id: number;
  title?: string;
  name?: string;
  poster_path: string;
  backdrop_path?: string;
  media_type?: string;
  overview: string;
}

interface MovieRowProps {
  title: string;
  movies: Movie[];
  variant?: 'poster' | 'backdrop';
}

const MovieRow = ({ title, movies, variant = 'poster' }: MovieRowProps) => {
  const rowRef = useRef<HTMLDivElement>(null);
  
  const scroll = (direction: 'left' | 'right') => {
    const container = rowRef.current;
    if (!container) return;
    
    const scrollAmount = direction === 'left' 
      ? -container.clientWidth * 0.75 
      : container.clientWidth * 0.75;
    
    container.scrollBy({
      left: scrollAmount,
      behavior: 'smooth'
    });
  };
  
  if (!movies || movies.length === 0) {
    return null;
  }

  return (
    <div className="my-8">
      <h2 className="text-2xl font-bold mb-4 px-6">{title}</h2>
      
      <div className="relative group">
        {/* Scroll Buttons */}
        <Button 
          variant="ghost" 
          size="icon" 
          className="absolute left-0 top-1/2 -translate-y-1/2 z-10 opacity-0 group-hover:opacity-100 transition-opacity bg-black/50 rounded-full"
          onClick={() => scroll('left')}
        >
          <ChevronLeft className="h-6 w-6" />
        </Button>
        
        <Button 
          variant="ghost" 
          size="icon" 
          className="absolute right-0 top-1/2 -translate-y-1/2 z-10 opacity-0 group-hover:opacity-100 transition-opacity bg-black/50 rounded-full"
          onClick={() => scroll('right')}
        >
          <ChevronRight className="h-6 w-6" />
        </Button>
        
        {/* Movies Container */}
        <div 
          ref={rowRef}
          className={cn(
            "flex space-x-4 overflow-x-scroll pb-4 scrollbar-hide px-6",
            variant === 'backdrop' ? "snap-x snap-mandatory" : ""
          )}
          style={{ scrollbarWidth: 'none' }}
        >
          {movies.map((movie) => (
            <div 
              key={movie.id} 
              className={cn(
                "flex-shrink-0",
                variant === 'poster' ? "w-[150px]" : "w-[250px]",
                variant === 'backdrop' ? "snap-start" : ""
              )}
            >
              <MovieCard movie={movie} variant={variant} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default MovieRow;
