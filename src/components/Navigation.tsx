import React, { useState } from 'react';
import { Link, useLocation } from "react-router-dom";
import { Menu, X } from 'lucide-react';

const Navigation = () => {
  const location = useLocation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const links = [
    { href: "/", label: "Home" },
    { href: "/about", label: "About" },
    { href: "/projects", label: "Projects" },
    { href: "/blog", label: "Blog" },
    { href: "/contact", label: "Contact" },
  ];

  return (
    <nav className="fixed top-0 left-0 right-0 z-40 glass-card py-4 backdrop-blur-sm bg-background/80">
      <div className="container mx-auto px-4 sm:px-6 flex items-center justify-between">
        <Link 
          to="/" 
          className="text-xl font-display font-bold transition-transform duration-300 hover:scale-105"
        >
          Portfolio
        </Link>

        {/* Mobile Menu Button */}
        <button 
          className="md:hidden p-2 hover:bg-accent rounded-lg transition-colors"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        >
          {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>

        {/* Desktop Navigation */}
        <ul className="hidden md:flex space-x-8">
          {links.map((link) => (
            <li key={link.href}>
              <Link
                to={link.href}
                className={`relative py-2 text-base transition-all duration-300 hover:text-primary group ${
                  location.pathname === link.href
                    ? "text-primary"
                    : "text-muted-foreground"
                }`}
              >
                {link.label}
                <span 
                  className={`absolute bottom-0 left-0 w-full h-0.5 bg-primary transform transition-all duration-300 ${
                    location.pathname === link.href
                      ? "scale-x-100"
                      : "scale-x-0 group-hover:scale-x-100"
                  }`} 
                />
              </Link>
            </li>
          ))}
        </ul>

        {/* Mobile Navigation */}
        <div 
          className={`md:hidden absolute top-full left-0 right-0 bg-background/95 backdrop-blur-sm transition-all duration-300 ${
            isMenuOpen ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-4 pointer-events-none"
          }`}
        >
          <ul className="px-4 py-4 space-y-4">
            {links.map((link) => (
              <li key={link.href}>
                <Link
                  to={link.href}
                  className={`block py-2 text-lg transition-all duration-300 hover:text-primary ${
                    location.pathname === link.href
                      ? "text-primary"
                      : "text-muted-foreground"
                  }`}
                  onClick={() => setIsMenuOpen(false)}
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Navigation;