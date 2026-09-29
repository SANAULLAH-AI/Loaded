
import React from "react";
import { Link } from "react-router-dom";
import { Search, TrendingUp, Gift, Percent, Tag } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Carousel, CarouselContent, CarouselItem } from "@/components/ui/carousel";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import ProductCard from "../components/ProductCard";
import CategoryList from "../components/CategoryList";
import { useQuery } from "@tanstack/react-query";
import { fetchProducts } from "../services/productService";
import { Skeleton } from "@/components/ui/skeleton";

const HomePage: React.FC = () => {
  const { 
    data: products = [], 
    isLoading, 
    error 
  } = useQuery({
    queryKey: ['products'],
    queryFn: fetchProducts
  });
  
  const featuredProducts = products.filter(p => p.featured);
  const newArrivals = products.slice(0, 4);
  const bestSellers = products.sort((a, b) => b.rating - a.rating).slice(0, 4);
  
  return (
    <div className="pb-20 bg-background">
      {/* Header with search */}
      <div className="bg-gradient-to-r from-primary to-secondary p-4">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-3xl font-bold text-white">
            Shoppy
          </h1>
          <Link to="/cart" className="relative">
            <Button size="icon" variant="ghost" className="rounded-full bg-white/20 text-white hover:bg-white/30">
              <span className="sr-only">Shopping Cart</span>
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-6 w-6">
                <circle cx="8" cy="21" r="1" />
                <circle cx="19" cy="21" r="1" />
                <path d="M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.12" />
              </svg>
            </Button>
          </Link>
        </div>
        <Link to="/search">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
            <Input
              className="w-full pl-10 bg-white rounded-full border-white/20"
              placeholder="Search for anything..."
              readOnly
            />
          </div>
        </Link>
      </div>

      {/* Quick action buttons */}
      <div className="px-4 py-3 flex justify-between bg-white">
        <Link to="/category/flash-deals" className="flex flex-col items-center">
          <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center mb-1">
            <Percent className="h-6 w-6 text-primary" />
          </div>
          <span className="text-xs">Flash Deals</span>
        </Link>
        <Link to="/category/new" className="flex flex-col items-center">
          <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center mb-1">
            <Tag className="h-6 w-6 text-blue-500" />
          </div>
          <span className="text-xs">New</span>
        </Link>
        <Link to="/category/popular" className="flex flex-col items-center">
          <div className="w-12 h-12 rounded-full bg-amber-100 flex items-center justify-center mb-1">
            <TrendingUp className="h-6 w-6 text-amber-500" />
          </div>
          <span className="text-xs">Popular</span>
        </Link>
        <Link to="/category/gifts" className="flex flex-col items-center">
          <div className="w-12 h-12 rounded-full bg-purple-100 flex items-center justify-center mb-1">
            <Gift className="h-6 w-6 text-purple-500" />
          </div>
          <span className="text-xs">Gifts</span>
        </Link>
      </div>
      
      {/* Hero carousel */}
      <div className="my-2">
        <Carousel className="w-full">
          <CarouselContent>
            {[
              { 
                title: "MEGA SALE", 
                desc: "Up to 80% OFF", 
                color: "from-red-500 to-pink-500",
                btnText: "Shop Now",
                bgClass: "bg-gradient-to-r"
              },
              { 
                title: "NEW ARRIVALS", 
                desc: "Check out newest items", 
                color: "from-blue-500 to-cyan-400",
                btnText: "Discover",
                bgClass: "bg-gradient-to-r"
              },
              { 
                title: "SPECIAL OFFERS", 
                desc: "Limited time deals", 
                color: "from-purple-500 to-indigo-500",
                btnText: "Get Deals",
                bgClass: "bg-gradient-to-r"
              }
            ].map((item, index) => (
              <CarouselItem key={index}>
                <div className="px-2">
                  <Card className="border-none overflow-hidden promo-card">
                    <CardContent className="p-0">
                      <div className={`${item.bgClass} ${item.color} aspect-[21/9] flex flex-col items-center justify-center p-6 text-center`}>
                        <h3 className="text-2xl font-bold mb-1 text-white">{item.title}</h3>
                        <p className="mb-3 text-white/90 font-semibold">{item.desc}</p>
                        <Button className="bg-white text-foreground hover:bg-white/90">
                          {item.btnText}
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
        </Carousel>
      </div>

      {/* Categories */}
      <CategoryList />
      
      {/* Product sections */}
      <div className="mt-4 mb-6 px-4">
        <div className="flex justify-between items-center mb-3">
          <h2 className="text-lg font-bold flex items-center">
            <span className="mr-2 p-1 bg-red-100 rounded-full">
              <Percent className="h-4 w-4 text-primary" />
            </span>
            Flash Deals
          </h2>
          <Link to="/search" className="text-primary text-sm font-medium">
            More
          </Link>
        </div>
        
        {isLoading ? (
          <div className="grid grid-cols-2 gap-2">
            {Array(4).fill(0).map((_, index) => (
              <div key={index} className="flex flex-col space-y-3">
                <Skeleton className="h-40 w-full rounded-md" />
                <Skeleton className="h-4 w-2/3" />
                <Skeleton className="h-4 w-1/2" />
              </div>
            ))}
          </div>
        ) : error ? (
          <div className="text-center p-4">
            <p className="text-red-500">Failed to load products</p>
            <Button variant="outline" onClick={() => window.location.reload()} className="mt-2">
              Retry
            </Button>
          </div>
        ) : (
          <div className="overflow-x-auto -mx-4 px-4">
            <div className="flex space-x-3" style={{ minWidth: "max-content" }}>
              {featuredProducts.length > 0 ? (
                featuredProducts.slice(0, 6).map(product => (
                  <div key={product.id} className="w-32 flex-shrink-0">
                    <ProductCard product={product} />
                  </div>
                ))
              ) : (
                products.slice(0, 6).map(product => (
                  <div key={product.id} className="w-32 flex-shrink-0">
                    <ProductCard product={product} />
                  </div>
                ))
              )}
            </div>
          </div>
        )}
      </div>

      {/* Product grid */}
      <div className="px-4 mb-6">
        <div className="flex justify-between items-center mb-3">
          <h2 className="text-lg font-bold">Just For You</h2>
        </div>
        
        {isLoading ? (
          <div className="grid grid-cols-2 gap-2">
            {Array(6).fill(0).map((_, index) => (
              <div key={index} className="flex flex-col space-y-3">
                <Skeleton className="h-40 w-full rounded-md" />
                <Skeleton className="h-4 w-2/3" />
                <Skeleton className="h-4 w-1/2" />
              </div>
            ))}
          </div>
        ) : error ? (
          <div className="text-center p-4">
            <p className="text-red-500">Failed to load products</p>
            <Button variant="outline" onClick={() => window.location.reload()} className="mt-2">
              Retry
            </Button>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-2 gap-2">
              {products.slice(0, 6).map(product => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
            <div className="mt-4 text-center">
              <Link to="/search">
                <Button variant="outline" size="sm" className="w-full border-primary text-primary hover:bg-primary/10">
                  View More Products
                </Button>
              </Link>
            </div>
          </>
        )}
      </div>
      
      {/* Promotion Banner */}
      <div className="px-4 mb-8">
        <Card className="overflow-hidden border-none promo-card">
          <CardContent className="p-0">
            <div className="bg-gradient-to-r from-accent to-primary p-4 flex flex-col items-center justify-center">
              <h3 className="text-lg font-bold mb-1 text-white">FREE SHIPPING</h3>
              <p className="text-white/90 text-sm mb-2">For all orders over $50</p>
              <Button className="bg-white text-foreground hover:bg-white/90 text-sm py-1">
                Shop Now
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
      
      {/* Newsletter */}
      <div className="px-4 mb-8 bg-muted/50 py-4">
        <div className="text-center mb-3">
          <h3 className="text-lg font-semibold mb-1">Join Our Newsletter</h3>
          <p className="text-muted-foreground text-xs">Subscribe for exclusive deals & updates</p>
        </div>
        <div className="flex">
          <Input 
            placeholder="Your email" 
            className="rounded-r-none"
          />
          <Button className="rounded-l-none bg-primary">
            Subscribe
          </Button>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
