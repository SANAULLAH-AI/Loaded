
import React, { useEffect, useState } from 'react';
import { Play, X, Maximize, Volume2, VolumeX } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';

interface VideoPlayerProps {
  videoId?: string;
  title: string;
  poster?: string;
  autoplay?: boolean;
}

const VideoPlayer = ({ videoId, title, poster, autoplay = false }: VideoPlayerProps) => {
  const [isPlaying, setIsPlaying] = useState(autoplay);
  const [isLoaded, setIsLoaded] = useState(false);
  const [isMuted, setIsMuted] = useState(true);
  const [showControls, setShowControls] = useState(true);
  const [isFullscreen, setIsFullscreen] = useState(false);
  
  const containerRef = React.useRef<HTMLDivElement>(null);

  // Autoplay the video when videoId changes
  useEffect(() => {
    if (videoId && autoplay) {
      setIsPlaying(true);
    } else {
      setIsPlaying(false);
    }
    setIsLoaded(false);
  }, [videoId, autoplay]);

  // Hide controls after a delay
  useEffect(() => {
    if (isPlaying) {
      const timer = setTimeout(() => {
        setShowControls(false);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [isPlaying, showControls]);

  const handlePlayPause = () => {
    setIsPlaying(!isPlaying);
    setShowControls(true);
  };

  const toggleMute = () => {
    setIsMuted(!isMuted);
    setShowControls(true);
  };

  const handleFullscreen = () => {
    if (!document.fullscreenElement && containerRef.current) {
      containerRef.current.requestFullscreen().catch(err => {
        console.error(`Error attempting to enable full-screen mode: ${err.message}`);
      });
      setIsFullscreen(true);
    } else {
      document.exitFullscreen();
      setIsFullscreen(false);
    }
    setShowControls(true);
  };

  const handleMouseMove = () => {
    setShowControls(true);
  };

  // If no video ID is provided, open YouTube in a new tab
  const openYouTubeVideo = () => {
    if (videoId) {
      window.open(`https://www.youtube.com/watch?v=${videoId}`, '_blank');
    }
  };

  // If no video ID is provided, show a placeholder with the poster
  if (!videoId) {
    return (
      <div 
        className="relative w-full aspect-video bg-disney-gray rounded-lg overflow-hidden flex items-center justify-center"
        style={{ backgroundImage: poster ? `url(${poster})` : undefined, backgroundSize: 'cover' }}
      >
        <div className="absolute inset-0 bg-black bg-opacity-50" />
        <Button 
          variant="outline" 
          size="lg" 
          className="z-10"
          disabled
        >
          <Play className="mr-2 h-6 w-6" />
          No Trailer Available
        </Button>
      </div>
    );
  }

  return (
    <div 
      ref={containerRef}
      className="relative w-full aspect-video bg-black rounded-lg overflow-hidden"
      onMouseMove={handleMouseMove}
    >
      {!isLoaded && (
        <div className="absolute inset-0 flex items-center justify-center">
          <Skeleton className="w-full h-full" />
        </div>
      )}
      
      {!isPlaying ? (
        <div className="absolute inset-0 flex items-center justify-center">
          {poster && (
            <img 
              src={poster} 
              alt={title} 
              className="w-full h-full object-cover"
            />
          )}
          <div className="absolute inset-0 bg-black bg-opacity-40" />
          <div className="z-10 flex space-x-4">
            <Button 
              variant="outline" 
              size="lg" 
              onClick={handlePlayPause}
            >
              <Play className="mr-2 h-6 w-6" />
              Play Trailer In-App
            </Button>
            <Button 
              variant="outline" 
              size="lg"  
              onClick={openYouTubeVideo}
            >
              <Play className="mr-2 h-6 w-6" />
              Watch on YouTube
            </Button>
          </div>
        </div>
      ) : (
        <iframe
          src={`https://www.youtube.com/embed/${videoId}?autoplay=${isPlaying ? 1 : 0}&mute=${isMuted ? 1 : 0}&controls=0&showinfo=0&rel=0&iv_load_policy=3&modestbranding=1`}
          title={title}
          className="w-full h-full"
          frameBorder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          onLoad={() => setIsLoaded(true)}
        />
      )}

      {/* Custom Controls Overlay */}
      {isPlaying && (
        <div 
          className={`absolute inset-0 transition-opacity duration-300 ${showControls ? 'opacity-100' : 'opacity-0'}`}
          onMouseMove={() => setShowControls(true)}
        >
          <div className="absolute inset-0 bg-gradient-to-t from-black to-transparent opacity-50" />
          
          <div className="absolute bottom-0 left-0 right-0 p-4 flex justify-between items-center">
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={handlePlayPause}
            >
              <Play className="h-5 w-5" />
            </Button>
            
            <div className="flex items-center">
              <Button 
                variant="ghost" 
                size="icon"
                onClick={toggleMute}
              >
                {isMuted ? <VolumeX className="h-5 w-5" /> : <Volume2 className="h-5 w-5" />}
              </Button>
              
              <Button 
                variant="ghost" 
                size="icon"
                onClick={handleFullscreen}
              >
                <Maximize className="h-5 w-5" />
              </Button>
              
              <Button 
                variant="ghost" 
                size="icon"
                onClick={() => setIsPlaying(false)}
              >
                <X className="h-5 w-5" />
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default VideoPlayer;
