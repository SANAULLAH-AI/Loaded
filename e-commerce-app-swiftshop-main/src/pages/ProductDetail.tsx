
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { api } from "@/services/api";
import { useCart, Product } from "@/context/CartContext";
import Navbar from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";

const ProductDetail = () => {
  const { id } = useParams<{ id: string }>();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { addToCart } = useCart();
  const navigate = useNavigate();
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    const fetchProduct = async () => {
      if (!id) return;
      
      try {
        setLoading(true);
        const productId = parseInt(id);
        const productData = await api.getProduct(productId);
        setProduct(productData);
      } catch (err) {
        console.error("Error fetching product:", err);
        setError("Failed to load product details. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  const handleAddToCart = () => {
    if (product) {
      for (let i = 0; i < quantity; i++) {
        addToCart(product);
      }
      navigate("/cart");
    }
  };

  const handleQuantityChange = (newQuantity: number) => {
    if (newQuantity >= 1) {
      setQuantity(newQuantity);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <Navbar />
        <div className="container mx-auto px-4 py-8">
          <div className="flex flex-col md:flex-row gap-8">
            <div className="md:w-1/2">
              <Skeleton className="w-full h-[400px] rounded-lg" />
            </div>
            <div className="md:w-1/2 space-y-4">
              <Skeleton className="h-8 w-3/4" />
              <Skeleton className="h-6 w-1/4" />
              <Skeleton className="h-4 w-1/6" />
              <Skeleton className="h-24 w-full" />
              <div className="flex gap-4">
                <Skeleton className="h-12 w-32" />
                <Skeleton className="h-12 w-48" />
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <Navbar />
        <div className="container mx-auto px-4 py-8">
          <div className="bg-red-50 dark:bg-red-900/20 p-4 rounded-lg text-center">
            <p className="text-red-800 dark:text-red-200">
              {error || "Product not found"}
            </p>
            <Button 
              onClick={() => navigate("/")}
              className="mt-4"
              variant="outline"
            >
              Back to Home
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Navbar />
      
      <main className="container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row gap-8">
          <div className="md:w-1/2 bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm flex items-center justify-center">
            <img 
              src={product.image} 
              alt={product.title} 
              className="max-h-[400px] object-contain"
            />
          </div>
          
          <div className="md:w-1/2">
            <div className="flex flex-wrap gap-2 mb-4">
              <Badge className="bg-swiftshop-purple hover:bg-swiftshop-purple">
                {product.category}
              </Badge>
            </div>
            
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white mb-2">
              {product.title}
            </h1>
            
            <div className="flex items-center mb-4">
              <div className="flex items-center text-yellow-500 mr-2">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
                <span className="font-medium ml-1">{product.rating.rate}</span>
              </div>
              <span className="text-sm text-gray-500 dark:text-gray-400">
                ({product.rating.count} reviews)
              </span>
            </div>
            
            <p className="text-2xl font-bold text-swiftshop-dark-purple mb-4">
              ${product.price.toFixed(2)}
            </p>
            
            <div className="prose dark:prose-invert max-w-none mb-6">
              <p>{product.description}</p>
            </div>
            
            <div className="flex items-center mb-6">
              <p className="mr-4 font-medium">Quantity:</p>
              <div className="flex items-center border border-gray-300 rounded-md overflow-hidden">
                <button 
                  className="px-3 py-1 bg-gray-100 dark:bg-gray-700"
                  onClick={() => handleQuantityChange(quantity - 1)}
                  disabled={quantity <= 1}
                >
                  -
                </button>
                <span className="px-4 py-1">{quantity}</span>
                <button 
                  className="px-3 py-1 bg-gray-100 dark:bg-gray-700"
                  onClick={() => handleQuantityChange(quantity + 1)}
                >
                  +
                </button>
              </div>
            </div>
            
            <div className="flex flex-wrap gap-4">
              <Button 
                className="btn-primary"
                onClick={handleAddToCart}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                </svg>
                Add to Cart
              </Button>
              
              <Button 
                variant="outline"
                onClick={() => navigate("/")}
              >
                Continue Shopping
              </Button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default ProductDetail;
