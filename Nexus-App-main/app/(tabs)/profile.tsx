import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  TouchableOpacity,
  RefreshControl,
} from 'react-native';
import { Camera, CreditCard as Edit3, MapPin, Link as LinkIcon, Calendar } from 'lucide-react-native';
import { useAuth } from '@/context/AuthContext';
import { useTheme } from '@/context/ThemeContext';

export default function ProfileScreen() {
  const { user } = useAuth();
  const { colors } = useTheme();
  const [refreshing, setRefreshing] = React.useState(false);

  const handleRefresh = React.useCallback(() => {
    setRefreshing(true);
    // Simulate refresh
    setTimeout(() => {
      setRefreshing(false);
    }, 1000);
  }, []);

  const stats = [
    { label: 'Posts', value: '245' },
    { label: 'Followers', value: '14.3K' },
    { label: 'Following', value: '892' },
  ];

  const profilePic = user?.photoUrl || `https://randomuser.me/api/portraits/men/1.jpg`;
  const coverImage = 'https://images.pexels.com/photos/3075993/pexels-photo-3075993.jpeg';

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: colors.background }]}
      refreshControl={
        <RefreshControl
          refreshing={refreshing}
          onRefresh={handleRefresh}
          colors={[colors.primary]}
          tintColor={colors.primary}
        />
      }
    >
      {/* Cover Image */}
      <View style={styles.coverContainer}>
        <Image source={{ uri: coverImage }} style={styles.coverImage} />
        <TouchableOpacity style={[styles.editCoverButton, { backgroundColor: colors.card }]}>
          <Camera size={20} color={colors.text} />
        </TouchableOpacity>
      </View>

      {/* Profile Info */}
      <View style={[styles.profileInfo, { backgroundColor: colors.card }]}>
        <View style={styles.avatarContainer}>
          <Image source={{ uri: profilePic }} style={styles.avatar} />
          <TouchableOpacity 
            style={[styles.editAvatarButton, { backgroundColor: colors.primary }]}
          >
            <Camera size={16} color="#FFFFFF" />
          </TouchableOpacity>
        </View>

        <View style={styles.nameContainer}>
          <Text style={[styles.name, { color: colors.text }]}>{user?.name || 'John Doe'}</Text>
          <Text style={[styles.username, { color: colors.text }]}>@johndoe</Text>
        </View>

        <TouchableOpacity 
          style={[styles.editProfileButton, { backgroundColor: colors.primary }]}
        >
          <Edit3 size={16} color="#FFFFFF" />
          <Text style={styles.editProfileText}>Edit Profile</Text>
        </TouchableOpacity>

        <View style={styles.statsContainer}>
          {stats.map((stat, index) => (
            <View key={index} style={styles.statItem}>
              <Text style={[styles.statValue, { color: colors.text }]}>{stat.value}</Text>
              <Text style={[styles.statLabel, { color: colors.text }]}>{stat.label}</Text>
            </View>
          ))}
        </View>

        <View style={styles.bioContainer}>
          <Text style={[styles.bio, { color: colors.text }]}>
            Digital creator & tech enthusiast 🚀
            Sharing insights about web development, design, and innovation
          </Text>

          <View style={styles.infoItems}>
            <View style={styles.infoItem}>
              <MapPin size={16} color={colors.text} />
              <Text style={[styles.infoText, { color: colors.text }]}>San Francisco, CA</Text>
            </View>
            <View style={styles.infoItem}>
              <LinkIcon size={16} color={colors.text} />
              <Text style={[styles.infoText, { color: colors.primary }]}>nexus.social/johndoe</Text>
            </View>
            <View style={styles.infoItem}>
              <Calendar size={16} color={colors.text} />
              <Text style={[styles.infoText, { color: colors.text }]}>Joined March 2024</Text>
            </View>
          </View>
        </View>
      </View>

      {/* Content Tabs */}
      <View style={[styles.contentTabs, { backgroundColor: colors.card }]}>
        <TouchableOpacity 
          style={[styles.tab, { borderBottomColor: colors.primary }]}
        >
          <Text style={[styles.tabText, { color: colors.primary }]}>Posts</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.tab}>
          <Text style={[styles.tabText, { color: colors.text }]}>Media</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.tab}>
          <Text style={[styles.tabText, { color: colors.text }]}>Likes</Text>
        </TouchableOpacity>
      </View>

      {/* Posts Grid */}
      <View style={[styles.postsGrid, { backgroundColor: colors.card }]}>
        {Array(6).fill(0).map((_, index) => (
          <Image
            key={index}
            source={{ uri: `https://picsum.photos/400/400?random=${index}` }}
            style={styles.gridItem}
          />
        ))}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  coverContainer: {
    height: 200,
    position: 'relative',
  },
  coverImage: {
    width: '100%',
    height: '100%',
  },
  editCoverButton: {
    position: 'absolute',
    right: 16,
    bottom: 16,
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  profileInfo: {
    padding: 16,
    marginTop: -40,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
  },
  avatarContainer: {
    position: 'relative',
    alignSelf: 'center',
    marginBottom: 16,
  },
  avatar: {
    width: 120,
    height: 120,
    borderRadius: 60,
    borderWidth: 4,
    borderColor: '#FFFFFF',
  },
  editAvatarButton: {
    position: 'absolute',
    right: 0,
    bottom: 0,
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  nameContainer: {
    alignItems: 'center',
    marginBottom: 16,
  },
  name: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  username: {
    fontSize: 16,
    opacity: 0.7,
  },
  editProfileButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
    alignSelf: 'center',
    marginBottom: 24,
  },
  editProfileText: {
    color: '#FFFFFF',
    marginLeft: 8,
    fontWeight: '600',
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 24,
  },
  statItem: {
    alignItems: 'center',
  },
  statValue: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 14,
    opacity: 0.7,
  },
  bioContainer: {
    paddingHorizontal: 16,
  },
  bio: {
    fontSize: 16,
    lineHeight: 24,
    marginBottom: 16,
  },
  infoItems: {
    gap: 8,
  },
  infoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  infoText: {
    marginLeft: 8,
    fontSize: 14,
  },
  contentTabs: {
    flexDirection: 'row',
    marginTop: 16,
  },
  tab: {
    flex: 1,
    paddingVertical: 16,
    alignItems: 'center',
    borderBottomWidth: 2,
    borderBottomColor: 'transparent',
  },
  tabText: {
    fontSize: 16,
    fontWeight: '600',
  },
  postsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    padding: 2,
  },
  gridItem: {
    width: '33.33%',
    aspectRatio: 1,
    margin: 1,
  },
});