import { FakeStoreProduct, Product } from "../types/products";
import { products as fallbackProducts } from "../data/products";

const API_URL = "https://fakestoreapi.com/products";
const BACKUP_API_URL = "https://dummyjson.com/products";

// Convert Fake Store API response to our Product format
export const convertFakeStoreProduct = (product: FakeStoreProduct): Product => {
  return {
    id: product.id.toString(),
    name: product.title,
    description: product.description,
    price: product.price,
    category: product.category as any,
    image: product.image,
    inStock: true, // Assuming all products from API are in stock
    rating: product.rating.rate,
    reviews: product.rating.count,
    featured: product.rating.rate >= 4.5, // Mark high-rated products as featured
  };
};

// Convert DummyJSON product to our Product format
export const convertDummyJsonProduct = (product: any): Product => {
  return {
    id: product.id.toString(),
    name: product.title,
    description: product.description,
    price: product.price,
    category: product.category as any,
    image: product.thumbnail || product.images?.[0] || "/placeholder.svg",
    inStock: product.stock > 0,
    rating: product.rating,
    reviews: Math.floor(Math.random() * 200) + 30, // DummyJSON doesn't have reviews count
    featured: product.rating >= 4.5,
  };
};

export const fetchProducts = async (): Promise<Product[]> => {
  try {
    console.log("Trying primary API...");
    // Adding 10 second timeout to prevent hanging
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 10000);
    
    const response = await fetch(API_URL, { 
      signal: controller.signal,
      // Add cache control to prevent cached failed responses
      headers: { 'Cache-Control': 'no-cache' } 
    });
    
    clearTimeout(timeoutId);
    
    if (!response.ok) {
      throw new Error(`Primary API error: ${response.status}`);
    }
    
    const data: FakeStoreProduct[] = await response.json();
    console.log("Primary API successful!", data);
    return data.map(convertFakeStoreProduct);
  } catch (primaryError) {
    console.warn("Primary API failed, trying backup API...", primaryError);
    
    try {
      // Adding 10 second timeout to prevent hanging
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 10000);
      
      const response = await fetch(BACKUP_API_URL, { 
        signal: controller.signal,
        // Add cache control to prevent cached failed responses
        headers: { 'Cache-Control': 'no-cache' } 
      });
      
      clearTimeout(timeoutId);
      
      if (!response.ok) {
        throw new Error(`Backup API error: ${response.status}`);
      }
      
      const data = await response.json();
      console.log("Backup API successful!", data);
      return data.products.map(convertDummyJsonProduct);
    } catch (backupError) {
      console.error("Both APIs failed, using fallback data", backupError);
      console.log("Using fallback data", fallbackProducts);
      return fallbackProducts;
    }
  }
};

export const fetchProductById = async (productId: string): Promise<Product | null> => {
  // Add similar error handling and timeouts as in fetchProducts
  try {
    console.log(`Trying primary API for product ${productId}...`);
    // Adding 10 second timeout to prevent hanging
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 10000);
    
    const response = await fetch(`${API_URL}/${productId}`, { 
      signal: controller.signal,
      headers: { 'Cache-Control': 'no-cache' } 
    });
    
    clearTimeout(timeoutId);
    
    if (!response.ok) {
      throw new Error(`Primary API error: ${response.status}`);
    }
    
    const data: FakeStoreProduct = await response.json();
    return convertFakeStoreProduct(data);
  } catch (primaryError) {
    console.warn(`Primary API failed for product ${productId}, trying backup API...`, primaryError);
    
    try {
      // Adding 10 second timeout to prevent hanging
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 10000);
      
      const response = await fetch(`${BACKUP_API_URL}/${productId}`, { 
        signal: controller.signal,
        headers: { 'Cache-Control': 'no-cache' } 
      });
      
      clearTimeout(timeoutId);
      
      if (!response.ok) {
        throw new Error(`Backup API error: ${response.status}`);
      }
      
      const data = await response.json();
      return convertDummyJsonProduct(data);
    } catch (backupError) {
      console.error(`Both APIs failed for product ${productId}, checking fallback data`, backupError);
      const fallbackProduct = fallbackProducts.find(p => p.id === productId);
      return fallbackProduct || null;
    }
  }
};

export const fetchProductsByCategory = async (category: string): Promise<Product[]> => {
  // Normalize category string for API requests
  const categoryParam = category.toString().toLowerCase();
  
  console.log(`Trying primary API for category ${categoryParam}...`);
  try {
    // Adding 10 second timeout to prevent hanging
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 10000);
    
    const response = await fetch(`${API_URL}/category/${categoryParam}`, { 
      signal: controller.signal,
      headers: { 'Cache-Control': 'no-cache' } 
    });
    
    clearTimeout(timeoutId);
    
    if (!response.ok) {
      throw new Error(`Primary API error: ${response.status}`);
    }
    
    const data: FakeStoreProduct[] = await response.json();
    return data.map(convertFakeStoreProduct);
  } catch (primaryError) {
    console.warn(`Primary API failed for category ${categoryParam}, trying backup API...`, primaryError);
    
    try {
      // Adding 10 second timeout to prevent hanging
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 10000);
      
      const response = await fetch(`${BACKUP_API_URL}/category/${categoryParam}`, { 
        signal: controller.signal,
        headers: { 'Cache-Control': 'no-cache' } 
      });
      
      clearTimeout(timeoutId);
      
      if (!response.ok) {
        throw new Error(`Backup API error: ${response.status}`);
      }
      
      const data = await response.json();
      return data.products.map(convertDummyJsonProduct);
    } catch (backupError) {
      console.error(`Both APIs failed for category ${categoryParam}, using filtered fallback data`, backupError);
      // Filter fallback products case-insensitively
      return fallbackProducts.filter(p => 
        p.category.toLowerCase() === categoryParam.toLowerCase() ||
        p.category.toLowerCase().includes(categoryParam.toLowerCase())
      );
    }
  }
};

export const fetchCategories = async (): Promise<any[]> => {
  // Add similar error handling and timeouts as in fetchProducts
  try {
    console.log("Trying primary API for categories...");
    // Adding 10 second timeout to prevent hanging
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 10000);
    
    const response = await fetch(`${API_URL}/categories`, { 
      signal: controller.signal,
      headers: { 'Cache-Control': 'no-cache' } 
    });
    
    clearTimeout(timeoutId);
    
    if (!response.ok) {
      throw new Error(`Primary API error: ${response.status}`);
    }
    
    const data: string[] = await response.json();
    return data;
  } catch (primaryError) {
    console.warn("Primary API failed for categories, trying backup API...", primaryError);
    
    try {
      // Adding 10 second timeout to prevent hanging
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 10000);
      
      const response = await fetch(`${BACKUP_API_URL}/categories`, { 
        signal: controller.signal,
        headers: { 'Cache-Control': 'no-cache' } 
      });
      
      clearTimeout(timeoutId);
      
      if (!response.ok) {
        throw new Error(`Backup API error: ${response.status}`);
      }
      
      const data = await response.json();
      return data;
    } catch (backupError) {
      console.error("Both APIs failed for categories, using fallback categories", backupError);
      // Extract unique categories from fallback products
      const uniqueCategories = [...new Set(fallbackProducts.map(p => p.category))];
      return uniqueCategories;
    }
  }
};
