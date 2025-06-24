import { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { MenuIcon, XIcon } from "lucide-react";
import personalJson from "@/config/personal.json";
import ContactRibbon from "./ContactRibbon";
import MobileMenu from "./MobileMenu";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const toggleMenu = () => setIsOpen(!isOpen);

  const navItems = [
    { name: 'Home', href: '/', section: 'home' },
    { name: 'About', href: '/#about', section: 'about' },
    { name: 'Experience', href: '/#experience', section: 'experience' },
    { name: 'Projects', href: '/#projects', section: 'projects' },
    { name: 'Skills', href: '/#skills', section: 'skills' },
    { name: 'Certifications', href: '/#certifications', section: 'certifications' },
    { name: 'Blog', href: '/blogs', section: 'blogs' },
    { name: 'Nested Blogs', href: '/nested-blogs', section: 'nested-blogs' },
    { name: 'Contact', href: '/#contact', section: 'contact' },
  ];

  const closeMenu = () => {
    if (isOpen) setIsOpen(false);
  };

  const handleNavClick = (e: React.MouseEvent, href: string, section: string) => {
    e.preventDefault();
    closeMenu();
    handleNavigation(href, section);
  };

  const handleNavigation = (path: string, section: string) => {
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

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 0);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="fixed top-0 left-0 right-0 z-50 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      {/* Contact Ribbon */}
      <div className="bg-primary text-primary-foreground py-2 px-4 text-center text-sm">
        <span className="font-medium">Let's connect!</span>
        <a href="mailto:avinash.gurugubelli@gmail.com" className="ml-2 underline hover:no-underline">
          avinash.gurugubelli@gmail.com
        </a>
        <span className="mx-2">|</span>
        <a href="tel:+16145537717" className="underline hover:no-underline">
          +1 (614) 553-7717
        </a>
      </div>
      
      {/* Main Navigation */}
      <nav className={`border-b transition-all duration-300 ${
        isScrolled ? 'border-border/50 shadow-sm' : 'border-border/20'
      }`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link to="/" className="flex items-center space-x-2">
              <span className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                AG
              </span>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden lg:flex items-center space-x-1">
              {navItems.map((item) => (
                <Link
                  key={item.name}
                  to={item.href}
                  onClick={(e) => handleNavClick(e, item.href, item.section)}
                  className="px-3 py-2 rounded-md text-sm font-medium text-foreground/80 hover:text-foreground hover:bg-accent transition-colors"
                >
                  {item.name}
                </Link>
              ))}
            </div>

            {/* Mobile menu button */}
            <MobileMenu />
          </div>
        </div>
      </nav>
    </div>
  );
};

export default Navbar;
