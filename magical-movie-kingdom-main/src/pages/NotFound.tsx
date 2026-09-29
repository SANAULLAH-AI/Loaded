
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Home } from 'lucide-react';
import Header from '@/components/Header';

const NotFound = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-disney-dark text-disney-white">
      <Header />
      
      <div className="container mx-auto px-4 pt-32 flex flex-col items-center justify-center text-center">
        <img 
          src="https://static-assets.bamgrid.com/product/disneyplus/images/error.4b3d0101a1e5c5fb39d1c36689b83c07.png"
          alt="404 Error" 
          className="max-w-xs mb-8 w-full"
        />
        
        <h1 className="text-4xl font-bold mb-4">Page Not Found</h1>
        <p className="text-gray-400 max-w-lg mb-6">
          The page you were looking for cannot be found. It might have been removed, had its name changed, or is temporarily unavailable.
        </p>
        
        <div className="flex flex-wrap gap-4 justify-center">
          <Button
            onClick={() => navigate(-1)}
            variant="outline"
            className="flex items-center"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Go Back
          </Button>
          
          <Button
            onClick={() => navigate('/')}
            className="flex items-center"
          >
            <Home className="mr-2 h-4 w-4" />
            Home
          </Button>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
