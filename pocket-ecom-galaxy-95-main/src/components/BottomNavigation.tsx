
import React from "react";
import { Link, useLocation } from "react-router-dom";
import { Home, Search, ShoppingCart, User, Settings } from "lucide-react";

const BottomNavigation: React.FC = () => {
  const location = useLocation();
  
  const isActive = (path: string) => {
    return location.pathname === path;
  };
  
  return (
    <div className="fixed bottom-0 left-0 right-0 h-16 bg-background/95 backdrop-blur-md border-t border-border/40 flex items-center justify-around z-10">
      <NavItem 
        to="/" 
        icon={<Home />} 
        label="Home" 
        active={isActive("/")} 
      />
      
      <NavItem 
        to="/search" 
        icon={<Search />} 
        label="Search" 
        active={isActive("/search")} 
      />
      
      <NavItem 
        to="/cart" 
        icon={<ShoppingCart />} 
        label="Cart" 
        active={isActive("/cart")} 
      />
      
      <NavItem 
        to="/profile" 
        icon={<User />} 
        label="Profile" 
        active={isActive("/profile")} 
      />

      <NavItem 
        to="/settings" 
        icon={<Settings />} 
        label="Settings" 
        active={isActive("/settings")} 
      />
    </div>
  );
};

type NavItemProps = {
  to: string;
  icon: React.ReactNode;
  label: string;
  active: boolean;
};

const NavItem: React.FC<NavItemProps> = ({ to, icon, label, active }) => {
  return (
    <Link
      to={to}
      className={`flex flex-col items-center justify-center w-1/5 transition-colors ${
        active 
          ? "text-primary" 
          : "text-muted-foreground hover:text-foreground"
      }`}
    >
      <div className={`${active ? "bg-primary/10 text-primary" : ""} p-1.5 rounded-full`}>
        {React.cloneElement(icon as React.ReactElement, {
          size: 20,
          className: active ? "stroke-primary" : "stroke-current"
        })}
      </div>
      <span className="text-xs mt-0.5 font-medium">{label}</span>
    </Link>
  );
};

export default BottomNavigation;
