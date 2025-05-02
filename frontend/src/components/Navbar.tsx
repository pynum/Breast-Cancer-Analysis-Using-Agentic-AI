
import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, ChevronDown } from 'lucide-react';

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();
  
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);
  
  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };
  
  const isActive = (path: string) => location.pathname === path;
  
  const navigation = [
    { name: 'Home', href: '/' },
    { name: 'Dashboard', href: '/dashboard' },
    { name: 'Upload', href: '/upload' },
    { name: 'Chat', href: '/chat' },
  ];

  return (
    <nav 
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled ? 'bg-white/80 backdrop-blur-lg shadow-sm' : 'bg-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <Link 
              to="/" 
              className="flex items-center space-x-2"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              <div className="w-8 h-8 rounded-full bg-gradient-to-r from-medical-blue to-medical-lightBlue flex items-center justify-center">
                <span className="text-white font-bold">BC</span>
              </div>
              <span className="font-semibold text-lg">SmartBreastCare</span>
            </Link>
          </div>
          
          {/* Desktop navigation */}
          <div className="hidden md:block">
            <div className="ml-10 flex items-center space-x-8">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  to={item.href}
                  className={`
                    px-3 py-2 text-sm font-medium rounded-md transition-colors
                    ${isActive(item.href) 
                      ? 'text-medical-blue' 
                      : 'text-gray-600 hover:text-medical-blue'}
                  `}
                >
                  {item.name}
                </Link>
              ))}
              {/* <Link
                to="/signin"
                className="px-4 py-2 text-sm font-medium text-white bg-medical-blue rounded-md shadow-sm hover:bg-opacity-90 transition-all"
              >
                Sign In
              </Link> */}
            </div>
          </div>
          
          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={toggleMobileMenu}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-600 hover:text-medical-blue focus:outline-none"
            >
              {isMobileMenuOpen ? (
                <X className="block h-6 w-6" aria-hidden="true" />
              ) : (
                <Menu className="block h-6 w-6" aria-hidden="true" />
              )}
            </button>
          </div>
        </div>
      </div>
      
      {/* Mobile menu */}
      <div 
        className={`
          md:hidden transition-all duration-300 overflow-hidden 
          ${isMobileMenuOpen ? 'max-h-80' : 'max-h-0'}
        `}
      >
        <div className="px-2 pt-2 pb-3 space-y-1 bg-white/80 backdrop-blur-lg shadow-sm">
          {navigation.map((item) => (
            <Link
              key={item.name}
              to={item.href}
              className={`
                block px-3 py-2 rounded-md text-base font-medium 
                ${isActive(item.href) 
                  ? 'text-medical-blue bg-gray-50' 
                  : 'text-gray-600 hover:text-medical-blue hover:bg-gray-50'}
              `}
              onClick={() => setIsMobileMenuOpen(false)}
            >
              {item.name}
            </Link>
          ))}
          {/* <Link
            to="/signin"
            className="block w-full text-center mt-3 px-4 py-2 text-sm font-medium text-white bg-medical-blue rounded-md shadow-sm hover:bg-opacity-90 transition-all"
            onClick={() => setIsMobileMenuOpen(false)}
          >
            Sign In
          </Link> */}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
