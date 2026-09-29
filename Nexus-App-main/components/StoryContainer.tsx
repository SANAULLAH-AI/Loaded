import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
} from 'react-native';
import { Plus } from 'lucide-react-native';
import { useAuth } from '@/context/AuthContext';

type Story = {
  id: number;
  userId: number;
  userName: string;
  profilePic: string;
  storyImage: string;
  viewed: boolean;
};

export const StoryContainer: React.FC = () => {
  const { user } = useAuth();
  const profilePic = user?.photoUrl || `https://randomuser.me/api/portraits/men/1.jpg`;
  
  // Generate mock stories
  const stories: Story[] = [];
  for (let i = 1; i <= 10; i++) {
    const gender = i % 2 === 0 ? 'men' : 'women';
    stories.push({
      id: i,
      userId: i,
      userName: `User ${i}`,
      profilePic: `https://randomuser.me/api/portraits/${gender}/${i}.jpg`,
      storyImage: `https://picsum.photos/200/300?random=${i}`,
      viewed: i > 3, // First 3 are unviewed
    });
  }

  return (
    <View style={styles.container}>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Create Story Card */}
        <TouchableOpacity style={styles.createStoryCard}>
          <View style={styles.createStoryImageContainer}>
            <Image source={{ uri: profilePic }} style={styles.createStoryImage} />
          </View>
          <View style={styles.createStoryPlusIcon}>
            <Plus size={20} color="#FFFFFF" />
          </View>
          <View style={styles.createStoryTextContainer}>
            <Text style={styles.createStoryText}>Create Story</Text>
          </View>
        </TouchableOpacity>
        
        {/* User Stories */}
        {stories.map((story) => (
          <TouchableOpacity key={story.id} style={styles.storyCard}>
            <Image
              source={{ uri: story.storyImage }}
              style={styles.storyImage}
            />
            <View
              style={[
                styles.storyProfileBorder,
                story.viewed ? styles.viewedBorder : styles.unviewedBorder,
              ]}
            >
              <Image
                source={{ uri: story.profilePic }}
                style={styles.storyProfilePic}
              />
            </View>
            <Text style={styles.storyUserName}>{story.userName}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#FFFFFF',
    paddingVertical: 10,
    marginBottom: 8,
  },
  scrollContent: {
    paddingHorizontal: 8,
  },
  createStoryCard: {
    width: 110,
    height: 180,
    borderRadius: 10,
    marginHorizontal: 4,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E4E6EB',
    overflow: 'hidden',
    position: 'relative',
  },
  createStoryImageContainer: {
    height: '70%',
    backgroundColor: '#F0F2F5',
    alignItems: 'center',
    justifyContent: 'center',
  },
  createStoryImage: {
    width: 70,
    height: 70,
    borderRadius: 35,
  },
  createStoryPlusIcon: {
    position: 'absolute',
    top: 90,
    left: 40,
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: '#1877F2',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 3,
    borderColor: '#FFFFFF',
  },
  createStoryTextContainer: {
    height: '30%',
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 10,
  },
  createStoryText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#1C1E21',
  },
  storyCard: {
    width: 110,
    height: 180,
    borderRadius: 10,
    marginHorizontal: 4,
    overflow: 'hidden',
    position: 'relative',
  },
  storyImage: {
    width: '100%',
    height: '100%',
  },
  storyProfileBorder: {
    position: 'absolute',
    top: 8,
    left: 8,
    width: 40,
    height: 40,
    borderRadius: 20,
    borderWidth: 3,
    alignItems: 'center',
    justifyContent: 'center',
  },
  unviewedBorder: {
    borderColor: '#1877F2',
  },
  viewedBorder: {
    borderColor: '#8C939D',
  },
  storyProfilePic: {
    width: 34,
    height: 34,
    borderRadius: 17,
  },
  storyUserName: {
    position: 'absolute',
    bottom: 8,
    left: 8,
    right: 8,
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: 'bold',
    textShadowColor: 'rgba(0, 0, 0, 0.7)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 1,
  },
});