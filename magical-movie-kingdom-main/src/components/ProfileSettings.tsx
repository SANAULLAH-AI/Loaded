
import React, { useState } from 'react';
import { useToast } from '@/components/ui/use-toast';
import ThemeToggle from './ThemeToggle';
import LanguageSelector from './LanguageSelector';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Settings, ExternalLink } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface ProfileSettingsProps {
  onSave: (settings: any) => void;
  initialSettings: {
    language: string;
    isDarkMode: boolean;
    autoplay: boolean;
    notifications: boolean;
    dataUsage: 'auto' | 'high' | 'medium' | 'low';
    parentalControls: boolean;
  };
}

const ProfileSettings: React.FC<ProfileSettingsProps> = ({
  onSave,
  initialSettings,
}) => {
  const [settings, setSettings] = useState(initialSettings);
  const { toast } = useToast();

  const handleLanguageChange = (language: string) => {
    setSettings({ ...settings, language });
    toast({
      title: "Language Updated",
      description: `Interface language changed to ${language}`,
    });
  };

  const handleThemeToggle = () => {
    setSettings({ ...settings, isDarkMode: !settings.isDarkMode });
  };

  const handleSwitchChange = (key: string, value: boolean) => {
    setSettings({ ...settings, [key]: value });
  };
  
  const handleDataUsageChange = (value: string) => {
    setSettings({ ...settings, dataUsage: value as 'auto' | 'high' | 'medium' | 'low' });
  };

  const connectGoogle = () => {
    // In a real app, we would implement OAuth flow here
    toast({
      title: "Google Connection",
      description: "Connecting to Google account...",
    });
    
    // Simulate OAuth success after a delay
    setTimeout(() => {
      toast({
        title: "Connected to Google",
        description: "Your Google account has been successfully linked",
      });
    }, 1500);
  };

  const saveSettings = () => {
    onSave(settings);
    toast({
      title: "Settings Saved",
      description: "Your profile settings have been updated",
    });
  };

  return (
    <Card className="bg-disney-gray border-0">
      <CardHeader>
        <CardTitle className="flex items-center">
          <Settings className="mr-2" />
          Profile Settings
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex flex-col space-y-1">
          <Label>Interface Language</Label>
          <LanguageSelector 
            currentLanguage={settings.language} 
            onLanguageChange={handleLanguageChange} 
          />
        </div>
        
        <div className="flex flex-col space-y-1">
          <Label>Theme</Label>
          <ThemeToggle 
            isDarkMode={settings.isDarkMode} 
            onToggleTheme={handleThemeToggle} 
          />
        </div>
        
        <div className="flex flex-col space-y-1">
          <Label htmlFor="dataUsage">Data Usage</Label>
          <Select 
            value={settings.dataUsage} 
            onValueChange={handleDataUsageChange}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select data usage" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="auto">Auto (Recommended)</SelectItem>
              <SelectItem value="high">High Quality</SelectItem>
              <SelectItem value="medium">Medium Quality</SelectItem>
              <SelectItem value="low">Data Saver</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <div className="flex items-center justify-between">
          <Label htmlFor="autoplay">Autoplay Videos</Label>
          <Switch 
            id="autoplay"
            checked={settings.autoplay}
            onCheckedChange={(value) => handleSwitchChange('autoplay', value)}
          />
        </div>
        
        <div className="flex items-center justify-between">
          <Label htmlFor="notifications">Enable Notifications</Label>
          <Switch 
            id="notifications"
            checked={settings.notifications}
            onCheckedChange={(value) => handleSwitchChange('notifications', value)}
          />
        </div>
        
        <div className="flex items-center justify-between">
          <Label htmlFor="parental">Parental Controls</Label>
          <Switch 
            id="parental"
            checked={settings.parentalControls}
            onCheckedChange={(value) => handleSwitchChange('parentalControls', value)}
          />
        </div>
        
        <div className="pt-4">
          <Button 
            variant="outline" 
            className="w-full flex items-center justify-center" 
            onClick={connectGoogle}
          >
            <div className="flex items-center justify-center">
              <span className="mr-2 h-4 w-4 flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 488 512" className="h-4 w-4">
                  <path fill="#4285F4" d="M488 261.8C488 403.3 391.1 504 248 504 110.8 504 0 393.2 0 256S110.8 8 248 8c66.8 0 123 24.5 166.3 64.9l-67.5 64.9C258.5 52.6 94.3 116.6 94.3 256c0 86.5 69.1 156.6 153.7 156.6 98.2 0 135-70.4 140.8-106.9H248v-85.3h236.1c2.3 12.7 3.9 24.9 3.9 41.4z"/>
                </svg>
              </span>
              Connect with Google
            </div>
          </Button>
        </div>
        
        <div className="pt-2">
          <Button className="w-full" onClick={saveSettings}>
            Save Settings
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default ProfileSettings;
