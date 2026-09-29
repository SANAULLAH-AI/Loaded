import { useState } from "react";
import { X, ThumbsUp, MessageCircle, Share2, UserPlus, Gift, AtSign, Check } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { notifications as initialNotifications, Notification } from "@/data/dummyData";

interface NotificationsPanelProps {
  isOpen: boolean;
  onClose: () => void;
}

const NotificationsPanel = ({ isOpen, onClose }: NotificationsPanelProps) => {
  const [notificationsList, setNotificationsList] = useState<Notification[]>(initialNotifications);

  const markAllAsRead = () => {
    setNotificationsList(notificationsList.map(n => ({ ...n, read: true })));
  };

  const unreadCount = notificationsList.filter(n => !n.read).length;

  const getNotificationIcon = (type: Notification["type"]) => {
    switch (type) {
      case "like":
        return <ThumbsUp className="w-4 h-4 text-primary" />;
      case "comment":
        return <MessageCircle className="w-4 h-4 text-success" />;
      case "share":
        return <Share2 className="w-4 h-4 text-share" />;
      case "friend_request":
        return <UserPlus className="w-4 h-4 text-primary" />;
      case "birthday":
        return <Gift className="w-4 h-4 text-love" />;
      case "mention":
        return <AtSign className="w-4 h-4 text-primary" />;
      default:
        return null;
    }
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 z-40"
        onClick={onClose}
      />

      {/* Panel */}
      <div className="absolute top-full right-0 mt-2 w-[360px] bg-card rounded-xl shadow-social-lg border border-border z-50 animate-fade-in overflow-hidden">
        <div className="flex items-center justify-between p-4 border-b border-border">
          <h3 className="font-bold text-xl">Notifications</h3>
          <div className="flex gap-2">
            {unreadCount > 0 && (
              <Button
                variant="ghost"
                size="sm"
                onClick={markAllAsRead}
                className="text-primary hover:text-primary-hover"
              >
                <Check className="w-4 h-4 mr-1" />
                Mark all read
              </Button>
            )}
            <Button variant="ghost" size="icon" onClick={onClose} className="rounded-full">
              <X className="w-4 h-4" />
            </Button>
          </div>
        </div>

        <ScrollArea className="h-[400px]">
          <div className="p-2">
            {notificationsList.map((notification) => (
              <div
                key={notification.id}
                className={`flex items-start gap-3 p-3 rounded-lg cursor-pointer transition-colors ${
                  notification.read
                    ? "hover:bg-secondary"
                    : "bg-accent hover:bg-accent/80"
                }`}
                onClick={() => {
                  setNotificationsList(
                    notificationsList.map(n =>
                      n.id === notification.id ? { ...n, read: true } : n
                    )
                  );
                }}
              >
                <div className="relative">
                  <Avatar className="w-12 h-12">
                    <AvatarImage src={notification.user.avatar} alt={notification.user.name} />
                    <AvatarFallback>{notification.user.name.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <div className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-card flex items-center justify-center">
                    {getNotificationIcon(notification.type)}
                  </div>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm">
                    <span className="font-semibold">{notification.user.name}</span>{" "}
                    <span className="text-muted-foreground">{notification.content}</span>
                  </p>
                  <p className={`text-xs mt-1 ${notification.read ? "text-muted-foreground" : "text-primary font-medium"}`}>
                    {notification.createdAt}
                  </p>
                </div>
                {!notification.read && (
                  <div className="w-3 h-3 rounded-full bg-primary flex-shrink-0 mt-2" />
                )}
              </div>
            ))}
          </div>
        </ScrollArea>

        <div className="p-3 border-t border-border">
          <Button variant="ghost" className="w-full text-primary hover:text-primary-hover">
            See All Notifications
          </Button>
        </div>
      </div>
    </>
  );
};

export default NotificationsPanel;
