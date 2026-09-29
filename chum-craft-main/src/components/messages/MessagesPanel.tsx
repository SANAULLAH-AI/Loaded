import { useState } from "react";
import { X, Search, Edit3, Phone, Video, MoreHorizontal, Send, Image, Smile, ThumbsUp } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { messages as initialMessages, currentUser, Message, User } from "@/data/dummyData";

interface MessagesPanelProps {
  isOpen: boolean;
  onClose: () => void;
}

interface ChatMessage {
  id: string;
  senderId: string;
  content: string;
  createdAt: string;
}

const MessagesPanel = ({ isOpen, onClose }: MessagesPanelProps) => {
  const [messagesList] = useState<Message[]>(initialMessages);
  const [selectedChat, setSelectedChat] = useState<Message | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [newMessage, setNewMessage] = useState("");
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([
    { id: "1", senderId: "2", content: "Hey! Are you coming to the party tonight?", createdAt: "2 min ago" },
    { id: "2", senderId: "1", content: "Yes! I'll be there around 8pm", createdAt: "1 min ago" },
    { id: "3", senderId: "2", content: "Perfect! See you then! 🎉", createdAt: "Just now" },
  ]);

  const filteredMessages = messagesList.filter(m =>
    m.user.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleSendMessage = () => {
    if (newMessage.trim()) {
      setChatMessages([
        ...chatMessages,
        {
          id: Date.now().toString(),
          senderId: currentUser.id,
          content: newMessage,
          createdAt: "Just now",
        },
      ]);
      setNewMessage("");
    }
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div className="fixed inset-0 z-40" onClick={onClose} />

      {/* Panel */}
      <div className="absolute top-full right-0 mt-2 w-[360px] bg-card rounded-xl shadow-social-lg border border-border z-50 animate-fade-in overflow-hidden">
        {selectedChat ? (
          // Chat View
          <div className="flex flex-col h-[500px]">
            {/* Chat Header */}
            <div className="flex items-center gap-3 p-3 border-b border-border">
              <Button
                variant="ghost"
                size="icon"
                className="rounded-full"
                onClick={() => setSelectedChat(null)}
              >
                <X className="w-4 h-4" />
              </Button>
              <Avatar className="w-10 h-10">
                <AvatarImage src={selectedChat.user.avatar} alt={selectedChat.user.name} />
                <AvatarFallback>{selectedChat.user.name.charAt(0)}</AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <p className="font-semibold text-sm">{selectedChat.user.name}</p>
                <p className="text-xs text-muted-foreground">
                  {selectedChat.isOnline ? "Active now" : "Offline"}
                </p>
              </div>
              <Button variant="ghost" size="icon" className="rounded-full">
                <Phone className="w-4 h-4" />
              </Button>
              <Button variant="ghost" size="icon" className="rounded-full">
                <Video className="w-4 h-4" />
              </Button>
            </div>

            {/* Messages */}
            <ScrollArea className="flex-1 p-4">
              <div className="space-y-3">
                {chatMessages.map((msg) => (
                  <div
                    key={msg.id}
                    className={`flex ${msg.senderId === currentUser.id ? "justify-end" : "justify-start"}`}
                  >
                    {msg.senderId !== currentUser.id && (
                      <Avatar className="w-7 h-7 mr-2">
                        <AvatarImage src={selectedChat.user.avatar} alt={selectedChat.user.name} />
                        <AvatarFallback>{selectedChat.user.name.charAt(0)}</AvatarFallback>
                      </Avatar>
                    )}
                    <div
                      className={`max-w-[70%] px-3 py-2 rounded-2xl ${
                        msg.senderId === currentUser.id
                          ? "bg-primary text-primary-foreground"
                          : "bg-secondary"
                      }`}
                    >
                      <p className="text-sm">{msg.content}</p>
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>

            {/* Input */}
            <div className="p-3 border-t border-border">
              <div className="flex items-center gap-2">
                <Button variant="ghost" size="icon" className="rounded-full flex-shrink-0">
                  <Image className="w-5 h-5 text-primary" />
                </Button>
                <div className="flex-1 relative">
                  <Input
                    placeholder="Aa"
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
                    className="pr-10 bg-secondary border-0 rounded-full"
                  />
                  <Button
                    variant="ghost"
                    size="icon"
                    className="absolute right-1 top-1/2 -translate-y-1/2 rounded-full w-8 h-8"
                  >
                    <Smile className="w-5 h-5 text-primary" />
                  </Button>
                </div>
                {newMessage ? (
                  <Button
                    size="icon"
                    className="rounded-full bg-primary hover:bg-primary-hover flex-shrink-0"
                    onClick={handleSendMessage}
                  >
                    <Send className="w-4 h-4" />
                  </Button>
                ) : (
                  <Button variant="ghost" size="icon" className="rounded-full flex-shrink-0">
                    <ThumbsUp className="w-5 h-5 text-primary" />
                  </Button>
                )}
              </div>
            </div>
          </div>
        ) : (
          // Messages List View
          <>
            <div className="flex items-center justify-between p-4 border-b border-border">
              <h3 className="font-bold text-xl">Chats</h3>
              <div className="flex gap-2">
                <Button variant="ghost" size="icon" className="rounded-full">
                  <MoreHorizontal className="w-4 h-4" />
                </Button>
                <Button variant="ghost" size="icon" className="rounded-full">
                  <Edit3 className="w-4 h-4" />
                </Button>
                <Button variant="ghost" size="icon" onClick={onClose} className="rounded-full">
                  <X className="w-4 h-4" />
                </Button>
              </div>
            </div>

            <div className="p-3">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  placeholder="Search Messenger"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 bg-secondary border-0 rounded-full"
                />
              </div>
            </div>

            <ScrollArea className="h-[380px]">
              <div className="p-2">
                {filteredMessages.map((message) => (
                  <div
                    key={message.id}
                    className="flex items-center gap-3 p-2 rounded-lg cursor-pointer hover:bg-secondary transition-colors"
                    onClick={() => setSelectedChat(message)}
                  >
                    <div className="relative">
                      <Avatar className="w-12 h-12">
                        <AvatarImage src={message.user.avatar} alt={message.user.name} />
                        <AvatarFallback>{message.user.name.charAt(0)}</AvatarFallback>
                      </Avatar>
                      {message.isOnline && (
                        <span className="absolute bottom-0 right-0 w-3.5 h-3.5 bg-success rounded-full border-2 border-card" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className={`text-sm truncate ${message.unread > 0 ? "font-bold" : "font-medium"}`}>
                        {message.user.name}
                      </p>
                      <p className={`text-xs truncate ${message.unread > 0 ? "text-foreground font-medium" : "text-muted-foreground"}`}>
                        {message.lastMessage} · {message.createdAt}
                      </p>
                    </div>
                    {message.unread > 0 && (
                      <div className="w-5 h-5 rounded-full bg-primary text-primary-foreground text-xs flex items-center justify-center">
                        {message.unread}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </ScrollArea>

            <div className="p-3 border-t border-border">
              <Button variant="ghost" className="w-full text-primary hover:text-primary-hover">
                See All in Messenger
              </Button>
            </div>
          </>
        )}
      </div>
    </>
  );
};

export default MessagesPanel;
