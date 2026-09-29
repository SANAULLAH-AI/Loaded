import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Search, Home, Users, PlayCircle, Store, Bell, MessageCircle, Menu } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { currentUser, notifications, messages } from "@/data/dummyData";
import NotificationsPanel from "@/components/notifications/NotificationsPanel";
import MessagesPanel from "@/components/messages/MessagesPanel";

const Header = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [showNotifications, setShowNotifications] = useState(false);
  const [showMessages, setShowMessages] = useState(false);

  const unreadNotifications = notifications.filter(n => !n.read).length;
  const unreadMessages = messages.reduce((acc, m) => acc + m.unread, 0);

  const navItems = [
    { id: "home", icon: Home, label: "Home", path: "/" },
    { id: "friends", icon: Users, label: "Friends", path: "/friends" },
    { id: "watch", icon: PlayCircle, label: "Watch", path: "/" },
    { id: "marketplace", icon: Store, label: "Marketplace", path: "/" },
  ];

  const getActiveTab = () => {
    if (location.pathname === "/friends") return "friends";
    if (location.pathname === "/") return "home";
    return "home";
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-card shadow-social border-b border-border">
      <div className="flex items-center justify-between px-4 h-14">
        {/* Left Section */}
        <div className="flex items-center gap-2 flex-1">
          <div
            className="flex items-center justify-center w-10 h-10 rounded-full bg-primary text-primary-foreground font-bold text-xl cursor-pointer"
            onClick={() => navigate("/")}
          >
            f
          </div>
          <div className="relative hidden sm:block">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search Socialink"
              className="pl-10 w-60 bg-secondary border-0 rounded-full focus-visible:ring-1 focus-visible:ring-primary"
            />
          </div>
        </div>

        {/* Center Section */}
        <nav className="hidden md:flex items-center justify-center flex-1 gap-2">
          {navItems.map((item) => (
            <Button
              key={item.id}
              variant="ghost"
              onClick={() => navigate(item.path)}
              className={`px-8 py-6 rounded-lg transition-all duration-200 ${
                getActiveTab() === item.id
                  ? "text-primary border-b-4 border-primary bg-transparent rounded-none"
                  : "text-muted-foreground hover:bg-secondary"
              }`}
            >
              <item.icon className="w-6 h-6" />
            </Button>
          ))}
        </nav>

        {/* Right Section */}
        <div className="flex items-center justify-end gap-2 flex-1">
          <div className="relative">
            <Button
              variant="ghost"
              size="icon"
              className="rounded-full bg-secondary"
              onClick={() => {
                setShowMessages(!showMessages);
                setShowNotifications(false);
              }}
            >
              <MessageCircle className="w-5 h-5" />
              {unreadMessages > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 bg-destructive text-destructive-foreground text-xs rounded-full flex items-center justify-center">
                  {unreadMessages}
                </span>
              )}
            </Button>
            <MessagesPanel isOpen={showMessages} onClose={() => setShowMessages(false)} />
          </div>

          <div className="relative hidden md:block">
            <Button
              variant="ghost"
              size="icon"
              className="rounded-full bg-secondary"
              onClick={() => {
                setShowNotifications(!showNotifications);
                setShowMessages(false);
              }}
            >
              <Bell className="w-5 h-5" />
              {unreadNotifications > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 bg-destructive text-destructive-foreground text-xs rounded-full flex items-center justify-center">
                  {unreadNotifications}
                </span>
              )}
            </Button>
            <NotificationsPanel isOpen={showNotifications} onClose={() => setShowNotifications(false)} />
          </div>

          <Avatar
            className="w-10 h-10 cursor-pointer ring-2 ring-transparent hover:ring-primary transition-all"
            onClick={() => navigate("/profile")}
          >
            <AvatarImage src={currentUser.avatar} alt={currentUser.name} />
            <AvatarFallback>{currentUser.name.charAt(0)}</AvatarFallback>
          </Avatar>
        </div>
      </div>
    </header>
  );
};

export default Header;
