
import { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { MenuIcon, XIcon } from "lucide-react";
import personalJson from "@/config/personal.json";
import ContactRibbon from "./ContactRibbon";
import MobileMenu from "./MobileMenu";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => {
      const isScrolled = window.scrollY > 10;
      if (isScrolled !== scrolled) {
        setScrolled(isScrolled);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [scrolled]);

  const toggleMenu = () => setIsOpen(!isOpen);

  const navLinks = [
    { name: "Home", path: "/" },
    { name: "About", path: "/#about" },
    { name: "Experience", path: "/#experience" },
    { name: "Skills", path: "/#skills" },
    { name: "Certifications", path: "/#certifications" },
    { name: "Projects", path: "/#projects" },
    { name: "Blogs", path: "/blogs" },
    { name: "Contact", path: "/#contact" },
  ];

  const closeMenu = () => {
    if (isOpen) setIsOpen(false);
  };

  const handleNavigation = (path: string) => {
    closeMenu();
    
    // Fix for navigating to hash links from other pages
    if (path.startsWith('/#') && location.pathname !== '/') {
      navigate('/');
      // Use a small timeout to ensure the navigation completes before scrolling
      setTimeout(() => {
        const element = document.querySelector(path.substring(1));
        if (element) {
          element.scrollIntoView({ behavior: 'smooth' });
        }
      }, 100);
    } 
    // For hash links on the home page
    else if (path.startsWith('/#') && location.pathname === '/') {
      const element = document.querySelector(path.substring(1));
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

  return (
    <>
      <ContactRibbon />
      
      <header
        className={`sticky top-0 left-0 right-0 z-50 transition-all duration-300 ${
          scrolled ? "bg-background/90 backdrop-blur-lg shadow-md" : "bg-transparent"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4 md:py-6">
            <Link
              to="/"
              className="text-xl font-semibold tracking-tight hover:opacity-80 transition-opacity"
              onClick={closeMenu}
            >
              {personalJson.name}
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex space-x-8">
              {navLinks.map((link) => (
                link.path.startsWith("/#") ? (
                  <a
                    key={link.name}
                    href="#"
                    className="text-sm font-medium text-primary/80 hover:text-primary transition-colors relative after:absolute after:bottom-0 after:left-0 after:right-0 after:h-[1px] after:w-0 after:bg-primary after:transition-all hover:after:w-full"
                    onClick={(e) => {
                      e.preventDefault();
                      handleNavigation(link.path);
                    }}
                  >
                    {link.name}
                  </a>
                ) : (
                  <Link
                    key={link.name}
                    to={link.path}
                    className="text-sm font-medium text-primary/80 hover:text-primary transition-colors relative after:absolute after:bottom-0 after:left-0 after:right-0 after:h-[1px] after:w-0 after:bg-primary after:transition-all hover:after:w-full"
                    onClick={closeMenu}
                  >
                    {link.name}
                  </Link>
                )
              ))}
            </nav>

            {/* Mobile Navigation Toggle */}
            <button
              className="md:hidden text-primary/80 hover:text-primary transition-colors"
              onClick={toggleMenu}
              aria-label="Toggle menu"
            >
              {isOpen ? (
                <XIcon className="h-6 w-6" />
              ) : (
                <MenuIcon className="h-6 w-6" />
              )}
            </button>
          </div>
        </div>

        <MobileMenu 
          isOpen={isOpen}
          navLinks={navLinks}
          closeMenu={closeMenu}
          handleNavigation={handleNavigation}
        />
      </header>
    </>
  );
};

export default Navbar;
