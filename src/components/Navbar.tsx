import { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { MenuIcon, XIcon, SearchIcon } from "lucide-react";
import { Input } from "@/components/ui/input";
import ContactRibbon from "./ContactRibbon";
import MobileMenu from "./MobileMenu";
import BlogsJumboMenu from "./BlogsJumboMenu";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [showBlogsMenu, setShowBlogsMenu] = useState(false);
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
    { name: 'Blogs', href: '/blogs', section: 'blogs' },
    { name: 'Contact', href: '/#contact', section: 'contact' },
  ];

  const closeMenu = () => {
    if (isOpen) setIsOpen(false);
  };

  const handleNavClick = (e: React.MouseEvent, href: string, section: string) => {
    e.preventDefault();
    closeMenu();
    
    if (href === '/blogs' || href === '/nested-blogs') {
      navigate(href);
      return;
    }
    
    if (href.startsWith('/#')) {
      if (location.pathname !== '/') {
        navigate('/');
        setTimeout(() => {
          const element = document.querySelector(href.substring(1));
          if (element) {
            element.scrollIntoView({ behavior: 'smooth' });
          }
        }, 100);
      } else {
        const element = document.querySelector(href.substring(1));
        if (element) {
          element.scrollIntoView({ behavior: 'smooth' });
        }
      }
    } else {
      navigate(href);
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/blogs/search?q=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery("");
    }
  };

  const navLinks = navItems.map(item => ({
    name: item.name,
    path: item.href
  }));

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 0);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="fixed top-0 left-0 right-0 z-50 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <ContactRibbon />
      
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

            <div className="hidden lg:flex items-center space-x-4">
              <div className="flex items-center space-x-1">
                {navItems.map((item) => (
                  <div key={item.name} className="relative">
                    {item.name === 'Blogs' ? (
                      <div
                        onMouseEnter={() => setShowBlogsMenu(true)}
                        onMouseLeave={() => setShowBlogsMenu(false)}
                        className="relative"
                      >
                        <Link
                          to={item.href}
                          onClick={(e) => handleNavClick(e, item.href, item.section)}
                          className="px-3 py-2 rounded-md text-sm font-medium text-foreground/80 hover:text-foreground hover:bg-accent transition-colors"
                        >
                          {item.name}
                        </Link>
                        <BlogsJumboMenu isVisible={showBlogsMenu} />
                      </div>
                    ) : (
                      <Link
                        to={item.href}
                        onClick={(e) => handleNavClick(e, item.href, item.section)}
                        className="px-3 py-2 rounded-md text-sm font-medium text-foreground/80 hover:text-foreground hover:bg-accent transition-colors"
                      >
                        {item.name}
                      </Link>
                    )}
                  </div>
                ))}
              </div>

              <form onSubmit={handleSearch} className="flex items-center">
                <div className="relative">
                  <SearchIcon className="absolute left-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    type="text"
                    placeholder="Search blogs..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-8 h-8 w-48 text-sm"
                  />
                </div>
              </form>
            </div>

            <div className="lg:hidden flex items-center gap-2">
              {/* Mobile Search */}
              <form onSubmit={handleSearch} className="flex items-center">
                <div className="relative">
                  <SearchIcon className="absolute left-2 top-1/2 transform -translate-y-1/2 h-3 w-3 text-muted-foreground" />
                  <Input
                    type="text"
                    placeholder="Search..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-7 h-8 w-24 text-xs"
                  />
                </div>
              </form>
              
              {/* Mobile Menu Button */}
              <button
                onClick={toggleMenu}
                className="p-2 rounded-md text-foreground hover:bg-accent touch-manipulation"
                aria-label="Toggle menu"
              >
                {isOpen ? <XIcon className="h-6 w-6" /> : <MenuIcon className="h-6 w-6" />}
              </button>
            </div>
          </div>
        </div>
      </nav>

      <MobileMenu 
        isOpen={isOpen}
        navLinks={navLinks}
        closeMenu={closeMenu}
        handleNavigation={(path: string, section: string) => {
          closeMenu();
          if (path === '/blogs' || path === '/nested-blogs') {
            navigate(path);
          } else if (path.startsWith('/#')) {
            if (location.pathname !== '/') {
              navigate('/');
              setTimeout(() => {
                const element = document.querySelector(path.substring(1));
                if (element) {
                  element.scrollIntoView({ behavior: 'smooth' });
                }
              }, 100);
            } else {
              const element = document.querySelector(path.substring(1));
              if (element) {
                element.scrollIntoView({ behavior: 'smooth' });
              }
            }
          } else {
            navigate(path);
          }
        }}
      />
    </div>
  );
};

export default Navbar;
