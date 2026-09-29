import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  TextInput,
} from 'react-native';
import { ThumbsUp, MessageCircle, Share2 } from 'lucide-react-native';
import { Post } from '@/types';

type PostItemProps = {
  post: Post;
  onLike: (postId: number) => void;
};

export const PostItem: React.FC<PostItemProps> = ({ post, onLike }) => {
  const [comment, setComment] = useState('');
  const [showCommentInput, setShowCommentInput] = useState(false);
  
  const handleLike = () => {
    onLike(post.id);
  };
  
  const handleComment = () => {
    setShowCommentInput(true);
  };
  
  const handleShare = () => {
    // Handle share logic
  };

  const submitComment = () => {
    if (comment.trim()) {
      // In a real app, we'd submit this comment to an API
      console.log('Comment submitted:', comment);
      setComment('');
      setShowCommentInput(false);
    }
  };
  
  const profilePic = `https://randomuser.me/api/portraits/${post.userId % 2 === 0 ? 'men' : 'women'}/${post.userId}.jpg`;
  
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Image source={{ uri: profilePic }} style={styles.profilePic} />
        <View style={styles.headerText}>
          <Text style={styles.userName}>{post.user?.name}</Text>
          <Text style={styles.postTime}>{post.timePosted}</Text>
        </View>
      </View>
      
      <Text style={styles.postContent}>{post.body}</Text>
      
      {post.imageUrl && (
        <Image
          source={{ uri: post.imageUrl }}
          style={styles.postImage}
          resizeMode="cover"
        />
      )}
      
      <View style={styles.statsContainer}>
        <View style={styles.likesContainer}>
          <View style={styles.likeIconContainer}>
            <ThumbsUp size={12} color="#FFFFFF" />
          </View>
          <Text style={styles.statsText}>{post.likeCount}</Text>
        </View>
        
        <View style={styles.commentsSharesContainer}>
          <Text style={styles.statsText}>{post.commentCount} comments</Text>
          <Text style={styles.statsText}>{post.shareCount} shares</Text>
        </View>
      </View>
      
      <View style={styles.divider} />
      
      <View style={styles.actionsContainer}>
        <TouchableOpacity
          style={styles.actionButton}
          onPress={handleLike}
        >
          <ThumbsUp
            size={20}
            color={post.liked ? '#1877F2' : '#65676B'}
            fill={post.liked ? '#1877F2' : 'transparent'}
          />
          <Text
            style={[
              styles.actionText,
              post.liked && styles.actionTextActive
            ]}
          >
            Like
          </Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          style={styles.actionButton}
          onPress={handleComment}
        >
          <MessageCircle size={20} color="#65676B" />
          <Text style={styles.actionText}>Comment</Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          style={styles.actionButton}
          onPress={handleShare}
        >
          <Share2 size={20} color="#65676B" />
          <Text style={styles.actionText}>Share</Text>
        </TouchableOpacity>
      </View>
      
      {showCommentInput && (
        <View style={styles.commentInputContainer}>
          <Image source={{ uri: profilePic }} style={styles.commentProfilePic} />
          <TextInput
            style={styles.commentInput}
            placeholder="Write a comment..."
            placeholderTextColor="#65676B"
            value={comment}
            onChangeText={setComment}
            onSubmitEditing={submitComment}
            autoFocus
          />
        </View>
      )}
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
  header: {
    flexDirection: 'row',
    padding: 12,
    alignItems: 'center',
  },
  profilePic: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },
  headerText: {
    marginLeft: 10,
  },
  userName: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#1C1E21',
  },
  postTime: {
    fontSize: 12,
    color: '#65676B',
    marginTop: 2,
  },
  postContent: {
    paddingHorizontal: 12,
    paddingBottom: 12,
    fontSize: 15,
    color: '#1C1E21',
    lineHeight: 20,
  },
  postImage: {
    width: '100%',
    height: 300,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 12,
    paddingVertical: 10,
  },
  likesContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  likeIconContainer: {
    backgroundColor: '#1877F2',
    borderRadius: 10,
    width: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 5,
  },
  statsText: {
    fontSize: 13,
    color: '#65676B',
  },
  commentsSharesContainer: {
    flexDirection: 'row',
    gap: 10,
  },
  divider: {
    height: 1,
    backgroundColor: '#E4E6EB',
    marginHorizontal: 12,
  },
  actionsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 10,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 5,
    paddingHorizontal: 15,
    borderRadius: 5,
  },
  actionText: {
    marginLeft: 6,
    fontSize: 14,
    color: '#65676B',
  },
  actionTextActive: {
    color: '#1877F2',
  },
  commentInputContainer: {
    flexDirection: 'row',
    padding: 12,
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: '#E4E6EB',
  },
  commentProfilePic: {
    width: 32,
    height: 32,
    borderRadius: 16,
    marginRight: 8,
  },
  commentInput: {
    flex: 1,
    backgroundColor: '#F0F2F5',
    borderRadius: 20,
    paddingHorizontal: 15,
    paddingVertical: 8,
    fontSize: 14,
  },
});