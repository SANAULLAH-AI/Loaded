import { useState } from "react";
import { ThumbsUp, MessageCircle, Share2, MoreHorizontal, Send } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import type { Post, Comment } from "@/data/dummyData";
import { currentUser } from "@/data/dummyData";

interface PostCardProps {
  post: Post;
  onLike: (postId: string) => void;
  onComment: (postId: string, content: string) => void;
}

const PostCard = ({ post, onLike, onComment }: PostCardProps) => {
  const [showComments, setShowComments] = useState(false);
  const [commentText, setCommentText] = useState("");
  const [isLikeAnimating, setIsLikeAnimating] = useState(false);

  const handleLike = () => {
    setIsLikeAnimating(true);
    onLike(post.id);
    setTimeout(() => setIsLikeAnimating(false), 300);
  };

  const handleComment = () => {
    if (commentText.trim()) {
      onComment(post.id, commentText);
      setCommentText("");
    }
  };

  return (
    <article className="bg-card rounded-xl shadow-social mb-4 overflow-hidden animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between p-4">
        <div className="flex items-center gap-3">
          <Avatar className="w-10 h-10 ring-2 ring-transparent hover:ring-primary transition-all cursor-pointer">
            <AvatarImage src={post.user.avatar} alt={post.user.name} />
            <AvatarFallback>{post.user.name.charAt(0)}</AvatarFallback>
          </Avatar>
          <div>
            <h3 className="font-semibold text-sm hover:underline cursor-pointer">
              {post.user.name}
            </h3>
            <p className="text-xs text-muted-foreground">{post.createdAt}</p>
          </div>
        </div>
        <Button variant="ghost" size="icon" className="rounded-full hover:bg-secondary">
          <MoreHorizontal className="w-5 h-5" />
        </Button>
      </div>

      {/* Content */}
      <div className="px-4 pb-3">
        <p className="text-sm leading-relaxed">{post.content}</p>
      </div>

      {/* Image */}
      {post.image && (
        <div className="relative">
          <img
            src={post.image}
            alt="Post content"
            className="w-full max-h-[500px] object-cover"
          />
        </div>
      )}

      {/* Stats */}
      <div className="flex items-center justify-between px-4 py-2">
        <div className="flex items-center gap-1">
          <div className="flex -space-x-1">
            <span className="w-5 h-5 rounded-full bg-primary flex items-center justify-center">
              <ThumbsUp className="w-3 h-3 text-primary-foreground" />
            </span>
            <span className="w-5 h-5 rounded-full bg-love flex items-center justify-center">
              <span className="text-[10px]">❤️</span>
            </span>
          </div>
          <span className="text-sm text-muted-foreground ml-1">
            {post.likes.toLocaleString()}
          </span>
        </div>
        <div className="flex gap-4 text-sm text-muted-foreground">
          <button
            onClick={() => setShowComments(!showComments)}
            className="hover:underline"
          >
            {post.comments.length} comments
          </button>
          <span>{post.shares} shares</span>
        </div>
      </div>

      <Separator className="mx-4" />

      {/* Actions */}
      <div className="flex justify-around p-1">
        <Button
          variant="ghost"
          onClick={handleLike}
          className={`flex-1 gap-2 ${
            post.isLiked
              ? "text-primary font-semibold"
              : "text-muted-foreground"
          } hover:bg-secondary ${isLikeAnimating ? "animate-like-pop" : ""}`}
        >
          <ThumbsUp
            className={`w-5 h-5 ${post.isLiked ? "fill-primary" : ""}`}
          />
          Like
        </Button>
        <Button
          variant="ghost"
          onClick={() => setShowComments(!showComments)}
          className="flex-1 gap-2 text-muted-foreground hover:bg-secondary"
        >
          <MessageCircle className="w-5 h-5" />
          Comment
        </Button>
        <Button
          variant="ghost"
          className="flex-1 gap-2 text-muted-foreground hover:bg-secondary"
        >
          <Share2 className="w-5 h-5" />
          Share
        </Button>
      </div>

      {/* Comments Section */}
      {showComments && (
        <div className="px-4 pb-4 animate-fade-in">
          <Separator className="mb-3" />

          {/* Existing Comments */}
          <div className="space-y-3 mb-3">
            {post.comments.map((comment) => (
              <CommentItem key={comment.id} comment={comment} />
            ))}
          </div>

          {/* Add Comment */}
          <div className="flex gap-2">
            <Avatar className="w-8 h-8">
              <AvatarImage src={currentUser.avatar} alt={currentUser.name} />
              <AvatarFallback>{currentUser.name.charAt(0)}</AvatarFallback>
            </Avatar>
            <div className="flex-1 flex gap-2">
              <Input
                placeholder="Write a comment..."
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleComment()}
                className="bg-secondary border-0 rounded-full"
              />
              <Button
                size="icon"
                onClick={handleComment}
                disabled={!commentText.trim()}
                className="rounded-full bg-primary hover:bg-primary-hover shrink-0"
              >
                <Send className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
      )}
    </article>
  );
};

const CommentItem = ({ comment }: { comment: Comment }) => {
  return (
    <div className="flex gap-2">
      <Avatar className="w-8 h-8">
        <AvatarImage src={comment.user.avatar} alt={comment.user.name} />
        <AvatarFallback>{comment.user.name.charAt(0)}</AvatarFallback>
      </Avatar>
      <div className="flex-1">
        <div className="bg-secondary rounded-2xl px-3 py-2">
          <p className="font-semibold text-sm">{comment.user.name}</p>
          <p className="text-sm">{comment.content}</p>
        </div>
        <div className="flex gap-4 mt-1 ml-3 text-xs text-muted-foreground">
          <button className="font-semibold hover:underline">Like</button>
          <button className="font-semibold hover:underline">Reply</button>
          <span>{comment.createdAt}</span>
        </div>
      </div>
    </div>
  );
};

export default PostCard;
