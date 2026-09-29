import { useState, useEffect } from "react";
import { X, ChevronLeft, ChevronRight, Pause, Play } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Story } from "@/data/dummyData";

interface StoryViewerProps {
  stories: Story[];
  initialIndex: number;
  isOpen: boolean;
  onClose: () => void;
  onStoryViewed: (storyId: string) => void;
}

const StoryViewer = ({ stories, initialIndex, isOpen, onClose, onStoryViewed }: StoryViewerProps) => {
  const [currentIndex, setCurrentIndex] = useState(initialIndex);
  const [progress, setProgress] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  const currentStory = stories[currentIndex];

  useEffect(() => {
    setCurrentIndex(initialIndex);
    setProgress(0);
  }, [initialIndex, isOpen]);

  useEffect(() => {
    if (!isOpen || isPaused) return;

    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          // Move to next story
          if (currentIndex < stories.length - 1) {
            setCurrentIndex(currentIndex + 1);
            onStoryViewed(currentStory.id);
            return 0;
          } else {
            onClose();
            return 100;
          }
        }
        return prev + 2;
      });
    }, 100);

    return () => clearInterval(interval);
  }, [isOpen, isPaused, currentIndex, stories.length, currentStory?.id, onClose, onStoryViewed]);

  const handlePrevious = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
      setProgress(0);
    }
  };

  const handleNext = () => {
    if (currentIndex < stories.length - 1) {
      onStoryViewed(currentStory.id);
      setCurrentIndex(currentIndex + 1);
      setProgress(0);
    } else {
      onClose();
    }
  };

  if (!isOpen || !currentStory) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black flex items-center justify-center">
      {/* Close Button */}
      <Button
        variant="ghost"
        size="icon"
        className="absolute top-4 right-4 z-10 rounded-full bg-black/50 text-white hover:bg-black/70"
        onClick={onClose}
      >
        <X className="w-6 h-6" />
      </Button>

      {/* Navigation Buttons */}
      <Button
        variant="ghost"
        size="icon"
        className="absolute left-4 z-10 rounded-full bg-black/50 text-white hover:bg-black/70 disabled:opacity-30"
        onClick={handlePrevious}
        disabled={currentIndex === 0}
      >
        <ChevronLeft className="w-6 h-6" />
      </Button>

      <Button
        variant="ghost"
        size="icon"
        className="absolute right-4 z-10 rounded-full bg-black/50 text-white hover:bg-black/70"
        onClick={handleNext}
      >
        <ChevronRight className="w-6 h-6" />
      </Button>

      {/* Story Container */}
      <div
        className="relative w-full max-w-[400px] h-[90vh] max-h-[700px] rounded-xl overflow-hidden"
        onClick={() => setIsPaused(!isPaused)}
      >
        {/* Progress Bars */}
        <div className="absolute top-0 left-0 right-0 z-10 flex gap-1 p-2">
          {stories.map((_, index) => (
            <div
              key={index}
              className="flex-1 h-1 bg-white/30 rounded-full overflow-hidden"
            >
              <div
                className="h-full bg-white transition-all duration-100"
                style={{
                  width:
                    index < currentIndex
                      ? "100%"
                      : index === currentIndex
                      ? `${progress}%`
                      : "0%",
                }}
              />
            </div>
          ))}
        </div>

        {/* User Info */}
        <div className="absolute top-8 left-0 right-0 z-10 flex items-center gap-3 px-4">
          <Avatar className="w-10 h-10 ring-2 ring-white">
            <AvatarImage src={currentStory.user.avatar} alt={currentStory.user.name} />
            <AvatarFallback>{currentStory.user.name.charAt(0)}</AvatarFallback>
          </Avatar>
          <div className="flex-1">
            <p className="text-white font-semibold text-sm">{currentStory.user.name}</p>
            <p className="text-white/70 text-xs">Just now</p>
          </div>
          <Button
            variant="ghost"
            size="icon"
            className="rounded-full text-white hover:bg-white/20"
            onClick={(e) => {
              e.stopPropagation();
              setIsPaused(!isPaused);
            }}
          >
            {isPaused ? <Play className="w-5 h-5" /> : <Pause className="w-5 h-5" />}
          </Button>
        </div>

        {/* Story Image */}
        <img
          src={currentStory.image}
          alt={`${currentStory.user.name}'s story`}
          className="w-full h-full object-cover"
        />

        {/* Gradient Overlays */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-transparent to-black/30 pointer-events-none" />

        {/* Pause Indicator */}
        {isPaused && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/20">
            <div className="w-16 h-16 rounded-full bg-black/50 flex items-center justify-center">
              <Play className="w-8 h-8 text-white ml-1" />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default StoryViewer;
