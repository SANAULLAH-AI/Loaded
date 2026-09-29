import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Image,
  ActivityIndicator,
  RefreshControl,
} from 'react-native';
import { Bell } from 'lucide-react-native';
import { api } from '@/services/api';
import { User } from '@/types';

type Notification = {
  id: number;
  type: 'like' | 'comment' | 'friend' | 'mention' | 'birthday';
  userId: number;
  user?: User;
  message: string;
  time: string;
  read: boolean;
};

export default function NotificationsScreen() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    fetchNotifications();
  }, []);

  const fetchNotifications = async () => {
    try {
      setLoading(true);
      const userResponse = await api.getUsers();
      
      // Generate mock notifications using user data
      const mockNotifications: Notification[] = [];
      
      const notificationTypes = ['like', 'comment', 'friend', 'mention', 'birthday'];
      const notificationMessages = {
        like: 'liked your post',
        comment: 'commented on your post',
        friend: 'accepted your friend request',
        mention: 'mentioned you in a comment',
        birthday: 'has a birthday today',
      };
      
      const timeFrames = ['Just now', '5m ago', '10m ago', '15m ago', '30m ago', '1h ago', '2h ago', '3h ago', '5h ago', 'Yesterday'];
      
      userResponse.forEach((user, index) => {
        if (index < 15) { // Limit to 15 notifications
          const type = notificationTypes[Math.floor(Math.random() * notificationTypes.length)] as 'like' | 'comment' | 'friend' | 'mention' | 'birthday';
          mockNotifications.push({
            id: index + 1,
            type,
            userId: user.id,
            user,
            message: notificationMessages[type],
            time: timeFrames[Math.floor(Math.random() * timeFrames.length)],
            read: Math.random() > 0.3, // 70% chance of being read
          });
        }
      });
      
      setNotifications(mockNotifications);
    } catch (error) {
      console.error('Failed to generate notifications:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const handleRefresh = () => {
    setRefreshing(true);
    fetchNotifications();
  };

  const markAsRead = (notificationId: number) => {
    setNotifications(prevNotifications =>
      prevNotifications.map(notification => {
        if (notification.id === notificationId) {
          return { ...notification, read: true };
        }
        return notification;
      })
    );
  };

  const renderNotificationItem = ({ item }: { item: Notification }) => {
    const profilePic = `https://randomuser.me/api/portraits/${item.userId % 2 === 0 ? 'men' : 'women'}/${item.userId}.jpg`;
    
    return (
      <TouchableOpacity 
        style={[
          styles.notificationItem,
          !item.read && styles.unreadNotification
        ]}
        onPress={() => markAsRead(item.id)}
      >
        <View style={styles.notificationIcon}>
          <Image source={{ uri: profilePic }} style={styles.profilePic} />
          <View style={styles.notificationTypeContainer}>
            {item.type === 'like' && (
              <View style={[styles.iconBackground, styles.likeIcon]}>
                <ThumbsUpIcon color="#FFFFFF" size={12} />
              </View>
            )}
            {item.type === 'comment' && (
              <View style={[styles.iconBackground, styles.commentIcon]}>
                <CommentIcon color="#FFFFFF" size={12} />
              </View>
            )}
            {item.type === 'friend' && (
              <View style={[styles.iconBackground, styles.friendIcon]}>
                <UserPlusIcon color="#FFFFFF" size={12} />
              </View>
            )}
            {item.type === 'mention' && (
              <View style={[styles.iconBackground, styles.mentionIcon]}>
                <AtSignIcon color="#FFFFFF" size={12} />
              </View>
            )}
            {item.type === 'birthday' && (
              <View style={[styles.iconBackground, styles.birthdayIcon]}>
                <GiftIcon color="#FFFFFF" size={12} />
              </View>
            )}
          </View>
        </View>
        
        <View style={styles.notificationContent}>
          <Text style={styles.notificationText}>
            <Text style={styles.userName}>{item.user?.name} </Text>
            {item.message}
          </Text>
          <Text style={styles.notificationTime}>{item.time}</Text>
        </View>
      </TouchableOpacity>
    );
  };

  // Create mini icon components for notification types
  const ThumbsUpIcon = ({ color, size }: { color: string, size: number }) => (
    <View style={{ width: size, height: size }}>
      <Text style={{ color, fontSize: size - 4 }}>👍</Text>
    </View>
  );
  
  const CommentIcon = ({ color, size }: { color: string, size: number }) => (
    <View style={{ width: size, height: size }}>
      <Text style={{ color, fontSize: size - 4 }}>💬</Text>
    </View>
  );
  
  const UserPlusIcon = ({ color, size }: { color: string, size: number }) => (
    <View style={{ width: size, height: size }}>
      <Text style={{ color, fontSize: size - 4 }}>👤</Text>
    </View>
  );
  
  const AtSignIcon = ({ color, size }: { color: string, size: number }) => (
    <View style={{ width: size, height: size }}>
      <Text style={{ color, fontSize: size - 4 }}>@</Text>
    </View>
  );
  
  const GiftIcon = ({ color, size }: { color: string, size: number }) => (
    <View style={{ width: size, height: size }}>
      <Text style={{ color, fontSize: size - 4 }}>🎁</Text>
    </View>
  );

  if (loading && !refreshing) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#1877F2" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Notifications</Text>
      </View>
      
      <FlatList
        data={notifications}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderNotificationItem}
        contentContainerStyle={styles.listContainer}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={handleRefresh}
            colors={['#1877F2']}
            tintColor="#1877F2"
          />
        }
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Bell size={50} color="#65676B" />
            <Text style={styles.emptyText}>No notifications yet</Text>
          </View>
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
  header: {
    paddingHorizontal: 15,
    paddingTop: 15,
    paddingBottom: 10,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E4E6EB',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1C1E21',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F0F2F5',
  },
  listContainer: {
    paddingVertical: 10,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 100,
  },
  emptyText: {
    fontSize: 16,
    color: '#65676B',
    marginTop: 10,
  },
  notificationItem: {
    flexDirection: 'row',
    padding: 15,
    backgroundColor: '#FFFFFF',
    marginHorizontal: 10,
    marginBottom: 8,
    borderRadius: 8,
  },
  unreadNotification: {
    backgroundColor: '#E7F3FF',
  },
  notificationIcon: {
    position: 'relative',
    marginRight: 15,
  },
  profilePic: {
    width: 60,
    height: 60,
    borderRadius: 30,
  },
  notificationTypeContainer: {
    position: 'absolute',
    bottom: 0,
    right: 0,
  },
  iconBackground: {
    width: 22,
    height: 22,
    borderRadius: 11,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#FFFFFF',
  },
  likeIcon: {
    backgroundColor: '#1877F2',
  },
  commentIcon: {
    backgroundColor: '#0BC16C',
  },
  friendIcon: {
    backgroundColor: '#1877F2',
  },
  mentionIcon: {
    backgroundColor: '#E7515A',
  },
  birthdayIcon: {
    backgroundColor: '#F7B928',
  },
  notificationContent: {
    flex: 1,
    justifyContent: 'center',
  },
  notificationText: {
    fontSize: 15,
    lineHeight: 20,
    color: '#1C1E21',
  },
  userName: {
    fontWeight: 'bold',
  },
  notificationTime: {
    fontSize: 14,
    color: '#65676B',
    marginTop: 4,
  },
});