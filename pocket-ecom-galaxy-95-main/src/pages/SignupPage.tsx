
import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { ArrowLeft, User, Mail, Lock, BadgeCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "../contexts/AuthContext";

const SignupPage: React.FC = () => {
  const navigate = useNavigate();
  const { signup, isLoading } = useAuth();
  
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    
    try {
      await signup(name, email, username, password);
      navigate("/");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Signup failed");
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
          <CardHeader>
            <CardTitle className="text-2xl text-center font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">Create StyleHub Account</CardTitle>
          </CardHeader>
          
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              {error && (
                <div className="p-3 rounded-md bg-destructive/10 text-destructive text-sm">
                  {error}
                </div>
              )}
              
              <div className="space-y-2">
                <Label htmlFor="name" className="flex items-center gap-1">
                  <BadgeCheck className="h-4 w-4" />
                  Full Name
                </Label>
                <Input
                  id="name"
                  placeholder="John Doe"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  className="border-indigo-200 dark:border-indigo-800 focus-visible:ring-indigo-500"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="email" className="flex items-center gap-1">
                  <Mail className="h-4 w-4" />
                  Email
                </Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="your@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="border-indigo-200 dark:border-indigo-800 focus-visible:ring-indigo-500"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="username" className="flex items-center gap-1">
                  <User className="h-4 w-4" />
                  Username
                </Label>
                <Input
                  id="username"
                  placeholder="johndoe"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                  className="border-indigo-200 dark:border-indigo-800 focus-visible:ring-indigo-500"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="password" className="flex items-center gap-1">
                  <Lock className="h-4 w-4" />
                  Password
                </Label>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  minLength={8}
                  className="border-indigo-200 dark:border-indigo-800 focus-visible:ring-indigo-500"
                />
                <p className="text-xs text-muted-foreground">
                  Password must be at least 8 characters long
                </p>
              </div>
              
              <Button 
                type="submit" 
                className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700" 
                disabled={isLoading}
              >
                {isLoading ? "Creating Account..." : "Sign Up"}
              </Button>
            </form>
          </CardContent>
          
          <CardFooter className="flex justify-center border-t p-4 border-indigo-100 dark:border-indigo-800">
            <p className="text-sm text-muted-foreground">
              Already have an account?{" "}
              <Link 
                to="/login" 
                className="text-indigo-600 hover:text-indigo-500 underline-offset-4 hover:underline"
              >
                Sign in
              </Link>
            </p>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
};

export default SignupPage;
