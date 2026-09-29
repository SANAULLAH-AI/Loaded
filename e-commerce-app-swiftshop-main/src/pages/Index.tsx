
import { useState, useEffect } from "react";
import { api } from "@/services/api";
import { Product } from "@/context/CartContext";
import ProductCard from "@/components/ProductCard";
import Navbar from "@/components/Navbar";
import { Skeleton } from "@/components/ui/skeleton";

const Index = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [productsData, categoriesData] = await Promise.all([
          api.getProducts(),
          api.getCategories()
        ]);
        setProducts(productsData);
        setCategories(categoriesData);
      } catch (err) {
        console.error("Error fetching data:", err);
        setError("Failed to load products. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    const fetchFilteredProducts = async () => {
      if (!selectedCategory) return;
      
      try {
        setLoading(true);
        const filteredProducts = await api.getProductsByCategory(selectedCategory);
        setProducts(filteredProducts);
      } catch (err) {
        console.error("Error fetching filtered products:", err);
        setError("Failed to filter products. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    if (selectedCategory) {
      fetchFilteredProducts();
    }
  }, [selectedCategory]);

  const handleCategoryChange = async (category: string | null) => {
    setSelectedCategory(category);
    
    if (!category) {
      try {
        setLoading(true);
        const allProducts = await api.getProducts();
        setProducts(allProducts);
      } catch (err) {
        console.error("Error fetching all products:", err);
        setError("Failed to load products. Please try again later.");
      } finally {
        setLoading(false);
      }
    }
  };

  const handleSearch = (term: string) => {
    setSearchTerm(term);
  };

  const filteredProducts = products.filter(product => 
    product.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const renderProductSkeletons = () => (
    <>
      {Array(8).fill(0).map((_, index) => (
        <div key={index} className="flex flex-col space-y-3">
          <Skeleton className="h-[180px] w-full rounded-lg" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-2/3" />
          <Skeleton className="h-10 w-full" />
        </div>
      ))}
    </>
  );

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Navbar onSearch={handleSearch} />
      
      <main className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            {selectedCategory ? `${selectedCategory.charAt(0).toUpperCase() + selectedCategory.slice(1)}` : 'All Products'}
          </h1>
        </div>

        <div className="mb-8 overflow-x-auto">
          <div className="flex space-x-2 pb-2">
            <button
              onClick={() => handleCategoryChange(null)}
              className={`px-4 py-2 rounded-md whitespace-nowrap ${
                !selectedCategory 
                  ? "bg-swiftshop-purple text-white" 
                  : "bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-200"
              }`}
            >
              All
            </button>
            {categories.map(category => (
              <button
                key={category}
                onClick={() => handleCategoryChange(category)}
                className={`px-4 py-2 rounded-md whitespace-nowrap ${
                  selectedCategory === category 
                    ? "bg-swiftshop-purple text-white" 
                    : "bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-200"
                }`}
              >
                {category.charAt(0).toUpperCase() + category.slice(1)}
              </button>
            ))}
          </div>
        </div>

        {error ? (
          <div className="bg-red-50 dark:bg-red-900/20 p-4 rounded-lg text-center">
            <p className="text-red-800 dark:text-red-200">{error}</p>
            <button 
              onClick={() => window.location.reload()}
              className="mt-2 px-4 py-2 bg-red-100 dark:bg-red-800 text-red-800 dark:text-red-100 rounded-md"
            >
              Try Again
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {loading 
              ? renderProductSkeletons()
              : filteredProducts.map(product => (
                <ProductCard key={product.id} product={product} />
              ))
            }
            
            {!loading && filteredProducts.length === 0 && (
              <div className="col-span-full text-center py-10">
                <h3 className="text-xl font-medium">No products found</h3>
                <p className="text-gray-500 dark:text-gray-400 mt-2">
                  Try a different search term or category
                </p>
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
};

export default Index;
