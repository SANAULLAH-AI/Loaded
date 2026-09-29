import { useState } from "react";
import { Link } from "react-router-dom";
import { UserPlus, UserMinus, UserCheck, Search, MoreHorizontal } from "lucide-react";
import Header from "@/components/layout/Header";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { users, friendRequests, currentUser, FriendRequest, User } from "@/data/dummyData";

const Friends = () => {
  const [requests, setRequests] = useState<FriendRequest[]>(friendRequests);
  const [friends, setFriends] = useState<User[]>(users.filter(u => u.id !== currentUser.id));
  const [searchQuery, setSearchQuery] = useState("");
  const [acceptedIds, setAcceptedIds] = useState<string[]>([]);

  const handleAcceptRequest = (requestId: string) => {
    setAcceptedIds([...acceptedIds, requestId]);
    setTimeout(() => {
      setRequests(requests.filter(r => r.id !== requestId));
    }, 1000);
  };

  const handleDeclineRequest = (requestId: string) => {
    setRequests(requests.filter(r => r.id !== requestId));
  };

  const handleRemoveFriend = (userId: string) => {
    setFriends(friends.filter(f => f.id !== userId));
  };

  const filteredFriends = friends.filter(friend =>
    friend.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const suggestions = users.filter(u => 
    u.id !== currentUser.id && 
    !friends.some(f => f.id === u.id)
  );

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="pt-14 max-w-5xl mx-auto px-4 py-6">
        <h1 className="text-2xl font-bold mb-6">Friends</h1>

        <Tabs defaultValue="requests" className="w-full">
          <TabsList className="bg-card shadow-social mb-6 p-1 rounded-lg">
            <TabsTrigger value="requests" className="rounded-md px-6">
              Friend Requests
              {requests.length > 0 && (
                <span className="ml-2 bg-destructive text-destructive-foreground text-xs px-2 py-0.5 rounded-full">
                  {requests.length}
                </span>
              )}
            </TabsTrigger>
            <TabsTrigger value="suggestions" className="rounded-md px-6">
              Suggestions
            </TabsTrigger>
            <TabsTrigger value="all" className="rounded-md px-6">
              All Friends
            </TabsTrigger>
          </TabsList>

          {/* Friend Requests */}
          <TabsContent value="requests">
            <div className="bg-card rounded-xl shadow-social p-6">
              <h2 className="font-bold text-lg mb-4">Friend Requests</h2>
              {requests.length === 0 ? (
                <p className="text-muted-foreground text-center py-8">
                  No pending friend requests
                </p>
              ) : (
                <div className="grid md:grid-cols-2 gap-4">
                  {requests.map((request) => (
                    <div
                      key={request.id}
                      className="flex items-start gap-4 p-4 rounded-xl bg-secondary/50 animate-fade-in"
                    >
                      <Link to={`/profile/${request.user.id}`}>
                        <Avatar className="w-20 h-20">
                          <AvatarImage src={request.user.avatar} alt={request.user.name} />
                          <AvatarFallback>{request.user.name.charAt(0)}</AvatarFallback>
                        </Avatar>
                      </Link>
                      <div className="flex-1">
                        <Link to={`/profile/${request.user.id}`}>
                          <h3 className="font-semibold hover:underline">{request.user.name}</h3>
                        </Link>
                        <p className="text-sm text-muted-foreground mb-2">
                          {request.mutualFriends} mutual friends
                        </p>
                        <p className="text-xs text-muted-foreground mb-3">
                          {request.createdAt}
                        </p>
                        {acceptedIds.includes(request.id) ? (
                          <div className="flex items-center gap-2 text-success">
                            <UserCheck className="w-4 h-4" />
                            <span className="text-sm font-medium">Request Accepted</span>
                          </div>
                        ) : (
                          <div className="flex gap-2">
                            <Button
                              size="sm"
                              className="flex-1 bg-primary hover:bg-primary-hover"
                              onClick={() => handleAcceptRequest(request.id)}
                            >
                              Confirm
                            </Button>
                            <Button
                              size="sm"
                              variant="secondary"
                              className="flex-1"
                              onClick={() => handleDeclineRequest(request.id)}
                            >
                              Delete
                            </Button>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </TabsContent>

          {/* Suggestions */}
          <TabsContent value="suggestions">
            <div className="bg-card rounded-xl shadow-social p-6">
              <h2 className="font-bold text-lg mb-4">People You May Know</h2>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                {suggestions.map((user) => (
                  <SuggestionCard key={user.id} user={user} />
                ))}
              </div>
            </div>
          </TabsContent>

          {/* All Friends */}
          <TabsContent value="all">
            <div className="bg-card rounded-xl shadow-social p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="font-bold text-lg">All Friends</h2>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    placeholder="Search friends..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10 w-60 bg-secondary border-0"
                  />
                </div>
              </div>
              <div className="grid md:grid-cols-2 gap-4">
                {filteredFriends.map((friend) => (
                  <div
                    key={friend.id}
                    className="flex items-center gap-4 p-4 rounded-xl hover:bg-secondary/50 transition-colors"
                  >
                    <Link to={`/profile/${friend.id}`}>
                      <Avatar className="w-16 h-16">
                        <AvatarImage src={friend.avatar} alt={friend.name} />
                        <AvatarFallback>{friend.name.charAt(0)}</AvatarFallback>
                      </Avatar>
                    </Link>
                    <div className="flex-1">
                      <Link to={`/profile/${friend.id}`}>
                        <h3 className="font-semibold hover:underline">{friend.name}</h3>
                      </Link>
                      <p className="text-sm text-muted-foreground">
                        {friend.mutualFriends} mutual friends
                      </p>
                    </div>
                    <div className="flex gap-2">
                      <Button variant="secondary" size="sm">
                        Message
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="rounded-full"
                        onClick={() => handleRemoveFriend(friend.id)}
                      >
                        <MoreHorizontal className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

const SuggestionCard = ({ user }: { user: User }) => {
  const [status, setStatus] = useState<"idle" | "sent" | "removed">("idle");

  if (status === "removed") return null;

  return (
    <div className="flex flex-col items-center p-4 rounded-xl bg-secondary/50 animate-fade-in">
      <Link to={`/profile/${user.id}`}>
        <Avatar className="w-24 h-24 mb-3">
          <AvatarImage src={user.avatar} alt={user.name} />
          <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
        </Avatar>
      </Link>
      <Link to={`/profile/${user.id}`}>
        <h3 className="font-semibold text-center hover:underline">{user.name}</h3>
      </Link>
      <p className="text-sm text-muted-foreground mb-3">
        {user.mutualFriends} mutual friends
      </p>
      {status === "sent" ? (
        <Button variant="secondary" className="w-full gap-2" disabled>
          <UserCheck className="w-4 h-4" />
          Request Sent
        </Button>
      ) : (
        <div className="flex flex-col gap-2 w-full">
          <Button
            className="w-full gap-2 bg-primary hover:bg-primary-hover"
            onClick={() => setStatus("sent")}
          >
            <UserPlus className="w-4 h-4" />
            Add Friend
          </Button>
          <Button
            variant="secondary"
            className="w-full gap-2"
            onClick={() => setStatus("removed")}
          >
            <UserMinus className="w-4 h-4" />
            Remove
          </Button>
        </div>
      )}
    </div>
  );
};

export default Friends;
