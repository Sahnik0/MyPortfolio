
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
        <ul className="flex space-x-4 sm:space-x-8">
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
      </div>
    </nav>
  );
}

export default Navigation;