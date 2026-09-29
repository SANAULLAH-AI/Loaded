import { Plus } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { stories, currentUser } from "@/data/dummyData";

const Stories = () => {
  return (
    <div className="bg-card rounded-xl shadow-social p-4 mb-4">
      <div className="flex gap-3 overflow-x-auto scrollbar-hide pb-2">
        {/* Create Story Card */}
        <div className="flex-shrink-0 w-28 h-48 relative rounded-xl overflow-hidden cursor-pointer group">
          <img
            src={currentUser.avatar}
            alt="Your story"
            className="w-full h-3/4 object-cover"
          />
          <div className="absolute bottom-0 left-0 right-0 h-1/3 bg-card flex flex-col items-center justify-center">
            <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-primary text-primary-foreground flex items-center justify-center border-4 border-card">
              <Plus className="w-5 h-5" />
            </div>
            <span className="text-xs font-semibold mt-4">Create Story</span>
          </div>
        </div>

        {/* Story Cards */}
        {stories.map((story) => (
          <div
            key={story.id}
            className={`flex-shrink-0 w-28 h-48 relative rounded-xl overflow-hidden cursor-pointer group transform transition-transform hover:scale-105 ${
              story.viewed ? "opacity-70" : ""
            }`}
          >
            <img
              src={story.image}
              alt={`${story.user.name}'s story`}
              className="w-full h-full object-cover"
            />
            {/* Gradient Overlay */}
            <div
              className="absolute inset-0"
              style={{
                background: "linear-gradient(180deg, transparent 0%, hsl(220 20% 10% / 0.6) 100%)",
              }}
            />
            {/* Avatar */}
            <div className="absolute top-3 left-3">
              <Avatar
                className={`w-10 h-10 ring-4 ${
                  story.viewed ? "ring-muted" : "ring-primary"
                }`}
              >
                <AvatarImage src={story.user.avatar} alt={story.user.name} />
                <AvatarFallback>{story.user.name.charAt(0)}</AvatarFallback>
              </Avatar>
            </div>
            {/* Name */}
            <div className="absolute bottom-3 left-3 right-3">
              <p className="text-sm font-semibold text-white truncate">
                {story.user.name.split(" ")[0]}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Stories;
