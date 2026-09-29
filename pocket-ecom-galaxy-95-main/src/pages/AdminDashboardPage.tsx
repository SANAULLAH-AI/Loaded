
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Package, Users, ShoppingBag, Search, Edit2, Trash2, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { useAuth } from "../contexts/AuthContext";
import { Product, ProductCategory } from "../types/products";
import { formatPrice } from "../utils/format";
import { products } from "../data/products";
import { mockOrders } from "../data/orders";
import { toast } from "sonner";

// Admin role check
const isAdmin = (email: string | undefined): boolean => {
  return email === "admin@example.com";
};

const AdminDashboardPage: React.FC = () => {
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();
  
  const [productsList, setProductsList] = useState<Product[]>(products);
  const [activeTab, setActiveTab] = useState("products");
  const [searchQuery, setSearchQuery] = useState("");
  const [isProductFormOpen, setIsProductFormOpen] = useState(false);
  const [currentProduct, setCurrentProduct] = useState<Product | null>(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  
  // Redirect if not admin
  if (!isAuthenticated || !isAdmin(user?.email)) {
    navigate("/");
    return null;
  }
  
  const filteredProducts = productsList.filter(product =>
    product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    product.category.toLowerCase().includes(searchQuery.toLowerCase())
  );
  
  const handleEditProduct = (product: Product) => {
    setCurrentProduct(product);
    setIsProductFormOpen(true);
  };
  
  const handleAddProduct = () => {
    setCurrentProduct(null);
    setIsProductFormOpen(true);
  };
  
  const handleDeleteProduct = (product: Product) => {
    setCurrentProduct(product);
    setIsDeleteDialogOpen(true);
  };
  
  const confirmDeleteProduct = () => {
    if (currentProduct) {
      setProductsList(prevProducts => prevProducts.filter(p => p.id !== currentProduct.id));
      toast.success("Product deleted successfully");
      setIsDeleteDialogOpen(false);
    }
  };
  
  return (
    <div className="pb-20">
      <div className="sticky top-0 bg-background z-10 p-4 flex items-center">
        <Button variant="ghost" size="icon" onClick={() => navigate(-1)}>
          <ArrowLeft />
        </Button>
        <h1 className="text-lg font-semibold ml-2">Admin Dashboard</h1>
      </div>
      
      <div className="p-4">
        <div className="grid grid-cols-3 gap-4 mb-6">
          <Card>
            <CardContent className="p-4 flex flex-col items-center justify-center">
              <Package className="h-8 w-8 text-primary mb-2" />
              <p className="text-sm text-muted-foreground mb-1">Total Products</p>
              <p className="text-2xl font-semibold">{productsList.length}</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4 flex flex-col items-center justify-center">
              <ShoppingBag className="h-8 w-8 text-primary mb-2" />
              <p className="text-sm text-muted-foreground mb-1">Total Orders</p>
              <p className="text-2xl font-semibold">{mockOrders.length}</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4 flex flex-col items-center justify-center">
              <Users className="h-8 w-8 text-primary mb-2" />
              <p className="text-sm text-muted-foreground mb-1">Total Users</p>
              <p className="text-2xl font-semibold">2</p>
            </CardContent>
          </Card>
        </div>
        
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid grid-cols-2 mb-4">
            <TabsTrigger value="products">Products</TabsTrigger>
            <TabsTrigger value="orders">Orders</TabsTrigger>
          </TabsList>
          
          <TabsContent value="products">
            <div className="flex justify-between mb-4">
              <div className="relative flex-1 mr-2">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
                <Input
                  className="pl-10"
                  placeholder="Search products..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <Button onClick={handleAddProduct}>
                <Plus className="h-4 w-4 mr-2" /> Add Product
              </Button>
            </div>
            
            <div className="space-y-4">
              {filteredProducts.map(product => (
                <Card key={product.id} className="overflow-hidden">
                  <div className="flex">
                    <div className="w-20 h-20 bg-muted">
                      <img 
                        src={product.image} 
                        alt={product.name} 
                        className="w-full h-full object-cover"
                      />
                    </div>
                    
                    <div className="p-4 flex-1">
                      <div className="flex justify-between">
                        <div>
                          <h3 className="font-medium">{product.name}</h3>
                          <p className="text-sm text-muted-foreground mb-1">
                            {product.category.charAt(0).toUpperCase() + product.category.slice(1)}
                          </p>
                          <p className="text-sm font-semibold">{formatPrice(product.price)}</p>
                        </div>
                        
                        <div className="flex items-start space-x-2">
                          <Button 
                            variant="ghost" 
                            size="icon"
                            onClick={() => handleEditProduct(product)}
                          >
                            <Edit2 className="h-4 w-4" />
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="icon"
                            onClick={() => handleDeleteProduct(product)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                      
                      <div className="flex mt-2">
                        <Badge variant={product.inStock ? "default" : "destructive"} className="text-xs mr-2">
                          {product.inStock ? "In Stock" : "Out of Stock"}
                        </Badge>
                        {product.featured && (
                          <Badge variant="outline" className="text-xs">
                            Featured
                          </Badge>
                        )}
                      </div>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </TabsContent>
          
          <TabsContent value="orders">
            <div className="space-y-4">
              {mockOrders.map(order => (
                <Card key={order.id} className="p-4">
                  <div className="flex justify-between">
                    <div>
                      <h3 className="font-medium">{order.id}</h3>
                      <p className="text-sm text-muted-foreground">
                        {new Date(order.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                    <Badge
                      className={
                        order.status === "delivered" ? "bg-green-100 text-green-800" :
                        order.status === "shipped" ? "bg-blue-100 text-blue-800" :
                        order.status === "processing" ? "bg-yellow-100 text-yellow-800" :
                        order.status === "cancelled" ? "bg-red-100 text-red-800" :
                        "bg-gray-100 text-gray-800"
                      }
                    >
                      {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                    </Badge>
                  </div>
                  
                  <div className="flex justify-between items-center mt-2">
                    <p className="text-sm">
                      {order.products.reduce((sum, item) => sum + item.quantity, 0)} items
                    </p>
                    <p className="font-semibold">{formatPrice(order.total)}</p>
                  </div>
                  
                  <Button
                    variant="outline"
                    size="sm"
                    className="mt-2 w-full"
                    onClick={() => navigate(`/orders/${order.id}`)}
                  >
                    View Details
                  </Button>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>
      
      {/* Product Form Dialog - Simple version for demo */}
      <Dialog open={isProductFormOpen} onOpenChange={setIsProductFormOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>{currentProduct ? "Edit Product" : "Add Product"}</DialogTitle>
          </DialogHeader>
          
          <div className="grid gap-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="name">Product Name</Label>
              <Input
                id="name"
                defaultValue={currentProduct?.name || ""}
              />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="price">Price</Label>
                <Input
                  id="price"
                  type="number"
                  defaultValue={currentProduct?.price || 0}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="category">Category</Label>
                <Select defaultValue={currentProduct?.category || "electronics"}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="electronics">Electronics</SelectItem>
                    <SelectItem value="clothing">Clothing</SelectItem>
                    <SelectItem value="home">Home</SelectItem>
                    <SelectItem value="beauty">Beauty</SelectItem>
                    <SelectItem value="sports">Sports</SelectItem>
                    <SelectItem value="books">Books</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                rows={3}
                defaultValue={currentProduct?.description || ""}
              />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="rating">Rating</Label>
                <Input
                  id="rating"
                  type="number"
                  min="0"
                  max="5"
                  step="0.1"
                  defaultValue={currentProduct?.rating || 4.5}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="reviews">Number of Reviews</Label>
                <Input
                  id="reviews"
                  type="number"
                  defaultValue={currentProduct?.reviews || 0}
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="image">Image URL</Label>
              <Input
                id="image"
                defaultValue={currentProduct?.image || "/placeholder.svg"}
              />
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <Switch
                  id="inStock"
                  defaultChecked={currentProduct?.inStock ?? true}
                />
                <Label htmlFor="inStock">In Stock</Label>
              </div>
              
              <div className="flex items-center space-x-2">
                <Switch
                  id="featured"
                  defaultChecked={currentProduct?.featured ?? false}
                />
                <Label htmlFor="featured">Featured</Label>
              </div>
            </div>
          </div>
          
          <div className="flex justify-end space-x-2">
            <Button 
              variant="outline" 
              onClick={() => setIsProductFormOpen(false)}
            >
              Cancel
            </Button>
            <Button onClick={() => {
              toast.success(currentProduct ? "Product updated successfully" : "Product added successfully");
              setIsProductFormOpen(false);
            }}>
              {currentProduct ? "Update Product" : "Add Product"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
      
      {/* Delete Confirmation Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Product</DialogTitle>
          </DialogHeader>
          
          <div className="py-4">
            <p>Are you sure you want to delete "{currentProduct?.name}"?</p>
            <p className="text-sm text-muted-foreground mt-1">This action cannot be undone.</p>
          </div>
          
          <div className="flex justify-end space-x-2">
            <Button 
              variant="outline" 
              onClick={() => setIsDeleteDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button 
              variant="destructive" 
              onClick={confirmDeleteProduct}
            >
              Delete
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminDashboardPage;
