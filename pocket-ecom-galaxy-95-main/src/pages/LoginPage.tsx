
import React, { useState } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import { ArrowLeft, User, Mail, Lock, UserCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "../contexts/AuthContext";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";

const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { login, guestLogin, isLoading } = useAuth();
  
  const [emailOrUsername, setEmailOrUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  
  const searchParams = new URLSearchParams(location.search);
  const redirectTo = searchParams.get("redirect") || "/";
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    
    try {
      await login(emailOrUsername, password);
      navigate(redirectTo);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Login failed");
    }
  };

  const handleGuestLogin = async () => {
    try {
      await guestLogin();
      navigate(redirectTo);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Guest login failed");
    }
  };
  
  return (
    <div className="min-h-screen flex flex-col p-4 bg-gradient-to-br from-indigo-50 to-purple-50 dark:from-indigo-950 dark:to-purple-950">
      <div className="mb-6">
        <Button variant="ghost" size="icon" onClick={() => navigate(-1)}>
          <ArrowLeft />
        </Button>
      </div>
      
      <div className="flex-1 flex flex-col justify-center max-w-md mx-auto w-full">
        <Card className="border-indigo-100 dark:border-indigo-800 shadow-lg">
          <CardHeader className="pb-4">
            <CardTitle className="text-2xl text-center font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">Welcome to StyleHub</CardTitle>
          </CardHeader>
          
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              {error && (
                <div className="p-3 rounded-md bg-destructive/10 text-destructive text-sm">
                  {error}
                </div>
              )}
              
              <div className="space-y-2">
                <Label htmlFor="emailOrUsername" className="flex items-center gap-1">
                  <User className="h-4 w-4" />
                  Email or Username
                </Label>
                <Input
                  id="emailOrUsername"
                  placeholder="your@email.com or username"
                  value={emailOrUsername}
                  onChange={(e) => setEmailOrUsername(e.target.value)}
                  required
                  className="border-indigo-200 dark:border-indigo-800 focus-visible:ring-indigo-500"
                />
              </div>
              
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="password" className="flex items-center gap-1">
                    <Lock className="h-4 w-4" />
                    Password
                  </Label>
                  <Link 
                    to="/forgot-password" 
                    className="text-sm text-indigo-600 hover:text-indigo-500 underline-offset-4 hover:underline"
                  >
                    Forgot password?
                  </Link>
                </div>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="border-indigo-200 dark:border-indigo-800 focus-visible:ring-indigo-500"
                />
              </div>
              
              <Button type="submit" className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700" disabled={isLoading}>
                {isLoading ? "Signing in..." : "Sign In"}
              </Button>
              
              <div className="relative py-2">
                <Separator />
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="bg-background px-2 text-xs text-muted-foreground">OR</span>
                </div>
              </div>

              <Button 
                type="button" 
                variant="outline" 
                className="w-full border-indigo-200 dark:border-indigo-800 hover:bg-indigo-50 dark:hover:bg-indigo-900"
                onClick={handleGuestLogin}
                disabled={isLoading}
              >
                <UserCircle2 className="mr-2 h-4 w-4" />
                Continue as Guest
              </Button>
              
              <div className="text-center text-sm">
                <p className="text-muted-foreground">
                  For demo, use: user@example.com / password123
                </p>
              </div>
            </form>
          </CardContent>
          
          <CardFooter className="flex justify-center border-t p-4 border-indigo-100 dark:border-indigo-800">
            <p className="text-sm text-muted-foreground">
              Don't have an account?{" "}
              <Link 
                to="/signup" 
                className="text-indigo-600 hover:text-indigo-500 underline-offset-4 hover:underline"
              >
                Sign up
              </Link>
            </p>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
};

export default LoginPage;
