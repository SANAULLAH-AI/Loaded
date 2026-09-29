import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  TextInput,
  Image,
  RefreshControl,
  ActivityIndicator,
} from 'react-native';
import { Image as LucideImage, ThumbsUp, MessageCircle, Share2 } from 'lucide-react-native';
import { api } from '@/services/api';
import { Post, User } from '@/types';
import { PostItem } from '@/components/PostItem';
import { StoryContainer } from '@/components/StoryContainer';
import { CreatePostBar } from '@/components/CreatePostBar';
import { useAuth } from '@/context/AuthContext';

export default function HomeScreen() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const { user } = useAuth();

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    try {
      setLoading(true);
      const response = await api.getPosts();
      const userResponse = await api.getUsers();
      
      // Combine posts with user data
      const postsWithUserData = response.map(post => {
        const postUser = userResponse.find(user => user.id === post.userId);
        return {
          ...post,
          user: postUser,
          likeCount: Math.floor(Math.random() * 100),
          commentCount: Math.floor(Math.random() * 20),
          shareCount: Math.floor(Math.random() * 5),
          timePosted: '2h ago',
          liked: Math.random() > 0.5,
          // Generate a random image
          imageUrl: Math.random() > 0.3 ? `https://picsum.photos/500/300?random=${post.id}` : null
        };
      });
      
      setPosts(postsWithUserData);
    } catch (error) {
      console.error('Failed to fetch posts:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const handleRefresh = () => {
    setRefreshing(true);
    fetchPosts();
  };

  const handleLikePost = (postId: number) => {
    setPosts(prevPosts => 
      prevPosts.map(post => {
        if (post.id === postId) {
          const wasLiked = post.liked;
          return {
            ...post,
            liked: !wasLiked,
            likeCount: wasLiked ? post.likeCount - 1 : post.likeCount + 1
          };
        }
        return post;
      })
    );
  };

  if (loading && !refreshing) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#1877F2" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={posts}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <PostItem post={item} onLike={handleLikePost} />
        )}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={handleRefresh}
            colors={['#1877F2']}
            tintColor="#1877F2"
          />
        }
        ListHeaderComponent={
          <>
            <StoryContainer />
            <CreatePostBar user={user} />
          </>
        }
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F0F2F5',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F0F2F5',
  },
});