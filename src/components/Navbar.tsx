
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { personalInfo } from "@/config/personal";
import { MenuIcon, XIcon } from "lucide-react";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

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
    { name: "Home", path: "#home" },
    { name: "About", path: "#about" },
    { name: "Experience", path: "#experience" },
    { name: "Skills", path: "#skills" },
    { name: "Projects", path: "#projects" },
    { name: "Contact", path: "#contact" },
  ];

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled ? "bg-background/90 backdrop-blur-lg shadow-md" : "bg-transparent"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-4 md:py-6">
          <Link
            to="/"
            className="text-xl font-semibold tracking-tight hover:opacity-80 transition-opacity"
          >
            {personalInfo.name}
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex space-x-8">
            {navLinks.map((link) => (
              <a
                key={link.name}
                href={link.path}
                className="text-sm font-medium text-primary/80 hover:text-primary transition-colors relative after:absolute after:bottom-0 after:left-0 after:right-0 after:h-[1px] after:w-0 after:bg-primary after:transition-all hover:after:w-full"
              >
                {link.name}
              </a>
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

      {/* Mobile Navigation Menu */}
      <div
        className={`fixed inset-0 z-40 bg-background/95 backdrop-blur-lg transform transition-transform duration-300 ease-in-out ${
          isOpen ? "translate-x-0" : "translate-x-full"
        } md:hidden`}
      >
        <div className="flex flex-col items-center justify-center h-full space-y-8">
          {navLinks.map((link) => (
            <a
              key={link.name}
              href={link.path}
              className="text-2xl font-medium text-primary/80 hover:text-primary transition-colors"
              onClick={() => setIsOpen(false)}
            >
              {link.name}
            </a>
          ))}
        </div>
      </div>
    </header>
  );
};

export default Navbar;
