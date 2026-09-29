export interface User {
  id: string;
  name: string;
  avatar: string;
  coverPhoto?: string;
  bio?: string;
  friends: number;
  mutualFriends?: number;
  isOnline?: boolean;
  location?: string;
  workplace?: string;
  education?: string;
  relationship?: string;
}

export interface Post {
  id: string;
  userId: string;
  user: User;
  content: string;
  image?: string;
  likes: number;
  comments: Comment[];
  shares: number;
  createdAt: string;
  isLiked: boolean;
}

export interface Comment {
  id: string;
  userId: string;
  user: User;
  content: string;
  createdAt: string;
  likes: number;
}

export interface Story {
  id: string;
  user: User;
  image: string;
  viewed: boolean;
}

export interface Notification {
  id: string;
  type: "like" | "comment" | "friend_request" | "share" | "mention" | "birthday";
  user: User;
  content: string;
  createdAt: string;
  read: boolean;
  postId?: string;
}

export interface Message {
  id: string;
  user: User;
  lastMessage: string;
  createdAt: string;
  unread: number;
  isOnline: boolean;
}

export interface FriendRequest {
  id: string;
  user: User;
  mutualFriends: number;
  createdAt: string;
}

export const currentUser: User = {
  id: "1",
  name: "Alex Johnson",
  avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face",
  coverPhoto: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1200&h=400&fit=crop",
  bio: "Software Developer | Coffee Enthusiast | Adventure Seeker 🌍",
  friends: 847,
  isOnline: true,
  location: "San Francisco, CA",
  workplace: "Tech Company Inc.",
  education: "Stanford University",
  relationship: "Single",
};

export const users: User[] = [
  currentUser,
  {
    id: "2",
    name: "Sarah Williams",
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&h=150&fit=crop&crop=face",
    coverPhoto: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=1200&h=400&fit=crop",
    bio: "Photographer & Nature Lover 📷",
    friends: 1234,
    mutualFriends: 23,
    isOnline: true,
    location: "Seattle, WA",
    workplace: "Freelance Photographer",
  },
  {
    id: "3",
    name: "Michael Chen",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face",
    coverPhoto: "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=1200&h=400&fit=crop",
    bio: "Full Stack Developer | Open Source Contributor",
    friends: 567,
    mutualFriends: 12,
    isOnline: false,
    location: "Austin, TX",
    workplace: "StartupXYZ",
  },
  {
    id: "4",
    name: "Emily Davis",
    avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face",
    coverPhoto: "https://images.unsplash.com/photo-1501785888041-af3ef285b470?w=1200&h=400&fit=crop",
    bio: "Entrepreneur & Startup Founder 🚀",
    friends: 892,
    mutualFriends: 45,
    isOnline: true,
    location: "New York, NY",
    workplace: "TechVentures",
  },
  {
    id: "5",
    name: "James Wilson",
    avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop&crop=face",
    coverPhoto: "https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?w=1200&h=400&fit=crop",
    bio: "Music Producer & DJ 🎵",
    friends: 445,
    mutualFriends: 8,
    isOnline: false,
    location: "Los Angeles, CA",
    workplace: "Independent Artist",
  },
  {
    id: "6",
    name: "Lisa Anderson",
    avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&h=150&fit=crop&crop=face",
    coverPhoto: "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=1200&h=400&fit=crop",
    bio: "Food Blogger & Chef 🍳",
    friends: 678,
    mutualFriends: 15,
    isOnline: true,
    location: "Chicago, IL",
    workplace: "Food Network",
  },
  {
    id: "7",
    name: "David Brown",
    avatar: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150&h=150&fit=crop&crop=face",
    coverPhoto: "https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=1200&h=400&fit=crop",
    bio: "Fitness Coach & Health Advocate 💪",
    friends: 321,
    mutualFriends: 5,
    isOnline: false,
    location: "Miami, FL",
    workplace: "FitLife Gym",
  },
  {
    id: "8",
    name: "Amanda Miller",
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&h=150&fit=crop&crop=face",
    coverPhoto: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=1200&h=400&fit=crop",
    bio: "Travel Blogger ✈️ | 50+ Countries Visited",
    friends: 1456,
    mutualFriends: 67,
    isOnline: true,
    location: "Barcelona, Spain",
    workplace: "Travel Diaries",
  },
];

export const initialPosts: Post[] = [
  {
    id: "1",
    userId: "2",
    user: users[1],
    content: "Just finished an amazing hike at Mount Rainier! The views were absolutely breathtaking. Nature never fails to amaze me. 🏔️ #hiking #nature #adventure",
    image: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=800&h=600&fit=crop",
    likes: 234,
    comments: [
      {
        id: "c1",
        userId: "3",
        user: users[2],
        content: "Wow, this looks incredible! Adding this to my bucket list! 😍",
        createdAt: "2 hours ago",
        likes: 12,
      },
      {
        id: "c2",
        userId: "4",
        user: users[3],
        content: "I went there last summer, it's even more beautiful in person!",
        createdAt: "1 hour ago",
        likes: 5,
      },
    ],
    shares: 45,
    createdAt: "3 hours ago",
    isLiked: false,
  },
  {
    id: "2",
    userId: "4",
    user: users[3],
    content: "Finally launched my new project after months of hard work! 🚀 So grateful for everyone who supported me along the way. This is just the beginning!",
    likes: 567,
    comments: [
      {
        id: "c3",
        userId: "1",
        user: users[0],
        content: "Congratulations! Can't wait to see what you build next! 🎉",
        createdAt: "4 hours ago",
        likes: 23,
      },
    ],
    shares: 89,
    createdAt: "5 hours ago",
    isLiked: true,
  },
  {
    id: "3",
    userId: "3",
    user: users[2],
    content: "Coffee and code - the perfect combination for a productive Sunday morning. ☕💻 What's everyone working on today?",
    image: "https://images.unsplash.com/photo-1461023058943-07fcbe16d735?w=800&h=600&fit=crop",
    likes: 145,
    comments: [],
    shares: 12,
    createdAt: "8 hours ago",
    isLiked: false,
  },
  {
    id: "4",
    userId: "6",
    user: users[5],
    content: "Had the most amazing dinner at this new restaurant downtown! The ambiance was perfect and the food was absolutely delicious. Highly recommend! 🍝✨",
    image: "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=800&h=600&fit=crop",
    likes: 312,
    comments: [
      {
        id: "c4",
        userId: "8",
        user: users[7],
        content: "What's the name of the place? I need to try it!",
        createdAt: "6 hours ago",
        likes: 8,
      },
      {
        id: "c5",
        userId: "6",
        user: users[5],
        content: "@Amanda It's called 'The Golden Fork' - you'll love it!",
        createdAt: "5 hours ago",
        likes: 3,
      },
    ],
    shares: 28,
    createdAt: "Yesterday",
    isLiked: false,
  },
  {
    id: "5",
    userId: "8",
    user: users[7],
    content: "Just adopted this little furball! Meet Luna 🐱 She's already stolen my heart. Any tips for new cat parents?",
    image: "https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?w=800&h=600&fit=crop",
    likes: 892,
    comments: [
      {
        id: "c6",
        userId: "2",
        user: users[1],
        content: "She's adorable! 😻 Make sure to get a good scratching post!",
        createdAt: "10 hours ago",
        likes: 45,
      },
    ],
    shares: 67,
    createdAt: "Yesterday",
    isLiked: true,
  },
];

export const stories: Story[] = [
  {
    id: "s1",
    user: currentUser,
    image: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=700&fit=crop",
    viewed: false,
  },
  {
    id: "s2",
    user: users[1],
    image: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=400&h=700&fit=crop",
    viewed: false,
  },
  {
    id: "s3",
    user: users[3],
    image: "https://images.unsplash.com/photo-1501785888041-af3ef285b470?w=400&h=700&fit=crop",
    viewed: true,
  },
  {
    id: "s4",
    user: users[5],
    image: "https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?w=400&h=700&fit=crop",
    viewed: false,
  },
  {
    id: "s5",
    user: users[7],
    image: "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=400&h=700&fit=crop",
    viewed: true,
  },
];

export const notifications: Notification[] = [
  {
    id: "n1",
    type: "like",
    user: users[1],
    content: "liked your post",
    createdAt: "2 minutes ago",
    read: false,
    postId: "1",
  },
  {
    id: "n2",
    type: "comment",
    user: users[2],
    content: "commented on your photo: \"This is amazing!\"",
    createdAt: "15 minutes ago",
    read: false,
    postId: "2",
  },
  {
    id: "n3",
    type: "friend_request",
    user: users[4],
    content: "sent you a friend request",
    createdAt: "1 hour ago",
    read: false,
  },
  {
    id: "n4",
    type: "share",
    user: users[5],
    content: "shared your post",
    createdAt: "2 hours ago",
    read: true,
    postId: "3",
  },
  {
    id: "n5",
    type: "birthday",
    user: users[6],
    content: "has a birthday today! 🎂",
    createdAt: "5 hours ago",
    read: true,
  },
  {
    id: "n6",
    type: "mention",
    user: users[7],
    content: "mentioned you in a comment",
    createdAt: "Yesterday",
    read: true,
    postId: "4",
  },
  {
    id: "n7",
    type: "like",
    user: users[3],
    content: "and 24 others liked your post",
    createdAt: "Yesterday",
    read: true,
    postId: "5",
  },
];

export const messages: Message[] = [
  {
    id: "m1",
    user: users[1],
    lastMessage: "Hey! Are you coming to the party tonight?",
    createdAt: "2 min",
    unread: 2,
    isOnline: true,
  },
  {
    id: "m2",
    user: users[3],
    lastMessage: "Thanks for your help with the project! 🙌",
    createdAt: "15 min",
    unread: 0,
    isOnline: true,
  },
  {
    id: "m3",
    user: users[2],
    lastMessage: "Did you see the new update?",
    createdAt: "1 hr",
    unread: 1,
    isOnline: false,
  },
  {
    id: "m4",
    user: users[5],
    lastMessage: "Let's catch up soon!",
    createdAt: "3 hr",
    unread: 0,
    isOnline: true,
  },
  {
    id: "m5",
    user: users[7],
    lastMessage: "Check out these travel photos I just posted",
    createdAt: "Yesterday",
    unread: 0,
    isOnline: true,
  },
];

export const friendRequests: FriendRequest[] = [
  {
    id: "fr1",
    user: users[4],
    mutualFriends: 8,
    createdAt: "1 hour ago",
  },
  {
    id: "fr2",
    user: users[6],
    mutualFriends: 5,
    createdAt: "2 days ago",
  },
];

export const friendSuggestions = users.slice(4, 8);

export const userPhotos = [
  "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=300&h=300&fit=crop",
  "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=300&h=300&fit=crop",
  "https://images.unsplash.com/photo-1501785888041-af3ef285b470?w=300&h=300&fit=crop",
  "https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?w=300&h=300&fit=crop",
  "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=300&h=300&fit=crop",
  "https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=300&h=300&fit=crop",
  "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=300&h=300&fit=crop",
  "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=300&h=300&fit=crop",
  "https://images.unsplash.com/photo-1461023058943-07fcbe16d735?w=300&h=300&fit=crop",
];
