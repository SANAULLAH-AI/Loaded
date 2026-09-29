
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUser } from '@/context/UserContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/components/ui/use-toast';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useUser();
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // Simulate API call delay
    setTimeout(() => {
      const success = login(email, password);
      setIsLoading(false);
      
      if (success) {
        toast({
          title: 'Login Successful',
          description: 'Welcome to Disney+',
        });
        navigate('/profile');
      } else {
        toast({
          title: 'Login Failed',
          description: 'Please check your email and password',
          variant: 'destructive',
        });
      }
    }, 1500);
  };

  return (
    <div 
      className="min-h-screen flex flex-col bg-disney-dark"
      style={{
        backgroundImage: 'url(https://cnbl-cdn.bamgrid.com/assets/bbd3fd226299c684124bc7deef49ed89f7f8682634889b23a8d43b72d28c9336/original)',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
    >
      {/* Header */}
      <header className="p-6">
        <img 
          src="https://cnbl-cdn.bamgrid.com/assets/7ecc8bcb60ad77193058d63e321bd21cbac2fc67281dbd9927676ea4a4c83594/original" 
          alt="Disney+" 
          className="h-10" 
        />
      </header>
      
      {/* Login Form */}
      <div className="flex-grow flex flex-col items-center justify-center px-4">
        <div className="w-full max-w-md bg-black/80 backdrop-blur-sm p-8 rounded-lg shadow-lg">
          <h1 className="text-3xl font-bold mb-6">Log in to Disney+</h1>
          
          <form onSubmit={handleLogin} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                className="bg-disney-gray/50 border-disney-gray"
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                className="bg-disney-gray/50 border-disney-gray"
                required
              />
            </div>
            
            <Button 
              type="submit" 
              className="w-full"
              disabled={isLoading}
            >
              {isLoading ? 'Logging in...' : 'Log In'}
            </Button>
          </form>
          
          <div className="mt-6">
            <p className="text-gray-400 text-sm">
              New to Disney+? <a href="#" className="text-primary hover:underline">Sign up</a>
            </p>
          </div>
        </div>
        
        <div className="mt-8 text-center max-w-md text-sm text-gray-400">
          <p>This is a clone application for demonstration purposes only.</p>
          <p className="mt-2">The real Disney+ service can be found at <a href="https://www.disneyplus.com" className="text-primary hover:underline" target="_blank" rel="noopener noreferrer">disneyplus.com</a></p>
        </div>
      </div>
    </div>
  );
};

export default Login;
