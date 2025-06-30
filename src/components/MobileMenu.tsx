
import { XIcon } from "lucide-react";
import { Link } from "react-router-dom";

interface NavLink {
  name: string;
  path: string;
}

interface MobileMenuProps {
  isOpen: boolean;
  navLinks: NavLink[];
  closeMenu: () => void;
  handleNavigation: (path: string, section: string) => void;
}

const MobileMenu = ({ isOpen, navLinks, closeMenu, handleNavigation }: MobileMenuProps) => {
  return (
    <div
      className={`fixed inset-0 z-40 bg-background transform transition-transform duration-300 ease-in-out ${
        isOpen ? "translate-x-0" : "translate-x-full"
      } lg:hidden`}
    >
      {/* Close button */}
      <button
        onClick={closeMenu}
        className="absolute top-4 right-4 p-2 rounded-full bg-accent/70 hover:bg-accent transition-colors"
        aria-label="Close menu"
      >
        <XIcon className="h-6 w-6 text-foreground" />
      </button>
      
      <div className="flex flex-col items-center justify-center min-h-screen space-y-6 px-8 bg-background">
        {navLinks.map((link) => (
          <button
            key={link.name}
            className="text-xl font-medium text-primary/80 hover:text-primary transition-colors py-4 px-6 rounded-lg hover:bg-accent/50 w-full text-center touch-manipulation"
            onClick={() => {
              const section = link.path.startsWith('/#') ? link.path.replace("/#", "") : link.name.toLowerCase();
              handleNavigation(link.path, section);
            }}
          >
            {link.name}
          </button>
        ))}
      </div>
    </div>
  );
};

export default MobileMenu;
