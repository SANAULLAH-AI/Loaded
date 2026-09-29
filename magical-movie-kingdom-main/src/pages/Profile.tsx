
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Edit, Trash2, Plus, Settings } from 'lucide-react';
import { useUser, UserSettings } from '@/context/UserContext';
import { getFromStorage, FAV_KEY, HIST_KEY, DOWN_KEY } from '@/services/api';
import Header from '@/components/Header';
import MovieCard from '@/components/MovieCard';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { useToast } from '@/components/ui/use-toast';
import AvatarSelector from '@/components/AvatarSelector';
import ProfileSettings from '@/components/ProfileSettings';

const avatarOptions = [
  '1', '2', '3', '4', '5', '6', '7', '8'
];

const Profile = () => {
  const { 
    currentUser, 
    setCurrentUser, 
    users, 
    addUser, 
    removeUser, 
    updateUser,
    updateUserSettings,
    logout,
    googleLogin
  } = useUser();
  const [favorites, setFavorites] = useState(getFromStorage(FAV_KEY) || []);
  const [history, setHistory] = useState(getFromStorage(HIST_KEY) || []);
  const [downloads, setDownloads] = useState(getFromStorage(DOWN_KEY) || []);
  const [createProfileOpen, setCreateProfileOpen] = useState(false);
  const [editProfileOpen, setEditProfileOpen] = useState(false);
  const [profileName, setProfileName] = useState('');
  const [selectedAvatar, setSelectedAvatar] = useState('1');
  const [isKidsProfile, setIsKidsProfile] = useState(false);
  const [activeTab, setActiveTab] = useState('profiles');
  const [settingsOpen, setSettingsOpen] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();

  // Handle profile selection
  const selectProfile = (profile) => {
    setCurrentUser(profile);
    toast({
      title: "Profile Selected",
      description: `Switched to ${profile.name}'s profile`,
    });
  };

  // Handle creating new profile
  const handleCreateProfile = () => {
    const newProfile = {
      id: Date.now().toString(),
      name: profileName,
      avatar: selectedAvatar,
      isKidsProfile,
      settings: {
        language: 'en',
        isDarkMode: true,
        autoplay: true,
        notifications: true,
        dataUsage: 'auto',
        parentalControls: isKidsProfile,
      } as UserSettings
    };
    addUser(newProfile);
    setProfileName('');
    setSelectedAvatar('1');
    setIsKidsProfile(false);
    setCreateProfileOpen(false);
    toast({
      title: "Profile Created",
      description: `${profileName}'s profile has been created`,
    });
  };

  // Handle editing profile
  const handleEditProfile = () => {
    if (currentUser) {
      updateUser(currentUser.id, {
        name: profileName,
        avatar: selectedAvatar,
        isKidsProfile
      });
      
      setEditProfileOpen(false);
      toast({
        title: "Profile Updated",
        description: `${profileName}'s profile has been updated`,
      });
    }
  };

  // Open edit profile dialog
  const openEditProfile = () => {
    if (currentUser) {
      setProfileName(currentUser.name);
      setSelectedAvatar(currentUser.avatar);
      setIsKidsProfile(currentUser.isKidsProfile);
      setEditProfileOpen(true);
    }
  };

  // Handle profile deletion
  const handleDeleteProfile = () => {
    if (currentUser) {
      const profileName = currentUser.name;
      removeUser(currentUser.id);
      toast({
        title: "Profile Deleted",
        description: `${profileName}'s profile has been deleted`,
      });
    }
  };

  // Handle avatar change
  const handleAvatarChange = (avatar: string) => {
    if (currentUser) {
      updateUser(currentUser.id, { avatar });
      setSelectedAvatar(avatar);
      toast({
        title: "Avatar Updated",
        description: "Your profile picture has been updated",
      });
    }
  };

  // Handle settings update
  const handleSettingsUpdate = (settings: Partial<UserSettings>) => {
    if (currentUser) {
      updateUserSettings(currentUser.id, settings);
    }
  };

  // Handle Google login
  const handleGoogleLogin = () => {
    googleLogin();
  };

  // Handle logout
  const handleLogout = () => {
    logout();
    navigate('/login');
    toast({
      title: "Logged Out",
      description: "You have been logged out successfully",
    });
  };

  return (
    <div className="min-h-screen bg-disney-dark">
      <Header />
      
      <div className="container mx-auto px-6 pt-24 pb-12">
        <h1 className="text-3xl font-bold mb-6">My Disney+</h1>
        
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="mb-6">
            <TabsTrigger value="profiles">Profiles</TabsTrigger>
            <TabsTrigger value="favorites">Favorites</TabsTrigger>
            <TabsTrigger value="watchlist">Watchlist</TabsTrigger>
            <TabsTrigger value="downloads">Downloads</TabsTrigger>
            <TabsTrigger value="history">Watch History</TabsTrigger>
            {currentUser && (
              <TabsTrigger value="settings" onClick={() => setSettingsOpen(true)}>
                <Settings className="mr-1 h-4 w-4" />
                Settings
              </TabsTrigger>
            )}
          </TabsList>
          
          {/* Profiles Tab */}
          <TabsContent value="profiles" className="pt-4">
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
              {/* List existing profiles */}
              {users.map((profile) => (
                <div 
                  key={profile.id}
                  className={`text-center cursor-pointer transition-all ${
                    currentUser?.id === profile.id ? 'scale-105 ring-2 ring-primary rounded-lg p-2' : ''
                  }`}
                  onClick={() => selectProfile(profile)}
                >
                  <div className="aspect-square rounded-full overflow-hidden mb-3 border-4 border-transparent hover:border-primary transition-colors">
                    <img 
                      src={`/avatars/${profile.avatar || '1'}.png`} 
                      alt={profile.name}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        // Fallback if image fails to load
                        e.currentTarget.src = 'https://via.placeholder.com/150?text=' + profile.name.charAt(0);
                      }}
                    />
                  </div>
                  <p className="font-medium">{profile.name}</p>
                  {profile.isKidsProfile && (
                    <span className="text-xs bg-blue-500 text-white px-2 py-1 rounded-full mt-1 inline-block">
                      Kids
                    </span>
                  )}
                </div>
              ))}
              
              {/* Add profile button */}
              {users.length < 7 && (
                <div 
                  className="text-center cursor-pointer"
                  onClick={() => setCreateProfileOpen(true)}
                >
                  <div className="aspect-square rounded-full mb-3 bg-disney-gray flex items-center justify-center">
                    <Plus size={48} className="text-gray-400" />
                  </div>
                  <p className="font-medium">Add Profile</p>
                </div>
              )}
            </div>
            
            {/* Profile Actions */}
            {currentUser && (
              <div className="mt-12 flex flex-wrap gap-4">
                <Button onClick={openEditProfile} className="flex items-center">
                  <Edit size={16} className="mr-2" />
                  Edit Profile
                </Button>
                <Button variant="outline" onClick={handleDeleteProfile} className="flex items-center">
                  <Trash2 size={16} className="mr-2" />
                  Delete Profile
                </Button>
                <Button 
                  variant="outline" 
                  onClick={() => setSettingsOpen(true)}
                  className="flex items-center"
                >
                  <Settings size={16} className="mr-2" />
                  Settings
                </Button>
                <Button 
                  variant="outline" 
                  onClick={handleLogout}
                  className="ml-auto"
                >
                  Logout
                </Button>
              </div>
            )}
          </TabsContent>
          
          {/* Favorites Tab */}
          <TabsContent value="favorites" className="pt-4">
            {favorites.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-gray-400">You haven't added any favorites yet</p>
                <Button 
                  variant="default" 
                  className="mt-4"
                  onClick={() => navigate('/')}
                >
                  Browse Content
                </Button>
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
                {favorites.map((movie) => (
                  <MovieCard key={movie.id} movie={movie} />
                ))}
              </div>
            )}
          </TabsContent>
          
          {/* Watchlist Tab */}
          <TabsContent value="watchlist" className="pt-4">
            <div className="text-center py-12">
              <p className="text-gray-400">Your watchlist is empty</p>
              <Button 
                variant="default" 
                className="mt-4"
                onClick={() => navigate('/')}
              >
                Browse Content
              </Button>
            </div>
          </TabsContent>
          
          {/* Downloads Tab */}
          <TabsContent value="downloads" className="pt-4">
            {downloads.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-gray-400">You haven't downloaded any content yet</p>
                <Button 
                  variant="default" 
                  className="mt-4"
                  onClick={() => navigate('/')}
                >
                  Browse Content
                </Button>
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
                {downloads.map((movie) => (
                  <MovieCard key={movie.id} movie={movie} />
                ))}
              </div>
            )}
          </TabsContent>
          
          {/* History Tab */}
          <TabsContent value="history" className="pt-4">
            {history.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-gray-400">You haven't watched anything yet</p>
                <Button 
                  variant="default" 
                  className="mt-4"
                  onClick={() => navigate('/')}
                >
                  Browse Content
                </Button>
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
                {history.map((movie) => (
                  <MovieCard key={movie.id} movie={movie} />
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
      
      {/* Settings Dialog */}
      <Dialog open={settingsOpen} onOpenChange={setSettingsOpen}>
        <DialogContent className="bg-disney-gray sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Profile Settings</DialogTitle>
          </DialogHeader>
          
          {currentUser && (
            <div className="py-4">
              <div className="mb-6 flex flex-col items-center">
                <AvatarSelector 
                  currentAvatar={currentUser.avatar} 
                  onAvatarChange={handleAvatarChange}
                  userName={currentUser.name}
                />
                <h2 className="mt-4 text-xl font-semibold">{currentUser.name}</h2>
              </div>
              
              <ProfileSettings
                initialSettings={currentUser.settings || {
                  language: 'en',
                  isDarkMode: true,
                  autoplay: true,
                  notifications: true,
                  dataUsage: 'auto',
                  parentalControls: currentUser.isKidsProfile,
                }}
                onSave={handleSettingsUpdate}
              />
            </div>
          )}
          
          <DialogFooter className="flex justify-between">
            <Button variant="outline" onClick={() => setSettingsOpen(false)}>Close</Button>
            <Button variant="outline" onClick={handleGoogleLogin}>Connect Google</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Create Profile Dialog */}
      <Dialog open={createProfileOpen} onOpenChange={setCreateProfileOpen}>
        <DialogContent className="bg-disney-gray">
          <DialogHeader>
            <DialogTitle>Create Profile</DialogTitle>
          </DialogHeader>
          
          <div className="grid gap-4 py-4">
            <div className="flex flex-col items-center mb-4">
              <div className="relative w-24 h-24">
                <img 
                  src={`/avatars/${selectedAvatar}.png`} 
                  alt="Avatar"
                  className="w-full h-full rounded-full object-cover"
                  onError={(e) => {
                    e.currentTarget.src = 'https://via.placeholder.com/150?text=?';
                  }}
                />
                <Button 
                  size="icon"
                  variant="outline" 
                  className="absolute bottom-0 right-0 rounded-full"
                  onClick={() => {
                    // Cycle through avatar options
                    const currentIndex = avatarOptions.indexOf(selectedAvatar);
                    const nextIndex = (currentIndex + 1) % avatarOptions.length;
                    setSelectedAvatar(avatarOptions[nextIndex]);
                  }}
                >
                  <Edit size={16} />
                </Button>
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                value={profileName}
                onChange={(e) => setProfileName(e.target.value)}
                placeholder="Enter profile name"
                className="bg-disney-dark"
              />
            </div>
            
            <div className="flex items-center space-x-2">
              <Switch
                checked={isKidsProfile}
                onCheckedChange={setIsKidsProfile}
                id="kids-profile"
              />
              <Label htmlFor="kids-profile">Kids Profile</Label>
            </div>
          </div>
          
          <DialogFooter>
            <Button 
              variant="outline" 
              onClick={() => setCreateProfileOpen(false)}
            >
              Cancel
            </Button>
            <Button 
              onClick={handleCreateProfile} 
              disabled={!profileName.trim()}
            >
              Create
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Edit Profile Dialog */}
      <Dialog open={editProfileOpen} onOpenChange={setEditProfileOpen}>
        <DialogContent className="bg-disney-gray">
          <DialogHeader>
            <DialogTitle>Edit Profile</DialogTitle>
          </DialogHeader>
          
          <div className="grid gap-4 py-4">
            <div className="flex flex-col items-center mb-4">
              <div className="relative w-24 h-24">
                <img 
                  src={`/avatars/${selectedAvatar}.png`}
                  alt="Avatar"
                  className="w-full h-full rounded-full object-cover"
                  onError={(e) => {
                    e.currentTarget.src = 'https://via.placeholder.com/150?text=?';
                  }}
                />
                <Button 
                  size="icon"
                  variant="outline" 
                  className="absolute bottom-0 right-0 rounded-full"
                  onClick={() => {
                    // Cycle through avatar options
                    const currentIndex = avatarOptions.indexOf(selectedAvatar);
                    const nextIndex = (currentIndex + 1) % avatarOptions.length;
                    setSelectedAvatar(avatarOptions[nextIndex]);
                  }}
                >
                  <Edit size={16} />
                </Button>
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="edit-name">Name</Label>
              <Input
                id="edit-name"
                value={profileName}
                onChange={(e) => setProfileName(e.target.value)}
                placeholder="Enter profile name"
                className="bg-disney-dark"
              />
            </div>
            
            <div className="flex items-center space-x-2">
              <Switch
                checked={isKidsProfile}
                onCheckedChange={setIsKidsProfile}
                id="edit-kids-profile"
              />
              <Label htmlFor="edit-kids-profile">Kids Profile</Label>
            </div>
          </div>
          
          <DialogFooter>
            <Button 
              variant="outline" 
              onClick={() => setEditProfileOpen(false)}
            >
              Cancel
            </Button>
            <Button 
              onClick={handleEditProfile} 
              disabled={!profileName.trim()}
            >
              Save Changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Profile;
