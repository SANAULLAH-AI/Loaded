
import React from "react";
import { Link } from "react-router-dom";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { useQuery } from "@tanstack/react-query";
import { fetchCategories } from "../services/productService";
import { Skeleton } from "@/components/ui/skeleton";

// Default categories in case API fails
const defaultCategories = [
  { id: "electronics", name: "Electronics" },
  { id: "men's clothing", name: "Men's Clothing" },
  { id: "women's clothing", name: "Women's Clothing" },
  { id: "jewelery", name: "Jewelry" }
];

const CategoryList: React.FC = () => {
  const { data: apiCategories, isLoading, error } = useQuery({
    queryKey: ['categories'],
    queryFn: fetchCategories
  });

  // Process categories
  const categories = React.useMemo(() => {
    if (!apiCategories || apiCategories.length === 0) {
      return defaultCategories;
    }
    
    return apiCategories.map(category => {
      if (typeof category === 'string') {
        return {
          id: category,
          name: category
            .split('-')
            .map(word => word.charAt(0).toUpperCase() + word.slice(1))
            .join(' ')
        };
      } else if (typeof category === 'object' && category !== null) {
        return {
          id: category.slug || category.id || category.name,
          name: category.name || category
        };
      }
      
      return {
        id: String(category),
        name: String(category)
      };
    });
  }, [apiCategories]);

  const getCategoryEmoji = (category: string): string => {
    const lowercaseCategory = category.toLowerCase();
    if (lowercaseCategory.includes('electronics')) return '📱';
    if (lowercaseCategory.includes('men')) return '👔';
    if (lowercaseCategory.includes('women')) return '👗';
    if (lowercaseCategory.includes('jewelery')) return '💍';
    if (lowercaseCategory.includes('book')) return '📚';
    if (lowercaseCategory.includes('home')) return '🏠';
    if (lowercaseCategory.includes('beauty')) return '💄';
    if (lowercaseCategory.includes('sport')) return '🏀';
    return '🛒';
  };

  const getCategoryColor = (category: string): string => {
    const lowercaseCategory = category.toLowerCase();
    if (lowercaseCategory.includes('electronics')) return '#2563eb';
    if (lowercaseCategory.includes('men')) return '#475569';
    if (lowercaseCategory.includes('women')) return '#db2777';
    if (lowercaseCategory.includes('jewelery')) return '#f59e0b';
    if (lowercaseCategory.includes('book')) return '#10b981';
    if (lowercaseCategory.includes('home')) return '#7c3aed';
    if (lowercaseCategory.includes('beauty')) return '#ec4899';
    if (lowercaseCategory.includes('sport')) return '#3b82f6';
    return '#6b7280';
  };

  return (
    <div className="bg-white my-2 py-3">
      <div className="px-4 flex justify-between items-center mb-2">
        <h2 className="font-bold text-lg">Categories</h2>
      </div>
      <ScrollArea className="w-full">
        <div className="flex space-x-3 px-4 pb-2">
          {isLoading ? (
            Array(6).fill(0).map((_, index) => (
              <div key={index} className="flex-shrink-0 flex flex-col items-center">
                <Skeleton className="w-16 h-16 rounded-full" />
                <Skeleton className="w-16 h-4 mt-2" />
              </div>
            ))
          ) : (
            categories.map((category) => (
              <Link
                key={category.id}
                to={`/category/${category.id}`}
                className="flex-shrink-0 flex flex-col items-center group"
              >
                <div 
                  className="w-14 h-14 rounded-full flex items-center justify-center mb-1 transition-all transform group-hover:scale-105"
                  style={{ 
                    backgroundColor: `${getCategoryColor(category.name)}20`,
                    color: getCategoryColor(category.name)
                  }}
                >
                  <span className="text-xl">{getCategoryEmoji(category.name)}</span>
                </div>
                <span className="text-xs text-center font-medium group-hover:text-primary transition-colors">{category.name}</span>
              </Link>
            ))
          )}
        </div>
        <ScrollBar orientation="horizontal" />
      </ScrollArea>
    </div>
  );
};

export default CategoryList;
