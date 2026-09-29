export type User = {
  id: number;
  name: string;
  username?: string;
  email: string;
  address?: {
    street: string;
    suite: string;
    city: string;
    zipcode: string;
    geo: {
      lat: string;
      lng: string;
    };
  };
  phone?: string;
  website?: string;
  company?: {
    name: string;
    catchPhrase: string;
    bs: string;
  };
  photoUrl?: string;
};

export type Post = {
  id: number;
  userId: number;
  title: string;
  body: string;
  user?: User;
  likeCount: number;
  commentCount: number;
  shareCount: number;
  timePosted: string;
  liked: boolean;
  imageUrl: string | null;
};

export type Comment = {
  id: number;
  postId: number;
  name: string;
  email: string;
  body: string;
};