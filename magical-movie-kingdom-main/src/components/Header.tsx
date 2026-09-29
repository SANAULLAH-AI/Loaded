
import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Search, Home, Film, Tv, Star, Download, Menu, X, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useUser } from '@/context/UserContext';
import { cn } from '@/lib/utils';

export const Header = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { currentUser, logout } = useUser();

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 0) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery)}`);
      setSearchQuery('');
      setMobileMenuOpen(false);
    }
  };

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };
  
  const handleNavigation = (path: string) => {
    navigate(path);
    setMobileMenuOpen(false);
  };

  return (
    <header
      className={cn(
        'fixed top-0 w-full z-50 transition-all duration-500 py-4 px-6',
        isScrolled ? 'bg-disney-dark/95 shadow-md' : 'bg-transparent'
      )}
    >
      <div className="container mx-auto flex justify-between items-center">
        {/* Logo */}
        <Link to="/" className="flex-shrink-0">
          <img 
            src="https://cnbl-cdn.bamgrid.com/assets/7ecc8bcb60ad77193058d63e321bd21cbac2fc67281dbd9927676ea4a4c83594/original" 
            alt="Disney+" 
            className="h-10 w-auto" 
          />
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center space-x-6">
          <NavLink to="/" icon={<Home size={16} />} label="Home" active={location.pathname === '/'} />
          <NavLink to="/movies" icon={<Film size={16} />} label="Movies" active={location.pathname === '/movies'} />
          <NavLink to="/series" icon={<Tv size={16} />} label="Series" active={location.pathname === '/series'} />
          <NavLink to="/originals" icon={<Star size={16} />} label="Originals" active={location.pathname === '/originals'} />
        </div>

        {/* Search Form */}
        <form onSubmit={handleSearch} className="hidden md:flex relative ml-4">
          <div className="relative">
            <Input
              type="text"
              placeholder="Search..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-[200px] bg-disney-gray/50 border-disney-gray text-disney-white"
            />
            <Button 
              type="submit" 
              variant="ghost" 
              size="icon" 
              className="absolute right-0 top-0"
            >
              <Search size={16} />
            </Button>
          </div>
        </form>

        {/* User Menu */}
        <div className="hidden md:flex items-center ml-4">
          <Button variant="ghost" onClick={() => navigate('/downloads')} className="mr-4">
            <Download size={20} className="text-disney-white hover:text-primary" />
          </Button>
          
          <Link to={currentUser ? "/profile" : "/login"} className="flex items-center">
            {currentUser ? (
              <div className="flex items-center">
                <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-white">
                  {currentUser.avatar ? (
                    <img 
                      src={`/avatars/${currentUser.avatar}.png`} 
                      alt={currentUser.name}
                      className="w-full h-full rounded-full"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.src = 'https://via.placeholder.com/50?text=' + currentUser.name.charAt(0);
                      }}
                    />
                  ) : (
                    currentUser.name.charAt(0)
                  )}
                </div>
              </div>
            ) : (
              <Button variant="default" size="sm">Login</Button>
            )}
          </Link>
        </div>

        {/* Mobile Menu Button */}
        <button className="md:hidden" onClick={toggleMobileMenu}>
          {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden pt-4 pb-2">
          <nav className="flex flex-col space-y-4 mt-2">
            <MobileNavLink to="/" icon={<Home size={18} />} label="Home" onClick={() => handleNavigation('/')} />
            <MobileNavLink to="/movies" icon={<Film size={18} />} label="Movies" onClick={() => handleNavigation('/movies')} />
            <MobileNavLink to="/series" icon={<Tv size={18} />} label="Series" onClick={() => handleNavigation('/series')} />
            <MobileNavLink to="/originals" icon={<Star size={18} />} label="Originals" onClick={() => handleNavigation('/originals')} />
            <MobileNavLink to="/downloads" icon={<Download size={18} />} label="Downloads" onClick={() => handleNavigation('/downloads')} />
            
            <form onSubmit={handleSearch} className="flex mt-2">
              <Input
                type="text"
                placeholder="Search..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="flex-grow bg-disney-gray/50 border-disney-gray text-disney-white"
              />
              <Button type="submit" size="icon" className="ml-1">
                <Search size={16} />
              </Button>
            </form>
            
            <Link 
              to={currentUser ? "/profile" : "/login"} 
              className="flex items-center py-2"
              onClick={toggleMobileMenu}
            >
              <User size={18} className="mr-2" />
              {currentUser ? currentUser.name : "Login"}
            </Link>
          </nav>
        </div>
      )}
    </header>
  );
};

interface NavLinkProps {
  to: string;
  icon: React.ReactNode;
  label: string;
  active?: boolean;
}

const NavLink = ({ to, icon, label, active }: NavLinkProps) => (
  <Link 
    to={to}
    className={cn(
      "flex items-center transition-colors",
      active ? "text-primary" : "text-disney-white hover:text-primary"
    )}
  >
    {icon}
    <span className="ml-1">{label}</span>
  </Link>
);

const MobileNavLink = ({ 
  to, 
  icon, 
  label,
  onClick 
}: { 
  to: string; 
  icon: React.ReactNode; 
  label: string;
  onClick: () => void;
}) => (
  <Link 
    to={to} 
    className="flex items-center py-2 px-4 text-disney-white hover:bg-disney-gray rounded-md"
    onClick={onClick}
  >
    <span className="mr-2">{icon}</span>
    {label}
  </Link>
);

export default Header;
