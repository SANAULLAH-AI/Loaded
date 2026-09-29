
import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { CheckCircle, ShoppingBag, Navigation } from "lucide-react";
import { Button } from "@/components/ui/button";
import { getOrderById } from "../data/orders";

const OrderSuccessPage: React.FC = () => {
  const navigate = useNavigate();
  
  // Get the order ID from session storage or generate a new one if not found
  const orderId = React.useMemo(() => {
    const storedOrderId = sessionStorage.getItem("latest_order_id");
    if (storedOrderId) {
      return storedOrderId;
    }
    return `ORD-${Math.floor(100000 + Math.random() * 900000)}`;
  }, []);
  
  const order = getOrderById(orderId);
  
  // Redirect to home if user refreshes this page
  useEffect(() => {
    const handleBeforeUnload = () => {
      sessionStorage.setItem("visited_success", "true");
    };
    
    window.addEventListener("beforeunload", handleBeforeUnload);
    
    const visited = sessionStorage.getItem("visited_success");
    if (visited) {
      navigate("/");
    }
    
    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
      sessionStorage.removeItem("visited_success");
    };
  }, [navigate]);
  
  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4 text-center">
      <CheckCircle className="h-16 w-16 text-primary mb-4" />
      
      <h1 className="text-2xl font-bold mb-2">Order Confirmed!</h1>
      
      <p className="text-muted-foreground mb-6">
        Thank you for your purchase. Your order has been confirmed.
      </p>
      
      <div className="bg-muted/40 p-4 rounded-md mb-6 w-full max-w-xs">
        <p className="text-sm text-muted-foreground">Order Number</p>
        <p className="font-medium">{orderId}</p>
      </div>
      
      <div className="space-y-4 w-full max-w-xs">
        <Button
          className="w-full bg-primary hover:bg-primary/90 text-primary-foreground group relative overflow-hidden"
          onClick={() => navigate(`/orders/${orderId}`)}
        >
          <div className="absolute inset-0 w-3 bg-white/20 skew-x-[-20deg] group-hover:animate-[slide-in-right_1s_ease-in-out_infinite]"></div>
          <span className="flex items-center justify-center">
            <Navigation className="mr-2 h-4 w-4" />
            Track Your Order
          </span>
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
  );
};

export default OrderSuccessPage;
