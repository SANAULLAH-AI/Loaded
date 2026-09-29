
import { useCart } from "@/context/CartContext";
import Navbar from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { useNavigate } from "react-router-dom";

const Cart = () => {
  const { cartItems, removeFromCart, updateQuantity, clearCart, getCartTotal } = useCart();
  const navigate = useNavigate();
  
  const handleQuantityChange = (id: number, newQuantity: number) => {
    if (newQuantity >= 1) {
      updateQuantity(id, newQuantity);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Navbar />
      
      <main className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">Shopping Cart</h1>
        
        {cartItems.length === 0 ? (
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6 text-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-20 w-20 mx-auto text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
            </svg>
            <h2 className="text-xl font-semibold mt-4 mb-2">Your cart is empty</h2>
            <p className="text-gray-500 dark:text-gray-400 mb-4">
              Looks like you haven't added any products to your cart yet.
            </p>
            <Button 
              onClick={() => navigate("/")}
              className="btn-primary"
            >
              Start Shopping
            </Button>
          </div>
        ) : (
          <div className="flex flex-col lg:flex-row gap-8">
            <div className="lg:w-8/12">
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm overflow-hidden">
                {cartItems.map((item, index) => (
                  <div key={item.id}>
                    <div className="p-4 sm:p-6 flex flex-col sm:flex-row items-center">
                      <div className="sm:w-20 sm:h-20 w-24 h-24 flex-shrink-0 mb-4 sm:mb-0">
                        <img 
                          src={item.image} 
                          alt={item.title} 
                          className="w-full h-full object-contain"
                        />
                      </div>
                      
                      <div className="sm:ml-6 flex-grow text-center sm:text-left">
                        <h3 className="text-base font-medium text-gray-900 dark:text-white">
                          {item.title}
                        </h3>
                        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                          {item.category}
                        </p>
                      </div>
                      
                      <div className="flex items-center mt-4 sm:mt-0">
                        <div className="flex items-center border border-gray-300 dark:border-gray-600 rounded-md overflow-hidden">
                          <button 
                            className="px-3 py-1 bg-gray-100 dark:bg-gray-700"
                            onClick={() => handleQuantityChange(item.id, item.quantity - 1)}
                          >
                            -
                          </button>
                          <span className="px-4 py-1 text-gray-900 dark:text-gray-100">{item.quantity}</span>
                          <button 
                            className="px-3 py-1 bg-gray-100 dark:bg-gray-700"
                            onClick={() => handleQuantityChange(item.id, item.quantity + 1)}
                          >
                            +
                          </button>
                        </div>
                      </div>
                      
                      <div className="ml-6 flex-shrink-0 text-right">
                        <p className="text-base font-medium text-gray-900 dark:text-white">
                          ${(item.price * item.quantity).toFixed(2)}
                        </p>
                        <button 
                          onClick={() => removeFromCart(item.id)}
                          className="mt-1 text-sm text-red-500 hover:text-red-700"
                        >
                          Remove
                        </button>
                      </div>
                    </div>
                    
                    {index < cartItems.length - 1 && (
                      <Separator />
                    )}
                  </div>
                ))}
              </div>
              
              <div className="mt-4 flex justify-end">
                <Button 
                  variant="outline" 
                  className="text-red-500 hover:text-red-700"
                  onClick={clearCart}
                >
                  Clear Cart
                </Button>
              </div>
            </div>

            <div className="lg:w-4/12">
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Order Summary</h2>
                
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600 dark:text-gray-400">Subtotal ({cartItems.reduce((acc, item) => acc + item.quantity, 0)} items)</span>
                    <span className="font-medium text-gray-900 dark:text-white">${getCartTotal().toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600 dark:text-gray-400">Shipping</span>
                    <span className="font-medium text-gray-900 dark:text-white">$0.00</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600 dark:text-gray-400">Tax</span>
                    <span className="font-medium text-gray-900 dark:text-white">$0.00</span>
                  </div>
                </div>
                
                <Separator className="my-4" />
                
                <div className="flex justify-between">
                  <span className="text-base font-medium text-gray-900 dark:text-white">Total</span>
                  <span className="text-lg font-semibold text-swiftshop-dark-purple">${getCartTotal().toFixed(2)}</span>
                </div>
                
                <Button 
                  className="w-full btn-primary mt-6"
                  onClick={() => navigate("/checkout")}
                >
                  Proceed to Checkout
                </Button>
                
                <Button 
                  variant="outline"
                  className="w-full mt-3"
                  onClick={() => navigate("/")}
                >
                  Continue Shopping
                </Button>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default Cart;
