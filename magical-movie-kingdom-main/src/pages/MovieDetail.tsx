import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Play, Plus, Download, Heart, Share2, Star, User } from 'lucide-react';
import { fetchMovieDetails, fetchTVDetails, BACKDROP_BASE_URL, IMAGE_BASE_URL, addToFavorites, simulateDownload } from '@/services/api';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import Header from '@/components/Header';
import VideoPlayer from '@/components/VideoPlayer';
import MovieRow from '@/components/MovieRow';
import { useToast } from '@/components/ui/use-toast';

const MovieDetail = () => {
  const { id, mediaType = 'movie' } = useParams();
  const [content, setContent] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [relatedContent, setRelatedContent] = useState([]);
  const [trailerKey, setTrailerKey] = useState('');
  const [showFullDescription, setShowFullDescription] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        setError(null);
        
        let data;
        if (mediaType === 'tv') {
          data = await fetchTVDetails(id!);
        } else {
          data = await fetchMovieDetails(id!);
        }
        
        setContent(data);
        
        // Find trailer
        if (data.videos && data.videos.results) {
          const trailer = data.videos.results.find(
            (video: any) => video.type === 'Trailer' && video.site === 'YouTube'
          );
          setTrailerKey(trailer ? trailer.key : '');
        }
        
        // Set related content
        if (data.credits && data.credits.cast) {
          setRelatedContent(
            data.credits.cast
              .filter((cast: any) => cast.profile_path)
              .slice(0, 10)
              .map((cast: any) => ({
                id: cast.id,
                name: cast.name,
                poster_path: cast.profile_path,
                media_type: 'person',
                character: cast.character,
              }))
          );
        }
      } catch (err) {
        console.error('Error loading movie details:', err);
        setError('Failed to load content details. Please try again later.');
      } finally {
        setLoading(false);
      }
    };
    
    if (id) {
      loadData();
    }
  }, [id, mediaType]);

  const handleBack = () => {
    navigate(-1);
  };
  
  const handleAddToFavorites = () => {
    if (addToFavorites(content)) {
      toast({
        title: "Added to Favorites",
        description: `${content.title || content.name} has been added to your favorites`,
      });
    } else {
      toast({
        title: "Already in Favorites",
        description: `${content.title || content.name} is already in your favorites`,
      });
    }
  };
  
  const handleDownload = () => {
    if (simulateDownload(content)) {
      toast({
        title: "Downloaded",
        description: `${content.title || content.name} has been downloaded for offline viewing`,
      });
    } else {
      toast({
        title: "Already Downloaded",
        description: `${content.title || content.name} has already been downloaded`,
      });
    }
  };
  
  const handleAddToWatchlist = () => {
    toast({
      title: "Added to Watchlist",
      description: `${content.title || content.name} has been added to your watchlist`,
    });
  };
  
  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    toast({
      title: "Link Copied",
      description: "Share link copied to clipboard",
    });
  };

  if (loading) {
    return (
      <div>
        <Header />
        <div className="pt-24 flex justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-disney-blue"></div>
        </div>
      </div>
    );
  }

  if (error || !content) {
    return (
      <div>
        <Header />
        <div className="pt-24 text-center">
          <h3 className="text-2xl">{error || 'Content not found'}</h3>
          <Button onClick={handleBack} className="mt-4">
            <ArrowLeft className="mr-2 h-4 w-4" /> Go Back
          </Button>
        </div>
      </div>
    );
  }

  const title = content.title || content.name;
  const backdropUrl = content.backdrop_path 
    ? `${BACKDROP_BASE_URL}${content.backdrop_path}`
    : null;
  const posterUrl = content.poster_path 
    ? `${IMAGE_BASE_URL}${content.poster_path}`
    : 'https://via.placeholder.com/300x450?text=No+Image';
  
  // Format runtime
  const formatRuntime = (minutes: number) => {
    if (!minutes) return 'N/A';
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours}h ${mins}m`;
  };
  
  const runtime = content.runtime 
    ? formatRuntime(content.runtime) 
    : content.episode_run_time && content.episode_run_time[0]
      ? formatRuntime(content.episode_run_time[0])
      : 'N/A';

  return (
    <div className="min-h-screen bg-disney-dark">
      <Header />
      
      {/* Back Button */}
      <div className="fixed left-6 top-24 z-10">
        <Button variant="ghost" onClick={() => navigate(-1)}>
          <ArrowLeft className="h-5 w-5 mr-1" />
          Back
        </Button>
      </div>
      
      {/* Hero section */}
      <div
        className="relative min-h-[60vh] pt-16 flex flex-col justify-end bg-cover bg-center"
        style={{
          backgroundImage: backdropUrl 
            ? `url(${backdropUrl})` 
            : undefined,
          backgroundColor: '#1a1d29'
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-t from-disney-dark via-disney-dark/80 to-transparent" />
        
        <div className="relative z-10 container mx-auto px-6 py-8 pt-20">
          <div className="flex flex-col md:flex-row">
            {/* Poster */}
            <div className="flex-shrink-0 md:w-64">
              <img
                src={posterUrl}
                alt={title}
                className="w-full h-auto rounded-lg shadow-lg"
              />
            </div>
            
            {/* Details */}
            <div className="md:ml-8 mt-6 md:mt-0">
              <h1 className="text-4xl font-bold">{title}</h1>
              
              <div className="mt-2 flex flex-wrap gap-2">
                {content.release_date && (
                  <Badge variant="outline">{new Date(content.release_date).getFullYear()}</Badge>
                )}
                {content.first_air_date && (
                  <Badge variant="outline">{new Date(content.first_air_date).getFullYear()}</Badge>
                )}
                <Badge variant="outline">{runtime}</Badge>
                {content.vote_average && (
                  <Badge className="flex items-center">
                    <Star className="h-3 w-3 mr-1 fill-yellow-400 stroke-yellow-400" />
                    {content.vote_average.toFixed(1)}
                  </Badge>
                )}
                
                {content.genres &&
                  content.genres.map((genre: { id: number; name: string }) => (
                    <Badge key={genre.id} variant="secondary">
                      {genre.name}
                    </Badge>
                  ))}
              </div>
              
              <p className="mt-4 text-gray-300">
                {showFullDescription
                  ? content.overview
                  : content.overview?.length > 250
                  ? `${content.overview.substring(0, 250)}...`
                  : content.overview}
                {content.overview?.length > 250 && (
                  <button
                    onClick={() => setShowFullDescription(!showFullDescription)}
                    className="ml-2 text-primary hover:underline"
                  >
                    {showFullDescription ? 'Show Less' : 'Read More'}
                  </button>
                )}
              </p>
              
              <div className="mt-6 flex flex-wrap gap-3">
                <Button className="flex items-center">
                  <Play className="h-4 w-4 mr-2" />
                  Play
                </Button>
                
                <Button variant="outline" onClick={handleAddToFavorites}>
                  <Heart className="h-4 w-4 mr-2" />
                  Favorite
                </Button>
                
                <Button variant="outline" onClick={handleAddToWatchlist}>
                  <Plus className="h-4 w-4 mr-2" />
                  Watchlist
                </Button>
                
                <Button variant="outline" onClick={handleDownload}>
                  <Download className="h-4 w-4 mr-2" />
                  Download
                </Button>
                
                <Button variant="outline" onClick={handleShare}>
                  <Share2 className="h-4 w-4 mr-2" />
                  Share
                </Button>
              </div>
              
              {/* Additional Details */}
              {content.tagline && (
                <p className="mt-4 text-lg italic text-gray-400">"{content.tagline}"</p>
              )}
              
              {/* Director */}
              {content.credits?.crew && (
                <div className="mt-4">
                  <span className="text-gray-400">
                    Director:{" "}
                    {content.credits.crew
                      .filter((c: any) => c.job === "Director")
                      .map((d: any) => d.name)
                      .join(", ") || "Unknown"}
                  </span>
                </div>
              )}
              
              {/* Cast */}
              {content.credits?.cast && (
                <div className="mt-2">
                  <span className="text-gray-400">
                    Starring:{" "}
                    {content.credits.cast
                      .slice(0, 5)
                      .map((c: any) => c.name)
                      .join(", ")}
                    {content.credits.cast.length > 5 ? ", ..." : ""}
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      
      {/* Trailer */}
      <div className="container mx-auto px-6 py-8">
        <h2 className="text-2xl font-bold mb-4">Trailer</h2>
        <VideoPlayer 
          videoId={trailerKey} 
          title={`${title} Trailer`}
          poster={backdropUrl}
        />
      </div>
      
      {/* Cast */}
      {content.credits?.cast && content.credits.cast.length > 0 && (
        <div className="container mx-auto px-6 py-8">
          <h2 className="text-2xl font-bold mb-4">Cast</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {content.credits.cast.slice(0, 12).map((person: any) => (
              <div key={person.id} className="text-center">
                <div className="aspect-square rounded-full overflow-hidden mb-2">
                  {person.profile_path ? (
                    <img
                      src={`${IMAGE_BASE_URL}${person.profile_path}`}
                      alt={person.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full bg-disney-gray flex items-center justify-center">
                      <User className="h-12 w-12 text-gray-400" />
                    </div>
                  )}
                </div>
                <p className="font-medium">{person.name}</p>
                <p className="text-sm text-gray-400">{person.character}</p>
              </div>
            ))}
          </div>
        </div>
      )}
      
      {/* Similar Content */}
      {relatedContent.length > 0 && (
        <div className="container mx-auto px-6 py-8">
          <h2 className="text-2xl font-bold mb-4">More Like This</h2>
          <MovieRow 
            title="" 
            movies={content.similar?.results || []} 
            variant="poster" 
          />
        </div>
      )}
    </div>
  );
};

export default MovieDetail;
