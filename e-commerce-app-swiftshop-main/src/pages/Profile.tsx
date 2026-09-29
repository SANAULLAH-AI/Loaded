
import { useState } from "react";
import Navbar from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { useTheme } from "@/context/ThemeContext";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/components/ui/use-toast";
import { useIsMobile } from "@/hooks/use-mobile";
import { Card, CardContent } from "@/components/ui/card";
import { User, Settings, ShoppingCart } from "lucide-react";

const Profile = () => {
  const { theme, toggleTheme } = useTheme();
  const { toast } = useToast();
  const isMobile = useIsMobile();
  
  const [profileData, setProfileData] = useState({
    firstName: "John",
    lastName: "Doe",
    email: "john.doe@example.com",
    phone: "123-456-7890",
  });
  
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({ ...profileData });
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  
  const handleSave = () => {
    setProfileData({ ...formData });
    setIsEditing(false);
    
    toast({
      title: "Profile Updated",
      description: "Your profile information has been updated successfully.",
    });
  };
  
  const handleCancel = () => {
    setFormData({ ...profileData });
    setIsEditing(false);
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Navbar />
      
      <main className="container mx-auto px-4 py-6 md:py-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-6">
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white">My Profile</h1>
          <div className="mt-2 md:mt-0 flex items-center">
            <span className="text-sm text-gray-500 dark:text-gray-400 mr-2">Login status: </span>
            <span className="text-red-500">Not logged in</span>
            <Button variant="outline" size="sm" className="ml-3">
              <User className="mr-2 h-4 w-4" /> Sign In
            </Button>
          </div>
        </div>
        
        {/* Mobile navigation cards */}
        {isMobile && (
          <div className="grid grid-cols-3 gap-2 mb-6">
            <Card className="p-2">
              <CardContent className="p-2 text-center">
                <User className="h-5 w-5 mx-auto mb-1" />
                <span className="text-xs">Profile</span>
              </CardContent>
            </Card>
            <Card className="p-2">
              <CardContent className="p-2 text-center">
                <ShoppingCart className="h-5 w-5 mx-auto mb-1" />
                <span className="text-xs">Orders</span>
              </CardContent>
            </Card>
            <Card className="p-2">
              <CardContent className="p-2 text-center">
                <Settings className="h-5 w-5 mx-auto mb-1" />
                <span className="text-xs">Settings</span>
              </CardContent>
            </Card>
          </div>
        )}
        
        <div className="max-w-3xl">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-4 md:p-6">
            <div className="flex justify-between items-center mb-4 md:mb-6">
              <h2 className="text-lg md:text-xl font-semibold text-gray-900 dark:text-white">
                Personal Information
              </h2>
              {!isEditing && (
                <Button 
                  variant="outline"
                  onClick={() => setIsEditing(true)}
                  size={isMobile ? "sm" : "default"}
                >
                  Edit
                </Button>
              )}
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
              <div className="space-y-2">
                <Label htmlFor="firstName">First Name</Label>
                <Input 
                  id="firstName" 
                  name="firstName" 
                  value={formData.firstName}
                  onChange={handleChange}
                  disabled={!isEditing}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="lastName">Last Name</Label>
                <Input 
                  id="lastName" 
                  name="lastName" 
                  value={formData.lastName}
                  onChange={handleChange}
                  disabled={!isEditing}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="email">Email Address</Label>
                <Input 
                  id="email" 
                  name="email" 
                  type="email" 
                  value={formData.email}
                  onChange={handleChange}
                  disabled={!isEditing}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="phone">Phone Number</Label>
                <Input 
                  id="phone" 
                  name="phone" 
                  value={formData.phone}
                  onChange={handleChange}
                  disabled={!isEditing}
                />
              </div>
            </div>
            
            {isEditing && (
              <div className="flex justify-end space-x-3 mt-4 md:mt-6">
                <Button 
                  variant="outline"
                  onClick={handleCancel}
                  size={isMobile ? "sm" : "default"}
                >
                  Cancel
                </Button>
                <Button 
                  className="btn-primary"
                  onClick={handleSave}
                  size={isMobile ? "sm" : "default"}
                >
                  Save Changes
                </Button>
              </div>
            )}
          </div>
          
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-4 md:p-6 mt-4 md:mt-6">
            <h2 className="text-lg md:text-xl font-semibold text-gray-900 dark:text-white mb-4 md:mb-6">
              Preferences
            </h2>
            
            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="theme-toggle">Dark Mode</Label>
                <p className="text-xs md:text-sm text-gray-500 dark:text-gray-400">
                  Toggle between light and dark mode
                </p>
              </div>
              <Switch 
                id="theme-toggle" 
                checked={theme === "dark"} 
                onCheckedChange={toggleTheme} 
              />
            </div>
            
            <Separator className="my-4 md:my-6" />
            
            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="notifications">Email Notifications</Label>
                <p className="text-xs md:text-sm text-gray-500 dark:text-gray-400">
                  Receive order updates and promotions
                </p>
              </div>
              <Switch id="notifications" defaultChecked />
            </div>

            <Separator className="my-4 md:my-6" />
            
            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="payment-methods">Save Payment Methods</Label>
                <p className="text-xs md:text-sm text-gray-500 dark:text-gray-400">
                  Securely save payment information for faster checkout
                </p>
              </div>
              <Switch id="payment-methods" />
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-4 md:p-6 mt-4 md:mt-6">
            <h2 className="text-lg md:text-xl font-semibold text-gray-900 dark:text-white mb-4">
              Contact Support
            </h2>
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
              Need help with your account or orders? Our support team is here to assist you.
            </p>
            <Button 
              variant="outline"
              className="w-full md:w-auto"
              onClick={() => window.location.href = "/contact"}
            >
              Contact Support
            </Button>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Profile;
