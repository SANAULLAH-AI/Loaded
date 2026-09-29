
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "@/components/Navbar";
import { useCart } from "@/context/CartContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/components/ui/use-toast";
import { api } from "@/services/api";

interface PaymentMethod {
  id: string;
  name: string;
  icon: string;
}

const paymentMethods: PaymentMethod[] = [
  { id: "credit_card", name: "Credit/Debit Card", icon: "card" },
  { id: "paypal", name: "PayPal", icon: "paypal" },
  { id: "easypaisa", name: "EasyPaisa", icon: "cash" },
  { id: "bank_transfer", name: "Bank Transfer", icon: "cash" },
];

const Checkout = () => {
  const { cartItems, getCartTotal, clearCart } = useCart();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [paymentMethod, setPaymentMethod] = useState("credit_card");
  const [loading, setLoading] = useState(false);
  
  // Form fields
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    address: "",
    city: "",
    state: "",
    zipCode: "",
    cardNumber: "",
    cardName: "",
    expiryDate: "",
    cvv: "",
    easyPaisaNumber: "",
    easyPaisaName: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Basic form validation
    if (!formData.firstName || !formData.lastName || !formData.email || !formData.address) {
      toast({
        title: "Missing Information",
        description: "Please fill out all required fields.",
        variant: "destructive",
      });
      return;
    }
    
    // Payment method specific validation
    if (paymentMethod === "credit_card") {
      if (!formData.cardNumber || !formData.cardName || !formData.expiryDate || !formData.cvv) {
        toast({
          title: "Missing Payment Information",
          description: "Please fill out all payment details.",
          variant: "destructive",
        });
        return;
      }
    } else if (paymentMethod === "easypaisa") {
      if (!formData.easyPaisaNumber || !formData.easyPaisaName) {
        toast({
          title: "Missing EasyPaisa Information",
          description: "Please provide your EasyPaisa number and name.",
          variant: "destructive",
        });
        return;
      }
    }
    
    // Process the order
    setLoading(true);
    
    try {
      // Prepare payment details based on payment method
      const paymentDetails = {
        amount: getCartTotal(),
        method: paymentMethod,
        paymentDetails: paymentMethod === "credit_card" 
          ? {
              cardNumber: formData.cardNumber,
              cardName: formData.cardName,
              expiryDate: formData.expiryDate
            }
          : paymentMethod === "easypaisa" 
          ? {
              number: formData.easyPaisaNumber,
              name: formData.easyPaisaName,
              merchantNumber: "03251907930" // Your EasyPaisa account
            }
          : { type: paymentMethod }
      };
      
      // Process payment
      const paymentResult = await api.processPayment(paymentDetails);
      
      if (paymentResult.status === "success" || paymentResult.status === "pending") {
        // Create order data
        const orderData = {
          userId: "user-" + Math.floor(Math.random() * 1000),
          products: cartItems.map(item => ({ id: item.id, quantity: item.quantity })),
          total: getCartTotal(),
          shippingAddress: {
            name: `${formData.firstName} ${formData.lastName}`,
            address: formData.address,
            city: formData.city,
            state: formData.state,
            zipCode: formData.zipCode,
          },
          paymentMethod,
          paymentDetails: paymentResult,
          status: "confirmed"
        };
        
        // Create order
        const { orderId } = await api.createOrder(orderData);
        
        // Store order in local storage
        const order = {
          id: orderId,
          date: new Date().toISOString(),
          items: cartItems,
          total: getCartTotal(),
          paymentMethod,
          paymentStatus: paymentResult.status,
          shippingInfo: {
            name: `${formData.firstName} ${formData.lastName}`,
            address: formData.address,
            city: formData.city,
            state: formData.state,
            zipCode: formData.zipCode,
          },
        };
        
        const orders = JSON.parse(localStorage.getItem("orders") || "[]");
        orders.push(order);
        localStorage.setItem("orders", JSON.stringify(orders));
        
        clearCart();
        
        toast({
          title: "Order Placed Successfully!",
          description: `Your order #${orderId} has been confirmed.`,
        });
        
        navigate("/order-success", { state: { orderId } });
      } else {
        toast({
          title: "Payment Failed",
          description: "There was an issue processing your payment. Please try again.",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Order processing error:", error);
      toast({
        title: "Order Processing Failed",
        description: "An error occurred while processing your order. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  if (cartItems.length === 0) {
    navigate("/cart");
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Navbar />
      
      <main className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">Checkout</h1>
        
        <form onSubmit={handleSubmit}>
          <div className="flex flex-col lg:flex-row gap-8">
            <div className="lg:w-8/12 space-y-8">
              {/* Shipping Information */}
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
                <h2 className="text-xl font-semibold mb-4">Shipping Information</h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="firstName">First Name *</Label>
                    <Input 
                      id="firstName" 
                      name="firstName" 
                      value={formData.firstName}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="lastName">Last Name *</Label>
                    <Input 
                      id="lastName" 
                      name="lastName" 
                      value={formData.lastName}
                      onChange={handleChange}
                      required
                    />
                  </div>
                </div>
                
                <div className="mt-4 space-y-2">
                  <Label htmlFor="email">Email Address *</Label>
                  <Input 
                    id="email" 
                    name="email" 
                    type="email" 
                    value={formData.email}
                    onChange={handleChange}
                    required
                  />
                </div>
                
                <div className="mt-4 space-y-2">
                  <Label htmlFor="address">Address *</Label>
                  <Textarea 
                    id="address" 
                    name="address" 
                    value={formData.address}
                    onChange={handleChange}
                    required
                  />
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
                  <div className="space-y-2">
                    <Label htmlFor="city">City *</Label>
                    <Input 
                      id="city" 
                      name="city" 
                      value={formData.city}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="state">State *</Label>
                    <Input 
                      id="state" 
                      name="state" 
                      value={formData.state}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="zipCode">ZIP Code *</Label>
                    <Input 
                      id="zipCode" 
                      name="zipCode" 
                      value={formData.zipCode}
                      onChange={handleChange}
                      required
                    />
                  </div>
                </div>
              </div>
              
              {/* Payment Method */}
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
                <h2 className="text-xl font-semibold mb-4">Payment Method</h2>
                
                <RadioGroup value={paymentMethod} onValueChange={setPaymentMethod}>
                  {paymentMethods.map((method) => (
                    <div 
                      key={method.id} 
                      className={`flex items-center p-4 border rounded-lg ${
                        paymentMethod === method.id 
                          ? "border-swiftshop-purple bg-swiftshop-purple/5" 
                          : "border-gray-200 dark:border-gray-700"
                      }`}
                    >
                      <RadioGroupItem value={method.id} id={method.id} />
                      <Label htmlFor={method.id} className="ml-2 flex items-center cursor-pointer">
                        <span className="ml-2">{method.name}</span>
                      </Label>
                    </div>
                  ))}
                </RadioGroup>
                
                {paymentMethod === "credit_card" && (
                  <div className="mt-6 space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="cardNumber">Card Number</Label>
                      <Input 
                        id="cardNumber" 
                        name="cardNumber" 
                        placeholder="1234 5678 9012 3456" 
                        value={formData.cardNumber}
                        onChange={handleChange}
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="cardName">Cardholder Name</Label>
                      <Input 
                        id="cardName" 
                        name="cardName" 
                        placeholder="John Doe" 
                        value={formData.cardName}
                        onChange={handleChange}
                      />
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="expiryDate">Expiry Date</Label>
                        <Input 
                          id="expiryDate" 
                          name="expiryDate" 
                          placeholder="MM/YY" 
                          value={formData.expiryDate}
                          onChange={handleChange}
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="cvv">CVV</Label>
                        <Input 
                          id="cvv" 
                          name="cvv" 
                          placeholder="123" 
                          value={formData.cvv}
                          onChange={handleChange}
                        />
                      </div>
                    </div>
                  </div>
                )}
                
                {paymentMethod === "easypaisa" && (
                  <div className="mt-6 space-y-4">
                    <div className="rounded-md bg-blue-50 dark:bg-blue-900/20 p-4 mb-4">
                      <div className="flex">
                        <div className="flex-shrink-0">
                          <svg className="h-5 w-5 text-blue-400" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2h-1V9z" clipRule="evenodd" />
                          </svg>
                        </div>
                        <div className="ml-3 flex-1 md:flex md:justify-between">
                          <p className="text-sm text-blue-700 dark:text-blue-200">
                            Payment will be transferred to EasyPaisa account: 03251907930
                          </p>
                        </div>
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="easyPaisaNumber">Your EasyPaisa Number</Label>
                      <Input 
                        id="easyPaisaNumber" 
                        name="easyPaisaNumber" 
                        placeholder="03XX XXXXXXX" 
                        value={formData.easyPaisaNumber}
                        onChange={handleChange}
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="easyPaisaName">Account Holder Name</Label>
                      <Input 
                        id="easyPaisaName" 
                        name="easyPaisaName" 
                        placeholder="Your name as registered with EasyPaisa" 
                        value={formData.easyPaisaName}
                        onChange={handleChange}
                      />
                    </div>
                  </div>
                )}
                
                {paymentMethod === "paypal" && (
                  <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                    <p className="text-center text-gray-700 dark:text-gray-300">
                      You will be redirected to PayPal to complete your payment after placing the order.
                    </p>
                  </div>
                )}
                
                {paymentMethod === "bank_transfer" && (
                  <div className="mt-6 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                    <p className="text-gray-700 dark:text-gray-300 mb-2">
                      Please transfer the total amount to the following bank account:
                    </p>
                    <p className="text-gray-700 dark:text-gray-300">Bank: SwiftBank</p>
                    <p className="text-gray-700 dark:text-gray-300">Account Number: 1234567890</p>
                    <p className="text-gray-700 dark:text-gray-300">Routing Number: 987654321</p>
                  </div>
                )}
              </div>
            </div>

            {/* Order Summary */}
            <div className="lg:w-4/12">
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6 sticky top-20">
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Order Summary</h2>
                
                <div className="space-y-3">
                  {cartItems.map((item) => (
                    <div key={item.id} className="flex justify-between text-sm">
                      <span className="text-gray-600 dark:text-gray-400">
                        {item.title} <span className="text-gray-500">x {item.quantity}</span>
                      </span>
                      <span className="font-medium text-gray-900 dark:text-white">
                        ${(item.price * item.quantity).toFixed(2)}
                      </span>
                    </div>
                  ))}
                </div>
                
                <Separator className="my-4" />
                
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600 dark:text-gray-400">Subtotal</span>
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
                  type="submit"
                  className="w-full btn-primary mt-6"
                  disabled={loading}
                >
                  {loading ? (
                    <div className="flex items-center">
                      <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Processing...
                    </div>
                  ) : (
                    "Place Order"
                  )}
                </Button>
                
                <Button 
                  type="button"
                  variant="outline"
                  className="w-full mt-3"
                  onClick={() => navigate("/cart")}
                >
                  Back to Cart
                </Button>
              </div>
            </div>
          </div>
        </form>
      </main>
    </div>
  );
};

export default Checkout;
