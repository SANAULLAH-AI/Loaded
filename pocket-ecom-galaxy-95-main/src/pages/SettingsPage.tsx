
import React from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { 
  ArrowLeft, 
  Bell, 
  ShieldCheck, 
  HelpCircle, 
  LogOut,
  Sun,
  Moon
} from "lucide-react";
import { useTheme } from "../contexts/ThemeContext";
import { useAuth } from "../contexts/AuthContext";

const SettingsPage: React.FC = () => {
  const navigate = useNavigate();
  const { theme, toggleTheme } = useTheme();
  const { logout } = useAuth();

  const handleSignOut = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="pb-20">
      <div className="sticky top-0 bg-background z-10 p-4 flex items-center shadow-sm">
        <Button variant="ghost" size="icon" onClick={() => navigate(-1)}>
          <ArrowLeft />
        </Button>
        <h1 className="text-lg font-semibold ml-2">Settings</h1>
      </div>

      <div className="p-4 space-y-4">
        <Card className="overflow-hidden border border-border/30">
          <CardHeader className="bg-muted/30">
            <CardTitle>Appearance</CardTitle>
            <CardDescription>Customize how the app looks</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4 pt-4">
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-3">
                {theme === 'dark' ? (
                  <Moon className="h-5 w-5 text-blue-400" />
                ) : (
                  <Sun className="h-5 w-5 text-yellow-400" />
                )}
                <div>
                  <p className="font-medium">{theme === 'dark' ? 'Dark' : 'Light'} Mode</p>
                  <p className="text-sm text-muted-foreground">
                    {theme === 'dark' 
                      ? 'Switch to light mode' 
                      : 'Switch to dark mode'}
                  </p>
                </div>
              </div>
              <Switch 
                checked={theme === 'dark'}
                onCheckedChange={toggleTheme}
                className="data-[state=checked]:bg-blue-600"
              />
            </div>
          </CardContent>
        </Card>

        <Card className="overflow-hidden border border-border/30">
          <CardHeader className="bg-muted/30">
            <CardTitle>Notifications</CardTitle>
            <CardDescription>Manage notification preferences</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4 pt-4">
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-3">
                <Bell className="h-5 w-5 text-blue-500" />
                <div>
                  <p className="font-medium">Push Notifications</p>
                  <p className="text-sm text-muted-foreground">Get alerts on your device</p>
                </div>
              </div>
              <Switch defaultChecked className="data-[state=checked]:bg-blue-600" />
            </div>
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-3">
                <Bell className="h-5 w-5 text-blue-500" />
                <div>
                  <p className="font-medium">Email Notifications</p>
                  <p className="text-sm text-muted-foreground">Receive updates in your inbox</p>
                </div>
              </div>
              <Switch defaultChecked className="data-[state=checked]:bg-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card className="overflow-hidden border border-border/30">
          <CardHeader className="bg-muted/30">
            <CardTitle>Support & About</CardTitle>
            <CardDescription>Help and information</CardDescription>
          </CardHeader>
          <CardContent className="space-y-2 pt-4">
            <Button variant="ghost" className="w-full justify-start" onClick={() => navigate("/privacy-policy")}>
              <ShieldCheck className="h-5 w-5 mr-3 text-blue-500" />
              Privacy Policy
            </Button>
            <Button variant="ghost" className="w-full justify-start" onClick={() => navigate("/help")}>
              <HelpCircle className="h-5 w-5 mr-3 text-blue-500" />
              Help & Support
            </Button>
            <Button variant="ghost" className="w-full justify-start text-destructive" onClick={handleSignOut}>
              <LogOut className="h-5 w-5 mr-3" />
              Sign Out
            </Button>
          </CardContent>
        </Card>

        <p className="text-center text-muted-foreground text-sm pt-2">
          Shoppy v1.0.0
        </p>
      </div>
    </div>
  );
};

export default SettingsPage;
