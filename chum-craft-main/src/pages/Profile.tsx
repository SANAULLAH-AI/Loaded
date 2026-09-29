import { useState } from "react";
import { useParams, Link } from "react-router-dom";
import { Camera, MapPin, Briefcase, GraduationCap, Heart, MoreHorizontal, UserPlus, MessageCircle, Edit2 } from "lucide-react";
import Header from "@/components/layout/Header";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import PostCard from "@/components/feed/PostCard";
import { users, initialPosts, currentUser, userPhotos, User, Post, Comment } from "@/data/dummyData";

const Profile = () => {
  const { userId } = useParams();
  const profileUser = userId ? users.find(u => u.id === userId) || currentUser : currentUser;
  const isOwnProfile = profileUser.id === currentUser.id;
  
  const [posts, setPosts] = useState<Post[]>(
    initialPosts.filter(p => p.userId === profileUser.id || (isOwnProfile && p.userId === "1"))
  );
  const [isFriend, setIsFriend] = useState(false);

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

  const friendsList = users.filter(u => u.id !== profileUser.id).slice(0, 9);

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="pt-14">
        {/* Cover Photo */}
        <div className="relative h-[300px] md:h-[400px] bg-secondary">
          <img
            src={profileUser.coverPhoto}
            alt="Cover"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
          {isOwnProfile && (
            <Button
              variant="secondary"
              className="absolute bottom-4 right-4 gap-2"
            >
              <Camera className="w-4 h-4" />
              Edit Cover Photo
            </Button>
          )}
        </div>

        {/* Profile Header */}
        <div className="max-w-5xl mx-auto px-4">
          <div className="relative flex flex-col md:flex-row md:items-end gap-4 -mt-20 md:-mt-8 pb-4 border-b border-border">
            {/* Avatar */}
            <div className="relative">
              <Avatar className="w-40 h-40 border-4 border-card shadow-lg">
                <AvatarImage src={profileUser.avatar} alt={profileUser.name} />
                <AvatarFallback className="text-4xl">{profileUser.name.charAt(0)}</AvatarFallback>
              </Avatar>
              {isOwnProfile && (
                <Button
                  size="icon"
                  className="absolute bottom-2 right-2 rounded-full w-9 h-9 bg-secondary hover:bg-secondary/80"
                >
                  <Camera className="w-4 h-4 text-foreground" />
                </Button>
              )}
            </div>

            {/* Info */}
            <div className="flex-1 md:pb-4">
              <h1 className="text-3xl font-bold">{profileUser.name}</h1>
              <p className="text-muted-foreground">{profileUser.friends.toLocaleString()} friends</p>
              <div className="flex -space-x-2 mt-2">
                {friendsList.slice(0, 8).map((friend) => (
                  <Avatar key={friend.id} className="w-8 h-8 border-2 border-card">
                    <AvatarImage src={friend.avatar} alt={friend.name} />
                    <AvatarFallback>{friend.name.charAt(0)}</AvatarFallback>
                  </Avatar>
                ))}
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-2 md:pb-4">
              {isOwnProfile ? (
                <>
                  <Button className="gap-2 bg-primary hover:bg-primary-hover">
                    <span>+ Add to Story</span>
                  </Button>
                  <Button variant="secondary" className="gap-2">
                    <Edit2 className="w-4 h-4" />
                    Edit Profile
                  </Button>
                </>
              ) : (
                <>
                  <Button
                    className={`gap-2 ${isFriend ? "bg-secondary text-foreground hover:bg-secondary/80" : "bg-primary hover:bg-primary-hover"}`}
                    onClick={() => setIsFriend(!isFriend)}
                  >
                    <UserPlus className="w-4 h-4" />
                    {isFriend ? "Friends" : "Add Friend"}
                  </Button>
                  <Button variant="secondary" className="gap-2">
                    <MessageCircle className="w-4 h-4" />
                    Message
                  </Button>
                  <Button variant="secondary" size="icon">
                    <MoreHorizontal className="w-4 h-4" />
                  </Button>
                </>
              )}
            </div>
          </div>

          {/* Tabs */}
          <Tabs defaultValue="posts" className="mt-4">
            <TabsList className="bg-transparent border-b border-border w-full justify-start rounded-none p-0 h-auto">
              <TabsTrigger
                value="posts"
                className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent px-6 py-3"
              >
                Posts
              </TabsTrigger>
              <TabsTrigger
                value="about"
                className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent px-6 py-3"
              >
                About
              </TabsTrigger>
              <TabsTrigger
                value="friends"
                className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent px-6 py-3"
              >
                Friends
              </TabsTrigger>
              <TabsTrigger
                value="photos"
                className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent px-6 py-3"
              >
                Photos
              </TabsTrigger>
            </TabsList>

            <div className="grid md:grid-cols-[360px_1fr] gap-4 mt-4 pb-8">
              {/* Left Column - Info Cards */}
              <div className="space-y-4">
                {/* Intro Card */}
                <div className="bg-card rounded-xl shadow-social p-4">
                  <h3 className="font-bold text-lg mb-3">Intro</h3>
                  <p className="text-center text-muted-foreground mb-4">{profileUser.bio}</p>
                  <div className="space-y-3">
                    {profileUser.workplace && (
                      <div className="flex items-center gap-2 text-sm">
                        <Briefcase className="w-5 h-5 text-muted-foreground" />
                        <span>Works at <strong>{profileUser.workplace}</strong></span>
                      </div>
                    )}
                    {profileUser.education && (
                      <div className="flex items-center gap-2 text-sm">
                        <GraduationCap className="w-5 h-5 text-muted-foreground" />
                        <span>Studied at <strong>{profileUser.education}</strong></span>
                      </div>
                    )}
                    {profileUser.location && (
                      <div className="flex items-center gap-2 text-sm">
                        <MapPin className="w-5 h-5 text-muted-foreground" />
                        <span>Lives in <strong>{profileUser.location}</strong></span>
                      </div>
                    )}
                    {profileUser.relationship && (
                      <div className="flex items-center gap-2 text-sm">
                        <Heart className="w-5 h-5 text-muted-foreground" />
                        <span>{profileUser.relationship}</span>
                      </div>
                    )}
                  </div>
                  {isOwnProfile && (
                    <Button variant="secondary" className="w-full mt-4">
                      Edit Details
                    </Button>
                  )}
                </div>

                {/* Photos Card */}
                <div className="bg-card rounded-xl shadow-social p-4">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="font-bold text-lg">Photos</h3>
                    <Button variant="link" className="text-primary p-0 h-auto">
                      See All Photos
                    </Button>
                  </div>
                  <div className="grid grid-cols-3 gap-1 rounded-lg overflow-hidden">
                    {userPhotos.slice(0, 9).map((photo, index) => (
                      <img
                        key={index}
                        src={photo}
                        alt={`Photo ${index + 1}`}
                        className="aspect-square object-cover hover:opacity-90 transition-opacity cursor-pointer"
                      />
                    ))}
                  </div>
                </div>

                {/* Friends Card */}
                <div className="bg-card rounded-xl shadow-social p-4">
                  <div className="flex items-center justify-between mb-3">
                    <div>
                      <h3 className="font-bold text-lg">Friends</h3>
                      <p className="text-sm text-muted-foreground">{profileUser.friends} friends</p>
                    </div>
                    <Button variant="link" className="text-primary p-0 h-auto">
                      See All Friends
                    </Button>
                  </div>
                  <div className="grid grid-cols-3 gap-2">
                    {friendsList.map((friend) => (
                      <Link
                        key={friend.id}
                        to={`/profile/${friend.id}`}
                        className="group"
                      >
                        <img
                          src={friend.avatar}
                          alt={friend.name}
                          className="w-full aspect-square object-cover rounded-lg group-hover:opacity-90 transition-opacity"
                        />
                        <p className="text-xs font-medium mt-1 truncate">{friend.name}</p>
                      </Link>
                    ))}
                  </div>
                </div>
              </div>

              {/* Right Column - Posts */}
              <div>
                <TabsContent value="posts" className="mt-0 space-y-4">
                  {posts.length > 0 ? (
                    posts.map((post) => (
                      <PostCard
                        key={post.id}
                        post={post}
                        onLike={handleLike}
                        onComment={handleComment}
                      />
                    ))
                  ) : (
                    <div className="bg-card rounded-xl shadow-social p-8 text-center">
                      <p className="text-muted-foreground">No posts yet</p>
                    </div>
                  )}
                </TabsContent>

                <TabsContent value="about" className="mt-0">
                  <div className="bg-card rounded-xl shadow-social p-6">
                    <h3 className="font-bold text-lg mb-4">About {profileUser.name}</h3>
                    <div className="space-y-4">
                      <div>
                        <h4 className="font-semibold text-muted-foreground mb-2">Bio</h4>
                        <p>{profileUser.bio}</p>
                      </div>
                      <div>
                        <h4 className="font-semibold text-muted-foreground mb-2">Work</h4>
                        <p>{profileUser.workplace || "Not specified"}</p>
                      </div>
                      <div>
                        <h4 className="font-semibold text-muted-foreground mb-2">Education</h4>
                        <p>{profileUser.education || "Not specified"}</p>
                      </div>
                      <div>
                        <h4 className="font-semibold text-muted-foreground mb-2">Location</h4>
                        <p>{profileUser.location || "Not specified"}</p>
                      </div>
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="friends" className="mt-0">
                  <div className="bg-card rounded-xl shadow-social p-6">
                    <h3 className="font-bold text-lg mb-4">Friends</h3>
                    <div className="grid grid-cols-2 gap-4">
                      {friendsList.map((friend) => (
                        <Link
                          key={friend.id}
                          to={`/profile/${friend.id}`}
                          className="flex items-center gap-3 p-3 rounded-lg hover:bg-secondary transition-colors"
                        >
                          <Avatar className="w-16 h-16">
                            <AvatarImage src={friend.avatar} alt={friend.name} />
                            <AvatarFallback>{friend.name.charAt(0)}</AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="font-semibold">{friend.name}</p>
                            <p className="text-sm text-muted-foreground">
                              {friend.mutualFriends} mutual friends
                            </p>
                          </div>
                        </Link>
                      ))}
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="photos" className="mt-0">
                  <div className="bg-card rounded-xl shadow-social p-6">
                    <h3 className="font-bold text-lg mb-4">Photos</h3>
                    <div className="grid grid-cols-3 md:grid-cols-4 gap-2">
                      {userPhotos.map((photo, index) => (
                        <img
                          key={index}
                          src={photo}
                          alt={`Photo ${index + 1}`}
                          className="aspect-square object-cover rounded-lg hover:opacity-90 transition-opacity cursor-pointer"
                        />
                      ))}
                    </div>
                  </div>
                </TabsContent>
              </div>
            </div>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default Profile;
