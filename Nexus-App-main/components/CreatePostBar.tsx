import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  TextInput,
} from 'react-native';
import { Image as LucideImage, Smile, Video } from 'lucide-react-native';
import { User } from '@/types';

type CreatePostBarProps = {
  user: User | null;
};

export const CreatePostBar: React.FC<CreatePostBarProps> = ({ user }) => {
  const profilePic = user?.photoUrl || `https://randomuser.me/api/portraits/men/1.jpg`;
  
  return (
    <View style={styles.container}>
      <View style={styles.inputSection}>
        <Image source={{ uri: profilePic }} style={styles.profilePic} />
        <TouchableOpacity style={styles.postInput}>
          <Text style={styles.postInputText}>What's on your mind?</Text>
        </TouchableOpacity>
      </View>
      
      <View style={styles.divider} />
      
      <View style={styles.actionSection}>
        <TouchableOpacity style={styles.actionButton}>
          <Video size={20} color="#F23E5C" />
          <Text style={styles.actionText}>Live</Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.actionButton}>
          <LucideImage size={20} color="#45BD62" />
          <Text style={styles.actionText}>Photo</Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.actionButton}>
          <Smile size={20} color="#F7B928" />
          <Text style={styles.actionText}>Feeling</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#FFFFFF',
    marginBottom: 8,
    borderRadius: 8,
    overflow: 'hidden',
  },
  inputSection: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
  },
  profilePic: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },
  postInput: {
    flex: 1,
    backgroundColor: '#F0F2F5',
    borderRadius: 20,
    marginLeft: 8,
    paddingHorizontal: 15,
    paddingVertical: 8,
  },
  postInputText: {
    color: '#65676B',
    fontSize: 16,
  },
  divider: {
    height: 1,
    backgroundColor: '#E4E6EB',
    marginHorizontal: 12,
  },
  actionSection: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 8,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 12,
  },
  actionText: {
    marginLeft: 6,
    fontSize: 14,
    color: '#65676B',
  },
});