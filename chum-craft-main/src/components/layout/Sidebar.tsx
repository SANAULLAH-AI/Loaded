import { Home, Users, Clock, Bookmark, Calendar, ChevronDown, Settings, LogOut } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { currentUser } from "@/data/dummyData";
import { useState } from "react";

const Sidebar = () => {
  const [showMore, setShowMore] = useState(false);

  const menuItems = [
    { icon: Home, label: "Feed", active: true },
    { icon: Users, label: "Friends" },
    { icon: Clock, label: "Memories" },
    { icon: Bookmark, label: "Saved" },
    { icon: Calendar, label: "Events" },
  ];

  const additionalItems = [
    { icon: Settings, label: "Settings" },
    { icon: LogOut, label: "Logout" },
  ];

  return (
    <aside className="hidden lg:block w-[280px] h-[calc(100vh-56px)] sticky top-14 overflow-y-auto scrollbar-hide p-4">
      <nav className="space-y-1">
        {/* Profile Link */}
        <Button
          variant="ghost"
          className="w-full justify-start gap-3 h-12 px-2 hover:bg-secondary rounded-lg group"
        >
          <Avatar className="w-9 h-9 ring-2 ring-primary/20 group-hover:ring-primary transition-all">
            <AvatarImage src={currentUser.avatar} alt={currentUser.name} />
            <AvatarFallback>{currentUser.name.charAt(0)}</AvatarFallback>
          </Avatar>
          <span className="font-semibold">{currentUser.name}</span>
        </Button>

        {/* Menu Items */}
        {menuItems.map((item, index) => (
          <Button
            key={index}
            variant="ghost"
            className={`w-full justify-start gap-3 h-12 px-2 rounded-lg transition-all ${
              item.active
                ? "bg-accent text-accent-foreground font-medium"
                : "hover:bg-secondary text-foreground"
            }`}
          >
            <div
              className={`w-9 h-9 rounded-full flex items-center justify-center ${
                item.active ? "bg-primary text-primary-foreground" : "bg-secondary"
              }`}
            >
              <item.icon className="w-5 h-5" />
            </div>
            <span>{item.label}</span>
          </Button>
        ))}

        {/* See More Button */}
        <Button
          variant="ghost"
          onClick={() => setShowMore(!showMore)}
          className="w-full justify-start gap-3 h-12 px-2 hover:bg-secondary rounded-lg"
        >
          <div className="w-9 h-9 rounded-full bg-secondary flex items-center justify-center">
            <ChevronDown
              className={`w-5 h-5 transition-transform duration-200 ${showMore ? "rotate-180" : ""}`}
            />
          </div>
          <span>{showMore ? "See Less" : "See More"}</span>
        </Button>

        {/* Additional Items */}
        {showMore && (
          <div className="animate-fade-in space-y-1">
            {additionalItems.map((item, index) => (
              <Button
                key={index}
                variant="ghost"
                className="w-full justify-start gap-3 h-12 px-2 hover:bg-secondary rounded-lg"
              >
                <div className="w-9 h-9 rounded-full bg-secondary flex items-center justify-center">
                  <item.icon className="w-5 h-5" />
                </div>
                <span>{item.label}</span>
              </Button>
            ))}
          </div>
        )}
      </nav>

      {/* Footer */}
      <div className="mt-6 pt-4 border-t border-border">
        <p className="text-xs text-muted-foreground px-2">
          Privacy · Terms · Advertising · Cookies ·{" "}
          <span className="block mt-1">Socialink © 2024</span>
        </p>
      </div>
    </aside>
  );
};

export default Sidebar;
