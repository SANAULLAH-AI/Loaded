import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Image,
  TextInput,
  ActivityIndicator,
  RefreshControl,
} from 'react-native';
import { Search, CreditCard as Edit, Circle } from 'lucide-react-native';
import { api } from '@/services/api';
import { User } from '@/types';

type Message = {
  id: number;
  userId: number;
  user?: User;
  lastMessage: string;
  timestamp: string;
  unread: boolean;
  online: boolean;
};

export default function MessagesScreen() {
  const [conversations, setConversations] = useState<Message[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    fetchConversations();
  }, []);

  const fetchConversations = async () => {
    try {
      setLoading(true);
      const userResponse = await api.getUsers();
      
      // Generate mock conversations using user data
      const mockConversations: Message[] = [];
      
      const messageTexts = [
        'Hey, how are you?',
        'Did you see the latest post?',
        'Let\'s catch up soon!',
        'Thanks for your help yesterday',
        'Are you going to the event?',
        'I sent you the file you asked for',
        'Check out this link I found',
        'Happy birthday!',
        'Can we talk later today?',
        'What do you think about...',
      ];
      
      const timeFrames = ['Just now', '5m', '10m', '15m', '30m', '1h', '2h', '3h', '5h', 'Yesterday'];
      
      userResponse.forEach((user, index) => {
        if (index < 15) { // Limit to 15 conversations
          mockConversations.push({
            id: index + 1,
            userId: user.id,
            user,
            lastMessage: messageTexts[Math.floor(Math.random() * messageTexts.length)],
            timestamp: timeFrames[Math.floor(Math.random() * timeFrames.length)],
            unread: Math.random() > 0.7, // 30% chance of being unread
            online: Math.random() > 0.6, // 40% chance of being online
          });
        }
      });
      
      setConversations(mockConversations);
    } catch (error) {
      console.error('Failed to generate conversations:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const handleRefresh = () => {
    setRefreshing(true);
    fetchConversations();
  };

  const filteredConversations = conversations.filter(conversation => {
    const userName = conversation.user?.name.toLowerCase() || '';
    return userName.includes(searchQuery.toLowerCase());
  });

  const markAsRead = (messageId: number) => {
    setConversations(prevConversations =>
      prevConversations.map(conversation => {
        if (conversation.id === messageId) {
          return { ...conversation, unread: false };
        }
        return conversation;
      })
    );
  };

  const renderConversationItem = ({ item }: { item: Message }) => {
    const profilePic = `https://randomuser.me/api/portraits/${item.userId % 2 === 0 ? 'men' : 'women'}/${item.userId}.jpg`;
    
    return (
      <TouchableOpacity 
        style={styles.conversationItem}
        onPress={() => markAsRead(item.id)}
      >
        <View style={styles.profileContainer}>
          <Image source={{ uri: profilePic }} style={styles.profilePic} />
          {item.online && (
            <View style={styles.onlineIndicator} />
          )}
        </View>
        
        <View style={styles.conversationContent}>
          <View style={styles.conversationHeader}>
            <Text style={styles.userName}>{item.user?.name}</Text>
            <Text style={styles.timestamp}>{item.timestamp}</Text>
          </View>
          <View style={styles.messageContainer}>
            <Text
              style={[
                styles.lastMessage,
                item.unread && styles.unreadMessage
              ]}
              numberOfLines={1}
            >
              {item.lastMessage}
            </Text>
            {item.unread && (
              <View style={styles.unreadIndicator}>
                <Text style={styles.unreadIndicatorText}>•</Text>
              </View>
            )}
          </View>
        </View>
      </TouchableOpacity>
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
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Messages</Text>
        <TouchableOpacity style={styles.newMessageButton}>
          <Edit size={22} color="#1877F2" />
        </TouchableOpacity>
      </View>
      
      <View style={styles.searchContainer}>
        <View style={styles.searchInputContainer}>
          <Search size={18} color="#65676B" />
          <TextInput
            style={styles.searchInput}
            placeholder="Search Messenger"
            placeholderTextColor="#65676B"
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>
      </View>
      
      <FlatList
        data={filteredConversations}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderConversationItem}
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
            <Edit size={50} color="#65676B" />
            <Text style={styles.emptyText}>No conversations yet</Text>
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
    backgroundColor: '#FFFFFF',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
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
  newMessageButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#F0F2F5',
    justifyContent: 'center',
    alignItems: 'center',
  },
  searchContainer: {
    padding: 10,
    backgroundColor: '#FFFFFF',
  },
  searchInputContainer: {
    flexDirection: 'row',
    backgroundColor: '#F0F2F5',
    borderRadius: 20,
    paddingHorizontal: 12,
    alignItems: 'center',
    height: 40,
  },
  searchInput: {
    flex: 1,
    height: 40,
    paddingLeft: 8,
    fontSize: 16,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
  },
  listContainer: {
    paddingVertical: 5,
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
  conversationItem: {
    flexDirection: 'row',
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F2F5',
  },
  profileContainer: {
    position: 'relative',
    marginRight: 15,
  },
  profilePic: {
    width: 55,
    height: 55,
    borderRadius: 27.5,
  },
  onlineIndicator: {
    position: 'absolute',
    bottom: 2,
    right: 2,
    width: 14,
    height: 14,
    borderRadius: 7,
    backgroundColor: '#31A24C',
    borderWidth: 2,
    borderColor: '#FFFFFF',
  },
  conversationContent: {
    flex: 1,
    justifyContent: 'center',
  },
  conversationHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  userName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1C1E21',
  },
  timestamp: {
    fontSize: 12,
    color: '#65676B',
  },
  messageContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  lastMessage: {
    fontSize: 14,
    color: '#65676B',
    flex: 1,
  },
  unreadMessage: {
    fontWeight: 'bold',
    color: '#1C1E21',
  },
  unreadIndicator: {
    marginLeft: 5,
  },
  unreadIndicatorText: {
    color: '#1877F2',
    fontSize: 24,
    lineHeight: 24,
  },
});