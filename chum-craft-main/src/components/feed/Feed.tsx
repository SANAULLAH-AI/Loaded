import { useState } from "react";
import Stories from "./Stories";
import CreatePost from "./CreatePost";
import PostCard from "./PostCard";
import { initialPosts, currentUser, Post, Comment } from "@/data/dummyData";

const Feed = () => {
  const [posts, setPosts] = useState<Post[]>(initialPosts);

  const handleNewPost = (content: string) => {
    const newPost: Post = {
      id: Date.now().toString(),
      userId: currentUser.id,
      user: currentUser,
      content,
      likes: 0,
      comments: [],
      shares: 0,
      createdAt: "Just now",
      isLiked: false,
    };
    setPosts([newPost, ...posts]);
  };

  const handleLike = (postId: string) => {
    setPosts(
      posts.map((post) =>
        post.id === postId
          ? {
              ...post,
              isLiked: !post.isLiked,
              likes: post.isLiked ? post.likes - 1 : post.likes + 1,
            }
          : post
      )
    );
  };

  const handleComment = (postId: string, content: string) => {
    const newComment: Comment = {
      id: Date.now().toString(),
      userId: currentUser.id,
      user: currentUser,
      content,
      createdAt: "Just now",
      likes: 0,
    };

    setPosts(
      posts.map((post) =>
        post.id === postId
          ? { ...post, comments: [...post.comments, newComment] }
          : post
      )
    );
  };

  return (
    <main className="flex-1 max-w-[680px] mx-auto px-4 py-4">
      <Stories />
      <CreatePost onPost={handleNewPost} />
      <div>
        {posts.map((post) => (
          <PostCard
            key={post.id}
            post={post}
            onLike={handleLike}
            onComment={handleComment}
          />
        ))}
      </div>
    </main>
  );
};

export default Feed;
