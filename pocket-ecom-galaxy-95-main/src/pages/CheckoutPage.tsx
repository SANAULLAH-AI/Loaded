
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, CreditCard, Wallet } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Separator } from "@/components/ui/separator";
import { useCart } from "../contexts/CartContext";
import { useAuth } from "../contexts/AuthContext";
import { formatPrice } from "../utils/format";
import { toast } from "sonner";
import { mockOrders } from "../data/orders";
import { OrderStatus } from "../types/products";

const CheckoutPage: React.FC = () => {
  const navigate = useNavigate();
  const { items, total, clearCart } = useCart();
  const { isAuthenticated, user } = useAuth();
  
  const [formData, setFormData] = useState({
    name: user?.name || "",
    email: user?.email || "",
    address: "",
    city: "",
    state: "",
    zip: "",
    country: "USA",
    paymentMethod: "card"
  });
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  if (!isAuthenticated) {
    navigate("/login?redirect=checkout");
    return null;
  }
  
  if (items.length === 0) {
    navigate("/cart");
    return null;
  }
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  
  const generateOrderId = () => {
    return `ORD-${Math.floor(100000 + Math.random() * 900000)}`;
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Generate order ID
    const orderId = generateOrderId();
    
    // Store order ID in session storage for tracking
    sessionStorage.setItem("latest_order_id", orderId);
    
    // Simulate payment processing
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Create temporary mock order (in real app this would be sent to backend)
    const newOrder = {
      id: orderId,
      userId: user?.id || "",
      products: items.map(item => ({
        productId: item.product.id,
        quantity: item.quantity,
        price: item.product.price
      })),
      total: total,
      status: "processing" as OrderStatus, // Explicitly cast to OrderStatus type
      createdAt: new Date().toISOString(),
      address: {
        street: formData.address,
        city: formData.city,
        state: formData.state,
        zipCode: formData.zip,
        country: formData.country
      },
      tracking: formData.paymentMethod !== "card" ? undefined : `TRK${Math.floor(10000000 + Math.random() * 90000000)}`
    };
    
    // Add order to mock orders (in a real app this would be sent to a backend)
    mockOrders.unshift(newOrder);
    
    clearCart();
    toast.success("Order placed successfully!");
    navigate(`/order-success`);
    setIsSubmitting(false);
  };
  
  return (
    <div className="pb-20">
      <div className="sticky top-0 bg-background z-10 p-4 flex items-center">
        <Button variant="ghost" size="icon" onClick={() => navigate(-1)}>
          <ArrowLeft />
        </Button>
        <h1 className="text-lg font-semibold ml-2">Checkout</h1>
      </div>
      
      <div className="p-4">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <h2 className="font-semibold text-lg mb-4">Shipping Information</h2>
            
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Full Name</Label>
                  <Input
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="address">Address</Label>
                <Input
                  id="address"
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  required
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="city">City</Label>
                  <Input
                    id="city"
                    name="city"
                    value={formData.city}
                    onChange={handleChange}
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="state">State</Label>
                  <Input
                    id="state"
                    name="state"
                    value={formData.state}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="zip">ZIP Code</Label>
                  <Input
                    id="zip"
                    name="zip"
                    value={formData.zip}
                    onChange={handleChange}
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="country">Country</Label>
                  <Input
                    id="country"
                    name="country"
                    value={formData.country}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>
            </div>
          </div>
          
          <Separator />
          
          <div>
            <h2 className="font-semibold text-lg mb-4">Payment Method</h2>
            
            <RadioGroup
              value={formData.paymentMethod}
              onValueChange={(value) => setFormData(prev => ({ ...prev, paymentMethod: value }))}
              className="space-y-2"
            >
              <div className="flex items-center space-x-2 border rounded-md p-3">
                <RadioGroupItem value="card" id="card" />
                <Label htmlFor="card" className="flex items-center">
                  <CreditCard className="h-5 w-5 mr-2" />
                  Credit / Debit Card
                </Label>
              </div>
              
              <div className="flex items-center space-x-2 border rounded-md p-3">
                <RadioGroupItem value="paypal" id="paypal" />
                <Label htmlFor="paypal">PayPal</Label>
              </div>
              
              <div className="flex items-center space-x-2 border rounded-md p-3">
                <RadioGroupItem value="payoneer" id="payoneer" />
                <Label htmlFor="payoneer" className="flex items-center">
                  <Wallet className="h-5 w-5 mr-2" />
                  Payoneer
                </Label>
              </div>
            </RadioGroup>
            
            {formData.paymentMethod === "card" && (
              <div className="mt-4 space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="cardNumber">Card Number</Label>
                  <Input id="cardNumber" placeholder="1234 5678 9012 3456" required />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="expiry">Expiry Date</Label>
                    <Input id="expiry" placeholder="MM/YY" required />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="cvc">CVC</Label>
                    <Input id="cvc" placeholder="123" required />
                  </div>
                </div>
              </div>
            )}

            {formData.paymentMethod === "payoneer" && (
              <div className="mt-4 space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="payoneerEmail">Payoneer Email</Label>
                  <Input id="payoneerEmail" placeholder="your-email@example.com" required={formData.paymentMethod === "payoneer"} />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="payoneerPassword">Password</Label>
                  <Input id="payoneerPassword" type="password" placeholder="******" required={formData.paymentMethod === "payoneer"} />
                </div>
              </div>
            )}
          </div>
          
          <Separator />
          
          <div>
            <h2 className="font-semibold text-lg mb-4">Order Summary</h2>
            
            <div className="space-y-2">
              {items.map(item => (
                <div key={item.product.id} className="flex justify-between">
                  <span>
                    {item.product.name} x {item.quantity}
                  </span>
                  <span>{formatPrice(item.product.price * item.quantity)}</span>
                </div>
              ))}
              
              <Separator className="my-2" />
              
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span>{formatPrice(total)}</span>
              </div>
              
              <div className="flex justify-between">
                <span>Shipping</span>
                <span>{formatPrice(5.99)}</span>
              </div>
              
              <div className="flex justify-between">
                <span>Tax</span>
                <span>{formatPrice(total * 0.08)}</span>
              </div>
              
              <Separator className="my-2" />
              
              <div className="flex justify-between font-semibold text-lg">
                <span>Total</span>
                <span>{formatPrice(total + 5.99 + (total * 0.08))}</span>
              </div>
            </div>
          </div>
          
          <Button
            type="submit"
            className="w-full"
            size="lg"
            disabled={isSubmitting}
          >
            {isSubmitting ? "Processing..." : "Place Order"}
          </Button>
        </form>
      </div>
    </div>
  );
};

export default CheckoutPage;
