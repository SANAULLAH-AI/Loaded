import axios from 'axios';

const apiClient = axios.create({
  baseURL: 'https://jsonplaceholder.typicode.com',
  headers: {
    'Content-Type': 'application/json',
  },
});

export const api = {
  getUsers: async () => {
    try {
      const response = await apiClient.get('/users');
      return response.data;
    } catch (error) {
      console.error('Error fetching users:', error);
      throw error;
    }
  },
  
  getUser: async (id: number) => {
    try {
      const response = await apiClient.get(`/users/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching user ${id}:`, error);
      throw error;
    }
  },
  
  getPosts: async () => {
    try {
      const response = await apiClient.get('/posts');
      return response.data;
    } catch (error) {
      console.error('Error fetching posts:', error);
      throw error;
    }
  },
  
  getUserPosts: async (userId: number) => {
    try {
      const response = await apiClient.get(`/users/${userId}/posts`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching posts for user ${userId}:`, error);
      throw error;
    }
  },
  
  getComments: async (postId: number) => {
    try {
      const response = await apiClient.get(`/posts/${postId}/comments`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching comments for post ${postId}:`, error);
      throw error;
    }
  },
  
  createPost: async (userId: number, title: string, body: string) => {
    try {
      const response = await apiClient.post('/posts', {
        userId,
        title,
        body,
      });
      return response.data;
    } catch (error) {
      console.error('Error creating post:', error);
      throw error;
    }
  },
  
  createComment: async (postId: number, name: string, email: string, body: string) => {
    try {
      const response = await apiClient.post('/comments', {
        postId,
        name,
        email,
        body,
      });
      return response.data;
    } catch (error) {
      console.error('Error creating comment:', error);
      throw error;
    }
  },
};