
import { useState, useEffect } from "react";
import Navbar from "@/components/Navbar";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { api } from "@/services/api";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface OrderItem {
  id: number;
  title: string;
  price: number;
  quantity: number;
  image: string;
}

interface ShippingInfo {
  name: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
}

interface Order {
  id: number | string;
  date: string;
  items: OrderItem[];
  total: number;
  paymentMethod: string;
  paymentStatus?: string;
  shippingInfo: ShippingInfo;
  status?: string;
}

const Orders = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [activeTab, setActiveTab] = useState<string>("all");
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        setLoading(true);
        // In a real app, this would use a real user ID from auth
        const userId = "user-123";
        // This currently gets from localStorage, but in a real app would come from backend
        const savedOrders = await api.getUserOrders(userId);
        setOrders(savedOrders);
      } catch (error) {
        console.error("Failed to fetch orders:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    }).format(date);
  };

  const getPaymentMethodName = (method: string) => {
    switch (method) {
      case "credit_card":
        return "Credit/Debit Card";
      case "paypal":
        return "PayPal";
      case "easypaisa":
        return "EasyPaisa";
      case "bank_transfer":
        return "Bank Transfer";
      default:
        return method;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "Completed":
      case "completed":
      case "success":
        return <Badge className="bg-green-500 dark:bg-green-700">Completed</Badge>;
      case "Processing":
      case "processing":
      case "pending":
        return <Badge className="bg-yellow-500 dark:bg-yellow-700">Processing</Badge>;
      case "Cancelled":
      case "cancelled":
      case "failed":
        return <Badge className="bg-red-500 dark:bg-red-700">Cancelled</Badge>;
      default:
        return <Badge className="bg-blue-500 dark:bg-blue-700">{status}</Badge>;
    }
  };

  const filteredOrders = activeTab === "all" 
    ? orders 
    : orders.filter(order => {
        const status = order.status || (order.paymentStatus === "success" ? "Completed" : "Processing");
        return status.toLowerCase() === activeTab;
      });

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Navbar />
      
      <main className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">My Orders</h1>
        
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-swiftshop-purple"></div>
          </div>
        ) : orders.length === 0 ? (
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6 text-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-20 w-20 mx-auto text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
            <h2 className="text-xl font-semibold mt-4 mb-2">No orders yet</h2>
            <p className="text-gray-500 dark:text-gray-400 mb-4">
              You haven't placed any orders yet.
            </p>
            <Button 
              onClick={() => navigate("/")}
              className="btn-primary"
            >
              Start Shopping
            </Button>
          </div>
        ) : (
          <>
            <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab} className="mb-6">
              <TabsList className="grid grid-cols-4 sm:w-[400px]">
                <TabsTrigger value="all">All Orders</TabsTrigger>
                <TabsTrigger value="completed">Completed</TabsTrigger>
                <TabsTrigger value="processing">Processing</TabsTrigger>
                <TabsTrigger value="cancelled">Cancelled</TabsTrigger>
              </TabsList>
            </Tabs>
            
            <div className="space-y-6">
              {filteredOrders.map((order) => (
                <div 
                  key={order.id} 
                  className="bg-white dark:bg-gray-800 rounded-lg shadow-sm overflow-hidden"
                >
                  <div className="p-6">
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4">
                      <div>
                        <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                          Order #{typeof order.id === 'number' ? order.id : order.id.substring(0, 8)}
                        </h2>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          Placed on {formatDate(order.date)}
                        </p>
                      </div>
                      {getStatusBadge(order.status || (order.paymentStatus === "success" ? "Completed" : "Processing"))}
                    </div>
                    
                    <Separator className="mb-4" />
                    
                    <div className="space-y-4">
                      {order.items.slice(0, 3).map((item) => (
                        <div key={item.id} className="flex items-center">
                          <div className="w-12 h-12 flex-shrink-0">
                            <img 
                              src={item.image} 
                              alt={item.title} 
                              className="w-full h-full object-contain"
                            />
                          </div>
                          <div className="ml-4 flex-grow">
                            <p className="text-sm font-medium text-gray-900 dark:text-white line-clamp-1">
                              {item.title}
                            </p>
                            <p className="text-xs text-gray-500 dark:text-gray-400">
                              Qty: {item.quantity}
                            </p>
                          </div>
                          <div className="ml-4">
                            <p className="text-sm font-medium text-gray-900 dark:text-white">
                              ${(item.price * item.quantity).toFixed(2)}
                            </p>
                          </div>
                        </div>
                      ))}
                      
                      {order.items.length > 3 && (
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          +{order.items.length - 3} more items
                        </p>
                      )}
                    </div>
                    
                    <Separator className="my-4" />
                    
                    <div className="flex flex-col md:flex-row justify-between">
                      <div className="mb-4 md:mb-0">
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          Shipping Address
                        </p>
                        <p className="text-sm font-medium text-gray-900 dark:text-white">
                          {order.shippingInfo.name}
                        </p>
                        <p className="text-sm text-gray-700 dark:text-gray-300">
                          {`${order.shippingInfo.address}, ${order.shippingInfo.city}, ${order.shippingInfo.state} ${order.shippingInfo.zipCode}`}
                        </p>
                      </div>
                      
                      <div className="mb-4 md:mb-0">
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          Payment Method
                        </p>
                        <p className="text-sm font-medium text-gray-900 dark:text-white">
                          {getPaymentMethodName(order.paymentMethod)}
                        </p>
                        <p className="text-sm text-gray-700 dark:text-gray-300">
                          {order.paymentStatus ? `Status: ${order.paymentStatus}` : ''}
                        </p>
                      </div>
                      
                      <div>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          Total Amount
                        </p>
                        <p className="text-lg font-semibold text-swiftshop-dark-purple">
                          ${order.total.toFixed(2)}
                        </p>
                      </div>
                    </div>
                    
                    <div className="mt-4 flex justify-end space-x-3">
                      {/* Action buttons */}
                      <Button variant="outline" onClick={() => navigate(`/order-details/${order.id}`)}>
                        View Details
                      </Button>
                      {(order.status === 'Processing' || !order.status) && (
                        <Button variant="destructive" onClick={() => alert('This would cancel the order in a real app')}>
                          Cancel Order
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </main>
    </div>
  );
};

export default Orders;
