
import React, { useState, useRef } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Edit, Image, Upload, User, X } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { ScrollArea } from '@/components/ui/scroll-area';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/components/ui/use-toast';

interface AvatarSelectorProps {
  currentAvatar: string;
  onAvatarChange: (avatar: string) => void;
  userName: string;
}

// Verified avatars that exist in public/avatars
const avatarOptions = [
  '1', '2', '3', '4', '5', '6', '7', '8'
];

const AvatarSelector: React.FC<AvatarSelectorProps> = ({
  currentAvatar,
  onAvatarChange,
  userName,
}) => {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedAvatar, setSelectedAvatar] = useState(currentAvatar);
  const [customAvatarUrl, setCustomAvatarUrl] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState("gallery");
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const handleSave = () => {
    if (activeTab === "upload" && customAvatarUrl) {
      // If it's a custom avatar, we'd save it to local storage or a server
      // For this demo, we'll just pass the data URL
      onAvatarChange(customAvatarUrl);
      toast({
        title: "Custom Avatar Saved",
        description: "Your uploaded avatar has been set as your profile picture"
      });
    } else {
      // Default gallery avatars
      onAvatarChange(selectedAvatar);
      toast({
        title: "Avatar Updated",
        description: "Your profile picture has been updated"
      });
    }
    setDialogOpen(false);
  };
  
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        toast({
          title: "File too large",
          description: "Please select an image less than 2MB",
          variant: "destructive"
        });
        return;
      }
      
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          setCustomAvatarUrl(event.target.result as string);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const triggerFileUpload = () => {
    fileInputRef.current?.click();
  };

  const clearCustomAvatar = () => {
    setCustomAvatarUrl(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const getInitial = (name: string) => {
    return name?.charAt(0).toUpperCase() || 'U';
  };

  return (
    <>
      <div className="relative">
        <Avatar className="h-24 w-24 mx-auto">
          {currentAvatar.startsWith('data:') ? (
            <AvatarImage 
              src={currentAvatar} 
              alt={userName}
            />
          ) : (
            <AvatarImage 
              src={`/avatars/${currentAvatar}.png`} 
              alt={userName}
              onError={(e) => {
                // Hide the image on error
                e.currentTarget.style.display = 'none';
              }}
            />
          )}
          <AvatarFallback className="bg-primary text-primary-foreground text-2xl">
            {getInitial(userName)}
          </AvatarFallback>
        </Avatar>
        <Button 
          size="icon" 
          className="absolute bottom-0 right-0 rounded-full" 
          onClick={() => setDialogOpen(true)}
        >
          <Edit size={16} />
        </Button>
      </div>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="bg-disney-gray sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Choose an Avatar</DialogTitle>
          </DialogHeader>
          
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="gallery">Gallery</TabsTrigger>
              <TabsTrigger value="upload">Upload</TabsTrigger>
            </TabsList>
            
            <TabsContent value="gallery" className="pt-4">
              <ScrollArea className="h-72">
                <RadioGroup 
                  value={selectedAvatar} 
                  onValueChange={setSelectedAvatar}
                  className="grid grid-cols-4 gap-4"
                >
                  {avatarOptions.map((avatar) => (
                    <div key={avatar} className="text-center space-y-2">
                      <Label 
                        htmlFor={`avatar-${avatar}`} 
                        className="cursor-pointer flex flex-col items-center space-y-2"
                      >
                        <div className={`relative rounded-full overflow-hidden h-16 w-16 border-2 ${selectedAvatar === avatar ? 'border-primary' : 'border-transparent'}`}>
                          <img
                            src={`/avatars/${avatar}.png`}
                            alt={`Avatar ${avatar}`}
                            className="h-full w-full object-cover"
                            onError={(e) => {
                              e.currentTarget.src = 'https://via.placeholder.com/150?text=' + avatar;
                            }}
                          />
                        </div>
                        <RadioGroupItem
                          value={avatar}
                          id={`avatar-${avatar}`}
                          className="sr-only"
                        />
                      </Label>
                    </div>
                  ))}
                </RadioGroup>
              </ScrollArea>
            </TabsContent>
            
            <TabsContent value="upload" className="pt-4">
              <div className="flex flex-col items-center space-y-4">
                <div className="relative w-32 h-32">
                  {customAvatarUrl ? (
                    <div className="relative">
                      <img 
                        src={customAvatarUrl} 
                        alt="Custom Avatar" 
                        className="w-32 h-32 rounded-full object-cover"
                      />
                      <Button 
                        size="icon" 
                        variant="destructive" 
                        className="absolute -top-2 -right-2 h-6 w-6 rounded-full"
                        onClick={clearCustomAvatar}
                      >
                        <X size={14} />
                      </Button>
                    </div>
                  ) : (
                    <div className="w-32 h-32 rounded-full bg-disney-gray border-2 border-dashed border-gray-400 flex items-center justify-center">
                      <User size={48} className="text-gray-400" />
                    </div>
                  )}
                </div>
                
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileUpload}
                  accept="image/*"
                  className="hidden"
                />
                
                <Button 
                  variant="outline" 
                  onClick={triggerFileUpload} 
                  className="flex items-center"
                >
                  <Upload size={16} className="mr-2" />
                  {customAvatarUrl ? 'Change Image' : 'Upload Image'}
                </Button>
                
                <p className="text-xs text-gray-400 text-center">
                  Max file size: 2MB. <br />
                  Supported formats: JPEG, PNG, GIF
                </p>
              </div>
            </TabsContent>
          </Tabs>

          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSave}>
              Save
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default AvatarSelector;
