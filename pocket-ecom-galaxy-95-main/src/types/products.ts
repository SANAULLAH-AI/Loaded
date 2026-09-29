
export type ProductCategory = 
  | "electronics" 
  | "clothing" 
  | "home" 
  | "beauty" 
  | "sports" 
  | "books"
  | "jewelery"
  | "men's clothing"
  | "women's clothing";

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  category: ProductCategory;
  image: string;
  inStock: boolean;
  rating: number;
  reviews: number;
  featured?: boolean;
}

export interface FakeStoreProduct {
  id: number;
  title: string;
  price: number;
  description: string;
  category: string;
  image: string;
  rating: {
    rate: number;
    count: number;
  };
}

export type OrderStatus = 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';

export interface OrderItem {
  productId: string;
  quantity: number;
  price: number;
}

export interface Address {
  street: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
}

export interface Order {
  id: string;
  userId: string;
  products: OrderItem[];
  total: number;
  status: OrderStatus;
  createdAt: string;
  address: Address;
  tracking?: string;
}

export interface UserAddress {
  id: string;
  userId: string;
  isDefault: boolean;
  address: Address;
}

export interface Review {
  id: string;
  userId: string;
  productId: string;
  rating: number;
  comment: string;
  createdAt: string;
  userName: string;
}
