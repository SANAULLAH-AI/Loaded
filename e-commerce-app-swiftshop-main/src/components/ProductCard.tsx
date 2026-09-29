
import { Product } from "@/context/CartContext";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { useCart } from "@/context/CartContext";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

interface ProductCardProps {
  product: Product;
}

const ProductCard = ({ product }: ProductCardProps) => {
  const { addToCart } = useCart();
  const navigate = useNavigate();

  const handleAddToCart = (e: React.MouseEvent) => {
    e.stopPropagation();
    addToCart(product);
  };

  return (
    <Card 
      className="product-card h-full flex flex-col cursor-pointer animate-fade-in"
      onClick={() => navigate(`/product/${product.id}`)}
    >
      <div className="relative pt-4 px-4">
        <Badge className="absolute top-2 right-2 bg-swiftshop-purple hover:bg-swiftshop-purple text-white">
          {product.category}
        </Badge>
        <div className="h-48 flex items-center justify-center overflow-hidden mb-4">
          <img 
            src={product.image} 
            alt={product.title} 
            className="max-h-48 object-contain"
          />
        </div>
      </div>
      <CardContent className="flex-grow">
        <div className="mt-2 mb-1 flex items-center">
          <div className="flex items-center text-yellow-500 mr-2">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
            </svg>
            <span className="text-sm font-medium">{product.rating.rate}</span>
          </div>
          <span className="text-xs text-gray-500">({product.rating.count} reviews)</span>
        </div>
        <h3 className="font-semibold text-gray-800 dark:text-gray-100 line-clamp-2 h-12">
          {product.title}
        </h3>
        <p className="mt-2 font-bold text-lg text-swiftshop-dark-purple">
          ${product.price.toFixed(2)}
        </p>
      </CardContent>
      <CardFooter>
        <Button 
          className="w-full btn-primary"
          onClick={handleAddToCart}
        >
          Add to Cart
        </Button>
      </CardFooter>
    </Card>
  );
};

export default ProductCard;
