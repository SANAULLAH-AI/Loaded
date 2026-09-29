
import { useLocation, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import Navbar from "@/components/Navbar";
import { useEffect, useState } from "react";
import confetti from "canvas-confetti";

const OrderSuccess = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { orderId } = location.state || { orderId: "unknown" };
  const [showConfetti, setShowConfetti] = useState(true);

  useEffect(() => {
    if (showConfetti) {
      // Create confetti effect
      const duration = 3000;
      const animationEnd = Date.now() + duration;
      
      const randomInRange = (min: number, max: number) => {
        return Math.random() * (max - min) + min;
      };
      
      const interval = setInterval(() => {
        const timeLeft = animationEnd - Date.now();
        
        if (timeLeft <= 0) {
          clearInterval(interval);
          setShowConfetti(false);
          return;
        }
        
        confetti({
          particleCount: 2,
          startVelocity: 30,
          spread: 360,
          origin: {
            x: randomInRange(0.1, 0.9),
            y: randomInRange(0.1, 0.9)
          }
        });
      }, 250);
      
      return () => clearInterval(interval);
    }
  }, [showConfetti]);
  
  // Get current date in a nice format
  const orderDate = new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  }).format(new Date());

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Navbar />
      
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto bg-white dark:bg-gray-800 rounded-lg shadow-sm p-8">
          <div className="w-20 h-20 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-green-600 dark:text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-3 text-center">Thank you for your order!</h1>
          
          <p className="text-gray-600 dark:text-gray-300 mb-6 text-center">
            Your order #{orderId} has been successfully placed.
          </p>
          
          <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-6 mb-6">
            <h2 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
              Order Information
            </h2>
            
            <div className="flex flex-col sm:flex-row justify-between mb-3">
              <span className="text-sm text-gray-500 dark:text-gray-400 mb-1 sm:mb-0">
                Order Number
              </span>
              <span className="text-sm font-medium text-gray-900 dark:text-white">
                #{orderId}
              </span>
            </div>
            
            <div className="flex flex-col sm:flex-row justify-between mb-3">
              <span className="text-sm text-gray-500 dark:text-gray-400 mb-1 sm:mb-0">
                Date
              </span>
              <span className="text-sm font-medium text-gray-900 dark:text-white">
                {orderDate}
              </span>
            </div>
            
            <div className="flex flex-col sm:flex-row justify-between">
              <span className="text-sm text-gray-500 dark:text-gray-400 mb-1 sm:mb-0">
                Payment Status
              </span>
              <span className="text-sm font-medium text-green-600 dark:text-green-400">
                Successful
              </span>
            </div>
          </div>
          
          <p className="text-gray-600 dark:text-gray-300 mb-8 text-center">
            We've sent a confirmation email with your order details.
            You can also track your order status on the orders page.
          </p>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Button 
              className="btn-primary w-full"
              onClick={() => navigate("/orders")}
            >
              View Order Status
            </Button>
            
            <Button 
              variant="outline"
              className="w-full"
              onClick={() => navigate("/")}
            >
              Continue Shopping
            </Button>
          </div>
        </div>
      </main>
    </div>
  );
};

export default OrderSuccess;
