
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { UserRound, LogOut, ShoppingBag, CreditCard, Settings, ChevronRight, Heart, MapPin, Edit2, CircleUser } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Card } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "../contexts/AuthContext";
import { toast } from "sonner";

// Admin role check
const isAdmin = (email: string | undefined): boolean => {
  return email === "admin@example.com";
};

const ProfilePage: React.FC = () => {
  const navigate = useNavigate();
  const { user, isAuthenticated, logout } = useAuth();
  const [isEditProfileOpen, setIsEditProfileOpen] = useState(false);
  const [profileForm, setProfileForm] = useState({
    name: user?.name || "",
    email: user?.email || ""
  });
  
  const menuItems = [
    {
      icon: <ShoppingBag className="h-5 w-5" />,
      label: "My Orders",
      path: "/orders",
      requireAuth: true
    },
    {
      icon: <MapPin className="h-5 w-5" />,
      label: "My Addresses",
      path: "/addresses",
      requireAuth: true
    },
    {
      icon: <Heart className="h-5 w-5" />,
      label: "Wishlist",
      path: "/wishlist",
      requireAuth: true
    },
    {
      icon: <CreditCard className="h-5 w-5" />,
      label: "Payment Methods",
      path: "/payment-methods",
      requireAuth: true
    },
    {
      icon: <Settings className="h-5 w-5" />,
      label: "Settings",
      path: "/settings",
      requireAuth: false
    }
  ];

  // Add admin dashboard link if user is admin
  if (isAdmin(user?.email)) {
    menuItems.push({
      icon: <Settings className="h-5 w-5" />,
      label: "Admin Dashboard",
      path: "/admin",
      requireAuth: true
    });
  }
  
  const handleProfileFormChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setProfileForm(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    // In a real app, this would update the user profile
    toast.success("Profile updated successfully");
    setIsEditProfileOpen(false);
  };
  
  if (!isAuthenticated) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[80vh] p-4">
        <div className="text-center mb-8">
          <UserRound className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
          <h2 className="text-xl font-semibold mb-2">Sign in to your account</h2>
          <p className="text-muted-foreground mb-6">
            Sign in to view your profile, orders, and more
          </p>
        </div>
        
        <div className="w-full max-w-sm space-y-4">
          <Button className="w-full" onClick={() => navigate("/login")}>
            Sign In
          </Button>
          <Button variant="outline" className="w-full" onClick={() => navigate("/signup")}>
            Create Account
          </Button>
        </div>
      </div>
    );
  }
  
  return (
    <div className="pb-20">
      <div className="bg-primary text-primary-foreground p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <div className="h-16 w-16 rounded-full bg-primary-foreground/20 flex items-center justify-center mr-4">
              <UserRound className="h-8 w-8" />
            </div>
            <div>
              <h2 className="text-xl font-semibold">{user?.name}</h2>
              <p className="opacity-80">{user?.email}</p>
            </div>
          </div>
          <Button 
            variant="ghost" 
            size="icon" 
            className="h-8 w-8 bg-primary-foreground/20 rounded-full"
            onClick={() => setIsEditProfileOpen(true)}
          >
            <Edit2 className="h-4 w-4" />
          </Button>
        </div>
      </div>
      
      <div className="p-4">
        <Card className="mb-6">
          <div className="p-4">
            <h3 className="font-medium mb-3">Account</h3>
            
            {menuItems.map((item, index) => {
              if (item.requireAuth && !isAuthenticated) return null;
              
              return (
                <React.Fragment key={item.label}>
                  <Button
                    variant="ghost"
                    className="w-full justify-between font-normal h-12"
                    onClick={() => navigate(item.path)}
                  >
                    <div className="flex items-center">
                      {item.icon}
                      <span className="ml-3">{item.label}</span>
                    </div>
                    <ChevronRight className="h-5 w-5 text-muted-foreground" />
                  </Button>
                  {index < menuItems.length - 1 && <Separator />}
                </React.Fragment>
              );
            })}
          </div>
        </Card>
        
        <Button
          variant="outline"
          className="w-full"
          onClick={() => {
            logout();
            navigate("/");
          }}
        >
          <LogOut className="mr-2 h-5 w-5" />
          Sign Out
        </Button>
      </div>
      
      {/* Edit Profile Dialog */}
      <Dialog open={isEditProfileOpen} onOpenChange={setIsEditProfileOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Profile</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSaveProfile} className="space-y-4">
            <div className="flex justify-center mb-4">
              <div className="relative">
                <div className="h-24 w-24 rounded-full bg-muted flex items-center justify-center">
                  <CircleUser className="h-16 w-16 text-muted-foreground" />
                </div>
                <Button 
                  type="button"
                  size="icon"
                  variant="secondary"
                  className="h-8 w-8 rounded-full absolute bottom-0 right-0 shadow"
                >
                  <Edit2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="name">Full Name</Label>
              <Input
                id="name"
                name="name"
                value={profileForm.name}
                onChange={handleProfileFormChange}
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                name="email"
                type="email"
                value={profileForm.email}
                onChange={handleProfileFormChange}
                required
              />
            </div>
            
            <div className="flex justify-end space-x-2">
              <Button 
                type="button" 
                variant="outline" 
                onClick={() => setIsEditProfileOpen(false)}
              >
                Cancel
              </Button>
              <Button type="submit">Save Changes</Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ProfilePage;
