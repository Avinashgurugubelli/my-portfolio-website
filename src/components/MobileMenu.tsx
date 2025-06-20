
import { Link } from "react-router-dom";

interface NavLink {
  name: string;
  path: string;
}

interface MobileMenuProps {
  isOpen: boolean;
  navLinks: NavLink[];
  closeMenu: () => void;
  handleNavigation: (path: string) => void;
}

const MobileMenu = ({ isOpen, navLinks, closeMenu, handleNavigation }: MobileMenuProps) => {
  return (
    <div
      className={`fixed inset-0 z-40 bg-background transform transition-transform duration-300 ease-in-out ${
        isOpen ? "translate-x-0" : "translate-x-full"
      } md:hidden`}
    >
      <div className="flex flex-col items-center justify-center h-full space-y-8">
        {navLinks.map((link) => (
          link.path.startsWith("/#") ? (
            <a
              key={link.name}
              href="#"
              className="text-2xl font-medium text-primary/80 hover:text-primary transition-colors"
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
              className="text-2xl font-medium text-primary/80 hover:text-primary transition-colors"
              onClick={closeMenu}
            >
              {link.name}
            </Link>
          )
        ))}
      </div>
    </div>
  );
};

export default MobileMenu;
