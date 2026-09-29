import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Switch,
  Image,
  TextInput,
  Modal,
  Platform,
  ActivityIndicator,
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { Settings, Bell, Lock, Shield, UserCog, Globe as Globe2, CircleHelp, Info, LogOut, ChevronRight, Camera, Image as ImageIcon, Video as VideoIcon, Share2, Users, Heart, MessageCircle, Bookmark, Eye, EyeOff, UserPlus } from 'lucide-react-native';
import { useTheme } from '@/context/ThemeContext';
import { useAuth } from '@/context/AuthContext';
import { router } from 'expo-router';

export default function SettingsScreen() {
  const { colors, theme, setTheme } = useTheme();
  const { signOut, user } = useAuth();
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [showNewPostModal, setShowNewPostModal] = useState(false);
  const [postText, setPostText] = useState('');
  const [selectedMedia, setSelectedMedia] = useState<string | null>(null);
  const [mediaType, setMediaType] = useState<'image' | 'video' | null>(null);
  const [isPosting, setIsPosting] = useState(false);
  const [profileImage, setProfileImage] = useState(user?.photoUrl);
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [privacySettings, setPrivacySettings] = useState({
    profileVisibility: 'everyone',
    showOnlineStatus: true,
    allowTagging: true,
    showLastSeen: true,
  });

  const pickImage = async (type: 'profile' | 'post') => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: type === 'post' ? ImagePicker.MediaTypeOptions.All : ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: type === 'profile' ? [1, 1] : [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      if (type === 'profile') {
        setProfileImage(result.assets[0].uri);
        handleUpdateProfile(result.assets[0].uri);
      } else {
        setSelectedMedia(result.assets[0].uri);
        setMediaType(result.assets[0].type === 'video' ? 'video' : 'image');
      }
    }
  };

  const handleUpdateProfile = async (imageUri: string) => {
    try {
      // Simulate profile update
      await new Promise(resolve => setTimeout(resolve, 1000));
      // In a real app, you would upload the image and update the user profile
      console.log('Profile updated with image:', imageUri);
    } catch (error) {
      console.error('Error updating profile:', error);
    }
  };

  const handleCreatePost = async () => {
    if (!postText && !selectedMedia) return;

    setIsPosting(true);
    try {
      // Simulate post creation
      await new Promise(resolve => setTimeout(resolve, 1500));
      // In a real app, you would upload the media and create the post
      console.log('Post created:', { text: postText, media: selectedMedia, type: mediaType });
      setShowNewPostModal(false);
      setPostText('');
      setSelectedMedia(null);
      setMediaType(null);
    } catch (error) {
      console.error('Error creating post:', error);
    } finally {
      setIsPosting(false);
    }
  };

  const handleSignOut = async () => {
    try {
      await signOut();
      router.replace('/login');
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  const renderSection = (title: string, children: React.ReactNode) => (
    <View style={[styles.section, { backgroundColor: colors.card }]}>
      <Text style={[styles.sectionTitle, { color: colors.text }]}>{title}</Text>
      {children}
    </View>
  );

  return (
    <ScrollView style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Profile Section */}
      <View style={[styles.profileSection, { backgroundColor: colors.card }]}>
        <TouchableOpacity onPress={() => setShowProfileModal(true)} style={styles.profileImageContainer}>
          <Image
            source={{ uri: profileImage }}
            style={styles.profileImage}
          />
          <View style={[styles.editProfileButton, { backgroundColor: colors.primary }]}>
            <Camera size={16} color="#FFFFFF" />
          </View>
        </TouchableOpacity>
        <Text style={[styles.userName, { color: colors.text }]}>{user?.name}</Text>
        <Text style={[styles.userEmail, { color: colors.text }]}>{user?.email}</Text>
      </View>

      {/* Create Post Button */}
      <TouchableOpacity
        style={[styles.createPostButton, { backgroundColor: colors.primary }]}
        onPress={() => setShowNewPostModal(true)}
      >
        <Text style={styles.createPostButtonText}>Create New Post</Text>
      </TouchableOpacity>

      {/* Quick Actions */}
      {renderSection('Quick Actions', (
        <View style={styles.quickActions}>
          <TouchableOpacity style={styles.quickAction}>
            <Heart size={24} color={colors.primary} />
            <Text style={[styles.quickActionText, { color: colors.text }]}>Liked Posts</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.quickAction}>
            <Bookmark size={24} color={colors.primary} />
            <Text style={[styles.quickActionText, { color: colors.text }]}>Saved Items</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.quickAction}>
            <Users size={24} color={colors.primary} />
            <Text style={[styles.quickActionText, { color: colors.text }]}>Close Friends</Text>
          </TouchableOpacity>
        </View>
      ))}

      {/* Privacy Settings */}
      {renderSection('Privacy & Security', (
        <>
          <TouchableOpacity style={styles.settingItem}>
            <View style={styles.settingItemLeft}>
              <Eye size={24} color={colors.primary} />
              <Text style={[styles.settingText, { color: colors.text }]}>Profile Visibility</Text>
            </View>
            <Switch
              value={privacySettings.profileVisibility === 'everyone'}
              onValueChange={(value) => setPrivacySettings({
                ...privacySettings,
                profileVisibility: value ? 'everyone' : 'friends'
              })}
            />
          </TouchableOpacity>
          <TouchableOpacity style={styles.settingItem}>
            <View style={styles.settingItemLeft}>
              <UserPlus size={24} color={colors.primary} />
              <Text style={[styles.settingText, { color: colors.text }]}>Allow Friend Requests</Text>
            </View>
            <Switch
              value={privacySettings.allowTagging}
              onValueChange={(value) => setPrivacySettings({
                ...privacySettings,
                allowTagging: value
              })}
            />
          </TouchableOpacity>
          <TouchableOpacity style={styles.settingItem}>
            <View style={styles.settingItemLeft}>
              <EyeOff size={24} color={colors.primary} />
              <Text style={[styles.settingText, { color: colors.text }]}>Show Last Seen</Text>
            </View>
            <Switch
              value={privacySettings.showLastSeen}
              onValueChange={(value) => setPrivacySettings({
                ...privacySettings,
                showLastSeen: value
              })}
            />
          </TouchableOpacity>
        </>
      ))}

      {/* Notifications */}
      {renderSection('Notifications', (
        <>
          <TouchableOpacity style={styles.settingItem}>
            <View style={styles.settingItemLeft}>
              <Bell size={24} color={colors.primary} />
              <Text style={[styles.settingText, { color: colors.text }]}>Push Notifications</Text>
            </View>
            <Switch
              value={notificationsEnabled}
              onValueChange={setNotificationsEnabled}
            />
          </TouchableOpacity>
        </>
      ))}

      {/* Theme Settings */}
      {renderSection('Appearance', (
        <View style={styles.themeContainer}>
          {['light', 'dark', 'system'].map((themeOption) => (
            <TouchableOpacity
              key={themeOption}
              style={[
                styles.themeOption,
                {
                  backgroundColor: theme === themeOption ? colors.primary : colors.card,
                  borderColor: colors.border,
                },
              ]}
              onPress={() => setTheme(themeOption as any)}
            >
              <Text
                style={[
                  styles.themeOptionText,
                  {
                    color: theme === themeOption ? '#FFFFFF' : colors.text,
                  },
                ]}
              >
                {themeOption.charAt(0).toUpperCase() + themeOption.slice(1)}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      ))}

      {/* Help & Support */}
      {renderSection('Help & Support', (
        <>
          <TouchableOpacity style={styles.settingItem}>
            <View style={styles.settingItemLeft}>
              <CircleHelp size={24} color={colors.primary} />
              <Text style={[styles.settingText, { color: colors.text }]}>Help Center</Text>
            </View>
            <ChevronRight size={20} color={colors.text} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.settingItem}>
            <View style={styles.settingItemLeft}>
              <Info size={24} color={colors.primary} />
              <Text style={[styles.settingText, { color: colors.text }]}>About</Text>
            </View>
            <ChevronRight size={20} color={colors.text} />
          </TouchableOpacity>
        </>
      ))}

      {/* Sign Out */}
      <TouchableOpacity
        style={[styles.signOutButton, { backgroundColor: colors.notification }]}
        onPress={handleSignOut}
      >
        <LogOut size={24} color="#FFFFFF" />
        <Text style={styles.signOutButtonText}>Sign Out</Text>
      </TouchableOpacity>

      {/* Create Post Modal */}
      <Modal
        visible={showNewPostModal}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setShowNewPostModal(false)}
      >
        <View style={[styles.modalContainer, { backgroundColor: colors.background }]}>
          <View style={[styles.modalHeader, { backgroundColor: colors.card }]}>
            <Text style={[styles.modalTitle, { color: colors.text }]}>Create Post</Text>
            <TouchableOpacity onPress={() => setShowNewPostModal(false)}>
              <Text style={[styles.modalClose, { color: colors.primary }]}>Close</Text>
            </TouchableOpacity>
          </View>

          <View style={[styles.modalContent, { backgroundColor: colors.card }]}>
            <TextInput
              style={[styles.postInput, { color: colors.text, backgroundColor: colors.background }]}
              placeholder="What's on your mind?"
              placeholderTextColor={colors.text}
              multiline
              value={postText}
              onChangeText={setPostText}
            />

            {selectedMedia && (
              <View style={styles.selectedMediaContainer}>
                {mediaType === 'image' ? (
                  <Image source={{ uri: selectedMedia }} style={styles.selectedMedia} />
                ) : (
                  <View style={styles.videoPlaceholder}>
                    <VideoIcon size={40} color={colors.primary} />
                    <Text style={[styles.videoText, { color: colors.text }]}>Video Selected</Text>
                  </View>
                )}
                <TouchableOpacity
                  style={styles.removeMediaButton}
                  onPress={() => {
                    setSelectedMedia(null);
                    setMediaType(null);
                  }}
                >
                  <Text style={styles.removeMediaText}>Remove</Text>
                </TouchableOpacity>
              </View>
            )}

            <View style={styles.mediaButtons}>
              <TouchableOpacity
                style={[styles.mediaButton, { backgroundColor: colors.primary }]}
                onPress={() => pickImage('post')}
              >
                <ImageIcon size={24} color="#FFFFFF" />
                <Text style={styles.mediaButtonText}>Add Photo</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.mediaButton, { backgroundColor: colors.primary }]}
                onPress={() => pickImage('post')}
              >
                <VideoIcon size={24} color="#FFFFFF" />
                <Text style={styles.mediaButtonText}>Add Video</Text>
              </TouchableOpacity>
            </View>

            <TouchableOpacity
              style={[
                styles.postButton,
                {
                  backgroundColor: colors.primary,
                  opacity: isPosting ? 0.7 : 1,
                },
              ]}
              onPress={handleCreatePost}
              disabled={isPosting}
            >
              {isPosting ? (
                <ActivityIndicator color="#FFFFFF" />
              ) : (
                <Text style={styles.postButtonText}>Post</Text>
              )}
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Profile Edit Modal */}
      <Modal
        visible={showProfileModal}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setShowProfileModal(false)}
      >
        <View style={[styles.modalContainer, { backgroundColor: colors.background }]}>
          <View style={[styles.modalHeader, { backgroundColor: colors.card }]}>
            <Text style={[styles.modalTitle, { color: colors.text }]}>Edit Profile</Text>
            <TouchableOpacity onPress={() => setShowProfileModal(false)}>
              <Text style={[styles.modalClose, { color: colors.primary }]}>Close</Text>
            </TouchableOpacity>
          </View>

          <View style={[styles.modalContent, { backgroundColor: colors.card }]}>
            <TouchableOpacity
              style={styles.profileImageEdit}
              onPress={() => pickImage('profile')}
            >
              <Image
                source={{ uri: profileImage }}
                style={styles.profileImageLarge}
              />
              <View style={[styles.editProfileButtonLarge, { backgroundColor: colors.primary }]}>
                <Camera size={24} color="#FFFFFF" />
              </View>
            </TouchableOpacity>

            <TextInput
              style={[styles.profileInput, { color: colors.text, backgroundColor: colors.background }]}
              placeholder="Name"
              placeholderTextColor={colors.text}
              value={user?.name}
            />

            <TextInput
              style={[styles.profileInput, { color: colors.text, backgroundColor: colors.background }]}
              placeholder="Bio"
              placeholderTextColor={colors.text}
              multiline
            />

            <TouchableOpacity
              style={[styles.saveButton, { backgroundColor: colors.primary }]}
              onPress={() => setShowProfileModal(false)}
            >
              <Text style={styles.saveButtonText}>Save Changes</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  profileSection: {
    padding: 20,
    alignItems: 'center',
  },
  profileImageContainer: {
    position: 'relative',
    marginBottom: 10,
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
  },
  editProfileButton: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  userName: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  userEmail: {
    fontSize: 16,
    opacity: 0.7,
  },
  createPostButton: {
    margin: 16,
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
  },
  createPostButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  section: {
    marginBottom: 16,
    borderRadius: 12,
    overflow: 'hidden',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    padding: 16,
  },
  quickActions: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 16,
  },
  quickAction: {
    alignItems: 'center',
  },
  quickActionText: {
    marginTop: 8,
    fontSize: 14,
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#E4E6EB',
  },
  settingItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  settingText: {
    marginLeft: 12,
    fontSize: 16,
  },
  themeContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    padding: 16,
  },
  themeOption: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
    borderWidth: 1,
  },
  themeOptionText: {
    fontSize: 14,
    fontWeight: '500',
  },
  signOutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    margin: 16,
    padding: 15,
    borderRadius: 8,
  },
  signOutButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 8,
  },
  modalContainer: {
    flex: 1,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E4E6EB',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  modalClose: {
    fontSize: 16,
  },
  modalContent: {
    flex: 1,
    padding: 16,
  },
  postInput: {
    height: 150,
    padding: 12,
    borderRadius: 8,
    fontSize: 16,
    marginBottom: 16,
    textAlignVertical: 'top',
  },
  selectedMediaContainer: {
    marginBottom: 16,
  },
  selectedMedia: {
    width: '100%',
    height: 200,
    borderRadius: 8,
  },
  videoPlaceholder: {
    width: '100%',
    height: 200,
    borderRadius: 8,
    backgroundColor: '#F0F2F5',
    justifyContent: 'center',
    alignItems: 'center',
  },
  videoText: {
    marginTop: 8,
    fontSize: 16,
  },
  removeMediaButton: {
    position: 'absolute',
    top: 8,
    right: 8,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    padding: 8,
    borderRadius: 4,
  },
  removeMediaText: {
    color: '#FFFFFF',
    fontSize: 14,
  },
  mediaButtons: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 16,
  },
  mediaButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderRadius: 8,
  },
  mediaButtonText: {
    color: '#FFFFFF',
    marginLeft: 8,
    fontSize: 16,
  },
  postButton: {
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
  },
  postButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  profileImageEdit: {
    alignSelf: 'center',
    marginBottom: 24,
    position: 'relative',
  },
  profileImageLarge: {
    width: 150,
    height: 150,
    borderRadius: 75,
  },
  editProfileButtonLarge: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  profileInput: {
    padding: 12,
    borderRadius: 8,
    fontSize: 16,
    marginBottom: 16,
  },
  saveButton: {
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 16,
  },
  saveButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
});