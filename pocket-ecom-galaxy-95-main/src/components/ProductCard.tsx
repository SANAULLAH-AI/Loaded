
import React from "react";
import { Link } from "react-router-dom";
import { Product } from "../types/products";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Star, Heart, ShoppingCart } from "lucide-react";
import { useCart } from "../contexts/CartContext";
import { formatPrice } from "../utils/format";

interface ProductCardProps {
  product: Product;
}

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const { addToCart } = useCart();
  
  // Calculate discount percentage if original price exists
  const discountPercentage = product.price && product.originalPrice && product.originalPrice > product.price
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0;
  
  return (
    <Card className="h-full flex flex-col overflow-hidden transition-all border-none shadow-sm hover:shadow-md">
      <Link to={`/product/${product.id}`} className="flex-grow">
        <div className="relative pb-[100%] overflow-hidden bg-muted/30">
          {discountPercentage > 0 && (
            <span className="absolute top-2 left-2 discount-badge text-xs px-2 py-1 rounded-full font-bold z-10">
              -{discountPercentage}% OFF
            </span>
          )}
          
          <button 
            className="absolute top-2 right-2 p-1.5 bg-background/80 backdrop-blur-sm rounded-full hover:bg-background border border-border/50 z-10"
            onClick={(e) => {
              e.preventDefault();
              // Add to wishlist functionality would go here
            }}
          >
            <Heart className="h-4 w-4" />
          </button>
          
          <img
            src={product.image}
            alt={product.name}
            className="absolute inset-0 w-full h-full object-cover transition-transform hover:scale-105"
          />
          
          {!product.inStock && (
            <div className="absolute inset-0 bg-background/60 backdrop-blur-[2px] flex items-center justify-center">
              <span className="bg-background/80 text-foreground font-medium px-3 py-1.5 rounded-md text-sm">
                Out of Stock
              </span>
            </div>
          )}
        </div>
        
        <CardContent className="p-3 flex-grow">
          <div className="flex items-center mb-1">
            <div className="flex items-center text-amber-500">
              <Star className="h-3.5 w-3.5 fill-current" />
              <span className="text-xs font-medium ml-1">{product.rating}</span>
            </div>
            <span className="mx-1.5 text-muted-foreground text-xs">•</span>
            <span className="text-xs text-muted-foreground">{product.reviews} reviews</span>
          </div>
          
          <h3 className="font-medium text-base line-clamp-1 mb-1">{product.name}</h3>
          
          <div className="flex items-center">
            <p className="font-semibold text-foreground price-flash">
              {formatPrice(product.price)}
            </p>
            {product.originalPrice && product.originalPrice > 0 && (
              <p className="ml-2 text-xs text-muted-foreground line-through">
                {formatPrice(product.originalPrice)}
              </p>
            )}
          </div>
        </CardContent>
      </Link>
      
      <CardFooter className="p-3 pt-0">
        <Button 
          className="w-full group bg-primary hover:bg-primary/90"
          size="sm"
          disabled={!product.inStock}
          variant={product.inStock ? "default" : "outline"}
          onClick={(e) => {
            e.preventDefault();
            addToCart(product);
          }}
        >
          <ShoppingCart className="mr-2 h-4 w-4 group-hover:animate-pulse" />
          Add to Cart
        </Button>
      </CardFooter>
    </Card>
  );
};

export default ProductCard;
