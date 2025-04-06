
import { Link, useLocation } from "react-router-dom";

const Navigation = () => {
  const location = useLocation();
  const links = [
    { href: "/", label: "Home" },
    { href: "/about", label: "About" },
    { href: "/projects", label: "Projects" },
    { href: "/blog", label: "Blog" },
    { href: "/gallery", label: "Gallery" },
    { href: "/contact", label: "Contact" },
  ];

  return (
    <nav className="fixed top-0 left-0 right-0 z-40 glass-card py-4">
      <div className="container mx-auto px-4 sm:px-6 flex items-center justify-between">
        <Link to="/" className="text-xl font-display font-bold">
          Portfolio
        </Link>
        <ul className="hidden md:flex space-x-4 sm:space-x-8">
          {links.map((link) => (
            <li key={link.href}>
              <Link
                to={link.href}
                className={`relative py-2 text-sm sm:text-base transition-colors hover:text-primary ${
                  location.pathname === link.href
                    ? "text-primary"
                    : "text-muted-foreground"
                }`}
              >
                {link.label}
                {location.pathname === link.href && (
                  <span className="absolute bottom-0 left-0 w-full h-0.5 bg-primary" />
                )}
              </Link>
            </li>
          ))}
        </ul>
        
        {/* Mobile navigation */}
        <div className="md:hidden">
          <button 
            className="text-muted-foreground hover:text-primary focus:outline-none"
            aria-label="Menu"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="3" y1="12" x2="21" y2="12"></line>
              <line x1="3" y1="6" x2="21" y2="6"></line>
              <line x1="3" y1="18" x2="21" y2="18"></line>
            </svg>
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navigation;