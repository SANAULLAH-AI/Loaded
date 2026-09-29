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
import { UserPlus, Check, X } from 'lucide-react-native';
import { api } from '@/services/api';
import { User } from '@/types';

export default function FriendsScreen() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const response = await api.getUsers();
      
      // Add friend status to users
      const usersWithStatus = response.map(user => ({
        ...user,
        friendStatus: ['request', 'none', 'friends'][Math.floor(Math.random() * 3)],
        mutualFriends: Math.floor(Math.random() * 10),
      }));
      
      setUsers(usersWithStatus);
    } catch (error) {
      console.error('Failed to fetch users:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const handleRefresh = () => {
    setRefreshing(true);
    fetchUsers();
  };

  const handleFriendAction = (userId: number, action: 'accept' | 'reject' | 'add') => {
    setUsers(prevUsers =>
      prevUsers.map(user => {
        if (user.id === userId) {
          if (action === 'accept') {
            return { ...user, friendStatus: 'friends' };
          } else if (action === 'reject') {
            return { ...user, friendStatus: 'none' };
          } else if (action === 'add') {
            return { ...user, friendStatus: 'request' };
          }
        }
        return user;
      })
    );
  };

  const renderFriendItem = ({ item }: { item: User & { friendStatus: string, mutualFriends: number } }) => {
    const profilePic = `https://randomuser.me/api/portraits/${item.id % 2 === 0 ? 'men' : 'women'}/${item.id}.jpg`;
    
    return (
      <View style={styles.friendItem}>
        <Image source={{ uri: profilePic }} style={styles.profilePic} />
        <View style={styles.friendInfo}>
          <Text style={styles.friendName}>{item.name}</Text>
          {item.mutualFriends > 0 && (
            <Text style={styles.mutualFriends}>{item.mutualFriends} mutual friends</Text>
          )}
          
          <View style={styles.actionsContainer}>
            {item.friendStatus === 'request' ? (
              <>
                <TouchableOpacity 
                  style={styles.acceptButton}
                  onPress={() => handleFriendAction(item.id, 'accept')}
                >
                  <Check size={16} color="#FFFFFF" />
                  <Text style={styles.acceptButtonText}>Accept</Text>
                </TouchableOpacity>
                <TouchableOpacity 
                  style={styles.rejectButton}
                  onPress={() => handleFriendAction(item.id, 'reject')}
                >
                  <X size={16} color="#65676B" />
                  <Text style={styles.rejectButtonText}>Reject</Text>
                </TouchableOpacity>
              </>
            ) : item.friendStatus === 'none' ? (
              <TouchableOpacity 
                style={styles.addButton}
                onPress={() => handleFriendAction(item.id, 'add')}
              >
                <UserPlus size={16} color="#FFFFFF" />
                <Text style={styles.addButtonText}>Add Friend</Text>
              </TouchableOpacity>
            ) : (
              <View style={styles.friendsIndicator}>
                <Text style={styles.friendsText}>Friends</Text>
              </View>
            )}
          </View>
        </View>
      </View>
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
        <Text style={styles.headerTitle}>Friend Requests</Text>
      </View>
      
      <FlatList
        data={users}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderFriendItem}
        contentContainerStyle={styles.listContainer}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={handleRefresh}
            colors={['#1877F2']}
            tintColor="#1877F2"
          />
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
  friendItem: {
    flexDirection: 'row',
    padding: 15,
    backgroundColor: '#FFFFFF',
    marginHorizontal: 10,
    marginBottom: 8,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 1,
    elevation: 1,
  },
  profilePic: {
    width: 70,
    height: 70,
    borderRadius: 35,
  },
  friendInfo: {
    flex: 1,
    marginLeft: 15,
  },
  friendName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1C1E21',
    marginBottom: 4,
  },
  mutualFriends: {
    fontSize: 14,
    color: '#65676B',
    marginBottom: 8,
  },
  actionsContainer: {
    flexDirection: 'row',
    marginTop: 5,
  },
  acceptButton: {
    backgroundColor: '#1877F2',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 5,
    marginRight: 8,
    flex: 1,
  },
  acceptButtonText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    marginLeft: 5,
  },
  rejectButton: {
    backgroundColor: '#E4E6EB',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 5,
    flex: 1,
  },
  rejectButtonText: {
    color: '#65676B',
    fontWeight: 'bold',
    marginLeft: 5,
  },
  addButton: {
    backgroundColor: '#1877F2',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 5,
    flex: 1,
  },
  addButtonText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    marginLeft: 5,
  },
  friendsIndicator: {
    backgroundColor: '#E4E6EB',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 5,
    alignItems: 'center',
  },
  friendsText: {
    color: '#65676B',
    fontWeight: 'bold',
  },
});