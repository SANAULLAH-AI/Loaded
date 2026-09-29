
import React from 'react';
import { Link } from 'react-router-dom';
import { Play, Heart, Plus, Download } from 'lucide-react';
import { IMAGE_BASE_URL, addToFavorites, addToHistory, simulateDownload } from '@/services/api';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';

interface MovieCardProps {
  movie: {
    id: number;
    title?: string;
    name?: string;
    poster_path: string;
    backdrop_path?: string;
    media_type?: string;
    overview: string;
  };
  variant?: 'poster' | 'backdrop' | 'featured';
}

const MovieCard = ({ movie, variant = 'poster' }: MovieCardProps) => {
  const { toast } = useToast();
  const title = movie.title || movie.name || 'Untitled';
  const mediaType = movie.media_type || 'movie';
  const imagePath = 
    variant === 'backdrop' 
      ? movie.backdrop_path 
      : movie.poster_path;
  
  const imageSrc = imagePath 
    ? `${IMAGE_BASE_URL}${imagePath}`
    : 'https://via.placeholder.com/300x450?text=No+Image';

  const handleFavorite = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (addToFavorites(movie)) {
      toast({
        title: "Added to Favorites",
        description: `${title} has been added to your favorites`,
      });
    } else {
      toast({
        title: "Already in Favorites",
        description: `${title} is already in your favorites`,
      });
    }
  };

  const handleWatchlist = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    toast({
      title: "Added to Watchlist",
      description: `${title} has been added to your watchlist`,
    });
  };

  const handleDownload = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (simulateDownload(movie)) {
      toast({
        title: "Downloaded",
        description: `${title} has been downloaded for offline viewing`,
      });
    } else {
      toast({
        title: "Already Downloaded",
        description: `${title} has already been downloaded`,
      });
    }
  };

  const handleMovieClick = () => {
    addToHistory(movie);
  };

  // Featured variant (large hero)
  if (variant === 'featured') {
    return (
      <div className="relative w-full h-[60vh] overflow-hidden rounded-lg">
        <img 
          src={movie.backdrop_path ? `${IMAGE_BASE_URL}${movie.backdrop_path}` : imageSrc}
          alt={title}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-disney-dark to-transparent" />
        <div className="absolute bottom-0 left-0 p-6 w-full">
          <h2 className="text-4xl font-bold mb-2">{title}</h2>
          <p className="text-sm text-gray-300 mb-4 max-w-xl line-clamp-2">{movie.overview}</p>
          <div className="flex space-x-3">
            <Link 
              to={`/${mediaType}/${movie.id}`}
              onClick={handleMovieClick}
            >
              <Button className="flex items-center">
                <Play size={16} className="mr-2" />
                Play
              </Button>
            </Link>
            <Button variant="outline" onClick={handleFavorite}>
              <Heart size={16} className="mr-2" />
              Favorite
            </Button>
            <Button variant="outline" onClick={handleWatchlist}>
              <Plus size={16} className="mr-2" />
              Watchlist
            </Button>
          </div>
        </div>
      </div>
    );
  }

  // Backdrop variant (wide card)
  if (variant === 'backdrop') {
    return (
      <Link 
        to={`/${mediaType}/${movie.id}`}
        className="movie-card block rounded-md overflow-hidden relative group"
        onClick={handleMovieClick}
      >
        <img 
          src={imageSrc} 
          alt={title}
          className="w-full h-[120px] object-cover"
        />
        <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-60 transition-all duration-300 flex items-center justify-center opacity-0 group-hover:opacity-100">
          <div className="flex space-x-2">
            <Button size="icon" variant="ghost" onClick={handleFavorite}>
              <Heart size={16} className="text-white" />
            </Button>
            <Button size="icon" variant="ghost" onClick={handleWatchlist}>
              <Plus size={16} className="text-white" />
            </Button>
            <Button size="icon" variant="ghost" onClick={handleDownload}>
              <Download size={16} className="text-white" />
            </Button>
          </div>
        </div>
        <div className="p-2 bg-disney-gray">
          <h3 className="text-sm font-medium truncate">{title}</h3>
        </div>
      </Link>
    );
  }

  // Default poster variant
  return (
    <Link 
      to={`/${mediaType}/${movie.id}`}
      className="movie-card block rounded-md overflow-hidden relative group"
      onClick={handleMovieClick}
    >
      <img 
        src={imageSrc} 
        alt={title}
        className="w-full h-auto aspect-[2/3] object-cover"
      />
      <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-60 transition-all duration-300 flex items-center justify-center opacity-0 group-hover:opacity-100">
        <div className="flex flex-col space-y-2">
          <Button size="icon" variant="ghost" onClick={handleFavorite}>
            <Heart size={16} className="text-white" />
          </Button>
          <Button size="icon" variant="ghost" onClick={handleWatchlist}>
            <Plus size={16} className="text-white" />
          </Button>
          <Button size="icon" variant="ghost" onClick={handleDownload}>
            <Download size={16} className="text-white" />
          </Button>
        </div>
      </div>
      <div className="p-2 bg-disney-gray">
        <h3 className="text-sm font-medium truncate">{title}</h3>
      </div>
    </Link>
  );
};

export default MovieCard;
