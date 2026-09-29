
import { useState } from "react";
import Navbar from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";
import { useIsMobile } from "@/hooks/use-mobile";
import { ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";

const Contact = () => {
  const { toast } = useToast();
  const isMobile = useIsMobile();
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate API call
    setTimeout(() => {
      setIsSubmitting(false);
      
      toast({
        title: "Message Sent",
        description: "We've received your message and will get back to you soon.",
      });
      
      // Reset form
      setFormData({
        name: "",
        email: "",
        subject: "",
        message: "",
      });
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Navbar />
      
      <main className="container mx-auto px-4 py-6 md:py-8">
        <div className="flex items-center mb-6">
          <Link to="/profile" className="mr-4">
            <Button variant="ghost" size="sm" className="p-1">
              <ArrowLeft className="h-5 w-5" />
            </Button>
          </Link>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white">Contact Support</h1>
        </div>
        
        <div className="max-w-2xl mx-auto">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-4 md:p-6">
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">
              Have a question or need assistance? Fill out the form below and our team will get back to you as soon as possible.
            </p>
            
            <form onSubmit={handleSubmit} className="space-y-4 md:space-y-6">
              <div className="space-y-2">
                <Label htmlFor="name">Your Name</Label>
                <Input 
                  id="name" 
                  name="name"
                  placeholder="John Doe"
                  value={formData.name}
                  onChange={handleChange} 
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="email">Email Address</Label>
                <Input 
                  id="email" 
                  name="email" 
                  type="email" 
                  placeholder="your@email.com"
                  value={formData.email}
                  onChange={handleChange} 
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="subject">Subject</Label>
                <Input 
                  id="subject" 
                  name="subject" 
                  placeholder="Order Issue, Payment Question, etc."
                  value={formData.subject}
                  onChange={handleChange} 
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="message">Message</Label>
                <Textarea
                  id="message"
                  name="message"
                  placeholder="Please describe your issue in detail..."
                  className="min-h-[120px]"
                  value={formData.message}
                  onChange={handleChange}
                  required
                />
              </div>
              
              <div className="pt-2">
                <Button 
                  type="submit" 
                  className="w-full md:w-auto btn-primary"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? "Sending..." : "Send Message"}
                </Button>
              </div>
            </form>
            
            <div className="mt-8 pt-6 border-t border-gray-200 dark:border-gray-700">
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Other ways to reach us</h3>
              
              <div className="space-y-4">
                <div>
                  <p className="text-sm font-medium text-gray-900 dark:text-white">Customer Support Email</p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">support@swiftshop.com</p>
                </div>
                
                <div>
                  <p className="text-sm font-medium text-gray-900 dark:text-white">Customer Support Phone</p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">+1 (555) 123-4567</p>
                </div>
                
                <div>
                  <p className="text-sm font-medium text-gray-900 dark:text-white">Business Hours</p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Monday to Friday: 9am - 5pm</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Contact;
