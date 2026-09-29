import { useState } from "react";
import { Image, Video, Smile } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { currentUser } from "@/data/dummyData";

interface CreatePostProps {
  onPost: (content: string) => void;
}

const CreatePost = ({ onPost }: CreatePostProps) => {
  const [content, setContent] = useState("");
  const [isFocused, setIsFocused] = useState(false);

  const handleSubmit = () => {
    if (content.trim()) {
      onPost(content);
      setContent("");
      setIsFocused(false);
    }
  };

  return (
    <div className="bg-card rounded-xl shadow-social p-4 mb-4">
      <div className="flex gap-3">
        <Avatar className="w-10 h-10">
          <AvatarImage src={currentUser.avatar} alt={currentUser.name} />
          <AvatarFallback>{currentUser.name.charAt(0)}</AvatarFallback>
        </Avatar>
        <div className="flex-1">
          <textarea
            placeholder={`What's on your mind, ${currentUser.name.split(" ")[0]}?`}
            value={content}
            onChange={(e) => setContent(e.target.value)}
            onFocus={() => setIsFocused(true)}
            className={`w-full bg-secondary rounded-full px-4 py-2.5 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-primary transition-all ${
              isFocused ? "rounded-xl min-h-[100px]" : "h-10"
            }`}
          />
        </div>
      </div>

      {isFocused && content && (
        <div className="flex justify-end mt-3 animate-fade-in">
          <Button
            onClick={handleSubmit}
            className="bg-primary hover:bg-primary-hover"
          >
            Post
          </Button>
        </div>
      )}

      <Separator className="my-3" />

      <div className="flex justify-around">
        <Button
          variant="ghost"
          className="flex-1 gap-2 text-muted-foreground hover:bg-secondary"
        >
          <Video className="w-5 h-5 text-destructive" />
          <span className="hidden sm:inline">Live Video</span>
        </Button>
        <Button
          variant="ghost"
          className="flex-1 gap-2 text-muted-foreground hover:bg-secondary"
        >
          <Image className="w-5 h-5 text-success" />
          <span className="hidden sm:inline">Photo/Video</span>
        </Button>
        <Button
          variant="ghost"
          className="flex-1 gap-2 text-muted-foreground hover:bg-secondary"
        >
          <Smile className="w-5 h-5 text-share" />
          <span className="hidden sm:inline">Feeling</span>
        </Button>
      </div>
    </div>
  );
};

export default CreatePost;
