
import axios from "axios";
import { Product } from "@/context/CartContext";

const BASE_URL = "https://fakestoreapi.com";

export interface OrderData {
  userId: string;
  products: {id: number, quantity: number}[];
  total: number;
  shippingAddress: {
    name: string;
    address: string;
    city: string;
    state: string;
    zipCode: string;
  };
  paymentMethod: string;
  paymentDetails?: any;
  status: string;
}

export interface PaymentDetails {
  transactionId: string;
  amount: number;
  currency: string;
  method: string;
  status: string;
  date: string;
}

// Easy Paisa specific payment interface
export interface EasyPaisaPayment {
  phoneNumber: string;
  amount: number;
  reference: string;
}

export const api = {
  getProducts: async (): Promise<Product[]> => {
    const response = await axios.get(`${BASE_URL}/products`);
    return response.data;
  },
  
  getProduct: async (id: number): Promise<Product> => {
    const response = await axios.get(`${BASE_URL}/products/${id}`);
    return response.data;
  },

  getCategories: async (): Promise<string[]> => {
    const response = await axios.get(`${BASE_URL}/products/categories`);
    return response.data;
  },

  getProductsByCategory: async (category: string): Promise<Product[]> => {
    const response = await axios.get(`${BASE_URL}/products/category/${category}`);
    return response.data;
  },
  
  // New methods for handling orders
  createOrder: async (orderData: OrderData): Promise<{orderId: string}> => {
    // In a real application, this would send data to a backend
    // For now, we'll simulate a successful order creation
    console.log("Creating order with data:", orderData);
    
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Store order in local storage for history
    const ordersJson = localStorage.getItem("orders");
    const orders = ordersJson ? JSON.parse(ordersJson) : [];
    
    const newOrder = {
      ...orderData,
      id: `ORD-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      date: new Date().toISOString(),
    };
    
    orders.push(newOrder);
    localStorage.setItem("orders", JSON.stringify(orders));
    
    // Return a mock order ID (would come from backend in real app)
    return { 
      orderId: newOrder.id
    };
  },
  
  processPayment: async (paymentData: {
    amount: number;
    method: string;
    paymentDetails: any;
  }): Promise<PaymentDetails> => {
    // This would integrate with a real payment gateway in production
    console.log("Processing payment:", paymentData);
    
    // Simulate payment processing delay
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    // Check if the payment is for EasyPaisa (the user's account)
    let statusMessage = "pending";
    let transactionId = `TXN-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
    
    if (paymentData.method === "easypaisa") {
      statusMessage = "success";
      console.log("Payment will be sent to EasyPaisa account: 03251907930");
      
      // In a real implementation, this would call EasyPaisa's API
      // Here we're just simulating the process
      const easyPaisaDetails = {
        recipientNumber: "03251907930",
        amount: paymentData.amount,
        transactionId: transactionId,
        status: "Processing",
        estimatedArrival: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString()
      };
      
      console.log("EasyPaisa transfer details:", easyPaisaDetails);
    }
    
    // Return mock payment result (would come from payment gateway in real app)
    return {
      transactionId,
      amount: paymentData.amount,
      currency: "USD",
      method: paymentData.method,
      status: statusMessage,
      date: new Date().toISOString()
    };
  },
  
  processEasyPaisaPayment: async (paymentData: EasyPaisaPayment): Promise<PaymentDetails> => {
    // This is a specialized method just for EasyPaisa payments
    console.log("Processing EasyPaisa payment to account 03251907930:", paymentData);
    
    // Simulate payment processing delay
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    const transactionId = `EP-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
    
    // Return simulated payment result
    return {
      transactionId,
      amount: paymentData.amount,
      currency: "PKR",
      method: "easypaisa",
      status: "success",
      date: new Date().toISOString()
    };
  },
  
  // Method to get user's order history
  getUserOrders: async (userId: string): Promise<any[]> => {
    // In a real app, this would fetch from a backend API
    // For now, return data from localStorage
    const ordersJson = localStorage.getItem("orders");
    const orders = ordersJson ? JSON.parse(ordersJson) : [];
    return orders;
  }
};
