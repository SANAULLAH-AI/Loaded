import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Search, MoreHorizontal, Video, Edit3 } from "lucide-react";
import { users, friendSuggestions } from "@/data/dummyData";

const RightSidebar = () => {
  const onlineContacts = users.filter((user) => user.isOnline);

  return (
    <aside className="hidden xl:block w-[300px] h-[calc(100vh-56px)] sticky top-14 overflow-y-auto scrollbar-hide p-4">
      {/* Friend Suggestions */}
      <div className="mb-6">
        <h3 className="text-muted-foreground font-semibold text-sm mb-3 px-2">
          Friend Suggestions
        </h3>
        <div className="space-y-2">
          {friendSuggestions.map((friend) => (
            <div
              key={friend.id}
              className="flex items-center gap-3 p-2 rounded-lg hover:bg-secondary transition-colors cursor-pointer group"
            >
              <Avatar className="w-10 h-10">
                <AvatarImage src={friend.avatar} alt={friend.name} />
                <AvatarFallback>{friend.name.charAt(0)}</AvatarFallback>
              </Avatar>
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-sm truncate">{friend.name}</p>
                <p className="text-xs text-muted-foreground">
                  {friend.mutualFriends} mutual friends
                </p>
              </div>
              <Button
                size="sm"
                className="opacity-0 group-hover:opacity-100 transition-opacity bg-primary hover:bg-primary-hover"
              >
                Add
              </Button>
            </div>
          ))}
        </div>
      </div>

      {/* Divider */}
      <div className="border-t border-border my-4" />

      {/* Contacts */}
      <div>
        <div className="flex items-center justify-between mb-3 px-2">
          <h3 className="text-muted-foreground font-semibold text-sm">Contacts</h3>
          <div className="flex gap-1">
            <Button variant="ghost" size="icon" className="w-8 h-8 rounded-full hover:bg-secondary">
              <Video className="w-4 h-4" />
            </Button>
            <Button variant="ghost" size="icon" className="w-8 h-8 rounded-full hover:bg-secondary">
              <Search className="w-4 h-4" />
            </Button>
            <Button variant="ghost" size="icon" className="w-8 h-8 rounded-full hover:bg-secondary">
              <MoreHorizontal className="w-4 h-4" />
            </Button>
          </div>
        </div>
        <div className="space-y-1">
          {onlineContacts.map((contact) => (
            <div
              key={contact.id}
              className="flex items-center gap-3 p-2 rounded-lg hover:bg-secondary transition-colors cursor-pointer"
            >
              <div className="relative">
                <Avatar className="w-9 h-9">
                  <AvatarImage src={contact.avatar} alt={contact.name} />
                  <AvatarFallback>{contact.name.charAt(0)}</AvatarFallback>
                </Avatar>
                <span className="absolute bottom-0 right-0 w-3 h-3 bg-success rounded-full border-2 border-card" />
              </div>
              <span className="font-medium text-sm">{contact.name}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Chat Bubble */}
      <Button
        className="fixed bottom-4 right-4 w-14 h-14 rounded-full shadow-social-lg bg-primary hover:bg-primary-hover"
        size="icon"
      >
        <Edit3 className="w-6 h-6" />
      </Button>
    </aside>
  );
};

export default RightSidebar;
